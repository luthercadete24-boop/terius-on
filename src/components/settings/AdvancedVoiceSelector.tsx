import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Search,
  RefreshCw,
  Gauge,
  Sparkles,
  Music,
  Check,
  CheckCircle2,
  Globe,
  Sliders,
  Radio,
  Zap,
  RotateCcw,
  AlertCircle
} from "lucide-react";

interface AdvancedVoiceSelectorProps {
  ttsVoiceURI: string;
  setTtsVoiceURI: (voiceURI: string) => void;
  ttsSpeed: number;
  setTtsSpeed: (speed: number) => void;
  ttsAutoplay: boolean;
  setTtsAutoplay: (autoplay: boolean) => void;
  idiomaNome: string;
}

// Language helpers and default phrases for realistic testing
const LANGUAGE_MAP: Record<string, { code: string; flag: string; sample: string }> = {
  "Inglês": { code: "en", flag: "🇺🇸", sample: "Hello! Practice makes perfect in your language journey." },
  "Espanhol": { code: "es", flag: "🇪🇸", sample: "¡Hola! La constancia diaria es el secreto de la fluidez." },
  "Francês": { code: "fr", flag: "🇫🇷", sample: "Bonjour! Bienvenue dans votre séance d'apprentissage." },
  "Italiano": { code: "it", flag: "🇮🇹", sample: "Ciao! La pratica costante porta al vero successo." },
  "Alemão": { code: "de", flag: "🇩🇪", sample: "Hallo! Übung macht den Meister beim Sprachenlernen." },
  "Japonês": { code: "ja", flag: "🇯🇵", sample: "こんにちは！毎日の積み重ねが上達の鍵です。" },
  "Chinês": { code: "zh", flag: "🇨🇳", sample: "你好！持之以恒是掌握一门语言的秘诀。" },
  "Russo": { code: "ru", flag: "🇷🇺", sample: "Привет! Постоянная практика ведет к уверенному успеху." },
  "Português": { code: "pt", flag: "🇧🇷", sample: "Olá! A prática constante é o segredo da sua fluência." },
};

function getLanguageCode(nome: string): string {
  if (!nome) return "en";
  for (const [key, val] of Object.entries(LANGUAGE_MAP)) {
    if (nome.toLowerCase().includes(key.toLowerCase())) return val.code;
  }
  return "en";
}

function getLangBadge(lang: string): { flag: string; label: string } {
  const clean = (lang || "").replace("_", "-").toLowerCase();
  if (clean.startsWith("pt-br")) return { flag: "🇧🇷", label: "Português (Brasil)" };
  if (clean.startsWith("pt")) return { flag: "🇵🇹", label: "Português" };
  if (clean.startsWith("en-us")) return { flag: "🇺🇸", label: "Inglês (EUA)" };
  if (clean.startsWith("en-gb")) return { flag: "🇬🇧", label: "Inglês (UK)" };
  if (clean.startsWith("en-au")) return { flag: "🇦🇺", label: "Inglês (Austrália)" };
  if (clean.startsWith("en-ca")) return { flag: "🇨🇦", label: "Inglês (Canadá)" };
  if (clean.startsWith("en")) return { flag: "🌐", label: "Inglês" };
  if (clean.startsWith("es-es")) return { flag: "🇪🇸", label: "Espanhol (Espanha)" };
  if (clean.startsWith("es-mx")) return { flag: "🇲🇽", label: "Espanhol (México)" };
  if (clean.startsWith("es")) return { flag: "🇪🇸", label: "Espanhol" };
  if (clean.startsWith("fr-ca")) return { flag: "🇨🇦", label: "Francês (Canadá)" };
  if (clean.startsWith("fr")) return { flag: "🇫🇷", label: "Francês" };
  if (clean.startsWith("de")) return { flag: "🇩🇪", label: "Alemão" };
  if (clean.startsWith("it")) return { flag: "🇮🇹", label: "Italiano" };
  if (clean.startsWith("ja")) return { flag: "🇯🇵", label: "Japonês" };
  if (clean.startsWith("zh")) return { flag: "🇨🇳", label: "Chinês" };
  if (clean.startsWith("ru")) return { flag: "🇷🇺", label: "Russo" };
  if (clean.startsWith("ko")) return { flag: "🇰🇷", label: "Coreano" };
  return { flag: "🌐", label: lang };
}

