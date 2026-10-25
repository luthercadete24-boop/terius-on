import React, { useState, useEffect, useRef } from "react";
import { 
  Languages, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  History, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Share2, 
  Globe, 
  FileText, 
  Lightbulb, 
  WifiOff, 
  ChevronDown,
  CornerDownLeft,
  BookOpen,
  VolumeX,
  Layers,
  ArrowRight,
  Mic,
  MicOff,
  Upload,
  Download,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Sliders,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Clock,
  Send,
  Zap,
  HelpCircle,
  ExternalLink,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { isPortalOnline, getFromOfflineCache } from "../../offlineStorage";

export interface TranslationResult {
  id?: string;
  texto_original: string;
  idioma_origem_detectado: string;
  codigo_origem: string;
  idioma_destino: string;
  codigo_destino: string;
  traducao: string;
  pronuncia_fonetica?: string;
  tom_aplicado?: string;
  variacoes_alternativas?: { tom: string; texto: string }[];
  dica_linguistica?: string;
  termos_chave?: { original: string; traducao: string; classe: string }[];
  audio_url_origem?: string;
  audio_url_destino?: string;
  timestamp?: string;
  favorito?: boolean;
}

interface DialogueMessage {
  id: string;
  speaker: "A" | "B";
  text: string;
  translatedText: string;
  langFrom: string;
  langTo: string;
  timestamp: string;
}

interface TranslatorSectionProps {
  ttsSpeed: number;
  ttsVoiceURI: string;
}

export const UNIVERSAL_LANGUAGES = [
  { code: "pt", name: "Português", flag: "🇧🇷", voiceLang: "pt-BR", region: "Brasil / Portugal" },
  { code: "en", name: "Inglês", flag: "🇺🇸", voiceLang: "en-US", region: "Global / EUA / UK" },
  { code: "es", name: "Espanhol", flag: "🇪🇸", voiceLang: "es-ES", region: "Espanha / Américas" },
  { code: "fr", name: "Francês", flag: "🇫🇷", voiceLang: "fr-FR", region: "França / Francofonia" },
  { code: "de", name: "Alemão", flag: "🇩🇪", voiceLang: "de-DE", region: "Alemanha / Áustria" },
  { code: "it", name: "Italiano", flag: "🇮🇹", voiceLang: "it-IT", region: "Itália" },
  { code: "ja", name: "Japonês", flag: "🇯🇵", voiceLang: "ja-JP", region: "Japão" },
  { code: "zh", name: "Mandarim", flag: "🇨🇳", voiceLang: "zh-CN", region: "China" },
  { code: "ko", name: "Coreano", flag: "🇰🇷", voiceLang: "ko-KR", region: "Coreia do Sul" },
  { code: "ru", name: "Russo", flag: "🇷🇺", voiceLang: "ru-RU", region: "Rússia" },
  { code: "ar", name: "Árabe", flag: "🇸🇦", voiceLang: "ar-SA", region: "Mundo Árabe" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", voiceLang: "hi-IN", region: "Índia" },
  { code: "nl", name: "Holandês", flag: "🇳🇱", voiceLang: "nl-NL", region: "Holanda / Bélgica" },
  { code: "tr", name: "Turco", flag: "🇹🇷", voiceLang: "tr-TR", region: "Turquia" },
  { code: "pl", name: "Polonês", flag: "🇵🇱", voiceLang: "pl-PL", region: "Polônia" },
  { code: "sv", name: "Sueco", flag: "🇸🇪", voiceLang: "sv-SE", region: "Suécia" },
  { code: "el", name: "Grego", flag: "🇬🇷", voiceLang: "el-GR", region: "Grécia" },
  { code: "he", name: "Hebraico", flag: "🇮🇱", voiceLang: "he-IL", region: "Israel" },
  { code: "th", name: "Tailandês", flag: "🇹🇭", voiceLang: "th-TH", region: "Tailândia" },
  { code: "vi", name: "Vietnamita", flag: "🇻🇳", voiceLang: "vi-VN", region: "Vietnã" },
  { code: "id", name: "Indonésio", flag: "🇮🇩", voiceLang: "id-ID", region: "Indonésia" },
  { code: "kmb", name: "Kimbundu", flag: "🇦🇴", voiceLang: "pt-PT", region: "Angola" },
  { code: "lin", name: "Lingala", flag: "🇨🇩", voiceLang: "fr-FR", region: "Congo" },
  { code: "umb", name: "Umbundu", flag: "🇦🇴", voiceLang: "pt-PT", region: "Angola" },
  { code: "sw", name: "Suaíli", flag: "🇰🇪", voiceLang: "sw-KE", region: "África Oriental" },
  { code: "yo", name: "Iorubá", flag: "🇳🇬", voiceLang: "en-NG", region: "Nigéria" },
  { code: "la", name: "Latim", flag: "🏛️", voiceLang: "it-IT", region: "Clássico / Vaticano" },
  { code: "eo", name: "Esperanto", flag: "🌍", voiceLang: "es-ES", region: "Internacional" },
  { code: "gn", name: "Guarani", flag: "🇵🇾", voiceLang: "es-PY", region: "América do Sul" },
  { code: "uk", name: "Ucraniano", flag: "🇺🇦", voiceLang: "uk-UA", region: "Ucrânia" },
  { code: "cs", name: "Tcheco", flag: "🇨🇿", voiceLang: "cs-CZ", region: "República Tcheca" },
  { code: "ro", name: "Romeno", flag: "🇷🇴", voiceLang: "ro-RO", region: "Romênia" },
  { code: "da", name: "Dinamarquês", flag: "🇩🇰", voiceLang: "da-DK", region: "Dinamarca" },
  { code: "fi", name: "Finlandês", flag: "🇫🇮", voiceLang: "fi-FI", region: "Finlândia" },
  { code: "no", name: "Norueguês", flag: "🇳🇴", voiceLang: "nb-NO", region: "Noruega" },
  { code: "hu", name: "Húngaro", flag: "🇭🇺", voiceLang: "hu-HU", region: "Hungria" }
];

export const SOURCE_LANGUAGES = [
  { code: "auto", name: "Detectar Idioma", flag: "✨", voiceLang: "en-US", region: "IA Instantânea" },
  ...UNIVERSAL_LANGUAGES
];

const PRESET_PHRASES = [
  {
    category: "Cumprimentos & Social",
    items: [
      { text: "Olá! Como você tem passado ultimamente?", from: "pt", to: "en" },
      { text: "Good morning, it is a pleasure to meet you today.", from: "en", to: "pt" },
      { text: "Muchas gracias por tu generosa ayuda y hospitalidad.", from: "es", to: "pt" },
      { text: "Comment se passe votre séjour en ville ?", from: "fr", to: "pt" },
      { text: "Konnichiwa! Ogenki desu ka?", from: "ja", to: "pt" }
    ]
  },
  {
    category: "Viagens & Aeroporto",
    items: [
      { text: "Onde fica o portão de embarque e a esteira de bagagens?", from: "pt", to: "en" },
      { text: "Could you please tell me where the nearest train station is?", from: "en", to: "fr" },
      { text: "¿Cuánto cuesta el billete de ida y vuelta al centro?", from: "es", to: "pt" },
      { text: "Entschuldigung, wo befindet sich der Shuttlebus?", from: "de", to: "pt" },
      { text: "Gostaria de solicitar um táxi para o aeroporto internacional.", from: "pt", to: "es" }
    ]
  },
  {
    category: "Restaurante & Gastronomia",
    items: [
      { text: "Você poderia nos trazer o cardápio e a carta de vinhos, por favor?", from: "pt", to: "it" },
      { text: "I have a food allergy to peanuts and seafood.", from: "en", to: "ja" },
      { text: "L'addition, s'il vous plaît, avec paiement par carte.", from: "fr", to: "pt" },
      { text: "Esta comida tradicional é muito saborosa!", from: "pt", to: "de" }
    ]
  },
  {
    category: "Emergências & Saúde",
    items: [
      { text: "Preciso de assistência médica urgente. Onde fica o hospital mais próximo?", from: "pt", to: "en" },
      { text: "I lost my passport and wallet, I need to contact my embassy.", from: "en", to: "es" },
      { text: "Por favor, chame uma ambulância imediatamente!", from: "pt", to: "fr" },
      { text: "Tenho seguro de viagem internacional e prescrição médica.", from: "pt", to: "de" }
    ]
  },
  {
    category: "Negócios & Tecnologia",
    items: [
      { text: "Agradecemos pela reunião produtiva e aguardamos a minuta contratual.", from: "pt", to: "en" },
      { text: "Let's schedule a conference call to finalize the project roadmap.", from: "en", to: "de" },
      { text: "Nos complace anunciar el lanzamiento de la nueva plataforma digital.", from: "es", to: "pt" },
      { text: "Gostaria de propor uma parceria estratégica entre nossas equipes.", from: "pt", to: "zh" }
    ]
  },
  {
    category: "Línguas Nacionais & Clássicas",
    items: [
      { text: "Wazekele kyebhi? Ngazekele kyambote, tata!", from: "kmb", to: "pt" },
      { text: "Mbote na yo! Sango nini lelo na mokili?", from: "lin", to: "pt" },
      { text: "Carpe diem, quam minimum credula postero.", from: "la", to: "pt" },
      { text: "Saluton al ĉiuj! La tutmonda lingvo estas bela kaj facila.", from: "eo", to: "pt" }
    ]
  }
];

export default function TranslatorSection({ ttsSpeed, ttsVoiceURI }: TranslatorSectionProps) {
  // Navigation Modes: Text, Dialogue, Document, OCR Vision, Omnitranslator
  const [activeMode, setActiveMode] = useState<"text" | "dialogue" | "document" | "vision" | "omni">("text");

  // General Text Translator State
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("en");
  const [sourceText, setSourceText] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("padrao");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<TranslationResult | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState<boolean>(false);
  const [copiedTranslation, setCopiedTranslation] = useState<boolean>(false);
  const [activeSideTab, setActiveSideTab] = useState<"history" | "favorites" | "phrasebook">("phrasebook");
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const [favorites, setFavorites] = useState<TranslationResult[]>([]);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [isSpeakingSource, setIsSpeakingSource] = useState<boolean>(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isOfflineWarning, setIsOfflineWarning] = useState<boolean>(false);

  // Voice Recognition (Dictation) State
  const [isRecordingSource, setIsRecordingSource] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Dialogue Mode State (Two-Way Live Conversation)
  const [dialogueSpeakerALang, setDialogueSpeakerALang] = useState<string>("pt");
  const [dialogueSpeakerBLang, setDialogueSpeakerBLang] = useState<string>("en");
  const [dialogueInputA, setDialogueInputA] = useState<string>("");
  const [dialogueInputB, setDialogueInputB] = useState<string>("");
  const [dialogueMessages, setDialogueMessages] = useState<DialogueMessage[]>([
    {
      id: "init-1",
      speaker: "A",
      text: "Olá! Seja muito bem-vindo. Como posso ajudar você hoje?",
      translatedText: "Hello! You are very welcome. How can I help you today?",
      langFrom: "pt",
      langTo: "en",
      timestamp: "10:00"
    }
  ]);
  const [isRecordingSpeakerA, setIsRecordingSpeakerA] = useState<boolean>(false);
  const [isRecordingSpeakerB, setIsRecordingSpeakerB] = useState<boolean>(false);
  const [dialogueAutoSpeak, setDialogueAutoSpeak] = useState<boolean>(true);
  const [isDialogueProcessing, setIsDialogueProcessing] = useState<boolean>(false);

  // Document Translation State
  const [documentFileName, setDocumentFileName] = useState<string>("");
  const [documentOriginalContent, setDocumentOriginalContent] = useState<string>("");
  const [documentTranslatedContent, setDocumentTranslatedContent] = useState<string>("");
  const [documentTargetLang, setDocumentTargetLang] = useState<string>("en");
  const [isTranslatingDoc, setIsTranslatingDoc] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vision OCR State
  const [visionImagePreview, setVisionImagePreview] = useState<string | null>(null);
  const [visionFileName, setVisionFileName] = useState<string>("");
  const [visionTargetLang, setVisionTargetLang] = useState<string>("pt");
  const [isProcessingVision, setIsProcessingVision] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<{
    texto_extraido_original: string;
    idioma_origem_detectado: string;
    traducao: string;
    pronuncia_fonetica?: string;
    dica_cultural?: string;
    audio_url_destino?: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Omnitranslator Multi-Language State (1 to Many)
  const [omniInputText, setOmniInputText] = useState<string>("A paz e a cooperação entre os povos constroem um futuro próspero.");
  const [omniSelectedTargets, setOmniSelectedTargets] = useState<string[]>(["en", "es", "fr", "de", "ja", "zh"]);
  const [omniResults, setOmniResults] = useState<any[]>([]);
  const [isTranslatingOmni, setIsTranslatingOmni] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history and favorites on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("lingoprogress_translator_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedFavs = localStorage.getItem("lingoprogress_translator_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch (e) {
      console.warn("Falha ao recuperar histórico de tradução local:", e);
    }
  }, []);

  // Save history
  const saveToHistory = (res: TranslationResult) => {
    setHistory(prev => {
      const filtered = prev.filter(item => 
        item.texto_original !== res.texto_original || item.codigo_destino !== res.codigo_destino
      );
      const updated = [res, ...filtered].slice(0, 30);
      try {
        localStorage.setItem("lingoprogress_translator_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage full", e);
      }
      return updated;
    });
  };

  // Toggle favorite
  const toggleFavorite = (resultToToggle: TranslationResult) => {
    const isFav = favorites.some(
      f => f.texto_original === resultToToggle.texto_original && f.codigo_destino === resultToToggle.codigo_destino
    );

    let updatedFavs: TranslationResult[];
    if (isFav) {
      updatedFavs = favorites.filter(
        f => !(f.texto_original === resultToToggle.texto_original && f.codigo_destino === resultToToggle.codigo_destino)
      );
    } else {
      updatedFavs = [{ ...resultToToggle, favorito: true }, ...favorites];
    }

    setFavorites(updatedFavs);
    try {
      localStorage.setItem("lingoprogress_translator_favorites", JSON.stringify(updatedFavs));
    } catch (e) {
      console.warn("Storage full", e);
    }

    if (currentResult && currentResult.texto_original === resultToToggle.texto_original) {
      setCurrentResult(prev => prev ? { ...prev, favorito: !isFav } : null);
    }
  };

  const isFavorited = (res: TranslationResult) => {
    return favorites.some(
      f => f.texto_original === res.texto_original && f.codigo_destino === res.codigo_destino
    );
  };

  // Main translate function
  const handleTranslate = async (overrideText?: string, overrideFrom?: string, overrideTo?: string) => {
    const textToTranslate = (overrideText !== undefined ? overrideText : sourceText).trim();
    const fromCode = overrideFrom !== undefined ? overrideFrom : sourceLang;
    const toCode = overrideTo !== undefined ? overrideTo : targetLang;

    if (!textToTranslate) {
      setErrorToast("Por favor, digite, dite ou cole um texto para traduzir.");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    setIsTranslating(true);
    setErrorToast(null);
    setIsOfflineWarning(false);

    // If device is offline, attempt local dictionary lookup fallback
    if (!isPortalOnline()) {
      setIsOfflineWarning(true);
      const cachedVocab = getFromOfflineCache<any[]>("dicionario_completo") || [];
      const match = cachedVocab.find(v => 
        v.termo_original.toLowerCase().trim() === textToTranslate.toLowerCase().trim()
      );

      if (match) {
        const fallbackRes: TranslationResult = {
          id: String(Date.now()),
          texto_original: textToTranslate,
          idioma_origem_detectado: match.idioma_nome || "Identificado",
          codigo_origem: fromCode === "auto" ? "en" : fromCode,
          idioma_destino: UNIVERSAL_LANGUAGES.find(l => l.code === toCode)?.name || "Português",
          codigo_destino: toCode,
          traducao: match.traducao,
          pronuncia_fonetica: match.pronuncia,
          tom_aplicado: "Padrão (Base Offline)",
          dica_linguistica: match.explicacao_cultural || "Traduzido via vocabulário armazenado localmente em cache offline.",
          variacoes_alternativas: [],
          termos_chave: [{ original: match.termo_original, traducao: match.traducao, classe: match.categoria || "Termo" }],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setCurrentResult(fallbackRes);
        saveToHistory(fallbackRes);
        setIsTranslating(false);
        return;
      } else {
        setErrorToast("Em modo offline, o tradutor consulta a memória local. O termo específico não foi localizado na base embarcada.");
        setIsTranslating(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/traduzir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: textToTranslate,
          idioma_origem: fromCode,
          idioma_destino: toCode,
          tom: selectedTone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar a tradução.");
      }

      const resWithMeta: TranslationResult = {
        id: String(Date.now()),
        texto_original: data.texto_original,
        idioma_origem_detectado: data.idioma_origem_detectado,
        codigo_origem: data.codigo_origem,
        idioma_destino: data.idioma_destino,
        codigo_destino: data.codigo_destino,
        traducao: data.traducao,
        pronuncia_fonetica: data.pronuncia_fonetica,
        tom_aplicado: data.tom_aplicado,
        variacoes_alternativas: data.variacoes_alternativas,
        dica_linguistica: data.dica_linguistica,
        termos_chave: data.termos_chave,
        audio_url_origem: data.audio_url_origem,
        audio_url_destino: data.audio_url_destino,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        favorito: false
      };

      setCurrentResult(resWithMeta);
      saveToHistory(resWithMeta);

    } catch (err: any) {
      console.error("Erro na tradução:", err);
      setErrorToast(err.message || "Falha de conexão com o tradutor.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Swap languages
  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      if (currentResult?.codigo_origem) {
        const newSource = targetLang;
        const newTarget = currentResult.codigo_origem;
        setSourceLang(newSource);
        setTargetLang(newTarget);
        if (currentResult.traducao) {
          setSourceText(currentResult.traducao);
          handleTranslate(currentResult.traducao, newSource, newTarget);
        }
      }
      return;
    }

    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);

    if (currentResult && currentResult.traducao) {
      setSourceText(currentResult.traducao);
      handleTranslate(currentResult.traducao, prevTarget, prevSource);
    }
  };

  // Text-to-speech speaker
  const playTTS = (text: string, langCode: string, fallbackUrl?: string, isTarget = true) => {
    if (!text) return;

    if (isTarget) setIsSpeakingTarget(true);
    else setIsSpeakingSource(true);

    const onFinish = () => {
      if (isTarget) setIsSpeakingTarget(false);
      else setIsSpeakingSource(false);
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const langObj = UNIVERSAL_LANGUAGES.find(l => l.code === langCode);
      utterance.lang = langObj ? langObj.voiceLang : "en-US";
      utterance.rate = ttsSpeed || 1.0;
      const savedPitch = localStorage.getItem("lingoprogress_tts_pitch");
      if (savedPitch) {
        const parsedPitch = parseFloat(savedPitch);
        if (!isNaN(parsedPitch)) utterance.pitch = parsedPitch;
      }

      if (ttsVoiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.voiceURI === ttsVoiceURI);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = onFinish;
      utterance.onerror = () => {
        if (fallbackUrl) {
          const audio = new Audio(fallbackUrl);
          audio.onended = onFinish;
          audio.onerror = onFinish;
          audio.play().catch(onFinish);
        } else {
          onFinish();
        }
      };

      window.speechSynthesis.speak(utterance);
    } else if (fallbackUrl) {
      const audio = new Audio(fallbackUrl);
      audio.onended = onFinish;
      audio.onerror = onFinish;
      audio.play().catch(onFinish);
    } else {
      onFinish();
    }
  };

  // Web Speech Recognition for Dictation
  const toggleSpeechRecognition = () => {
    if (isRecordingSource) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecordingSource(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorToast("O reconhecimento de voz pelo navegador não é suportado neste dispositivo. Digite o texto.");
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const langObj = UNIVERSAL_LANGUAGES.find(l => l.code === sourceLang);
      recognition.lang = langObj ? langObj.voiceLang : "pt-BR";

      recognition.onstart = () => {
        setIsRecordingSource(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSourceText(prev => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecordingSource(false);
      };

      recognition.onend = () => {
        setIsRecordingSource(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecordingSource(false);
    }
  };

  // Dialogue Speaker Voice Handler
  const handleDialogueVoiceInput = (speaker: "A" | "B") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorToast("Reconhecimento de voz não suportado neste navegador.");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    const isCurrentActive = speaker === "A" ? isRecordingSpeakerA : isRecordingSpeakerB;
    if (isCurrentActive) {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speaker === "A") setIsRecordingSpeakerA(false);
      else setIsRecordingSpeakerB(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langCode = speaker === "A" ? dialogueSpeakerALang : dialogueSpeakerBLang;
      const langObj = UNIVERSAL_LANGUAGES.find(l => l.code === langCode);
      recognition.lang = langObj ? langObj.voiceLang : (speaker === "A" ? "pt-BR" : "en-US");

      if (speaker === "A") setIsRecordingSpeakerA(true);
      else setIsRecordingSpeakerB(true);

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          if (speaker === "A") {
            setDialogueInputA(transcript);
            await submitDialogueTurn("A", transcript);
          } else {
            setDialogueInputB(transcript);
            await submitDialogueTurn("B", transcript);
          }
        }
      };

      recognition.onerror = () => {
        if (speaker === "A") setIsRecordingSpeakerA(false);
        else setIsRecordingSpeakerB(false);
      };

      recognition.onend = () => {
        if (speaker === "A") setIsRecordingSpeakerA(false);
        else setIsRecordingSpeakerB(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      if (speaker === "A") setIsRecordingSpeakerA(false);
      else setIsRecordingSpeakerB(false);
    }
  };

  // Submit a turn in the dialogue mode
  const submitDialogueTurn = async (speaker: "A" | "B", overrideText?: string) => {
    const text = (overrideText || (speaker === "A" ? dialogueInputA : dialogueInputB)).trim();
    if (!text) return;

    const fromLang = speaker === "A" ? dialogueSpeakerALang : dialogueSpeakerBLang;
    const toLang = speaker === "A" ? dialogueSpeakerBLang : dialogueSpeakerALang;

    setIsDialogueProcessing(true);
    try {
      const response = await fetch("/api/traduzir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: text,
          idioma_origem: fromLang,
          idioma_destino: toLang,
          tom: "padrao"
        })
      });

      const data = await response.json();
      const translated = data.traducao || text;

      const newMsg: DialogueMessage = {
        id: String(Date.now()),
        speaker,
        text,
        translatedText: translated,
        langFrom: fromLang,
        langTo: toLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogueMessages(prev => [...prev, newMsg]);
      if (speaker === "A") setDialogueInputA("");
      else setDialogueInputB("");

      if (dialogueAutoSpeak) {
        playTTS(translated, toLang, data.audio_url_destino, true);
      }
    } catch (e) {
      console.error("Erro no turno do diálogo:", e);
    } finally {
      setIsDialogueProcessing(false);
    }
  };

  // Handle Document Upload
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocumentFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocumentOriginalContent(content || "");
      setDocumentTranslatedContent("");
    };
    reader.readAsText(file);
  };

  // Translate Entire Document
  const handleTranslateDocument = async () => {
    if (!documentOriginalContent.trim()) {
      setErrorToast("Nenhum conteúdo de documento para traduzir.");
      return;
    }

    setIsTranslatingDoc(true);
    try {
      const response = await fetch("/api/traduzir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: documentOriginalContent.slice(0, 8000),
          idioma_origem: "auto",
          idioma_destino: documentTargetLang,
          tom: selectedTone
        })
      });
      const data = await response.json();
      setDocumentTranslatedContent(data.traducao || "");
    } catch (err: any) {
      setErrorToast("Erro ao traduzir documento: " + err.message);
    } finally {
      setIsTranslatingDoc(false);
    }
  };

  // Download translated document file
  const handleDownloadTranslatedDoc = () => {
    if (!documentTranslatedContent) return;
    const blob = new Blob([documentTranslatedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traduzido_${documentTargetLang}_${documentFileName || "documento.txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Vision Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVisionFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setVisionImagePreview(base64);
      setVisionResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Process Vision OCR & Translation
  const handleTranslateVision = async () => {
    if (!visionImagePreview) {
      setErrorToast("Selecione uma imagem para leitura.");
      return;
    }

    setIsProcessingVision(true);
    try {
      const response = await fetch("/api/traduzir/imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: visionImagePreview,
          idioma_destino: visionTargetLang,
          tom: selectedTone
        })
      });

      const data = await response.json();
      setVisionResult(data);
    } catch (err: any) {
      setErrorToast("Erro ao analisar imagem: " + err.message);
    } finally {
      setIsProcessingVision(false);
    }
  };

  // Omnitranslator handler (1 to Many)
  const handleTranslateOmni = async () => {
    if (!omniInputText.trim()) return;

    setIsTranslatingOmni(true);
    try {
      const response = await fetch("/api/traduzir/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: omniInputText.trim(),
          idioma_origem: "auto",
          idiomas_destino: omniSelectedTargets,
          tom: selectedTone
        })
      });

      const data = await response.json();
      setOmniResults(data.traducoes || []);
    } catch (err: any) {
      console.error(err);
      setErrorToast("Erro na tradução simultânea.");
    } finally {
      setIsTranslatingOmni(false);
    }
  };

  const copyToClipboard = (text: string, isOriginal: boolean) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSourceText(text);
        if (textareaRef.current) textareaRef.current.focus();
      }
    } catch (e) {
      console.warn("Não foi possível acessar a área de transferência", e);
    }
  };

  const clearSource = () => {
    setSourceText("");
    setCurrentResult(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleApplyPreset = (item: { text: string; from: string; to: string }) => {
    setSourceText(item.text);
    setSourceLang(item.from);
    setTargetLang(item.to);
    handleTranslate(item.text, item.from, item.to);
  };

  const handleRecallHistory = (item: TranslationResult) => {
    setSourceText(item.texto_original);
    setSourceLang(item.codigo_origem || "auto");
    setTargetLang(item.codigo_destino || "pt");
    setCurrentResult(item);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("lingoprogress_translator_history");
    } catch (e) {}
  };

  const filteredHistory = history.filter(item => 
    !historySearch ||
    item.texto_original.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.traducao.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="space-y-8" id="translator-section">
      {/* Top Banner Card */}
      <div className="bg-natural-card rounded-[32px] p-6 md:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-natural-primary/10 text-natural-primary rounded-2xl">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-natural-primary">
                  Tradutor Universal
                </h2>
                <p className="text-xs text-stone-500 font-sans tracking-wide mt-0.5">
                  Laboratório Linguístico Multilateral · 36 Idiomas e Variantes Regionais
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed max-w-4xl">
              Traduza instantaneamente entre mais de <strong className="text-natural-primary">36 idiomas mundiais e línguas clássicas/africanas</strong>.
              Oferece modos avançados de <strong className="text-natural-primary">Texto & Ditado</strong>, <strong className="text-natural-primary">Conversa Bilíngue Face-a-Face</strong>, <strong className="text-natural-primary">Documentos & Arquivos</strong>, <strong className="text-natural-primary">Leitura Visual OCR de Imagens</strong> e <strong className="text-natural-primary">Omnitradutor 1-para-Muitos</strong>.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200 self-start lg:self-center shrink-0">
            <div className="px-3 py-1.5 text-center">
              <span className="block text-xs font-mono font-bold text-natural-primary">36+</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-tight">Idiomas</span>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div className="px-3 py-1.5 text-center">
              <span className="block text-xs font-mono font-bold text-natural-primary">5</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-tight">Modos IA</span>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div className="px-3 py-1.5 text-center">
              <span className="block text-xs font-mono font-bold text-natural-primary">100%</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-tight">Offline Fallback</span>
            </div>
          </div>
        </div>

        {/* Universal Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-stone-100">
          <button
            onClick={() => setActiveMode("text")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "text"
                ? "bg-natural-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Texto & Parágrafo</span>
          </button>

          <button
            onClick={() => setActiveMode("dialogue")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "dialogue"
                ? "bg-natural-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Conversa Bilíngue (Diálogo)</span>
          </button>

          <button
            onClick={() => setActiveMode("document")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "document"
                ? "bg-natural-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos & Arquivos</span>
          </button>

          <button
            onClick={() => setActiveMode("vision")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "vision"
                ? "bg-natural-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Imagem & OCR Visual</span>
          </button>

          <button
            onClick={() => setActiveMode("omni")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "omni"
                ? "bg-natural-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Omnitradutor (1 para Vários)</span>
          </button>
        </div>
      </div>

      {/* Error / Offline Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-medium flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="text-amber-600 hover:text-amber-900 font-bold ml-4 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODE 1: TEXT & PARAGRAPH TRANSLATOR
      ======================================================== */}
      {activeMode === "text" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Translator Workspace (Left/Center 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tone Selector Pills */}
            <div className="bg-white rounded-2xl p-3 border border-stone-200 flex flex-wrap items-center gap-2 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-400 pl-2 mr-1">
                Tom de Tradução:
              </span>
              {[
                { id: "padrao", label: "Padrão & Fluido" },
                { id: "formal", label: "Formal & Executivo" },
                { id: "informal", label: "Coloquial & Dia a Dia" },
                { id: "academico", label: "Acadêmico & Erudito" },
                { id: "literario", label: "Literário & Poético" },
                { id: "tecnico", label: "Técnico & Jurídico" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedTone === t.id
                      ? "bg-natural-primary text-white shadow-xs"
                      : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Translation Box Container */}
            <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm overflow-hidden">
              
              {/* Language Toolbar Header */}
              <div className="px-6 py-4 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
                
                {/* Source Language Selector */}
                <div className="flex items-center gap-2 min-w-[200px] flex-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">De:</span>
                  <div className="relative flex-1">
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 appearance-none focus:outline-none focus:ring-2 focus:ring-natural-primary/30 cursor-pointer shadow-xs"
                    >
                      {SOURCE_LANGUAGES.map(lang => (
                        <option key={`src-${lang.code}`} value={lang.code}>
                          {lang.flag} {lang.name} {lang.region ? `(${lang.region})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  className="p-2 rounded-full hover:bg-stone-200/80 text-stone-500 hover:text-natural-primary transition-all cursor-pointer"
                  title="Trocar idiomas de origem e destino"
                  type="button"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                {/* Target Language Selector */}
                <div className="flex items-center gap-2 min-w-[200px] flex-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Para:</span>
                  <div className="relative flex-1">
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 appearance-none focus:outline-none focus:ring-2 focus:ring-natural-primary/30 cursor-pointer shadow-xs"
                    >
                      {UNIVERSAL_LANGUAGES.map(lang => (
                        <option key={`tgt-${lang.code}`} value={lang.code}>
                          {lang.flag} {lang.name} {lang.region ? `(${lang.region})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Translation Panels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                
                {/* SOURCE PANEL */}
                <div className="p-6 flex flex-col justify-between min-h-[300px] relative">
                  <div>
                    <textarea
                      ref={textareaRef}
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Digite, cole seu texto ou use o microfone para tradução instantânea..."
                      rows={8}
                      className="w-full bg-transparent border-none resize-none focus:outline-none text-stone-800 text-base leading-relaxed placeholder:text-stone-300 font-sans"
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          handleTranslate();
                        }
                      }}
                    />
                  </div>

                  {/* Source Footer Toolbar */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      {/* Voice Dictation (Mic) */}
                      <button
                        onClick={toggleSpeechRecognition}
                        className={`p-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                          isRecordingSource
                            ? "bg-red-500 text-white animate-pulse"
                            : "hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                        }`}
                        title={isRecordingSource ? "Parar Ditado" : "Ditar por voz (Microfone)"}
                        type="button"
                      >
                        {isRecordingSource ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span className="hidden sm:inline text-[11px] font-semibold">
                          {isRecordingSource ? "Ouvindo..." : "Ditar"}
                        </span>
                      </button>

                      {/* Source Audio Replay */}
                      {sourceText && (
                        <button
                          onClick={() => playTTS(sourceText, sourceLang === "auto" ? "pt" : sourceLang, currentResult?.audio_url_origem, false)}
                          className={`p-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer ${
                            isSpeakingSource ? "text-natural-accent animate-pulse" : "text-stone-500"
                          }`}
                          title="Ouvir pronúncia original"
                          type="button"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Paste Button */}
                      <button
                        onClick={pasteFromClipboard}
                        className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer text-xs"
                        title="Colar da área de transferência"
                        type="button"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Copy Source */}
                      {sourceText && (
                        <button
                          onClick={() => copyToClipboard(sourceText, true)}
                          className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                          title="Copiar texto original"
                          type="button"
                        >
                          {copiedOriginal ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Clear Button */}
                      {sourceText && (
                        <button
                          onClick={clearSource}
                          className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                          title="Limpar texto"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-stone-400">
                        {sourceText.length} caracteres
                      </span>
                    </div>
                  </div>
                </div>

                {/* TARGET PANEL */}
                <div className="p-6 flex flex-col justify-between min-h-[300px] bg-stone-50/40 relative">
                  <div>
                    {isTranslating ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                        <div className="w-8 h-8 rounded-full border-3 border-natural-primary/30 border-t-natural-primary animate-spin" />
                        <p className="text-xs font-semibold text-natural-primary font-mono tracking-wider uppercase">
                          Traduzindo via IA Neural...
                        </p>
                      </div>
                    ) : currentResult ? (
                      <div className="space-y-4">
                        {/* Detected Source Indicator */}
                        {currentResult.idioma_origem_detectado && sourceLang === "auto" && (
                          <div className="flex items-center gap-1.5 text-xs text-natural-primary font-medium">
                            <Globe className="w-3.5 h-3.5 text-natural-accent" />
                            <span>Idioma detectado: {currentResult.idioma_origem_detectado}</span>
                          </div>
                        )}

                        {/* Translation Text */}
                        <div className="text-stone-900 text-base leading-relaxed font-sans font-medium select-text">
                          {currentResult.traducao}
                        </div>

                        {/* Phonetic Pronunciation Guide */}
                        {currentResult.pronuncia_fonetica && (
                          <div className="p-3 bg-natural-card rounded-2xl border border-stone-200/80">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-400 mb-0.5">
                              Transcrição Fonética / Pronúncia:
                            </div>
                            <div className="font-mono text-xs text-natural-primary font-medium tracking-wide">
                              /{currentResult.pronuncia_fonetica}/
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-stone-400 space-y-2">
                        <Languages className="w-8 h-8 text-stone-300" />
                        <p className="text-xs">A tradução gerada pela IA aparecerá aqui em tempo real.</p>
                      </div>
                    )}
                  </div>

                  {/* Target Footer Toolbar */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-200/80">
                    <div className="flex items-center gap-1.5">
                      {currentResult && (
                        <>
                          {/* Audio Player for target */}
                          <button
                            onClick={() => playTTS(currentResult.traducao, currentResult.codigo_destino, currentResult.audio_url_destino, true)}
                            className={`p-2 rounded-xl hover:bg-white transition-colors cursor-pointer ${
                              isSpeakingTarget ? "text-natural-accent animate-pulse" : "text-stone-500 hover:text-stone-800"
                            }`}
                            title="Ouvir pronúncia no idioma de destino"
                            type="button"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Copy Translation */}
                          <button
                            onClick={() => copyToClipboard(currentResult.traducao, false)}
                            className="p-2 rounded-xl hover:bg-white text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                            title="Copiar tradução"
                            type="button"
                          >
                            {copiedTranslation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {/* Toggle Favorite */}
                          <button
                            onClick={() => toggleFavorite(currentResult)}
                            className={`p-2 rounded-xl hover:bg-white transition-colors cursor-pointer ${
                              isFavorited(currentResult)
                                ? "text-amber-500"
                                : "text-stone-400 hover:text-stone-600"
                            }`}
                            title={isFavorited(currentResult) ? "Remover dos favoritos" : "Salvar tradução nos favoritos"}
                            type="button"
                          >
                            {isFavorited(currentResult) ? (
                              <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>

                          {/* Share Translation */}
                          {typeof navigator !== "undefined" && navigator.share && (
                            <button
                              onClick={() => {
                                navigator.share({
                                  title: "Tradução via Tradutor Universal",
                                  text: `${currentResult.texto_original} -> ${currentResult.traducao}`
                                }).catch(() => {});
                              }}
                              className="p-2 rounded-xl hover:bg-white text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                              title="Compartilhar tradução"
                              type="button"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Main Translate Button */}
                    <button
                      onClick={() => handleTranslate()}
                      disabled={isTranslating || !sourceText.trim()}
                      className="px-6 py-2.5 bg-natural-primary text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-natural-primary/95 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      type="button"
                    >
                      {isTranslating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Traduzindo...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Traduzir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Linguistic Details: Tone Alternatives, Key Terms & Cultural Insights */}
            {currentResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Tone Variations & Synonyms */}
                {currentResult.variacoes_alternativas && currentResult.variacoes_alternativas.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-natural-primary flex items-center gap-2 mb-3">
                      <Sliders className="w-3.5 h-3.5 text-natural-accent" />
                      <span>Variações Alternativas de Tom & Registro</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentResult.variacoes_alternativas.map((v, i) => (
                        <div key={i} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-natural-accent mb-1">
                            {v.tom}
                          </span>
                          <p className="text-xs text-stone-800 font-medium leading-relaxed">
                            {v.texto}
                          </p>
                          <div className="flex items-center justify-end mt-2 pt-2 border-t border-stone-200/60">
                            <button
                              onClick={() => copyToClipboard(v.texto, false)}
                              className="text-[10px] font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Terms & Linguistic Decomposition */}
                {currentResult.termos_chave && currentResult.termos_chave.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-natural-primary flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-natural-accent" />
                      <span>Decomposição Lexical & Termos-Chave</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentResult.termos_chave.map((item, i) => (
                        <div key={i} className="p-3 bg-natural-card rounded-2xl border border-stone-200/80">
                          <div className="text-[9px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                            {item.classe}
                          </div>
                          <div className="font-bold text-sm text-stone-900 mt-0.5">
                            {item.original}
                          </div>
                          <div className="text-xs text-natural-primary font-medium mt-0.5 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            <span>{item.traducao}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linguistic & Cultural Insights */}
                {currentResult.dica_linguistica && (
                  <div className="bg-amber-500/10 rounded-3xl p-5 border border-amber-500/20 flex items-start gap-3.5">
                    <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider">
                        Nota Cultural & Nuance Linguística
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed mt-1">
                        {currentResult.dica_linguistica}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column: Phrasebook, History & Favorites (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-natural-card rounded-[32px] p-6 border border-stone-200 shadow-sm space-y-4">
              
              {/* Tab Switcher for Sidebar */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                <button
                  onClick={() => setActiveSideTab("phrasebook")}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                    activeSideTab === "phrasebook"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Frases
                </button>
                <button
                  onClick={() => setActiveSideTab("history")}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                    activeSideTab === "history"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Histórico ({history.length})
                </button>
                <button
                  onClick={() => setActiveSideTab("favorites")}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                    activeSideTab === "favorites"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Favoritos ({favorites.length})
                </button>
              </div>

              {/* TAB 1: PHRASEBOOK */}
              {activeSideTab === "phrasebook" && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Clique em qualquer frase para carregar instantaneamente no tradutor:
                  </p>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {PRESET_PHRASES.map((group, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-natural-primary">
                          {group.category}
                        </div>
                        <div className="space-y-1.5">
                          {group.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              onClick={() => handleApplyPreset(item)}
                              className="w-full text-left p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-natural-primary/40 hover:bg-stone-50 transition-all text-xs text-stone-700 leading-relaxed cursor-pointer group flex items-start justify-between gap-2 shadow-2xs"
                              type="button"
                            >
                              <span>{item.text}</span>
                              <span className="text-[10px] font-mono text-stone-400 group-hover:text-natural-primary shrink-0 uppercase mt-0.5">
                                {item.from} → {item.to}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HISTORY */}
              {activeSideTab === "history" && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Pesquisar histórico..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-natural-primary"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {history.length > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                      <span>{filteredHistory.length} traduções</span>
                      <button
                        onClick={clearHistory}
                        className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Limpar tudo
                      </button>
                    </div>
                  )}

                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                    {filteredHistory.length === 0 ? (
                      <div className="py-12 text-center text-stone-400 text-xs">
                        Nenhum registro encontrado no histórico.
                      </div>
                    ) : (
                      filteredHistory.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleRecallHistory(item)}
                          className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-natural-primary/30 transition-all cursor-pointer space-y-1 shadow-2xs group"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                            <span className="uppercase font-bold text-natural-primary">
                              {item.codigo_origem} → {item.codigo_destino}
                            </span>
                            <span>{item.timestamp || "recente"}</span>
                          </div>
                          <div className="text-xs text-stone-800 font-medium line-clamp-1">
                            {item.texto_original}
                          </div>
                          <div className="text-xs text-stone-500 line-clamp-1">
                            {item.traducao}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FAVORITES */}
              {activeSideTab === "favorites" && (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {favorites.length === 0 ? (
                    <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                      <Bookmark className="w-6 h-6 mx-auto text-stone-300" />
                      <p>Nenhuma tradução salva como favorita ainda.</p>
                      <p className="text-[11px] text-stone-400">Clique no ícone de marcador para salvar frases úteis.</p>
                    </div>
                  ) : (
                    favorites.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white rounded-2xl border border-amber-200/80 transition-all space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase font-bold text-natural-primary">
                            {item.codigo_origem} → {item.codigo_destino}
                          </span>
                          <button
                            onClick={() => toggleFavorite(item)}
                            className="text-amber-500 hover:text-stone-400 cursor-pointer"
                          >
                            <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                          </button>
                        </div>
                        <div className="text-xs text-stone-800 font-semibold">
                          {item.texto_original}
                        </div>
                        <div className="text-xs text-natural-primary font-medium">
                          {item.traducao}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px]">
                          <button
                            onClick={() => playTTS(item.traducao, item.codigo_destino, item.audio_url_destino, true)}
                            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Ouvir</span>
                          </button>
                          <button
                            onClick={() => handleRecallHistory(item)}
                            className="text-natural-primary font-bold hover:underline cursor-pointer"
                          >
                            Abrir
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: TWO-WAY LIVE CONVERSATION (DIALOGUE)
      ======================================================== */}
      {activeMode === "dialogue" && (
        <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm p-6 md:p-8 space-y-8">
          
          {/* Dialogue Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-serif font-bold text-natural-primary flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-natural-accent" />
                <span>Conversa Bilíngue ao Vivo</span>
              </h3>
              <p className="text-xs text-stone-500">
                Duas pessoas falando idiomas distintos cara a cara, com transcrição e voz em tempo real.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dialogueAutoSpeak}
                  onChange={(e) => setDialogueAutoSpeak(e.target.checked)}
                  className="rounded text-natural-primary focus:ring-natural-primary w-4 h-4 cursor-pointer"
                />
                <span>Auto-reproduzir tradução em voz alta</span>
              </label>

              <button
                onClick={() => setDialogueMessages([])}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Limpar conversa
              </button>
            </div>
          </div>

          {/* Speakers Header: Speaker A & Speaker B Language Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Speaker A Configuration */}
            <div className="p-4 bg-natural-card rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-natural-primary text-white flex items-center justify-center text-xs font-bold font-mono">
                  A
                </span>
                <span className="text-xs font-bold text-stone-800">Interlocutor A:</span>
              </div>
              <select
                value={dialogueSpeakerALang}
                onChange={(e) => setDialogueSpeakerALang(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 cursor-pointer"
              >
                {UNIVERSAL_LANGUAGES.map(l => (
                  <option key={`spkA-${l.code}`} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaker B Configuration */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-natural-accent text-white flex items-center justify-center text-xs font-bold font-mono">
                  B
                </span>
                <span className="text-xs font-bold text-stone-800">Interlocutor B:</span>
              </div>
              <select
                value={dialogueSpeakerBLang}
                onChange={(e) => setDialogueSpeakerBLang(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 cursor-pointer"
              >
                {UNIVERSAL_LANGUAGES.map(l => (
                  <option key={`spkB-${l.code}`} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dialogue Chat History Stream */}
          <div className="bg-stone-50/60 rounded-3xl p-6 border border-stone-200 min-h-[350px] max-h-[500px] overflow-y-auto space-y-4">
            {dialogueMessages.length === 0 ? (
              <div className="py-20 text-center text-stone-400 text-xs">
                Toque no microfone ou digite abaixo para iniciar a conversa bilíngue.
              </div>
            ) : (
              dialogueMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.speaker === "A" ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 space-y-1.5 shadow-2xs ${
                      msg.speaker === "A"
                        ? "bg-white border border-stone-200 text-stone-800"
                        : "bg-natural-primary text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-60">
                      <span className="font-bold">
                        {msg.speaker === "A" ? "Interlocutor A" : "Interlocutor B"} ({msg.langFrom.toUpperCase()})
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="text-sm font-medium leading-relaxed">
                      "{msg.text}"
                    </div>
                    <div
                      className={`pt-2 mt-1 border-t text-xs font-semibold flex items-center justify-between gap-3 ${
                        msg.speaker === "A"
                          ? "border-stone-100 text-natural-primary"
                          : "border-white/20 text-white"
                      }`}
                    >
                      <span>➔ {msg.translatedText}</span>
                      <button
                        onClick={() => playTTS(msg.translatedText, msg.langTo, undefined, true)}
                        className="p-1 rounded-md hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                        title="Ouvir tradução"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Speaker Input Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input for Speaker A */}
            <div className="p-5 bg-natural-card rounded-3xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-natural-primary font-mono uppercase tracking-wider">
                  Falar como Interlocutor A
                </span>
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                  {dialogueSpeakerALang}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={dialogueInputA}
                  onChange={(e) => setDialogueInputA(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitDialogueTurn("A")}
                  placeholder={`Dite ou digite em ${UNIVERSAL_LANGUAGES.find(l => l.code === dialogueSpeakerALang)?.name}...`}
                  className="w-full pl-3 pr-10 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-natural-primary/30"
                />
                <button
                  onClick={() => submitDialogueTurn("A")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-natural-primary hover:bg-stone-100 cursor-pointer"
                  title="Enviar frase"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Big Mic Button A */}
              <button
                onClick={() => handleDialogueVoiceInput("A")}
                className={`w-full py-3 rounded-2xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isRecordingSpeakerA
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-natural-primary text-white hover:bg-natural-primary/90"
                }`}
              >
                {isRecordingSpeakerA ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecordingSpeakerA ? "Gravando voz... Toque para finalizar" : "Segurar / Falar em Voz Alta (A)"}</span>
              </button>
            </div>

            {/* Input for Speaker B */}
            <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-natural-accent font-mono uppercase tracking-wider">
                  Falar como Interlocutor B
                </span>
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                  {dialogueSpeakerBLang}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={dialogueInputB}
                  onChange={(e) => setDialogueInputB(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitDialogueTurn("B")}
                  placeholder={`Dite ou digite em ${UNIVERSAL_LANGUAGES.find(l => l.code === dialogueSpeakerBLang)?.name}...`}
                  className="w-full pl-3 pr-10 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-natural-accent/30"
                />
                <button
                  onClick={() => submitDialogueTurn("B")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-natural-accent hover:bg-stone-100 cursor-pointer"
                  title="Enviar frase"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Big Mic Button B */}
              <button
                onClick={() => handleDialogueVoiceInput("B")}
                className={`w-full py-3 rounded-2xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isRecordingSpeakerB
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-natural-accent text-white hover:bg-natural-accent/90"
                }`}
              >
                {isRecordingSpeakerB ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecordingSpeakerB ? "Gravando voz... Toque para finalizar" : "Segurar / Falar em Voz Alta (B)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 3: DOCUMENT & FILE TRANSLATOR
      ======================================================== */}
      {activeMode === "document" && (
        <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-serif font-bold text-natural-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-natural-accent" />
                <span>Tradutor de Arquivos & Documentos</span>
              </h3>
              <p className="text-xs text-stone-500">
                Faça upload de arquivos (.txt, .md, .csv, .json, .srt) para tradução integral com download do arquivo resultante.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-stone-400 font-bold uppercase">Idioma de Destino:</span>
              <select
                value={documentTargetLang}
                onChange={(e) => setDocumentTargetLang(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 cursor-pointer"
              >
                {UNIVERSAL_LANGUAGES.map(l => (
                  <option key={`doc-${l.code}`} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-natural-primary rounded-3xl p-8 text-center cursor-pointer hover:bg-stone-50/60 transition-all space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.csv,.srt"
              className="hidden"
              onChange={handleDocumentFileChange}
            />
            <div className="w-12 h-12 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-800">
                {documentFileName ? `Arquivo carregado: ${documentFileName}` : "Clique ou arraste um arquivo para traduzir"}
              </span>
              <p className="text-xs text-stone-400 mt-1">
                Formatos suportados: .TXT, .MD, .JSON, .CSV, .SRT (Legendas)
              </p>
            </div>
          </div>

          {/* Document Content Split Preview */}
          {documentOriginalContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">
                  Total de caracteres: <strong>{documentOriginalContent.length}</strong>
                </span>

                <button
                  onClick={handleTranslateDocument}
                  disabled={isTranslatingDoc}
                  className="px-6 py-2.5 bg-natural-primary text-white rounded-2xl text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isTranslatingDoc ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Traduzindo Documento...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Traduzir Arquivo Agora</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase text-stone-400">
                    Conteúdo Original
                  </div>
                  <pre className="text-xs text-stone-700 font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {documentOriginalContent}
                  </pre>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-natural-primary">
                    <span>Tradução Resultante</span>
                    {documentTranslatedContent && (
                      <button
                        onClick={handleDownloadTranslatedDoc}
                        className="text-xs text-natural-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Arquivo</span>
                      </button>
                    )}
                  </div>
                  <pre className="text-xs text-stone-800 font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {documentTranslatedContent || "A tradução do documento aparecerá aqui após o processamento."}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 4: VISION & OCR IMAGE TRANSLATOR
      ======================================================== */}
      {activeMode === "vision" && (
        <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-serif font-bold text-natural-primary flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-natural-accent" />
                <span>Tradutor Visual & OCR de Imagens</span>
              </h3>
              <p className="text-xs text-stone-500">
                Envie fotos de placas de trânsito, cardápios, rótulos, trechos de livros ou documentos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-stone-400 font-bold uppercase">Traduzir Para:</span>
              <select
                value={visionTargetLang}
                onChange={(e) => setVisionTargetLang(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 cursor-pointer"
              >
                {UNIVERSAL_LANGUAGES.map(l => (
                  <option key={`vis-${l.code}`} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Picker */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-natural-primary rounded-3xl p-8 text-center cursor-pointer hover:bg-stone-50/60 transition-all space-y-3"
          >
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
            <div className="w-12 h-12 rounded-2xl bg-natural-primary/10 text-natural-primary flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-800">
                {visionFileName ? `Foto selecionada: ${visionFileName}` : "Selecione uma imagem ou capture da câmera"}
              </span>
              <p className="text-xs text-stone-400 mt-1">
                Formatos: JPG, PNG, WEBP. A IA do Gemini 3.8 Flash fará a leitura e tradução.
              </p>
            </div>
          </div>

          {/* Image Preview & Results */}
          {visionImagePreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-400">
                  Prévia da Imagem:
                </span>
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-96 flex items-center justify-center">
                  <img
                    src={visionImagePreview}
                    alt="Prévia enviada"
                    className="max-h-96 object-contain"
                  />
                </div>
                <button
                  onClick={handleTranslateVision}
                  disabled={isProcessingVision}
                  className="w-full py-3 bg-natural-primary text-white rounded-2xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isProcessingVision ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transcrevendo e Traduzindo...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>Fazer Leitura OCR & Traduzir</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-400">
                  Resultado da Leitura & Tradução:
                </span>

                {visionResult ? (
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-stone-400 mb-1">
                        Texto Extraído da Imagem (Original - {visionResult.idioma_origem_detectado}):
                      </div>
                      <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-100 font-sans whitespace-pre-wrap">
                        {visionResult.texto_extraido_original}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-natural-primary mb-1 flex items-center justify-between">
                        <span>Tradução no Idioma de Destino:</span>
                        <button
                          onClick={() => playTTS(visionResult.traducao, visionTargetLang, visionResult.audio_url_destino, true)}
                          className="hover:text-stone-800 text-stone-500 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-stone-900 bg-white p-3.5 rounded-xl border border-stone-200">
                        {visionResult.traducao}
                      </div>
                    </div>

                    {visionResult.pronuncia_fonetica && (
                      <div className="text-xs text-stone-600 font-mono">
                        Pronúncia: /{visionResult.pronuncia_fonetica}/
                      </div>
                    )}

                    {visionResult.dica_cultural && (
                      <div className="text-xs text-stone-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-800">
                        <strong>Contexto:</strong> {visionResult.dica_cultural}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
                    Clique em "Fazer Leitura OCR & Traduzir" para extrair o texto da foto.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 5: OMNITRANSLATOR (1 TO MANY SIMULTANEOUS)
      ======================================================== */}
      {activeMode === "omni" && (
        <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-serif font-bold text-natural-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-natural-accent" />
                <span>Omnitradutor (Tradução Simultânea 1 para Vários)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Digite uma frase e veja a tradução paralela simultânea para até 6 idiomas ao mesmo tempo.
              </p>
            </div>
          </div>

          {/* Input sentence */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-stone-400">
              Texto ou frase para traduzir simultaneamente:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={omniInputText}
                onChange={(e) => setOmniInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTranslateOmni()}
                placeholder="Digite a frase..."
                className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-natural-primary/30"
              />
              <button
                onClick={handleTranslateOmni}
                disabled={isTranslatingOmni || !omniInputText.trim()}
                className="px-6 py-3 bg-natural-primary text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-natural-primary/95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isTranslatingOmni ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Traduzir Simultaneamente</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Languages Filter Pills */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-400">
                Idiomas Alvo Selecionados ({omniSelectedTargets.length}/8):
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-400 font-mono text-[10px]">Grupos Rápidos:</span>
                <button
                  type="button"
                  onClick={() => setOmniSelectedTargets(["kmb", "lin", "umb", "sw", "yo", "en"])}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-natural-primary hover:text-white text-stone-600 text-[10px] font-semibold transition-all cursor-pointer"
                >
                  África
                </button>
                <button
                  type="button"
                  onClick={() => setOmniSelectedTargets(["en", "es", "fr", "de", "ja", "zh"])}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-natural-primary hover:text-white text-stone-600 text-[10px] font-semibold transition-all cursor-pointer"
                >
                  Globais
                </button>
                <button
                  type="button"
                  onClick={() => setOmniSelectedTargets(["pt", "es", "fr", "it", "la", "eo"])}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-natural-primary hover:text-white text-stone-600 text-[10px] font-semibold transition-all cursor-pointer"
                >
                  Românicas & Clássicas
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {UNIVERSAL_LANGUAGES.map(lang => {
                const isSelected = omniSelectedTargets.includes(lang.code);
                return (
                  <button
                    key={`omni-pill-${lang.code}`}
                    onClick={() => {
                      if (isSelected) {
                        if (omniSelectedTargets.length > 1) {
                          setOmniSelectedTargets(omniSelectedTargets.filter(c => c !== lang.code));
                        }
                      } else {
                        if (omniSelectedTargets.length < 8) {
                          setOmniSelectedTargets([...omniSelectedTargets, lang.code]);
                        }
                      }
                    }}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-natural-primary text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parallel Translation Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {omniResults.length === 0 ? (
              <div className="col-span-full py-16 text-center text-stone-400 text-xs">
                Clique no botão acima para gerar a tradução comparativa entre os idiomas.
              </div>
            ) : (
              omniResults.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-natural-card rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <span className="text-base">
                        {UNIVERSAL_LANGUAGES.find(l => l.code === item.codigo_destino)?.flag || "🌐"}
                      </span>
                      <span>{item.idioma_destino}</span>
                    </span>
                    <button
                      onClick={() => playTTS(item.traducao, item.codigo_destino, item.audio_url_destino, true)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
                      title="Ouvir"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-stone-900 leading-relaxed">
                    {item.traducao}
                  </div>

                  {item.pronuncia_fonetica && (
                    <div className="text-[11px] font-mono text-stone-400">
                      /{item.pronuncia_fonetica}/
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => copyToClipboard(item.traducao, false)}
                      className="text-[11px] font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
