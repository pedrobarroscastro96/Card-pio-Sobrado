/**
 * O Sobrado - Hamburgueria Artesanal & Chopp
 * Estrutura de dados desacoplada do cardápio digital
 */

/**
 * Catálogo Oficial de Adicionais
 */
const addonItems = {
  "aneis-cebola": { id: "aneis-cebola", name: "Anéis de Cebola", price: 6.00 },
  "bacon": { id: "bacon", name: "Bacon", price: 6.00 },
  "catupiry": { id: "catupiry", name: "Catupiry", price: 7.00 },
  "cheddar": { id: "cheddar", name: "Cheddar", price: 7.00 },
  "hamburguer-110g": { id: "hamburguer-110g", name: "Hambúrguer 110g", price: 8.00 },
  "mussarela": { id: "mussarela", name: "Mussarela", price: 3.50 },
  "ovo": { id: "ovo", name: "Ovo", price: 2.00 },
  "queijo-empanado": { id: "queijo-empanado", name: "Queijo Empanado", price: 8.00 },
  "salada": { id: "salada", name: "Salada", price: 2.00 }
};

if (typeof window !== 'undefined') {
  window.addonItems = addonItems;
}

const menuData = {
  restaurant: {
    name: "Sobrado - Burger & Bar",
    handle: "@osobradoo",
    category: "Burger & Bar",
    address: "Rua Antônio Augusto da Silveira 159B (Andar superior) Vila Nova - Perdões-MG",
    phone: "(35) 99170-077",
    whatsapp: "5535997170077",
    instagramUrl: "https://www.instagram.com/osobradoo",
    wifi: {
      ssid: "O Sobrado - Clientes",
      password: "sobradoburger"
    }
  },
  categories: [
    { id: "mais-pedidos", name: "Mais Pedidos", order: 1 },
    { id: "hamburgueres", name: "Hambúrgueres (Carne Angus)", order: 2 },
    { id: "porcoes-mais-pedidas", name: "Porções Mais Pedidas", order: 3 },
    { id: "porcoes", name: "Porções & Jantinhas", order: 4 },
    { id: "porcoes-individuais", name: "Porções Individuais", order: 5 },
    { id: "macarrao-na-chapa", name: "Macarrão na Chapa", order: 6 },
    { id: "batata-frita", name: "Batata Frita", order: 7 },
    { id: "molhos-extras", name: "Molhos Extras", order: 8 },
    { id: "bebidas", name: "Bebidas", order: 9 },
    { id: "cervejas", name: "Cervejas", order: 10 },
    { id: "balas", name: "Balas", order: 11 }
  ],
  products: [
    // 00. HAMBURGUERES MAIS PEDIDOS
    {
      id: "mais-pedidos-01",
      categoryId: "mais-pedidos",
      name: "01. PLT (O MAIS VENDIDO DA CASA)",
      description: "Pão brioche selado, Maionese original do Sobrado (verde), hambúrguer Angus artesanal de 110g, bacon, 100g de queijo mussarela empanado e frito. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão brioche selado", "Maionese original do Sobrado (verde)", "Hambúrguer Angus artesanal de 110g", "Bacon", "100g de queijo mussarela empanado e frito", "Acompanha 1 pote de Maionese Original"],
      price: 33.50,
      imageUrl: "assets/images/products/plt.png",
      videoUrl: null,
      featured: true,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "mussarela", "ovo", "queijo-empanado"]
    },
    {
      id: "mais-pedidos-02",
      categoryId: "mais-pedidos",
      name: "02. DOIIS",
      description: "Pão de brioche selado, BacoNese (maionese de alho e bacon frito, feita na casa), carne hambúrguer artesanal ANGUS de 110g, salada (alface e tomate rodelas), bacon, fatia de mussarela derretida e ovo frito. Acompanha 1 pote BacoNese.",
      ingredients: ["Pão de brioche selado", "BacoNese da casa", "Carne hambúrguer artesanal ANGUS 110g", "Salada (alface e tomate em rodelas)", "Bacon", "Fatia de mussarela derretida", "Ovo frito", "Acompanha 1 pote BacoNese"],
      price: 32.00,
      imageUrl: "assets/images/products/doiis.png",
      videoUrl: null,
      featured: true,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "mussarela", "queijo-empanado"]
    },
    {
      id: "mais-pedidos-original",
      categoryId: "mais-pedidos",
      name: "ORIGINAL.",
      description: "Pão de brioche selado, carne de hambúrguer artesanal ANGUS 110g, bacon, Maionese Original do Sobrado, salada (alface e tomate rodelas), ovo frito, fatia de mussarela derretida. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Carne artesanal ANGUS 110g", "Bacon", "Maionese Original do Sobrado", "Salada (alface e tomate)", "Ovo frito", "Mussarela derretida", "Acompanha 1 pote Maionese Original"],
      price: 33.50,
      imageUrl: "assets/images/products/original.jpg",
      videoUrl: null,
      featured: true,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "mussarela", "salada", "queijo-empanado"]
    },

    // 02. HAMBURGUERES (CARNE ANGUS)
    {
      id: "angus-00",
      categoryId: "hamburgueres",
      name: "00. CHEESE BURGER (ANGUS)",
      description: "Pão de brioche selado, Maionese Original do Sobrado, carne de hambúrguer ANGUS artesanal de 110g, fatia mussarela derretida. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Maionese Original do Sobrado", "Carne artesanal ANGUS 110g", "Fatia mussarela derretida", "Acompanha 1 pote Maionese Original"],
      price: 23.50,
      imageUrl: "assets/images/products/cheese-burger.png",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["hamburguer-110g", "ovo", "cheddar"]
    },
    {
      id: "angus-03",
      categoryId: "hamburgueres",
      name: "03. PLT PRIME",
      description: "TODOS OS INGREDIENTES DO PLT COM ADICIONAL DE HAMBURGUER ANGUS 110G.",
      ingredients: ["Ingredientes do PLT", "Adicional de 1 Hambúrguer Angus 110g"],
      price: 40.00,
      imageUrl: "assets/images/products/plt-prime.png",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "mussarela", "ovo", "queijo-empanado"]
    },
    {
      id: "angus-04",
      categoryId: "hamburgueres",
      name: "04. QUATTRO",
      description: "Pão de brioche selado, Maionese Original do Sobrado, 2 carnes de hambúrguer artesanal ANGUS 110g, 2 porções de bacon, 110g de queijo mussarela empanado e frito. Acompanha 1 pote molho da casa.",
      ingredients: ["Pão de brioche selado", "Maionese Original do Sobrado", "2 carnes artesanais ANGUS 110g", "2 porções de bacon", "110g mussarela empanada e frita", "Acompanha 1 pote molho da casa"],
      price: 45.00,
      imageUrl: "assets/images/products/quattro.png",
      videoUrl: null,
      featured: true,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "mussarela", "ovo", "queijo-empanado"]
    },
    {
      id: "angus-bacon-burguer",
      categoryId: "hamburgueres",
      name: "BACON BURGUER",
      description: "Pão de brioche selado, Maionese Original do Sobrado, carne de hambúrguer artesanal ANGUS 110g, bacon, fatia de mussarela derretida. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Maionese Original do Sobrado", "Carne artesanal ANGUS 110g", "Bacon", "Mussarela derretida", "Acompanha 1 pote Maionese Original"],
      price: 32.90,
      imageUrl: "assets/images/products/bacon-burguer.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "angus-cheddar-melt-prime",
      categoryId: "hamburgueres",
      name: "CHEDDAR MELT PRIME",
      description: "TODOS OS INGREDIENTES DO CHEDDAR MELT COM ADICIONAL DE 1 HAMBÚRGUER ANGUS 110g.",
      ingredients: ["Ingredientes do Cheddar Melt", "Adicional de 1 Hambúrguer Angus 110g"],
      price: 37.50,
      imageUrl: "assets/images/products/cheddar-melt-prime.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "angus-cheddar-melt",
      categoryId: "hamburgueres",
      name: "CHEDDAR MELT.",
      description: "Pão de brioche selado, carne de hambúrguer artesanal ANGUS 110g, Maionese Original do Sobrado, bacon, fatia de mussarela derretida, cheddar cremoso. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Carne artesanal ANGUS 110g", "Maionese Original do Sobrado", "Bacon", "Mussarela derretida", "Cheddar cremoso", "Acompanha 1 pote Maionese Original"],
      price: 30.00,
      imageUrl: "assets/images/products/cheddar-melt.jpg",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["aneis-cebola", "hamburguer-110g", "salada", "ovo", "queijo-empanado"]
    },
    {
      id: "angus-doiis-prime",
      categoryId: "hamburgueres",
      name: "DOIIS PRIME",
      description: "TODOS OS INGREDIENTES DO DOIIS COM ADICIONAL DE HAMBURGUER ANGUS 110G.",
      ingredients: ["Ingredientes do DOIIS", "Adicional de 1 Hambúrguer Angus 110g"],
      price: 39.50,
      imageUrl: "assets/images/products/doiis-prime.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "angus-mdf",
      categoryId: "hamburgueres",
      name: "M.D.F (MORTO DE FOME)",
      description: "Pão de brioche selado, duas carnes de hambúrguer artesanal ANGUS 110g, Maionese Original do Sobrado, 2 ovos frito, 2 fatias de mussarela derretida. Acompanha 1 pote da Maionese Original do Sobrado e bacon.",
      ingredients: ["Pão de brioche selado", "2 carnes artesanais ANGUS 110g", "Maionese Original do Sobrado", "2 ovos fritos", "2 fatias mussarela derretida", "Bacon", "Acompanha 1 pote Maionese Original"],
      price: 49.00,
      imageUrl: "assets/images/products/mdf.png",
      videoUrl: null,
      featured: true,
      available: true
    },
    {
      id: "angus-nsg",
      categoryId: "hamburgueres",
      name: "NSG",
      description: "Pão de brioche selado, Maionese Original do Sobrado, carne de hambúrguer ANGUS artesanal 110g, salada (alface e tomate em rodelas), bacon, fatia de mussarela derretida. Acompanha 1 pote da maionese original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Maionese Original do Sobrado", "Carne artesanal ANGUS 110g", "Salada (alface e tomate)", "Bacon", "Mussarela derretida", "Acompanha 1 pote Maionese Original"],
      price: 29.00,
      imageUrl: "assets/images/products/nsg.png",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["queijo-empanado"]
    },
    {
      id: "angus-original-prime",
      categoryId: "hamburgueres",
      name: "ORIGINAL PRIME",
      description: "TODOS OS INGREDIENTES DO ORIGINAL COM ADICIONAL DE HAMBURGUER ANGUS 110G.",
      ingredients: ["Ingredientes do Original", "Adicional de 1 Hambúrguer Angus 110g"],
      price: 41.00,
      imageUrl: "assets/images/products/original-prime.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "angus-salada-burguer",
      categoryId: "hamburgueres",
      name: "SALADA BURGUER",
      description: "Pão de brioche selado, Maionese Original do Sobrado, carne de hambúrguer artesanal ANGUS 110g, salada (alface e tomate rodelas), fatia de mussarela derretida. Acompanha 1 pote da Maionese Original do Sobrado.",
      ingredients: ["Pão de brioche selado", "Maionese Original do Sobrado", "Carne artesanal ANGUS 110g", "Salada (alface e tomate)", "Mussarela derretida", "Acompanha 1 pote Maionese Original"],
      price: 27.00,
      imageUrl: "assets/images/products/salada-burguer.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "angus-sthai",
      categoryId: "hamburgueres",
      name: "STHAI",
      description: "Pão de brioche selado, anéis de cebola, BacoNese( maionese de alho e bacon frito, feita na casa), carne hambúrguer artesanal ANGUS de 110g, salada (alface e tomate rodelas), bacon, fatia de mussarela derretida. Acompanha 1 pote BacoNese.",
      ingredients: ["Pão de brioche selado", "Anéis de cebola", "BacoNese da casa", "Carne artesanal ANGUS 110g", "Salada (alface e tomate)", "Bacon", "Mussarela derretida", "Acompanha 1 pote BacoNese"],
      price: 34.00,
      imageUrl: "assets/images/products/sthai.png",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "queijo-empanado"]
    },
    {
      id: "angus-x-cupim",
      categoryId: "hamburgueres",
      name: "X CUPIM",
      description: "Pão de brioche selado, BacoNese, (maionese de alho e bacon frito feita na casa), carne hambúrguer artesanal ANGUS de 110g, cupim desfiado com creme secreto da casa e bacon. Acompanha 1 pote BacoNese.",
      ingredients: ["Pão de brioche selado", "BacoNese da casa", "Carne artesanal ANGUS 110g", "Cupim desfiado com creme secreto da casa", "Bacon", "Acompanha 1 pote BacoNese"],
      price: 41.50,
      imageUrl: "assets/images/products/x-cupim.png",
      videoUrl: null,
      featured: true,
      available: true,
      allowedAddons: ["aneis-cebola", "bacon", "catupiry", "cheddar", "hamburguer-110g", "ovo", "queijo-empanado"]
    },
    {
      id: "angus-x-cupim-prime",
      categoryId: "hamburgueres",
      name: "X CUPIM PRIME",
      description: "TODOS OS INGREDIENTES DQ X CUPIM COM ADICIONAL DE 1 HAMBURGUER ANGUS 110g.",
      ingredients: ["Ingredientes do X Cupim", "Adicional de 1 Hambúrguer Angus 110g"],
      price: 49.00,
      imageUrl: "assets/images/products/x-cupim-prime.png",
      videoUrl: null,
      featured: false,
      available: true
    },

    // 03. PORÇÕES MAIS PEDIDAS
    {
      id: "porcao-classica-g",
      categoryId: "porcoes-mais-pedidas",
      name: "CLÁSSICA DO SOBRADO (A MAIS VENDIDA) (G)",
      description: "Uma porção de carne cozida lentamente para garantir um resultado extremamente saboroso e suculento, acompanhada de mandioca cozida no próprio caldo da carne, finalizada na chapa com cebola e segredinhos da casa. Acompanha um pote grande de BacoNese.",
      ingredients: ["Carne cozida lentamente", "Mandioca cozida no caldo da carne", "Finalizada na chapa com cebola", "Pote grande de BacoNese"],
      price: 110.00,
      imageUrl: "assets/images/products/classica-sobrado-g.jpg",
      videoUrl: null,
      featured: true,
      available: true
    },
    {
      id: "porcao-classica-m",
      categoryId: "porcoes-mais-pedidas",
      name: "CLÁSSICA DO SOBRADO (A MAIS VENDIDA) (M)",
      description: "Uma porção de carne cozida lentamente para garantir um resultado extremamente saboroso e suculento, acompanhada de mandioca cozida no próprio caldo da carne, finalizada na chapa com cebola e segredinhos da casa. Acompanha um pote grande de BacoNese.",
      ingredients: ["Carne cozida lentamente", "Mandioca cozida no caldo da carne", "Finalizada na chapa com cebola", "Pote grande de BacoNese"],
      price: 85.00,
      imageUrl: "assets/images/products/classica-sobrado-m.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "porcao-contra-surreal-g",
      categoryId: "porcoes-mais-pedidas",
      name: "O CONTRA SURREAL (G)",
      description: "Uma porção de contra filé macio, bem temperado e suculento, É finalizado na chapa com cebola e tomate, creme secreto da casa, Acompanha batata frita.",
      ingredients: ["Contra filé macio e suculento", "Finalizado na chapa com cebola e tomate", "Creme secreto da casa", "Acompanha batata frita"],
      price: 95.00,
      imageUrl: "assets/images/products/contra-surreal-g.png",
      videoUrl: null,
      featured: true,
      available: true
    },
    {
      id: "porcao-contra-surreal-m",
      categoryId: "porcoes-mais-pedidas",
      name: "O CONTRA SURREAL (M)",
      description: "Uma porção de contra filé macio, bem temperado e suculento, É finalizado na chapa com cebola e tomate, creme secreto da casa, Acompanha batata frita.",
      ingredients: ["Contra filé macio e suculento", "Finalizado na chapa com cebola e tomate", "Creme secreto da casa", "Acompanha batata frita"],
      price: 80.00,
      imageUrl: "assets/images/products/contra-surreal-m.png",
      videoUrl: null,
      featured: false,
      available: true
    },

    // 04. PORÇÃO & JANTINHAS
    {
      id: "porcao-batata-bacon-cheddar",
      categoryId: "porcoes",
      name: "Batata Bacon e Cheddar",
      description: "Batata frita crocante coberta com queijo cheddar cremoso e pedaços crocantes de bacon.",
      ingredients: ["Batata frita", "Cheddar cremoso", "Bacon crocante"],
      price: 25.00,
      imageUrl: "assets/images/products/batata-bacon-cheddar.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "porcao-frango-insano",
      categoryId: "porcoes",
      name: "Frango Insano",
      description: "Porção de 500g de peito de frango em cubos, marinados no tempero da casa, garantindo crocância por fora e um interior macio e suculento. Acompanha molho feito de ketchup, pimenta e alho, criando um contraste de sabores simplesmente insano.",
      ingredients: ["500g de peito de frango em cubos marinado", "Crocante por fora e macio por dentro", "Molho especial de ketchup, pimenta e alho"],
      price: 45.00,
      imageUrl: "assets/images/products/frango-insano.png",
      videoUrl: null,
      featured: true,
      available: true
    },
    {
      id: "jantinha-contra-file",
      categoryId: "porcoes",
      name: "Jantinha ( com contra filé)",
      description: "Arroz, feijão, batata frita vinagrete, farofa, contra filé na chapa.",
      ingredients: ["Arroz", "Feijão", "Batata frita", "Vinagrete", "Farofa", "Contra filé na chapa"],
      price: 25.00,
      imageUrl: "assets/images/products/jantinha-contra-file.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "jantinha-lombo",
      categoryId: "porcoes",
      name: "Jantinha (com lombo)",
      description: "Arroz, feijão, batata frita vinagrete, farofa, lombo suíno na chapa.",
      ingredients: ["Arroz", "Feijão", "Batata frita", "Vinagrete", "Farofa", "Lombo suíno na chapa"],
      price: 20.00,
      imageUrl: "assets/images/products/jantinha-lombo.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "jantinha-peixe",
      categoryId: "porcoes",
      name: "Jantinha (com peixe)",
      description: "Arroz, feijão, batata frita vinagrete, farofa, iscas de tilápia.",
      ingredients: ["Arroz", "Feijão", "Batata frita", "Vinagrete", "Farofa", "Iscas de tilápia"],
      price: 25.00,
      imageUrl: "assets/images/products/jantinha-peixe.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "porcao-mandioca-frita",
      categoryId: "porcoes",
      name: "Mandioca frita",
      description: "Mandioca frita sequinha e crocante.",
      ingredients: ["Mandioca frita crocante"],
      price: 15.00,
      imageUrl: "assets/images/products/mandioca-frita.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "porcao-tilapia-g",
      categoryId: "porcoes",
      name: "TILÁPIA À MODA SOBRADO (G)",
      description: "500g Tilapia, 400g batata.",
      ingredients: ["500g Tilápia em iscas", "400g Batata frita", "Acompanha molho tártaro e limão"],
      price: 95.00,
      imageUrl: "assets/images/products/tilapia-g.png",
      videoUrl: null,
      featured: true,
      available: true
    },
    {
      id: "porcao-tilapia-m",
      categoryId: "porcoes",
      name: "TILÁPIA À MODA SOBRADO (M)",
      description: "300g Tilapia, 300g batata.",
      ingredients: ["300g Tilápia em iscas", "300g Batata frita", "Acompanha molho tártaro e limão"],
      price: 80.00,
      imageUrl: "assets/images/products/tilapia-m.png",
      videoUrl: null,
      featured: false,
      available: true
    },

    // 05. MACARRÃO NA CHAPA
    {
      id: "macarrao-chapa",
      categoryId: "macarrao-na-chapa",
      name: "Macarrão na chapa",
      description: "Macarrão, molho especial, bacon, frango, calabresa, mussarela e orégano. (Nosso macarrão agora tem um sabor único. Devido ao processo de preparo, no qual as carnes são embaladas juntas, não é possível retirar nenhuma carne listadas.",
      ingredients: ["Macarrão", "Molho especial", "Bacon", "Frango", "Calabresa", "Mussarela", "Orégano"],
      price: 25.00,
      imageUrl: "assets/images/products/macarrao-chapa.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },

    // 06. BATATA FRITA
    {
      id: "batata-frita-tradicional",
      categoryId: "batata-frita",
      name: "Batata Frita",
      description: "Porção de batata frita tradicional crocante e sequinha.",
      ingredients: ["Batata frita tradicional"],
      price: 12.50,
      imageUrl: "assets/images/products/batata-frita.jpg",
      videoUrl: null,
      featured: false,
      available: true,
      allowedAddons: ["bacon", "cheddar"]
    },

    // PORÇÕES INDIVIDUAIS
    {
      id: "aneis-cebola",
      categoryId: "porcoes-individuais",
      name: "Anéis de cebola",
      description: "Porção individual anéis de cebola frito média de 10 anéis de cebola.",
      ingredients: ["Média de 10 anéis de cebola empanados e fritos"],
      price: 17.00,
      imageUrl: "assets/images/products/aneis-cebola.png",
      videoUrl: null,
      featured: false,
      available: true
    },

    // MOLHOS EXTRAS
    {
      id: "molho-baconnese-g",
      categoryId: "molhos-extras",
      name: "BacoNese (G)",
      description: "Pote grande da maionese artesanal da casa feita com alho e bacon frito.",
      ingredients: ["Maionese da casa", "Alho", "Bacon frito"],
      price: 3.50,
      imageUrl: "assets/images/products/molho.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "molho-baconnese-p",
      categoryId: "molhos-extras",
      name: "BacoNese (P)",
      description: "Pote pequeno da maionese artesanal da casa feita com alho e bacon frito.",
      ingredients: ["Maionese da casa", "Alho", "Bacon frito"],
      price: 2.50,
      imageUrl: "assets/images/products/molho.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "molho-creme-queijo-g",
      categoryId: "molhos-extras",
      name: "Creme de Queijo (G)",
      description: "Pote grande do creme especial de queijo da casa.",
      ingredients: ["Creme especial de queijo"],
      price: 5.00,
      imageUrl: "assets/images/products/molho.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "molho-maionese-verde-g",
      categoryId: "molhos-extras",
      name: "Maionese Verde (G)",
      description: "Pote grande da Maionese Original verde do Sobrado temperada com ervas finas.",
      ingredients: ["Maionese verde artesanal"],
      price: 2.50,
      imageUrl: "assets/images/products/molho.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "molho-maionese-verde-p",
      categoryId: "molhos-extras",
      name: "Maionese Verde (P)",
      description: "Pote pequeno da Maionese Original verde do Sobrado temperada com ervas finas.",
      ingredients: ["Maionese verde artesanal"],
      price: 1.50,
      imageUrl: "assets/images/products/molho.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },

    // 07. BEBIDAS
    {
      id: "bebida-agua-com-gas",
      categoryId: "bebidas",
      name: "Água c/ gás",
      description: "Garrafa de água mineral com gás.",
      price: 4.00,
      imageUrl: "assets/images/products/agua-com-gas.png",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-agua-sem-gas",
      categoryId: "bebidas",
      name: "Água s/gás",
      description: "Garrafa de água mineral sem gás.",
      price: 3.00,
      imageUrl: "assets/images/products/agua-sem-gas.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-coca-2l",
      categoryId: "bebidas",
      name: "Coca 2L",
      description: "Refrigerante Coca-Cola garrafa 2 litros.",
      price: 16.00,
      imageUrl: "assets/images/products/coca-2l.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-coca-600ml",
      categoryId: "bebidas",
      name: "Coca 600ml",
      description: "Refrigerante Coca-Cola garrafa 600ml.",
      price: 10.00,
      imageUrl: "assets/images/products/coca-600.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-coca-lata",
      categoryId: "bebidas",
      name: "Coca Lata",
      description: "Refrigerante Coca-Cola lata 350ml.",
      price: 8.00,
      imageUrl: "assets/images/products/coca-lata.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-coca-zero-lata",
      categoryId: "bebidas",
      name: "Coca lata (Zero)",
      description: "Refrigerante Coca-Cola Zero lata 350ml.",
      price: 8.00,
      imageUrl: "assets/images/products/coca-zero.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-del-valle-goiaba",
      categoryId: "bebidas",
      name: "Del valle lata (Goiaba)",
      description: "Suco Del Valle sabor Goiaba em lata.",
      price: 8.00,
      imageUrl: "assets/images/products/del-valle.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-del-valle-pessego",
      categoryId: "bebidas",
      name: "Del valle lata (Pêssego)",
      description: "Suco Del Valle sabor Pêssego em lata.",
      price: 8.00,
      imageUrl: "assets/images/products/del-valle.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-del-valle-uva",
      categoryId: "bebidas",
      name: "Del valle lata (Uva)",
      description: "Suco Del Valle sabor Uva em lata.",
      price: 8.00,
      imageUrl: "assets/images/products/del-valle.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-guarana-1l",
      categoryId: "bebidas",
      name: "Guarana 1L",
      description: "Refrigerante Guaraná garrafa de 1 litro.",
      price: 12.00,
      imageUrl: "assets/images/products/guarana-1l.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-guarana-lata",
      categoryId: "bebidas",
      name: "Guarana Antartica lata",
      description: "Refrigerante Guaraná Antarctica em lata 350ml.",
      price: 8.00,
      imageUrl: "assets/images/products/guarana-lata.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bebida-red-bull",
      categoryId: "bebidas",
      name: "Red Bull",
      description: "Energético Red Bull lata 250ml.",
      price: 12.00,
      imageUrl: "assets/images/products/red-bull.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },

    // CERVEJAS
    {
      id: "cerveja-original",
      categoryId: "cervejas",
      name: "Original Cerveja",
      description: "Cerveja Antarctica Original garrafa 600ml gelada.",
      price: 14.00,
      imageUrl: "assets/images/products/cerveja-original.png",
      videoUrl: null,
      featured: false,
      available: true
    },

    // BALAS
    {
      id: "bala-halls",
      categoryId: "balas",
      name: "Halls",
      description: "Bala refrescante Halls.",
      price: 3.00,
      imageUrl: "assets/images/products/halls.jpg",
      videoUrl: null,
      featured: false,
      available: true
    },
    {
      id: "bala-trident",
      categoryId: "balas",
      name: "Trident",
      description: "Goma de mascar Trident.",
      price: 4.00,
      imageUrl: "assets/images/products/trident.jpg",
      videoUrl: null,
      featured: false,
      available: true
    }
  ]
};

menuData.addonItems = addonItems;

// Exporta globalmente para uso estático simples e seguro
if (typeof window !== 'undefined') {
  window.menuData = menuData;
  window.addonItems = addonItems;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { menuData, addonItems };
}

