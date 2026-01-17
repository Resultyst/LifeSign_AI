import { ArrowLeft, Settings, Sun, Moon, Contrast } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showAccessibility?: boolean;
  onToggleHighContrast?: () => void;
  isHighContrast?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  showAccessibility = true,
  onToggleHighContrast,
  isHighContrast,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors touch-target"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {showAccessibility && onToggleHighContrast && (
          <button
            onClick={onToggleHighContrast}
            className={cn(
              "p-2 rounded-xl transition-colors touch-target",
              isHighContrast
                ? "bg-foreground text-background"
                : "hover:bg-muted"
            )}
            aria-label={isHighContrast ? "Disable high contrast" : "Enable high contrast"}
            title="Toggle high contrast mode"
          >
            <Contrast className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
}
