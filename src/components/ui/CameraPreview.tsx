import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Camera, Video, Hand, VideoOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DetectedSign } from "@/lib/signLanguageDetection";
import { GestureDetectionFeedback } from "./GestureDetectionFeedback";

interface CameraPreviewProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  showGuide?: boolean;
  statusMessage?: string;
  currentSign?: DetectedSign | null;
  isDetecting?: boolean;
}

export interface CameraPreviewHandle {
  getVideoElement: () => HTMLVideoElement | null;
}

export const CameraPreview = forwardRef<CameraPreviewHandle, CameraPreviewProps>(
  ({ isActive, onToggle, className, showGuide = true, statusMessage, currentSign, isDetecting }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Expose video element to parent
    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
    }));

    useEffect(() => {
      const startCamera = async () => {
        try {
          setError(null);
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });

          streamRef.current = stream;
          setHasPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
          setHasPermission(false);

          if (err instanceof Error) {
            if (err.name === "NotAllowedError") {
              setError(
                "Camera access denied. Please allow camera access to use sign language recognition."
              );
            } else if (err.name === "NotFoundError") {
              setError("No camera found. Please connect a camera device.");
            } else {
              setError("Unable to access camera. Please check your device settings.");
            }
          }
        }
      };

      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      if (isActive) {
        startCamera();
      } else {
        stopCamera();
        setHasPermission(null);
        setError(null);
      }

      return () => {
        stopCamera();
      };
    }, [isActive]);

    return (
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "camera-preview flex items-center justify-center transition-all duration-300 overflow-hidden",
            isActive && "border-primary border-solid bg-foreground/10"
          )}
        >
          {isActive ? (
            <>
              {/* Real camera feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "absolute inset-0 w-full h-full object-cover scale-x-[-1]",
                  (!hasPermission || error) && "hidden"
                )}
              />

              {/* Loading state while requesting permission */}
              {hasPermission === null && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 bg-background/80">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
                    <Camera className="w-16 h-16 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    Requesting camera access...
                  </p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 bg-background/80">
                  <div className="w-20 h-20 rounded-full bg-critical/10 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-critical" />
                  </div>
                  <p className="text-center text-sm font-medium text-critical max-w-[250px]">
                    {error}
                  </p>
                </div>
              )}

              {/* Gesture Detection Feedback Overlay */}
              {hasPermission && !error && isDetecting && currentSign && (
                <GestureDetectionFeedback
                  currentSign={currentSign}
                  isDetecting={isDetecting}
                />
              )}


              {/* Status message - always visible when camera active */}
              {hasPermission && !error && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full backdrop-blur-sm shadow-lg pointer-events-none z-10">
                  <Hand className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs font-medium text-foreground">
                    {statusMessage || "Position hands within the guides"}
                  </span>
                </div>
              )}
            </>
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
          {isActive && hasPermission && !error && (
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
          {isActive ? (
            <VideoOff className="w-7 h-7" strokeWidth={2} />
          ) : (
            <Video className="w-7 h-7" strokeWidth={2} />
          )}
        </button>
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";
