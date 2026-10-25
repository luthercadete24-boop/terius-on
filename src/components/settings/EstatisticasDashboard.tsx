import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Trophy, 
  BrainCircuit, 
  Clock, 
  BookOpen, 
  Check, 
  Flame, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  RefreshCw,
  Award,
  Plus,
  Minus,
  CheckCircle2,
  Sliders,
  Download,
  Lightbulb,
  Calendar,
  AlertCircle,
  Sparkle
} from "lucide-react";
import { ProgressoUsuario, Nivel, Idioma, CalendarioEstudos } from "../../types";
import { motion, AnimatePresence } from "motion/react";

interface EstatisticasDashboardProps {
  progresso: ProgressoUsuario[];
  niveis: Nivel[];
  idiomas: Idioma[];
  currentIdioma: Idioma | null;
  calendario: CalendarioEstudos[];
  id_usuario: number;
  isEmbedded?: boolean;
}

interface DadosGraficoSemanal {
  semana: string;
  minutosEstudo: number;
  licoesConcluidas: number;
}

const DEFAULT_CHART_STATS: DadosGraficoSemanal[] = [
  { semana: "Semana 1", minutosEstudo: 120, licoesConcluidas: 2 },
  { semana: "Semana 2", minutosEstudo: 180, licoesConcluidas: 4 },
  { semana: "Semana 3", minutosEstudo: 135, licoesConcluidas: 3 },
  { semana: "Semana 4", minutosEstudo: 210, licoesConcluidas: 5 },
  { semana: "Semana Atual", minutosEstudo: 75, licoesConcluidas: 2 }
];

