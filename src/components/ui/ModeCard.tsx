import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "patient" | "staff" | "emergency";
  onClick: () => void;
  className?: string;
}

export function ModeCard({
  title,
  description,
  icon: Icon,
  variant,
  onClick,
  className,
}: ModeCardProps) {
  const variantClasses = {
    patient: "mode-card-patient",
    staff: "mode-card-staff",
    emergency: "mode-card-emergency",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "mode-card w-full text-left touch-target-large",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-sm opacity-90 leading-relaxed">{description}</p>
        </div>
      </div>
      {variant === "emergency" && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wide">
            Urgent
          </span>
        </div>
      )}
    </button>
  );
}
