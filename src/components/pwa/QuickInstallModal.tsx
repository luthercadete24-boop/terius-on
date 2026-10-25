import React, { useState } from "react";
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Share2,
  PlusSquare,
  Globe,
  Zap,
  Info
} from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface QuickInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickInstallModal: React.FC<QuickInstallModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    install,
    openWithoutIframeRestrictions
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<"auto" | "android" | "ios" | "desktop">(() => {
    if (isIOS) return "ios";
    if (isAndroid) return "android";
    return "auto";
  });

  const [isInstalling, setIsInstalling] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleFastInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        setSuccessToast(true);
        setTimeout(() => {
          setSuccessToast(false);
          onClose();
        }, 2500);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-scale flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Instalação Rápida no Dispositivo
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Sem Restrições
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Execute o Teríus on como aplicativo nativo no celular ou computador
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            type="button"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block font-bold">Aplicativo Instalado com Sucesso!</span>
                <span className="text-emerald-700 font-normal">
                  O Teríus on já está operando em modo independente (standalone).
                </span>
              </div>
            </div>
          ) : successToast ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-semibold animate-fade-in">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block font-bold">Instalação confirmada!</span>
                <span className="text-emerald-700 font-normal">
                  O atalho do Teríus on foi adicionado à sua tela inicial.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Direct 1-Click Install CTA if prompt is captured */}
              {isInstallable && (
                <div className="p-4 sm:p-5 bg-[#5A5A40]/10 border border-[#5A5A40]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#5A5A40] text-white rounded-xl shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-serif">
                        Navegador Pronto para Instalação Rápida
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        O navegador autorizou o prompt direto. Clique para adicionar à tela inicial agora.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFastInstall}
                    disabled={isInstalling}
                    className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#43432e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50 shrink-0"
                    type="button"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalling ? "Instalando..." : "Instalar com 1-Clique"}</span>
                  </button>
                </div>
              )}

              {/* Iframe Restriction Bypass Banner */}
              {isInIframe && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="block font-semibold">
                        Navegador em visualização protegida (Iframe)
                      </strong>
                      <span className="text-amber-800 text-[11px]">
                        Alguns navegadores bloqueiam o botão nativo de instalação quando a página está dentro do painel de testes.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={openWithoutIframeRestrictions}
                    className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-all"
                    type="button"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Sem Restrições</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Device Tabs */}
          <div>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("auto")}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  activeTab === "auto"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                type="button"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Instalação Direta</span>
              </button>

              <button
                onClick={() => setActiveTab("android")}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  activeTab === "android"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                type="button"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Android (Celular)</span>
              </button>

              <button
                onClick={() => setActiveTab("ios")}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  activeTab === "ios"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                type="button"
              >
                <Apple className="w-3.5 h-3.5 text-stone-800" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActiveTab("desktop")}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  activeTab === "desktop"
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                type="button"
              >
                <Laptop className="w-3.5 h-3.5 text-blue-600" />
                <span>Computador (PC/Mac)</span>
              </button>
            </div>

            {/* Tab 1: Auto / Geral */}
            {activeTab === "auto" && (
              <div className="mt-4 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                  Como funciona a tecnologia PWA sem restrições
                </h4>
                <ul className="text-xs text-stone-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span>
                      <strong>Sem passar pela App Store ou Play Store:</strong> instalação instantânea direto da web, sem downloads pesados ou permissões invasivas.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span>
                      <strong>Acesso Offline Garantido:</strong> o Service Worker embarcado armazena as salas de aula, vocabulários e ferramentas para você estudar mesmo sem sinal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span>
                      <strong>Tela Cheia Nativa:</strong> remove barras de URL e navegação do browser para proporcionar foco total nas lições.
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 2: Android */}
            {activeTab === "android" && (
              <div className="mt-4 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Instalação no Android (Google Chrome, Samsung Internet ou Edge)
                </h4>
                <ol className="text-xs text-stone-700 space-y-2.5 list-decimal pl-4">
                  <li>
                    Toque no botão <strong>"Instalar com 1-Clique"</strong> acima caso esteja disponível.
                  </li>
                  <li>
                    Se o botão direto estiver desabilitado pelo modo seguro do navegador: toque no menu de <strong>três pontos (⋮)</strong> no canto superior direito do Chrome.
                  </li>
                  <li>
                    Toque na opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </li>
                  <li>
                    Confirme em <strong>"Instalar"</strong>. O ícone de alta resolução do Teríus on será fixado na tela do seu telefone.
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 3: iOS (iPhone/iPad) */}
            {activeTab === "ios" && (
              <div className="mt-4 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-stone-800" />
                  <h4 className="text-xs font-bold text-stone-800">
                    Instalação no iPhone e iPad (Safari)
                  </h4>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  A Apple restringe a instalação automática via botão, mas permite adicionar diretamente pela barra de ferramentas do Safari:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-center space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-800">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <strong className="block text-stone-900">Passo 1</strong>
                    <span className="text-[11px] text-stone-500">
                      Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta ⎋) na barra inferior do Safari.
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-center space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-[#5A5A40]">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <strong className="block text-stone-900">Passo 2</strong>
                    <span className="text-[11px] text-stone-500">
                      Role o menu para baixo e selecione <strong>Adicionar à Tela de Início</strong> (⊞).
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-center space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <strong className="block text-stone-900">Passo 3</strong>
                    <span className="text-[11px] text-stone-500">
                      Toque em <strong>Adicionar</strong> no canto superior direito para fixar o ícone no seu iOS.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Desktop */}
            {activeTab === "desktop" && (
              <div className="mt-4 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  Instalação no Computador (Google Chrome, Microsoft Edge, Brave)
                </h4>
                <ol className="text-xs text-stone-700 space-y-2.5 list-decimal pl-4">
                  <li>
                    Na barra de endereços (URL) do seu navegador, procure pelo ícone de <strong>instalação de aplicativo (⊕ ou monitor com seta)</strong> no lado direito.
                  </li>
                  <li>
                    Ou clique no menu de <strong>três pontos (⋮)</strong> no canto superior direito do navegador.
                  </li>
                  <li>
                    Selecione <strong>"Salvar e compartilhar"</strong> ou <strong>"Aplicativos"</strong> &gt; <strong>"Instalar Teríus on..."</strong>.
                  </li>
                  <li>
                    Uma janela dedicada se abrirá, com atalho na sua Área de Trabalho e Barra de Tarefas do Windows/macOS.
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Quick Specifications */}
          <div className="pt-2 border-t border-stone-150 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Manifest v3 • PWA Standalone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#5A5A40]" />
              <span>Compatível com iOS, Android e PC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickInstallModal;
