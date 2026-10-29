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
