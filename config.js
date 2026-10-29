// ==========================================================
//  CONFIGURAÇÃO DO CATÁLOGO — BRUNO MULTIMARCAS
//  Pode editar este arquivo direto no GitHub (ícone de lápis).
// ==========================================================
window.CATALOGO = {
  loja: "Bruno Multimarcas",
  slogan: "Sua Moda Masculina",
  instagram: "brunomultimarkas",
  whatsapp: "5573998220999", // só números, com 55 + DDD
  mensagemWhatsapp: "Olá, Bruno Multimarcas! Vi essa peça no catálogo e quero saber mais:",
  enderecos: [
    "Matriz · Rua 5 de Novembro, nº 80 · Centro",
    "Filial · Bairro Pequi"
  ],
  cidade: "Eunápolis – BA",

  // Quantos dias um post fica em "Chegou agora"
  diasNovidade: 15,
  // Ofertas antigas saem do filtro "Ofertas" depois de X dias (evita preço vencido)
  diasOferta: 45,

  // ---------- SÓ PRODUTO ----------
  // Vídeos/Reels (humor, memes, bastidores) ficam fora do catálogo
  mostrarVideos: false,

  // Posts com estas palavras na legenda ficam fora (avisos, memes, agradecimentos...)
  // Dica: pra esconder qualquer post novo, é só colocar #naocatalogo na legenda.
  palavrasOcultar: [
    "#naocatalogo", "localiza", "onde estamos", "endereço", "endereco", "horário", "horario",
    "atendimento até", "atendimento ate", "loja aberta", "feriad", "recado", "obrigad",
    "visita", "ganhador", "sorteio", "dia das crianças", "dia das criancas", "cerveja",
    "donos de loja", "motivos para agradecer", "passou pela loja", "prazer família",
    "prazer familia", "neymar", "vinijr", "agonia", "boa tarde família", "boa tarde familia",
    "nesse nível", "nesse nivel", "moranguete", "invasão", "invasao"
  ],

  // Posts escondidos um a um (escolhidos à mão)
  ocultarPosts: "18091949309279010,18094472255158573,18143735401510017,17995690035043998,18092657684189479,18378910030226198,18371860909214159,18282790966289291,18183235660424894,18110950483860886,17910227391467448,18115347613973509,18117029765004529,18631879909008557,18108564617029045,18099320458958248,17872735317684734,18383408446160927,18078246143406033,17972059886901583,18089149292216408,17869832952673234,18106140668297136,18051790250572571,17870901876667405,17859136893582740,18079544012454220,17857985019522964,18001040591841776,18063946733216205,17933160531151391,17939334851983751,17929681116171700,18139254814465002,18049521239459517,17858006115569998,17915316090247819,18172930933370632,17865290595511781,18087411695313654,18086405113946825,18076653530518150,18020068897929008,18321602050104806".split(","),

  // Categorias (iguais aos Destaques do Instagram).
  // O catálogo lê a LEGENDA do post e procura estas palavras.
  // Dica: colocar #tenis, #bone, #perfume etc. na legenda garante a categoria certa.
  categorias: [
    { nome: "Ofertas",    palavras: ["oferta", "promo", "% off", "%off", "desconto", "liquida", "fecha mês", "fecha mes", "#ofertas"] },
    { nome: "Camisas",    palavras: ["camisa", "camiseta", "polo", "regata", "#camisas"] },
    { nome: "Tênis",      palavras: ["tênis", "tenis", "sneaker", "#tenis"] },
    { nome: "Bonés",      palavras: ["boné", "bone", "bonés", "#bones"] },
    { nome: "Perfumes",   palavras: ["perfume", "fragrância", "fragrancia", "#perfumes"] },
    { nome: "Chinelos",   palavras: ["chinelo", "sandália", "sandalia", "slide", "#chinelos"] },
    { nome: "Kits",       palavras: ["kit", "combo", "#kits"] },
    { nome: "Acessórios", palavras: ["óculos", "oculos", "relógio", "relogio", "carteira", "cinto", "corrente", "pulseira", "mochila", "bolsa", "#acessorios"] },
    { nome: "Bermudas & Calças", palavras: ["bermuda", "calça", "calca", "short", "jeans", "#bermudas", "#calcas"] }
  ]
};
