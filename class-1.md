# 1. Engine

Existe um padrão a ser seguidos pelos desenvolvedores das engines, mas como são projetos e equipes diferentes, acabam saindo algumas particularidades entre cada uma, por isso o resultado da página varia, principalmente tratando-se de CSS :D
Alguns exemplos:
- No FF, a regra LINE-HEIGHT não afeta o padding de elementos INLINE
- O IE7 não suporta BORDER-RADIUS e MIN-HEIGHT e nem LIST-STYLE-IMAGE se os LIs estiverem com algum FLOAT
Por essas e outras, usamos o normalize.css e o reset.css

# 2. W3C/WHATWG

O World Wide Web Consortium (W3C) "é uma comunidade internacional que desenvolve padrões com o objetivo de garantir o crescimento da web, (...) e conduzí-la ao seu potencial máximo."
Ou seja, o W3C é o órgão que, internamente, discute e produz protocolos e diretrizes que garantam o crescimento a longo prazo da web.
Já o Web Hypertext Application Technology Working Group (WHATWG) foi criado por Ian Hickson, insatisfeito com a lentidão e formato de discussão do W3C. Qualquer um pode se voluntariar ao WHATWG, e sua principal premissa é dar a merecida importância ao HTML, que algumas pessoas não estavam sentindo pelo W3C.

# 3. WebKit x Gecko

Ambos seguem basicamente o memso fluxo, com algumas diferenças de nomenclaturas, como por exemplo:
	1. Fluxo da Árvore de Renderização:
		- Gecko: Frame Tree
		- WebKit: Render Tree

	2. Elementos da Árvore:
		- Gecko: Frames
		- WebKit: Render Objects

	3. Posicionamento de Elementos:
		- Gecko: Reflow
		- WebKit: Layout

Outra diferença é que o WebKit possui um passo no fluxo chamado de "Attachment", que é o momento em que ele insere ("atacha") os nodes no DOM.
Já o Gecko, tem uma particularidade, o "Content Sink", é um tipo de fábrica de elementos DOM.

# 4. Reflow/Layout/Paint

"Reflow" e "Layout" são a mesma coisa, o primeiro é da Mozilla e o segundo do Google, consiste em calcular a posição e o tamanho dos elementos na árvore, após terem sido "atachados" aos DOM.
"Paint" é o momento em que a render engine finalmente mostra o resultado na tela.

# 5. Eventos DOM

- Mouse: click, hover, drag, drop, ...
- Teclado: up, down, press
- Form: focus, submit, blur, reset, ...
- Document: load, resize, scroll, ...
- UI: focusin, focusout, ...
- Mutation: SubtreeModified, NodeInserted, NodeRemoved, ...
- Progress: start, abort, load, error, ...
- Touch: start, move, end, ...
- Request, Manipulation, Clipboard, ...