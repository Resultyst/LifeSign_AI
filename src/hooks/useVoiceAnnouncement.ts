import { useRef, useCallback } from "react";

interface UseVoiceAnnouncementOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useVoiceAnnouncement({
  enabled = true,
  rate = 0.9,
  pitch = 1,
  volume = 1,
}: UseVoiceAnnouncementOptions = {}) {
  const lastAnnouncedRef = useRef<string>("");
  const speakingRef = useRef(false);

  const speak = useCallback(
    (text: string, options?: { force?: boolean; priority?: "high" | "normal" }) => {
      if (!enabled || !window.speechSynthesis) {
        return;
      }

      // Don't repeat the same announcement unless forced
      if (!options?.force && text === lastAnnouncedRef.current) {
        return;
      }

      // For high priority (emergency), cancel current speech
      if (options?.priority === "high" && speakingRef.current) {
        window.speechSynthesis.cancel();
      } else if (speakingRef.current) {
        // For normal priority, don't interrupt
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Try to use a clear, professional voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel") ||
            v.name.includes("Microsoft"))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        speakingRef.current = true;
      };

      utterance.onend = () => {
        speakingRef.current = false;
      };

      utterance.onerror = () => {
        speakingRef.current = false;
      };

      lastAnnouncedRef.current = text;
      window.speechSynthesis.speak(utterance);
    },
    [enabled, rate, pitch, volume]
  );

  const announceSign = useCallback(
    (
      signName: string,
      meaning: string,
      category?: "emergency" | "medical" | "general"
    ) => {
      // Only announce the main meaning, not the full description
      const priority: "high" | "normal" = category === "emergency" ? "high" : "normal";
      
      speak(meaning, { priority });
    },
    [speak]
  );

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speakingRef.current = false;
    }
  }, []);

  const isSpeaking = useCallback(() => speakingRef.current, []);

  return {
    speak,
    announceSign,
    cancel,
    isSpeaking,
    isSupported: typeof window !== "undefined" && "speechSynthesis" in window,
  };
}
