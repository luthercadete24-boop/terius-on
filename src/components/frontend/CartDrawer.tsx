import React, { useState } from "react";
import { X, Trash2, ArrowRight, ShoppingBag, Truck, Tag, ShieldCheck } from "lucide-react";
import { CartItem } from "../../types/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  discount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  shipping: number;
  onCalculateShipping: (cep: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discount,
  onApplyCoupon,
  shipping,
  onCalculateShipping
}) => {
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cepInput, setCepInput] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shipping - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ type: "success", text: res.message });
    } else {
      setCouponFeedback({ type: "error", text: res.message });
    }
  };

  const handleCalcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim().length >= 8) {
      onCalculateShipping(cepInput);
      setShippingCalculated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-slide-left">
          {/* Cart Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#5A5A40] text-white rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">Meu Carrinho</h3>
                <span className="text-xs font-mono text-stone-500">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? "item" : "itens"}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-800 mb-1">
                  Seu carrinho está vazio
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Navegue pela nossa vitrine e adicione peças essenciais para seu dia a dia.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#5A5A40] text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 font-mono block mb-1">
                      {item.product.category}
                    </span>
                    <div className="text-xs font-bold font-mono text-[#5A5A40]">
                      R$ {item.product.price.toFixed(2).replace(".", ",")}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-mono font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-stone-900">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Calculations */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 p-6 bg-stone-50/70 space-y-4">
              {/* Shipping Simulator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Calcular Frete (CEP)</span>
                  </span>
                  {subtotal >= 250 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-full">
                      Frete Grátis Qualificado!
                    </span>
                  )}
                </div>
                <form onSubmit={handleCalcShipping} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: 01426-001"
                    maxLength={9}
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Calcular
                  </button>
                </form>
              </div>

              {/* Coupon code */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cupom (ex: BEMVINDO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs uppercase font-mono text-stone-800 focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>
                {couponFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponFeedback.type === "success" ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-stone-200/80 font-mono">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal dos itens</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Frete estimado</span>
                  <span>{shipping === 0 ? "GRÁTIS" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Desconto aplicado</span>
                    <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-[#5A5A40]">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Finalizar Pedido Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Checkout 100% Criptografado & Seguro</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
