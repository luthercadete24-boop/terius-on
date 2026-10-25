import {
  Product,
  Order,
  Customer,
  PaymentGatewayConfig,
  SalesChannelConfig,
  AppPlugin,
  DailySalesMetric,
  TrafficSourceMetric,
  CustomerReview,
  SocialConnector
} from "../types/store";

const STORAGE_KEY = "terius_store_database_v1";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Jaqueta Corta-Vento Minimalista Oliva",
    category: "Vestuário",
    price: 389.90,
    originalPrice: 459.90,
    rating: 4.9,
    reviewsCount: 48,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=700&auto=format&fit=crop&q=80",
    stock: 24,
    sku: "JQT-OLV-01",
    featured: true,
    isNew: true,
    description: "Confeccionada em tecido tecnológico repelente à água com forro respirável. Modelagem contemporânea em tom oliva natural e acabamento premium.",
    salesChannels: ["Loja Web", "Instagram", "TikTok"]
  },
  {
    id: "prod-2",
    name: "Mochila Executiva Couro Vegetal & Lona",
    category: "Acessórios",
    price: 459.00,
    originalPrice: 520.00,
    rating: 4.8,
    reviewsCount: 36,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80",
    stock: 15,
    sku: "MCH-LON-02",
    featured: true,
    description: "Compartimento acolchoado para notebook até 16 polegadas, bolsos com fecho magnético e zíperes reforçados YKK com impermeabilidade.",
    salesChannels: ["Loja Web", "Instagram", "Mercado Livre"]
  },
  {
    id: "prod-3",
    name: "Luminária Articulada em Latão Escovado",
    category: "Casa & Decoração",
    price: 289.50,
    rating: 4.9,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80",
    stock: 12,
    sku: "LUM-LAT-03",
    featured: true,
    description: "Design nórdico atemporal em acabamento latão fosco. Proporciona iluminação difusa suave ideal para mesas de leitura e home office.",
    salesChannels: ["Loja Web", "Instagram"]
  },
  {
    id: "prod-4",
    name: "Caneca Cerâmica Artesanal Terracota 350ml",
    category: "Tecnologia & Café",
    price: 84.90,
    originalPrice: 99.00,
    rating: 4.7,
    reviewsCount: 54,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80",
    stock: 45,
    sku: "CNC-TER-04",
    featured: true,
    isNew: true,
    description: "Queima em alta temperatura, acabamento rústico com esmalte acetinado. Mantém a temperatura da sua bebida preservando notas sensoriais.",
    salesChannels: ["Loja Web", "TikTok", "Mercado Livre"]
  },
  {
    id: "prod-5",
    name: "Camisa Linho Puro Gola Padre Areia",
    category: "Vestuário",
    price: 249.90,
    rating: 4.8,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80",
    stock: 19,
    sku: "CMS-LNH-05",
    description: "100% linho europeu pré-lavado, toque macio que não encolhe. Respirabilidade e sofisticação descomplicada para qualquer estação.",
    salesChannels: ["Loja Web", "Instagram"]
  },
  {
    id: "prod-6",
    name: "Relógio Analógico Cronógrafo Aço & Couro",
    category: "Acessórios",
    price: 649.00,
    originalPrice: 780.00,
    rating: 5.0,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80",
    stock: 8,
    sku: "RLG-CRN-06",
    description: "Mecanismo japonês de alta precisão, vidro de cristal safira antirrisco e pulseira de couro genuíno costurada à mão.",
    salesChannels: ["Loja Web", "Mercado Livre"]
  },
  {
    id: "prod-7",
    name: "Difusor Ultrassônico Aromático em Madeira",
    category: "Casa & Decoração",
    price: 199.00,
    rating: 4.7,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&auto=format&fit=crop&q=80",
    stock: 20,
    sku: "DFS-MAD-07",
    description: "Silencioso com iluminação ambiente suave em tom âmbar e temporizador integrado. Transforma o aroma do seu ambiente com óleos essenciais.",
    salesChannels: ["Loja Web", "Instagram", "TikTok"]
  },
  {
    id: "prod-8",
    name: "Cafeteira Prensa Francesa Vidro Borossilicato 800ml",
    category: "Tecnologia & Café",
    price: 149.90,
    originalPrice: 179.90,
    rating: 4.9,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=700&auto=format&fit=crop&q=80",
    stock: 33,
    sku: "PRF-FRA-08",
    description: "Estrutura em aço inoxidável e êmbolo duplo com filtragem fina que extrai os óleos essenciais do grão com cremosidade incomparável.",
    salesChannels: ["Loja Web", "Instagram"]
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Beatriz Nogueira Silveira",
    email: "beatriz.silveira@email.com",
    phone: "(11) 98765-4321",
    city: "São Paulo",
    state: "SP",
    ordersCount: 4,
    totalSpent: 1689.70,
    lastOrderDate: "Hoje, 14:32",
    tag: "VIP"
  },
  {
    id: "cust-2",
    name: "Rodrigo Mendes Castro",
    email: "rodrigo.mendes@email.com",
    phone: "(21) 99123-8877",
    city: "Rio de Janeiro",
    state: "RJ",
    ordersCount: 2,
    totalSpent: 708.90,
    lastOrderDate: "Ontem, 19:15",
    tag: "Recorrente"
  },
  {
    id: "cust-3",
    name: "Camila Fernandez Duarte",
    email: "camila.duarte@email.com",
    phone: "(31) 99344-1290",
    city: "Belo Horizonte",
    state: "MG",
    ordersCount: 1,
    totalSpent: 459.00,
    lastOrderDate: "02/10/2026",
    tag: "Novo Cliente"
  },
  {
    id: "cust-4",
    name: "Lucas Vasconcelos Prado",
    email: "lucas.prado@email.com",
    phone: "(41) 98877-6655",
    city: "Curitiba",
    state: "PR",
    ordersCount: 3,
    totalSpent: 1240.50,
    lastOrderDate: "28/09/2026",
    tag: "Recorrente"
  },
  {
    id: "cust-5",
    name: "Mariana Alencar Guimarães",
    email: "mariana.alencar@email.com",
    phone: "(71) 99765-1122",
    city: "Salvador",
    state: "BA",
    ordersCount: 1,
    totalSpent: 84.90,
    lastOrderDate: "24/09/2026",
    tag: "Novo Cliente"
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "PED-10492",
    customerName: "Beatriz Nogueira Silveira",
    customerEmail: "beatriz.silveira@email.com",
    customerPhone: "(11) 98765-4321",
    items: [
      {
        productId: "prod-1",
        productName: "Jaqueta Corta-Vento Minimalista Oliva",
        price: 389.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=700&auto=format&fit=crop&q=80"
      },
      {
        productId: "prod-4",
        productName: "Caneca Cerâmica Artesanal Terracota 350ml",
        price: 84.90,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80"
      }
    ],
    subtotal: 559.70,
    shipping: 0,
    discount: 50.00,
    total: 509.70,
    status: "Pago",
    paymentMethod: "Google Pay",
    paymentGateway: "Google Pay / Nativo",
    salesChannel: "Loja Web",
    trackingCode: "BR938472918SP",
    nfeNumber: "NFe-0004921",
    createdAt: "Hoje, 14:32",
    shippingAddress: {
      street: "Rua Oscar Freire",
      number: "1420, Apto 82",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-001"
    }
  },
  {
    id: "PED-10491",
    customerName: "Rodrigo Mendes Castro",
    customerEmail: "rodrigo.mendes@email.com",
    customerPhone: "(21) 99123-8877",
    items: [
      {
        productId: "prod-2",
        productName: "Mochila Executiva Couro Vegetal & Lona",
        price: 459.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80"
      },
      {
        productId: "prod-8",
        productName: "Cafeteira Prensa Francesa Vidro Borossilicato",
        price: 149.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=700&auto=format&fit=crop&q=80"
      }
    ],
    subtotal: 608.90,
    shipping: 25.00,
    discount: 0,
    total: 633.90,
    status: "Em Separação",
    paymentMethod: "Cartão Visa",
    paymentGateway: "Visa Direct",
    salesChannel: "Instagram",
    trackingCode: "BR938471102RJ",
    nfeNumber: "NFe-0004920",
    createdAt: "Ontem, 19:15",
    shippingAddress: {
      street: "Av. Vieira Souto",
      number: "520",
      neighborhood: "Ipanema",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22420-006"
    }
  },
  {
    id: "PED-10490",
    customerName: "Lucas Vasconcelos Prado",
    customerEmail: "lucas.prado@email.com",
    customerPhone: "(41) 98877-6655",
    items: [
      {
        productId: "prod-6",
        productName: "Relógio Analógico Cronógrafo Aço & Couro",
        price: 649.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80"
      }
    ],
    subtotal: 649.00,
    shipping: 0,
    discount: 64.90,
    total: 584.10,
    status: "Enviado",
    paymentMethod: "Google Pay",
    paymentGateway: "Google Pay API Direct",
    salesChannel: "Loja Web",
    trackingCode: "BR938469854PR",
    nfeNumber: "NFe-0004919",
    createdAt: "28/09/2026, 11:20",
    shippingAddress: {
      street: "Rua Comendador Araújo",
      number: "389",
      neighborhood: "Batel",
      city: "Curitiba",
      state: "PR",
      zipCode: "80420-000"
    }
  },
  {
    id: "PED-10489",
    customerName: "Camila Fernandez Duarte",
    customerEmail: "camila.duarte@email.com",
    customerPhone: "(31) 99344-1290",
    items: [
      {
        productId: "prod-3",
        productName: "Luminária Articulada em Latão Escovado",
        price: 289.50,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80"
      }
    ],
    subtotal: 289.50,
    shipping: 18.00,
    discount: 0,
    total: 307.50,
    status: "Entregue",
    paymentMethod: "Cartão Visa",
    paymentGateway: "Visa Direct",
    salesChannel: "TikTok",
    trackingCode: "BR938455112MG",
    nfeNumber: "NFe-0004918",
    createdAt: "26/09/2026, 09:40",
    shippingAddress: {
      street: "Rua da Bahia",
      number: "1140",
      neighborhood: "Lourdes",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30160-011"
    }
  }
];

