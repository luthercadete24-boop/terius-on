import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, CheckCircle, RefreshCw, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Gramatica } from "../../types";

interface GrammarSectionProps {
  gramatica: Gramatica | null;
}

export default function GrammarSection({ gramatica }: GrammarSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [quizStatus, setQuizStatus] = useState<"unanswered" | "correct" | "incorrect">("unanswered");
  const [errorMsg, setErrorMsg] = useState("");

  const desafio = gramatica?.desafio_json;

  // Reset quiz states when a new grammar model is loaded
  useEffect(() => {
    setSelectedOption(null);
    setTypedAnswer("");
    setAssembledWords([]);
    setQuizStatus("unanswered");
    setErrorMsg("");

    if (desafio && desafio.tipo === "ordenar-palavras" && Array.isArray(desafio.frase_embaralhada)) {
       setScrambledWords([...desafio.frase_embaralhada]);
    } else {
       setScrambledWords([]);
    }
  }, [gramatica]);

  if (!gramatica || !desafio) {
    return (
      <div className="text-stone-400 text-xs italic p-4 text-center pb-2">
        Nenhum módulo de gramática cadastrado para esta lição.
      </div>
    );
  }

  // Answer matching & evaluations
  const checkAnswer = () => {
    setErrorMsg("");
    const answerNorm = desafio.resposta_correta.trim().toLowerCase();

    if (desafio.tipo === "multipla-escolha") {
      if (!selectedOption) {
        setErrorMsg("Por favor, selecione uma das alternativas.");
        return;
      }
      if (selectedOption.trim().toLowerCase() === answerNorm) {
        setQuizStatus("correct");
      } else {
        setQuizStatus("incorrect");
      }
    } else if (desafio.tipo === "completar-lacuna") {
      if (!typedAnswer.trim()) {
        setErrorMsg("Por favor, digite o termo correspondente.");
        return;
      }
      if (typedAnswer.trim().toLowerCase() === answerNorm) {
        setQuizStatus("correct");
      } else {
        setQuizStatus("incorrect");
      }
    } else if (desafio.tipo === "ordenar-palavras") {
      const sentenceBuilt = assembledWords.join(" ").trim().toLowerCase();
      if (assembledWords.length === 0) {
        setErrorMsg("Por favor, monte a frase clicando nas palavras.");
        return;
      }
      if (sentenceBuilt === answerNorm) {
        setQuizStatus("correct");
      } else {
        setQuizStatus("incorrect");
      }
    }
  };

  const handleWordTap = (word: string, index: number) => {
    if (quizStatus !== "unanswered") return;
    setAssembledWords((prev) => [...prev, word]);
    setScrambledWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (quizStatus !== "unanswered") return;
    setScrambledWords((prev) => [...prev, word]);
    setAssembledWords((prev) => prev.filter((_, i) => i !== index));
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setTypedAnswer("");
    setQuizStatus("unanswered");
    setErrorMsg("");
    if (desafio && Array.isArray(desafio.frase_embaralhada)) {
      setScrambledWords([...desafio.frase_embaralhada]);
      setAssembledWords([]);
    }
  };

  return (
    <div className="space-y-6" id="grammar-section-root">
      {/* Rule details view with Soft Sandstone aesthetics */}
      <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-natural-primary/10 text-natural-primary rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-base font-serif font-bold text-natural-primary">
            Regra do Dia: {gramatica.regra_titulo}
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-stone-750 font-serif italic bg-white p-4 rounded-xl border border-stone-150">
          {gramatica.explicacao}
        </p>
      </div>

      {/* Challenge title */}
      <div>
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
          Desafio de Fixação
        </h5>
        
        <div className="p-6 rounded-[32px] bg-white border border-stone-200 text-left glow-indigo">
          <p className="text-sm font-semibold text-stone-800 mb-4 font-serif">
            {desafio.pergunta}
          </p>

          {/* Multiple choice widgets */}
          {desafio.tipo === "multipla-escolha" && desafio.opcoes && (
            <div className="space-y-2.5">
              {desafio.opcoes.map((opt, oIdx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => quizStatus === "unanswered" && setSelectedOption(opt)}
                    disabled={quizStatus !== "unanswered"}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#5A5A40]/10 border-[#5A5A40] text-natural-primary font-bold shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-650 hover:border-stone-300 hover:bg-stone-100/50"
                    } ${
                      quizStatus === "correct" && isSelected ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : ""
                    } ${
                      quizStatus === "incorrect" && isSelected ? "border-red-500 bg-red-500/10 text-red-700" : ""
                    }`}
                    type="button"
                    id={`grammar-option-${oIdx}`}
                  >
                    <span className="inline-block font-mono bg-white border border-stone-200 w-5 h-5 rounded-full text-center leading-4 mr-2.5 text-[10px] text-stone-500 font-bold">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the blanks widgets */}
          {desafio.tipo === "completar-lacuna" && (
            <div className="space-y-3">
              {desafio.frase_com_lacuna && (
                <div className="p-4 bg-stone-50 rounded-xl text-center font-serif text-[13px] italic tracking-wide text-stone-700 mb-2 border border-stone-200">
                  {desafio.frase_com_lacuna}
                </div>
              )}
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={quizStatus !== "unanswered"}
                placeholder="Digite a resposta correta aqui..."
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary disabled:opacity-75 font-serif font-bold italic"
                id="blank-fill-input"
              />
            </div>
          )}

          {/* Order words puzzle widgets */}
          {desafio.tipo === "ordenar-palavras" && (
            <div className="space-y-4">
              {/* Assembled Stack */}
              <div className="min-h-[55px] p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap gap-2 items-center">
                {assembledWords.length === 0 ? (
                  <span className="text-[11px] text-stone-400 italic font-medium px-2">
                    Toque nas palavras abaixo para ordenar a frase...
                  </span>
                ) : (
                  assembledWords.map((word, wIdx) => (
                    <button
                      key={wIdx}
                      onClick={() => handleRemoveWord(word, wIdx)}
                      disabled={quizStatus !== "unanswered"}
                      className="px-3 py-1.5 text-xs font-serif italic font-bold rounded-lg border border-[#5A5A40]/30 bg-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/20 hover:border-[#5A5A40]/50 transition-colors cursor-pointer"
                      type="button"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Scrambled selection stack */}
              <div className="flex flex-wrap gap-2 p-1.5 justify-center">
                {scrambledWords.map((word, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleWordTap(word, sIdx)}
                    disabled={quizStatus !== "unanswered"}
                    className="px-3.5 py-2 text-xs font-serif rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-stone-350 select-none hover:bg-stone-50 transition-colors cursor-pointer"
                    type="button"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback messages */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-1.5 text-xs text-red-500 font-semibold"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {quizStatus === "correct" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-start gap-2.5 text-xs"
                id="grammar-correct-box"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm mb-0.5">Resposta Correta! Excelente!</span>
                  <p className="text-[11px] text-emerald-700 opacity-90 leading-relaxed font-serif italic">
                    Você assimilou com êxito esta regra gramatical. Resposta: "{desafio.resposta_correta}"
                  </p>
                </div>
              </motion.div>
            )}

            {quizStatus === "incorrect" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-800 flex items-start gap-2.5 text-xs"
                id="grammar-incorrect-box"
              >
                <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm mb-0.5">Resposta Incorreta</span>
                  <p className="text-[11px] text-red-700 opacity-90 leading-relaxed">
                    Ops! Verifique a regra gramatical no painel superior e tente ordenar ou selecionar novamente.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submission and reset actions with Clay/Rust values */}
          <div className="mt-5 flex items-center justify-end gap-3 border-t border-stone-150 pt-4">
            {quizStatus !== "unanswered" && (
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer font-bold uppercase tracking-wider"
                type="button"
                id="reset-grammar-btn"
              >
                <RefreshCw className="w-3 h-3" /> Reiniciar
              </button>
            )}

            <button
              onClick={checkAnswer}
              disabled={quizStatus === "correct"}
              className="py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 bg-[#C05B33] hover:bg-[#C05B33]/90 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
              id="validate-grammar-btn"
            >
              <Award className="w-4 h-4" /> Validar Resposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
