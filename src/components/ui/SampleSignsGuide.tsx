import { SAMPLE_SIGNS, MedicalGesture } from "@/lib/signLanguageDetection";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  Hand,
  AlertTriangle,
  HeartCrack,
  Wind,
  Pill,
  Loader,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";

interface SampleSignsGuideProps {
  className?: string;
  compact?: boolean;
  showCategories?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,
  hand: Hand,
  "alert-triangle": AlertTriangle,
  "heart-crack": HeartCrack,
  wind: Wind,
  pill: Pill,
  loader: Loader,
  "shield-alert": ShieldAlert,
};

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  emergency: {
    bg: "bg-critical/10",
    border: "border-critical/30",
    text: "text-critical",
  },
  medical: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600",
  },
  general: {
    bg: "bg-primary/5",
    border: "border-primary/20",
    text: "text-primary",
  },
};

const categoryLabels: Record<string, string> = {
  emergency: "🚨 Emergency",
  medical: "🏥 Medical",
  general: "👋 General",
};

export function SampleSignsGuide({
  className,
  compact,
  showCategories = true,
}: SampleSignsGuideProps) {
  // Group signs by category
  const groupedSigns = SAMPLE_SIGNS.reduce((acc, sign) => {
    const cat = sign.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sign);
    return acc;
  }, {} as Record<string, MedicalGesture[]>);

  const categoryOrder = ["emergency", "medical", "general"];

  const renderSign = (sign: MedicalGesture) => {
    const IconComponent = iconMap[sign.icon] || Hand;
    const colors = categoryColors[sign.category];

    return (
      <div
        key={sign.id}
        className={cn(
          "p-3 rounded-xl border-2 border-dashed transition-colors",
          colors.bg,
          colors.border,
          "hover:border-opacity-60"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              colors.bg,
              colors.text
            )}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          {!compact && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground text-sm">
                  {sign.name}
                </p>
                {sign.category === "emergency" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-critical text-white rounded">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sign.description}
              </p>
              <p className={cn("text-xs font-medium mt-1", colors.text)}>
                → "{sign.meaning}"
              </p>
            </div>
          )}
          {compact && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-xs truncate">
                {sign.name}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showCategories && !compact) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Medical Sign Guide
        </h3>

        {categoryOrder.map((category) => {
          const signs = groupedSigns[category];
          if (!signs || signs.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground">
                {categoryLabels[category]}
              </h4>
              <div className="grid gap-2">
                {signs.map((sign) => renderSign(sign))}
              </div>
            </div>
          );
        })}

        <div className="p-3 bg-muted/50 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Use <strong>both hands open</strong> for
            emergency help signal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Try These Signs
      </h3>
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1")}>
        {SAMPLE_SIGNS.slice(0, compact ? 4 : undefined).map((sign) =>
          renderSign(sign)
        )}
      </div>
    </div>
  );
}
