export type AllowedPaymentMethod = "Google Pay" | "Cartão Visa";

export interface PortalPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  period: string;
  installmentText?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface PaymentTransaction {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: AllowedPaymentMethod;
  cardLast4?: string;
  authorizationCode: string;
  customerName: string;
  customerEmail: string;
  customerCpf?: string;
  installments?: number;
  createdAt: string;
  status: "Aprovado" | "Processando";
}
