import { PortalPlan, PaymentTransaction, AllowedPaymentMethod } from "../types/payment";

export const PORTAL_PLANS: PortalPlan[] = [
  {
    id: "plano-pro-mensal",
    name: "Plano Aluno Pro",
    badge: "Mais Popular",
    price: 49.9,
    period: "por mês",
    installmentText: "Cobrança mensal recorrente com cancelamento livre",
    description: "Acesso integral aos laboratórios de idiomas, lições interativas, áudios neurais e simulados ilimitados.",
    features: [
      "Acesso irrestrito a todos os idiomas e níveis",
      "Síntese de voz neural avançada com múltiplos sotaques",
      "Quizzes dinâmicos e correções morfológicas em tempo real",
      "Sincronização em nuvem e estudo em modo offline",
      "Agenda de estudos inteligente e metas diárias"
    ],
    recommended: true
  },
  {
    id: "plano-certificacao",
    name: "Certificação Oficial de Proficiência",
    badge: "Banca Examinadora",
    price: 129.0,
    period: "pagamento único",
    installmentText: "ou até 3x de R$ 43,00 sem juros",
    description: "Emissão de Certificado Internacional de Proficiência com código de validação e banca examinadora.",
    features: [
      "Avaliação final oficial com banca avaliadora",
      "Emissão de Certificado Digital com QR Code internacional",
      "Relatório detalhado de proficiência por competência CEFR",
      "Até 3 tentativas de reexame incluídas",
      "Válido para comprovação acadêmica e profissional"
    ]
  },
  {
    id: "plano-vitalicio-master",
    name: "Acesso Vitalício Teríus Master",
    badge: "Melhor Custo-Benefício",
    price: 289.0,
    period: "acesso vitalício",
    installmentText: "ou até 12x de R$ 28,90 no Cartão Visa",
    description: "Acesso perpétuo a toda a infraestrutura do Portal de Inteligência, novos módulos e ferramentas de IA.",
    features: [
      "Acesso para sempre a todos os cursos atuais e futuros",
      "Todas as certificações de proficiência inclusas",
      "Tradutor Universal ilimitado com modelos neurais",
      "Dicionário etimológico completo e exportação de áudios",
      "Suporte prioritário e mentorias exclusivas"
    ]
  }
];

const PAYMENTS_STORAGE_KEY = "terius_portal_payments";

export const paymentService = {
  getPlans(): PortalPlan[] {
    return PORTAL_PLANS;
  },

  getTransactions(): PaymentTransaction[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  hasActivePlan(): boolean {
    const txs = this.getTransactions();
    return txs.length > 0;
  },

  getActivePlan(): PaymentTransaction | null {
    const txs = this.getTransactions();
    return txs.length > 0 ? txs[0] : null;
  },

  saveTransaction(tx: PaymentTransaction): void {
    if (typeof window === "undefined") return;
    const current = this.getTransactions();
    const updated = [tx, ...current];
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
  },

  processGooglePayPayment(params: {
    plan: PortalPlan;
    customerName: string;
    customerEmail: string;
  }): Promise<PaymentTransaction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomAuth = Math.floor(100000 + Math.random() * 900000);
        const tx: PaymentTransaction = {
          id: `TX-GPAY-${Date.now()}`,
          planId: params.plan.id,
          planName: params.plan.name,
          amount: params.plan.price,
          paymentMethod: "Google Pay",
          authorizationCode: `GPAY-AUTH-${randomAuth}`,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          createdAt: new Date().toISOString(),
          status: "Aprovado"
        };
        this.saveTransaction(tx);
        resolve(tx);
      }, 1000);
    });
  },

  processVisaPayment(params: {
    plan: PortalPlan;
    customerName: string;
    customerEmail: string;
    customerCpf: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    installments: number;
  }): Promise<PaymentTransaction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanNumber = params.cardNumber.replace(/\D/g, "");
        const last4 = cleanNumber.slice(-4) || "4242";
        const randomAuth = Math.floor(100000 + Math.random() * 900000);
        const tx: PaymentTransaction = {
          id: `TX-VISA-${Date.now()}`,
          planId: params.plan.id,
          planName: params.plan.name,
          amount: params.plan.price,
          paymentMethod: "Cartão Visa",
          cardLast4: last4,
          authorizationCode: `VISA-DIRECT-${randomAuth}`,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          customerCpf: params.customerCpf,
          installments: params.installments,
          createdAt: new Date().toISOString(),
          status: "Aprovado"
        };
        this.saveTransaction(tx);
        resolve(tx);
      }, 1200);
    });
  }
};
