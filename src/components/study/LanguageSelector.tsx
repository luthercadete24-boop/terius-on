import React from "react";
import { Globe, ChevronRight, CheckCircle } from "lucide-react";
import { Idioma, CalendarioEstudos } from "../../types";
import StudyCalendar from "./StudyCalendar";

interface LanguageSelectorProps {
  userId: number;
  idiomas: Idioma[];
  selectedIdioma: Idioma | null;
  onSelectIdioma: (idioma: Idioma) => void;
  progressPercent: number;
  completedLevelsCount: number;
  totalLevelsCount: number;
  calendario: CalendarioEstudos[];
  onRefreshData: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  userId,
  idiomas,
  selectedIdioma,
  onSelectIdioma,
  progressPercent,
  completedLevelsCount,
  totalLevelsCount,
  calendario,
  onRefreshData
}) => {
  return (
    <section className="lg:col-span-4 space-y-6">
      {/* Language switch panel */}
      <div className="bg-natural-card rounded-[32px] p-6 shadow-sm border border-stone-200 glow-indigo">
        <h3 className="font-serif italic text-xl mb-4 text-natural-primary flex items-center gap-2">
          <Globe className="w-4.5 h-4.5 text-natural-primary shrink-0" />
          Idioma de Estudo
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          {idiomas.map((idioma) => {
            const isActive = selectedIdioma?.id_idioma === idioma.id_idioma;
            return (
              <button
                key={idioma.id_idioma}
                onClick={() => onSelectIdioma(idioma)}
                className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl flex items-center justify-between border transition-all text-[11px] sm:text-xs font-semibold uppercase tracking-wider cursor-pointer touch-manipulation ${
                  isActive
                    ? "bg-natural-primary border-transparent text-white font-bold shadow-md shadow-natural-primary/10"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-white"
                }`}
                type="button"
                id={`language-btn-${idioma.id_idioma}`}
              >
                <span className="truncate">{idioma.nome_idioma}</span>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0 hidden sm:block lg:block" />
              </button>
            );
          })}
        </div>

        {/* Progress metrics bar with Clay/Rust colors */}
        <div className="mt-5 pt-4 border-t border-stone-150">
          <div className="flex items-center justify-between mb-1.5 text-xs font-bold uppercase tracking-tight">
            <span className="text-stone-500">Progresso Geral</span>
            <span className="text-natural-accent font-bold font-serif italic text-base">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="bg-natural-accent h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wide mt-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-natural-primary" />
            <span>
              {completedLevelsCount} de {totalLevelsCount} níveis concluídos
            </span>
          </div>
        </div>
      </div>

      {/* Custom study calendar scheduler panel */}
      {selectedIdioma && (
        <StudyCalendar
          id_usuario={userId}
          currentIdioma={selectedIdioma}
          calendarEntries={calendario}
          onCalendarUpdated={onRefreshData}
        />
      )}
    </section>
  );
};

export default LanguageSelector;
