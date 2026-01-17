import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  label?: string;
}

export function ConfidenceIndicator({ confidence, label }: ConfidenceIndicatorProps) {
  const getColor = () => {
    if (confidence >= 80) return "bg-success";
    if (confidence >= 60) return "bg-accent";
    if (confidence >= 40) return "bg-urgent";
    return "bg-critical";
  };

  const getLabel = () => {
    if (confidence >= 80) return "High confidence";
    if (confidence >= 60) return "Good confidence";
    if (confidence >= 40) return "Low confidence";
    return "Very low confidence";
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{confidence}%</span>
        </div>
      )}
      <div className="confidence-bar">
        <div
          className={cn("confidence-bar-fill", getColor())}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{getLabel()}</p>
    </div>
  );
}
