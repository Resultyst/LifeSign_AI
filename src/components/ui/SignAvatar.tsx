import { User, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignAvatarProps {
  message?: string;
  isAnimating?: boolean;
  className?: string;
}

export function SignAvatar({ message, isAnimating = false, className }: SignAvatarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Avatar Display */}
      <div className="avatar-display flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6">
          {/* Placeholder Avatar */}
          <div
            className={cn(
              "w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center",
              isAnimating && "animate-pulse-soft"
            )}
          >
            <User className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>

          {isAnimating ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">Signing...</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Avatar will sign the message here
            </p>
          )}
        </div>

        {/* Simulated AI badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-primary/10 rounded-md">
          <span className="text-2xs font-semibold text-primary uppercase tracking-wide">
            AI Avatar
          </span>
        </div>
      </div>

      {/* Subtitle Display */}
      {message && (
        <div className="p-4 bg-muted rounded-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="text-lg font-medium leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
