import { useState, useEffect, useRef } from "react";
import {
  signLanguageDetector,
  DetectedSign,
  SAMPLE_SIGNS,
  MedicalGesture,
} from "@/lib/signLanguageDetection";

interface UseSignLanguageDetectionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onSignDetected?: (sign: DetectedSign) => void;
}

export function useSignLanguageDetection({
  videoRef,
  isActive,
  onSignDetected,
}: UseSignLanguageDetectionOptions) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSign, setCurrentSign] = useState<DetectedSign | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<DetectedSign | null>(null);
  const stableDetectionCountRef = useRef(0);
  const lastTimestampRef = useRef(0);

  // Initialize the detector
  useEffect(() => {
    if (!isActive) return;

    const init = async () => {
      if (signLanguageDetector.isReady()) {
        setIsInitialized(true);
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        await signLanguageDetector.initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize sign language detector:", err);
        setError("Failed to load sign language detection. Please refresh and try again.");
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [isActive]);

  // Detection loop
  useEffect(() => {
    if (!isActive || !isInitialized || !videoRef.current) {
      setIsDetecting(false);
      return;
    }

    setIsDetecting(true);

    const detectLoop = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      const now = performance.now();
      // Throttle to ~15fps for detection
      if (now - lastTimestampRef.current < 66) {
        animationFrameRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      lastTimestampRef.current = now;

      const detected = signLanguageDetector.detectFromVideo(video, now);

      if (detected) {
        // Check if it's the same sign as before for stability
        if (
          lastDetectionRef.current &&
          lastDetectionRef.current.name === detected.name
        ) {
          stableDetectionCountRef.current++;
        } else {
          stableDetectionCountRef.current = 1;
          lastDetectionRef.current = detected;
        }

        // Only report stable detections (seen for at least 5 frames)
        if (stableDetectionCountRef.current >= 5) {
          setCurrentSign(detected);
          if (onSignDetected && stableDetectionCountRef.current === 5) {
            onSignDetected(detected);
            // Haptic feedback
            if (window.navigator.vibrate) {
              window.navigator.vibrate(100);
            }
          }
        }
      } else {
        // Reset if no detection
        if (stableDetectionCountRef.current > 0) {
          stableDetectionCountRef.current = 0;
          lastDetectionRef.current = null;
          // Clear current sign after a delay
          setTimeout(() => {
            if (stableDetectionCountRef.current === 0) {
              setCurrentSign(null);
            }
          }, 500);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    animationFrameRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsDetecting(false);
    };
  }, [isActive, isInitialized, videoRef, onSignDetected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isInitialized,
    isInitializing,
    isDetecting,
    error,
    currentSign,
    sampleSigns: SAMPLE_SIGNS as MedicalGesture[],
  };
}