const INITIAL_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: "gw-google-pay",
    name: "Google Pay",
    provider: "Google Pay",
    enabled: true,
    feePercentage: 1.2,
    fixedFee: 0.30,
    acceptedMethods: ["Google Wallet", "Cartão Vinculado no Dispositivo", "1-Click Checkout"],
    environment: "Produção"
  },
  {
    id: "gw-visa-direct",
    name: "Visa Direct & Mastercard Nativo",
    provider: "Visa Direct",
    enabled: true,
    feePercentage: 2.1,
    fixedFee: 0.40,
    acceptedMethods: ["Cartão de Crédito em até 12x", "Débito Online", "Antifraude Integrado"],
    environment: "Produção"
  },
  {
    id: "gw-google-pay",
    name: "Google Pay API Direct",
    provider: "Google Pay",
    enabled: true,
    feePercentage: 0.0,
    fixedFee: 0.00,
    acceptedMethods: ["1-Clique Mobile", "Biometria Digital", "Tokenização Google"],
    environment: "Produção"
  },
  {
    id: "gw-mercado-pago",
    name: "Intermediador Mercado Pago",
    provider: "Mercado Pago",
    enabled: false,
    feePercentage: 3.49,
    fixedFee: 0.50,
    acceptedMethods: ["Boleto Bancário", "Saldo Mercado Pago", "Parcelamento sem juros"],
    environment: "Sandbox (Testes)"
  }
];

