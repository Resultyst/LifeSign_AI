import { SAMPLE_SIGNS } from "@/lib/signLanguageDetection";
import { cn } from "@/lib/utils";
import { ThumbsUp, Hand, Pointer } from "lucide-react";

interface SampleSignsGuideProps {
  className?: string;
  compact?: boolean;
}

const signIcons: Record<string, React.ReactNode> = {
  thumbs_up: <ThumbsUp className="w-6 h-6" />,
  open_palm: <Hand className="w-6 h-6" />,
  pointing_up: <Pointer className="w-6 h-6" />,
};

export function SampleSignsGuide({ className, compact }: SampleSignsGuideProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Try These Sample Signs
      </h3>
      <div className={cn("grid gap-3", compact ? "grid-cols-3" : "grid-cols-1")}>
        {SAMPLE_SIGNS.map((sign) => (
          <div
            key={sign.id}
            className={cn(
              "p-3 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5",
              "flex items-center gap-3 transition-colors hover:border-primary/40"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {signIcons[sign.id] || <Hand className="w-6 h-6" />}
            </div>
            {!compact && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{sign.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {sign.description}
                </p>
                <p className="text-xs text-primary font-medium mt-1">
                  Meaning: "{sign.meaning}"
                </p>
              </div>
            )}
            {compact && (
              <div className="flex-1 min-w-0 text-center">
                <p className="font-semibold text-foreground text-xs">{sign.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
