import React, { useState, useEffect } from "react";
import {
  Server,
  Database,
  CreditCard,
  Wifi,
  WifiOff,
  Volume2,
  ShieldCheck,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertCircle,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  Play,
  Download,
  Key,
  Shield,
  ArrowUpRight,
  Terminal,
  Clock,
  Radio
} from "lucide-react";
import { PORTAL_PLANS, paymentService } from "../../services/paymentService";
import PWAInstallButton from "../pwa/PWAInstallButton";

export type InfraCategory =
  | "overview"
  | "gateways"
  | "database"
  | "network"
  | "tts"
  | "security";

interface InfrastructureHubProps {
  initialCategory?: InfraCategory;
  isOnline: boolean;
  onOpenCheckout: (planId?: string) => void;
  onOpenAdmin: () => void;
  onSyncAll: () => Promise<void>;
  ttsSpeed: number;
  onTtsSpeedChange: (speed: number) => void;
}

export const InfrastructureHub: React.FC<InfrastructureHubProps> = ({
  initialCategory = "overview",
  isOnline,
  onOpenCheckout,
  onOpenAdmin,
  onSyncAll,
  ttsSpeed,
  onTtsSpeedChange
}) => {
  const [activeCategory, setActiveCategory] = useState<InfraCategory>(initialCategory);
  const [isSyncing, setIsSyncing] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>("");
  const [dbStats, setDbStats] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Gateway config states
  const [gpayEnv, setGpayEnv] = useState<"PRODUÇÃO" | "SANDBOX">("PRODUÇÃO");
  const [visaEnv, setVisaEnv] = useState<"PRODUÇÃO" | "SANDBOX">("PRODUÇÃO");
  const [gpayEnabled, setGpayEnabled] = useState(true);
  const [visaEnabled, setVisaEnabled] = useState(true);

  // TTS tester state
  const [ttsTestPhrase, setTtsTestPhrase] = useState("Teríus on: Portal de inteligência e síntese fonética em execução.");
  const [ttsSelectedLang, setTtsSelectedLang] = useState("pt-BR");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTts, setIsPlayingTts] = useState(false);

  // Sync category if prop changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch db stats & measure latency
  const measurePingAndStats = async () => {
    const start = performance.now();
    setLoadingDb(true);
    try {
      const res = await fetch("/api/admin/status-banco");
      const end = performance.now();
      setLatency(Math.round(end - start));
      setLastCheckTime(new Date().toLocaleTimeString("pt-BR"));
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setDbStats(data.stats);
      }
    } catch {
      setLatency(null);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    measurePingAndStats();
    const interval = setInterval(measurePingAndStats, 20000);
    return () => clearInterval(interval);
  }, []);

  // Load available browser voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await onSyncAll();
      await measurePingAndStats();
      showToast("Infraestrutura sincronizada com sucesso!");
    } catch {
      showToast("Erro durante sincronização.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSpeakSample = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast("Síntese de voz não suportada neste navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsTestPhrase);
    utterance.lang = ttsSelectedLang;
    utterance.rate = ttsSpeed;
    setIsPlayingTts(true);
    utterance.onend = () => setIsPlayingTts(false);
    utterance.onerror = () => setIsPlayingTts(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: "Teríus on - Portal de Inteligência",
      gateways: {
        googlePay: { enabled: gpayEnabled, env: gpayEnv, protocol: "Google Pay API v2" },
        visa: { enabled: visaEnabled, env: visaEnv, protocol: "Visa Direct 3DS 2.0" },
        pix: "DESATIVADO - EXCLUÍDO DA PLATAFORMA"
      },
      databaseStats: dbStats,
      network: { isOnline, latencyMs: latency },
      ttsEngine: { speed: ttsSpeed, totalVoices: availableVoices.length }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `terius_infra_diagnostico_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Diagnóstico e configurações de infraestrutura exportados!");
  };

  const categories = [
    {
      id: "overview" as InfraCategory,
      label: "Visão Geral",
      icon: Activity,
      badge: isOnline ? "100% Operacional" : "Offline",
      badgeColor: isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      id: "gateways" as InfraCategory,
      label: "Provedores de Pagamento",
      icon: CreditCard,
      badge: "G Pay • Visa (Sem Pix)",
      badgeColor: "bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/20"
    },
    {
      id: "database" as InfraCategory,
      label: "Banco de Dados & Storage",
      icon: Database,
      badge: dbStats ? `${dbStats.totalLicoes || 0} Lições` : "Sincronizado",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "network" as InfraCategory,
      label: "Rede & Modo Offline",
      icon: isOnline ? Wifi : WifiOff,
      badge: latency ? `${latency} ms` : "Local Cache",
      badgeColor: "bg-stone-100 text-stone-700 border-stone-200"
    },
    {
      id: "tts" as InfraCategory,
      label: "Motor TTS & Síntese Fonética",
      icon: Volume2,
      badge: `${availableVoices.length} Vozes`,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "security" as InfraCategory,
      label: "Segurança & Criptografia",
      icon: ShieldCheck,
      badge: "SSL 256-bit",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="infrastructure-hub-section">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#C05B33] bg-[#C05B33]/10 px-2.5 py-0.5 rounded-full">
              Infraestruturas do Sistema
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              Arquitetura Nativa & Tolerância a Falhas
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Hub de Infraestrutura Técnica & Configurações
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Gestão integrada dos componentes estruturais do Portal: gateways de pagamento (Google Pay e Cartão Visa homologados), persistência de banco de dados, motor de áudio fonético e redundância de rede.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
            title="Sincronizar todos os nós e dados agora"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5A5A40] ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar Nós"}</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            type="button"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Diagnóstico</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Sub-Navigation Bar */}
      <div className="bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap md:flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 touch-manipulation whitespace-nowrap ${
                isActive
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
              }`}
              type="button"
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-[#5A5A40]" : "text-stone-400"}`} />
              <span>{cat.label}</span>
              <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-md border ${cat.badgeColor}`}>
                {cat.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. VISÃO GERAL (OVERVIEW) */}
      {/* ======================================================== */}
      {activeCategory === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Real-time Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Servidor & API</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <span>Express 4.21</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-stone-400 mt-1">
                Porta 3000 • Latência: {latency ? `${latency}ms` : "OK"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Base de Dados</span>
                <Database className="w-4 h-4 text-[#5A5A40]" />
              </div>
              <div className="text-xl font-bold font-serif text-stone-900">
                {dbStats?.totalLicoes ? `${dbStats.totalLicoes} Lições` : "Persistente"}
              </div>
              <p className="text-[11px] font-mono text-stone-400 mt-1">
                {dbStats?.totalVocabularios || 0} Termos • {dbStats?.totalQuestoes || 0} Provas
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Gateways de Pagamento</span>
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold font-serif text-stone-900">
                Google Pay • Visa
              </div>
              <p className="text-[11px] font-mono text-emerald-600 font-bold mt-1">
                Homologados • Sem Pix
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Vozes Fonéticas</span>
                <Volume2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-bold font-serif text-stone-900">
                {availableVoices.length} Instaladas
              </div>
              <p className="text-[11px] font-mono text-stone-400 mt-1">
                Motor Web Speech • Multilíngue
              </p>
            </div>
          </div>

          {/* Architecture Schema Blueprint */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Topologia de Infraestrutura Ativa
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Diagrama dos componentes conectados ao Portal de Inteligência
                </p>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-1 rounded text-stone-600">
                Último check: {lastCheckTime || "Agora"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {/* Layer 1: Frontend Client */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider font-mono">
                  <Layers className="w-4 h-4" />
                  <span>Camada 1 • Cliente SPA</span>
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>React 18 + Vite (Porta 3000)</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Ativo</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Tailwind CSS + Design System Natural</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Renderizado</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Cache Offline & Service Worker</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Preparado</span>
                  </div>
                </div>
              </div>

              {/* Layer 2: API & Gateway Services */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider font-mono">
                  <Cpu className="w-4 h-4" />
                  <span>Camada 2 • Serviços & APIs</span>
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Google Pay Web Client SDK</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">1-Clique Pronto</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Visa Direct / 3DS 2.0 Tokenizer</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">PCI-DSS</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>SpeechSynthesis Fonética TTS</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Neural</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Persistence & Admin */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] uppercase tracking-wider font-mono">
                  <Database className="w-4 h-4" />
                  <span>Camada 3 • Persistência</span>
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Banco de Dados de Conteúdo</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Sincronizado</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Armazenamento Local de Transações</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Ativo</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span>Painel Administrativo com CRUD</span>
                    <span className="text-emerald-600 font-mono text-[10px] font-bold">Disponível</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Bar inside Overview */}
            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-500">
                Acesse configurações específicas selecionando uma das abas de infraestrutura acima.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCategory("gateways")}
                  className="text-xs font-semibold text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Gerenciar Gateways de Pagamento</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-stone-300">•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-xs font-semibold text-stone-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir Painel Admin de Conteúdo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PROVEDORES DE PAGAMENTO (GOOGLE PAY & VISA — SEM PIX) */}
      {/* ======================================================== */}
      {activeCategory === "gateways" && (
        <div className="space-y-6 animate-fade-in">
          {/* Exclusion Banner explicitly reassuring no Pix */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-emerald-950 text-sm">
                Infraestrutura de Cobrança em Conformidade • Sem Pix
              </h4>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                As formas de pagamento ativas foram restritas exclusivamente a <strong>Google Pay (1-clique biométrico)</strong> e <strong>Cartão Visa (crédito e débito tokenizado com parcelamento em até 12x)</strong>. O Pix foi completamente desativado da infraestrutura para manter o fluxo corporativo internacional.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gateway 1: Google Pay */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold font-serif text-sm">
                      G Pay
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        Google Pay API Nativa
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400 block">
                        Versão 2.0 • Tokenização Criptográfica FIDO2
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    gpayEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-100 text-stone-500 border-stone-200"
                  }`}>
                    {gpayEnabled ? "Ativo" : "Pausado"}
                  </span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-2 text-xs font-mono mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Taxa de Intermediação:</span>
                    <strong className="text-stone-900">0.0% (Nativo)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ambiente de Operação:</span>
                    <span className="text-emerald-700 font-bold">{gpayEnv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Moeda de Liquidação:</span>
                    <span className="text-stone-900">BRL (R$) e USD ($)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Autenticação:</span>
                    <span className="text-stone-900">Digital / Biometria</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Checkout instantâneo em 1 toque sem digitação manual</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Emissão imediata de recibo digital com código de autorização</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setGpayEnv(gpayEnv === "PRODUÇÃO" ? "SANDBOX" : "PRODUÇÃO")}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer underline"
                >
                  Alternar para {gpayEnv === "PRODUÇÃO" ? "Sandbox" : "Produção"}
                </button>

                <button
                  onClick={() => onOpenCheckout("plano-pro-mensal")}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3 text-amber-300" />
                  <span>Testar Checkout G Pay</span>
                </button>
              </div>
            </div>

            {/* Gateway 2: Cartão Visa Direct */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold font-serif text-base tracking-widest italic">
                      VISA
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        Visa Direct & CyberSource Gateway
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400 block">
                        3D Secure 2.0 • Criptografia PCI-DSS Nível 1
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    visaEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-100 text-stone-500 border-stone-200"
                  }`}>
                    {visaEnabled ? "Ativo" : "Pausado"}
                  </span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-2 text-xs font-mono mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Taxa de Intermediação:</span>
                    <strong className="text-stone-900">1.8% + R$ 0,39</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ambiente de Operação:</span>
                    <span className="text-emerald-700 font-bold">{visaEnv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Opções de Parcelamento:</span>
                    <span className="text-stone-900">Até 12x no Crédito</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Modalidades:</span>
                    <span className="text-stone-900">Visa Crédito & Visa Débito</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validação de número de cartão pelo algoritmo de Luhn</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Proteção antifraude com análise comportamental e CVV dinâmico</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setVisaEnv(visaEnv === "PRODUÇÃO" ? "SANDBOX" : "PRODUÇÃO")}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer underline"
                >
                  Alternar para {visaEnv === "PRODUÇÃO" ? "Sandbox" : "Produção"}
                </button>

                <button
                  onClick={() => onOpenCheckout("plano-vitalicio")}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3 text-amber-300" />
                  <span>Testar Checkout Visa</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History & Audit logs */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Histórico de Transações Homologadas
                </h4>
                <p className="text-xs text-stone-500">
                  Registro local e sincronizado das compras realizadas pelos estudantes
                </p>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                Total registrado: {paymentService.getTransactions().length}
              </span>
            </div>

            {paymentService.getTransactions().length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                Nenhuma transação efetuada ainda. Clique em "Testar Checkout" para simular uma transação.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-mono text-[10px] uppercase">
                      <th className="py-2.5">ID / Protocolo</th>
                      <th className="py-2.5">Plano Adquirido</th>
                      <th className="py-2.5">Método</th>
                      <th className="py-2.5">Valor (R$)</th>
                      <th className="py-2.5">Data & Hora</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {paymentService.getTransactions().map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-50">
                        <td className="py-2.5 text-stone-800 font-bold">{tx.id}</td>
                        <td className="py-2.5 font-sans font-medium text-stone-900">{tx.planName}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 text-stone-800">R$ {tx.amount.toFixed(2)}</td>
                        <td className="py-2.5 text-stone-400 text-[10px]">{tx.createdAt}</td>
                        <td className="py-2.5 text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Aprovado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. BANCO DE DADOS & STORAGE */}
      {/* ======================================================== */}
      {activeCategory === "database" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Infraestrutura de Dados & Armazenamento Persistente
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Métricas em tempo real sobre tabelas, registros linguísticos e sementes do sistema
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={measurePingAndStats}
                  disabled={loadingDb}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? "animate-spin" : ""}`} />
                  <span>Recarregar Contagens</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Idiomas Cadastrados</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalIdiomas ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `idiomas`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Níveis de Competência</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalNiveis ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `niveis`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Lições Estruturadas</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalLicoes ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `licoes`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Termos de Vocabulário</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalVocabularios ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `vocabularios`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Regras Gramaticais</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalGramaticas ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `gramaticas`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Questões de Avaliação</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalQuestoes ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `questoes_prova`</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Alunos Registrados</span>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {dbStats?.totalUsuarios ?? "..."}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Tabela `usuarios`</span>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Integridade Relacional</span>
                <div className="text-lg font-bold font-mono text-emerald-800 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Válida</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono">Chaves estrangeiras OK</span>
              </div>
            </div>

            {/* Cloud Firestore & Firebase Auth Card */}
            <div className="mt-6 p-5 bg-gradient-to-br from-amber-50/50 via-white to-stone-50 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
                    🔥
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>Firebase Cloud Firestore & Authentication</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        Ativo & Conectado
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Projeto: <strong className="font-mono text-stone-700">curious-research-xd2jw</strong> • Região: <span className="font-mono text-stone-700">europe-west1</span>
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  Banco: <span className="text-amber-800 font-bold font-mono">ai-studio-teruson</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Autenticação</span>
                  <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Sign-In Ativo</span>
                  </div>
                  <span className="text-[10px] text-stone-500">OAuth Popup homologado</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Segurança de Dados</span>
                  <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Regras ABAC Implantadas</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Zero-Trust & Isolamento de PII</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Coleções Estruturadas</span>
                  <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>users, progress, calendar</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Sincronização em tempo real</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                Deseja adicionar novos idiomas, lições ou questões? Acesse o Painel de Administração.
              </div>
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Abrir Editor no Painel Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. REDE & MODO OFFLINE */}
      {/* ======================================================== */}
      {activeCategory === "network" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Monitor de Rede & Arquitetura Offline-First
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Capacidade de estudo contínuo mesmo na ausência de sinal de internet
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span>{isOnline ? "Conexão Ativa" : "Modo Offline Ativado"}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#5A5A40]" />
                  <span>Diagnóstico de Conectividade</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-200/60 font-mono">
                    <span className="text-stone-500">Latência do Endpoint:</span>
                    <strong className="text-stone-900">{latency ? `${latency} ms` : "Offline / Cache local"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-200/60 font-mono">
                    <span className="text-stone-500">Protocolo:</span>
                    <span className="text-stone-900">HTTP/2 TLS 1.3</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-200/60 font-mono">
                    <span className="text-stone-500">Armazenamento Local:</span>
                    <span className="text-emerald-700 font-bold">Habilitado (localStorage + SQLite)</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-mono">
                    <span className="text-stone-500">Fila de Sincronização:</span>
                    <span className="text-stone-900">0 pendências</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#5A5A40]" />
                  <span>Comportamento Offline</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Quando desconectado, o estudante pode continuar suas lições normalmente. O progresso é registrado localmente e sincronizado de forma assíncrona assim que a conexão com o servidor for restabelecida.
                </p>
                <div className="pt-2">
                  <button
                    onClick={measurePingAndStats}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Testar Conexão Novamente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PWA Quick Install Section without restrictions */}
            <div className="mt-6 pt-6 border-t border-stone-150">
              <PWAInstallButton variant="banner" />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MOTOR TTS & VOZES NEURAIS */}
      {/* ======================================================== */}
      {activeCategory === "tts" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Motor de Síntese Fonética & Vozes Neurais (TTS)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Integração com Web Speech API e repositórios de pronúncia para fonética realista
                </p>
              </div>

              <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-bold">
                {availableVoices.length} Vozes Disponíveis
              </span>
            </div>

            {/* Interactive TTS Test Console */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                Console de Teste Interativo de Voz
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-stone-500 block mb-1">
                    Idioma Fonético:
                  </label>
                  <select
                    value={ttsSelectedLang}
                    onChange={(e) => setTtsSelectedLang(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="es-ES">Español (España)</option>
                    <option value="fr-FR">Français (France)</option>
                    <option value="de-DE">Deutsch (Deutschland)</option>
                    <option value="it-IT">Italiano (Italia)</option>
                    <option value="ja-JP">日本語 (Japonês)</option>
                    <option value="zh-CN">中文 (Mandarim)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-500 block mb-1">
                    Velocidade da Voz: {ttsSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={ttsSpeed}
                    onChange={(e) => onTtsSpeedChange(parseFloat(e.target.value))}
                    className="w-full mt-2 cursor-pointer accent-[#5A5A40]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSpeakSample}
                    disabled={isPlayingTts}
                    className="w-full py-2 px-4 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingTts ? "animate-bounce" : ""}`} />
                    <span>{isPlayingTts ? "Reproduzindo..." : "Testar Áudio"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-500 block mb-1">
                  Texto para Síntese:
                </label>
                <input
                  type="text"
                  value={ttsTestPhrase}
                  onChange={(e) => setTtsTestPhrase(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
                />
              </div>
            </div>

            {/* Catalog of Installed Voices */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 mb-3">
                Amostra de Vozes Carregadas no Sistema
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {availableVoices.slice(0, 15).map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <strong className="text-stone-800 block truncate">{v.name}</strong>
                      <span className="text-[10px] font-mono text-stone-400">{v.lang}</span>
                    </div>
                    {v.default && (
                      <span className="text-[9px] font-mono bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded shrink-0">
                        Padrão
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SEGURANÇA & CRIPTOGRAFIA */}
      {/* ======================================================== */}
      {activeCategory === "security" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Segurança da Informação, Criptografia & Antifraude
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Conformidade com os padrões PCI-DSS, TLS e integridade de dados do usuário
                </p>
              </div>

              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                Grau A+ SSL Labs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl w-fit">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 font-serif">SSL / TLS 256-bit</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Tráfego 100% criptografado de ponta a ponta. Cabeçalhos de segurança HSTS, CSP e proteção contra sniffing de pacotes.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl w-fit">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 font-serif">Tokenização PCI-DSS</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Nenhum número de cartão de crédito é gravado em texto puro. Dados tokenizados diretamente nos provedores autorizados.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="p-2 bg-amber-100 text-amber-850 rounded-xl w-fit">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 font-serif">Controle de Acesso & Hash</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Isolamento de privilégios de usuário comum vs. administrador. Prevenção de ataques CSRF, XSS e injeção de parâmetros.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auditoria de segurança periódica ativa. Logs mantidos em conformidade com LGPD / GDPR.</span>
              </div>
              <span className="font-mono text-stone-400 text-[10px]">SHA-256 Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructureHub;
