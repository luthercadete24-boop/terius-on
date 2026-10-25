import React, { useState } from "react";
import { Plus, Check, Star, Eye } from "lucide-react";
import { Product } from "../../types/store";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-[#5A5A40]/40 transition-all hover:shadow-md cursor-pointer flex flex-col h-full"
    >
      {/* Product Image Header */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isNew && (
            <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              Novo
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#C05B33] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Alert Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-amber-600/90 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
            Restam {product.stock} un.
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-stone-850 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="font-mono uppercase text-[10px] tracking-wider text-stone-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-stone-700">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-medium text-stone-900 text-sm line-clamp-2 group-hover:text-[#5A5A40] transition-colors mb-2">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
          <div>
            {hasDiscount && (
              <span className="text-[11px] text-stone-400 line-through font-mono block leading-none">
                R$ {product.originalPrice?.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span className="text-base font-bold text-stone-900 font-mono">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center cursor-pointer shadow-2xs ${
              justAdded
                ? "bg-emerald-600 text-white"
                : product.stock <= 0
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-[#5A5A40] hover:bg-[#43432e] text-white active:scale-95"
            }`}
            title="Adicionar ao carrinho"
          >
            {justAdded ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