const INITIAL_CHANNELS: SalesChannelConfig[] = [
  {
    id: "ch-web",
    name: "Loja Virtual Oficial (Web & Mobile)",
    icon: "Globe",
    enabled: true,
    syncedProducts: 8,
    totalSalesChannel: 28450.00,
    syncFrequency: "Tempo Real",
    status: "Conectado"
  },
  {
    id: "ch-instagram",
    name: "Instagram Shopping",
    icon: "Instagram",
    enabled: true,
    syncedProducts: 8,
    totalSalesChannel: 14220.00,
    syncFrequency: "Tempo Real",
    status: "Conectado"
  },
  {
    id: "ch-tiktok",
    name: "TikTok Shop",
    icon: "Share2",
    enabled: true,
    syncedProducts: 6,
    totalSalesChannel: 8930.00,
    syncFrequency: "A cada 15 min",
    status: "Conectado"
  },
  {
    id: "ch-mercadolivre",
    name: "Mercado Livre Full",
    icon: "ShoppingBag",
    enabled: true,
    syncedProducts: 4,
    totalSalesChannel: 11450.00,
    syncFrequency: "Tempo Real",
    status: "Conectado"
  }
];

const INITIAL_APPS: AppPlugin[] = [
  {
    id: "app-reviews",
    name: "Avaliações Reais de Clientes",
    category: "Avaliações",
    description: "Coleta fotos e depoimentos com estrelas pós-entrega. Eleva a conversão em até 24% na vitrine.",
    installed: true,
    version: "2.4.1",
    badge: "Essencial",
    activeStatusText: "Ativo na vitrine de produtos"
  },
  {
    id: "app-abandoned-cart",
    name: "Recuperação de Carrinho via WhatsApp & E-mail",
    category: "Recuperação de Vendas",
    description: "Dispara mensagens automáticas amigáveis com link direto de pagamento quando o cliente desiste.",
    installed: true,
    version: "3.1.0",
    badge: "Alto Retorno",
    activeStatusText: "8 carrinhos recuperados nos últimos 7 dias"
  },
  {
    id: "app-email-marketing",
    name: "Automação de E-mail Marketing & Newsletter",
    category: "Marketing",
    description: "Crie sequências de boas-vindas, ofertas VIPs e novidades com segmentação inteligente de clientes.",
    installed: true,
    version: "1.9.5",
    activeStatusText: "Campanhas semanais programadas"
  },
  {
    id: "app-correios-logistica",
    name: "Cálculo de Frete & Etiquetas Melhor Envio / Correios",
    category: "Logística",
    description: "Cotações com desconto de até 70% nas transportadoras Jadlog, Correios (PAC/Sedex) e Azul Cargo.",
    installed: true,
    version: "4.0.2",
    badge: "Economia",
    activeStatusText: "Cálculo por CEP sincronizado no checkout"
  },
  {
    id: "app-seo-turbo",
    name: "Otimizador de SEO & Rich Snippets Google",
    category: "SEO",
    description: "Gera dados estruturados de produto, preços e avaliações nos resultados orgânicos de pesquisa.",
    installed: false,
    version: "1.5.0",
    activeStatusText: "Disponível para ativação imediata"
  }
];

