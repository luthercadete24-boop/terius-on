import React, { useState, useRef, useEffect } from "react";
import {
  LogOut,
  Sliders,
  RefreshCw,
  WifiOff,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Server,
  Database,
  Volume2,
  Lock,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Globe,
  Languages,
  BarChart3,
  Activity,
  Layers,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "../common/Logo";
import { SyncToast } from "../../hooks/useNetworkStatus";
import { ViewMode } from "../study/ViewModeTabs";
import PWAInstallButton from "../pwa/PWAInstallButton";

interface NavbarProps {
  currentUser: any;
  isOnline: boolean;
  isSyncingAll: boolean;
  onSyncAllData: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  syncToast: SyncToast | null;
  onOpenPayments?: () => void;
  onOpenAdmin?: () => void;
  isProMember?: boolean;
  currentMode?: ViewMode;
  onSelectMode?: (mode: ViewMode, subCategory?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isOnline,
  isSyncingAll,
  onSyncAllData,
  onOpenSettings,
  onLogout,
  syncToast,
  onOpenPayments,
  onOpenAdmin,
  isProMember = false,
  currentMode = "study",
  onSelectMode
}) => {
  const [isInfraMenuOpen, setIsInfraMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const infraMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infraMenuRef.current && !infraMenuRef.current.contains(event.target as Node)) {
        setIsInfraMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (mode: ViewMode, sub?: string) => {
    if (onSelectMode) {
      onSelectMode(mode, sub);
    }
    setIsInfraMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const infraItems = [
    {
      id: "overview",
      label: "Visão Geral da Infraestrutura",
      desc: "Topologia de nós, latência e diagnóstico em tempo real",
      icon: Activity,
      status: isOnline ? "100% Operacional" : "Offline",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      id: "gateways",
      label: "Gateways de Pagamento",
      desc: "Google Pay Nativo & Cartão Visa tokenizado (Sem Pix)",
      icon: CreditCard,
      status: "G Pay • Visa",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200"
    },
    {
      id: "database",
      label: "Banco de Dados & Storage",
      desc: "Armazenamento persistente, sementes e integridade",
      icon: Database,
      status: "Sincronizado",
      statusColor: "text-amber-800 bg-amber-50 border-amber-200"
    },
    {
      id: "network",
      label: "Rede & Modo Offline",
      desc: "Arquitetura offline-first, cache PWA e sincronização assíncrona",
      icon: Server,
      status: isOnline ? "Online" : "Cache Local",
      statusColor: isOnline ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"
    },
    {
      id: "tts",
      label: "Motor TTS & Vozes Neurais",
      desc: "Síntese fonética multilíngue e controle de velocidade",
      icon: Volume2,
      status: "Neural TTS",
      statusColor: "text-purple-700 bg-purple-50 border-purple-200"
    },
    {
      id: "security",
      label: "Segurança, SSL & Antifraude",
      desc: "Criptografia 256-bit, tokenização PCI-DSS e proteção CSRF",
      icon: Lock,
      status: "SSL 256-bit",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo & Desktop Navigation Menu */}
        <div className="flex items-center gap-6">
          <Logo showText size="md" />

          {/* Desktop Navigation Links */}
          {onSelectMode && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-stone-600">
              <button
                onClick={() => handleNavigate("study")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentMode === "study"
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
                type="button"
              >
                Estudos
              </button>

              <button
                onClick={() => handleNavigate("dictionary")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentMode === "dictionary"
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
                type="button"
              >
                Dicionário
              </button>

              <button
                onClick={() => handleNavigate("translator")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentMode === "translator"
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
                type="button"
              >
                Tradutor
              </button>

              <button
                onClick={() => handleNavigate("analytics")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentMode === "analytics"
                    ? "bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
                type="button"
              >
                Gráficos
              </button>

              {/* Organized Infrastructure Menu in Navigation Bar */}
              <div className="relative" ref={infraMenuRef}>
                <button
                  onClick={() => setIsInfraMenuOpen(!isInfraMenuOpen)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentMode === "infrastructure" || isInfraMenuOpen
                      ? "bg-[#5A5A40] text-white shadow-xs"
                      : "hover:bg-stone-100 text-stone-700"
                  }`}
                  type="button"
                  id="nav-infra-dropdown-btn"
                  title="Menu de Infraestruturas do Sistema"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Infraestruturas</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isInfraMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isInfraMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-left"
                    >
                      <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                            Infraestruturas Técnicas
                          </span>
                          <span className="text-xs font-serif font-bold text-stone-900">
                            Menu de Serviços & Conectores
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>

                      <div className="py-1 space-y-0.5 max-h-[420px] overflow-y-auto">
                        {infraItems.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate("infrastructure", item.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group"
                              type="button"
                            >
                              <div className="p-2 rounded-lg bg-stone-100 text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors shrink-0 mt-0.5">
                                <ItemIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <strong className="text-xs font-semibold text-stone-900 group-hover:text-[#5A5A40]">
                                    {item.label}
                                  </strong>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${item.statusColor}`}>
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}

                        {/* Admin Panel Link inside Infrastructure Menu */}
                        {onOpenAdmin && (
                          <div className="pt-1 mt-1 border-t border-stone-100">
                            <button
                              onClick={() => {
                                onOpenAdmin();
                                setIsInfraMenuOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between text-xs font-semibold text-stone-800 cursor-pointer"
                              type="button"
                            >
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                                <span>Painel Administrativo Completo</span>
                              </div>
                              <span className="text-[10px] font-mono text-stone-400">CRUD Dados →</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          )}
        </div>

        {/* Right: Actions, Badges & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online / Offline status badge */}
          {isOnline ? (
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider"
              title="Conectado ao servidor Express"
              id="online-status-badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider"
              title="Trabalhando em modo offline com dados armazenados localmente"
              id="offline-status-badge"
            >
              <WifiOff className="w-3 h-3 text-amber-600" />
              <span>Modo Offline</span>
            </div>
          )}

          {/* Quick Synchronize Database button */}
          <button
            onClick={onSyncAllData}
            disabled={isSyncingAll}
            className="p-2 rounded-full hover:bg-[#5A5A40]/10 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer disabled:opacity-50"
            title="Sincronizar e Atualizar Todos os Dados Novos"
            type="button"
            id="sync-all-btn"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? "animate-spin text-natural-primary" : ""}`} />
          </button>

          {/* PWA Quick Install without restrictions */}
          <PWAInstallButton />

          {/* Plan / Payment CTA Button */}
          {onOpenPayments && (
            <button
              onClick={onOpenPayments}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                isProMember
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-[#FAFAF7] border-[#5A5A40]/40 text-[#5A5A40] hover:bg-[#5A5A40]/10"
              }`}
              type="button"
              title="Planos e Pagamento com Google Pay e Visa"
              id="navbar-payments-btn"
            >
              <CreditCard className="w-3.5 h-3.5 text-natural-accent" />
              <span className="hidden sm:inline">
                {isProMember ? "Plano Ativo" : "Assinar (G Pay • Visa)"}
              </span>
              <span className="sm:hidden">{isProMember ? "Pro" : "Planos"}</span>
            </button>
          )}

          {/* User credentials details */}
          <div className="flex items-center gap-2 bg-white py-1 px-2.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-right leading-none hidden sm:block">
              <div className="text-xs font-semibold text-stone-800 uppercase tracking-tight flex items-center gap-1 justify-end">
                <span>{currentUser?.nome || "Usuário"}</span>
                {isProMember && (
                  <span className="text-[9px] px-1 py-0.2 bg-[#5A5A40] text-white rounded font-mono font-bold">
                    PRO
                  </span>
                )}
              </div>
              <div className="text-[9px] text-stone-400 font-mono mt-0.5">
                {currentUser?.email || ""}
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAEAE0] border-2 border-white shadow-xs overflow-hidden flex items-center justify-center">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  currentUser?.email || "Felix"
                )}`}
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* User Settings & Audio modal trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-[#5A5A40]/10 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Configurações do Usuário e Vozes TTS"
            type="button"
            id="settings-btn"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Sair do Portal"
            type="button"
            id="logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation"
            type="button"
            id="mobile-nav-toggle-btn"
            title="Abrir Menu de Navegação"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Category 1: Portal de Aprendizado */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block mb-2">
                1. Portal de Inteligência Linguística
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleNavigate("study")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    currentMode === "study" ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-stone-50 text-stone-800 border-stone-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Sala de Estudos</span>
                </button>
                <button
                  onClick={() => handleNavigate("dictionary")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    currentMode === "dictionary" ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-stone-50 text-stone-800 border-stone-200"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Dicionário</span>
                </button>
                <button
                  onClick={() => handleNavigate("translator")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    currentMode === "translator" ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-stone-50 text-stone-800 border-stone-200"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>Tradutor</span>
                </button>
                <button
                  onClick={() => handleNavigate("analytics")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    currentMode === "analytics" ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-stone-50 text-stone-800 border-stone-200"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Gráficos</span>
                </button>
              </div>
            </div>

            {/* Category 2: Planos & Pagamentos */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block mb-2">
                2. Planos & Pagamentos
              </span>
              <button
                onClick={() => handleNavigate("plans")}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold ${
                  currentMode === "plans" ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-[#FAFAF7] text-[#5A5A40] border-[#5A5A40]/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C05B33]" />
                  <span>Planos e Checkout Oficial</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200/80 text-stone-800">
                  G Pay • Visa
                </span>
              </button>
            </div>

            {/* Category 3: Infraestruturas do Sistema */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C05B33] font-bold block mb-2">
                3. Infraestruturas do Sistema
              </span>
              <div className="space-y-1.5">
                {infraItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate("infrastructure", item.id)}
                      className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className="w-4 h-4 text-[#5A5A40]" />
                        <span className="font-semibold text-stone-800">{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </button>
                  );
                })}

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      onOpenAdmin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-stone-900 text-white text-left flex items-center justify-between text-xs font-semibold mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Painel Administrativo Completo</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-300">Abrir →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Install Banner in Mobile Menu */}
            <div className="pt-2 border-t border-stone-150 space-y-2">
              <PWAInstallButton variant="banner" />

              {/* Direct WhatsApp Channel Button */}
              <a
                href="https://wa.me/351963067989?text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20pelo%20WhatsApp%20da%20Ter%C3%ADus%20on."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-between text-xs font-bold shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Suporte: 963067989</span>
                </div>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md">Abrir →</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Synchronization & Offline Notification Toast */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-inner transition-colors ${
              syncToast.type === "warning"
                ? "bg-amber-600"
                : syncToast.type === "info"
                ? "bg-[#5A5A40]"
                : "bg-emerald-600"
            }`}
          >
            {syncToast.type === "warning" ? (
              <WifiOff className="w-4 h-4 shrink-0" />
            ) : syncToast.type === "info" ? (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{syncToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
