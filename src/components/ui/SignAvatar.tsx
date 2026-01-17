import { useState, useCallback, useEffect, useMemo } from "react";
import { Volume2, VolumeX, Sparkles, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "./button";
import { ASLHandDisplay } from "./ASLHandDisplay";
import { messageToHandShapes, ASLHandShape } from "@/lib/aslFingerSpelling";

interface SignAvatarProps {
  message?: string;
  isAnimating?: boolean;
  className?: string;
  signLanguage?: string;
  autoSpeak?: boolean;
}

const LETTER_DURATION_MS = 600; // Time to show each letter

export function SignAvatar({
  message,
  isAnimating = false,
  className,
  signLanguage = "ASL",
  autoSpeak = true,
}: SignAvatarProps) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [showWordHighlight, setShowWordHighlight] = useState(0);
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech({
    rate: 0.85,
    pitch: 1.05,
  });

  // Convert message to hand shapes
  const handShapes = useMemo(() => {
    if (!message) return [];
    return messageToHandShapes(message);
  }, [message]);

  const currentHandShape: ASLHandShape | null = handShapes[currentLetterIndex] || null;

  // Animate through fingerspelling
  useEffect(() => {
    if (!isAnimating || handShapes.length === 0) {
      setCurrentLetterIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLetterIndex((prev) => {
        if (prev >= handShapes.length - 1) {
          return 0; // Loop back
        }
        return prev + 1;
      });
    }, LETTER_DURATION_MS);

    return () => clearInterval(interval);
  }, [isAnimating, handShapes.length]);

  // Animate word highlighting in subtitle
  useEffect(() => {
    if (!message || !isAnimating) {
      setShowWordHighlight(0);
      return;
    }

    const words = message.split(" ");
    const totalDuration = handShapes.length * LETTER_DURATION_MS;
    const wordInterval = totalDuration / words.length;

    const interval = setInterval(() => {
      setShowWordHighlight((prev) => {
        if (prev >= words.length - 1) return 0;
        return prev + 1;
      });
    }, wordInterval);

    return () => clearInterval(interval);
  }, [message, isAnimating, handShapes.length]);

  // Auto-speak when message changes
  useEffect(() => {
    if (message && autoSpeak && isSupported) {
      speak(message);
    }
    return () => {
      if (isSpeaking) {
        stop();
      }
    };
  }, [message]);

  const handleToggleSpeech = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else if (message) {
      speak(message);
    }
  }, [isSpeaking, message, speak, stop]);

  const words = message?.split(" ") || [];
  const progress = handShapes.length > 0 
    ? ((currentLetterIndex + 1) / handShapes.length) * 100 
    : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Avatar Display */}
      <div className="avatar-display relative flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 min-h-[280px]">
        {/* Animated background particles */}
        {isAnimating && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 p-6 relative z-10">
          {/* Hand Shape Display */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className={cn(
                "absolute -inset-6 rounded-full transition-all duration-500",
                isAnimating
                  ? "bg-primary/20 animate-pulse"
                  : "bg-primary/5"
              )}
            />

            {/* ASL Hand Display */}
            <div className={cn(
              "relative bg-gradient-to-b from-background/80 to-background/40 rounded-2xl p-4 backdrop-blur-sm",
              "border-2 transition-all duration-300",
              isAnimating ? "border-primary/40 shadow-lg" : "border-primary/10"
            )}>
              <ASLHandDisplay
                handShape={currentHandShape}
                isAnimating={isAnimating}
                size="lg"
              />

              {/* Sparkle effects when animating */}
              {isAnimating && (
                <>
                  <Sparkles
                    className="absolute -top-2 -right-2 w-5 h-5 text-accent animate-ping"
                    style={{ animationDuration: "1.5s" }}
                  />
                  <Sparkles
                    className="absolute -bottom-2 -left-2 w-4 h-4 text-primary animate-ping"
                    style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {isAnimating && handShapes.length > 0 && (
            <div className="w-full max-w-[200px]">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-1">
                {currentLetterIndex + 1} / {handShapes.length} letters
              </p>
            </div>
          )}

          {/* Status text */}
          {isAnimating ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">
                Fingerspelling in {signLanguage}
              </span>
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Ready to sign your message
            </p>
          )}
        </div>

        {/* AI Avatar badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/20 backdrop-blur-sm">
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            AI Avatar
          </span>
        </div>

        {/* Language badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent/20 rounded-lg border border-accent/30">
          <span className="text-xs font-semibold text-accent">{signLanguage}</span>
        </div>
      </div>

      {/* Subtitle Display with TTS */}
      {message && (
        <div className="p-4 bg-card rounded-2xl border border-border shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            {/* TTS Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSpeech}
              disabled={!isSupported}
              className={cn(
                "shrink-0 rounded-xl h-12 w-12 transition-colors",
                isSpeaking
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground hover:text-primary"
              )}
              aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
            >
              {isSpeaking ? (
                <div className="relative">
                  <VolumeX className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                Message for Patient
              </p>
              {/* Animated word highlighting */}
              <p className="text-lg font-medium leading-relaxed">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={cn(
                      "transition-colors duration-200 inline-block mr-1",
                      isAnimating && index <= showWordHighlight
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>

            {/* Play/Pause indicator for TTS */}
            {isSupported && (
              <div className="shrink-0">
                {isSpeaking ? (
                  <Pause className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <Play className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
