import { cn } from "@/lib/utils";

interface PainScaleProps {
  value: number | null;
  onChange: (value: number) => void;
}

const painColors = [
  "bg-success text-success-foreground",
  "bg-success text-success-foreground",
  "bg-emerald-400 text-white",
  "bg-lime-400 text-foreground",
  "bg-yellow-400 text-foreground",
  "bg-amber-400 text-foreground",
  "bg-orange-400 text-white",
  "bg-orange-500 text-white",
  "bg-critical text-critical-foreground",
  "bg-red-600 text-white",
  "bg-red-700 text-white",
];

const painLabels = ["None", "", "", "Mild", "", "", "Moderate", "", "Severe", "", "Worst"];

export function PainScale({ value, onChange }: PainScaleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>No Pain</span>
        <span>Worst Pain</span>
      </div>
      <div className="grid grid-cols-11 gap-1.5">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={cn(
              "pain-scale-btn",
              value === i
                ? painColors[i] + " ring-2 ring-offset-2 ring-foreground/30 scale-110"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            aria-label={`Pain level ${i}${painLabels[i] ? ` - ${painLabels[i]}` : ""}`}
          >
            {i}
          </button>
        ))}
      </div>
      {value !== null && (
        <div className="text-center animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
            Selected: <strong className="text-foreground">{value}</strong>
            {painLabels[value] && (
              <span className="text-muted-foreground">({painLabels[value]})</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
