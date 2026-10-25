import React, { useState } from "react";
import { BookOpen, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Licao, Vocabulario, Gramatica, Idioma } from "../../types";
import { ExplanationSection } from "./ExplanationSection";
import VocabularySection from "./VocabularySection";
import GrammarSection from "./GrammarSection";

interface LessonWorkspaceProps {
  licoes: Licao[];
  selectedLicao: Licao | null;
  onSelectLicao: (licao: Licao) => void;
  onTriggerExam: () => void;
  vocabulary: Vocabulario[];
  grammar: Gramatica | null;
  selectedIdioma: Idioma;
  ttsSpeed: number;
  ttsVoiceURI: string;
  ttsAutoplay: boolean;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  licoes,
  selectedLicao,
  onSelectLicao,
  onTriggerExam,
  vocabulary,
  grammar,
  selectedIdioma,
  ttsSpeed,
  ttsVoiceURI,
  ttsAutoplay
}) => {
  const [activeTab, setActiveTab] = useState<"explanation" | "vocabulary" | "grammar">("explanation");

  return (
    <div className="bg-natural-card rounded-[32px] p-6 shadow-sm border border-stone-200 glow-indigo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-150 pb-5 mb-5">
        <div>
          <h3 className="text-xl font-serif text-[#5A5A40] font-bold">
            Lições de Competência
          </h3>
          <p className="text-xs text-stone-500 italic mt-0.5">
            Pratique cada lição antes de prestar a avaliação final de nível.
          </p>
        </div>

        {/* Trigger Level Exam Button */}
        <button
          onClick={onTriggerExam}
          className="py-2.5 px-4 rounded-xl bg-natural-accent hover:bg-natural-accent/90 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          type="button"
          id="trigger-exam-btn"
        >
          <FileCheck className="w-4.5 h-4.5" /> Realizar Prova Final
        </button>
      </div>

      {licoes.length === 0 ? (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <BookOpen className="w-6 h-6 mx-auto text-stone-400 mb-1" />
          <p className="text-xs text-stone-500 mb-4 italic">
            Nenhuma lição cadastrada para este nível de competência no momento.
          </p>
          <div className="text-xs text-natural-primary font-semibold uppercase tracking-wider">
            Selecione outro nível acima ou utilize o Painel de Controle para gerenciar lições.
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Horizontal lessons tab switches */}
          <div className="flex flex-wrap gap-2">
            {licoes.map((licao) => {
              const isActive = selectedLicao?.id_licao === licao.id_licao;
              return (
                <button
                  key={licao.id_licao}
                  onClick={() => {
                    onSelectLicao(licao);
                    setActiveTab("explanation");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all pointer-events-auto cursor-pointer ${
                    isActive
                      ? "bg-[#5A5A40] text-white font-bold"
                      : "bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-800 hover:border-stone-300"
                  }`}
                  type="button"
                  id={`licao-tab-${licao.id_licao}`}
                >
                  Lição {licao.ordem_licao}: {licao.titulo}
                </button>
              );
            })}
          </div>

          {/* Selected active lesson detailed workspaces */}
          {selectedLicao && (
            <div className="space-y-6 pt-4 border-t border-stone-150">
              {/* Exercise switch headers */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveTab("explanation")}
                  className={`text-xs font-bold uppercase tracking-widest pb-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "explanation"
                      ? "border-[#5A5A40] text-[#5A5A40]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                  type="button"
                >
                  Fundamentos da Lição
                </button>

                <button
                  onClick={() => setActiveTab("vocabulary")}
                  className={`text-xs font-bold uppercase tracking-widest pb-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "vocabulary"
                      ? "border-[#5A5A40] text-[#5A5A40]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                  type="button"
                >
                  Vocabulário Flashcards
                </button>

                <button
                  onClick={() => setActiveTab("grammar")}
                  className={`text-xs font-bold uppercase tracking-widest pb-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "grammar"
                      ? "border-[#5A5A40] text-[#5A5A40]"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                  type="button"
                >
                  Módulo de Gramática
                </button>
              </div>

              {/* Interactive Exercises viewport */}
              <AnimatePresence mode="wait">
                {activeTab === "explanation" ? (
                  <motion.div
                    key="explanation-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <ExplanationSection
                      explicacao={selectedLicao.explicacao_profunda || ""}
                    />
                  </motion.div>
                ) : activeTab === "vocabulary" ? (
                  <motion.div
                    key="vocab-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <VocabularySection
                      vocabularios={vocabulary}
                      idiomaNome={selectedIdioma.nome_idioma}
                      ttsSpeed={ttsSpeed}
                      ttsVoiceURI={ttsVoiceURI}
                      ttsAutoplay={ttsAutoplay}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="grammar-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <GrammarSection gramatica={grammar} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonWorkspace;
