import React, { useState, useEffect } from "react";
import { 
  Search, 
  Globe, 
  Sparkles, 
  Volume2, 
  Heart, 
  BookOpen, 
  AlertCircle, 
  Trash2, 
  ArrowRight,
  HelpCircle,
  FolderHeart,
  ExternalLink,
  HelpCircle as QuestionIcon,
  RefreshCw,
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Idioma } from "../../types";
import { isPortalOnline, getFromOfflineCache, saveToOfflineCache } from "../../offlineStorage";
import { ttsService } from "../../services/ttsService";

interface DictionaryEntry {
  id_vocabulario: number;
  termo_original: string;
  traducao: string;
  pronuncia: string;
  exemplo_contexto_1: string;
  exemplo_contexto_1_traducao?: string;
  exemplo_contexto_2: string;
  exemplo_contexto_2_traducao?: string;
  exemplo_contexto_3: string;
  exemplo_contexto_3_traducao?: string;
  url_audio: string;
  idioma_nome: string;
  nivel_nome: string;
  categoria?: string;
  explicacao_cultural?: string;
}

interface DictionarySectionProps {
  idiomas: Idioma[];
  ttsSpeed: number;
  ttsVoiceURI: string;
}

export default function DictionarySection({ idiomas, ttsSpeed, ttsVoiceURI }: DictionarySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Todos");
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isOfflineSearch, setIsOfflineSearch] = useState(false);
  
  // High-speed in-memory repository of all vocabulary entries
  const allVocabsRef = React.useRef<DictionaryEntry[]>([]);
  const debounceTimerRef = React.useRef<any>(null);

  // Favorites storage
  const [favorites, setFavorites] = useState<DictionaryEntry[]>([]);

  // Explorer items (featured words)
  const [explorerWords, setExplorerWords] = useState<DictionaryEntry[]>([]);
  const [loadingExplorer, setLoadingExplorer] = useState(false);

  // Load favorites & browse data on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem("lingoprogress_dict_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (err) {
        console.error("Failed to load dictionary favorites", err);
      }
    }
    loadExplorerWords();
  }, []);

  const loadExplorerWords = async () => {
    setLoadingExplorer(true);
    
    // Check local storage or offline cache first for instant UI response
    const cached = getFromOfflineCache<DictionaryEntry[]>("dicionario_completo");
    if (cached && cached.length > 0) {
      allVocabsRef.current = cached;
      const shuffled = [...cached].sort(() => 0.5 - Math.random());
      setExplorerWords(shuffled.slice(0, 6));
    }

    try {
      const response = await fetch("/api/dicionario/busca?q=&idioma=Todos");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results) {
          allVocabsRef.current = data.results;
          saveToOfflineCache("dicionario_completo", data.results);
          const shuffled = [...data.results].sort(() => 0.5 - Math.random());
          setExplorerWords(shuffled.slice(0, 6));
        }
      }
    } catch (e) {
      console.warn("Failed to load explorer words over network. Falling back to offline cache...", e);
      if (cached && cached.length > 0) {
        allVocabsRef.current = cached;
        const shuffled = [...cached].sort(() => 0.5 - Math.random());
        setExplorerWords(shuffled.slice(0, 6));
      }
    } finally {
      setLoadingExplorer(false);
    }
  };

  // Instant local search filter (<1ms)
  const performInstantFilter = (term: string, lang: string) => {
    const clean = term.trim().toLowerCase();
    if (!clean && lang === "Todos") {
      setResults([]);
      setSearched(false);
      return;
    }

    let dataset = allVocabsRef.current;
    if (dataset.length === 0) {
      dataset = getFromOfflineCache<DictionaryEntry[]>("dicionario_completo") || [];
      allVocabsRef.current = dataset;
    }

    let filtered = dataset;
    if (lang !== "Todos") {
      filtered = filtered.filter(v => v.idioma_nome.toLowerCase() === lang.toLowerCase());
    }

    if (clean) {
      filtered = filtered.filter(v =>
        v.termo_original.toLowerCase().includes(clean) ||
        v.traducao.toLowerCase().includes(clean) ||
        (v.pronuncia && v.pronuncia.toLowerCase().includes(clean)) ||
        (v.explicacao_cultural && v.explicacao_cultural.toLowerCase().includes(clean)) ||
        (v.exemplo_contexto_1 && v.exemplo_contexto_1.toLowerCase().includes(clean))
      );
    }

    setResults(filtered);
    setSearched(true);
  };

  // Live search handler on keystroke
  const handleTermChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    performInstantFilter(newTerm, selectedLanguage);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (newTerm.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(undefined, newTerm, useAI, true);
      }, 350);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    performInstantFilter(searchTerm, newLang);
    if (searchTerm.trim().length > 0) {
      handleSearch(undefined, searchTerm, useAI, false, newLang);
    }
  };

  const handleSearch = async (e?: React.FormEvent, forceTerm?: string, forceAI?: boolean, isBackgroundSync = false, forceLang?: string) => {
    if (e) e.preventDefault();
    const query = (forceTerm !== undefined ? forceTerm : searchTerm).trim();
    const activeAI = forceAI !== undefined ? forceAI : useAI;
    const activeLanguage = forceLang !== undefined ? forceLang : (forceTerm !== undefined && forceAI ? "Todos" : selectedLanguage);
    
    if (!isBackgroundSync) {
      setLoading(true);
      setErrorMsg("");
      setSearched(true);
      setIsOfflineSearch(false);
    }

    // Instant local results first
    performInstantFilter(query, activeLanguage);

    // If offline or AI search disabled by offline, filter locally
    if (!isPortalOnline()) {
      filterOfflineDictionary(query, activeLanguage, activeAI);
      setLoading(false);
      return;
    }

    try {
      const url = `/api/dicionario/busca?q=${encodeURIComponent(query)}&idioma=${encodeURIComponent(activeLanguage)}&usar_ia=${activeAI}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Houve uma falha ao buscar no dicionário.");
      }

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      }
    } catch (err: any) {
      console.warn("Falha na busca online do dicionário. Filtrando base offline...", err);
      filterOfflineDictionary(query, activeLanguage, activeAI);
    } finally {
      setLoading(false);
    }
  };

  const filterOfflineDictionary = (query: string, language: string, aiRequested: boolean) => {
    setIsOfflineSearch(true);
    const cached = getFromOfflineCache<DictionaryEntry[]>("dicionario_completo") || [];
    
    let filtered = cached;
    if (language !== "Todos") {
      filtered = filtered.filter(item => item.idioma_nome.toLowerCase() === language.toLowerCase());
    }

    if (query) {
      const lowerQ = query.toLowerCase();
      filtered = filtered.filter(item =>
        item.termo_original.toLowerCase().includes(lowerQ) ||
        item.traducao.toLowerCase().includes(lowerQ) ||
        (item.pronuncia && item.pronuncia.toLowerCase().includes(lowerQ)) ||
        (item.categoria && item.categoria.toLowerCase().includes(lowerQ))
      );
    }

    if (aiRequested) {
      setErrorMsg("O Copiloto com IA requer internet. Exibindo termos correspondentes da base offline.");
    }

    setResults(filtered);
  };

  const toggleFavorite = (entry: DictionaryEntry) => {
    let updated;
    const isFav = favorites.some(
      f => f.termo_original.toLowerCase() === entry.termo_original.toLowerCase() && f.idioma_nome === entry.idioma_nome
    );
    
    if (isFav) {
      updated = favorites.filter(
        f => !(f.termo_original.toLowerCase() === entry.termo_original.toLowerCase() && f.idioma_nome === entry.idioma_nome)
      );
    } else {
      updated = [...favorites, entry];
    }
    
    setFavorites(updated);
    localStorage.setItem("lingoprogress_dict_favorites", JSON.stringify(updated));
  };

  const isFavorited = (entry: DictionaryEntry) => {
    return favorites.some(
      f => f.termo_original.toLowerCase() === entry.termo_original.toLowerCase() && f.idioma_nome === entry.idioma_nome
    );
  };

  // Speaks pronunciation using audio file or fallback speech synthesis
  const handlePlayAudio = (entry: DictionaryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    if (entry.url_audio) {
      const audio = new Audio(entry.url_audio);
      audio.play().catch(() => {
        speakFallback(entry);
      });
    } else {
      speakFallback(entry);
    }
  };

  const speakFallback = (entry: DictionaryEntry) => {
    ttsService.speak(entry.termo_original, {
      lang: ttsService.getLanguageCode(entry.idioma_nome),
      rate: ttsSpeed,
      voiceURI: ttsVoiceURI
    });
  };

  const handleSelectFavorite = (entry: DictionaryEntry) => {
    setSearchTerm(entry.termo_original);
    setSelectedLanguage(entry.idioma_nome);
    setResults([entry]);
    setSearched(true);
  };

  const handleClearHistory = () => {
    setFavorites([]);
    localStorage.removeItem("lingoprogress_dict_favorites");
  };

  return (
    <div className="space-y-6" id="multilingual-dictionary-wrapper">
      
      {/* Top Welcome Card */}
      <div className="bg-natural-card rounded-[32px] p-6 md:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-natural-primary/10 text-natural-primary rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-natural-primary">
                  Dicionário Multilíngue
                </h2>
                <p className="text-xs text-stone-500 font-sans tracking-wide mt-0.5">
                  Explorador Morfológico e Fonético dos Idiomas
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              Consulte vocábulos e expressões em qualquer um de nossos idiomas suportados. Se a expressão não constar em nossa base local, o <strong className="text-natural-primary">Gemini AI</strong> formulará uma definição lexicográfica rica com áudio, pronúncia fonética e exemplos práticos instantaneamente!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F3F3EA] py-2 px-4 rounded-2xl border border-stone-200 shrink-0">
            <Globe className="w-4 h-4 text-natural-primary animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-[11px] font-sans font-bold uppercase text-stone-700 tracking-wider">
              {idiomas.length} Idiomas Suportados
            </span>
          </div>
        </div>

        {/* Search Bar & Filters Form */}
        <form onSubmit={(e) => handleSearch(e)} className="mt-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Input field with instant live-search and clear button */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Digite para buscar instantaneamente (ex: Kiambote, Mbote, Serendipity, Gracias...)"
                value={searchTerm}
                onChange={(e) => handleTermChange(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-stone-300 rounded-2xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-natural-primary/50 text-sm transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    performInstantFilter("", selectedLanguage);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-full text-xs font-bold"
                  title="Limpar pesquisa"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Language filter dropdown */}
            <div className="md:w-60">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full py-3.5 px-4 bg-white border border-stone-300 rounded-2xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-natural-primary/50 text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <option value="Todos">🌐 Todos os Idiomas</option>
                {idiomas.map((idioma) => (
                  <option key={idioma.id_idioma} value={idioma.nome_idioma}>
                    {idioma.nome_idioma}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 rounded-2xl bg-natural-primary hover:bg-natural-primary/95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Buscar</span>
            </button>
          </div>

          {/* Quick Instant Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-400 mr-1">
              Consultas Rápidas:
            </span>
            {[
              { term: "Kiambote", lang: "Kimbundu" },
              { term: "Mbote", lang: "Lingala" },
              { term: "Kalunga", lang: "Umbundu" },
              { term: "Dikamba", lang: "Kimbundu" },
              { term: "Matondi", lang: "Lingala" },
              { term: "Serendipity", lang: "Inglês" },
              { term: "Effervescence", lang: "Francês" },
              { term: "Weltschmerz", lang: "Alemão" },
              { term: "Sobremesa", lang: "Espanhol" },
              { term: "Carpe Diem", lang: "Latim" }
            ].map((chip) => (
              <button
                key={chip.term}
                type="button"
                onClick={() => {
                  setSearchTerm(chip.term);
                  setSelectedLanguage(chip.lang);
                  handleSearch(undefined, chip.term, false, false, chip.lang);
                }}
                className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-natural-primary hover:text-white text-stone-600 text-[11px] font-medium transition-all cursor-pointer"
              >
                {chip.term} <span className="text-[10px] opacity-70">({chip.lang})</span>
              </button>
            ))}
          </div>

          {/* AI Toggle option */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-natural-accent" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-natural-accent" />
                  Busca Lexicográfica Expandida
                </span>
                <span className="block text-[10px] text-stone-500 font-sans">
                  Garante definições detalhadas, contexto cultural e exemplos traduzidos em tempo real.
                </span>
              </div>
            </label>

            {searchTerm.trim() && !useAI && (
              <span className="text-[10px] bg-[#EAEAE0] text-stone-600 py-1 px-2.5 rounded-full font-serif italic">
                Pesquisando primeiramente no acervo escolar
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Main Grid: Search Results / Explorer / Favorites Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: Results viewport */}
        <div className="lg:col-span-8 space-y-6">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-dict"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-[32px] p-12 text-center border border-stone-200 space-y-4"
              >
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-natural-accent/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-natural-accent border-t-transparent animate-spin" />
                  <Globe className="w-6 h-6 text-natural-accent absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-700">Consultando lexicologia...</h4>
                  <p className="text-xs text-stone-500 italic mt-1 max-w-sm mx-auto">
                    {useAI 
                      ? "O Gemini está analisando estruturas fonéticas e compilando frases contextualizadas para você..."
                      : "Vasculhando as lições e vocabulários registrados na escola de idiomas..."}
                  </p>
                </div>
              </motion.div>
            ) : errorMsg ? (
              <motion.div
                key="error-dict"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 text-red-800 p-6 rounded-3xl border border-red-200 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Falha na Pesquisa</h4>
                  <p className="text-xs text-red-700 mt-1">{errorMsg}</p>
                </div>
              </motion.div>
            ) : searched && results.length === 0 ? (
              <motion.div
                key="empty-dict"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 md:p-12 text-center border border-stone-200 space-y-6"
              >
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <QuestionIcon className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-serif font-bold text-stone-800">
                    Termo não localizado localmente
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Não encontramos &ldquo;{searchTerm}&rdquo; na base local de lições. Deseja realizar uma busca léxica expandida com ficha completa?
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUseAI(true);
                    setTimeout(() => handleSearch(undefined, searchTerm), 100);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-natural-accent hover:bg-natural-accent/90 text-white text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-all"
                  type="button"
                >
                  <Search className="w-4 h-4" />
                  Consultar Acervo Expandido
                </button>
              </motion.div>
            ) : searched ? (
              <motion.div
                key="results-dict"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <span>Resultado Encontrado ({results.length})</span>
                    {isOfflineSearch && (
                      <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full inline-flex items-center gap-1">
                        <WifiOff className="w-2.5 h-2.5" /> Modo Offline
                      </span>
                    )}
                  </h3>
                  {results[0]?.id_vocabulario === -1 && (
                    <span className="text-stone-600 text-xs font-medium flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-natural-primary" />
                      Verbete Lexicográfico Completo
                    </span>
                  )}
                </div>

                {results.map((entry, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-[32px] border border-stone-200 p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden"
                  >
                    {/* Visual language tag accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-natural-primary" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: original term, pronunciation, language tag */}
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] bg-natural-primary/10 text-natural-primary py-1 px-2.5 rounded-full font-bold uppercase tracking-wider">
                            {entry.idioma_nome}
                          </span>
                          {entry.categoria && (
                            <span className="text-[10px] bg-stone-100 text-stone-600 py-1 px-2.5 rounded-full font-serif italic">
                              {entry.categoria}
                            </span>
                          )}
                          {entry.nivel_nome && entry.nivel_nome !== "AI" && (
                            <span className="text-[10px] bg-stone-50 border border-stone-200 text-[#5A5A40] py-0.5 px-2 rounded-md font-bold uppercase">
                              {entry.nivel_nome}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h2 className="text-3xl font-serif font-bold text-natural-primary tracking-tight">
                            {entry.termo_original}
                          </h2>
                          {entry.pronuncia && (
                            <p className="text-xs text-[#8C8C70] font-mono">
                              Pronúncia aproximada: <span className="font-semibold italic text-stone-600 font-sans">[{entry.pronuncia}]</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Audio and Favorite buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handlePlayAudio(entry, e)}
                          className="p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-natural-primary hover:text-white text-stone-600 hover:border-transparent transition-all cursor-pointer shadow-2xs"
                          title="Ouvir Pronúncia"
                          type="button"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => toggleFavorite(entry)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                            isFavorited(entry)
                              ? "bg-red-50 border-red-200 text-red-500 hover:bg-white hover:text-stone-400"
                              : "bg-stone-50 border-stone-200 text-stone-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                          }`}
                          title={isFavorited(entry) ? "Remover dos Favoritos" : "Marcar como Favorito"}
                          type="button"
                        >
                          <Heart className={`w-5 h-5 ${isFavorited(entry) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Translation Section */}
                    <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-stone-200/60">
                      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                        Tradução em Português
                      </h4>
                      <p className="text-lg font-serif font-medium text-stone-800 leading-snug">
                        {entry.traducao}
                      </p>
                    </div>

                    {/* Context Examples */}
                    <div className="space-y-3.5">
                      <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span>Exemplos Práticos de Contexto</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {entry.exemplo_contexto_1 && (
                          <div className="p-4 bg-white border border-stone-150 rounded-2xl shadow-2xs hover:border-stone-250 transition-all">
                            <p className="text-sm font-semibold text-stone-800 mb-1 leading-snug italic">
                              &ldquo;{entry.exemplo_contexto_1}&rdquo;
                            </p>
                            {entry.exemplo_contexto_1_traducao ? (
                              <p className="text-xs text-stone-500 font-serif">
                                {entry.exemplo_contexto_1_traducao}
                              </p>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">
                                Contexto de uso da lição
                              </p>
                            )}
                          </div>
                        )}

                        {entry.exemplo_contexto_2 && (
                          <div className="p-4 bg-white border border-stone-150 rounded-2xl shadow-2xs hover:border-stone-250 transition-all">
                            <p className="text-sm font-semibold text-stone-800 mb-1 leading-snug italic">
                              &ldquo;{entry.exemplo_contexto_2}&rdquo;
                            </p>
                            {entry.exemplo_contexto_2_traducao ? (
                              <p className="text-xs text-stone-500 font-serif">
                                {entry.exemplo_contexto_2_traducao}
                              </p>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">
                                Contexto de uso da lição
                              </p>
                            )}
                          </div>
                        )}

                        {entry.exemplo_contexto_3 && (
                          <div className="p-4 bg-white border border-stone-150 rounded-2xl shadow-2xs hover:border-stone-250 transition-all">
                            <p className="text-sm font-semibold text-stone-800 mb-1 leading-snug italic">
                              &ldquo;{entry.exemplo_contexto_3}&rdquo;
                            </p>
                            {entry.exemplo_contexto_3_traducao ? (
                              <p className="text-xs text-stone-500 font-serif">
                                {entry.exemplo_contexto_3_traducao}
                              </p>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">
                                Contexto de uso da lição
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {entry.id_vocabulario !== -1 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left space-y-1">
                          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-natural-accent" />
                            Verbete Resumido
                          </span>
                          <span className="block text-[11px] text-stone-500 leading-relaxed">
                            Definição básica registrada no currículo. Deseja expandir este termo para obter notas morfológicas, transcrição fonética e exemplos bilíngues adicionais?
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setUseAI(true);
                            handleSearch(undefined, entry.termo_original, true);
                          }}
                          className="py-2 px-4 bg-natural-accent hover:bg-natural-accent/90 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                          type="button"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Expandir Verbete</span>
                        </button>
                      </div>
                    )}

                    {/* Cultural Explanations (Gemini Generated) */}
                    {entry.explicacao_cultural && (
                      <div className="pt-4 border-t border-stone-150">
                        <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <QuestionIcon className="w-3.5 h-3.5 text-[#5A5A40]" />
                          <span>Nota Lexicográfica & Dica de Uso</span>
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed font-serif italic bg-[#FAF9F5] p-4 rounded-xl border border-dashed border-stone-200">
                          {entry.explicacao_cultural}
                        </p>
                      </div>
                    )}

                  </div>
                ))}
              </motion.div>
            ) : (
              /* DEFAULT VIEW: Browse Explorer words and instructions */
              <motion.div
                key="explorer-dict"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Sugestões de Vocabulário Geral
                    </h3>
                    <p className="text-xs text-stone-400 italic">
                      Clique em qualquer termo para ver sua análise linguística aprofundada:
                    </p>
                  </div>
                  <button
                    onClick={loadExplorerWords}
                    disabled={loadingExplorer}
                    className="py-1.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none shrink-0"
                    type="button"
                    title="Carregar outras sugestões aleatórias"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingExplorer ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                  </button>
                </div>

                {loadingExplorer ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-white p-5 rounded-2xl border border-stone-200 h-24 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {explorerWords.map((word, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchTerm(word.termo_original);
                          setSelectedLanguage(word.idioma_nome);
                          setResults([word]);
                          setSearched(true);
                        }}
                        className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-natural-primary hover:shadow-xs transition-all cursor-pointer group flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] bg-stone-100 text-stone-600 py-0.5 px-2 rounded-md font-bold uppercase">
                            {word.idioma_nome}
                          </span>
                          <h4 className="font-serif font-bold text-natural-primary group-hover:text-natural-accent transition-colors text-base">
                            {word.termo_original}
                          </h4>
                          <p className="text-xs text-stone-500 truncate max-w-[200px]">
                            {word.traducao}
                          </p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-stone-50 group-hover:bg-natural-primary/10 group-hover:text-natural-primary text-stone-400 transition-all self-center shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-[#FAF9F5] p-5 rounded-[24px] border border-stone-200 text-center">
                  <p className="text-xs text-stone-500 leading-relaxed font-serif">
                    💡 <strong>Dica de Estudos</strong>: Digite frases inteiras ou expressões coloquiais. Nossa busca avançada com o Gemini AI é capaz de analisar gírias de rua, provérbios tradicionais e termos profissionais técnicos complexos.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COMPONENT: Favorites Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-6 shadow-xs border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-150 pb-4 mb-4">
              <h3 className="font-serif italic text-lg text-natural-primary flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-red-500 shrink-0" />
                Meu Caderno de Termos ({favorites.length})
              </h3>
              
              {favorites.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Limpar favoritos"
                  type="button"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs italic space-y-2">
                <Heart className="w-8 h-8 mx-auto text-stone-200" />
                <p>Nenhuma expressão favoritada ainda.</p>
                <p className="text-[10px] text-stone-400 max-w-[180px] mx-auto">
                  Marque o ícone de coração nos resultados da pesquisa para salvar seus termos aqui!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {favorites.map((entry, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectFavorite(entry)}
                    className="p-3 bg-[#FAF9F5] hover:bg-[#F3F3EA] rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-natural-primary/10 text-natural-primary py-0.5 px-1.5 rounded-sm font-bold uppercase tracking-wider">
                          {entry.idioma_nome}
                        </span>
                        {entry.categoria && (
                          <span className="text-[8px] text-stone-400 font-serif italic truncate">
                            {entry.categoria}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-stone-800 text-sm truncate group-hover:text-natural-primary transition-colors">
                        {entry.termo_original}
                      </h4>
                      <p className="text-[10px] text-stone-500 truncate">
                        {entry.traducao}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(entry);
                      }}
                      className="p-1 text-stone-300 hover:text-red-500 rounded-md transition-colors"
                      title="Desfavoritar"
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
