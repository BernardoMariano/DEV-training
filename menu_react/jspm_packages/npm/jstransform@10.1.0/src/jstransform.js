/* */ 
"use strict";
var esprima = require("esprima-fb");
var utils = require("./utils");
var getBoundaryNode = utils.getBoundaryNode;
var declareIdentInScope = utils.declareIdentInLocalScope;
var initScopeMetadata = utils.initScopeMetadata;
var Syntax = esprima.Syntax;
function _nodeIsClosureScopeBoundary(node, parentNode) {
  if (node.type === Syntax.Program) {
    return true;
  }
  var parentIsFunction = parentNode.type === Syntax.FunctionDeclaration || parentNode.type === Syntax.FunctionExpression || parentNode.type === Syntax.ArrowFunctionExpression;
  var parentIsCurlylessArrowFunc = parentNode.type === Syntax.ArrowFunctionExpression && node === parentNode.body;
  return parentIsFunction && (node.type === Syntax.BlockStatement || parentIsCurlylessArrowFunc);
}
function _nodeIsBlockScopeBoundary(node, parentNode) {
  if (node.type === Syntax.Program) {
    return false;
  }
  return node.type === Syntax.BlockStatement && parentNode.type === Syntax.CatchClause;
}
function traverse(node, path, state) {
  var startIndex = null;
  var parentNode = path[0];
  if (!Array.isArray(node) && state.localScope.parentNode !== parentNode) {
    if (_nodeIsClosureScopeBoundary(node, parentNode)) {
      var scopeIsStrict = state.scopeIsStrict;
      if (!scopeIsStrict && (node.type === Syntax.BlockStatement || node.type === Syntax.Program)) {
        scopeIsStrict = node.body.length > 0 && node.body[0].type === Syntax.ExpressionStatement && node.body[0].expression.type === Syntax.Literal && node.body[0].expression.value === 'use strict';
      }
      if (node.type === Syntax.Program) {
        startIndex = state.g.buffer.length;
        state = utils.updateState(state, {scopeIsStrict: scopeIsStrict});
      } else {
        startIndex = state.g.buffer.length + 1;
        state = utils.updateState(state, {
          localScope: {
            parentNode: parentNode,
            parentScope: state.localScope,
            identifiers: {},
            tempVarIndex: 0,
            tempVars: []
          },
          scopeIsStrict: scopeIsStrict
        });
        declareIdentInScope('arguments', initScopeMetadata(node), state);
        if (parentNode.params.length > 0) {
          var param;
          var metadata = initScopeMetadata(parentNode, path.slice(1), path[0]);
          for (var i = 0; i < parentNode.params.length; i++) {
            param = parentNode.params[i];
            if (param.type === Syntax.Identifier) {
              declareIdentInScope(param.name, metadata, state);
            }
          }
        }
        if (parentNode.rest) {
          var metadata = initScopeMetadata(parentNode, path.slice(1), path[0]);
          declareIdentInScope(parentNode.rest.name, metadata, state);
        }
        if (parentNode.type === Syntax.FunctionExpression && parentNode.id) {
          var metaData = initScopeMetadata(parentNode, path.parentNodeslice, parentNode);
          declareIdentInScope(parentNode.id.name, metaData, state);
        }
      }
      collectClosureIdentsAndTraverse(node, path, state);
    }
    if (_nodeIsBlockScopeBoundary(node, parentNode)) {
      startIndex = state.g.buffer.length;
      state = utils.updateState(state, {localScope: {
          parentNode: parentNode,
          parentScope: state.localScope,
          identifiers: {},
          tempVarIndex: 0,
          tempVars: []
        }});
      if (parentNode.type === Syntax.CatchClause) {
        var metadata = initScopeMetadata(parentNode, path.slice(1), parentNode);
        declareIdentInScope(parentNode.param.name, metadata, state);
      }
      collectBlockIdentsAndTraverse(node, path, state);
    }
  }
  function traverser(node, path, state) {
    node.range && utils.catchup(node.range[0], state);
    traverse(node, path, state);
    node.range && utils.catchup(node.range[1], state);
  }
  utils.analyzeAndTraverse(walker, traverser, node, path, state);
  if (startIndex !== null) {
    utils.injectTempVarDeclarations(state, startIndex);
  }
}
function collectClosureIdentsAndTraverse(node, path, state) {
  utils.analyzeAndTraverse(visitLocalClosureIdentifiers, collectClosureIdentsAndTraverse, node, path, state);
}
function collectBlockIdentsAndTraverse(node, path, state) {
  utils.analyzeAndTraverse(visitLocalBlockIdentifiers, collectBlockIdentsAndTraverse, node, path, state);
}
function visitLocalClosureIdentifiers(node, path, state) {
  var metaData;
  switch (node.type) {
    case Syntax.ArrowFunctionExpression:
    case Syntax.FunctionExpression:
      return false;
    case Syntax.ClassDeclaration:
    case Syntax.ClassExpression:
    case Syntax.FunctionDeclaration:
      if (node.id) {
        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
        declareIdentInScope(node.id.name, metaData, state);
      }
      return false;
    case Syntax.VariableDeclarator:
      if (path[0].kind === 'var') {
        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
        declareIdentInScope(node.id.name, metaData, state);
      }
      break;
  }
}
function visitLocalBlockIdentifiers(node, path, state) {
  if (node.type === Syntax.CatchClause) {
    return false;
  }
}
function walker(node, path, state) {
  var visitors = state.g.visitors;
  for (var i = 0; i < visitors.length; i++) {
    if (visitors[i].test(node, path, state)) {
      return visitors[i](traverse, node, path, state);
    }
  }
}
var _astCache = {};
function getAstForSource(source, options) {
  if (_astCache[source] && !options.disableAstCache) {
    return _astCache[source];
  }
  var ast = esprima.parse(source, {
    comment: true,
    loc: true,
    range: true,
    sourceType: options.sourceType
  });
  if (!options.disableAstCache) {
    _astCache[source] = ast;
  }
  return ast;
}
function transform(visitors, source, options) {
  options = options || {};
  var ast;
  try {
    ast = getAstForSource(source, options);
  } catch (e) {
    e.message = 'Parse Error: ' + e.message;
    throw e;
  }
  var state = utils.createState(source, ast, options);
  state.g.visitors = visitors;
  if (options.sourceMap) {
    var SourceMapGenerator = require("source-map").SourceMapGenerator;
    state.g.sourceMap = new SourceMapGenerator({file: options.filename || 'transformed.js'});
  }
  traverse(ast, [], state);
  utils.catchup(source.length, state);
  var ret = {
    code: state.g.buffer,
    extra: state.g.extra
  };
  if (options.sourceMap) {
    ret.sourceMap = state.g.sourceMap;
    ret.sourceMapFilename = options.filename || 'source.js';
  }
  return ret;
}
exports.transform = transform;
exports.Syntax = Syntax;
