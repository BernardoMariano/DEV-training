/* */ 
"format cjs";
(function(process) {
  define(["./core"], function(jQuery) {
    var docElem = window.document.documentElement,
        selector_hasDuplicate,
        matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector,
        selector_sortOrder = function(a, b) {
          if (a === b) {
            selector_hasDuplicate = true;
            return 0;
          }
          var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);
          if (compare) {
            if (compare & 1) {
              if (a === document || jQuery.contains(document, a)) {
                return -1;
              }
              if (b === document || jQuery.contains(document, b)) {
                return 1;
              }
              return 0;
            }
            return compare & 4 ? -1 : 1;
          }
          return a.compareDocumentPosition ? -1 : 1;
        };
    jQuery.extend({
      find: function(selector, context, results, seed) {
        var elem,
            nodeType,
            i = 0;
        results = results || [];
        context = context || document;
        if (!selector || typeof selector !== "string") {
          return results;
        }
        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
          return [];
        }
        if (seed) {
          while ((elem = seed[i++])) {
            if (jQuery.find.matchesSelector(elem, selector)) {
              results.push(elem);
            }
          }
        } else {
          jQuery.merge(results, context.querySelectorAll(selector));
        }
        return results;
      },
      unique: function(results) {
        var elem,
            duplicates = [],
            i = 0,
            j = 0;
        selector_hasDuplicate = false;
        results.sort(selector_sortOrder);
        if (selector_hasDuplicate) {
          while ((elem = results[i++])) {
            if (elem === results[i]) {
              j = duplicates.push(i);
            }
          }
          while (j--) {
            results.splice(duplicates[j], 1);
          }
        }
        return results;
      },
      text: function(elem) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;
        if (!nodeType) {
          while ((node = elem[i++])) {
            ret += jQuery.text(node);
          }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
          return elem.textContent;
        } else if (nodeType === 3 || nodeType === 4) {
          return elem.nodeValue;
        }
        return ret;
      },
      contains: function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && adown.contains(bup));
      },
      isXMLDoc: function(elem) {
        return (elem.ownerDocument || elem).documentElement.nodeName !== "HTML";
      },
      expr: {
        attrHandle: {},
        match: {
          bool: /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i,
          needsContext: /^[\x20\t\r\n\f]*[>+~]/
        }
      }
    });
    jQuery.extend(jQuery.find, {
      matches: function(expr, elements) {
        return jQuery.find(expr, null, null, elements);
      },
      matchesSelector: function(elem, expr) {
        return matches.call(elem, expr);
      },
      attr: function(elem, name) {
        return elem.getAttribute(name);
      }
    });
  });
})(require("process"));
