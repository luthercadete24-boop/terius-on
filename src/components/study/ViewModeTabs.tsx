import React from "react";
import { BookOpen, Globe, Languages, BarChart3, CreditCard, Sparkles, Server } from "lucide-react";

export type ViewMode = "study" | "dictionary" | "translator" | "analytics" | "plans" | "infrastructure";

interface ViewModeTabsProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
}

export const ViewModeTabs: React.FC<ViewModeTabsProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 border-b border-stone-200 pb-3 sm:pb-5 mb-5 sm:mb-8 overflow-x-auto no-scrollbar scroll-smooth w-full -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      <button
        onClick={() => onSelectMode("study")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "study"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
        type="button"
        id="view-mode-study-btn"
      >
        <BookOpen className="w-4 h-4 shrink-0" />
        <span>Sala de Estudos</span>
      </button>

      <button
        onClick={() => onSelectMode("dictionary")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "dictionary"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
        type="button"
        id="view-mode-dictionary-btn"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span>Dicionário Multilíngue</span>
      </button>

      <button
        onClick={() => onSelectMode("translator")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "translator"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
        type="button"
        id="view-mode-translator-btn"
      >
        <Languages className="w-4 h-4 shrink-0" />
        <span>Tradutor Universal</span>
      </button>

      <button
        onClick={() => onSelectMode("analytics")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "analytics"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
        type="button"
        id="view-mode-analytics-btn"
      >
        <BarChart3 className="w-4 h-4 shrink-0" />
        <span>Desempenho & Gráficos</span>
      </button>

      <button
        onClick={() => onSelectMode("plans")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "plans"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-[#FAFAF7] border border-[#5A5A40]/30 text-[#5A5A40] hover:bg-[#5A5A40]/10"
        }`}
        type="button"
        id="view-mode-plans-btn"
      >
        <CreditCard className="w-4 h-4 text-natural-accent shrink-0" />
        <span>Planos & Pagamento</span>
        <span className="hidden lg:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-stone-200/80 font-mono text-stone-800">
          G Pay • Visa
        </span>
      </button>

      <button
        onClick={() => onSelectMode("infrastructure")}
        className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 touch-manipulation ${
          currentMode === "infrastructure"
            ? "bg-natural-primary text-white shadow-md font-bold"
            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
        type="button"
        id="view-mode-infrastructure-btn"
      >
        <Server className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Infraestruturas</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
          Ativo
        </span>
      </button>
    </div>
  );
};

export default ViewModeTabs;
