import React, { useState } from "react";
import { Download, Sparkles, CheckCircle2 } from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import QuickInstallModal from "./QuickInstallModal";

interface PWAInstallButtonProps {
  variant?: "navbar" | "pill" | "banner" | "icon";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "navbar",
  className = ""
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (isInstalled) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors ${className}`}
          type="button"
          title="Aplicativo Teríus on instalado neste dispositivo"
          id="pwa-installed-badge"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">App Instalado</span>
        </button>
        <QuickInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "pill") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white hover:bg-[#43432e] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all ${className}`}
          type="button"
          id="pwa-install-pill-btn"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalação Rápida</span>
        </button>
        <QuickInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "banner") {
    return (
      <>
        <div className="bg-[#5A5A40]/10 border border-[#5A5A40]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#5A5A40] text-white rounded-xl shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 font-serif">
                Instalação Rápida sem Restrições
              </div>
              <p className="text-[11px] text-stone-600">
                Acesse o portal diretamente da sua tela inicial ou desktop com desempenho otimizado.
              </p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#43432e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Instalar Agora</span>
          </button>
        </div>
        <QuickInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#5A5A40] hover:bg-[#5A5A40]/10 text-stone-700 hover:text-[#5A5A40] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all touch-manipulation ${className}`}
        type="button"
        title="Instalar Teríus on no Celular ou Computador sem restrições"
        id="navbar-install-app-btn"
      >
        <Download className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
        <span className="hidden md:inline">Instalar App</span>
        <span className="md:hidden">Instalar</span>
      </button>
      <QuickInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PWAInstallButton;
