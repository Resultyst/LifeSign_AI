import { useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX, Hand, Sparkles, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "./button";

interface SignAvatarProps {
  message?: string;
  isAnimating?: boolean;
  className?: string;
  signLanguage?: string;
  autoSpeak?: boolean;
}

// Sign animation keyframes for different hand positions
const signAnimations = [
  { rotation: 0, scale: 1, translateY: 0 },
  { rotation: -15, scale: 1.05, translateY: -5 },
  { rotation: 10, scale: 0.95, translateY: 5 },
  { rotation: -20, scale: 1.1, translateY: -10 },
  { rotation: 15, scale: 1, translateY: 0 },
  { rotation: -5, scale: 1.02, translateY: -3 },
  { rotation: 20, scale: 0.98, translateY: 8 },
  { rotation: 0, scale: 1, translateY: 0 },
];

export function SignAvatar({
  message,
  isAnimating = false,
  className,
  signLanguage = "ASL",
  autoSpeak = true,
}: SignAvatarProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showWordHighlight, setShowWordHighlight] = useState(0);
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech({
    rate: 0.85,
    pitch: 1.05,
  });

  // Animate through signing frames
  useEffect(() => {
    if (!isAnimating) {
      setCurrentFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % signAnimations.length);
    }, 200);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Animate word highlighting in subtitle
  useEffect(() => {
    if (!message || !isAnimating) {
      setShowWordHighlight(0);
      return;
    }

    const words = message.split(" ");
    const wordInterval = 3000 / words.length; // Distribute across animation duration

    const interval = setInterval(() => {
      setShowWordHighlight((prev) => {
        if (prev >= words.length - 1) return prev;
        return prev + 1;
      });
    }, wordInterval);

    return () => clearInterval(interval);
  }, [message, isAnimating]);

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

  const currentAnimation = signAnimations[currentFrame];
  const words = message?.split(" ") || [];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Avatar Display */}
      <div className="avatar-display relative flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10">
        {/* Animated background particles */}
        {isAnimating && (
          <div className="absolute inset-0 overflow-hidden">
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
          {/* Animated Avatar Container */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className={cn(
                "absolute -inset-4 rounded-full transition-all duration-500",
                isAnimating
                  ? "bg-primary/20 animate-pulse"
                  : "bg-primary/5"
              )}
            />

            {/* Secondary ring */}
            <div
              className={cn(
                "absolute -inset-2 rounded-full border-2 transition-all duration-300",
                isAnimating
                  ? "border-primary/40 scale-105"
                  : "border-primary/10"
              )}
            />

            {/* Main avatar circle */}
            <div
              className={cn(
                "relative w-32 h-32 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-primary/30 to-accent/20",
                "border-4 border-primary/30 shadow-lg",
                "transition-all duration-200"
              )}
              style={{
                transform: isAnimating
                  ? `rotate(${currentAnimation.rotation}deg) scale(${currentAnimation.scale}) translateY(${currentAnimation.translateY}px)`
                  : "none",
              }}
            >
              {/* Hand icon with animation */}
              <Hand
                className={cn(
                  "w-16 h-16 text-primary transition-all duration-150",
                  isAnimating && "drop-shadow-lg"
                )}
                strokeWidth={1.5}
                style={{
                  transform: isAnimating
                    ? `rotate(${-currentAnimation.rotation * 1.5}deg)`
                    : "none",
                }}
              />

              {/* Signing indicator sparkles */}
              {isAnimating && (
                <>
                  <Sparkles
                    className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-ping"
                    style={{ animationDuration: "1.5s" }}
                  />
                  <Sparkles
                    className="absolute -bottom-1 -left-1 w-4 h-4 text-primary animate-ping"
                    style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Status text */}
          {isAnimating ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">
                Signing in {signLanguage}
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