const INITIAL_SALES_METRICS: DailySalesMetric[] = [
  { date: "Seg", vendas: 2840, pedidos: 6, ticketMedio: 473 },
  { date: "Ter", vendas: 3920, pedidos: 9, ticketMedio: 435 },
  { date: "Qua", vendas: 4610, pedidos: 11, ticketMedio: 419 },
  { date: "Qui", vendas: 3750, pedidos: 8, ticketMedio: 468 },
  { date: "Sex", vendas: 5890, pedidos: 14, ticketMedio: 420 },
  { date: "Sáb", vendas: 6420, pedidos: 16, ticketMedio: 401 },
  { date: "Dom", vendas: 5120, pedidos: 12, ticketMedio: 426 }
];

const INITIAL_TRAFFIC_SOURCES: TrafficSourceMetric[] = [
  { name: "Google Orgânico & Busca", value: 38, color: "#5A5A40" },
  { name: "Instagram Shopping", value: 29, color: "#C05B33" },
  { name: "TikTok Ads & Reels", value: 18, color: "#8B8B69" },
  { name: "Tráfego Direto", value: 11, color: "#3A3A30" },
  { name: "E-mail Marketing", value: 4, color: "#D97706" }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    authorName: "Carolina Sampaio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    location: "São Paulo, SP",
    rating: 5,
    date: "Há 2 dias",
    verifiedPurchase: true,
    productName: "Jaqueta Corta-Vento Minimalista Oliva",
    productId: "prod-1",
    title: "Qualidade impecável e caimento perfeito!",
    comment: "A jaqueta superou todas as expectativas. O acabamento das costuras, o toque do tecido tecnológico e a tonalidade oliva são refinados demais. Chegou em 2 dias com embalagem ecológica linda.",
    helpfulCount: 24,
    userLiked: false
  },
  {
    id: "rev-2",
    authorName: "Marcelo F. Vieira",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    location: "Curitiba, PR",
    rating: 5,
    date: "Há 4 dias",
    verifiedPurchase: true,
    productName: "Mochila Executiva Couro Vegetal & Lona",
    productId: "prod-2",
    title: "Melhor compra que fiz este ano!",
    comment: "Uso diariamente para trabalhar e viajar. Couro encorpado, impermeável na chuva leve e o espaço para notebook é extremamente protegido. O checkout com Google Pay foi em 5 segundos!",
    helpfulCount: 19,
    userLiked: true
  },
  {
    id: "rev-3",
    authorName: "Juliana Medeiros",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    location: "Belo Horizonte, MG",
    rating: 5,
    date: "Há 1 semana",
    verifiedPurchase: true,
    productName: "Caneca Cerâmica Artesanal Terracota 350ml",
    productId: "prod-4",
    title: "Charmosa e conserva o café quente por muito tempo",
    comment: "A cor terracota combina perfeitamente com a minha bancada. Peça com alma e muito bem produzida. Atendimento via WhatsApp respondeu em menos de 1 minuto.",
    helpfulCount: 15,
    userLiked: false
  },
  {
    id: "rev-4",
    authorName: "Gabriel Albuquerque",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    location: "Florianópolis, SC",
    rating: 5,
    date: "Há 1 semana",
    verifiedPurchase: true,
    productName: "Luminária Articulada em Latão Escovado",
    productId: "prod-3",
    title: "Design minimalista e luz difusa aconchegante",
    comment: "Ficou fantástica na minha mesa de leitura. O latão escovado é sólido e o ajuste das articulações é firme. Pagamento no cartão Visa aprovou na hora com 6x sem juros.",
    helpfulCount: 11,
    userLiked: false
  },
  {
    id: "rev-5",
    authorName: "Renata Vasconcellos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    location: "Rio de Janeiro, RJ",
    rating: 4,
    date: "Há 2 semanas",
    verifiedPurchase: true,
    productName: "Camisa Linho Puro Gola Padre Areia",
    productId: "prod-5",
    title: "Linho de altíssima qualidade, caimento solto",
    comment: "Tecido fresco para o calor carioca, não pinica e tem um caimento elegante. Recomendo pedir a numeração usual. A entrega foi muito rápida.",
    helpfulCount: 8,
    userLiked: false
  }
];

