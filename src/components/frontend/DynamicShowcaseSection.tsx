import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  Star,
  Tag,
  Layers,
  ArrowUpDown,
  ShoppingBag,
  Eye,
  Check,
  CreditCard,
  Zap,
  Filter
} from "lucide-react";
import { Product } from "../../types/store";

export type ShowcaseTab = "mais_vendidos" | "lancamentos" | "destaques" | "ofertas" | "todos";

interface DynamicShowcaseSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onFastCheckoutItem?: (product: Product) => void;
}

export const DynamicShowcaseSection: React.FC<DynamicShowcaseSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onFastCheckoutItem
}) => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("mais_vendidos");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [sortOption, setSortOption] = useState<"relevancia" | "preco_menor" | "preco_maior" | "avaliacao">("relevancia");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = ["Todas", "Vestuário", "Acessórios", "Casa & Decoração", "Tecnologia & Café"];

  // Filter by Tab
  const getTabFilteredProducts = () => {
    switch (activeTab) {
      case "mais_vendidos":
        return [...products].sort((a, b) => b.reviewsCount - a.reviewsCount);
      case "lancamentos":
        return products.filter((p) => p.isNew || p.id === "prod-1" || p.id === "prod-4");
      case "destaques":
        return products.filter((p) => p.featured);
      case "ofertas":
        return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
      case "todos":
      default:
        return products;
    }
  };

  // Filter by Category
  const categoryFiltered = getTabFilteredProducts().filter((p) => {
    if (selectedCategory === "Todas") return true;
    return p.category === selectedCategory;
  });

  // Apply Sorting
  const sortedProducts = [...categoryFiltered].sort((a, b) => {
    if (sortOption === "preco_menor") return a.price - b.price;
    if (sortOption === "preco_maior") return b.price - a.price;
    if (sortOption === "avaliacao") return b.rating - a.rating;
    return 0; // relevancia
  });

  const handleAddToCartWithToast = (product: Product) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  return (
    <section id="vitrines-dinamicas" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs font-mono text-[#5A5A40] shadow-2xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C05B33]" />
              <span className="font-semibold">Curadoria Exclusiva & Estoque ao Vivo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Vitrines Dinâmicas
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Navegue pelas seleções inteligentes da Teríus on atualizadas em tempo real com disponibilidade imediata.
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono uppercase text-stone-500 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Ordenar:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
            >
              <option value="relevancia">Relevância Curada</option>
              <option value="preco_menor">Menor Preço</option>
              <option value="preco_maior">Maior Preço</option>
              <option value="avaliacao">Mais Bem Avaliados (★)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Showcase Vitrines Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar border-b border-stone-100">
          <button
            onClick={() => setActiveTab("mais_vendidos")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "mais_vendidos"
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Flame className="w-4 h-4 text-[#C05B33]" />
            <span>Mais Vendidos</span>
          </button>

          <button
            onClick={() => setActiveTab("lancamentos")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "lancamentos"
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Lançamentos</span>
          </button>

          <button
            onClick={() => setActiveTab("destaques")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "destaques"
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Destaques</span>
          </button>

          <button
            onClick={() => setActiveTab("ofertas")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "ofertas"
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Tag className="w-4 h-4 text-[#C05B33]" />
            <span>Ofertas Especiais</span>
          </button>

          <button
            onClick={() => setActiveTab("todos")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === "todos"
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Layers className="w-4 h-4 text-stone-500" />
            <span>Todo o Catálogo ({products.length})</span>
          </button>
        </div>

        {/* Secondary Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs text-stone-400 font-mono uppercase mr-1">Categoria:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-500 font-mono">
            {sortedProducts.length} produto(s) exibido(s)
          </span>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-stone-800 text-lg">Nenhum produto encontrado nesta vitrine</h4>
            <p className="text-xs text-stone-500 mt-1">Tente alternar a categoria ou limpar os filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {sortedProducts.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                : 0;

              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                      {hasDiscount && (
                        <span className="px-2 py-0.5 bg-[#C05B33] text-white text-[10px] font-bold font-mono uppercase tracking-wider rounded-md shadow-xs">
                          -{discountPercent}% OFF
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-0.5 bg-[#5A5A40] text-white text-[10px] font-bold font-mono uppercase tracking-wider rounded-md shadow-xs">
                          Novo
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono rounded-md">
                        {product.stock} un. restantes
                      </span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => onQuickView(product)}
                      className="absolute bottom-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-stone-800 rounded-xl shadow-md transition-transform transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
                      title="Espiar Detalhes"
                    >
                      <Eye className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <span className="font-mono text-[11px] uppercase text-[#5A5A40] font-semibold">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-mono text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-bold text-stone-800">{product.rating}</span>
                          <span className="text-stone-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#5A5A40] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Fast Payment Support */}
                    <div>
                      <div className="pt-2 border-t border-stone-100 mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              R$ {product.originalPrice!.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          ou 6x de R$ {(product.price / 6).toFixed(2)} s/ juros no <strong className="text-stone-700">Visa</strong>
                        </p>
                      </div>

                      {/* Action Buttons: Add to Bag & Instant Fast Checkout */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCartWithToast(product)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            isAdded
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Adicionado!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#5A5A40]" />
                              <span>Sacola</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (onFastCheckoutItem) {
                              onFastCheckoutItem(product);
                            } else {
                              handleAddToCartWithToast(product);
                            }
                          }}
                          className="py-2 px-2.5 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98 shadow-xs"
                          title="Comprar com Google Pay ou Cartão Visa"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>1-Clique</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
export default DynamicShowcaseSection;
