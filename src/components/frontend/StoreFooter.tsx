import React from "react";
import StoreLogo from "../common/StoreLogo";
import { ShieldCheck, Lock, Heart, MessageCircle, CreditCard, Sparkles } from "lucide-react";
import { StoreNavTab } from "./StoreHeader";

interface StoreFooterProps {
  onNavigate: (tab: StoreNavTab) => void;
  onOpenAdmin: () => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  onNavigate,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <StoreLogo inverted size="md" />
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Teríus on — Curadoria atemporal de design essencial, matéria-prima autêntica, vitrines dinâmicas, avaliações verificadas e conectores sociais em tempo real.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL 256-bit TLS 1.3</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS Nível 1</span>
              </span>
            </div>
          </div>

          {/* Links Navegação */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-stone-100 tracking-wider">
              Menu de Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("vitrines")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vitrines Dinâmicas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("avaliacoes")}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Avaliações de Clientes</span>
                  <span className="text-[10px] text-amber-400 font-mono">4.9 ★</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("sociais")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Conectores Sociais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("infraestrutura")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Infraestrutura Técnica
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("relatorios")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Análises &amp; Gráficos Nativos
                </button>
              </li>
            </ul>
          </div>

          {/* Políticas e Ajuda */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-stone-100 tracking-wider">
              Canais &amp; Atendimento
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5 text-stone-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/351963067989?text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20pelo%20WhatsApp%20da%20Ter%C3%ADus%20on."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: +351 963 067 989 (963067989)
                </a>
              </li>
              <li>
                <span>Instagram: @terius.on (48.2k)</span>
              </li>
              <li>
                <span>Envio Expresso em até 24 horas</span>
              </li>
              <li>
                <span>Garantia de 30 dias para devolução</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-[#C05B33] hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Acessar Painel Back-End</span>
                  <span className="text-[10px] font-mono bg-stone-800 px-1 rounded-sm text-stone-200">ADMIN</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Formas de Pagamento Aceitas */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-stone-100 tracking-wider">
              Checkout Seguro
            </h4>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-stone-300">
              <span className="bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-700 font-bold text-white flex items-center gap-1">
                <span>Google Pay</span>
              </span>
              <span className="bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-700 font-bold text-white flex items-center gap-1">
                <span>Cartão Visa</span>
              </span>
              <span className="bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-700">
                Mastercard
              </span>
              <span className="bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-700">
                Pix Instantâneo
              </span>
            </div>
            <p className="text-[10px] text-stone-500 pt-1 leading-relaxed">
              Aprovação instantânea em 1 clique via Google Pay ou parcelamento em até 12x no Cartão Visa com tokenização nativa.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-mono gap-4">
          <div>
            © 2026 Teríus on. Todos os direitos reservados. CNPJ 45.123.890/0001-20.
          </div>
          <div className="flex items-center gap-1">
            <span>Portal Profissional • Paleta Natural Tones (Musgo, Terracota & Linho)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
