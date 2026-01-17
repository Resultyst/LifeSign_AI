import { Camera, Video, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraPreviewProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

export function CameraPreview({ isActive, onToggle, className }: CameraPreviewProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "camera-preview flex items-center justify-center transition-all duration-300",
          isActive && "border-primary border-solid bg-foreground/10"
        )}
      >
        {isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            {/* Simulated camera feed placeholder */}
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
              <Hand className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-center text-sm font-medium text-muted-foreground">
              Camera feed active
            </p>
            <p className="text-center text-xs text-muted-foreground/70">
              Position your hands in frame
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Tap to start camera
            </p>
          </div>
        )}

        {/* Recording indicator */}
        {isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-critical/90 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold text-white uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute -bottom-4 left-1/2 -translate-x-1/2",
          "flex items-center justify-center w-16 h-16 rounded-full shadow-lg",
          "transition-all duration-200 active:scale-95",
          isActive
            ? "bg-critical text-critical-foreground"
            : "bg-primary text-primary-foreground"
        )}
        aria-label={isActive ? "Stop camera" : "Start camera"}
      >
        <Video className="w-7 h-7" strokeWidth={2} />
      </button>
    </div>
  );
}
