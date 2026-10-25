import React from "react";
import { Truck, ShieldCheck, CreditCard, Headphones, Sparkles } from "lucide-react";

export const DiferenciaisSection: React.FC = () => {
  const items = [
    {
      icon: Truck,
      title: "Logística Inteligente",
      description: "Envio rápido em até 24h úteis para todo o país com rastreamento em tempo real."
    },
    {
      icon: CreditCard,
      title: "Google Pay & Visa Direct",
      description: "Checkout em 1 clique ou parcelamento em até 12x com proteção antifraude ativa."
    },
    {
      icon: ShieldCheck,
      title: "Garantia & Troca Fácil",
      description: "30 dias de garantia incondicional e primeira troca totalmente gratuita."
    },
    {
      icon: Headphones,
      title: "Suporte Especializado",
      description: "Equipe disponível via WhatsApp e e-mail com tempo médio de resposta de 15 minutos."
    }
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 hover:border-[#5A5A40]/30 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiferenciaisSection;