export const INITIAL_CONNECTORS: SocialConnector[] = [
  {
    id: "soc-1",
    platform: "Instagram",
    handle: "@terius.on",
    status: "Conectado",
    followersOrReach: "48.2k seguidores",
    syncedProductsCount: 8,
    lastSync: "Hoje, 15:40",
    actionUrl: "https://instagram.com",
    actionLabel: "Seguir no Instagram",
    recentPosts: [
      {
        id: "post-1",
        imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
        title: "Essenciais: tonalidades musgo e oliva com design minimalista.",
        likes: "1.420",
        taggedProduct: "Jaqueta Corta-Vento Minimalista Oliva"
      },
      {
        id: "post-2",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
        title: "Para quem valoriza durabilidade e sobriedade em cada jornada.",
        likes: "980",
        taggedProduct: "Mochila Executiva Couro Vegetal & Lona"
      },
      {
        id: "post-3",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
        title: "Ritual matinal: café especial em cerâmica terracota feita à mão.",
        likes: "2.140",
        taggedProduct: "Caneca Cerâmica Artesanal Terracota 350ml"
      },
      {
        id: "post-4",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80",
        title: "Ambientes serenos: iluminação escultural em latão escovado.",
        likes: "1.105",
        taggedProduct: "Luminária Articulada em Latão Escovado"
      }
    ]
  },
  {
    id: "soc-2",
    platform: "WhatsApp",
    handle: "+351 963 067 989 (963067989)",
    status: "Conectado",
    followersOrReach: "Canal Oficial de Vendas & Suporte",
    syncedProductsCount: 8,
    lastSync: "Tempo Real (Cloud API)",
    actionUrl: "https://wa.me/351963067989",
    actionLabel: "Iniciar Conversa no WhatsApp"
  },
  {
    id: "soc-3",
    platform: "TikTok",
    handle: "@terius.lifestyle",
    status: "Conectado",
    followersOrReach: "125.4k visualizações/mês",
    syncedProductsCount: 6,
    lastSync: "Ontem, 21:15",
    actionUrl: "https://tiktok.com",
    actionLabel: "Ver no TikTok Shop"
  },
  {
    id: "soc-4",
    platform: "YouTube",
    handle: "@TeriusDesign",
    status: "Sincronizado",
    followersOrReach: "12.8k inscritos",
    syncedProductsCount: 8,
    lastSync: "Há 2 dias",
    actionUrl: "https://youtube.com",
    actionLabel: "Assistir Reviews & Bastidores"
  },
  {
    id: "soc-5",
    platform: "LinkedIn",
    handle: "Teríus on Concept Store",
    status: "Conectado",
    followersOrReach: "8.4k conexões",
    syncedProductsCount: 8,
    lastSync: "Há 3 dias",
    actionUrl: "https://linkedin.com",
    actionLabel: "Página Corporativa"
  }
];

