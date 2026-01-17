import { cn } from "@/lib/utils";

export type BodyPart =
  | "head"
  | "chest"
  | "abdomen"
  | "left-arm"
  | "right-arm"
  | "left-leg"
  | "right-leg"
  | "back";

interface BodyDiagramProps {
  selectedParts: BodyPart[];
  onTogglePart: (part: BodyPart) => void;
}

const bodyParts: { id: BodyPart; label: string; position: string }[] = [
  { id: "head", label: "Head", position: "top-[5%] left-1/2 -translate-x-1/2 w-14 h-14" },
  { id: "chest", label: "Chest", position: "top-[22%] left-1/2 -translate-x-1/2 w-20 h-14" },
  { id: "abdomen", label: "Abdomen", position: "top-[40%] left-1/2 -translate-x-1/2 w-16 h-16" },
  { id: "left-arm", label: "Left Arm", position: "top-[25%] left-[15%] w-10 h-24" },
  { id: "right-arm", label: "Right Arm", position: "top-[25%] right-[15%] w-10 h-24" },
  { id: "left-leg", label: "Left Leg", position: "top-[60%] left-[30%] w-12 h-28" },
  { id: "right-leg", label: "Right Leg", position: "top-[60%] right-[30%] w-12 h-28" },
];

export function BodyDiagram({ selectedParts, onTogglePart }: BodyDiagramProps) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-[1/1.6]">
      {/* Body Silhouette Background */}
      <svg
        viewBox="0 0 100 160"
        className="w-full h-full text-muted fill-current"
        aria-hidden="true"
      >
        {/* Head */}
        <circle cx="50" cy="15" r="12" />
        {/* Neck */}
        <rect x="46" y="26" width="8" height="8" />
        {/* Torso */}
        <path d="M30 34 L70 34 L68 90 L32 90 Z" />
        {/* Left Arm */}
        <path d="M30 34 L20 38 L15 75 L22 76 L26 45 L30 42 Z" />
        {/* Right Arm */}
        <path d="M70 34 L80 38 L85 75 L78 76 L74 45 L70 42 Z" />
        {/* Left Leg */}
        <path d="M32 90 L35 150 L45 150 L48 90 Z" />
        {/* Right Leg */}
        <path d="M52 90 L55 150 L65 150 L68 90 Z" />
      </svg>

      {/* Touch Targets */}
      {bodyParts.map((part) => (
        <button
          key={part.id}
          onClick={() => onTogglePart(part.id)}
          className={cn(
            "body-touch-area",
            part.position,
            selectedParts.includes(part.id) && "selected animate-pulse-soft"
          )}
          aria-label={`${part.label}${selectedParts.includes(part.id) ? " (selected)" : ""}`}
          aria-pressed={selectedParts.includes(part.id)}
        />
      ))}

      {/* Selection Legend */}
      {selectedParts.length > 0 && (
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="inline-flex flex-wrap justify-center gap-1.5">
            {selectedParts.map((part) => (
              <span
                key={part}
                className="px-2 py-1 bg-critical/10 text-critical text-xs font-medium rounded-md capitalize"
              >
                {part.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
