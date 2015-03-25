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

3. WebKit x Gecko
