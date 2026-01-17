import { cn } from "@/lib/utils";
import { ASLHandShape } from "@/lib/aslFingerSpelling";

interface ASLHandDisplayProps {
  handShape: ASLHandShape | null;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Individual finger component with joints and nail
function Finger({
  height,
  width,
  opacity,
  bend,
  rotation = 0,
  showNail = true,
  className,
}: {
  height: number;
  width: number;
  opacity: number;
  bend: number;
  rotation?: number;
  showNail?: boolean;
  className?: string;
}) {
  const jointHeight = height * 0.33;
  const nailSize = width * 0.7;

  // Calculate joint positions based on bend
  const joint1Bend = bend * 0.4;
  const joint2Bend = bend * 0.35;
  const joint3Bend = bend * 0.25;

  return (
    <div
      className={cn("relative flex flex-col items-center transition-all duration-300", className)}
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      {/* Base segment (connects to palm) */}
      <div
        className="relative"
        style={{
          transform: `rotate(${joint1Bend}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="bg-gradient-to-b from-amber-200 via-amber-250 to-amber-300 dark:from-amber-500 dark:via-amber-550 dark:to-amber-600 rounded-sm shadow-sm"
          style={{
            width,
            height: jointHeight,
            borderRadius: `${width * 0.3}px ${width * 0.3}px ${width * 0.2}px ${width * 0.2}px`,
          }}
        />
        {/* Joint line */}
        <div
          className="absolute w-full bg-amber-400/40 dark:bg-amber-700/50"
          style={{ height: 1, bottom: 0 }}
        />

        {/* Middle segment */}
        <div
          className="relative"
          style={{
            transform: `rotate(${joint2Bend}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="bg-gradient-to-b from-amber-200 via-amber-200 to-amber-300 dark:from-amber-500 dark:to-amber-600 rounded-sm shadow-sm"
            style={{
              width,
              height: jointHeight,
              borderRadius: `${width * 0.25}px`,
            }}
          />
          {/* Joint line */}
          <div
            className="absolute w-full bg-amber-400/40 dark:bg-amber-700/50"
            style={{ height: 1, bottom: 0 }}
          />

          {/* Tip segment with nail */}
          <div
            className="relative"
            style={{
              transform: `rotate(${joint3Bend}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-400 dark:to-amber-500 shadow-sm"
              style={{
                width,
                height: jointHeight * 0.9,
                borderRadius: `${width * 0.5}px ${width * 0.5}px ${width * 0.3}px ${width * 0.3}px`,
              }}
            />
            {/* Nail */}
            {showNail && (
              <div
                className="absolute bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-300 dark:to-pink-400 border border-pink-300/50 dark:border-pink-500/50"
                style={{
                  width: nailSize,
                  height: nailSize * 0.8,
                  top: 2,
                  left: (width - nailSize) / 2,
                  borderRadius: `${nailSize * 0.3}px ${nailSize * 0.3}px ${nailSize * 0.15}px ${nailSize * 0.15}px`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Thumb component (different structure - 2 joints)
function Thumb({
  height,
  width,
  opacity,
  bend,
  rotation = 0,
}: {
  height: number;
  width: number;
  opacity: number;
  bend: number;
  rotation?: number;
}) {
  const jointHeight = height * 0.45;
  const nailSize = width * 0.65;

  return (
    <div
      className="relative flex flex-col items-center transition-all duration-300"
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom right",
      }}
    >
      {/* Base segment */}
      <div
        className="relative"
        style={{
          transform: `rotate(${bend * 0.5}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-500 dark:to-amber-600 rounded-md shadow-sm"
          style={{
            width: width * 1.1,
            height: jointHeight,
            borderRadius: `${width * 0.35}px`,
          }}
        />
        {/* Joint crease */}
        <div
          className="absolute w-full bg-amber-400/40 dark:bg-amber-700/50"
          style={{ height: 1.5, bottom: 0 }}
        />

        {/* Tip segment with nail */}
        <div
          className="relative"
          style={{
            transform: `rotate(${bend * 0.5}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-400 dark:to-amber-500 shadow-sm"
            style={{
              width: width * 1.1,
              height: jointHeight * 0.85,
              borderRadius: `${width * 0.5}px ${width * 0.5}px ${width * 0.3}px ${width * 0.3}px`,
            }}
          />
          {/* Nail */}
          <div
            className="absolute bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-300 dark:to-pink-400 border border-pink-300/50 dark:border-pink-500/50"
            style={{
              width: nailSize,
              height: nailSize * 0.75,
              top: 2,
              left: (width * 1.1 - nailSize) / 2,
              borderRadius: `${nailSize * 0.3}px ${nailSize * 0.3}px ${nailSize * 0.15}px ${nailSize * 0.15}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ASLHandDisplay({
  handShape,
  isAnimating = false,
  size = "md",
  className,
}: ASLHandDisplayProps) {
  const sizeConfig = {
    sm: { container: "w-28 h-40", fingerW: 10, fingerH: 36, thumbH: 28, palmW: 44, palmH: 48 },
    md: { container: "w-36 h-52", fingerW: 13, fingerH: 48, thumbH: 36, palmW: 56, palmH: 62 },
    lg: { container: "w-48 h-68", fingerW: 16, fingerH: 62, thumbH: 46, palmW: 72, palmH: 80 },
  };

  const dims = sizeConfig[size];

  if (!handShape) {
    return (
      <div
        className={cn(
          dims.container,
          "flex items-center justify-center text-muted-foreground",
          className
        )}
      >
        <span className="text-3xl opacity-50">✋</span>
      </div>
    );
  }

  const { fingers, rotation, letter } = handShape;

  // Map finger states to visual properties
  const getFingerProps = (state: string, baseHeight: number) => {
    switch (state) {
      case "up":
        return { height: baseHeight, opacity: 1, bend: 0 };
      case "point":
        return { height: baseHeight, opacity: 1, bend: 0 };
      case "down":
        return { height: baseHeight * 0.35, opacity: 0.85, bend: 85 };
      case "bent":
        return { height: baseHeight * 0.7, opacity: 0.95, bend: 45 };
      case "out":
        return { height: baseHeight * 0.85, opacity: 1, bend: 15 };
      default:
        return { height: baseHeight, opacity: 1, bend: 0 };
    }
  };

  const getThumbProps = (state: string, baseHeight: number) => {
    switch (state) {
      case "up":
        return { height: baseHeight, opacity: 1, bend: 0, rotation: -30 };
      case "out":
        return { height: baseHeight, opacity: 1, bend: 10, rotation: -60 };
      case "across":
        return { height: baseHeight * 0.75, opacity: 0.9, bend: 25, rotation: 20 };
      case "tucked":
        return { height: baseHeight * 0.5, opacity: 0.7, bend: 50, rotation: 45 };
      default:
        return { height: baseHeight, opacity: 1, bend: 0, rotation: -30 };
    }
  };

  const indexProps = getFingerProps(fingers.index, dims.fingerH);
  const middleProps = getFingerProps(fingers.middle, dims.fingerH * 1.1);
  const ringProps = getFingerProps(fingers.ring, dims.fingerH * 0.95);
  const pinkyProps = getFingerProps(fingers.pinky === "out" ? "out" : fingers.pinky, dims.fingerH * 0.8);
  const thumbProps = getThumbProps(fingers.thumb, dims.thumbH);

  return (
    <div
      className={cn(
        "relative flex items-end justify-center overflow-visible",
        dims.container,
        "transition-transform duration-300",
        isAnimating && "animate-pulse-soft",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Palm with details */}
      <div
        className="absolute bg-gradient-to-br from-amber-200 via-amber-250 to-amber-300 dark:from-amber-600 dark:via-amber-650 dark:to-amber-700 shadow-lg"
        style={{
          width: dims.palmW,
          height: dims.palmH,
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "35% 35% 45% 45%",
          border: "1px solid rgba(180, 130, 80, 0.3)",
        }}
      >
        {/* Palm lines for realism */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 20 35 Q 50 30 80 40"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-amber-700"
          />
          <path
            d="M 25 55 Q 50 50 75 55"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-amber-700"
          />
          <path
            d="M 30 70 Q 50 68 70 72"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            className="text-amber-700"
          />
        </svg>
      </div>

      {/* Thumb */}
      <div
        className="absolute"
        style={{
          bottom: dims.palmH * 0.55 + 12,
          left: `calc(50% - ${dims.palmW / 2 + 4}px)`,
        }}
      >
        <Thumb
          height={thumbProps.height}
          width={dims.fingerW * 1.2}
          opacity={thumbProps.opacity}
          bend={thumbProps.bend}
          rotation={thumbProps.rotation}
        />
      </div>

      {/* Fingers */}
      <div
        className="absolute flex items-end justify-center"
        style={{
          bottom: dims.palmH + 8,
          left: "50%",
          transform: "translateX(-50%)",
          gap: 2,
        }}
      >
        {/* Index */}
        <Finger
          height={indexProps.height}
          width={dims.fingerW}
          opacity={indexProps.opacity}
          bend={indexProps.bend}
          rotation={-4}
        />
        {/* Middle */}
        <Finger
          height={middleProps.height}
          width={dims.fingerW}
          opacity={middleProps.opacity}
          bend={middleProps.bend}
          rotation={0}
        />
        {/* Ring */}
        <Finger
          height={ringProps.height}
          width={dims.fingerW}
          opacity={ringProps.opacity}
          bend={ringProps.bend}
          rotation={3}
        />
        {/* Pinky */}
        <Finger
          height={pinkyProps.height}
          width={dims.fingerW * 0.85}
          opacity={pinkyProps.opacity}
          bend={pinkyProps.bend}
          rotation={7}
        />
      </div>

      {/* Letter indicator badge */}
      {letter && letter !== " " && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-primary/90 rounded-lg shadow-md border border-primary-foreground/20">
          <span className="text-sm font-bold text-primary-foreground">{letter}</span>
        </div>
      )}
    </div>
  );
}
