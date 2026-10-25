import React, { useState, useEffect } from "react";
import { Volume2, FlipHorizontal, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Mic } from "lucide-react";
import { Vocabulario } from "../../types";
import { ttsService } from "../../services/ttsService";
import { PronunciationPractice } from "./PronunciationPractice";

interface VocabularySectionProps {
  vocabularios: Vocabulario[];
  idiomaNome: string;
  ttsSpeed?: number;
  ttsVoiceURI?: string;
  ttsAutoplay?: boolean;
}

export default function VocabularySection({ 
  vocabularios, 
  idiomaNome,
  ttsSpeed = 1.0,
  ttsVoiceURI = "",
  ttsAutoplay = false
}: VocabularySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [markedAsLearnt, setMarkedAsLearnt] = useState<Record<number, boolean>>({});
  const [ttsError, setTtsError] = useState(false);
  const [showPronunciationLab, setShowPronunciationLab] = useState(true);

  // Load persistent marked vocabs on mount
  useEffect(() => {
    const saved = localStorage.getItem("lingoprogress_learnt_vocabs");
    if (saved) {
      try {
        setMarkedAsLearnt(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse learned vocabularies:", err);
      }
    }
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setIsFlipped(false);
    setTtsError(false);
  }, [vocabularios]);

  // Safe fallback to prevent out of bounds when changing vocabularios
  const safeActiveIndex = activeIndex < vocabularios.length ? activeIndex : 0;
  const currentVocab = vocabularios[safeActiveIndex];

  const speakTerm = (text: string) => {
    if (currentVocab && currentVocab.url_audio) {
      try {
        if (typeof window !== "undefined") {
          window.speechSynthesis?.cancel(); // stop any ongoing TTS
          const audio = new Audio(currentVocab.url_audio);
          audio.preload = "auto";
          audio.play().catch((err) => {
            console.warn("Audio file streaming failed, falling back to TTS:", err);
            playTtsFallback(text);
          });
          setTtsError(false);
          return;
        }
      } catch (err) {
        console.warn("Native player failed, falling back to TTS:", err);
      }
    }
    playTtsFallback(text);
  };

  const playTtsFallback = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTtsError(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice language code using centralized ttsService
    utterance.lang = ttsService.getLanguageCode(idiomaNome);

    // Apply custom speed
    utterance.rate = ttsSpeed;

    // Apply saved pitch preference
    const savedPitch = localStorage.getItem("lingoprogress_tts_pitch");
    if (savedPitch) {
      const parsedPitch = parseFloat(savedPitch);
      if (!isNaN(parsedPitch)) utterance.pitch = parsedPitch;
    }

    // Apply specific voice if selected
    if (ttsVoiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.voiceURI === ttsVoiceURI);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    try {
      window.speechSynthesis.cancel(); // Stop playing any current voice
      window.speechSynthesis.speak(utterance);
      setTtsError(false);
    } catch {
      setTtsError(true);
    }
  };

  // TTS audio narrator that targets native voices dynamically as instructed
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Preserve flipping action
    if (!currentVocab) return;
    speakTerm(currentVocab.termo_original);
  };

  // Autoplay TTS speech when safeActiveIndex changes
  useEffect(() => {
    if (ttsAutoplay && currentVocab) {
      const timer = setTimeout(() => {
        speakTerm(currentVocab.termo_original);
      }, 400); // Wait for transition animation to end
      return () => clearTimeout(timer);
    }
  }, [safeActiveIndex, ttsAutoplay, currentVocab?.id_vocabulario]);

  if (vocabularios.length === 0) {
    return (
      <div className="text-stone-400 text-xs italic p-4 text-center">
        Nenhum termo de vocabulário cadastrado para esta lição.
      </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1 < vocabularios.length ? prev + 1 : 0));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : vocabularios.length - 1));
    }, 150);
  };

  const toggleLearnt = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMarkedAsLearnt((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      localStorage.setItem("lingoprogress_learnt_vocabs", JSON.stringify(updated));
      return updated;
    });
  };

  const currentLearnt = markedAsLearnt[currentVocab.id_vocabulario] || false;

  return (
    <div className="space-y-6" id="vocabulary-section-root">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-natural-primary" />
            Flashcards Interativos
          </h4>
          <p className="text-xs text-stone-500 italic">
            Clique no cartão para girar e alternar a tradução com exemplos práticos.
          </p>
        </div>
        <div className="text-[10px] font-mono uppercase bg-[#5A5A40]/10 border border-[#5A5A40]/10 px-2.5 py-1 rounded-full text-natural-primary font-bold">
          {safeActiveIndex + 1} de {vocabularios.length}
        </div>
      </div>

      {/* 3D Rotating Flashcard Stage with Natural Tones */}
      <div className="flex items-center justify-center py-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-lg h-80 cursor-pointer outline-none relative select-none flashcard-3d group text-left block"
          style={{ WebkitTapHighlightColor: "transparent" }}
          id={`flashcard-${currentVocab.id_vocabulario}`}
        >
          <div
            className={`w-full h-full flashcard-inner duration-500 relative ${
              isFlipped ? "transform rotateY-180 [transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden rounded-[32px] bg-white border border-stone-200 p-8 flex flex-col justify-between glow-indigo transition-all shadow-md group-hover:border-stone-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold leading-none tracking-widest text-stone-400 uppercase">
                  Termo em {idiomaNome}
                </span>

                <button
                  onClick={(e) => toggleLearnt(currentVocab.id_vocabulario, e)}
                  className={`p-1.5 rounded-full border transition-colors ${
                    currentLearnt
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                      : "bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700"
                  }`}
                  title={currentLearnt ? "Marcar como não estudado" : "Marcar como dominado!"}
                  type="button"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center my-auto">
                {currentVocab.url_imagem && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={currentVocab.url_imagem}
                      alt={currentVocab.termo_original}
                      className="w-24 h-24 object-cover rounded-2xl border border-stone-100 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <h3 className="text-4xl font-serif font-bold italic tracking-tight text-natural-primary mb-3">
                  {currentVocab.termo_original}
                </h3>
                
                {currentVocab.pronuncia && (
                  <p className="text-xs font-mono text-[#5A5A40] bg-[#5A5A40]/5 border border-[#5A5A40]/10 px-3 py-1 rounded-full inline-block mb-3 select-all">
                    🗣️ {currentVocab.pronuncia}
                  </p>
                )}
                
                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={handleSpeak}
                    className="py-2 px-3.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider text-[10px] font-bold animate-pulse-subtle cursor-pointer"
                    title="Ouvir pronúncia original"
                    type="button"
                    id="speak-audio-btn"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir Voz</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPronunciationLab(true);
                      const el = document.getElementById("pronunciation-practice-container");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="py-2 px-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider text-[10px] font-bold cursor-pointer"
                    title="Gravar sua voz e comparar pronúncia com IA"
                    type="button"
                    id="practice-pronunciation-btn"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Praticar Pronúncia</span>
                  </button>
                </div>
                {ttsError && (
                  <p className="text-[10px] mt-2 text-stone-400 italic">
                    Reprodução de voz indisponível neste navegador.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 pt-4 font-mono font-semibold tracking-wider">
                <span className="flex items-center gap-1 uppercase tracking-wide group-hover:text-natural-primary transition-colors">
                  <FlipHorizontal className="w-3.5 h-3.5" /> Toque para virar
                </span>
                <span>LingoProgress</span>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-[32px] bg-white border border-stone-200 p-6 flex flex-col justify-between glow-indigo transition-all shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#5A5A40]">
                    Tradução e Semântica
                  </span>
                  <span className="text-[10px] font-serif font-bold italic text-natural-primary bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {currentVocab.termo_original}
                  </span>
                </div>

                <p className="text-xl font-serif font-bold text-natural-accent mb-1">
                  {currentVocab.traducao}
                </p>

                {currentVocab.pronuncia && (
                  <p className="text-xs font-mono text-[#5A5A40] mb-4">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Como se Pronuncia:</span>
                    {currentVocab.pronuncia}
                  </p>
                )}

                {/* Practical Context Sentences with Natural Serif elegance */}
                <div className="space-y-2 text-left">
                  <span className="block text-[8px] font-bold uppercase text-stone-400 tracking-wider mb-1">
                    Exemplos de Contexto:
                  </span>
                  <div className="text-xs leading-relaxed text-stone-700 bg-stone-50 p-2 px-3 rounded-xl border border-stone-150 font-serif italic">
                    <span className="font-mono text-natural-accent font-bold mr-1">1:</span>
                    {currentVocab.exemplo_contexto_1}
                  </div>
                  {currentVocab.exemplo_contexto_2 && (
                    <div className="text-xs leading-relaxed text-stone-700 bg-stone-50 p-2 px-3 rounded-xl border border-stone-150 font-serif italic">
                      <span className="font-mono text-natural-accent font-bold mr-1">2:</span>
                      {currentVocab.exemplo_contexto_2}
                    </div>
                  )}
                  {currentVocab.exemplo_contexto_3 && (
                    <div className="text-xs leading-relaxed text-stone-700 bg-stone-50 p-2 px-3 rounded-xl border border-stone-150 font-serif italic">
                      <span className="font-mono text-natural-accent font-bold mr-1">3:</span>
                      {currentVocab.exemplo_contexto_3}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 pt-3 font-mono font-semibold tracking-wider">
                <span className="flex items-center gap-1 uppercase">
                  <FlipHorizontal className="w-3.5 h-3.5" /> Toque para reverter
                </span>
                {currentLearnt && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Estudado!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls with custom matching buttons */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 transition-colors cursor-pointer"
          type="button"
          id="prev-vocab-btn"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white transition-colors cursor-pointer"
          type="button"
          id="next-vocab-btn"
        >
          Próximo <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pronunciation Practice & Web Speech API Comparison Studio */}
      {showPronunciationLab && (
        <div id="pronunciation-practice-container" className="max-w-lg mx-auto">
          <PronunciationPractice
            vocab={currentVocab}
            idiomaNome={idiomaNome}
            ttsSpeed={ttsSpeed}
            ttsVoiceURI={ttsVoiceURI}
            onMasteryAchieved={() => {
              if (!markedAsLearnt[currentVocab.id_vocabulario]) {
                toggleLearnt(currentVocab.id_vocabulario, { stopPropagation: () => {} } as any);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
