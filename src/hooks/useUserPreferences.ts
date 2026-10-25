import { useState, useEffect } from "react";

export function useUserPreferences() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lingoprogress_dark_mode") === "true";
  });

  const [ttsSpeed, setTtsSpeed] = useState<number>(() => {
    if (typeof window === "undefined") return 1.0;
    const saved = localStorage.getItem("lingoprogress_tts_speed");
    return saved ? parseFloat(saved) : 1.0;
  });

  const [ttsAutoplay, setTtsAutoplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lingoprogress_tts_autoplay") === "true";
  });

  const [ttsVoiceURI, setTtsVoiceURI] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("lingoprogress_tts_voice_uri") || "";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("lingoprogress_dark_mode", darkMode ? "true" : "false");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lingoprogress_tts_speed", ttsSpeed.toString());
  }, [ttsSpeed]);

  useEffect(() => {
    localStorage.setItem("lingoprogress_tts_autoplay", ttsAutoplay ? "true" : "false");
  }, [ttsAutoplay]);

  useEffect(() => {
    localStorage.setItem("lingoprogress_tts_voice_uri", ttsVoiceURI);
  }, [ttsVoiceURI]);

  return {
    darkMode,
    setDarkMode,
    ttsSpeed,
    setTtsSpeed,
    ttsAutoplay,
    setTtsAutoplay,
    ttsVoiceURI,
    setTtsVoiceURI
  };
}
