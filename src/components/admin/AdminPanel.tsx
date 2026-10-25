import React, { useState, useEffect } from "react";
import {
  Globe,
  BookOpen,
  PlusCircle,
  Trash2,
  Users,
  Settings,
  Database,
  RefreshCw,
  FileText,
  AlertTriangle,
  Check,
  ChevronRight,
  Sparkles,
  Search,
  CheckSquare
} from "lucide-react";
import { Idioma, Nivel, Licao, Vocabulario, Gramatica, Usuario, QuestaoProva } from "../../types";

interface AdminPanelProps {
  onClose: () => void;
  onRefreshApp: () => void;
}

export default function AdminPanel({ onClose, onRefreshApp }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "languages" | "lessons" | "questions" | "users">("dashboard");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  // DB raw states
  const [stats, setStats] = useState<any>({});
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [vocabularios, setVocabularios] = useState<Vocabulario[]>([]);
  const [gramaticas, setGramaticas] = useState<Gramatica[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoProva[]>([]);

  // Form states
  const [newIdioma, setNewIdioma] = useState("");
  const [selectedLevelIdForLesson, setSelectedLevelIdForLesson] = useState<string>("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  
  // New Vocab Form
  const [selectedLessonIdForVocab, setSelectedLessonIdForVocab] = useState<string>("");
  const [vocabTerm, setVocabTerm] = useState("");
  const [vocabTranslation, setVocabTranslation] = useState("");
  const [vocabEx1, setVocabEx1] = useState("");
  const [vocabEx2, setVocabEx2] = useState("");
  const [vocabEx3, setVocabEx3] = useState("");
  const [vocabAudioUrl, setVocabAudioUrl] = useState("");
  const [vocabImageUrl, setVocabImageUrl] = useState("");
  const [searchingPronunciation, setSearchingPronunciation] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // New Grammar Rule Form
  const [selectedLessonIdForGrammar, setSelectedLessonIdForGrammar] = useState<string>("");
  const [grammarTitle, setGrammarTitle] = useState("");
  const [grammarExplanation, setGrammarExplanation] = useState("");
  const [grammarQuizType, setGrammarQuizType] = useState<"multipla-escolha" | "completar-lacuna" | "ordenar-palavras">("multipla-escolha");
  const [grammarQuestion, setGrammarQuestion] = useState("");
  const [grammarAnswer, setGrammarAnswer] = useState("");
  const [grammarOptions, setGrammarOptions] = useState<string[]>(["", "", "", ""]);
  const [grammarBlankSentence, setGrammarBlankSentence] = useState("");
  const [grammarShuffledWords, setGrammarShuffledWords] = useState("");

  // New Question Form
  const [selectedLevelIdForQuestion, setSelectedLevelIdForQuestion] = useState<string>("");
  const [questionText, setQuestionText] = useState("");
  const [questionCategory, setQuestionCategory] = useState<"Vocabulario" | "Gramatica" | "Interpretacao">("Vocabulario");
  const [questionOptions, setQuestionOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);

  // Fetch all data
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/all-data");
      if (!res.ok) throw new Error("Falha ao obter dados do painel.");
      const data = await res.json();
      setStats(data.stats || {});
      setUsuarios(data.usuarios || []);
      setIdiomas(data.idiomas || []);
      setNiveis(data.niveis || []);
      setLicoes(data.licoes || []);
      setVocabularios(data.vocabularios || []);
      setGramaticas(data.gramaticas || []);
      setQuestoes(data.questoes || []);

      // Autofills
      if (data.niveis && data.niveis.length > 0 && !selectedLevelIdForLesson) {
        setSelectedLevelIdForLesson(data.niveis[0].id_nivel.toString());
        setSelectedLevelIdForQuestion(data.niveis[0].id_nivel.toString());
      }
      if (data.licoes && data.licoes.length > 0 && !selectedLessonIdForVocab) {
        setSelectedLessonIdForVocab(data.licoes[0].id_licao.toString());
        setSelectedLessonIdForGrammar(data.licoes[0].id_licao.toString());
      }
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Actions
  const handleAddIdioma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdioma.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/idiomas/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_idioma: newIdioma.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar idioma");
      showMsg("success", `Idioma "${newIdioma}" adicionado com sucesso com 3 níveis e avaliações!`);
      setNewIdioma("");
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevelIdForLesson || !newLessonTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/licoes/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_nivel: parseInt(selectedLevelIdForLesson),
          titulo: newLessonTitle.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar lição");
      showMsg("success", `Lição "${newLessonTitle}" cadastrada com sucesso!`);
      setNewLessonTitle("");
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLicao = (id_licao: number, licao_titulo: string) => {
    setConfirmDialog({
      title: "Excluir Lição",
      message: `Tem certeza que deseja apagar a lição "${licao_titulo}"? Todos os vocabulários e regras de gramática desta lição serão permanentemente excluídos.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/licoes/${id_licao}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Erro ao apagar lição.");
          showMsg("success", "Lição excluída com sucesso.");
          fetchAllAdminData();
          onRefreshApp();
        } catch (err: any) {
          showMsg("error", err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSearchPronunciation = async () => {
    if (!vocabTerm.trim()) {
      showMsg("error", "Insira o termo original primeiro para buscar a pronúncia.");
      return;
    }
    setSearchingPronunciation(true);
    setSearchFeedback(null);
    try {
      // Find language of the selected lesson
      const lesson = licoes.find(l => l.id_licao === parseInt(selectedLessonIdForVocab));
      let langName = "";
      if (lesson) {
        const level = niveis.find(n => n.id_nivel === lesson.id_nivel);
        if (level) {
          const langObj = idiomas.find(i => i.id_idioma === level.id_idioma);
          if (langObj) langName = langObj.nome_idioma;
        }
      }

      const res = await fetch(`/api/pronunciation/search?term=${encodeURIComponent(vocabTerm.trim())}&lang=${encodeURIComponent(langName)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na busca");
      
      if (data.url_audio) {
        setVocabAudioUrl(data.url_audio);
        setSearchFeedback(`Obtido via ${data.source === "forvo" ? "Forvo API" : data.source === "open_dictionary_curated" ? "Dicionário de Kimbundu/Lingala" : "Síntese Fonética Aberta"}`);
        showMsg("success", "Pronúncia localizada com sucesso!");
      } else {
        showMsg("error", "Nenhuma pronúncia encontrada.");
      }
    } catch (err: any) {
      showMsg("error", `Falha ao buscar: ${err.message}`);
    } finally {
      setSearchingPronunciation(false);
    }
  };

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLessonIdForVocab || !vocabTerm.trim() || !vocabTranslation.trim() || !vocabEx1.trim()) {
      showMsg("error", "Por favor preencha todos os campos obrigatórios do vocabulário.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vocabularios/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_licao: parseInt(selectedLessonIdForVocab),
          termo_original: vocabTerm.trim(),
          traducao: vocabTranslation.trim(),
          exemplo_contexto_1: vocabEx1.trim(),
          exemplo_contexto_2: vocabEx2.trim() || undefined,
          exemplo_contexto_3: vocabEx3.trim() || undefined,
          url_audio: vocabAudioUrl.trim() || undefined,
          url_imagem: vocabImageUrl.trim() || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar termo");
      showMsg("success", `Termo "${vocabTerm}" inserido na lição com sucesso!`);
      setVocabTerm("");
      setVocabTranslation("");
      setVocabEx1("");
      setVocabEx2("");
      setVocabEx3("");
      setVocabAudioUrl("");
      setVocabImageUrl("");
      setSearchFeedback(null);
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrammar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLessonIdForGrammar || !grammarTitle.trim() || !grammarExplanation.trim() || !grammarQuestion.trim() || !grammarAnswer.trim()) {
      showMsg("error", "Por favor preencha os campos obrigatórios da gramática.");
      return;
    }

    let desafio_json: any = {
      tipo: grammarQuizType,
      pergunta: grammarQuestion.trim(),
      resposta_correta: grammarAnswer.trim()
    };

    if (grammarQuizType === "multipla-escolha") {
      const filteredOptions = grammarOptions.filter(o => o.trim() !== "");
      if (filteredOptions.length < 2) {
        showMsg("error", "Adicione pelo menos 2 opções de resposta para múltipla escolha.");
        return;
      }
      desafio_json.opcoes = filteredOptions;
    } else if (grammarQuizType === "completar-lacuna") {
      if (!grammarBlankSentence.includes("___")) {
        showMsg("error", "A frase com lacuna deve conter o marcador '___' para o aluno.");
        return;
      }
      desafio_json.frase_com_lacuna = grammarBlankSentence.trim();
    } else if (grammarQuizType === "ordenar-palavras") {
      const words = grammarShuffledWords.split(",").map(w => w.trim()).filter(w => w !== "");
      if (words.length < 2) {
        showMsg("error", "Adicione as palavras embaralhadas separadas por vírgula.");
        return;
      }
      desafio_json.frase_embaralhada = words;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/gramaticas/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_licao: parseInt(selectedLessonIdForGrammar),
          regra_titulo: grammarTitle.trim(),
          explicacao: grammarExplanation.trim(),
          desafio_json
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar regra gramatical");
      showMsg("success", `Regra "${grammarTitle}" criada com quiz!`);
      setGrammarTitle("");
      setGrammarExplanation("");
      setGrammarQuestion("");
      setGrammarAnswer("");
      setGrammarBlankSentence("");
      setGrammarShuffledWords("");
      setGrammarOptions(["", "", "", ""]);
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevelIdForQuestion || !questionText.trim()) {
      showMsg("error", "Por favor escreva a pergunta.");
      return;
    }

    const filteredOptions = questionOptions.filter(o => o.trim() !== "");
    if (filteredOptions.length < 2) {
      showMsg("error", "A questão deve ter pelo menos 2 alternativas preenchidas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/questoes/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_nivel: parseInt(selectedLevelIdForQuestion),
          pergunta: questionText.trim(),
          categoria: questionCategory,
          opcoes: filteredOptions,
          resposta_correta_index: correctOptionIdx
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar questão.");
      showMsg("success", "Questão adicionada ao exame com sucesso!");
      setQuestionText("");
      setQuestionOptions(["", "", "", ""]);
      setCorrectOptionIdx(0);
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetUserProgress = (id_usuario: number, nome: string) => {
    setConfirmDialog({
      title: "Resetar Progresso",
      message: `Deseja resetar todo o progresso do aluno ${nome}? Todos os níveis serão bloqueados (exceto intermediários) e as notas das avaliações voltarão a zero.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        try {
          const res = await fetch("/api/admin/usuarios/resetar-progresso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario })
          });
          if (!res.ok) throw new Error("Erro ao resetar progresso.");
          showMsg("success", `Progresso do aluno ${nome} resetado com sucesso!`);
          fetchAllAdminData();
          onRefreshApp();
        } catch (err: any) {
          showMsg("error", err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleUnlockUserAll = async (id_usuario: number, nome: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios/desbloquear-tudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      });
      if (!res.ok) throw new Error("Erro ao desbloquear níveis.");
      showMsg("success", `Todos os níveis desbloqueados para ${nome}!`);
      fetchAllAdminData();
      onRefreshApp();
    } catch (err: any) {
      showMsg("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreSeeds = () => {
    setConfirmDialog({
      title: "Restaurar Banco de Dados",
      message: "ATENÇÃO: Isso irá reverter o banco de dados para os valores originais de semente. Prosseguir?",
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        try {
          const res = await fetch("/api/admin/restaurar-sementes", { method: "POST" });
          if (!res.ok) throw new Error("Erro ao restaurar banco de dados.");
          showMsg("success", "Banco de dados restaurado com sucesso para as sementes padrões!");
          fetchAllAdminData();
          onRefreshApp();
        } catch (err: any) {
          showMsg("error", err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getNivelLabel = (nivelId: number) => {
    const niv = niveis.find(n => n.id_nivel === nivelId);
    if (!niv) return `Nível #${nivelId}`;
    const idi = idiomas.find(i => i.id_idioma === niv.id_idioma);
    const idiNome = idi ? idi.nome_idioma : "Idioma Desconhecido";
    const levelName = niv.nivel_atual === "Intermediario" ? "Intermediário" : niv.nivel_atual === "Medio" ? "Médio" : "Avançado";
    return `${idiNome} - ${levelName}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Confirmation Dialog Overlay */}
      {confirmDialog && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-left space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif font-bold text-base">{confirmDialog.title}</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirmar Ação
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[28px] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-150 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-800 text-white">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 leading-tight">Painel de Controle Administrativo</h2>
              <p className="text-xs text-stone-500">Gerenciador de conteúdo, usuários e integridade da base de dados Teríus on</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-3.5 rounded-xl border border-stone-200 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            type="button"
          >
            Fechar Painel
          </button>
        </div>

        {/* Floating Messages */}
        {message && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}>
            {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Content Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Admin Navigation Sidebar */}
          <nav className="w-64 border-r border-stone-150 p-4 space-y-1 bg-stone-50/50 overflow-y-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === "dashboard" ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Visão Geral & Banco</span>
            </button>
            <button
              onClick={() => setActiveTab("languages")}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === "languages" ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Idiomas & Níveis</span>
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === "lessons" ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lições, Vocab & Gramática</span>
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === "questions" ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Questões de Provas</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === "users" ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Alunos & Progresso</span>
            </button>

            {loading && (
              <div className="pt-8 flex justify-center text-xs text-stone-400 font-medium items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-500" />
                Sincronizando...
              </div>
            )}
          </nav>

          {/* Active View Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-stone-50/10">

            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Métricas Globais da Base</h3>
                  <p className="text-xs text-stone-500">Estatísticas em tempo real armazenadas de forma persistente</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Total Alunos</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_usuarios || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Idiomas Oferecidos</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_idiomas || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Lições Totais</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_licoes || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Termos de Vocabulário</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_vocabularios || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Regras de Gramática</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_gramaticas || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Questões de Prova</span>
                    <div className="text-3xl font-bold font-serif text-stone-950 mt-1">{stats.total_questoes || 0}</div>
                  </div>
                </div>

                {/* Maintenance Section */}
                <div className="bg-stone-50 border border-stone-200 rounded-[24px] p-6 space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Manutenção & Backups</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Use as ferramentas abaixo com extrema cautela. A restauração de sementes limpa dados extras não salvos nas sementes originais do sistema.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={fetchAllAdminData}
                      className="py-2 px-4 rounded-xl border border-stone-300 bg-white text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-stone-600" /> Sincronizar Agora
                    </button>
                    <button
                      onClick={handleRestoreSeeds}
                      className="py-2 px-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-700" /> Restaurar Sementes Originais
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LANGUAGES */}
            {activeTab === "languages" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Gerenciamento de Idiomas</h3>
                  <p className="text-xs text-stone-500">Adicione novos idiomas de estudo no portal</p>
                </div>

                {/* Add language form */}
                <form onSubmit={handleAddIdioma} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-tight block">Nome do Novo Idioma</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Italiano, Mandarim, Japonês..."
                      value={newIdioma}
                      onChange={(e) => setNewIdioma(e.target.value)}
                      className="flex-1 py-2 px-3 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-stone-500 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Adicionar Idioma
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">Ao cadastrar um novo idioma, o sistema criará automaticamente 3 níveis (Intermediário, Médio e Avançado) e suas respectivas provas finais na base de dados.</p>
                </form>

                {/* Languages List */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">Idiomas Ativos</div>
                  <div className="divide-y divide-stone-100">
                    {idiomas.map((idioma) => (
                      <div key={idioma.id_idioma} className="p-4 flex items-center justify-between hover:bg-stone-50/50">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4.5 h-4.5 text-stone-400" />
                          <div>
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">{idioma.nome_idioma}</span>
                            <span className="text-[10px] font-mono text-stone-400 block mt-0.5">ID: {idioma.id_idioma}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {niveis.filter(n => n.id_idioma === idioma.id_idioma).map((niv) => (
                            <span key={niv.id_nivel} className="py-1 px-2.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                              {niv.nivel_atual === "Intermediario" ? "Intermediário" : niv.nivel_atual === "Medio" ? "Médio" : "Avançado"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LESSONS, VOCABULARY & GRAMMAR */}
            {activeTab === "lessons" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Grade Curricular: Lições & Conteúdo</h3>
                  <p className="text-xs text-stone-500">Crie lições manuais, exclua, insira vocabulários e vincule regras de gramática</p>
                </div>

                {/* MANAGE LESSONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create Lesson Form */}
                  <form onSubmit={handleAddLicao} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-tight pb-2 border-b border-stone-100">Adicionar Lição Manual</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Selecione o Nível</label>
                        <select
                          value={selectedLevelIdForLesson}
                          onChange={(e) => setSelectedLevelIdForLesson(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white outline-none"
                          required
                        >
                          {niveis.map(n => (
                            <option key={n.id_nivel} value={n.id_nivel}>{getNivelLabel(n.id_nivel)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Título da Lição</label>
                        <input
                          type="text"
                          placeholder="Ex: Domínio de Termos de Reunião"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" /> Cadastrar Lição
                      </button>
                    </div>
                  </form>

                  {/* List & Delete Lessons */}
                  <div className="bg-white rounded-2xl border border-stone-200 flex flex-col max-h-[350px]">
                    <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">Lições Ativas</div>
                    <div className="overflow-y-auto divide-y divide-stone-100 flex-1">
                      {licoes.length === 0 ? (
                        <div className="p-8 text-center text-xs text-stone-400 italic">Nenhuma lição cadastrada.</div>
                      ) : (
                        licoes.map((licao) => {
                          const associatedVocabs = vocabularios.filter(v => v.id_licao === licao.id_licao).length;
                          const hasGrammar = gramaticas.some(g => g.id_licao === licao.id_licao);
                          return (
                            <div key={licao.id_licao} className="p-3.5 flex items-center justify-between hover:bg-stone-50/50">
                              <div>
                                <div className="text-xs font-bold text-stone-800">{licao.titulo}</div>
                                <div className="text-[9px] font-mono text-stone-500 mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span className="bg-stone-100 py-0.5 px-1.5 rounded">{getNivelLabel(licao.id_nivel)}</span>
                                  <span>Ordem: {licao.ordem_licao}</span>
                                  <span>ID: {licao.id_licao}</span>
                                  <span className="text-emerald-700 font-bold">{associatedVocabs} vocabs</span>
                                  <span className={hasGrammar ? "text-indigo-700 font-bold" : "text-amber-700"}>
                                    {hasGrammar ? "Com Gramática" : "Sem Gramática"}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteLicao(licao.id_licao, licao.titulo)}
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                                title="Excluir Lição"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* VOCABULARY ASSIGNMENT FORM */}
                <form onSubmit={handleAddVocab} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-tight pb-2 border-b border-stone-100">Adicionar Termo de Vocabulário</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Vincular à Lição</label>
                      <select
                        value={selectedLessonIdForVocab}
                        onChange={(e) => setSelectedLessonIdForVocab(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white outline-none"
                        required
                      >
                        {licoes.map(l => (
                          <option key={l.id_licao} value={l.id_licao}>Lição #{l.id_licao}: {l.titulo} ({getNivelLabel(l.id_nivel)})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Termo Original (Idioma)</label>
                      <input
                        type="text"
                        placeholder="Ex: Challenge, Desayunar"
                        value={vocabTerm}
                        onChange={(e) => setVocabTerm(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Tradução (Português)</label>
                      <input
                        type="text"
                        placeholder="Ex: Desafio, Tomar café da manhã"
                        value={vocabTranslation}
                        onChange={(e) => setVocabTranslation(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Frase Prática de Contexto 1 (Obrigatório)</label>
                      <input
                        type="text"
                        placeholder="Exemplo de frase no idioma original usando o termo..."
                        value={vocabEx1}
                        onChange={(e) => setVocabEx1(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Frase de Contexto 2 (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Segundo exemplo opcional..."
                          value={vocabEx2}
                          onChange={(e) => setVocabEx2(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Frase de Contexto 3 (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Terceiro exemplo opcional..."
                          value={vocabEx3}
                          onChange={(e) => setVocabEx3(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">URL do Áudio (MP3/AAC)</label>
                          <button
                            type="button"
                            onClick={handleSearchPronunciation}
                            disabled={searchingPronunciation || !vocabTerm}
                            className="text-[9px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                          >
                            <Search className="w-3 h-3" />
                            {searchingPronunciation ? "Buscando..." : "Buscar Pronúncia (Dicionário)"}
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Cole o link do áudio de fontes autorizadas..."
                          value={vocabAudioUrl}
                          onChange={(e) => setVocabAudioUrl(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        />
                        {searchFeedback && (
                          <span className="text-[9px] text-emerald-600 block mt-1 font-medium">✓ {searchFeedback}</span>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">URL da Imagem Ilustrativa</label>
                        <input
                          type="text"
                          placeholder="Cole a URL da imagem (opcional)..."
                          value={vocabImageUrl}
                          onChange={(e) => setVocabImageUrl(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Salvar Vocabulário
                  </button>
                </form>

                {/* GRAMMAR ASSIGNMENT FORM */}
                <form onSubmit={handleAddGrammar} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-tight pb-2 border-b border-stone-100">Adicionar/Atualizar Regra Gramatical</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Vincular à Lição</label>
                      <select
                        value={selectedLessonIdForGrammar}
                        onChange={(e) => setSelectedLessonIdForGrammar(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white outline-none"
                        required
                      >
                        {licoes.map(l => (
                          <option key={l.id_licao} value={l.id_licao}>Lição #{l.id_licao}: {l.titulo} ({getNivelLabel(l.id_nivel)})</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Título da Regra Gramatical</label>
                      <input
                        type="text"
                        placeholder="Ex: Conjugação de Imperfeito do Subjuntivo"
                        value={grammarTitle}
                        onChange={(e) => setGrammarTitle(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Explicação Teórica</label>
                    <textarea
                      placeholder="Escreva a explicação em português..."
                      value={grammarExplanation}
                      onChange={(e) => setGrammarExplanation(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none h-20 resize-none"
                      required
                    />
                  </div>

                  {/* Challenge configuration */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                        <CheckSquare className="w-4 h-4 text-stone-500" /> Configurar Quiz / Desafio
                      </span>
                      <div className="flex gap-2">
                        {["multipla-escolha", "completar-lacuna", "ordenar-palavras"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setGrammarQuizType(t as any)}
                            className={`py-1 px-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border cursor-pointer ${
                              grammarQuizType === t
                                ? "bg-stone-900 border-transparent text-white"
                                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100"
                            }`}
                          >
                            {t === "multipla-escolha" ? "Múltipla Escolha" : t === "completar-lacuna" ? "Completar Lacuna" : "Ordenar Palavras"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Pergunta do Quiz</label>
                        <input
                          type="text"
                          placeholder="Ex: Como se diz...?"
                          value={grammarQuestion}
                          onChange={(e) => setGrammarQuestion(e.target.value)}
                          className="w-full p-2 border border-stone-300 bg-white rounded-xl text-xs outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Resposta Correta Exata</label>
                        <input
                          type="text"
                          placeholder="Ex: tuviera / will postpone"
                          value={grammarAnswer}
                          onChange={(e) => setGrammarAnswer(e.target.value)}
                          className="w-full p-2 border border-stone-300 bg-white rounded-xl text-xs outline-none"
                          required
                        />
                      </div>
                    </div>

                    {grammarQuizType === "multipla-escolha" && (
                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">Opções Alternativas (Escreva pelo menos duas, incluindo a correta)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {grammarOptions.map((opt, idx) => (
                            <input
                              key={idx}
                              type="text"
                              placeholder={`Opção ${idx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const copy = [...grammarOptions];
                                copy[idx] = e.target.value;
                                setGrammarOptions(copy);
                              }}
                              className="p-2 border border-stone-300 bg-white rounded-xl text-xs outline-none"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {grammarQuizType === "completar-lacuna" && (
                      <div className="pt-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Frase com Lacuna (Use '___')</label>
                        <input
                          type="text"
                          placeholder="Ex: If it rains, we ___ the match."
                          value={grammarBlankSentence}
                          onChange={(e) => setGrammarBlankSentence(e.target.value)}
                          className="w-full p-2 border border-stone-300 bg-white rounded-xl text-xs outline-none"
                        />
                      </div>
                    )}

                    {grammarQuizType === "ordenar-palavras" && (
                      <div className="pt-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Palavras Embaralhadas (Separadas por vírgula)</label>
                        <input
                          type="text"
                          placeholder="Ex: said, she, study, wanted"
                          value={grammarShuffledWords}
                          onChange={(e) => setGrammarShuffledWords(e.target.value)}
                          className="w-full p-2 border border-stone-300 bg-white rounded-xl text-xs outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Salvar Regra de Gramática
                  </button>
                </form>
              </div>
            )}

            {/* TAB: FINAL EXAMS */}
            {activeTab === "questions" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Banco de Questões de Provas Finais</h3>
                  <p className="text-xs text-stone-500">Adicione novas questões objetivas ao teste de certificação dos níveis</p>
                </div>

                {/* Create question form */}
                <form onSubmit={handleAddQuestion} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-tight pb-2 border-b border-stone-100">Adicionar Nova Questão</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Nível Avaliado</label>
                      <select
                        value={selectedLevelIdForQuestion}
                        onChange={(e) => setSelectedLevelIdForQuestion(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white outline-none"
                        required
                      >
                        {niveis.map(n => (
                          <option key={n.id_nivel} value={n.id_nivel}>{getNivelLabel(n.id_nivel)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Categoria de Aprendizado</label>
                      <select
                        value={questionCategory}
                        onChange={(e) => setQuestionCategory(e.target.value as any)}
                        className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white outline-none"
                        required
                      >
                        <option value="Vocabulario">Vocabulário</option>
                        <option value="Gramatica">Gramática</option>
                        <option value="Interpretacao">Interpretação de Texto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">Pergunta / Enunciado</label>
                    <input
                      type="text"
                      placeholder="Ex: Complete com o presente do indicativo: 'Yo ___ español.'"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-xl text-xs outline-none"
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">Alternativas (Obrigatório preencher pelo menos duas)</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {questionOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct_option"
                            checked={correctOptionIdx === idx}
                            onChange={() => setCorrectOptionIdx(idx)}
                            className="w-4 h-4 text-stone-900 border-stone-300 focus:ring-stone-500"
                            title="Marcar como correta"
                          />
                          <input
                            type="text"
                            placeholder={`Opção alternativa ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const copy = [...questionOptions];
                              copy[idx] = e.target.value;
                              setQuestionOptions(copy);
                            }}
                            className="flex-1 p-2 border border-stone-300 rounded-xl text-xs outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 block italic">Marque a bolinha de rádio correspondente à resposta correta antes de salvar.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Salvar Questão no Exame
                  </button>
                </form>

                {/* Questions list */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">Questões Ativas no Banco</div>
                  <div className="divide-y divide-stone-100 divide-y max-h-[350px] overflow-y-auto">
                    {questoes.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 italic">Nenhuma questão de prova cadastrada.</div>
                    ) : (
                      questoes.map((q) => {
                        const levelIdOfExam = niveis.find(n => n.id_nivel === q.id_questao || n.id_nivel === q.id_prova); // approximation to match UI label
                        return (
                          <div key={q.id_questao} className="p-4 hover:bg-stone-50/50">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="py-0.5 px-2 bg-stone-100 text-stone-600 rounded text-[9px] font-bold uppercase tracking-wide inline-block mb-1.5">{q.categoria}</span>
                                <h5 className="text-xs font-bold text-stone-800">{q.pergunta}</h5>
                                
                                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                                  {q.opcoes_resposta.map((o) => (
                                    <div key={o.id} className={`p-1.5 rounded-lg border text-[10px] font-medium ${
                                      o.id === q.resposta_correta_id ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" : "bg-stone-50 border-stone-200 text-stone-500"
                                    }`}>
                                      {o.id}) {o.texto} {o.id === q.resposta_correta_id && "✓"}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USERS */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Controle de Alunos & Progresso</h3>
                  <p className="text-xs text-stone-500">Veja quem está cadastrado e administre as travas de níveis dos estudantes</p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">Estudantes Cadastrados</div>
                  <div className="divide-y divide-stone-100">
                    {usuarios.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 italic">Nenhum estudante no banco.</div>
                    ) : (
                      usuarios.map((user) => {
                        return (
                          <div key={user.id_usuario} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center">
                                <img
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'Felix')}`}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-stone-800">{user.nome}</h5>
                                <span className="text-[10px] text-stone-400 block">{user.email}</span>
                                <span className="text-[9px] font-mono text-stone-400 block mt-0.5">Criado em: {new Date(user.data_criacao).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleUnlockUserAll(user.id_usuario, user.nome)}
                                className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                type="button"
                              >
                                Desbloquear Níveis
                              </button>
                              <button
                                onClick={() => handleResetUserProgress(user.id_usuario, user.nome)}
                                className="py-1.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                type="button"
                              >
                                Resetar Progresso
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
