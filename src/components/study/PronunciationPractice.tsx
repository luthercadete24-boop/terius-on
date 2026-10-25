import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Radio, 
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Vocabulario } from "../../types";
import { ttsService } from "../../services/ttsService";
import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

interface PronunciationPracticeProps {
  vocab: Vocabulario;
  idiomaNome: string;
  ttsSpeed?: number;
  ttsVoiceURI?: string;
  onMasteryAchieved?: () => void;
}

// Compute normalized Levenshtein distance between two strings
function computeLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[m][n];
}

function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics for phonetic comparison
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Token diff interface
interface WordMatch {
  word: string;
  status: "correct" | "close" | "incorrect" | "missing";
  spokenAlternative?: string;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  vocab,
  idiomaNome,
  ttsSpeed = 1.0,
  ttsVoiceURI = "",
  onMasteryAchieved
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [wordMatches, setWordMatches] = useState<WordMatch[]>([]);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingAiAudio, setIsPlayingAiAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPhoneticTips, setShowPhoneticTips] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const aiAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Check speech recognition capability
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Reset states when the vocabulary card changes
  useEffect(() => {
    stopListening();
    setInterimText("");
    setRecognizedText("");
    setAccuracyScore(null);
    setWordMatches([]);
    setErrorMessage(null);
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
  }, [vocab.id_vocabulario]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (userAudioUrl) {
        URL.revokeObjectURL(userAudioUrl);
      }
    };
  }, [userAudioUrl]);

  // Stop listening helper
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Start speech recognition & voice recording
  const startRecording = async () => {
    setErrorMessage(null);
    setInterimText("");
    setRecognizedText("");
    setAccuracyScore(null);
    setWordMatches([]);

    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    // 1. Initialize Microphone Audio Stream for User Voice Playback
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 0) {
          const url = URL.createObjectURL(audioBlob);
          setUserAudioUrl(url);
        }
        setIsListening(false);
        // stop mic tracks
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (err: any) {
      console.warn("Microphone access denied or unavailable for recording:", err);
      setIsListening(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Permissão de microfone negada. Por favor, libere o acesso ao microfone nas permissões do navegador.");
        return;
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("Nenhum microfone detectado no dispositivo. Conecte um microfone ou fone com microfone.");
        return;
      } else {
        setErrorMessage("Não foi possível acessar o microfone do dispositivo.");
        return;
      }
    }

    // 2. Initialize Web Speech API SpeechRecognition if available
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;

        // Select language code based on current language
        recognition.lang = ttsService.getLanguageCode(idiomaNome);

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (interim) {
            setInterimText(interim);
          }

          if (final) {
            setRecognizedText(final);
            setInterimText("");
            evaluatePronunciation(final);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            setErrorMessage("Nenhuma fala detectada. Aproxime-se do microfone e tente falar novamente.");
          } else if (event.error === "not-allowed") {
            setErrorMessage("Permissão do microfone negada.");
          } else if (event.error === "network") {
            // Non-fatal: user still has their recorded audio file
            console.info("Speech recognition network error, proceeding with audio comparison.");
          } else {
            console.warn(`Speech recognition event: ${event.error}`);
          }
          stopListening();
        };

        recognition.onend = () => {
          setIsListening(false);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.warn("Speech recognition init notice:", err);
      }
    }
  };

  // Evaluate pronunciation accuracy and compare token by token
  const evaluatePronunciation = (spoken: string) => {
    const targetNorm = normalizeForComparison(vocab.termo_original);
    const spokenNorm = normalizeForComparison(spoken);

    if (!spokenNorm) {
      setAccuracyScore(0);
      return;
    }

    // Exact match gives 100%
    if (targetNorm === spokenNorm) {
      setAccuracyScore(100);
      setWordMatches(
        vocab.termo_original.split(/\s+/).map((w) => ({
          word: w,
          status: "correct"
        }))
      );
      if (onMasteryAchieved) onMasteryAchieved();
      return;
    }

    // Levenshtein-based similarity on whole phrases
    const maxLen = Math.max(targetNorm.length, spokenNorm.length);
    const distance = computeLevenshtein(targetNorm, spokenNorm);
    const charSimilarity = Math.max(0, 1 - distance / maxLen);

    // Word-by-word token analysis
    const targetWords = vocab.termo_original.split(/\s+/);
    const spokenWords = spoken.split(/\s+/);
    const targetWordsNorm = targetWords.map(normalizeForComparison);
    const spokenWordsNorm = spokenWords.map(normalizeForComparison);

    let matchedCount = 0;
    const matches: WordMatch[] = [];

    targetWords.forEach((origWord, idx) => {
      const normWord = targetWordsNorm[idx];
      // Check exact match in spoken tokens
      const exactIndex = spokenWordsNorm.indexOf(normWord);
      if (exactIndex !== -1) {
        matchedCount += 1.0;
        matches.push({
          word: origWord,
          status: "correct",
          spokenAlternative: spokenWords[exactIndex]
        });
        // Consume match
        spokenWordsNorm[exactIndex] = "___consumed___";
      } else {
        // Check fuzzy match
        let bestScore = 0;
        let bestSpoken = "";
        let bestIdx = -1;

        spokenWordsNorm.forEach((sw, sIdx) => {
          if (sw === "___consumed___") return;
          const wordDist = computeLevenshtein(normWord, sw);
          const wordSim = 1 - wordDist / Math.max(normWord.length, sw.length);
          if (wordSim > bestScore) {
            bestScore = wordSim;
            bestSpoken = spokenWords[sIdx];
            bestIdx = sIdx;
          }
        });

        if (bestScore >= 0.70) {
          matchedCount += bestScore;
          matches.push({
            word: origWord,
            status: "close",
            spokenAlternative: bestSpoken
          });
          if (bestIdx !== -1) spokenWordsNorm[bestIdx] = "___consumed___";
        } else if (bestScore >= 0.40) {
          matchedCount += bestScore * 0.5;
          matches.push({
            word: origWord,
            status: "incorrect",
            spokenAlternative: bestSpoken
          });
        } else {
          matches.push({
            word: origWord,
            status: "missing"
          });
        }
      }
    });

    const tokenSimilarity = matchedCount / Math.max(1, targetWords.length);
    // Weighted combination: 60% token precision + 40% character/phonetic similarity
    const finalScore = Math.min(100, Math.round((tokenSimilarity * 0.6 + charSimilarity * 0.4) * 100));

    setAccuracyScore(finalScore);
    setWordMatches(matches);

    // Persist practice assessment to Firestore /users/{userId}/pronunciation/{practiceId}
    if (auth.currentUser) {
      try {
        const practiceId = `practice_${Date.now()}`;
        setDoc(doc(db, "users", auth.currentUser.uid, "pronunciation", practiceId), {
          id_vocabulario: vocab.id_vocabulario,
          termo_original: vocab.termo_original.slice(0, 200),
          idioma: idiomaNome.slice(0, 50),
          spokenText: spoken.slice(0, 300),
          accuracyScore: finalScore,
          createdAt: new Date().toISOString()
        }).catch((err) => {
          console.warn("Could not sync pronunciation to Firestore:", err);
        });
      } catch (err) {
        console.warn("Firestore sync error:", err);
      }
    }

    if (finalScore >= 85 && onMasteryAchieved) {
      onMasteryAchieved();
    }
  };

  // Play AI Pronunciation
  const playAiPronunciation = (speed: number = 1.0) => {
    if (isPlayingAiAudio) {
      if (aiAudioPlayerRef.current) {
        aiAudioPlayerRef.current.pause();
        aiAudioPlayerRef.current.currentTime = 0;
      }
      window.speechSynthesis?.cancel();
      setIsPlayingAiAudio(false);
      return;
    }

    setIsPlayingAiAudio(true);

    // If pre-recorded audio exists and standard speed, try it first
    if (vocab.url_audio && speed === 1.0) {
      const audio = new Audio(vocab.url_audio);
      aiAudioPlayerRef.current = audio;
      audio.onended = () => setIsPlayingAiAudio(false);
      audio.onerror = () => {
        // Fallback to TTS
        speakAiWithTts(speed);
      };
      audio.play().catch(() => speakAiWithTts(speed));
    } else {
      speakAiWithTts(speed);
    }
  };

  const speakAiWithTts = (speed: number) => {
    ttsService.speak(vocab.termo_original, {
      lang: ttsService.getLanguageCode(idiomaNome),
      rate: speed * ttsSpeed,
      voiceURI: ttsVoiceURI,
      onStart: () => setIsPlayingAiAudio(true),
      onEnd: () => setIsPlayingAiAudio(false),
      onError: () => setIsPlayingAiAudio(false)
    });
  };

  // Play User Audio
  const playUserAudio = () => {
    if (!userAudioUrl) return;

    if (isPlayingUserAudio && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
      setIsPlayingUserAudio(false);
      return;
    }

    const audio = new Audio(userAudioUrl);
    userAudioPlayerRef.current = audio;
    setIsPlayingUserAudio(true);
    audio.onended = () => setIsPlayingUserAudio(false);
    audio.onerror = () => setIsPlayingUserAudio(false);
    audio.play().catch(() => setIsPlayingUserAudio(false));
  };

  // Get pedagogical coaching tips based on language
  const getLanguageCoaching = () => {
    const l = idiomaNome.toLowerCase();
    if (l.includes("inglês") || l.includes("english")) {
      return "Dica: Em inglês, preste atenção na aspiração de consoantes como /p/, /t/, /k/ e no comprimento das vogais longas vs curtas (ex: 'ship' vs 'sheep').";
    }
    if (l.includes("espanhol") || l.includes("spanish")) {
      return "Dica: Em espanhol, as vogais são puras e curtas (sem ditongação). A letra 'd' entre vogais tem som suave, quase como um sopro dental.";
    }
    if (l.includes("francês") || l.includes("french")) {
      return "Dica: Em francês, mantenha os lábios arredondados nas vogais 'u' (/y/) e articule as vogais nasais com ressonância sem pronunciar o 'n' final.";
    }
    if (l.includes("alemão") || l.includes("german")) {
      return "Dica: No alemão, atente-se às consoantes finais firmes e aos 'umlauts' (ä, ö, ü), posicionando a língua como no 'i' mas com os lábios arredondados.";
    }
    if (l.includes("italiano") || l.includes("italian")) {
      return "Dica: No italiano, enfatize as consoantes duplas (geminadas) prolongando a articulação e mantenha cada sílaba claramente ritmada.";
    }
    if (l.includes("kimbundu")) {
      return "Dica: Em Kimbundu, as combinações consonantais nasais como 'mb', 'nd', 'ng' são pronunciadas num só golpe vocal harmônico.";
    }
    if (l.includes("lingala")) {
      return "Dica: Em Lingala, a entonação tonal é melódica e distingue o sentido; pronuncie as vogais com clareza sonora e ritmo cantado.";
    }
    return "Dica: Pronuncie as sílabas com ritmo estável e respiração controlada para maior fidelidade fonética.";
  };

  return (
    <div className="mt-4 bg-stone-50/90 rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs transition-all text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
            <Mic className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              Laboratório de Pronúncia & Comparação com IA
            </h5>
            <p className="text-[11px] text-stone-500">
              Grave sua voz e compare a precisão fonética com a pronúncia nativa da IA.
            </p>
          </div>
        </div>

        {/* Browser capability badge */}
        {!isSupported && (
          <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Navegador com suporte de voz limitado
          </span>
        )}
      </div>

      {/* Main Pronunciation Studio */}
      <div className="pt-4 space-y-4">
        {/* Term Reference & AI Audio Playback Bar */}
        <div className="bg-white rounded-xl p-3 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-mono text-stone-400 block mb-0.5">
              Alvo da Pronúncia ({idiomaNome}):
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-serif font-bold text-natural-primary">
                {vocab.termo_original}
              </span>
              {vocab.pronuncia && (
                <span className="text-xs font-mono text-[#5A5A40] bg-[#5A5A40]/5 px-2 py-0.5 rounded-md">
                  {vocab.pronuncia}
                </span>
              )}
            </div>
          </div>

          {/* AI Pronunciation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => playAiPronunciation(1.0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAiAudio
                  ? "bg-[#5A5A40] text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
              }`}
              title="Ouvir pronúncia original da IA"
              type="button"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAiAudio ? "Reproduzindo IA..." : "Ouvir Pronúncia da IA"}</span>
            </button>

            <button
              onClick={() => playAiPronunciation(0.75)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Ouvir em velocidade lenta (0.75x) para perceber as nuances"
              type="button"
            >
              🐢 0.75x
            </button>
          </div>
        </div>

        {/* Recording Action Zone */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={isListening ? stopListening : startRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-200"
                  : "bg-[#5A5A40] hover:bg-[#484832] text-white hover:scale-105 active:scale-95"
              }`}
              title={isListening ? "Clique para parar a gravação" : "Clique para falar"}
              type="button"
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  {isListening ? "Ouvindo sua voz..." : "Pronto para gravar"}
                </span>
                {isListening && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full animate-pulse">
                    <Radio className="w-3 h-3" /> Gravando
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {isListening
                  ? `Fale "${vocab.termo_original}" em ${idiomaNome} agora.`
                  : "Pressione o microfone e pronuncie a palavra em voz alta."}
              </p>
            </div>
          </div>

          {/* User Audio Review & Try Again Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {userAudioUrl && (
              <button
                onClick={playUserAudio}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingUserAudio
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}
                type="button"
                title="Ouvir sua própria gravação"
              >
                {isPlayingUserAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar Minha Voz</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Ouvir Minha Gravação</span>
                  </>
                )}
              </button>
            )}

            {(accuracyScore !== null || recognizedText) && (
              <button
                onClick={startRecording}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
                title="Gravar novamente"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            )}
          </div>
        </div>

        {/* Live transcription preview while speaking */}
        {isListening && interimText && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs italic flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600 shrink-0" />
            <span>Transcrição em tempo real: <strong>"{interimText}"</strong></span>
          </div>
        )}

        {/* Error notification if mic or permission fails */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Atenção na Gravação:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Comparative Audio Player and Self-Evaluation when recorded */}
        {userAudioUrl && accuracyScore === null && !isListening && (
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-stone-800">Gravação Capturada com Sucesso!</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full font-mono font-bold">
                Áudio Pronto
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              Clique em <strong>"Ouvir Minha Gravação"</strong> e compare com <strong>"Ouvir Pronúncia da IA"</strong>. Como você avalia sua articulação?
            </p>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                onClick={() => evaluatePronunciation(vocab.termo_original)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                type="button"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Pronunciei com Precisão (100%)</span>
              </button>
              <button
                onClick={() => {
                  setAccuracyScore(75);
                  setWordMatches(vocab.termo_original.split(/\s+/).map((w) => ({ word: w, status: "close" })));
                }}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                type="button"
              >
                Boa Dicção (75%)
              </button>
              <button
                onClick={startRecording}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                type="button"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Gravar Novamente</span>
              </button>
            </div>
          </div>
        )}

        {/* Pronunciation Comparison & Evaluation Results */}
        {accuracyScore !== null && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4 shadow-sm animate-fadeIn">
            {/* Score Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-150">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg shadow-xs ${
                    accuracyScore >= 85
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : accuracyScore >= 65
                      ? "bg-teal-100 text-teal-800 border border-teal-300"
                      : accuracyScore >= 45
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {accuracyScore}%
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    {accuracyScore >= 85 ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Award className="w-4 h-4" /> Excelente! Pronúncia Nativa
                      </span>
                    ) : accuracyScore >= 65 ? (
                      <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Muito Bom! Articulação Clara
                      </span>
                    ) : accuracyScore >= 45 ? (
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> Bom esforço! Ajuste as sílabas
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Continue treinando! Escute a IA e repita
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {accuracyScore >= 85
                      ? "Sua dicção bate perfeitamente com a referência acústica nativa."
                      : accuracyScore >= 65
                      ? "Compreensível com clareza. Pequenos ajustes de tonicidade vão aperfeiçoar ainda mais."
                      : "Dica: Ouça a pronúncia da IA em 0.75x para absorver as pausas e repita em seguida."}
                  </p>
                </div>
              </div>

              {/* Quick Audio Comparison Shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playAiPronunciation(1.0)}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <Volume2 className="w-3 h-3 text-[#5A5A40]" /> IA Nativa
                </button>
                {userAudioUrl && (
                  <button
                    onClick={playUserAudio}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-1 border border-emerald-200 cursor-pointer"
                    type="button"
                  >
                    <Play className="w-3 h-3" /> Sua Voz
                  </button>
                )}
              </div>
            </div>

            {/* Word-by-Word Visual Diff */}
            <div>
              <span className="text-[9px] uppercase tracking-wider font-mono text-stone-400 block mb-2">
                Comparação Palavra por Palavra (Esperado vs Reconhecido):
              </span>

              <div className="flex flex-wrap gap-2">
                {wordMatches.map((m, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-xl border text-xs flex flex-col items-center ${
                      m.status === "correct"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : m.status === "close"
                        ? "bg-teal-50 border-teal-200 text-teal-800"
                        : m.status === "incorrect"
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      {m.word}
                      {m.status === "correct" && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    </span>
                    {m.spokenAlternative && m.spokenAlternative.toLowerCase() !== m.word.toLowerCase() && (
                      <span className="text-[9px] text-stone-500 font-mono italic mt-0.5">
                        (ouviu: "{m.spokenAlternative}")
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {recognizedText && (
                <div className="mt-2.5 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                  <span className="font-semibold text-stone-700">Texto capturado pelo microfone:</span> "{recognizedText}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Phonetic Tips Section */}
        <div className="pt-1">
          <button
            onClick={() => setShowPhoneticTips(!showPhoneticTips)}
            className="text-[11px] text-[#5A5A40] hover:text-[#3d3d2a] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            type="button"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guia Fonético & Dicas de Articulação</span>
            {showPhoneticTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showPhoneticTips && (
            <div className="mt-2 bg-stone-100/80 rounded-xl p-3 text-xs text-stone-700 space-y-1.5 border border-stone-200 animate-fadeIn">
              <p className="italic">{getLanguageCoaching()}</p>
              <p className="text-[11px] text-stone-500">
                • Dica de estudo: Ouça a IA 2 vezes, respire, e depois grave sua voz procurando imitar a cadência e o tom exato.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
