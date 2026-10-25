import React from "react";
import { Search, ShoppingBag, LayoutDashboard, Menu, X, ArrowRight, ShieldCheck, Star } from "lucide-react";
import StoreLogo from "../common/StoreLogo";

export type StoreNavTab =
  | "home"
  | "vitrines"
  | "avaliacoes"
  | "sociais"
  | "infraestrutura"
  | "relatorios";

interface StoreHeaderProps {
  currentTab: StoreNavTab;
  onSelectTab: (tab: StoreNavTab) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onSwitchToBackend: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
  onSwitchToBackend,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: Array<{ id: StoreNavTab; label: string; badge?: string }> = [
    { id: "home", label: "Início" },
    { id: "vitrines", label: "Vitrines Dinâmicas" },
    { id: "avaliacoes", label: "Avaliações", badge: "4.9 ★" },
    { id: "sociais", label: "Redes Sociais" },
    { id: "infraestrutura", label: "Infraestrutura Técnica" },
    { id: "relatorios", label: "Análises & Gráficos" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      {/* Top Banner Informativo com Cores Originais */}
      <div className="bg-[#5A5A40] text-stone-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-[#C05B33] text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm">
              Destaque
            </span>
            <span className="font-sans text-[11px] sm:text-xs">
              Frete Grátis em compras acima de R$ 250 • Pagamento instantâneo via <strong>Google Pay</strong> &amp; <strong>Cartão Visa</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-3">
            <button
              onClick={() => onSelectTab("infraestrutura")}
              className="hidden md:flex items-center gap-1 text-[11px] text-stone-200 hover:text-white cursor-pointer font-medium"
            >
              <span>Infraestrutura</span>
            </button>

            <span className="hidden md:inline text-stone-400">•</span>

            <button
              onClick={() => onSelectTab("relatorios")}
              className="flex items-center gap-1.5 text-xs text-stone-200 hover:text-white font-medium cursor-pointer transition-colors"
              title="Acessar Relatórios e Gráficos Nativos"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span className="underline font-semibold">Relatórios</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSelectTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer shrink-0"
        >
          <StoreLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs uppercase font-medium tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-md font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentTab !== "vitrines" && e.target.value.trim()) {
                  onSelectTab("vitrines");
                }
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#5A5A40] focus:bg-white transition-all"
            />
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl shadow-xs transition-all cursor-pointer active:scale-98 shrink-0"
            aria-label="Ver Carrinho de Compras"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C05B33] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-stone-300 uppercase font-mono">Sacola</span>
              <span className="text-xs font-bold font-mono">
                R$ {cartTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 xl:hidden text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl cursor-pointer"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3 animate-fade-in shadow-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentTab !== "vitrines" && e.target.value.trim()) {
                  onSelectTab("vitrines");
                }
              }}
              className="w-full pl-9 pr-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  currentTab === item.id
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-xs font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Google Pay & Visa ativos</span>
            <span className="text-emerald-700 font-bold font-mono">SSL 256-bit</span>
          </div>
        </div>
      )}
    </header>
  );
};
export default StoreHeader;
