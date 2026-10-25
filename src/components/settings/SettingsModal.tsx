import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Sun, 
  Moon, 
  Volume2, 
  Sliders, 
  Check, 
  Gauge, 
  Info, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  Trophy, 
  Download, 
  Smartphone, 
  Laptop,
  WifiOff,
  Database,
  HardDrive,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EstatisticasDashboard } from "./EstatisticasDashboard";
import { AdvancedVoiceSelector } from "./AdvancedVoiceSelector";
import { getOfflineStorageStats, clearOfflineCache } from "../../offlineStorage";
import Logo from "../common/Logo";
import PWAInstallButton from "../pwa/PWAInstallButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (speed: number) => void;
  ttsAutoplay: boolean;
  setTtsAutoplay: (autoplay: boolean) => void;
  ttsVoiceURI: string;
  setTtsVoiceURI: (voiceURI: string) => void;
  idiomaNome: string;
  
  // Stats & learning dashboard props
  progresso: any[];
  niveis: any[];
  idiomas: any[];
  currentIdioma: any;
  calendario: any[];
  onSyncData?: () => Promise<any>;
  onDownloadOffline?: (onProgress: (percent: number, message: string) => void) => Promise<any>;
  isDownloadingOffline?: boolean;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  darkMode,
  setDarkMode,
  ttsSpeed,
  setTtsSpeed,
  ttsAutoplay,
  setTtsAutoplay,
  ttsVoiceURI,
  setTtsVoiceURI,
  idiomaNome,
  
  progresso,
  niveis,
  idiomas,
  currentIdioma,
  calendario,
  onSyncData,
  onDownloadOffline
}: SettingsModalProps) {
  const [nome, setNome] = useState(currentUser?.nome || "");
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<any | null>(null);

  // Offline management state
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ percent: 0, message: "" });
  const [offlineStats, setOfflineStats] = useState<any | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshOfflineStats();
    }
  }, [isOpen]);

  const refreshOfflineStats = () => {
    try {
      const stats = getOfflineStorageStats();
      const lastSavedDate = localStorage.getItem("lingoprogress_offline_last_sync");
      setOfflineStats({ ...stats, lastSavedDate });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const updated = {
      ...currentUser,
      nome: nome.trim()
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const [activeMenuTab, setActiveMenuTab] = useState<"dashboard" | "preferences" | "installation">("dashboard");

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-stone-900/50 backdrop-blur-xs"
      id="settings-modal-backdrop"
    >
      <div 
        className={`relative bg-white rounded-[32px] w-full shadow-xl border border-stone-200 text-stone-800 overflow-hidden text-left transition-all duration-300 ${
          activeMenuTab === "dashboard" || activeMenuTab === "installation" ? "max-w-4xl" : "max-w-2xl"
        }`}
        id="settings-modal-card"
      >
        {/* Modal Header with Menu Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 px-6 py-4.5 bg-stone-50/50 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-natural-accent flex items-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5" />
              Central do Estudante
            </span>
            <h3 className="text-lg font-serif font-bold italic text-natural-primary mt-1 leading-tight">
              {activeMenuTab === "dashboard" 
                ? "Painel de Aprendizado & Desempenho" 
                : activeMenuTab === "preferences" 
                ? "Configurações & Preferências" 
                : "Como Instalar o Aplicativo"}
            </h3>
          </div>

          {/* Tab switcher inside the modal */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 self-start sm:self-center shrink-0">
            <button
              onClick={() => setActiveMenuTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMenuTab === "dashboard"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Desempenho</span>
            </button>
            <button
              onClick={() => setActiveMenuTab("preferences")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMenuTab === "preferences"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configurações</span>
            </button>
            <button
              onClick={() => setActiveMenuTab("installation")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMenuTab === "installation"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar App</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/50 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer absolute top-4 right-4 sm:static"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className={`overflow-y-auto max-h-[75vh] ${activeMenuTab === "dashboard" ? "p-0 bg-stone-50/20" : activeMenuTab === "installation" ? "p-4 sm:p-6 bg-stone-50/10" : "p-6 space-y-6"}`}>
          {activeMenuTab === "dashboard" ? (
            <div className="p-4 sm:p-6 md:p-8">
              <EstatisticasDashboard
                progresso={progresso}
                niveis={niveis}
                idiomas={idiomas}
                currentIdioma={currentIdioma}
                calendario={calendario}
                id_usuario={currentUser?.id_usuario || 1}
                isEmbedded={true}
              />
            </div>
          ) : activeMenuTab === "installation" ? (
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="text-center max-w-xl mx-auto mb-6">
                <Logo size="lg" className="justify-center mx-auto mb-3" />
                <h4 className="font-serif italic text-lg font-bold text-natural-primary">Leve o Teríus on com Você!</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Sabia que você pode instalar o Teríus on diretamente no seu celular ou computador sem precisar de loja de aplicativos? Nosso portal é um **PWA (Progressive Web App)** moderno que funciona de forma ultra-rápida e leve.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Android Card */}
                <div className="bg-white border border-stone-150 p-5 rounded-2xl flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-bold text-sm text-stone-800">No Android</span>
                    </div>
                    <ol className="text-xs text-stone-600 space-y-2.5 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Abra o portal do aplicativo no navegador <strong>Google Chrome</strong>.</li>
                      <li>Toque no botão de menu de <strong>três pontos (⋮)</strong> no canto superior direito.</li>
                      <li>Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela de início"</strong>.</li>
                      <li>Confirme a instalação e o app aparecerá na sua gaveta de aplicativos.</li>
                    </ol>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-emerald-600 font-bold uppercase tracking-wide text-center">
                    ✓ Suporte completo a notificações
                  </div>
                </div>

                {/* iOS Card */}
                <div className="bg-white border border-stone-150 p-5 rounded-2xl flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-bold text-sm text-stone-800">No iOS (iPhone/iPad)</span>
                    </div>
                    <ol className="text-xs text-stone-600 space-y-2.5 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Abra o aplicativo usando o navegador nativo <strong>Safari</strong>.</li>
                      <li>Toque no ícone de <strong>Compartilhar (quadrado com seta 📤)</strong> na barra inferior.</li>
                      <li>Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início" (➕)</strong>.</li>
                      <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
                    </ol>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-indigo-600 font-bold uppercase tracking-wide text-center">
                    ✓ Ícone nativo na tela inicial
                  </div>
                </div>

                {/* Windows/Desktop Card */}
                <div className="bg-white border border-stone-150 p-5 rounded-2xl flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-bold text-sm text-stone-800">No Windows / PC</span>
                    </div>
                    <ol className="text-xs text-stone-600 space-y-2.5 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Acesse o portal via <strong>Chrome</strong> ou <strong>Microsoft Edge</strong>.</li>
                      <li>Na barra de endereços do topo, clique no ícone de <strong>Monitor com seta de instalação</strong>.</li>
                      <li>Caso não veja o ícone, abra o menu (⋮) → <strong>"Apps"</strong> → <strong>"Instalar este site como aplicativo"</strong>.</li>
                      <li>O app abrirá em janela própria de alta performance!</li>
                    </ol>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-amber-600 font-bold uppercase tracking-wide text-center">
                    ✓ Atalho dedicado no desktop
                  </div>
                </div>
              </div>

              {/* Install Prompt Event Trigger */}
              <div className="bg-[#5A5A40]/5 border border-[#5A5A40]/15 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[9px] font-mono font-bold uppercase text-natural-accent tracking-wider block mb-0.5">Instalação Direta</span>
                  <p className="text-xs text-[#5A5A40] font-semibold">Gostaria de instalar o LingoProgress neste dispositivo agora mesmo?</p>
                  <p className="text-[10px] text-stone-500 leading-normal">Se o seu navegador for compatível, você pode clicar ao lado para iniciar a instalação rápida.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if ((window as any).deferredPrompt) {
                      (window as any).deferredPrompt.prompt();
                      (window as any).deferredPrompt.userChoice.then((choiceResult: any) => {
                        if (choiceResult.outcome === 'accepted') {
                          console.log('User accepted the install prompt');
                        }
                        (window as any).deferredPrompt = null;
                      });
                    } else {
                      alert("A instalação rápida direta não pôde ser ativada automaticamente por restrições do navegador (ou você já o instalou). Por favor, siga as instruções simples acima de acordo com seu sistema operacional!");
                    }
                  }}
                  className="py-2.5 px-5 bg-[#5A5A40] hover:bg-[#43432e] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shrink-0 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalação Rápida</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: User Profile */}
              <section className="space-y-3" id="settings-profile-section">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                  <User className="w-4 h-4 text-[#5A5A40]" />
                  <span>Perfil do Estudante</span>
                </h4>
                
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Seu Nome / Apelido</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-natural-primary flex-1 font-semibold"
                        placeholder="Digite seu nome..."
                        required
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-natural-primary hover:bg-[#43432e] text-white transition-all uppercase tracking-wider text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <span>Atualizar</span>}
                      </button>
                    </div>
                    {isSaved && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-mono font-bold">✓ Nome de perfil salvo com sucesso!</p>
                    )}
                  </div>
                </form>
              </section>

              {/* Section 2: Appearance & Themes */}
              <section className="space-y-3" id="settings-appearance-section">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                  <Sun className="w-4 h-4 text-[#5A5A40]" />
                  <span>Aparência e Estilo</span>
                </h4>
                
                <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-stone-700">Tema do Aplicativo</span>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">Alternar entre o modo claro aconchegante e o modo noturno confortável.</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDarkMode(false)}
                      className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        !darkMode ? "bg-white text-natural-primary shadow-xs font-extrabold" : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Claro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDarkMode(true)}
                      className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        darkMode ? "bg-stone-850 text-white shadow-xs font-extrabold bg-stone-850" : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Escuro</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Section 3: TTS / Pronúncia Web Speech API Avançada */}
              <section id="settings-tts-section">
                <AdvancedVoiceSelector
                  ttsVoiceURI={ttsVoiceURI}
                  setTtsVoiceURI={setTtsVoiceURI}
                  ttsSpeed={ttsSpeed}
                  setTtsSpeed={setTtsSpeed}
                  ttsAutoplay={ttsAutoplay}
                  setTtsAutoplay={setTtsAutoplay}
                  idiomaNome={idiomaNome}
                />
              </section>

              {/* Section 4: PWA Quick Install without browser restrictions */}
              <section className="space-y-3" id="settings-pwa-install-section">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                  <Download className="w-4 h-4 text-[#5A5A40]" />
                  <span>Instalação Rápida no Dispositivo (PWA)</span>
                </h4>
                <PWAInstallButton variant="banner" />
              </section>

              {/* Section 5: Database Synchronization & Update */}
              <section className="space-y-3" id="settings-sync-section">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                  <RefreshCw className="w-4 h-4 text-[#5A5A40]" />
                  <span>Sincronização & Atualização de Dados</span>
                </h4>

                <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-bold text-stone-700">Atualizar Todos os Dados Novos</span>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                        Sincroniza todos os 8 idiomas, 24 níveis, 240 lições enriquecidas, vocabulários, gramáticas e provas finais.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={async () => {
                        if (onSyncData) {
                          setIsSyncing(true);
                          try {
                            const res = await onSyncData();
                            if (res && res.stats) {
                              setSyncStats(res.stats);
                            }
                          } finally {
                            setIsSyncing(false);
                          }
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-natural-primary hover:bg-[#43432e] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 disabled:opacity-50 shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                      <span>{isSyncing ? "Atualizando..." : "Sincronizar Agora"}</span>
                    </button>
                  </div>

                  {syncStats && (
                    <div className="pt-3 border-t border-stone-200 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] bg-white p-2.5 rounded-xl border border-emerald-500/20 text-stone-600">
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalIdiomas || 8}</span>
                        <span className="text-[9px] text-stone-400">Idiomas</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalNiveis || 24}</span>
                        <span className="text-[9px] text-stone-400">Níveis</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalLicoes || 240}</span>
                        <span className="text-[9px] text-stone-400">Lições</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalVocabularios || 480}</span>
                        <span className="text-[9px] text-stone-400">Vocabulário</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalGramaticas || 240}</span>
                        <span className="text-[9px] text-stone-400">Gramática</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700 text-xs">{syncStats.totalQuestoes || 48}</span>
                        <span className="text-[9px] text-stone-400">Questões</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 5: Modo Offline & Armazenamento Local */}
              <section className="space-y-3" id="settings-offline-section">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                  <WifiOff className="w-4 h-4 text-[#5A5A40]" />
                  <span>Modo Offline & Armazenamento Local</span>
                </h4>

                <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="block text-xs font-bold text-stone-700">Baixar Curso Completo Offline</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20">
                          PWA Ready
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                        Armazena todas as lições, vocabulários, gramáticas e provas no seu dispositivo para estudar sem conexão à internet.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={downloadingOffline}
                      onClick={async () => {
                        if (onDownloadOffline) {
                          setDownloadingOffline(true);
                          setDownloadSuccessToast(null);
                          try {
                            const res = await onDownloadOffline((percent, message) => {
                              setDownloadProgress({ percent, message });
                            });
                            if (res && res.success) {
                              setDownloadSuccessToast(`Download concluído com sucesso! ${res.lessonsDownloaded} lições disponíveis offline.`);
                              refreshOfflineStats();
                            }
                          } finally {
                            setDownloadingOffline(false);
                          }
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-natural-accent hover:bg-[#a64a27] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 disabled:opacity-50 shadow-xs"
                      id="download-course-offline-btn"
                    >
                      <Download className={`w-3.5 h-3.5 ${downloadingOffline ? "animate-bounce" : ""}`} />
                      <span>{downloadingOffline ? "Baixando..." : "Baixar Offline"}</span>
                    </button>
                  </div>

                  {/* Download progress bar */}
                  {downloadingOffline && (
                    <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-stone-600 font-bold">
                        <span>{downloadProgress.message || "Preparando dados..."}</span>
                        <span className="font-mono text-natural-accent">{downloadProgress.percent}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-natural-accent h-full transition-all duration-300 rounded-full"
                          style={{ width: `${downloadProgress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {downloadSuccessToast && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{downloadSuccessToast}</span>
                    </div>
                  )}

                  {/* Offline status info */}
                  {offlineStats && (
                    <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-stone-600">
                          <HardDrive className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {offlineStats.savedLessonsCount > 0 
                              ? `${offlineStats.savedLessonsCount} lições em cache (${offlineStats.storageUsageKB || 0} KB)`
                              : `${offlineStats.storageUsageKB || 0} KB em cache`}
                          </span>
                        </span>
                        {offlineStats.pendingQueueCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 font-bold">
                            {offlineStats.pendingQueueCount} sincronizações pendentes
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          clearOfflineCache();
                          refreshOfflineStats();
                          setDownloadSuccessToast("Cache offline limpo com sucesso.");
                        }}
                        className="text-stone-400 hover:text-red-500 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Limpar Cache
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-stone-150 px-6 py-4.5 bg-stone-50/50 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[9px] font-bold font-mono uppercase tracking-tight">Consistência Diária é a Chave</span>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-stone-850 hover:bg-stone-900 text-stone-700 border border-stone-200 bg-white hover:bg-stone-50 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
            type="button"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
