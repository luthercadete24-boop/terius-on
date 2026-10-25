import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, CreditCard } from "lucide-react";

interface HeroBannerProps {
  onExploreCollection: () => void;
  onExploreCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCollection,
  onExploreCategory
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAEAE0]/60 to-[#F5F5F0] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-mono text-[#5A5A40] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C05B33]" />
              <span className="font-semibold">Nova Coleção Outono/Inverno 2026</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#C05B33] font-bold">Edição Limitada</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Design essencial, matéria-prima autêntica e longevidade.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
              Descubra uma curadoria atemporal de vestuário, acessórios em couro vegetal e objetos de design contemporâneo. Produzidos para quem valoriza substância, acabamento e sustentabilidade.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCollection}
                className="px-6 py-3.5 bg-[#5A5A40] hover:bg-[#43432e] text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Explorar Todos os Produtos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreCategory("Vestuário")}
                className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-medium text-sm rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Ver Vestuário
              </button>

              <button
                onClick={() => onExploreCategory("Casa & Decoração")}
                className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-medium text-sm rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Casa & Design
              </button>
            </div>

            {/* Quick Micro-Badges */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-600">
                <Truck className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span className="text-xs font-medium">Envio em 24h</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <CreditCard className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span className="text-xs font-medium">Google Pay & Visa</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <ShieldCheck className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span className="text-xs font-medium">30 Dias p/ Trocas</span>
              </div>
            </div>
          </div>

          {/* Featured Visual Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-stone-200 aspect-4/5 group">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80"
                  alt="Coleção Destaque"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-semibold mb-1">
                    Peça Assinatura
                  </span>
                  <h3 className="font-serif text-xl font-bold">Jaqueta Corta-Vento Minimalista</h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                    <span className="text-base font-bold font-mono">R$ 389,90</span>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium">
                      Estoque Limitado
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-lg border border-stone-200 max-w-[200px] hidden sm:block">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                    alt="Caneca Terracota"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">Top Avaliado</span>
                    <span className="text-xs font-bold text-stone-800 leading-tight block">Caneca Terracota</span>
                    <span className="text-xs font-bold text-[#C05B33] font-mono">★ 4.9 (54)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
