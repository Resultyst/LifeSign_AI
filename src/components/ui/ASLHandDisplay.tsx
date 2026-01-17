import { cn } from "@/lib/utils";
import { ASLHandShape } from "@/lib/aslFingerSpelling";

interface ASLHandDisplayProps {
  handShape: ASLHandShape | null;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Realistic finger with proper segments and natural curvature
function Finger({
  height,
  width,
  opacity,
  bend,
  rotation = 0,
  className,
}: {
  height: number;
  width: number;
  opacity: number;
  bend: number;
  rotation?: number;
  className?: string;
}) {
  // Anatomically correct segment proportions
  const proximalH = height * 0.42; // Base segment (longest)
  const middleH = height * 0.32;   // Middle segment
  const distalH = height * 0.26;   // Tip segment (shortest)
  const nailW = width * 0.72;
  const nailH = width * 0.55;

  // Natural bend distribution across joints
  const mcp = bend * 0.45;  // Base joint
  const pip = bend * 0.35;  // Middle joint  
  const dip = bend * 0.20;  // Tip joint

  return (
    <div
      className={cn("relative transition-all duration-300 ease-out", className)}
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      {/* Proximal phalanx (base segment) */}
      <div
        style={{
          transform: `rotateX(${mcp}deg)`,
          transformOrigin: "bottom center",
          perspective: "100px",
        }}
      >
        <div
          className="relative"
          style={{
            width,
            height: proximalH,
            background: "linear-gradient(135deg, #f5d5c8 0%, #e8c4b0 40%, #ddb49c 100%)",
            borderRadius: `${width * 0.35}px ${width * 0.35}px ${width * 0.25}px ${width * 0.25}px`,
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.12), inset 2px 0 4px rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.15)",
            border: "1px solid rgba(180,140,120,0.2)",
          }}
        >
          {/* Knuckle crease */}
          <div
            className="absolute w-full"
            style={{
              height: 2,
              bottom: 0,
              background: "linear-gradient(90deg, transparent 10%, rgba(139,90,70,0.3) 50%, transparent 90%)",
            }}
          />
          {/* Side shading */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.05) 100%)",
              borderRadius: "inherit",
            }}
          />
        </div>

        {/* Middle phalanx */}
        <div
          style={{
            transform: `rotateX(${pip}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="relative"
            style={{
              width: width * 0.95,
              height: middleH,
              marginLeft: width * 0.025,
              background: "linear-gradient(135deg, #f8ddd0 0%, #ecc8b5 40%, #e0b8a0 100%)",
              borderRadius: `${width * 0.3}px`,
              boxShadow: "inset -1px 0 3px rgba(0,0,0,0.1), inset 1px 0 3px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.12)",
              border: "1px solid rgba(180,140,120,0.15)",
            }}
          >
            {/* Joint crease */}
            <div
              className="absolute w-full"
              style={{
                height: 1.5,
                bottom: 0,
                background: "linear-gradient(90deg, transparent 15%, rgba(139,90,70,0.25) 50%, transparent 85%)",
              }}
            />
          </div>

          {/* Distal phalanx (fingertip) */}
          <div
            style={{
              transform: `rotateX(${dip}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="relative"
              style={{
                width: width * 0.88,
                height: distalH,
                marginLeft: width * 0.06,
                background: "linear-gradient(135deg, #fce8dc 0%, #f0d0c0 50%, #e4c0aa 100%)",
                borderRadius: `${width * 0.5}px ${width * 0.5}px ${width * 0.35}px ${width * 0.35}px`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)",
                border: "1px solid rgba(180,140,120,0.12)",
              }}
            >
              {/* Fingertip pad highlight */}
              <div
                className="absolute"
                style={{
                  width: "60%",
                  height: "40%",
                  bottom: "15%",
                  left: "20%",
                  background: "radial-gradient(ellipse, rgba(255,220,200,0.4) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
              
              {/* Fingernail */}
              <div
                className="absolute"
                style={{
                  width: nailW,
                  height: nailH,
                  top: 2,
                  left: (width * 0.88 - nailW) / 2,
                  background: "linear-gradient(180deg, #fce4e0 0%, #f5d0c8 40%, #efc4ba 100%)",
                  borderRadius: `${nailW * 0.35}px ${nailW * 0.35}px ${nailW * 0.15}px ${nailW * 0.15}px`,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 0.5px 1px rgba(0,0,0,0.1)",
                  border: "0.5px solid rgba(200,150,140,0.3)",
                }}
              >
                {/* Nail lunula (half-moon) */}
                <div
                  className="absolute"
                  style={{
                    width: nailW * 0.5,
                    height: nailH * 0.35,
                    bottom: 1,
                    left: nailW * 0.25,
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: `0 0 ${nailW * 0.25}px ${nailW * 0.25}px`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Anatomically correct thumb
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
  const proximalH = height * 0.55;
  const distalH = height * 0.45;
  const thumbW = width * 1.15;
  const nailW = thumbW * 0.65;
  const nailH = thumbW * 0.45;

  return (
    <div
      className="relative transition-all duration-300 ease-out"
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom right",
      }}
    >
      {/* Proximal phalanx */}
      <div
        style={{
          transform: `rotateX(${bend * 0.6}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="relative"
          style={{
            width: thumbW,
            height: proximalH,
            background: "linear-gradient(135deg, #f5d5c8 0%, #e8c4b0 40%, #ddb49c 100%)",
            borderRadius: `${thumbW * 0.4}px`,
            boxShadow: "inset -2px 0 5px rgba(0,0,0,0.12), inset 2px 0 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.15)",
            border: "1px solid rgba(180,140,120,0.2)",
          }}
        >
          {/* Thumb crease */}
          <div
            className="absolute w-full"
            style={{
              height: 2,
              bottom: 0,
              background: "linear-gradient(90deg, transparent 5%, rgba(139,90,70,0.35) 50%, transparent 95%)",
            }}
          />
        </div>

        {/* Distal phalanx */}
        <div
          style={{
            transform: `rotateX(${bend * 0.4}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="relative"
            style={{
              width: thumbW * 0.92,
              height: distalH,
              marginLeft: thumbW * 0.04,
              background: "linear-gradient(135deg, #fce8dc 0%, #f0d0c0 50%, #e4c0aa 100%)",
              borderRadius: `${thumbW * 0.5}px ${thumbW * 0.5}px ${thumbW * 0.35}px ${thumbW * 0.35}px`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)",
              border: "1px solid rgba(180,140,120,0.12)",
            }}
          >
            {/* Thumb pad highlight */}
            <div
              className="absolute"
              style={{
                width: "55%",
                height: "35%",
                bottom: "20%",
                left: "22%",
                background: "radial-gradient(ellipse, rgba(255,220,200,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            
            {/* Thumbnail */}
            <div
              className="absolute"
              style={{
                width: nailW,
                height: nailH,
                top: 2,
                left: (thumbW * 0.92 - nailW) / 2,
                background: "linear-gradient(180deg, #fce4e0 0%, #f5d0c8 40%, #efc4ba 100%)",
                borderRadius: `${nailW * 0.4}px ${nailW * 0.4}px ${nailW * 0.15}px ${nailW * 0.15}px`,
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 0.5px 1px rgba(0,0,0,0.1)",
                border: "0.5px solid rgba(200,150,140,0.3)",
              }}
            >
              {/* Nail lunula */}
              <div
                className="absolute"
                style={{
                  width: nailW * 0.45,
                  height: nailH * 0.35,
                  bottom: 1,
                  left: nailW * 0.275,
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: `0 0 ${nailW * 0.22}px ${nailW * 0.22}px`,
                }}
              />
            </div>
          </div>
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
    sm: { container: "w-36 h-64", fingerW: 13, fingerH: 48, thumbH: 34, palmW: 52, palmH: 56, wristW: 42, wristH: 20, armW: 36, armH: 36 },
    md: { container: "w-48 h-80", fingerW: 16, fingerH: 62, thumbH: 44, palmW: 66, palmH: 72, wristW: 54, wristH: 24, armW: 44, armH: 44 },
    lg: { container: "w-60 h-[26rem]", fingerW: 20, fingerH: 78, thumbH: 56, palmW: 84, palmH: 92, wristW: 68, wristH: 30, armW: 54, armH: 52 },
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
        return { height: baseHeight * 0.35, opacity: 0.9, bend: 80 };
      case "bent":
        return { height: baseHeight * 0.72, opacity: 0.95, bend: 42 };
      case "out":
        return { height: baseHeight * 0.88, opacity: 1, bend: 12 };
      default:
        return { height: baseHeight, opacity: 1, bend: 0 };
    }
  };

  const getThumbProps = (state: string, baseHeight: number) => {
    switch (state) {
      case "up":
        return { height: baseHeight, opacity: 1, bend: 0, rotation: -28 };
      case "out":
        return { height: baseHeight, opacity: 1, bend: 8, rotation: -55 };
      case "across":
        return { height: baseHeight * 0.78, opacity: 0.92, bend: 22, rotation: 18 };
      case "tucked":
        return { height: baseHeight * 0.52, opacity: 0.75, bend: 48, rotation: 42 };
      default:
        return { height: baseHeight, opacity: 1, bend: 0, rotation: -28 };
    }
  };

  const indexProps = getFingerProps(fingers.index, dims.fingerH);
  const middleProps = getFingerProps(fingers.middle, dims.fingerH * 1.08);
  const ringProps = getFingerProps(fingers.ring, dims.fingerH * 0.97);
  const pinkyProps = getFingerProps(fingers.pinky === "out" ? "out" : fingers.pinky, dims.fingerH * 0.82);
  const thumbProps = getThumbProps(fingers.thumb, dims.thumbH);

  const handBottom = dims.armH + dims.wristH;

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
      {/* Drop shadow under hand */}
      <div
        className="absolute"
        style={{
          width: dims.palmW * 0.8,
          height: 12,
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      />

      {/* Arm base */}
      <div
        className="absolute"
        style={{
          width: dims.armW,
          height: dims.armH,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, #d8a890 0%, #cc9680 30%, #c48c72 100%)",
          borderRadius: "12% 12% 0 0",
          boxShadow: "inset -3px 0 6px rgba(0,0,0,0.08), inset 3px 0 4px rgba(255,255,255,0.08)",
          border: "1px solid rgba(160,100,80,0.2)",
          borderBottom: "none",
        }}
      >
        {/* Arm highlight */}
        <div 
          className="absolute"
          style={{
            width: "30%",
            height: "100%",
            left: "35%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            borderRadius: "inherit",
          }}
        />
        {/* Tendon lines */}
        <div className="absolute w-full h-full opacity-20">
          <div className="absolute" style={{ width: 1, height: "70%", top: "15%", left: "30%", background: "linear-gradient(180deg, transparent, rgba(100,60,40,0.3), transparent)" }} />
          <div className="absolute" style={{ width: 1, height: "70%", top: "15%", left: "50%", background: "linear-gradient(180deg, transparent, rgba(100,60,40,0.3), transparent)" }} />
          <div className="absolute" style={{ width: 1, height: "70%", top: "15%", left: "70%", background: "linear-gradient(180deg, transparent, rgba(100,60,40,0.3), transparent)" }} />
        </div>
      </div>

      {/* Wrist */}
      <div
        className="absolute"
        style={{
          width: dims.wristW,
          height: dims.wristH,
          bottom: dims.armH - 3,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, #e4b8a0 0%, #d8a890 50%, #d0a085 100%)",
          borderRadius: "22% 22% 18% 18%",
          boxShadow: "inset -2px 0 5px rgba(0,0,0,0.06), inset 2px 0 3px rgba(255,255,255,0.1)",
          border: "1px solid rgba(160,100,80,0.15)",
        }}
      >
        {/* Wrist bones (ulna/radius) */}
        <div 
          className="absolute rounded-full"
          style={{
            width: dims.wristW * 0.18,
            height: dims.wristH * 0.6,
            left: dims.wristW * 0.12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "radial-gradient(ellipse, rgba(180,120,100,0.25) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: dims.wristW * 0.18,
            height: dims.wristH * 0.6,
            right: dims.wristW * 0.12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "radial-gradient(ellipse, rgba(180,120,100,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Wrist crease */}
        <div
          className="absolute w-full"
          style={{
            height: 1.5,
            top: "75%",
            background: "linear-gradient(90deg, transparent 10%, rgba(139,90,70,0.2) 50%, transparent 90%)",
          }}
        />
      </div>

      {/* Palm */}
      <div
        className="absolute"
        style={{
          width: dims.palmW,
          height: dims.palmH,
          bottom: handBottom - 6,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(145deg, #f0caba 0%, #e8beac 25%, #daa892 60%, #d0a085 100%)",
          borderRadius: "38% 38% 48% 48%",
          boxShadow: "inset -4px 0 8px rgba(0,0,0,0.06), inset 4px 0 6px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid rgba(160,100,80,0.2)",
        }}
      >
        {/* Palm lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: 0.18 }}
        >
          {/* Heart line */}
          <path
            d="M 18 28 Q 35 24 52 26 Q 70 28 82 35"
            stroke="#8B5A46"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Head line */}
          <path
            d="M 20 45 Q 40 42 55 44 Q 72 46 78 50"
            stroke="#8B5A46"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
          {/* Life line */}
          <path
            d="M 25 25 Q 22 40 24 55 Q 28 72 35 82"
            stroke="#8B5A46"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Fate line */}
          <path
            d="M 50 85 Q 48 70 50 55 Q 52 45 50 38"
            stroke="#8B5A46"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Thenar eminence (thumb muscle) */}
        <div 
          className="absolute"
          style={{
            width: dims.palmW * 0.42,
            height: dims.palmH * 0.38,
            left: -3,
            bottom: dims.palmH * 0.22,
            background: "radial-gradient(ellipse at 30% 50%, rgba(220,160,140,0.4) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
        
        {/* Hypothenar (pinky side muscle) */}
        <div 
          className="absolute"
          style={{
            width: dims.palmW * 0.3,
            height: dims.palmH * 0.32,
            right: -2,
            bottom: dims.palmH * 0.25,
            background: "radial-gradient(ellipse at 70% 50%, rgba(200,140,120,0.25) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* Knuckle bumps at top */}
        <div className="absolute w-full flex justify-center" style={{ top: -2, gap: dims.fingerW * 0.2 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: dims.fingerW * 0.9,
                height: dims.fingerW * 0.5,
                background: "radial-gradient(ellipse at 50% 80%, rgba(200,140,120,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumb */}
      <div
        className="absolute"
        style={{
          bottom: handBottom + dims.palmH * 0.38,
          left: `calc(50% - ${dims.palmW / 2 + 6}px)`,
        }}
      >
        <Thumb
          height={thumbProps.height}
          width={dims.fingerW * 1.25}
          opacity={thumbProps.opacity}
          bend={thumbProps.bend}
          rotation={thumbProps.rotation}
        />
      </div>

      {/* Fingers container */}
      <div
        className="absolute flex items-end justify-center"
        style={{
          bottom: handBottom + dims.palmH - 5,
          left: "50%",
          transform: "translateX(-50%)",
          gap: dims.fingerW * 0.15,
        }}
      >
        {/* Index finger */}
        <Finger
          height={indexProps.height}
          width={dims.fingerW}
          opacity={indexProps.opacity}
          bend={indexProps.bend}
          rotation={-3}
        />
        {/* Middle finger (tallest) */}
        <Finger
          height={middleProps.height}
          width={dims.fingerW * 1.02}
          opacity={middleProps.opacity}
          bend={middleProps.bend}
          rotation={0}
        />
        {/* Ring finger */}
        <Finger
          height={ringProps.height}
          width={dims.fingerW * 0.98}
          opacity={ringProps.opacity}
          bend={ringProps.bend}
          rotation={2}
        />
        {/* Pinky finger (smallest) */}
        <Finger
          height={pinkyProps.height}
          width={dims.fingerW * 0.82}
          opacity={pinkyProps.opacity}
          bend={pinkyProps.bend}
          rotation={5}
        />
      </div>

      {/* Letter indicator badge - positioned below with proper spacing */}
      {letter && letter !== " " && (
        <div 
          className="absolute px-4 py-2 rounded-xl shadow-xl z-50"
          style={{
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.9) 100%)",
            border: "2px solid hsl(var(--primary-foreground) / 0.3)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <span className="text-base font-bold text-primary-foreground tracking-wide">{letter}</span>
        </div>
      )}
    </div>
  );
}
