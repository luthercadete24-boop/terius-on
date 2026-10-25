import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Truck,
  ArrowRight,
  ExternalLink,
  Lock,
  Copy,
  Check
} from "lucide-react";
import { CartItem, Order } from "../../types/store";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onCompleteOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: Order["items"];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    paymentMethod: Order["paymentMethod"];
    paymentGateway: string;
    salesChannel: string;
    shippingAddress: Order["shippingAddress"];
  }) => Order;
  onViewOrderInAdmin: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  shipping,
  discount,
  total,
  onCompleteOrder,
  onViewOrderInAdmin
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("Beatriz Nogueira");
  const [email, setEmail] = useState("beatriz.silveira@email.com");
  const [phone, setPhone] = useState("(11) 98765-4321");
  const [street, setStreet] = useState("Rua Oscar Freire");
  const [number, setNumber] = useState("1420");
  const [neighborhood, setNeighborhood] = useState("Jardins");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [zipCode, setZipCode] = useState("01426-001");

  const [paymentMethod, setPaymentMethod] = useState<
    "Google Pay" | "Cartão Visa" | "Cartão Mastercard" | "Pix Instantâneo"
  >("Google Pay");

  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardHolder, setCardHolder] = useState("BEATRIZ N SILVEIRA");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("842");

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      }));

      const newOrder = onCompleteOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: orderItems,
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod: paymentMethod === "Google Pay" ? "Google Pay" : paymentMethod === "Pix Instantâneo" ? "Pix Instantâneo" : "Cartão Visa",
        paymentGateway: paymentMethod === "Google Pay" ? "Google Pay / Nativo" : paymentMethod === "Pix Instantâneo" ? "Gateway Nativo" : "Visa Direct",
        salesChannel: "Loja Web",
        shippingAddress: {
          street,
          number,
          neighborhood,
          city,
          state,
          zipCode
        }
      });

      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setStep(4); // Success step
    }, 1200);
  };

  const copyPixCode = () => {
    navigator.clipboard?.writeText(
      "00020126580014br.gov.bcb.pix0136terius-store-checkout-live-key5204000053039865802BR5915Terius Store6009Sao Paulo62070503***6304ABCD"
    );
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-scale">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#5A5A40]" />
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Checkout Seguro & Rápido
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {step === 4 ? "Pedido Concluído com Sucesso" : `Etapa ${step} de 2 • Finalização`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-5">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono">
                1. Identificação & Endereço de Entrega
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    E-mail para Confirmação e Nota Fiscal
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">CEP</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Endereço (Rua/Avenida)
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Número</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bairro / Cidade - UF
                  </label>
                  <input
                    type="text"
                    required
                    value={`${neighborhood}, ${city} - ${state}`}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Order quick summary bar */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-stone-500">Total a pagar:</span>
                  <span className="ml-2 font-bold text-base text-stone-900">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Ir para o Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono">
                  2. Escolha o Método de Pagamento
                </h4>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Editar Endereço
                </button>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Google Pay")}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "Google Pay"
                      ? "border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] font-bold shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span className="font-sans font-bold text-xs">G Pay</span>
                  <span className="text-[10px] font-mono">Google Pay</span>
                </button>

                {/* Visa Direct */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Cartão Visa")}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "Cartão Visa"
                      ? "border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] font-bold shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Visa / Master</span>
                </button>

                {/* Pix */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Pix Instantâneo")}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "Pix Instantâneo"
                      ? "border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] font-bold shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Pix Instantâneo</span>
                </button>
              </div>

              {/* Payment details panel */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                {paymentMethod === "Google Pay" && (
                  <div className="text-center space-y-4 py-2">
                    <div className="w-12 h-12 bg-white rounded-full mx-auto shadow-xs border border-stone-200 flex items-center justify-center font-bold text-stone-800">
                      G
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-stone-900">
                        Pague com facilidade via Google Pay
                      </h5>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                        Utiliza com segurança seu cartão cadastrado no Google Wallet com proteção de dados ponta a ponta.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200 inline-block text-xs font-mono text-stone-600">
                      Cartão padrão: Visa •••• 8892 • Autenticação Biométrica Pronta
                    </div>
                  </div>
                )}

                {paymentMethod === "Cartão Visa" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-stone-800 to-stone-900 text-white p-4 rounded-2xl shadow-sm space-y-3 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-300">VISA INFINITE</span>
                        <span className="text-emerald-400 font-bold">NATIVO SEGURO</span>
                      </div>
                      <div className="text-lg tracking-widest">{cardNumber}</div>
                      <div className="flex justify-between text-[11px] text-stone-300">
                        <span>{cardHolder}</span>
                        <span>EXP: {cardExpiry}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Parcelamento
                        </label>
                        <select className="w-full p-2 bg-white border border-stone-200 rounded-xl">
                          <option>1x de R$ {total.toFixed(2)} (sem juros)</option>
                          <option>3x de R$ {(total / 3).toFixed(2)} (sem juros)</option>
                          <option>6x de R$ {(total / 6).toFixed(2)} (sem juros)</option>
                          <option>12x de R$ {(total / 12).toFixed(2)} (sem juros)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Código CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-200 rounded-xl font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "Pix Instantâneo" && (
                  <div className="space-y-4 text-center">
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 inline-block shadow-xs">
                      <div className="w-36 h-36 bg-stone-900 text-white flex flex-col items-center justify-center rounded-xl mx-auto p-2">
                        <QrCode className="w-28 h-28" />
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 mt-2 block">
                        Aponte a câmera do aplicativo do seu banco
                      </span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={copyPixCode}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                      >
                        {copiedPix ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Código Pix Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Código Pix (Copia e Cola)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="px-6 py-3.5 bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processando Pagamento...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirmar Pagamento de R$ {total.toFixed(2).replace(".", ",")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-mono font-bold text-emerald-700 tracking-wider">
                  Pagamento Confirmado com Sucesso!
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Obrigado pela sua compra, {createdOrder.customerName}!
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-2">
                  Enviamos todos os detalhes do seu pedido e o comprovante para o e-mail{" "}
                  <strong>{createdOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order Info Receipt Card */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 text-left max-w-lg mx-auto space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Número do Pedido:</span>
                  <span className="font-bold text-stone-900">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Nota Fiscal Emitida:</span>
                  <span className="font-bold text-[#5A5A40]">{createdOrder.nfeNumber}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Código de Rastreamento:</span>
                  <span className="font-bold text-stone-900">{createdOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Forma de Pagamento:</span>
                  <span className="font-bold text-stone-900">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span>Total Pago:</span>
                  <span className="text-[#5A5A40]">
                    R$ {createdOrder.total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewOrderInAdmin(createdOrder.id);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Pedido no Painel de Controle (Back-End)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Voltar à Loja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
