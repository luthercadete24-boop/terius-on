import React, { useState } from "react";
import { MessageCircle, X, ExternalLink, Send } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "351963067989",
  defaultMessage = "Olá! Gostaria de informações sobre o Portal de Inteligência Linguística Teríus on."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  const directNumberFormatted = "963067989";
  const intlFormatted = "+351 963 067 989";

  const handleSendMessage = () => {
    const textToSend = customText.trim() || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-scale text-left">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-xs font-serif leading-tight">Suporte Teríus on</h4>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Online no WhatsApp: {directNumberFormatted}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              type="button"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 space-y-3 bg-stone-50/50">
            <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-stone-800 text-xs">
              <span className="block font-bold text-emerald-900 text-[11px] mb-0.5">
                Canal Oficial de Atendimento
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Tire dúvidas sobre lições, certificações ou formas de pagamento via <strong>Google Pay e Visa</strong>.
              </p>
              <div className="mt-1.5 text-[10px] font-mono font-bold text-emerald-800">
                Nº: {intlFormatted} ({directNumberFormatted})
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Sua mensagem:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={defaultMessage}
                rows={2}
                className="w-full p-2 text-xs bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <button
              onClick={handleSendMessage}
              className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              type="button"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Iniciar Conversa no WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg hover:shadow-xl transition-all cursor-pointer touch-manipulation ring-2 ring-white/60 active:scale-95"
        type="button"
        id="floating-whatsapp-btn"
        title={`Fale no WhatsApp: ${directNumberFormatted}`}
      >
        <MessageCircle className="w-5 h-5 fill-current shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-sans tracking-wide">
          WhatsApp <span className="font-mono font-semibold hidden sm:inline">({directNumberFormatted})</span>
        </span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