export const EstatisticasDashboard: React.FC<EstatisticasDashboardProps> = ({
  progresso,
  niveis,
  idiomas,
  currentIdioma,
  calendario,
  id_usuario,
  isEmbedded = false
}) => {
  // Navigation tabs of the entire central deck
  const [activeTab, setActiveTab] = useState<"charts" | "controls" | "presets">("charts");
  const [activeChartTab, setActiveChartTab] = useState<"time" | "exams" | "vocabulary" | "skills">("time");
  
  const [weeklyStats, setWeeklyStats] = useState<DadosGraficoSemanal[]>([]);
  const [learnedVocabsMap, setLearnedVocabsMap] = useState<Record<number, boolean>>({});
  const [statsUpdatedCounter, setStatsUpdatedCounter] = useState(0);

  // Controls state
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [sliderMinutes, setSliderMinutes] = useState<number>(30);
  const [bonusGrammar, setBonusGrammar] = useState(false);
  const [bonusSpeech, setBonusSpeech] = useState(false);
  const [bonusReading, setBonusReading] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customGoalMinutes, setCustomGoalMinutes] = useState<number | null>(null);

  const languageId = currentIdioma?.id_idioma || 1;
  const storageKey = `lingoprogress_stats_v1_${id_usuario}_${languageId}`;
  const goalOverrideKey = `lingoprogress_goal_override_${id_usuario}_${languageId}`;

  // 1. Process and Load Stats
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWeeklyStats(parsed);
        } else {
          setWeeklyStats(JSON.parse(JSON.stringify(DEFAULT_CHART_STATS)));
        }
      } catch (e) {
        setWeeklyStats(JSON.parse(JSON.stringify(DEFAULT_CHART_STATS)));
      }
    } else {
      setWeeklyStats(JSON.parse(JSON.stringify(DEFAULT_CHART_STATS)));
    }

    // Load custom goal override
    const savedGoal = localStorage.getItem(goalOverrideKey);
    if (savedGoal) {
      const g = parseInt(savedGoal);
      if (!isNaN(g) && g > 0) {
        setCustomGoalMinutes(g);
      } else {
        setCustomGoalMinutes(null);
      }
    } else {
      setCustomGoalMinutes(null);
    }

    // Load persistent Vocabs
    const savedVocabs = localStorage.getItem("lingoprogress_learnt_vocabs");
    if (savedVocabs) {
      try {
        setLearnedVocabsMap(JSON.parse(savedVocabs));
      } catch (err) {
        setLearnedVocabsMap({});
      }
    } else {
      setLearnedVocabsMap({});
    }
  }, [storageKey, goalOverrideKey, statsUpdatedCounter]);

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 400);
  };

  // Save Stats Wrapper
  const saveStats = (newStats: DadosGraficoSemanal[]) => {
    setWeeklyStats(newStats);
    localStorage.setItem(storageKey, JSON.stringify(newStats));
  };

  const saveCustomGoal = (goal: number | null) => {
    setCustomGoalMinutes(goal);
    if (goal === null) {
      localStorage.removeItem(goalOverrideKey);
    } else {
      localStorage.setItem(goalOverrideKey, goal.toString());
    }
    setStatsUpdatedCounter(prev => prev + 1);
  };

  // Baseline goal calculated from Study Calendar
  const calendarWeeklyMinutes = calendario
    .filter(c => !currentIdioma || c.id_idioma === currentIdioma.id_idioma)
    .reduce((acc, curr) => acc + curr.minutos_meta, 0);

  const baselineMinutes = calendarWeeklyMinutes || 120;
  const targetWeeklyMinutes = customGoalMinutes !== null ? customGoalMinutes : baselineMinutes;

  // Computed metrics
  const totalMinutes = weeklyStats.reduce((acc, curr) => acc + curr.minutosEstudo, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalLessonsCompleted = weeklyStats.reduce((acc, curr) => acc + curr.licoesConcluidas, 0);
  const currentWeekStats = weeklyStats.find(w => w.semana === "Semana Atual") || { minutosEstudo: 0, licoesConcluidas: 0 };
  const avgMinutes = weeklyStats.length > 0 ? Math.round(totalMinutes / weeklyStats.length) : 0;
  const goalProgressPercent = Math.min(100, Math.round((currentWeekStats.minutosEstudo / (targetWeeklyMinutes || 1)) * 100));

  // Vocabulary counts
  const learnedVocabIds = Object.keys(learnedVocabsMap).filter(key => learnedVocabsMap[Number(key)] === true);
  const learnedVocabCount = learnedVocabIds.length;
  const totalCourseVocabTerms = Math.max(75, learnedVocabCount + 35); 
  const vocabLearntPercentage = Math.round((learnedVocabCount / totalCourseVocabTerms) * 100);

  // Prova Final (Exam Accuracies/Correct Rates) per Level
  const mappedLevelGrades = niveis
    .filter(nivel => !currentIdioma || nivel.id_idioma === currentIdioma.id_idioma)
    .map(nivel => {
      const prog = progresso.find(p => p.id_nivel === nivel.id_nivel);
      const idiomaNome = idiomas.find(i => i.id_idioma === nivel.id_idioma)?.nome_idioma || "Idioma";
      const nivelLabel = `${nivel.nivel_atual}`;
      const notaFloat = prog ? prog.nota_prova_final : 0;
      const correctRate = notaFloat > 0 ? Math.round(notaFloat * 10) : 0; 
      
      return {
        nivelId: nivel.id_nivel,
        nivelLabel,
        notaRaw: notaFloat,
        correctRate: correctRate,
        concluido: prog ? prog.concluido : false,
        isBlocked: prog ? prog.bloqueado : true
      };
    });

  const examsWithScores = mappedLevelGrades.filter(g => g.notaRaw > 0);
  const averageExamSuccessRate = examsWithScores.length > 0 
    ? Math.round(examsWithScores.reduce((acc, curr) => acc + curr.correctRate, 0) / examsWithScores.length)
    : 0;

  // Study advice generator based on state
  const getStudyAdvice = () => {
    if (currentWeekStats.minutosEstudo === 0) {
      return "Sua jornada de estudos esta semana está pronta para começar! Registre alguns minutos para exercitar o cérebro.";
    }
    if (goalProgressPercent < 40) {
      return "Ótimo começo! Que tal programar 15 minutos extras de flashcards para consolidar novos termos?";
    }
    if (goalProgressPercent < 100) {
      return "Falta bem pouco para bater sua meta semanal de foco ativo! Um esforço final hoje fará você decolar.";
    }
    return "Excelente trabalho! 🎉 Sua meta semanal de estudos foi batida com maestria. Sinta-se livre para continuar buscando bônus!";
  };

  // Add learning minutes
  const handleAddMinutes = (min: number) => {
    let finalMin = min;
    let bonusApplied = 0;
    if (bonusGrammar) bonusApplied += 5;
    if (bonusSpeech) bonusApplied += 5;
    if (bonusReading) bonusApplied += 5;
    finalMin += bonusApplied;

    const updatedStats = weeklyStats.map((w) => {
      if (w.semana === "Semana Atual") {
        return { ...w, minutosEstudo: w.minutosEstudo + finalMin };
      }
      return w;
    });

    saveStats(updatedStats);
    setBonusGrammar(false);
    setBonusSpeech(false);
    setBonusReading(false);

    let notifyText = `+${finalMin} minutos adicionados!`;
    if (bonusApplied > 0) {
      notifyText += ` (com bônus de foco ativo de +${bonusApplied}m)`;
    }
    triggerToast(notifyText);
  };

  // Log custom input form submissions
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      handleAddMinutes(minutes);
      setCustomMinutes("");
    }
  };

  // Increment lessons
  const handleAddLicao = () => {
    const updatedStats = weeklyStats.map((w) => {
      if (w.semana === "Semana Atual") {
        return { ...w, licoesConcluidas: w.licoesConcluidas + 1 };
      }
      return w;
    });
    saveStats(updatedStats);
    triggerToast("+1 Lição lançada com sucesso!");
  };

  // Decrement lessons
  const handleRemoveLicao = () => {
    const updatedStats = weeklyStats.map((w) => {
      if (w.semana === "Semana Atual") {
        return { ...w, licoesConcluidas: Math.max(0, w.licoesConcluidas - 1) };
      }
      return w;
    });
    saveStats(updatedStats);
    triggerToast("Lição removida com sucesso.");
  };

  // Export progress reports
  const handleExportData = () => {
    const exportObj = {
      id_usuario,
      id_idioma: currentIdioma?.id_idioma || 0,
      idioma: currentIdioma?.nome_idioma || "Geral",
      dataExportacao: new Date().toLocaleDateString(),
      progressoSemanal: weeklyStats,
      metaMinutosMeta: targetWeeklyMinutes,
      taxaAcertoProvas: averageExamSuccessRate,
      totalVocabulariosEstudados: learnedVocabCount
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `estatisticas_estudante_${currentIdioma?.nome_idioma || "geral"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Dados exportados com sucesso!");
  };

  // Reset defaults
  const handleResetToDefaults = () => {
    if (confirm("Tens a certeza que desejas restaurar todas as estatísticas para os padrões de fábrica?")) {
      saveStats(JSON.parse(JSON.stringify(DEFAULT_CHART_STATS)));
      saveCustomGoal(null);
      triggerToast("Painel de controlo reinicializado.");
    }
  };

  const vocabularyPieData = [
    { name: "Vocábulos Memorizados", value: learnedVocabCount },
    { name: "Por Praticar/Aprender", value: Math.max(5, totalCourseVocabTerms - learnedVocabCount) }
  ];

  const skillsRadarData = [
    {
      subject: "Gramática",
      A: Math.min(100, Math.max(30, 45 + (totalLessonsCompleted * 4) + (averageExamSuccessRate * 0.3))),
      fullMark: 100
    },
    {
      subject: "Vocabulário",
      A: Math.min(100, Math.max(30, 35 + (learnedVocabCount * 2) + (averageExamSuccessRate * 0.2))),
      fullMark: 100
    },
    {
      subject: "Compreensão Oral",
      A: Math.min(100, Math.max(30, 40 + Math.round(totalMinutes / 8) + (averageExamSuccessRate * 0.2))),
      fullMark: 100
    },
    {
      subject: "Pronúncia",
      A: Math.min(100, Math.max(30, 35 + (bonusSpeech ? 20 : 0) + Math.round(totalMinutes / 12) + (averageExamSuccessRate * 0.2))),
      fullMark: 100
    },
    {
      subject: "Leitura",
      A: Math.min(100, Math.max(30, 42 + (bonusReading ? 15 : 0) + (totalLessonsCompleted * 3) + (averageExamSuccessRate * 0.2))),
      fullMark: 100
    }
  ];

  const PIE_COLORS = ["#5A5A40", "#EAEAE0"];

  return (
    <div 
      className={isEmbedded ? "text-stone-800 transition-all text-left relative" : "bg-natural-card rounded-[32px] p-6 sm:p-8 shadow-xs border border-stone-200 text-stone-800 transition-all text-left relative"}
      id="central-estatisticas-control-root"
    >
      {/* Toast Alert Prompt */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 bg-natural-primary text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2"
          >
            <Sparkle className="w-4 h-4 text-natural-accent animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-150 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-natural-accent font-mono text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Central Unificada de Estatísticas & Controlo</span>
            <span className="text-stone-300">•</span>
            <span>{currentIdioma?.nome_idioma || "Todos os Idiomas"}</span>
          </div>
          <h2 className="font-serif italic font-bold text-natural-primary text-2xl sm:text-3xl tracking-tight">
            Painel Geral de Aprendizado
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Visualize conquistas práticas, gerencie suas metas diárias e lance tempos de estudo externo.
          </p>
        </div>

        {/* Modular Navigation Bar & Toolbox */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/50">
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "charts"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              Gráficos de Desempenho
            </button>
            <button
              onClick={() => setActiveTab("controls")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "controls"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              Registro de Sessão
            </button>
            <button
              onClick={() => setActiveTab("presets")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "presets"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-850"
              }`}
              type="button"
            >
              Planeamento & Metas
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleExportData}
              className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 transition-all uppercase text-[9px] font-bold tracking-tight inline-flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Exportar dados consolidados em formato JSON"
              type="button"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Bento Cards - Consistent across all tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {/* KPI 1: Tempo acumulado */}
        <div className="bg-white border border-stone-150 p-4 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-natural-primary/15 text-natural-primary rounded-xl shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold leading-tight">Tempo Total</span>
            <span className="text-base sm:text-lg font-serif font-bold text-natural-primary tracking-tight">
              {totalHours} <span className="text-[10px] font-mono lowercase font-normal text-stone-400">hs</span>
            </span>
          </div>
        </div>

        {/* KPI 2: Lições resolvidades */}
        <div className="bg-white border border-stone-150 p-4 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-[#C05B33]/15 text-natural-accent rounded-xl shrink-0">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold leading-tight">Total Lições</span>
            <span className="text-base sm:text-lg font-serif font-bold text-[#C05B33] tracking-tight">
              {totalLessonsCompleted} <span className="text-[10px] font-mono lowercase font-normal text-stone-400">concl.</span>
            </span>
          </div>
        </div>

        {/* KPI 3: Prova Exame Success Tax */}
        <div className="bg-white border border-stone-150 p-4 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-[#5A5A40]/15 text-natural-primary rounded-xl shrink-0">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold leading-tight">Média Exames</span>
            <span className="text-base sm:text-lg font-serif font-bold text-natural-primary tracking-tight">
              {averageExamSuccessRate > 0 ? `${averageExamSuccessRate}%` : "0%"} <span className="text-[9px] font-mono lowercase font-normal text-stone-400">acerto</span>
            </span>
          </div>
        </div>

        {/* KPI 4: Vocabulário Consolidado */}
        <div className="bg-white border border-stone-150 p-4 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-yellow-500/15 text-yellow-700 rounded-xl shrink-0">
            <BrainCircuit className="w-4.5 h-4.5 text-yellow-600" />
          </div>
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold leading-tight">Lista Vocábulos</span>
            <span className="text-base sm:text-lg font-serif font-bold text-stone-700 tracking-tight">
              {learnedVocabCount} <span className="text-[10px] font-mono lowercase font-normal text-stone-400">estudo</span>
            </span>
          </div>
        </div>

        {/* KPI 5: Meta da Semana Atual */}
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold">Meta Ativa</span>
            <span className="text-[10px] font-mono font-bold text-[#C05B33]">{currentWeekStats.minutosEstudo}/{targetWeeklyMinutes}m</span>
          </div>
          <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden my-1 shadow-inner">
            <div 
              className="bg-natural-accent h-full rounded-full transition-all duration-300" 
              style={{ width: `${goalProgressPercent}%` }}
            />
          </div>
          <div className="text-[8px] font-mono text-stone-400 leading-none font-bold uppercase tracking-tight flex justify-between">
            <span>{goalProgressPercent >= 100 ? "🎉 Cumprida!" : "Em progresso"}</span>
            <span>{goalProgressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Cognitive study advice bar */}
      <div className="bg-white border border-stone-150 p-3 rounded-2xl mb-6 flex items-start gap-2.5 shadow-3xs">
        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5 shadow-2xs">
          <Lightbulb className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <span className="block text-[8px] font-mono uppercase tracking-wider font-bold text-stone-400 leading-tight">Dica de Fixação Diária</span>
          <p className="text-xs text-stone-700 font-serif italic leading-snug mt-0.5">"{getStudyAdvice()}"</p>
        </div>
      </div>

      {/* ======================== TAB 1: ADVANCED RECHARTS GRAPHICS ======================== */}
      {activeTab === "charts" && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-150 p-5 sm:p-6 rounded-2xl shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
              <div>
                <h3 className="font-serif italic font-bold text-natural-primary text-base">
                  Filtro de Desempenho
                </h3>
                <p className="text-[11px] text-stone-400 font-sans">
                  Use os marcadores para selecionar quais métricas deseja analisar no deck.
                </p>
              </div>

              {/* Sub tabs to toggle between Recharts categories */}
              <div className="flex bg-stone-50 p-1 border border-stone-200 rounded-xl text-[9px] font-bold uppercase tracking-wider font-mono self-start sm:self-center flex-wrap gap-1">
                <button
                  onClick={() => setActiveChartTab("time")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeChartTab === "time" ? "bg-natural-primary text-white font-extrabold shadow-sm" : "text-stone-500 hover:text-stone-850"
                  }`}
                >
                  Horas & Lições
                </button>
                <button
                  onClick={() => setActiveChartTab("exams")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeChartTab === "exams" ? "bg-natural-primary text-white font-extrabold shadow-sm" : "text-stone-500 hover:text-stone-850"
                  }`}
                >
                  Taxa de Acertos
                </button>
                <button
                  onClick={() => setActiveChartTab("vocabulary")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeChartTab === "vocabulary" ? "bg-natural-primary text-white font-extrabold shadow-sm" : "text-stone-500 hover:text-stone-850"
                  }`}
                >
                  Vocabulário
                </button>
                <button
                  onClick={() => setActiveChartTab("skills")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeChartTab === "skills" ? "bg-natural-primary text-white font-extrabold shadow-sm" : "text-stone-500 hover:text-stone-850"
                  }`}
                >
                  Competências
                </button>
              </div>
            </div>

            {/* Render Viewport */}
            <div className="w-full h-80 select-none">
              {activeChartTab === "time" && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weeklyStats} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5A5A40" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis dataKey="semana" tick={{ fontSize: 9, fill: "#78716c", fontWeight: "bold" }} stroke="#e7e5e4" />
                    <YAxis yAxisId="left" tick={{ fontSize: 9, fill: "#78716c" }} unit="m" stroke="#e7e5e4" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: "#a16207" }} unit=" L" stroke="#e7e5e4" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        borderRadius: "14px", 
                        border: "1px solid #e7e5e4",
                        fontSize: "11px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", paddingTop: "10px" }} />
                    <Area yAxisId="left" type="monotone" dataKey="minutosEstudo" name="Tempo Estudado (Minutos)" stroke="#5A5A40" strokeWidth={2.5} fillOpacity={1} fill="url(#timeGrad)" />
                    <Bar yAxisId="right" dataKey="licoesConcluidas" name="Lições Terminadas" fill="#C05B33" barSize={18} radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "exams" && (
                mappedLevelGrades.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full border border-dashed border-stone-200 rounded-xl bg-stone-50 text-stone-400 italic text-xs">
                    Nenhum exame final registrado para exibir. Realize provas nos módulos abaixo!
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mappedLevelGrades} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                      <XAxis dataKey="nivelLabel" tick={{ fontSize: 9, fill: "#78716c", fontWeight: "bold" }} stroke="#e7e5e4" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#78716c" }} unit="%" stroke="#e7e5e4" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e7e5e4", fontSize: "11px" }}
                        formatter={(val: number) => [`${val}% de Acerto`, "Desempenho"]}
                      />
                      <Legend wrapperStyle={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", paddingTop: "10px" }} />
                      <Bar dataKey="correctRate" name="Aproveitamento Prova Final" fill="#C05B33" radius={[5, 5, 0, 0]} barSize={28}>
                        {mappedLevelGrades.map((entry, idx) => (
                          <Cell key={idx} fill={entry.correctRate >= 70 ? "#5A5A40" : "#C05B33"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )
              )}

              {activeChartTab === "vocabulary" && (
                <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full">
                  <div className="h-60 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vocabularyPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {vocabularyPieData.map((e, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v} palavras`, "Classificação"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend breakdown list */}
                  <div className="space-y-4 text-left p-2">
                    <h4 className="font-serif italic font-bold text-natural-primary text-sm">Biblioteca de Vocábulos</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2">
                        <span className="w-3 h-3 bg-[#5A5A40] rounded-sm shrink-0 mt-1" />
                        <div>
                          <span className="text-xs font-bold text-stone-700">Memorizados de Forma Ativa ({learnedVocabCount} termos)</span>
                          <p className="text-[11px] text-stone-500 leading-snug">Fixação consolidada por cartões marcados como aprendidos.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-3 h-3 bg-[#EAEAE0] rounded-sm shrink-0 mt-1" />
                        <div>
                          <span className="text-xs font-bold text-stone-700">Restante do Percurso ({Math.max(5, totalCourseVocabTerms - learnedVocabCount)} termos)</span>
                          <p className="text-[11px] text-stone-500 leading-snug">Termos pendentes de revisão sistemática de tradução/TTS.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeChartTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full gap-4">
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsRadarData}>
                        <PolarGrid stroke="#e7e5e4" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fontSize: 9, fill: "#44403c", fontWeight: "bold" }} 
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fontSize: 8, fill: "#78716c" }} 
                        />
                        <Radar 
                          name="Desempenho" 
                          dataKey="A" 
                          stroke="#5A5A40" 
                          fill="#5A5A40" 
                          fillOpacity={0.35} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#ffffff", 
                            borderRadius: "14px", 
                            border: "1px solid #e7e5e4",
                            fontSize: "11px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                          }}
                          formatter={(v: number) => [`${v}%`, "Proficiência"]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend/explanation breakdown list */}
                  <div className="space-y-3.5 text-left p-2">
                    <h4 className="font-serif italic font-bold text-natural-primary text-sm">Mapeamento de Competências</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Sua proficiência é calculada dinamicamente cruzando as lições concluídas, vocábulos assimilados e desempenho nas avaliações finais de nível.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-700 block">Gramática</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: `${skillsRadarData[0].A}%` }} />
                          </div>
                          <span className="font-mono text-[9px] font-black text-[#5A5A40] shrink-0">{skillsRadarData[0].A}%</span>
                        </div>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-700 block">Vocabulário</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: `${skillsRadarData[1].A}%` }} />
                          </div>
                          <span className="font-mono text-[9px] font-black text-[#5A5A40] shrink-0">{skillsRadarData[1].A}%</span>
                        </div>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-700 block">Compreensão Oral</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: `${skillsRadarData[2].A}%` }} />
                          </div>
                          <span className="font-mono text-[9px] font-black text-[#5A5A40] shrink-0">{skillsRadarData[2].A}%</span>
                        </div>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-700 block">Pronúncia & Fala</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: `${skillsRadarData[3].A}%` }} />
                          </div>
                          <span className="font-mono text-[9px] font-black text-[#5A5A40] shrink-0">{skillsRadarData[3].A}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================== TAB 2: ACTIVE MANUAL LOG CONTROLS ======================== */}
      {activeTab === "controls" && (
        <div className="bg-white border border-stone-150 p-5 sm:p-6 rounded-2xl shadow-3xs">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-5">
            <Sliders className="w-4.5 h-4.5 text-natural-primary" />
            <div>
              <h3 className="font-serif italic font-bold text-natural-primary text-base">
                Registo e Lançamento de Atividades Externas
              </h3>
              <p className="text-[11px] text-stone-500 font-sans">
                Adicione tempo de podcasts ou marque lições adicionais concluídas de canais externos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slide and custom increments section */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                <Clock className="w-4 h-4 text-[#5A5A40]" />
                <span>1. Marcador Linear de Minutos</span>
              </h4>

              <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-600">Inserção selecionada:</span>
                  <span className="font-mono text-natural-accent bg-white border border-stone-250 py-0.5 px-2.5 rounded-md text-sm shadow-2xs font-extrabold">
                    {sliderMinutes} minutos
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={sliderMinutes}
                  onChange={(e) => setSliderMinutes(parseInt(e.target.value))}
                  className="w-full accent-natural-primary cursor-col-resize py-1"
                />

                {/* Focus Active Activities checkboxes with dynamic +5m bonuses */}
                <div className="pt-2.5 border-t border-stone-200.5 space-y-2">
                  <span className="block text-[8.5px] font-mono uppercase tracking-wider text-stone-400 font-extrabold leading-none">
                    Atividades com bónus de foco ativo (+5m cada):
                  </span>
                  
                  <div className="grid grid-cols-1 gap-1.5 text-left mt-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bonusGrammar}
                        onChange={(e) => setBonusGrammar(e.target.checked)}
                        className="rounded border-stone-300 text-natural-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-natural-primary"
                      />
                      <span>Exercício escrito de Gramática Fina (+5m)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bonusSpeech}
                        onChange={(e) => setBonusSpeech(e.target.checked)}
                        className="rounded border-stone-300 text-natural-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-natural-primary"
                      />
                      <span>Pronúncia audível / Fala gravada (+5m)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bonusReading}
                        onChange={(e) => setBonusReading(e.target.checked)}
                        className="rounded border-stone-300 text-natural-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Leitura literária / Artigo de blog (+5m)</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleAddMinutes(sliderMinutes)}
                  className="w-full py-2.5 rounded-xl bg-natural-primary hover:bg-[#4d4d38] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm font-extrabold"
                  type="button"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dançar Minutos Praticados</span>
                </button>
              </div>

              {/* Exact form search minute loader */}
              <div className="pt-2">
                <span className="block text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider mb-2">ou digite o valor exato estudado (minutos):</span>
                <form onSubmit={handleCustomSubmit} className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Ex: 45m"
                    min="1"
                    max="600"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary flex-1 max-w-44 font-semibold"
                  />
                  <button
                    className="py-2 px-4 rounded-xl bg-natural-primary hover:bg-[#43432e] text-white transition-all uppercase tracking-wider text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    type="submit"
                  >
                    <span>Lançar</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Incremental lesson checks */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C05B33] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C05B33]" />
                <span>2. Registo de Exercícios & Lições</span>
              </h4>

              <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-600">Contador semanal acumulado:</span>
                  <span className="font-mono text-[#C05B33] bg-white border border-stone-200 py-0.5 px-3 rounded-md text-sm font-extrabold shadow-2xs">
                    {currentWeekStats.licoesConcluidas} lições
                  </span>
                </div>

                <p className="text-xs text-stone-500 font-serif italic leading-relaxed">
                  Incrementar o marcador aumenta sua pontuação geral de consistência e atualiza os gráficos longitudinal do Recharts.
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddLicao}
                    className="flex-1 py-2.5 rounded-xl bg-[#C05B33] hover:bg-[#aa4723] text-white text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar (+1)</span>
                  </button>
                  <button
                    onClick={handleRemoveLicao}
                    disabled={currentWeekStats.licoesConcluidas === 0}
                    className="py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-500 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Remover uma lição da semana corrente"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reset logs module */}
              <div className="pt-4 border-t border-stone-100 text-left">
                <h5 className="text-[9px] font-mono uppercase text-stone-400 font-bold mb-1.5">Ações de Recuperação do Administrador:</h5>
                <button
                  onClick={handleResetToDefaults}
                  className="py-1.5 px-3 rounded-lg text-[9px] border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 font-semibold uppercase tracking-wider cursor-pointer font-mono"
                  type="button"
                >
                  ⚠️ Redefinir Todas as Métricas para Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================== TAB 3: STUDY CALENDAR PLANNING SUMMARY ======================== */}
      {activeTab === "presets" && (
        <div className="bg-white border border-stone-150 p-5 sm:p-6 rounded-2xl shadow-3xs text-left">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-5">
            <Calendar className="w-4.5 h-4.5 text-natural-primary" />
            <div>
              <h3 className="font-serif italic font-bold text-natural-primary text-base">
                Planeamento de Metas de Carga Horária
              </h3>
              <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                Estabeleça metas semanais manuais ou use seu calendário de estudos como base calculada.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                <Trophy className="w-4 h-4 text-[#5A5A40]" />
                <span>Configurar Carga Customizada</span>
              </h4>

              <div className="bg-stone-50/60 border border-stone-150 p-4.5 rounded-xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-600 font-medium">Meta atual em vigor:</span>
                  <span className="font-extrabold text-natural-primary font-mono text-sm">
                    {targetWeeklyMinutes} minutos semanais
                  </span>
                </div>

                <p className="text-xs text-stone-500 font-serif italic leading-relaxed">
                  Gostaria de mudar sua meta temporariamente? Selecione um ritmo predefinido:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      saveCustomGoal(60);
                      triggerToast("Meta fixada em 60m (Moderado)");
                    }}
                    className={`py-2 px-1 rounded-xl text-[9px] font-extrabold uppercase tracking-tight border transition-all cursor-pointer ${
                      targetWeeklyMinutes === 60 
                        ? "bg-natural-primary border-transparent text-white shadow-xs" 
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    🌱 60 min (Leve)
                  </button>
                  
                  <button
                    onClick={() => {
                      saveCustomGoal(120);
                      triggerToast("Meta fixada em 120m (Foco)");
                    }}
                    className={`py-2 px-1 rounded-xl text-[9px] font-extrabold uppercase tracking-tight border transition-all cursor-pointer ${
                      targetWeeklyMinutes === 120
                        ? "bg-natural-primary border-transparent text-white shadow-xs" 
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-200"
                    }`}
                  >
                    🔥 120 min (Foco)
                  </button>

                  <button
                    onClick={() => {
                      saveCustomGoal(200);
                      triggerToast("Meta fixada em 200m (Intenso)");
                    }}
                    className={`py-2 px-1 rounded-xl text-[9px] font-extrabold uppercase tracking-tight border transition-all cursor-pointer ${
                      targetWeeklyMinutes === 200
                        ? "bg-natural-primary border-transparent text-white shadow-xs" 
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-200"
                    }`}
                  >
                    🚀 200 min (Imersão)
                  </button>
                </div>

                {customGoalMinutes !== null && (
                  <button
                    onClick={() => {
                      saveCustomGoal(null);
                      triggerToast("Restaurando cálculo automático do calendário.");
                    }}
                    className="w-full text-center text-[10px] text-stone-500 hover:text-stone-800 transition-colors uppercase font-mono font-bold pt-1 block cursor-pointer"
                  >
                    ← Voltar ao cálculo automático do calendário ({baselineMinutes}m)
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C05B33] flex items-center gap-2 font-mono border-b border-stone-100 pb-1.5">
                <Calendar className="w-4 h-4 text-[#C05B33]" />
                <span>Alinhamento com sua Agenda</span>
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {calendario && calendario.filter(c => !currentIdioma || c.id_idioma === currentIdioma.id_idioma).length > 0 ? (
                  calendario
                    .filter(c => !currentIdioma || c.id_idioma === currentIdioma.id_idioma)
                    .map((calc, index) => {
                      const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                      return (
                        <div key={index} className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-stone-50 border border-stone-150 font-semibold shadow-3xs">
                          <span className="text-stone-700">{diasSemanaNomes[calc.dia_semana]} às {calc.hora_estudo}</span>
                          <span className="font-mono text-[10px] text-natural-accent bg-stone-100 rounded-lg px-2.5 py-0.5">{calc.minutos_meta}m programados</span>
                        </div>
                      );
                    })
                ) : (
                  <div className="p-4 border border-dashed border-stone-200 bg-stone-50 text-center rounded-xl text-[11px] text-stone-400 italic">
                    Nenhum alinhamento ou evento registrado no Agenda de estudos para somar minutos base. Adicione compromissos no calendário à esquerda da tela!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstatisticasDashboard;