export function AdvancedVoiceSelector({
  ttsVoiceURI,
  setTtsVoiceURI,
  ttsSpeed,
  setTtsSpeed,
  ttsAutoplay,
  setTtsAutoplay,
  idiomaNome
}: AdvancedVoiceSelectorProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingURI, setCurrentlyPlayingURI] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"recommended" | "all">("recommended");
  const [typeFilter, setTypeFilter] = useState<"all" | "local" | "remote">("all");
  const [pitch, setPitch] = useState(() => {
    const saved = localStorage.getItem("lingoprogress_tts_pitch");
    return saved ? parseFloat(saved) : 1.0;
  });
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom or default test phrase
  const langConfig = LANGUAGE_MAP[idiomaNome] || {
    code: getLanguageCode(idiomaNome),
    flag: "🌐",
    sample: "Olá! Testando a pronúncia desta voz nativa no portal."
  };
  const [samplePhrase, setSamplePhrase] = useState(langConfig.sample);

  // Update sample phrase when language changes if untouched
  useEffect(() => {
    if (langConfig?.sample) {
      setSamplePhrase(langConfig.sample);
    }
  }, [idiomaNome]);

  // Save pitch preference
  useEffect(() => {
    localStorage.setItem("lingoprogress_tts_pitch", pitch.toString());
  }, [pitch]);

  // Load voices with browser compatibility fallbacks
  const loadVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioError("A síntese de voz (Web Speech API) não é suportada neste navegador.");
      return;
    }

    try {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
        setAudioError(null);
      }
    } catch (e) {
      console.error("Erro ao carregar vozes:", e);
    }
  };

  useEffect(() => {
    loadVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const handler = () => loadVoices();
      window.speechSynthesis.addEventListener?.("voiceschanged", handler);
      window.speechSynthesis.onvoiceschanged = handler;

      // Timeout fallbacks (Chromium voices are often populated asynchronously)
      const t1 = setTimeout(loadVoices, 200);
      const t2 = setTimeout(loadVoices, 800);

      return () => {
        window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
        clearTimeout(t1);
        clearTimeout(t2);
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const handleRefreshVoices = () => {
    setIsRefreshing(true);
    loadVoices();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const targetLangCode = getLanguageCode(idiomaNome);

  // Filter voices based on selected criteria
  const filteredVoices = useMemo(() => {
    return voices.filter(voice => {
      const voiceLang = (voice.lang || "").toLowerCase().replace("_", "-");
      const voiceName = (voice.name || "").toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        voiceName.includes(searchQuery.toLowerCase()) ||
        voiceLang.includes(searchQuery.toLowerCase()) ||
        (voice.voiceURI || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by recommended language
      if (filterMode === "recommended") {
        const matchesLang =
          voiceLang.startsWith(targetLangCode.toLowerCase()) ||
          voiceLang.includes(`-${targetLangCode.toLowerCase()}`);
        if (!matchesLang) return false;
      }

      // Filter by type (Local vs Remote)
      if (typeFilter === "local" && !voice.localService) return false;
      if (typeFilter === "remote" && voice.localService) return false;

      return true;
    });
  }, [voices, filterMode, targetLangCode, searchQuery, typeFilter]);

  const recommendedCount = useMemo(() => {
    return voices.filter(voice => {
      const voiceLang = (voice.lang || "").toLowerCase().replace("_", "-");
      return (
        voiceLang.startsWith(targetLangCode.toLowerCase()) ||
        voiceLang.includes(`-${targetLangCode.toLowerCase()}`)
      );
    }).length;
  }, [voices, targetLangCode]);

  // Find currently selected voice object
  const selectedVoice = useMemo(() => {
    if (!ttsVoiceURI) return null;
    return voices.find(v => v.voiceURI === ttsVoiceURI) || null;
  }, [voices, ttsVoiceURI]);

  // Preview Speech synthesis execution
  const playPreview = (voiceToTest?: SpeechSynthesisVoice | null, customText?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioError("A síntese de voz não está disponível no navegador.");
      return;
    }

    const testURI = voiceToTest ? voiceToTest.voiceURI : ttsVoiceURI;

    // If currently playing this specific voice, stop it
    if (isPlaying && currentlyPlayingURI === testURI) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentlyPlayingURI(null);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any existing speech

      const text = customText || samplePhrase || langConfig.sample;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = ttsSpeed;
      utterance.pitch = pitch;

      if (voiceToTest) {
        utterance.voice = voiceToTest;
        utterance.lang = voiceToTest.lang;
      } else if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        // Fallback to system default for target language
        utterance.lang = targetLangCode === "en" ? "en-US" : targetLangCode;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentlyPlayingURI(testURI || "default");
        setAudioError(null);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentlyPlayingURI(null);
      };

      utterance.onerror = (e) => {
        // If error is canceled by user, don't show error banner
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("TTS Error:", e);
          setAudioError(`Falha ao sintetizar voz: ${e.error || "Erro desconhecido"}`);
        }
        setIsPlaying(false);
        setCurrentlyPlayingURI(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e: any) {
      console.error(e);
      setAudioError("Erro ao iniciar síntese de fala.");
      setIsPlaying(false);
      setCurrentlyPlayingURI(null);
    }
  };

  const stopPreview = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentlyPlayingURI(null);
    }
  };

  return (
    <div className="space-y-4" id="advanced-voice-selector">
      {/* Header bar with total detection stats & refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-stone-150">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-natural-primary/10 text-natural-primary">
            <Volume2 className="w-4 h-4" />
          </span>
          <div>
            <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              Seletor Avançado de Vozes Nativas
            </h5>
            <p className="text-[10px] text-stone-500">
              Detectadas via <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-natural-accent">speechSynthesis.getVoices()</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-bold">
            {voices.length} {voices.length === 1 ? "voz detectada" : "vozes detectadas"}
          </span>
          <button
            type="button"
            onClick={handleRefreshVoices}
            disabled={isRefreshing}
            title="Recarregar vozes do sistema operacional"
            className="p-1.5 text-stone-500 hover:text-natural-primary rounded-lg hover:bg-stone-150 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-natural-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Audio Error Alert */}
      {audioError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{audioError}</p>
            <p className="text-[10px] text-amber-700 mt-0.5">
              Certifique-se de que o navegador possui permissão de áudio e que o volume do sistema esteja ativo.
            </p>
          </div>
        </div>
      )}

      {/* CURRENT ACTIVE VOICE CARD WITH REAL-TIME PREVIEW CONTROLLER */}
      <div className="bg-white border-2 border-natural-primary/25 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl transition-all ${
              isPlaying
                ? "bg-natural-accent text-white shadow-md animate-pulse"
                : "bg-natural-primary/10 text-natural-primary"
            }`}>
              {isPlaying ? <Music className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-natural-accent">
                  Voz Ativa no Portal
                </span>
                {selectedVoice?.localService && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold">
                    Offline Local
                  </span>
                )}
                {selectedVoice && !selectedVoice.localService && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 text-blue-800 border border-blue-300 rounded font-semibold">
                    Rede / Alta Qualidade
                  </span>
                )}
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
                {selectedVoice ? selectedVoice.name : "Voz Padrão do Sistema (Automática)"}
              </h4>
              <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span>{selectedVoice ? getLangBadge(selectedVoice.lang).flag : langConfig.flag}</span>
                <span>{selectedVoice ? getLangBadge(selectedVoice.lang).label : `${idiomaNome} (Padrão)`}</span>
                {selectedVoice && (
                  <span className="font-mono text-[10px] text-stone-400">({selectedVoice.lang})</span>
                )}
              </p>
            </div>
          </div>

          {/* Master Sound Preview Button */}
          <button
            type="button"
            onClick={() => isPlaying ? stopPreview() : playPreview(selectedVoice)}
            className={`py-2 px-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 ${
              isPlaying
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-natural-primary hover:bg-[#43432e] text-white"
            }`}
            id="tts-preview-main-btn"
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Parar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ouvir Som</span>
              </>
            )}
          </button>
        </div>

        {/* Audio Equalizer wave animation when playing */}
        {isPlaying && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-natural-primary/5 rounded-xl border border-natural-primary/15 text-[11px] text-natural-primary font-medium">
            <span className="flex items-end gap-1 h-3.5 w-6">
              <span className="w-1 bg-natural-accent h-3 animate-bounce rounded-full"></span>
              <span className="w-1 bg-natural-primary h-2 animate-pulse rounded-full"></span>
              <span className="w-1 bg-natural-accent h-3.5 animate-bounce rounded-full delay-75"></span>
              <span className="w-1 bg-natural-primary h-1.5 animate-pulse rounded-full delay-100"></span>
            </span>
            <span>Reproduzindo pré-visualização de voz em tempo real...</span>
          </div>
        )}

        {/* Customizable sample sentence for sound preview */}
        <div className="pt-2 border-t border-stone-150">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 mb-1">
            <label htmlFor="sample-phrase-input" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-natural-accent" />
              <span>Frase de Teste para Pré-visualização:</span>
            </label>
            <button
              type="button"
              onClick={() => setSamplePhrase(langConfig.sample)}
              className="hover:text-natural-primary text-[9px] uppercase font-mono tracking-wider flex items-center gap-0.5 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Resetar Frase
            </button>
          </div>
          <div className="flex gap-2">
            <input
              id="sample-phrase-input"
              type="text"
              value={samplePhrase}
              onChange={(e) => setSamplePhrase(e.target.value)}
              placeholder="Digite qualquer texto para testar a pronúncia..."
              className="w-full text-xs py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-natural-primary"
            />
            <button
              type="button"
              onClick={() => playPreview(selectedVoice, samplePhrase)}
              title="Testar esta frase com a voz atual"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-xl text-stone-700 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Testar</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
            <span className="text-stone-400 font-mono text-[9px]">Atalhos rápidos:</span>
            <button
              type="button"
              onClick={() => {
                const text = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10.";
                setSamplePhrase(text);
                playPreview(selectedVoice, text);
              }}
              className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-600 font-medium cursor-pointer transition-colors"
            >
              Números
            </button>
            <button
              type="button"
              onClick={() => {
                const text = langConfig.sample;
                setSamplePhrase(text);
                playPreview(selectedVoice, text);
              }}
              className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-600 font-medium cursor-pointer transition-colors"
            >
              Frase Completa
            </button>
            <button
              type="button"
              onClick={() => {
                const text = idiomaNome === "Inglês" ? "Good morning! How are you today?" :
                             idiomaNome === "Espanhol" ? "¡Buenos días! ¿Cómo estás hoy?" :
                             idiomaNome === "Francês" ? "Bonjour! Comment allez-vous aujourd'hui?" :
                             idiomaNome === "Italiano" ? "Buongiorno! Come stai oggi?" :
                             idiomaNome === "Alemão" ? "Guten Morgen! Wie geht es dir heute?" :
                             "Olá! Bom dia, como vai você hoje?";
                setSamplePhrase(text);
                playPreview(selectedVoice, text);
              }}
              className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-600 font-medium cursor-pointer transition-colors"
            >
              Saudação
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Main category tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 self-start">
            <button
              type="button"
              onClick={() => setFilterMode("recommended")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "recommended"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Recomendadas ({idiomaNome})</span>
              <span className="px-1.5 py-0.2 bg-stone-200 rounded-full text-[9px]">
                {recommendedCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "all"
                  ? "bg-white text-natural-primary shadow-xs font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Todas as Vozes</span>
              <span className="px-1.5 py-0.2 bg-stone-200 rounded-full text-[9px]">
                {voices.length}
              </span>
            </button>
          </div>

          {/* Type filter (Local vs Cloud) */}
          <div className="flex items-center gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                typeFilter === "all"
                  ? "bg-natural-primary text-white border-natural-primary"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("local")}
              className={`px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                typeFilter === "local"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              Apenas Locais
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("remote")}
              className={`px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                typeFilter === "remote"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              Nuvem
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome da voz, idioma ou região (ex: Google, Samantha, en-US, pt-BR)..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-natural-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* VOICES LIST WITH INSTANT SOUND PREVIEW BUTTON FOR EACH */}
      <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
        <div className="max-h-56 overflow-y-auto divide-y divide-stone-150" id="voices-scroll-list">
          {/* Default System Voice option */}
          <div
            onClick={() => setTtsVoiceURI("")}
            className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-all ${
              !ttsVoiceURI ? "bg-natural-primary/10 border-l-4 border-l-natural-primary" : "hover:bg-white bg-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="voice-selection"
                checked={!ttsVoiceURI}
                onChange={() => setTtsVoiceURI("")}
                className="accent-natural-primary w-4 h-4 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-stone-800">
                    Voz Padrão do Sistema (Automática)
                  </span>
                  <span className="px-1.5 py-0.2 bg-stone-200 text-stone-700 text-[9px] font-mono rounded font-semibold">
                    Auto
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Deixa o navegador escolher automaticamente a melhor voz nativa para {idiomaNome}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isPlaying && currentlyPlayingURI === "default") {
                  stopPreview();
                } else {
                  playPreview(null);
                }
              }}
              title="Pré-visualizar som da voz padrão"
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-all shadow-2xs ${
                isPlaying && currentlyPlayingURI === "default"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-natural-primary hover:text-white"
              }`}
            >
              {isPlaying && currentlyPlayingURI === "default" ? (
                <Square className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
              <span className="text-[10px]">Ouvir</span>
            </button>
          </div>

          {/* Filtered System Voices */}
          {filteredVoices.length > 0 ? (
            filteredVoices.map((voice) => {
              const isSelected = ttsVoiceURI === voice.voiceURI;
              const isVoicePlaying = isPlaying && currentlyPlayingURI === voice.voiceURI;
              const badge = getLangBadge(voice.lang);

              return (
                <div
                  key={voice.voiceURI}
                  onClick={() => setTtsVoiceURI(voice.voiceURI)}
                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected ? "bg-natural-primary/10 border-l-4 border-l-natural-primary" : "hover:bg-white bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="radio"
                      name="voice-selection"
                      checked={isSelected}
                      onChange={() => setTtsVoiceURI(voice.voiceURI)}
                      className="accent-natural-primary w-4 h-4 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-stone-800 truncate">
                          {voice.name}
                        </span>
                        {voice.default && (
                          <span className="px-1.5 py-0.2 bg-natural-accent/15 text-natural-accent text-[9px] font-mono rounded font-bold">
                            Padrão SO
                          </span>
                        )}
                        {voice.localService ? (
                          <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] rounded font-medium">
                            Local
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] rounded font-medium">
                            Online
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span>{badge.flag}</span>
                        <span>{badge.label}</span>
                        <span className="font-mono text-stone-400">({voice.lang})</span>
                      </div>
                    </div>
                  </div>

                  {/* Per-voice Quick Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isVoicePlaying) {
                        stopPreview();
                      } else {
                        playPreview(voice);
                      }
                    }}
                    title={`Ouvir pré-visualização de ${voice.name}`}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-all shadow-2xs ${
                      isVoicePlaying
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-white border border-stone-200 text-stone-700 hover:bg-natural-primary hover:text-white"
                    }`}
                  >
                    {isVoicePlaying ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                    <span className="text-[10px]">{isVoicePlaying ? "Parar" : "Ouvir"}</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">
              <VolumeX className="w-6 h-6 mx-auto mb-2 text-stone-400" />
              <p className="font-semibold text-stone-700">Nenhuma voz encontrada com os filtros aplicados.</p>
              <p className="text-[10px] text-stone-400 mt-1">
                Tente selecionar a aba "Todas as Vozes" ou clique no botão de recarregar acima.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SPEED, PITCH & AUTOPLAY CONTROLS */}
      <div className="bg-stone-50/70 border border-stone-150 p-4 rounded-2xl space-y-4">
        {/* Speed / Speech Rate slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-natural-primary" />
              <span>Velocidade de Fala</span>
            </span>
            <span className="font-mono text-natural-accent font-extrabold">{ttsSpeed.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={ttsSpeed}
              onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
              className="w-full accent-natural-primary cursor-pointer py-1"
            />
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setTtsSpeed(0.7)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  ttsSpeed === 0.7 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                0.7x
              </button>
              <button
                type="button"
                onClick={() => setTtsSpeed(1.0)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  ttsSpeed === 1.0 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                1.0x
              </button>
              <button
                type="button"
                onClick={() => setTtsSpeed(1.2)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  ttsSpeed === 1.2 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                1.2x
              </button>
            </div>
          </div>
        </div>

        {/* Pitch slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-natural-primary" />
              <span>Tom de Voz (Pitch)</span>
            </span>
            <span className="font-mono text-natural-accent font-extrabold">{pitch.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-natural-primary cursor-pointer py-1"
            />
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setPitch(0.8)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  pitch === 0.8 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Grave
              </button>
              <button
                type="button"
                onClick={() => setPitch(1.0)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  pitch === 1.0 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Natural
              </button>
              <button
                type="button"
                onClick={() => setPitch(1.2)}
                className={`px-2 py-1 text-[9px] font-extrabold uppercase border rounded-md cursor-pointer transition-colors ${
                  pitch === 1.2 ? "bg-natural-primary text-white border-natural-primary" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Agudo
              </button>
            </div>
          </div>
        </div>

        {/* Autoplay toggle switch */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-stone-700">Reprodução Automática</span>
            <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
              Ouvir a pronúncia automaticamente com a voz selecionada ao trocar de card ou lição.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ttsAutoplay}
              onChange={(e) => setTtsAutoplay(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-natural-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
