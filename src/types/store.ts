export type OrderStatus = "Pendente" | "Pago" | "Em Separação" | "Enviado" | "Entregue" | "Reembolsado" | "Cancelado";

export interface Product {
  id: string;
  name: string;
  category: "Vestuário" | "Acessórios" | "Casa & Decoração" | "Tecnologia & Café";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  stock: number;
  sku: string;
  featured?: boolean;
  isNew?: boolean;
  description: string;
  salesChannels: string[]; // ['Loja Web', 'Instagram', 'TikTok', 'Mercado Livre']
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "Google Pay" | "Cartão Visa" | "Cartão Mastercard" | "Gateway Parceiro";
  paymentGateway: string;
  salesChannel: string;
  trackingCode?: string;
  nfeNumber?: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  tag: "VIP" | "Recorrente" | "Novo Cliente" | "Em Risco";
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: "Nativo" | "Google Pay" | "Visa Direct" | "Mercado Pago" | "Stripe";
  enabled: boolean;
  feePercentage: number;
  fixedFee: number;
  acceptedMethods: string[];
  environment: "Produção" | "Sandbox (Testes)";
}

export interface SalesChannelConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  syncedProducts: number;
  totalSalesChannel: number;
  syncFrequency: "Tempo Real" | "A cada 15 min" | "Manual";
  status: "Conectado" | "Pendente" | "Desativado";
}

export interface AppPlugin {
  id: string;
  name: string;
  category: "Avaliações" | "Recuperação de Vendas" | "Marketing" | "Logística" | "SEO";
  description: string;
  installed: boolean;
  version: string;
  badge?: string;
  activeStatusText: string;
}

export interface DailySalesMetric {
  date: string;
  vendas: number;
  pedidos: number;
  ticketMedio: number;
}

export interface TrafficSourceMetric {
  name: string;
  value: number;
  color: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  avatar?: string;
  location: string;
  rating: number; // 1 to 5
  date: string;
  verifiedPurchase: boolean;
  productName: string;
  productId?: string;
  title: string;
  comment: string;
  helpfulCount: number;
  userLiked?: boolean;
}

export interface SocialConnector {
  id: string;
  platform: "Instagram" | "WhatsApp" | "TikTok" | "YouTube" | "Facebook" | "LinkedIn";
  handle: string;
  status: "Conectado" | "Sincronizado" | "Pendente";
  followersOrReach: string;
  syncedProductsCount: number;
  lastSync: string;
  actionUrl: string;
  actionLabel: string;
  recentPosts?: Array<{
    id: string;
    imageUrl: string;
    title: string;
    likes: string;
    taggedProduct: string;
  }>;
}
