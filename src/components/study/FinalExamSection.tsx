import React, { useState, useEffect } from "react";
import { Award, ShieldCheck, AlertTriangle, ArrowRight, ClipboardCheck, Sparkles, AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { QuestaoProva, Nivel, ProgressoUsuario } from "../../types";
import { isPortalOnline, getFromOfflineCache, saveToOfflineCache, queueOfflineAction } from "../../offlineStorage";

interface FinalExamSectionProps {
  id_usuario: number;
  currentNivel: Nivel;
  progressoNivel: ProgressoUsuario | null;
  onExamCompleted: () => void;
}

export default function FinalExamSection({
  id_usuario,
  currentNivel,
  progressoNivel,
  onExamCompleted
}: FinalExamSectionProps) {
  const [loading, setLoading] = useState(true);
  const [questoes, setQuestoes] = useState<QuestaoProva[]>([]);
  const [activeStep, setActiveStep] = useState<"cover" | "quiz" | "result">("cover");
  const [currentQuestaoIdx, setCurrentQuestaoIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitError, setSubmitError] = useState("");
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [isOfflineSubmitted, setIsOfflineSubmitted] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [currentNivel]);

  const fetchExam = async () => {
    setLoading(true);
    setActiveStep("cover");
    setCurrentQuestaoIdx(0);
    setSelectedAnswers({});
    setSubmittedResult(null);
    setSubmitError("");
    setIsOfflineSubmitted(false);

    // If offline, check local cache first
    if (!isPortalOnline()) {
      const cached = getFromOfflineCache<any>(`prova_final_nivel_${currentNivel.id_nivel}`);
      if (cached && cached.questoes) {
        setQuestoes(cached.questoes || []);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/provas/${currentNivel.id_nivel}`);
      if (!response.ok) {
        throw new Error("Erro ao obter prova final deste nível");
      }
      const data = await response.json();
      setQuestoes(data.questoes || []);
      saveToOfflineCache(`prova_final_nivel_${currentNivel.id_nivel}`, data);
    } catch (err) {
      console.warn("Falha de rede ao buscar prova. Tentando cache offline...", err);
      const cached = getFromOfflineCache<any>(`prova_final_nivel_${currentNivel.id_nivel}`);
      if (cached && cached.questoes) {
        setQuestoes(cached.questoes || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questaoId: number, opcaoId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questaoId]: opcaoId
    }));
  };

  const handleNextQuestion = () => {
    if (questoes.length === 0 || !questoes[currentQuestaoIdx]) return;
    const currentQ = questoes[currentQuestaoIdx];
    if (!selectedAnswers[currentQ.id_questao]) {
      setSubmitError("Por favor, selecione uma resposta antes de avançar.");
      return;
    }
    setSubmitError("");
    if (currentQuestaoIdx + 1 < questoes.length) {
      setCurrentQuestaoIdx((prev) => prev + 1);
    } else {
      submitExam();
    }
  };

  const submitExam = async () => {
    setLoading(true);
    setSubmitError("");

    // If offline or network fails, evaluate score locally and queue synchronization
    if (!isPortalOnline()) {
      evaluateAndQueueOffline();
      return;
    }

    try {
      const response = await fetch(`/api/provas/${currentNivel.id_nivel}/submeter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          respostas: selectedAnswers
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao submeter respostas da prova");
      }

      setSubmittedResult(data);
      setActiveStep("result");
      onExamCompleted();
    } catch (err: any) {
      console.warn("Falha no envio da prova via rede. Avaliando no modo offline...", err);
      evaluateAndQueueOffline();
    } finally {
      setLoading(false);
    }
  };

  const evaluateAndQueueOffline = () => {
    let corretas = 0;
    questoes.forEach(q => {
      const selecao = selectedAnswers[q.id_questao];
      if (parseInt(selecao as any) === q.resposta_correta_id) {
        corretas++;
      }
    });

    const total = questoes.length || 1;
    const nota = Number(((corretas / total) * 10).toFixed(2));
    const aprovado = nota >= 7.0;

    const localResult = {
      nota,
      corretas,
      total_questoes: total,
      aprovado,
      proximo_nivel_desbloqueado: aprovado,
      mensagem: aprovado
        ? `Parabéns! Você alcançou nota ${nota.toFixed(1)} (Avaliação salva no Modo Offline).`
        : `Você obteve nota ${nota.toFixed(1)}. A pontuação mínima para aprovação é 7.0.`
    };

    // Queue action for syncing when back online
    queueOfflineAction("salvar_exame", {
      id_usuario,
      id_nivel: currentNivel.id_nivel,
      respostas: selectedAnswers
    });

    setIsOfflineSubmitted(true);
    setSubmittedResult(localResult);
    setActiveStep("result");
    onExamCompleted();
  };

  if (loading && questoes.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-stone-500 text-xs font-semibold uppercase tracking-wider">
        <span className="w-5 h-5 border-2 border-stone-300 border-t-natural-primary rounded-full animate-spin mr-2.5" />
        Carregando Prova Final...
      </div>
    );
  }

  if (questoes.length === 0) {
    return (
      <div className="text-center p-8 bg-stone-50 border border-stone-200 rounded-[32px]">
        <AlertTriangle className="w-8 h-8 text-amber-650 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-stone-800 mb-1 font-serif font-bold">Sem Prova no Momento</h4>
        <p className="text-xs text-stone-500 italic">
          Esta prova final está em fase de elaboração. Continue praticando vocabulário e gramática!
        </p>
      </div>
    );
  }

  const progressPercent = questoes.length > 0 ? Math.round(((currentQuestaoIdx + 1) / questoes.length) * 100) : 0;

  return (
    <div className="space-y-6" id="final-exam-root">
      {/* Step 1: Cover / Welcome Page */}
      {activeStep === "cover" && (
        <div
          className="p-8 rounded-[32px] bg-white border border-stone-200 glow-indigo text-center"
          id="exam-cover-step"
        >
          <div className="inline-flex p-3 rounded-2xl bg-natural-primary/10 text-natural-primary mb-4 border border-[#5A5A40]/10 shadow-xs">
            <ClipboardCheck className="w-8 h-8 font-bold" />
          </div>
          
          <h4 className="text-2xl font-serif font-bold italic text-natural-primary tracking-tight mb-2">
            Prova Final de Proficiência
          </h4>
          <p className="text-xs text-stone-500 italic max-w-sm mx-auto mb-6 leading-relaxed font-serif">
            Avaliação oficial de nível contendo questões reais de <strong className="text-natural-accent font-semibold font-serif italic h-auto">Vocabulário</strong>, <strong className="text-natural-accent font-semibold font-serif italic h-auto">Gramática</strong> e <strong className="text-natural-accent font-semibold font-serif italic h-auto">Interpretação Contextual</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6 text-left">
            <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-150 text-center">
              <span className="block text-[8px] uppercase tracking-widest text-stone-400 mb-1 font-bold leading-none">Questões</span>
              <span className="text-sm font-bold text-stone-850 font-serif">{questoes.length} perguntas</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-150 text-center">
              <span className="block text-[8px] uppercase tracking-widest text-stone-400 mb-1 font-bold leading-none">Média Mínima</span>
              <span className="text-sm font-bold text-emerald-600 font-serif">7.0 / 10.0</span>
            </div>
          </div>

          {progressoNivel?.concluido && (
            <div className="p-3 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider max-w-xs mx-auto">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>Nível Concluído! Nota: {progressoNivel.nota_prova_final}</span>
            </div>
          )}

          {questoes.length === 0 ? (
            <div className="p-4 mb-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center max-w-xs mx-auto">
              <AlertCircle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <span className="font-bold block mb-1">Questões em Preparação</span>
              <span>As questões oficiais desta prova estão sendo sincronizadas. Pratique com as lições deste nível.</span>
            </div>
          ) : (
            <button
              onClick={() => setActiveStep("quiz")}
              className="w-full max-w-xs py-3 px-4 rounded-2xl bg-[#5A5A40] hover:bg-[#484832] text-white font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer shadow-md"
              type="button"
              id="start-exam-btn"
            >
              Iniciar Avaliação
            </button>
          )}
        </div>
      )}

      {/* Step 2: Exam Questions Step-by-step Wizard */}
      {activeStep === "quiz" && (
        <div
          className="p-6 rounded-[32px] bg-white border border-stone-200 text-left glow-indigo"
          id="exam-questions-step"
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Questão {currentQuestaoIdx + 1} de {questoes.length}
            </span>
            <span className="text-xs font-serif font-bold text-natural-accent">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-natural-accent h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Selected question */}
          {questoes[currentQuestaoIdx] && (() => {
            const q = questoes[currentQuestaoIdx];
            const userSelection = selectedAnswers[q.id_questao];

            return (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    q.categoria === "Gramatica"
                      ? "bg-amber-600/10 text-amber-700 border border-amber-600/15"
                      : q.categoria === "Vocabulario"
                      ? "bg-[#5A5A40]/10 text-natural-primary border border-[#5A5A40]/15"
                      : "bg-[#C05B33]/10 text-natural-accent border border-[#C05B33]/15"
                  }`}>
                    {q.categoria}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avaliação</span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-800 leading-normal">
                  {q.pergunta}
                </h4>

                <div className="space-y-2.5">
                  {q.opcoes_resposta.map((opt) => {
                    const isPicked = userSelection === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id_questao, opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold leading-normal transition-all border ${
                          isPicked
                            ? "bg-[#5A5A40]/10 border-natural-primary text-natural-primary font-bold shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-100/40"
                        }`}
                        type="button"
                        id={`exam-opt-${opt.id}`}
                      >
                        {opt.texto}
                      </button>
                    );
                  })}
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-600 text-xs flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end border-t border-stone-150 pt-4 mt-6">
                  <button
                    onClick={handleNextQuestion}
                    className="py-2.5 px-5 flex items-center justify-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl text-xs uppercase font-bold tracking-widest cursor-pointer transition-all"
                    type="button"
                    id="next-question-btn"
                  >
                    <span>
                      {currentQuestaoIdx + 1 === questoes.length ? "Finalizar Prova" : "Próxima Questão"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Step 3: Exam Submission Result Display */}
      {activeStep === "result" && submittedResult && (
        <div
          className="p-8 rounded-[32px] bg-white border border-stone-200 text-center relative overflow-hidden shadow-md"
          id="exam-result-step"
        >
          <div className="mb-4">
            {submittedResult.nota >= 7.0 ? (
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-3 animate-pulse">
                <ShieldCheck className="w-10 h-10 shadow-xs" />
              </div>
            ) : (
              <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-3">
                <AlertTriangle className="w-10 h-10" />
              </div>
            )}
          </div>

          <h4 className="text-xl font-serif font-bold text-natural-primary mb-1">
            {submittedResult.nota >= 7.0 ? "Parabéns, Você foi Aprovado!" : "Resultado da Avaliação"}
          </h4>

          {isOfflineSubmitted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2">
              <WifiOff className="w-3 h-3" />
              <span>Gravado no Modo Offline (Sincronização Agendada)</span>
            </div>
          )}

          <p className="text-xs text-stone-500 font-serif italic max-w-sm mx-auto mb-6 leading-relaxed">
            {submittedResult.nota >= 7.0
              ? "Sua nota superou a média exigida de 7.0. O próximo nível de competência foi desbloqueado com sucesso!"
              : "Infelizmente, seu aproveitamento foi insuficiente. Recomendamos revisar as lições de vocabulário e regras gramaticais e tentar novamente."}
          </p>

          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6 font-serif">
            <span className="block text-[8px] font-bold uppercase tracking-widest text-stone-400 mb-1 leading-none">
              Sua Nota Final
            </span>
            <span className={`text-4xl font-bold font-serif italic ${
              submittedResult.nota >= 7.0 ? "text-emerald-600" : "text-red-500"
            }`}>
              {submittedResult.nota.toFixed(2)}
            </span>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-2">
              Acertou {submittedResult.corretas} de {submittedResult.total_questoes} questões
            </div>
          </div>

          <div className="flex gap-3 justify-center max-w-xs mx-auto">
            <button
              onClick={fetchExam}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-100 font-bold uppercase tracking-widest text-stone-600 border border-stone-200 hover:bg-stone-250 flex items-center justify-center gap-1.5 text-[10px] transition-colors cursor-pointer"
              type="button"
              id="retry-exam-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Repetir Prova
            </button>

            <button
              onClick={() => setActiveStep("cover")}
              className="flex-1 py-3 px-4 rounded-xl bg-natural-accent hover:bg-natural-accent/90 text-white text-[10px] uppercase font-bold tracking-widest shadow-xs cursor-pointer"
              type="button"
              id="finish-exam-btn"
            >
              Ver Portfólio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
