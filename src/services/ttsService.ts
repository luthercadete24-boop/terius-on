// Centralized Text-to-Speech (Web Speech API) Service

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export const ttsService = {
  getLanguageCode(languageName: string): string {
    const l = (languageName || "").toLowerCase().trim();
    if (l.includes("inglês") || l.includes("ingles") || l.includes("english")) return "en-US";
    if (l.includes("espanhol") || l.includes("spanish")) return "es-ES";
    if (l.includes("francês") || l.includes("frances") || l.includes("french")) return "fr-FR";
    if (l.includes("alemão") || l.includes("alemao") || l.includes("german")) return "de-DE";
    if (l.includes("italiano") || l.includes("italian")) return "it-IT";
    if (l.includes("kimbundu")) return "pt-PT";
    if (l.includes("lingala")) return "fr-FR";
    if (l.includes("latim") || l.includes("latin")) return "it-IT";
    if (l.includes("japonês") || l.includes("japones") || l.includes("japanese")) return "ja-JP";
    if (l.includes("mandarim") || l.includes("chinês") || l.includes("chinese")) return "zh-CN";
    if (l.includes("russo") || l.includes("russian")) return "ru-RU";
    return "pt-BR";
  },

  getStoredPitch(): number {
    if (typeof window === "undefined") return 1.0;
    const saved = localStorage.getItem("lingoprogress_tts_pitch");
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) return parsed;
    }
    return 1.0;
  },

  getStoredSpeed(): number {
    if (typeof window === "undefined") return 1.0;
    const saved = localStorage.getItem("lingoprogress_tts_speed");
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) return parsed;
    }
    return 1.0;
  },

  getStoredVoiceURI(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("lingoprogress_tts_voice_uri") || "";
  },

  stop(): void {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  speak(text: string, options: SpeakOptions = {}): void {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      options.onError?.(new Error("Web Speech API não disponível neste navegador."));
      return;
    }

    if (!text || !text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = options.lang || "pt-BR";
    utterance.rate = options.rate ?? this.getStoredSpeed();
    utterance.pitch = options.pitch ?? this.getStoredPitch();

    const targetVoiceURI = options.voiceURI ?? this.getStoredVoiceURI();
    if (targetVoiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.voiceURI === targetVoiceURI);
      if (match) {
        utterance.voice = match;
      }
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = (e) => options.onError?.(e);

    window.speechSynthesis.speak(utterance);
  }
};
