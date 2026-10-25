import React from "react";
import { Lock, CheckCircle, Compass } from "lucide-react";
import { Idioma, Nivel, ProgressoUsuario } from "../../types";

interface LevelSelectorProps {
  selectedIdioma: Idioma;
  niveis: Nivel[];
  progresso: ProgressoUsuario[];
  selectedNivel: Nivel | null;
  onSelectNivel: (nivel: Nivel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedIdioma,
  niveis,
  progresso,
  selectedNivel,
  onSelectNivel
}) => {
  const levelsForLang = niveis
    .filter((n) => n.id_idioma === selectedIdioma.id_idioma)
    .sort((a, b) => a.ordem_nivel - b.ordem_nivel);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {levelsForLang.map((nivel) => {
        const levelProg = progresso.find((p) => p.id_nivel === nivel.id_nivel);
        const isLocked = levelProg ? levelProg.bloqueado : true;
        const isCompleted = levelProg ? levelProg.concluido : false;
        const isActive = selectedNivel?.id_nivel === nivel.id_nivel;

        const levelLabel =
          nivel.nivel_atual === "Intermediario"
            ? "Intermediário"
            : nivel.nivel_atual === "Medio"
            ? "Médio"
            : "Avançado";

        return (
          <button
            key={nivel.id_nivel}
            disabled={isLocked}
            onClick={() => onSelectNivel(nivel)}
            className={`p-2.5 sm:p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all relative min-h-[72px] sm:min-h-[85px] touch-manipulation cursor-pointer ${
              isActive
                ? "bg-white border-natural-primary shadow-sm ring-1 ring-natural-primary"
                : isLocked
                ? "bg-stone-200/40 border-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-white border-stone-200 text-[#5A5A40] hover:border-stone-300 hover:bg-stone-50"
            }`}
            type="button"
            id={`level-btn-${nivel.id_nivel}`}
          >
            {isLocked ? (
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 mb-1 shrink-0" />
            ) : isCompleted ? (
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-natural-accent mb-1 shrink-0" />
            ) : (
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A5A40] mb-1 shrink-0" />
            )}

            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate max-w-full">
              {levelLabel}
            </span>

            {!isLocked && levelProg && levelProg.nota_prova_final > 0 && (
              <span className="text-[8px] sm:text-[9px] font-mono text-natural-accent font-semibold mt-0.5 sm:mt-1">
                Nota: {levelProg.nota_prova_final.toFixed(1)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LevelSelector;
