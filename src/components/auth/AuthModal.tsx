import React, { useState } from "react";
import { LogIn, UserPlus, Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import Logo from "../common/Logo";
import { loginWithGoogle } from "../../firebase";

interface AuthModalProps {
  onLoginSuccess: (user: { id_usuario: number; nome: string; email: string }) => void;
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado durante a autenticação");
      }

      if (data.success && data.user) {
        onLoginSuccess(data.user);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "luthercadete24@gmail.com", senha: "123" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      if (data.success && data.user) {
        onLoginSuccess(data.user);
      }
    } catch (e: any) {
      // If offline or fetch failed, fallback to local user so user is never blocked
      if (typeof navigator !== "undefined" && (!navigator.onLine || e.message?.includes("Failed to fetch") || e.message?.includes("NetworkError"))) {
        onLoginSuccess({
          id_usuario: 1,
          nome: "Teríus",
          email: "luthercadete24@gmail.com"
        });
        return;
      }
      setError("Erro no acesso rápido: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onLoginSuccess({
      id_usuario: 1,
      nome: "Visitante",
      email: "visitante@terius.app"
    });
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();
      onLoginSuccess({
        id_usuario: 1,
        nome: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Estudante",
        email: firebaseUser.email || "usuario@google.com"
      });
    } catch (e: any) {
      console.warn("Google Firebase Login:", e);
      const isPopupBlocked = e.code === "auth/popup-blocked" || e.message?.includes("popup") || e.message?.includes("cross-origin");
      if (isPopupBlocked) {
        setError("O navegador bloqueou a janela pop-up do Google. Você pode permitir pop-ups ou usar o 'Acesso Rápido' ou 'Entrar como Convidado' abaixo.");
      } else {
        setError("Autenticação com Google via Firebase indisponível no momento: " + (e.message || e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-natural-bg text-natural-text selection:bg-natural-primary/20 selection:text-natural-primary">
      {/* Decorative Warm Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-natural-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-natural-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-md p-8 rounded-[32px] border border-stone-250 bg-white shadow-xl relative z-10"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        id="auth-container"
      >
        <div className="text-center mb-8">
          <Logo size="xl" className="justify-center mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold tracking-tight mb-1 text-natural-primary">
            Teríus on
          </h2>
          <p className="text-xs font-serif italic text-stone-500">
            Portal Inteligente de Aprendizado de Idiomas & Tradutor Universal
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium text-center space-y-1.5" id="auth-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={handleShortcutLogin}
              className="text-[11px] font-bold text-natural-primary underline hover:opacity-80 block mx-auto cursor-pointer"
            >
              Entrar direto com Acesso Rápido (Teríus) →
            </button>
          </div>
        )}

        {/* Firebase Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full py-3 px-4 mb-5 flex items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold tracking-wide text-xs transition-all shadow-xs hover:border-stone-400 cursor-pointer disabled:opacity-50"
          id="google-firebase-login-btn"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Entrar com Google (Firebase Auth)</span>
        </button>

        <div className="relative mb-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <span className="relative px-3 text-[9px] uppercase tracking-widest bg-white text-stone-400 font-bold font-mono">
            Ou com e-mail e senha
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex. Teríus"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary transition-colors text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">
              Endereço de E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 flex items-center justify-center gap-2 rounded-2xl bg-[#5A5A40] hover:bg-[#484832] text-white font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50 mt-6"
            id="auth-submit-btn"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-stone-200 border-t-natural-primary rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" /> Entrar no Portal
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Criar Minha Conta
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <span className="relative px-3 text-[9px] uppercase tracking-widest bg-white text-stone-450 font-bold font-mono">
            Ou use o acesso de teste
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleShortcutLogin}
            type="button"
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-2xl border border-natural-primary/50 bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 text-natural-primary font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.01] cursor-pointer"
            id="auth-quick-btn"
          >
            <Sparkles className="w-4 h-4 text-natural-primary" />
            <span>Acesso Rápido (Teríus)</span>
          </button>

          <button
            onClick={handleGuestLogin}
            type="button"
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 font-semibold tracking-wider text-[11px] transition-colors cursor-pointer"
            id="auth-guest-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>Entrar como Convidado (Explorar sem Cadastro)</span>
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            type="button"
            className="text-xs text-natural-accent font-semibold hover:text-[#C05B33]/85 underline underline-offset-4 cursor-pointer uppercase tracking-wider text-[10px]"
          >
            {isLogin
              ? "Não possui conta? Cadastre-se aqui"
              : "Já possui conta? Faça o login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