export interface StoreState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  gateways: PaymentGatewayConfig[];
  channels: SalesChannelConfig[];
  apps: AppPlugin[];
  dailySales: DailySalesMetric[];
  trafficSources: TrafficSourceMetric[];
  reviews: CustomerReview[];
  connectors: SocialConnector[];
}

export const storeService = {
  getState(): StoreState {
    if (typeof window === "undefined") {
      return {
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
        customers: INITIAL_CUSTOMERS,
        gateways: INITIAL_GATEWAYS,
        channels: INITIAL_CHANNELS,
        apps: INITIAL_APPS,
        dailySales: INITIAL_SALES_METRICS,
        trafficSources: INITIAL_TRAFFIC_SOURCES,
        reviews: INITIAL_REVIEWS,
        connectors: INITIAL_CONNECTORS
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.reviews || parsed.reviews.length === 0) {
          parsed.reviews = INITIAL_REVIEWS;
        }
        if (!parsed.connectors || parsed.connectors.length === 0) {
          parsed.connectors = INITIAL_CONNECTORS;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Falha ao carregar estado da loja do localStorage", e);
    }

    const defaultState: StoreState = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      gateways: INITIAL_GATEWAYS,
      channels: INITIAL_CHANNELS,
      apps: INITIAL_APPS,
      dailySales: INITIAL_SALES_METRICS,
      trafficSources: INITIAL_TRAFFIC_SOURCES,
      reviews: INITIAL_REVIEWS,
      connectors: INITIAL_CONNECTORS
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    } catch (e) {
      // Ignorar quota
    }
    return defaultState;
  },

  saveState(state: StoreState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Erro ao salvar dados da loja", e);
    }
  },

  createOrder(orderData: Omit<Order, "id" | "createdAt" | "status" | "nfeNumber">): Order {
    const state = this.getState();
    const newOrderId = `PED-${Math.floor(10500 + Math.random() * 9000)}`;
    const newNfe = `NFe-${String(Math.floor(4930 + Math.random() * 5000)).padStart(7, "0")}`;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      status: "Pago",
      nfeNumber: newNfe,
      createdAt: "Agora há pouco",
      trackingCode: `BR${Math.floor(100000000 + Math.random() * 900000000)}SP`
    };

    // 1. Atualizar estoque de produtos
    const updatedProducts = state.products.map(p => {
      const itemInOrder = orderData.items.find(i => i.productId === p.id);
      if (itemInOrder) {
        return {
          ...p,
          stock: Math.max(0, p.stock - itemInOrder.quantity)
        };
      }
      return p;
    });

    // 2. Atualizar ou registrar cliente
    let customerIndex = state.customers.findIndex(c => c.email.toLowerCase() === orderData.customerEmail.toLowerCase());
    let updatedCustomers = [...state.customers];

    if (customerIndex >= 0) {
      const existing = updatedCustomers[customerIndex];
      updatedCustomers[customerIndex] = {
        ...existing,
        ordersCount: existing.ordersCount + 1,
        totalSpent: Number((existing.totalSpent + orderData.total).toFixed(2)),
        lastOrderDate: "Hoje",
        tag: existing.ordersCount >= 2 ? "VIP" : "Recorrente"
      };
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        ordersCount: 1,
        totalSpent: orderData.total,
        lastOrderDate: "Hoje",
        tag: "Novo Cliente"
      };
      updatedCustomers.unshift(newCustomer);
    }

    // 3. Atualizar métricas diárias
    const updatedDailySales = state.dailySales.map((metric, index) => {
      if (index === state.dailySales.length - 1) {
        const newPedidos = metric.pedidos + 1;
        const newVendas = metric.vendas + Math.round(orderData.total);
        return {
          ...metric,
          pedidos: newPedidos,
          vendas: newVendas,
          ticketMedio: Math.round(newVendas / newPedidos)
        };
      }
      return metric;
    });

    const newState: StoreState = {
      ...state,
      products: updatedProducts,
      orders: [newOrder, ...state.orders],
      customers: updatedCustomers,
      dailySales: updatedDailySales
    };

    this.saveState(newState);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order["status"]): void {
    const state = this.getState();
    const updatedOrders = state.orders.map(o => (o.id === orderId ? { ...o, status } : o));
    this.saveState({ ...state, orders: updatedOrders });
  },

  processRefund(orderId: string): void {
    const state = this.getState();
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    // Restaurar estoque
    const updatedProducts = state.products.map(p => {
      const item = order.items.find(i => i.productId === p.id);
      if (item) {
        return { ...p, stock: p.stock + item.quantity };
      }
      return p;
    });

    const updatedOrders = state.orders.map(o => (o.id === orderId ? { ...o, status: "Reembolsado" as const } : o));
    this.saveState({ ...state, products: updatedProducts, orders: updatedOrders });
  },

  saveProduct(product: Product): void {
    const state = this.getState();
    const exists = state.products.some(p => p.id === product.id);
    let updatedProducts: Product[];
    if (exists) {
      updatedProducts = state.products.map(p => (p.id === product.id ? product : p));
    } else {
      updatedProducts = [product, ...state.products];
    }
    this.saveState({ ...state, products: updatedProducts });
  },

  deleteProduct(productId: string): void {
    const state = this.getState();
    const updatedProducts = state.products.filter(p => p.id !== productId);
    this.saveState({ ...state, products: updatedProducts });
  },

  toggleGateway(gatewayId: string): void {
    const state = this.getState();
    const updatedGateways = state.gateways.map(g => (g.id === gatewayId ? { ...g, enabled: !g.enabled } : g));
    this.saveState({ ...state, gateways: updatedGateways });
  },

  toggleSalesChannel(channelId: string): void {
    const state = this.getState();
    const updatedChannels = state.channels.map(c => {
      if (c.id === channelId) {
        const nextEnabled = !c.enabled;
        return {
          ...c,
          enabled: nextEnabled,
          status: (nextEnabled ? "Conectado" : "Desativado") as "Conectado" | "Desativado"
        };
      }
      return c;
    });
    this.saveState({ ...state, channels: updatedChannels });
  },

  toggleApp(appId: string): void {
    const state = this.getState();
    const updatedApps = state.apps.map(a => (a.id === appId ? { ...a, installed: !a.installed } : a));
    this.saveState({ ...state, apps: updatedApps });
  },

  addReview(reviewData: Omit<CustomerReview, "id" | "date" | "helpfulCount" | "userLiked">): CustomerReview {
    const state = this.getState();
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: "Agora mesmo",
      helpfulCount: 0,
      userLiked: false
    };
    const updatedReviews = [newReview, ...state.reviews];

    // If product was specified, update product rating and reviewsCount
    let updatedProducts = state.products;
    if (reviewData.productId) {
      updatedProducts = state.products.map(p => {
        if (p.id === reviewData.productId) {
          const newReviewsCount = p.reviewsCount + 1;
          const newRating = Number(((p.rating * p.reviewsCount + reviewData.rating) / newReviewsCount).toFixed(1));
          return { ...p, reviewsCount: newReviewsCount, rating: newRating };
        }
        return p;
      });
    }

    this.saveState({ ...state, reviews: updatedReviews, products: updatedProducts });
    return newReview;
  },

  voteHelpful(reviewId: string): void {
    const state = this.getState();
    const updatedReviews = state.reviews.map(r => {
      if (r.id === reviewId) {
        const nextLiked = !r.userLiked;
        return {
          ...r,
          userLiked: nextLiked,
          helpfulCount: nextLiked ? r.helpfulCount + 1 : Math.max(0, r.helpfulCount - 1)
        };
      }
      return r;
    });
    this.saveState({ ...state, reviews: updatedReviews });
  },

  syncConnector(connectorId: string): void {
    const state = this.getState();
    const updatedConnectors = state.connectors.map(c => {
      if (c.id === connectorId) {
        return {
          ...c,
          status: "Conectado" as const,
          lastSync: "Agora mesmo"
        };
      }
      return c;
    });
    this.saveState({ ...state, connectors: updatedConnectors });
  },

  resetDatabase(): StoreState {
    const defaultState: StoreState = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      gateways: INITIAL_GATEWAYS,
      channels: INITIAL_CHANNELS,
      apps: INITIAL_APPS,
      dailySales: INITIAL_SALES_METRICS,
      trafficSources: INITIAL_TRAFFIC_SOURCES,
      reviews: INITIAL_REVIEWS,
      connectors: INITIAL_CONNECTORS
    };
    this.saveState(defaultState);
    return defaultState;
  }
};
