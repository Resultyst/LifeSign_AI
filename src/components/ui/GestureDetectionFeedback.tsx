import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, Sparkles, Hand } from "lucide-react";
import { DetectedSign } from "@/lib/signLanguageDetection";

interface GestureDetectionFeedbackProps {
  currentSign: DetectedSign | null;
  isDetecting: boolean;
  className?: string;
}

export function GestureDetectionFeedback({
  currentSign,
  isDetecting,
  className,
}: GestureDetectionFeedbackProps) {
  const [showPop, setShowPop] = useState(false);
  const [lastSignName, setLastSignName] = useState<string | null>(null);

  // Trigger animation when a new sign is detected
  useEffect(() => {
    if (currentSign && currentSign.name !== lastSignName) {
      setLastSignName(currentSign.name);
      setShowPop(true);
      const timer = setTimeout(() => setShowPop(false), 600);
      return () => clearTimeout(timer);
    }
  }, [currentSign, lastSignName]);

  if (!isDetecting || !currentSign) {
    return null;
  }

  const getCategoryStyles = () => {
    switch (currentSign.category) {
      case "emergency":
        return {
          bg: "bg-critical/95",
          border: "border-critical",
          text: "text-white",
          icon: <AlertTriangle className="w-5 h-5" />,
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
        };
      case "medical":
        return {
          bg: "bg-amber-500/95",
          border: "border-amber-400",
          text: "text-white",
          icon: <Sparkles className="w-5 h-5" />,
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
        };
      default:
        return {
          bg: "bg-primary/95",
          border: "border-primary",
          text: "text-primary-foreground",
          icon: <Hand className="w-5 h-5" />,
          glow: "shadow-[0_0_20px_rgba(var(--primary),0.5)]",
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
        "pointer-events-none",
        className
      )}
    >
      {/* Ripple effect on detection */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          showPop && "animate-ping",
          styles.bg,
          "opacity-30"
        )}
        style={{ width: "120px", height: "120px", margin: "-60px 0 0 -60px", left: "50%", top: "50%" }}
      />

      {/* Main feedback bubble */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "px-6 py-4 rounded-2xl backdrop-blur-md",
          "border-2 transition-all duration-300",
          styles.bg,
          styles.border,
          styles.text,
          styles.glow,
          showPop ? "scale-110" : "scale-100"
        )}
      >
        {/* Icon with bounce animation */}
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full mb-2",
            "bg-white/20 backdrop-blur-sm",
            showPop && "animate-bounce"
          )}
        >
          {currentSign.confidence >= 70 ? (
            <Check className="w-6 h-6" />
          ) : (
            styles.icon
          )}
        </div>

        {/* Gesture name */}
        <p
          className={cn(
            "text-lg font-bold text-center leading-tight",
            showPop && "animate-pulse"
          )}
        >
          {currentSign.name}
        </p>

        {/* Confidence bar */}
        <div className="w-full mt-2">
          <div className="flex justify-between text-[10px] font-medium opacity-80 mb-1">
            <span>Confidence</span>
            <span>{currentSign.confidence}%</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-white rounded-full transition-all duration-300",
                showPop && "animate-pulse"
              )}
              style={{ width: `${currentSign.confidence}%` }}
            />
          </div>
        </div>

        {/* Category badge */}
        {currentSign.category !== "general" && (
          <span
            className={cn(
              "absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full",
              "bg-white text-foreground shadow-md",
              showPop && "animate-bounce"
            )}
          >
            {currentSign.category}
          </span>
        )}
      </div>

      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute inset-0 -m-3 rounded-3xl opacity-50 blur-xl transition-opacity duration-300",
          styles.bg,
          showPop ? "opacity-70" : "opacity-30"
        )}
      />
    </div>
  );
}
