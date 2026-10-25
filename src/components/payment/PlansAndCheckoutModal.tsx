import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Download,
  Printer,
  X,
  FileText,
  BadgeCheck,
  User,
  Zap,
  HelpCircle
} from "lucide-react";
import { PortalPlan, PaymentTransaction, AllowedPaymentMethod } from "../../types/payment";
import { paymentService, PORTAL_PLANS } from "../../services/paymentService";

interface PlansAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { nome: string; email: string };
  initialPlanId?: string;
  onPaymentSuccess?: (tx: PaymentTransaction) => void;
}

export default function PlansAndCheckoutModal({
  isOpen,
  onClose,
  currentUser,
  initialPlanId,
  onPaymentSuccess
}: PlansAndCheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PortalPlan>(() => {
    const found = PORTAL_PLANS.find((p) => p.id === initialPlanId);
    return found || PORTAL_PLANS[0];
  });

  const [activeTab, setActiveTab] = useState<"checkout" | "history">("checkout");
  const [step, setStep] = useState<"select_plan" | "payment" | "success">("select_plan");
  const [paymentMethod, setPaymentMethod] = useState<AllowedPaymentMethod>("Google Pay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState(currentUser?.nome || "Teríus Aluno");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "aluno@terius.com");
  const [customerCpf, setCustomerCpf] = useState("123.456.789-00");

  // Visa Fields
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardHolder, setCardHolder] = useState(currentUser?.nome?.toUpperCase() || "TERIUS ALUNO");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");
  const [installments, setInstallments] = useState(1);

  // Success Transaction
  const [createdTransaction, setCreatedTransaction] = useState<PaymentTransaction | null>(null);

  // Transactions list
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() =>
    paymentService.getTransactions()
  );

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PortalPlan) => {
    setSelectedPlan(plan);
    setStep("payment");
  };

  const handleProcessGooglePay = async () => {
    setIsProcessing(true);
    try {
      const tx = await paymentService.processGooglePayPayment({
        plan: selectedPlan,
        customerName,
        customerEmail
      });
      setCreatedTransaction(tx);
      setTransactions(paymentService.getTransactions());
      onPaymentSuccess?.(tx);
      setStep("success");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessVisa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const tx = await paymentService.processVisaPayment({
        plan: selectedPlan,
        customerName,
        customerEmail,
        customerCpf,
        cardNumber,
        cardExpiry,
        cardCvv,
        installments
      });
      setCreatedTransaction(tx);
      setTransactions(paymentService.getTransactions());
      onPaymentSuccess?.(tx);
      setStep("success");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    return raw;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[96vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-scale flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/20 flex items-center justify-center text-[#5A5A40] shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                Portal de Inteligência — Planos & Pagamento
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Checkout seguro com autenticação via Google Pay ou Cartão Visa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab(activeTab === "checkout" ? "history" : "checkout")}
              className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
              type="button"
            >
              {activeTab === "checkout" ? `Comprovantes (${transactions.length})` : "Voltar aos Planos"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Fechar"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {activeTab === "history" ? (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-800 text-base flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#5A5A40]" />
                Histórico de Transações & Assinaturas
              </h4>

              {transactions.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 text-sm">
                  Nenhuma transação registrada ainda neste dispositivo.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 font-serif text-sm">
                            {tx.planName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-stone-500 font-mono text-[11px]">
                          Autenticação: {tx.authorizationCode} • ID: {tx.id}
                        </div>
                        <div className="text-stone-500">
                          Forma de Pagamento:{" "}
                          <strong className="text-stone-800 font-semibold">{tx.paymentMethod}</strong>
                          {tx.cardLast4 ? ` (Final ${tx.cardLast4})` : ""}
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                        <div className="font-mono font-bold text-stone-900 text-sm">
                          R$ {tx.amount.toFixed(2).replace(".", ",")}
                        </div>
                        <div className="text-stone-400 text-[10px]">
                          {new Date(tx.createdAt).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(tx.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* STEP 1: SELECT PLAN */}
              {step === "select_plan" && (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h4 className="font-serif text-2xl font-bold text-[#5A5A40]">
                      Eleve sua Proficiência no Portal
                    </h4>
                    <p className="text-xs text-stone-600">
                      Escolha o plano ideal e pague com rapidez e total segurança através do{" "}
                      <strong>Google Pay</strong> ou <strong>Cartão Visa</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PORTAL_PLANS.map((plan) => {
                      const isSelected = selectedPlan.id === plan.id;
                      return (
                        <div
                          key={plan.id}
                          className={`rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
                            plan.recommended
                              ? "border-[#5A5A40] bg-[#FAFAF7] shadow-md ring-1 ring-[#5A5A40]"
                              : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs"
                          }`}
                        >
                          {plan.badge && (
                            <span
                              className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                plan.recommended
                                  ? "bg-[#5A5A40] text-white"
                                  : "bg-[#C05B33] text-white"
                              }`}
                            >
                              {plan.badge}
                            </span>
                          )}

                          <div className="space-y-3">
                            <h5 className="font-serif font-bold text-stone-900 text-base">
                              {plan.name}
                            </h5>
                            <div className="mt-2">
                              <span className="text-2xl font-bold font-serif text-stone-900">
                                R$ {plan.price.toFixed(2).replace(".", ",")}
                              </span>
                              <span className="text-[11px] text-stone-500 ml-1">/{plan.period}</span>
                            </div>
                            {plan.installmentText && (
                              <p className="text-[10px] text-stone-500 font-mono">
                                {plan.installmentText}
                              </p>
                            )}
                            <p className="text-xs text-stone-600 leading-relaxed pt-2">
                              {plan.description}
                            </p>

                            <ul className="space-y-1.5 pt-3 border-t border-stone-150">
                              {plan.features.map((feat, idx) => (
                                <li key={idx} className="text-[11px] text-stone-700 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-5 mt-4 border-t border-stone-150">
                            <button
                              type="button"
                              onClick={() => handleSelectPlan(plan)}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                isSelected || plan.recommended
                                  ? "bg-[#5A5A40] hover:bg-[#43432e] text-white shadow-xs"
                                  : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                              }`}
                            >
                              <span>Selecionar & Pagar</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trust Footer */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#5A5A40]" />
                      <span>Transações criptografadas com protocolo SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 font-bold">
                        Google Pay
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 font-bold">
                        Visa Direct
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CHECKOUT / PAYMENT WITH GOOGLE PAY OR VISA */}
              {step === "payment" && (
                <div className="space-y-6">
                  {/* Plan summary badge */}
                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#5A5A40]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                          Plano Escolhido:
                        </span>
                        <strong className="font-serif font-bold text-stone-900 text-base">
                          {selectedPlan.name}
                        </strong>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {selectedPlan.installmentText || selectedPlan.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-stone-500">Valor Final:</span>
                        <div className="font-serif font-bold text-xl text-stone-900">
                          R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("select_plan")}
                        className="text-xs text-[#5A5A40] hover:underline font-mono"
                      >
                        Trocar
                      </button>
                    </div>
                  </div>

                  {/* Payment Methods Tabs (Google Pay & Visa - NO PIX) */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                      Forma de Pagamento (Google Pay ou Cartão Visa)
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Google Pay Tab */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Google Pay")}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === "Google Pay"
                            ? "bg-[#5A5A40]/10 border-[#5A5A40] text-[#5A5A40] font-bold shadow-xs"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-base font-bold font-sans">
                          <span>G</span>
                          <span className="text-stone-900">Pay</span>
                        </div>
                        <span className="text-[11px] font-mono">Google Pay 1-Clique</span>
                      </button>

                      {/* Visa Card Tab */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Cartão Visa")}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === "Cartão Visa"
                            ? "bg-[#5A5A40]/10 border-[#5A5A40] text-[#5A5A40] font-bold shadow-xs"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-base font-bold font-serif text-blue-900">
                          <CreditCard className="w-5 h-5 text-blue-800" />
                          <span>VISA</span>
                        </div>
                        <span className="text-[11px] font-mono">Crédito & Débito Visa</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Info Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Nome do Aluno
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        E-mail para Confirmação & Acesso
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                      />
                    </div>
                  </div>

                  {/* METHOD 1: GOOGLE PAY */}
                  {paymentMethod === "Google Pay" && (
                    <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
                            GPay
                          </div>
                          <div>
                            <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                              Google Pay Fast Checkout
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              Pague com sua conta Google vinculada instantaneamente
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          <Lock className="w-3 h-3" />
                          <span>Autenticação Biometria/Conta</span>
                        </div>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                        <div className="flex justify-between text-stone-600">
                          <span>Item:</span>
                          <span className="font-semibold text-stone-900">{selectedPlan.name}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Beneficiário:</span>
                          <span className="font-semibold text-stone-900">Teríus on — Portal de Inteligência</span>
                        </div>
                        <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-2 text-sm">
                          <span>Total a cobrar no Google Pay:</span>
                          <span>R$ {selectedPlan.price.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleProcessGooglePay}
                        disabled={isProcessing}
                        className="w-full py-4 rounded-2xl bg-black hover:bg-stone-800 text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Processando com o Google Pay...</span>
                          </div>
                        ) : (
                          <>
                            <span className="font-semibold">Pagar com</span>
                            <span className="font-bold tracking-tight text-base">G Pay</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* METHOD 2: CARTÃO VISA */}
                  {paymentMethod === "Cartão Visa" && (
                    <form onSubmit={handleProcessVisa} className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-white font-bold text-xs rounded font-serif tracking-wider">
                            VISA
                          </span>
                          <div>
                            <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                              Cartão de Crédito ou Débito Visa
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              Processamento direto e seguro via rede Visa
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono">Visa Direct SSL</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Número do Cartão Visa
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder="4000 1234 5678 9010"
                              maxLength={19}
                              className="w-full pl-3.5 pr-12 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                            />
                            <span className="absolute right-3 top-2.5 font-serif font-bold text-xs text-blue-900">
                              VISA
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Nome Impresso no Cartão
                          </label>
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            placeholder="NOME CONFORME CARTAO"
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono uppercase text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              Validade
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              CPF Titular
                            </label>
                            <input
                              type="text"
                              required
                              value={customerCpf}
                              onChange={(e) => setCustomerCpf(e.target.value)}
                              placeholder="000.000.000-00"
                              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Opções de Parcelamento
                          </label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#5A5A40]"
                          >
                            <option value={1}>
                              1x de R$ {selectedPlan.price.toFixed(2).replace(".", ",")} (À vista sem juros)
                            </option>
                            <option value={2}>
                              2x de R$ {(selectedPlan.price / 2).toFixed(2).replace(".", ",")} sem juros
                            </option>
                            <option value={3}>
                              3x de R$ {(selectedPlan.price / 3).toFixed(2).replace(".", ",")} sem juros
                            </option>
                            <option value={6}>
                              6x de R$ {(selectedPlan.price / 6).toFixed(2).replace(".", ",")} sem juros
                            </option>
                            <option value={12}>
                              12x de R$ {(selectedPlan.price / 12).toFixed(2).replace(".", ",")} sem juros
                            </option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 rounded-2xl bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Autorizando Cartão Visa...</span>
                          </div>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Confirmar Pagamento no Cartão Visa</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* STEP 3: SUCCESS & RECEIPT */}
              {step === "success" && createdTransaction && (
                <div className="space-y-6 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-2xl text-stone-900">
                      Pagamento Aprovado com Sucesso!
                    </h4>
                    <p className="text-xs text-stone-600">
                      Sua matrícula / plano foi ativado instantaneamente no Portal de Inteligência.
                    </p>
                  </div>

                  {/* Official Receipt Card */}
                  <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 text-left space-y-4 max-w-lg mx-auto shadow-inner text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase">Recibo Oficial</span>
                        <div className="font-bold text-stone-900 font-serif text-sm">
                          Teríus on — Inteligência Linguística
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {createdTransaction.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-stone-600">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Código Autenticação:</span>
                        <strong className="text-stone-900 font-bold">{createdTransaction.authorizationCode}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">ID Transação:</span>
                        <span className="text-stone-900">{createdTransaction.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Forma de Pagamento:</span>
                        <strong className="text-stone-900">
                          {createdTransaction.paymentMethod}
                          {createdTransaction.cardLast4 ? ` (Final ${createdTransaction.cardLast4})` : ""}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Data & Hora:</span>
                        <span className="text-stone-900">
                          {new Date(createdTransaction.createdAt).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-stone-200 pt-3">
                      <div className="flex justify-between text-stone-700">
                        <span>Plano Adquirido:</span>
                        <strong className="text-stone-900">{createdTransaction.planName}</strong>
                      </div>
                      <div className="flex justify-between text-stone-700 mt-1">
                        <span>Aluno:</span>
                        <span className="text-stone-900">{createdTransaction.customerName}</span>
                      </div>
                      <div className="flex justify-between text-stone-900 font-bold text-base mt-2 pt-2 border-t border-dashed border-stone-300">
                        <span>Valor Total Pago:</span>
                        <span>R$ {createdTransaction.amount.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrintReceipt}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir Comprovante</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#43432e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>Acessar Portal Agora</span>
                    </button>
                  </div>
                </div>
              )}

              {/* WhatsApp Help link */}
              <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
                <span>Dúvidas com o pagamento ou planos?</span>
                <a
                  href="https://wa.me/351963067989?text=Ol%C3%A1!%20Estou%20no%20checkout%20da%20Ter%C3%ADus%20on%20e%20gostaria%20de%20tirar%20d%C3%BAvidas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  Atendimento no WhatsApp: 963067989
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
