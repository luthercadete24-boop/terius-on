import React, { useState } from "react";
import { X, Star, ShoppingBag, Truck, ShieldCheck, Check, Share2 } from "lucide-react";
import { Product } from "../../types/store";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full shadow-xs cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-[#5A5A40] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Novo Lançamento
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="font-mono text-[#5A5A40] font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">
                  ({product.reviewsCount} avaliações verificadas)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold font-mono text-stone-900">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    R$ {product.originalPrice?.toFixed(2).replace(".", ",")}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Em até 6x sem juros
                </span>
              </div>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Stock status */}
              <div className="text-xs font-mono text-stone-600 flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Estoque disponível: <strong>{product.stock} unidades</strong></span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold font-mono text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-[#5A5A40] hover:bg-[#43432e] text-white"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Item Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Cálculo de frete no checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>30 dias para devolução</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
