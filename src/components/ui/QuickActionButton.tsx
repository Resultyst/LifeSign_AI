import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  variant?: "default" | "critical" | "urgent";
  onClick: () => void;
  className?: string;
}

export function QuickActionButton({
  label,
  icon: Icon,
  variant = "default",
  onClick,
  className,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("quick-action touch-target-large", variant, className)}
    >
      <Icon className="w-7 h-7" strokeWidth={2} />
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  );
}
