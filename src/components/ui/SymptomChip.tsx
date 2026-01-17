import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SymptomChipProps {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  critical?: boolean;
  onToggle: () => void;
}

export function SymptomChip({
  label,
  icon: Icon,
  selected,
  critical = false,
  onToggle,
}: SymptomChipProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "symptom-chip touch-target",
        selected && (critical ? "critical" : "selected"),
        critical && !selected && "border-critical/40 text-critical"
      )}
      aria-pressed={selected}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </button>
  );
}
