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
    sm: "w-20 h-28",
    md: "w-28 h-40",
    lg: "w-36 h-52",
  };

  const fingerSizes = {
    sm: { width: 8, indexH: 28, middleH: 32, ringH: 28, pinkyH: 24, thumbH: 20 },
    md: { width: 12, indexH: 40, middleH: 48, ringH: 40, pinkyH: 32, thumbH: 28 },
    lg: { width: 16, indexH: 52, middleH: 60, ringH: 52, pinkyH: 44, thumbH: 36 },
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
        "relative flex items-end justify-center",
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
          "absolute bottom-0 rounded-2xl bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-600 dark:to-amber-700",
          "shadow-md border border-amber-400/30"
        )}
        style={{
          width: dims.width * 4.5,
          height: dims.width * 5,
          borderRadius: "30% 30% 40% 40%",
        }}
      />

      {/* Thumb */}
      <div
        className="absolute rounded-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
        style={{
          width: dims.width * 1.1,
          height: thumbStyle.height,
          bottom: dims.width * 3,
          left: 0,
          opacity: thumbStyle.opacity,
          transform: `rotate(${thumbStyle.bend}deg)`,
          transformOrigin: "bottom center",
          borderRadius: "40% 40% 30% 30%",
        }}
      />

      {/* Fingers container */}
      <div
        className="absolute flex gap-0.5 items-end"
        style={{ bottom: dims.width * 4.5 }}
      >
        {/* Index */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width,
            height: indexStyle.height,
            opacity: indexStyle.opacity,
            transform: `rotate(${indexStyle.bend}deg) translateX(-2px)`,
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
            transform: `rotate(${-ringStyle.bend}deg)`,
            transformOrigin: "bottom center",
          }}
        />
        {/* Pinky */}
        <div
          className="rounded-t-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-500 dark:to-amber-600 shadow-sm transition-all duration-300"
          style={{
            width: dims.width * 0.9,
            height: pinkyStyle.height,
            opacity: pinkyStyle.opacity,
            transform: `rotate(${-pinkyStyle.bend - 5}deg) translateX(2px)`,
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* Letter indicator */}
      {letter && letter !== " " && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary rounded-md shadow-sm">
          <span className="text-xs font-bold text-primary-foreground">{letter}</span>
        </div>
      )}
    </div>
  );
}
