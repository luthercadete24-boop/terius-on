import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  ViewModeTabs,
  LanguageSelector,
  LevelSelector,
  LessonWorkspace,
  FinalExamSection,
  DictionarySection,
  TranslatorSection,
  EstatisticasDashboard,
  SettingsModal,
  AdminPanel,
  AuthModal,
  PlansAndCheckoutModal,
  PlansSection,
  InfrastructureHub,
  QuickInstallModal,
  WhatsAppButton
} from "./components";
import { ViewMode } from "./components/study/ViewModeTabs";
import { InfraCategory } from "./components/infrastructure/InfrastructureHub";
import { useStudyData, useNetworkStatus, useUserPreferences } from "./hooks";
import { authService } from "./services/authService";
import { paymentService } from "./services/paymentService";
import { Usuario, Idioma, Nivel, Licao, CalendarioEstudos } from "./types";
import { PaymentTransaction } from "./types/payment";
import { Sparkles, CreditCard, ShieldCheck, ArrowRight, BookOpen, Layers } from "lucide-react";
import { auth, logoutFromFirebase } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    const stored = authService.getStoredUser();
    if (stored) return stored;
    // Default active profile so the user lands immediately in the intelligence portal
    const defaultUser: Usuario = {
      id_usuario: 1,
      nome: "Teríus",
      email: "luthercadete24@gmail.com",
      senha_hash: "",
      data_criacao: new Date().toISOString()
    };
    authService.setStoredUser(defaultUser);
    return defaultUser;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync session with Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: Usuario = {
          id_usuario: 1,
          nome: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Estudante",
          email: firebaseUser.email || "estudante@terius.app",
          senha_hash: "",
          data_criacao: new Date().toISOString()
        };
        setCurrentUser(mappedUser);
        authService.setStoredUser(mappedUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Network & Sync status
  const { isOnline, syncToast } = useNetworkStatus();
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // User Preferences
  const {
    darkMode,
    setDarkMode,
    ttsSpeed,
    setTtsSpeed,
    ttsAutoplay,
    setTtsAutoplay,
    ttsVoiceURI,
    setTtsVoiceURI
  } = useUserPreferences();

  // Navigation View Mode
  const [currentMode, setCurrentMode] = useState<ViewMode>("study");
  const [selectedInfraCategory, setSelectedInfraCategory] = useState<InfraCategory>("overview");

  // Admin & Settings Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Payment & Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutInitialPlanId, setCheckoutInitialPlanId] = useState<string | undefined>(undefined);
  const [isProMember, setIsProMember] = useState<boolean>(() => paymentService.hasActivePlan());
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Study Data Hook
  const {
    loading,
    idiomas,
    niveis,
    progresso,
    calendario,
    selectedIdioma,
    selectedNivel,
    setSelectedNivel,
    licoes,
    selectedLicao,
    setSelectedLicao,
    vocabulary,
    grammar,
    showExam,
    setShowExam,
    selectLanguage,
    refreshData,
    completedLevelsCount,
    progressPercent,
    activeLevelProg
  } = useStudyData(currentUser?.id_usuario || null);

  const totalLevelsCount = niveis.length;

  // Synchronize entire database with server
  const handleSyncAllData = async () => {
    setIsSyncingAll(true);
    try {
      const res = await fetch("/api/admin/sincronizar-tudo", { method: "POST" });
      if (res.ok) {
        await refreshData();
        showFeedback("Dados do portal e progresso sincronizados com sucesso!");
      }
    } catch (e) {
      console.warn("Falha de rede ao sincronizar:", e);
    } finally {
      setIsSyncingAll(false);
    }
  };

  const showFeedback = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleOpenCheckout = (planId?: string) => {
    setCheckoutInitialPlanId(planId);
    setIsCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    setIsProMember(true);
    showFeedback(
      `Pagamento de ${tx.planName} aprovado via ${tx.paymentMethod}! Acesso ativado.`
    );
  };

  const handleLogout = () => {
    logoutFromFirebase().catch(() => {});
    authService.clearStoredUser();
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (user: { id_usuario: number; nome: string; email: string }) => {
    const fullUser: Usuario = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      senha_hash: "",
      data_criacao: new Date().toISOString()
    };
    authService.setStoredUser(fullUser);
    setCurrentUser(fullUser);
    setShowAuthModal(false);
    showFeedback(`Bem-vindo ao Portal de Inteligência, ${user.nome}!`);
  };

  // If user explicitly logged out and no user is set, show AuthModal
  if (!currentUser && showAuthModal) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  // Active level progress if in study mode
  const currentLevelProgresso =
    progresso.find((p) => p.id_nivel === selectedNivel?.id_nivel) || null;

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans transition-colors duration-200">
      {/* Fixed Sticky Header Navbar */}
      <Navbar
        currentUser={currentUser}
        isOnline={isOnline}
        isSyncingAll={isSyncingAll}
        onSyncAllData={handleSyncAllData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        syncToast={syncToast}
        onOpenPayments={() => handleOpenCheckout()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isProMember={isProMember}
        currentMode={currentMode}
        onSelectMode={(mode, sub) => {
          setCurrentMode(mode);
          if (sub) {
            setSelectedInfraCategory(sub as InfraCategory);
          }
        }}
      />

      {/* Global Notification Banner */}
      {notificationToast && (
        <div className="bg-[#5A5A40] text-white text-xs font-semibold py-2.5 px-4 text-center sticky top-[65px] z-30 shadow-md flex items-center justify-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 sm:py-8 space-y-6">
        {/* Navigation View Tabs */}
        <ViewModeTabs
          currentMode={currentMode}
          onSelectMode={(mode) => setCurrentMode(mode)}
        />

        {/* ======================================================== */}
        {/* 1. SALA DE ESTUDOS (STUDY MODE) */}
        {/* ======================================================== */}
        {currentMode === "study" && (
          <div className="space-y-6 animate-fade-in">
            {/* Level Selector Bar */}
            {selectedIdioma && (
              <div className="bg-natural-card rounded-[28px] p-4 sm:p-5 shadow-xs border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                      Nível de Proficiência
                    </span>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-[#5A5A40]">
                      {selectedIdioma.nome_idioma} — Trilha de Competência
                    </h2>
                  </div>

                  {!isProMember && (
                    <button
                      onClick={() => handleOpenCheckout("plano-pro-mensal")}
                      className="self-start sm:self-auto text-xs font-semibold text-[#5A5A40] hover:text-[#43432e] bg-[#FAFAF7] hover:bg-[#5A5A40]/10 px-3 py-1.5 rounded-xl border border-[#5A5A40]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#C05B33]" />
                      <span>Desbloquear Todos os Níveis (G Pay • Visa)</span>
                    </button>
                  )}
                </div>

                <LevelSelector
                  selectedIdioma={selectedIdioma}
                  niveis={niveis}
                  progresso={progresso}
                  selectedNivel={selectedNivel}
                  onSelectNivel={(lvl) => {
                    setSelectedNivel(lvl);
                    setShowExam(false);
                  }}
                />
              </div>
            )}

            {/* Two-Column Curriculum Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Language Picker, General Progress & Study Calendar */}
              {currentUser && (
                <LanguageSelector
                  userId={currentUser.id_usuario}
                  idiomas={idiomas}
                  selectedIdioma={selectedIdioma}
                  onSelectIdioma={(lang) => {
                    selectLanguage(lang);
                    setShowExam(false);
                  }}
                  progressPercent={progressPercent}
                  completedLevelsCount={completedLevelsCount}
                  totalLevelsCount={totalLevelsCount}
                  calendario={calendario}
                  onRefreshData={refreshData}
                />
              )}

              {/* Right Column: Lessons, Exercises or Final Exam */}
              <div className="lg:col-span-8 space-y-6">
                {showExam && selectedNivel && currentUser ? (
                  <FinalExamSection
                    id_usuario={currentUser.id_usuario}
                    currentNivel={selectedNivel}
                    progressoNivel={currentLevelProgresso}
                    onExamCompleted={() => {
                      refreshData();
                      showFeedback("Avaliação concluída! Progresso e nota registrados.");
                    }}
                  />
                ) : selectedIdioma ? (
                  <LessonWorkspace
                    licoes={licoes}
                    selectedLicao={selectedLicao}
                    onSelectLicao={(lic) => setSelectedLicao(lic)}
                    onTriggerExam={() => setShowExam(true)}
                    vocabulary={vocabulary}
                    grammar={grammar}
                    selectedIdioma={selectedIdioma}
                    ttsSpeed={ttsSpeed}
                    ttsVoiceURI={ttsVoiceURI}
                    ttsAutoplay={ttsAutoplay}
                  />
                ) : (
                  <div className="bg-natural-card rounded-[32px] p-8 text-center border border-stone-200">
                    <p className="text-stone-500 text-sm">
                      Carregando dados da sala de estudos...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. DICIONÁRIO MULTILÍNGUE */}
        {/* ======================================================== */}
        {currentMode === "dictionary" && (
          <DictionarySection
            idiomas={idiomas}
            ttsSpeed={ttsSpeed}
            ttsVoiceURI={ttsVoiceURI}
          />
        )}

        {/* ======================================================== */}
        {/* 3. TRADUTOR UNIVERSAL */}
        {/* ======================================================== */}
        {currentMode === "translator" && (
          <TranslatorSection
            ttsSpeed={ttsSpeed}
            ttsVoiceURI={ttsVoiceURI}
          />
        )}

        {/* ======================================================== */}
        {/* 4. DESEMPENHO & GRÁFICOS */}
        {/* ======================================================== */}
        {currentMode === "analytics" && currentUser && (
          <EstatisticasDashboard
            progresso={progresso}
            niveis={niveis}
            idiomas={idiomas}
            currentIdioma={selectedIdioma}
            calendario={calendario}
            id_usuario={currentUser.id_usuario}
          />
        )}

        {/* ======================================================== */}
        {/* 5. PLANOS & PAGAMENTOS (GOOGLE PAY & VISA — SEM PIX) */}
        {/* ======================================================== */}
        {currentMode === "plans" && (
          <PlansSection
            currentUser={currentUser ? { nome: currentUser.nome, email: currentUser.email } : undefined}
            onOpenCheckout={(planId) => handleOpenCheckout(planId)}
          />
        )}

        {/* ======================================================== */}
        {/* 6. INFRAESTRUTURAS DO SISTEMA (TÉCNICA, GATEWAYS & BANCO) */}
        {/* ======================================================== */}
        {currentMode === "infrastructure" && (
          <InfrastructureHub
            initialCategory={selectedInfraCategory}
            isOnline={isOnline}
            onOpenCheckout={(planId) => handleOpenCheckout(planId)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onSyncAll={handleSyncAllData}
            ttsSpeed={ttsSpeed}
            onTtsSpeedChange={setTtsSpeed}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/70 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#5A5A40]">Teríus on</span>
            <span>— Portal de Inteligência Linguística & Proficiência Multilíngue</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-[11px] font-mono text-center sm:text-right">
            <a
              href="https://wa.me/351963067989?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Portal%20Ter%C3%ADus%20on."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 hover:underline font-bold flex items-center gap-1"
              title="Fale no WhatsApp Oficial: 963067989"
            >
              <span>WhatsApp: 963067989</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#5A5A40] hover:underline font-bold flex items-center gap-1"
            >
              <span>⚡ Instalação Rápida PWA</span>
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => handleOpenCheckout()}
              className="text-[#5A5A40] hover:underline font-semibold"
            >
              Checkout Google Pay & Visa
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => {
                setCurrentMode("infrastructure");
                setSelectedInfraCategory("overview");
              }}
              className="hover:text-stone-800"
            >
              Infraestruturas Técnicas
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-stone-800"
            >
              Painel Administrativo
            </button>
            <span className="hidden sm:inline">•</span>
            <span>Segurança SSL 256-bit</span>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* Plans & Fast Checkout Modal (Google Pay & Visa - NO PIX) */}
      <PlansAndCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        currentUser={currentUser ? { nome: currentUser.nome, email: currentUser.email } : undefined}
        initialPlanId={checkoutInitialPlanId}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onRefreshApp={() => {
            refreshData();
            showFeedback("Banco de dados do portal atualizado!");
          }}
        />
      )}

      {/* User Preferences & Voice TTS Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            authService.setStoredUser(updated);
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          ttsSpeed={ttsSpeed}
          setTtsSpeed={setTtsSpeed}
          ttsAutoplay={ttsAutoplay}
          setTtsAutoplay={setTtsAutoplay}
          ttsVoiceURI={ttsVoiceURI}
          setTtsVoiceURI={setTtsVoiceURI}
          idiomaNome={selectedIdioma?.nome_idioma || "Português"}
          progresso={progresso}
          niveis={niveis}
          idiomas={idiomas}
          currentIdioma={selectedIdioma}
          calendario={calendario}
          onSyncData={handleSyncAllData}
        />
      )}

      {/* Quick PWA Installation Modal without Browser Restrictions */}
      <QuickInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <WhatsAppButton phoneNumber="351963067989" />
    </div>
  );
}
