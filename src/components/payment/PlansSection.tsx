import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Zap,
  Lock,
  Award,
  History,
  FileCheck,
  MessageCircle
} from "lucide-react";
import { PortalPlan, PaymentTransaction } from "../../types/payment";
import { paymentService, PORTAL_PLANS } from "../../services/paymentService";

interface PlansSectionProps {
  currentUser?: { nome: string; email: string };
  onOpenCheckout: (planId?: string) => void;
}

export default function PlansSection({ currentUser, onOpenCheckout }: PlansSectionProps) {
  const transactions = paymentService.getTransactions();
  const activePlan = paymentService.getActivePlan();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner / Header */}
      <div className="bg-natural-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-stone-200 relative overflow-hidden glow-indigo">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/10 border border-[#5A5A40]/20 text-[#5A5A40] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Infraestrutura de Pagamento Seguro</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] leading-tight">
            Planos de Matrícula, Certificação & Acesso Premium
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Desbloqueie todo o potencial do <strong>Portal de Inteligência Linguística Teríus on</strong> com
            processamento rápido e seguro via <strong>Google Pay</strong> ou <strong>Cartão Visa</strong>.
            Sem complicações e com ativação imediata no seu perfil.
          </p>

          {/* Quick Payment badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 font-sans font-semibold">
              <span className="font-bold">G</span>
              <span className="text-stone-900 font-bold">Pay</span>
              <span className="text-[10px] text-stone-500 font-normal">Google Pay</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-blue-900 font-serif font-bold">
              <CreditCard className="w-4 h-4 text-blue-800" />
              <span>VISA</span>
              <span className="text-[10px] text-stone-500 font-sans font-normal">Crédito & Débito</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Criptografia Ponta a Ponta</span>
            </div>

            <a
              href="https://wa.me/351963067989?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20planos%20e%20pagamento%20da%20Ter%C3%ADus%20on."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-sans font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Atendimento no WhatsApp: 963067989"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: 963067989</span>
            </a>
          </div>
        </div>

        {activePlan && (
          <div className="mt-6 pt-5 border-t border-stone-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900 font-serif">
                  Assinatura Ativa: {activePlan.planName}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Autenticação: {activePlan.authorizationCode} • Pago via {activePlan.paymentMethod}
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenCheckout()}
              className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-semibold hover:bg-[#43432e] transition-colors cursor-pointer self-start sm:self-auto"
            >
              Gerenciar / Ver Comprovantes
            </button>
          </div>
        )}
      </div>

      {/* Cards of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PORTAL_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-[32px] p-6 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
              plan.recommended
                ? "border-[#5A5A40] ring-2 ring-[#5A5A40]/40 bg-[#FAFAF7]"
                : "border-stone-200"
            }`}
          >
            {plan.badge && (
              <span
                className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                  plan.recommended ? "bg-[#5A5A40] text-white" : "bg-[#C05B33] text-white"
                }`}
              >
                {plan.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {plan.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-serif text-stone-900">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">/{plan.period}</span>
                </div>
                {plan.installmentText && (
                  <p className="text-[11px] text-stone-500 font-mono mt-1">
                    {plan.installmentText}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Benefícios inclusos:
                </span>
                <ul className="space-y-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-150 space-y-2">
              <button
                type="button"
                onClick={() => onOpenCheckout(plan.id)}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                  plan.recommended
                    ? "bg-[#5A5A40] hover:bg-[#43432e] text-white shadow-md shadow-[#5A5A40]/10"
                    : "bg-stone-900 hover:bg-stone-800 text-white"
                }`}
              >
                <span>Assinar com Google Pay ou Visa</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 font-mono">
                <Lock className="w-3 h-3" />
                <span>Ativação Instantânea</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History of Transactions / Receipts if any */}
      {transactions.length > 0 && (
        <div className="bg-natural-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-[#5A5A40]" />
              Seus Comprovantes & Transações Realizadas
            </h3>
            <span className="text-xs font-mono text-stone-500">
              Total: {transactions.length} transação(ões)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 font-serif text-sm">
                      {tx.planName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-stone-500 font-mono text-[11px]">
                    Método: <strong>{tx.paymentMethod}</strong>
                    {tx.cardLast4 ? ` • Cartão final ${tx.cardLast4}` : ""}
                  </div>
                  <div className="text-stone-400 text-[10px] mt-1 font-mono">
                    Autenticação: {tx.authorizationCode}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="text-stone-500 text-[11px]">
                    {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="font-bold text-stone-900 font-mono text-sm">
                    R$ {tx.amount.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
