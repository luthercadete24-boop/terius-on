import React from "react";
import { BookOpen, HelpCircle, Lightbulb, PenTool } from "lucide-react";

interface ExplanationSectionProps {
  explicacao: string;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({ explicacao }) => {
  if (!explicacao) {
    return (
      <div className="p-6 text-center text-stone-500 italic">
        Nenhuma explicação profunda disponível para esta lição.
      </div>
    );
  }

  // Split by #### to isolate sections
  const parts = explicacao.split("####");
  
  // Clean title header from first section (e.g. ### Title)
  let intro = parts[0] || "";
  let title = "Fundamentos da Lição";
  
  const titleMatch = intro.match(/###\s*(.*)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
    intro = intro.replace(/###\s*.*/, "").trim();
  }

  // Find structure part and tip part
  let structures = "";
  let tips = "";

  parts.slice(1).forEach(part => {
    if (part.includes("Estruturas Fundamentais")) {
      structures = part.replace(/.*Estruturas Fundamentais.*/, "").trim();
    } else if (part.includes("Uso Prático") || part.includes("Dica Cultural") || part.includes("Dica do Professor")) {
      tips = part.replace(/.*(Uso Prático|Dica Cultural|Dica do Professor).*/, "").trim();
    } else {
      // Catch-all
      if (!structures) {
        structures = part.trim();
      } else {
        tips = part.trim();
      }
    }
  });

  // Helper to parse bold text **like this** and italic *like this* or quotes *"like this"*
  const formatText = (text: string) => {
    if (!text) return "";
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Sub bullets like "   - " or "   * "
      const isSubBullet = line.startsWith("   -") || line.startsWith("  -") || line.startsWith("\t-") || line.startsWith(" -");
      // Standard bullets
      const isBullet = trimmed.startsWith("-");
      // Numbered items
      const isNumbered = /^\d+\./.test(trimmed);

      // Clean indicators from text
      let content = trimmed;
      if (isBullet) content = trimmed.substring(1).trim();
      if (isNumbered) content = trimmed.replace(/^\d+\./, "").trim();

      // Render bold (**), italic (*), quotes (*"...") with nice styles
      const parts: React.ReactNode[] = [];
      let temp = content;
      
      let regex = /(\*\*.*?\*\*|\*".*?"\*|\*.*?\*)/g;
      let lastIndex = 0;
      let match;
      let itemKey = 0;

      while ((match = regex.exec(content)) !== null) {
        const matchStr = match[0];
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
          parts.push(<span key={itemKey++}>{content.substring(lastIndex, matchIndex)}</span>);
        }

        if (matchStr.startsWith("**") && matchStr.endsWith("**")) {
          parts.push(
            <strong key={itemKey++} className="font-bold text-stone-800 dark:text-stone-100">
              {matchStr.slice(2, -2)}
            </strong>
          );
        } else if (matchStr.startsWith('*"') && matchStr.endsWith('"*')) {
          parts.push(
            <span key={itemKey++} className="bg-natural-accent/10 px-1.5 py-0.5 rounded font-mono text-[13px] text-natural-accent italic font-semibold">
              {matchStr.slice(2, -2)}
            </span>
          );
        } else if (matchStr.startsWith("*") && matchStr.endsWith("*")) {
          parts.push(
            <em key={itemKey++} className="italic text-stone-600 dark:text-stone-300">
              {matchStr.slice(1, -1)}
            </em>
          );
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(<span key={itemKey++}>{content.substring(lastIndex)}</span>);
      }

      const finalContent = parts.length > 0 ? parts : content;

      if (isSubBullet) {
        return (
          <div key={idx} className="pl-6 py-1 flex items-start gap-2 text-stone-600 dark:text-stone-300 text-xs">
            <span className="text-stone-400 mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="leading-relaxed">{finalContent}</span>
          </div>
        );
      }

      if (isBullet) {
        return (
          <div key={idx} className="pl-2 py-1 flex items-start gap-2 text-stone-700 dark:text-stone-200 text-xs sm:text-sm">
            <span className="text-natural-accent mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-natural-accent" />
            <span className="leading-relaxed">{finalContent}</span>
          </div>
        );
      }

      if (isNumbered) {
        const numMatch = trimmed.match(/^(\d+)\./);
        const number = numMatch ? numMatch[1] : "1";
        return (
          <div key={idx} className="py-2.5 flex items-start gap-3 border-b border-stone-100 dark:border-stone-800 last:border-b-0">
            <span className="w-5 h-5 rounded-full bg-natural-primary/10 text-natural-primary font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {number}
            </span>
            <div className="leading-relaxed text-stone-700 dark:text-stone-200 text-xs sm:text-sm">{finalContent}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed mb-3">
          {finalContent}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6" id="explanation-container">
      {/* Decorative Title Card */}
      <div className="bg-[#5A5A40]/10 p-5 rounded-2xl border border-[#5A5A40]/20 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-serif font-bold text-[#5A5A40]">
            {title}
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">
            Fundamentos teóricos e aspetos culturais essenciais para esta lição de competência.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intro & Structures */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Intro Card */}
          {intro.trim() && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-150 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="w-4.5 h-4.5 text-natural-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-natural-primary">
                  Introdução e Fundamentos
                </span>
              </div>
              <div>{formatText(intro)}</div>
            </div>
          )}

          {/* Structures Card */}
          {structures.trim() && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-150 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-2 mb-3 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                <HelpCircle className="w-4.5 h-4.5 text-natural-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-natural-primary">
                  Estruturas Fundamentais de Frase
                </span>
              </div>
              <div className="space-y-1">{formatText(structures)}</div>
            </div>
          )}
        </div>

        {/* Right Column: Tips & Practical Application */}
        <div className="lg:col-span-5 space-y-6">
          {tips.trim() && (
            <div className="bg-[#FAF9F6] dark:bg-stone-950 rounded-2xl p-5 border border-amber-200/40 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400/50" />
              
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4.5 h-4.5 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Uso Prático & Dica Cultural
                </span>
              </div>
              <div className="text-stone-700 dark:text-stone-300">{formatText(tips)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
