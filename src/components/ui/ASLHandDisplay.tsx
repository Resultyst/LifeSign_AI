import { cn } from "@/lib/utils";
import { ASLHandShape } from "@/lib/aslFingerSpelling";

interface ASLHandDisplayProps {
  handShape: ASLHandShape | null;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Visual representation of hand with finger positions
export function ASLHandDisplay({
  handShape,
  isAnimating = false,
  size = "md",
  className,
}: ASLHandDisplayProps) {
  const sizeClasses = {
    sm: "w-24 h-36",
    md: "w-32 h-48",
    lg: "w-44 h-64",
  };

  const fingerSizes = {
    sm: { width: 10, indexH: 32, middleH: 38, ringH: 32, pinkyH: 26, thumbH: 24, palmW: 40, palmH: 45 },
    md: { width: 14, indexH: 48, middleH: 56, ringH: 48, pinkyH: 38, thumbH: 32, palmW: 56, palmH: 60 },
    lg: { width: 18, indexH: 64, middleH: 72, ringH: 64, pinkyH: 52, thumbH: 44, palmW: 72, palmH: 80 },
  };

  const dims = fingerSizes[size];

  if (!handShape) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "flex items-center justify-center text-muted-foreground",
          className
        )}
      >
        <span className="text-2xl opacity-50">✋</span>
      </div>
    );
  }

  const { fingers, rotation, letter } = handShape;

  // Finger state to visual properties
  const getFingerStyle = (
    state: string,
    baseHeight: number,
    isThumb = false
  ): { height: number; opacity: number; bend: number } => {
    switch (state) {
      case "up":
        return { height: baseHeight, opacity: 1, bend: 0 };
      case "point":
        return { height: baseHeight, opacity: 1, bend: 0 };
      case "down":
        return { height: baseHeight * 0.3, opacity: 0.6, bend: 0 };
      case "bent":
        return { height: baseHeight * 0.6, opacity: 0.9, bend: 15 };
      case "out":
        return { height: baseHeight * 0.8, opacity: 1, bend: isThumb ? -45 : 30 };
      case "across":
        return { height: baseHeight * 0.5, opacity: 0.7, bend: isThumb ? 45 : 0 };
      case "tucked":
        return { height: baseHeight * 0.2, opacity: 0.4, bend: 0 };
      default:
        return { height: baseHeight, opacity: 1, bend: 0 };
    }
  };

  const thumbStyle = getFingerStyle(fingers.thumb, dims.thumbH, true);
  const indexStyle = getFingerStyle(fingers.index, dims.indexH);
  const middleStyle = getFingerStyle(fingers.middle, dims.middleH);
  const ringStyle = getFingerStyle(fingers.ring, dims.ringH);
  const pinkyStyle = getFingerStyle(fingers.pinky, dims.pinkyH);

  return (
    <div
      className={cn(
        "relative flex items-end justify-center overflow-visible",
        sizeClasses[size],
        "transition-transform duration-300",
        isAnimating && "animate-pulse-soft",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Palm */}
      <div
        className={cn(
          "absolute rounded-2xl bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-600 dark:to-amber-700",
          "shadow-md border border-amber-400/30"
        )}
        style={{
          width: dims.palmW,
          height: dims.palmH,
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: "30% 30% 40% 40%",
        }}
      />

      {/* Thumb */}
      <div
        className="absolute rounded-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
        style={{
          width: dims.width * 1.2,
          height: thumbStyle.height,
          bottom: dims.palmH * 0.6,
          left: `calc(50% - ${dims.palmW / 2 + dims.width}px)`,
          opacity: thumbStyle.opacity,
          transform: `rotate(${thumbStyle.bend - 20}deg)`,
          transformOrigin: "bottom right",
          borderRadius: "40% 40% 30% 30%",
        }}
      />

      {/* Fingers container */}
      <div
        className="absolute flex gap-1 items-end justify-center"
        style={{ 
          bottom: dims.palmH + 4,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Index */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width,
            height: indexStyle.height,
            opacity: indexStyle.opacity,
            transform: `rotate(${indexStyle.bend - 3}deg)`,
            transformOrigin: "bottom center",
          }}
        />
        {/* Middle */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width,
            height: middleStyle.height,
            opacity: middleStyle.opacity,
            transform: `rotate(${middleStyle.bend}deg)`,
            transformOrigin: "bottom center",
          }}
        />
        {/* Ring */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width,
            height: ringStyle.height,
            opacity: ringStyle.opacity,
            transform: `rotate(${-ringStyle.bend + 3}deg)`,
            transformOrigin: "bottom center",
          }}
        />
        {/* Pinky */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width * 0.85,
            height: pinkyStyle.height,
            opacity: pinkyStyle.opacity,
            transform: `rotate(${-pinkyStyle.bend - 6}deg)`,
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* Letter indicator */}
      {letter && letter !== " " && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-primary rounded-lg shadow-md">
          <span className="text-sm font-bold text-primary-foreground">{letter}</span>
        </div>
      )}
    </div>
  );
}
