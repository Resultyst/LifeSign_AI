import { useState, useCallback, useRef, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CameraPreview, CameraPreviewHandle } from "@/components/ui/CameraPreview";
import { SignLanguageSelector, SignLanguage } from "@/components/ui/SignLanguageSelector";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { PrivacyBanner } from "@/components/ui/PrivacyBanner";
import { SampleSignsGuide } from "@/components/ui/SampleSignsGuide";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  RefreshCw,
  Check,
  Hand,
  Loader2,
  Sparkles,
  AlertTriangle,
  HeartCrack,
  Stethoscope,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSignLanguageDetection } from "@/hooks/useSignLanguageDetection";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";
import { DetectedSign } from "@/lib/signLanguageDetection";
import { cn } from "@/lib/utils";

interface PatientModeScreenProps {
  onBack: () => void;
  onGoToSymptoms: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

export function PatientModeScreen({
  onBack,
  onGoToSymptoms,
  isHighContrast,
  onToggleHighContrast,
}: PatientModeScreenProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [signLanguage, setSignLanguage] = useState<SignLanguage>("ASL");
  const [confirmedSign, setConfirmedSign] = useState<DetectedSign | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const cameraRef = useRef<CameraPreviewHandle>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // Voice announcement hook
  const { announceSign, cancel: cancelVoice, isSupported: voiceSupported } = useVoiceAnnouncement({
    enabled: voiceEnabled,
  });

  // Update video element reference when camera becomes active
  useEffect(() => {
    if (cameraActive && cameraRef.current) {
      // Small delay to ensure video is mounted
      const timer = setTimeout(() => {
        setVideoElement(cameraRef.current?.getVideoElement() || null);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setVideoElement(null);
    }
  }, [cameraActive]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  videoRef.current = videoElement;

  const handleSignDetected = useCallback((sign: DetectedSign) => {
    // Only set if confidence is high enough
    if (sign.confidence >= 70) {
      setConfirmedSign(sign);
      // Announce the sign via voice
      announceSign(sign.name, sign.meaning, sign.category);
    }
  }, [announceSign]);

  const {
    isInitializing,
    isDetecting,
    error: detectionError,
    currentSign,
  } = useSignLanguageDetection({
    videoRef,
    isActive: cameraActive && !!videoElement,
    onSignDetected: handleSignDetected,
  });

  const handleCameraToggle = () => {
    const newState = !cameraActive;
    setCameraActive(newState);
    if (!newState) {
      setConfirmedSign(null);
      cancelVoice();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled((prev) => !prev);
  };

  const handleRetry = () => {
    setConfirmedSign(null);
  };

  const getStatusMessage = () => {
    if (isInitializing) return "Loading AI model...";
    if (detectionError) return "Detection error";
    if (currentSign) return `Detected: ${currentSign.name}`;
    if (isDetecting) return "Show a sign...";
    return "Position hands in frame";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Patient Mode"
        subtitle="Sign or point to symptoms"
        onBack={onBack}
        showAccessibility
        onToggleHighContrast={onToggleHighContrast}
        isHighContrast={isHighContrast}
      />

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Instructions & Voice Toggle */}
        <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hand className="w-8 h-8 text-primary" />
            {voiceSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={cn(
                  "ml-2 h-8 px-2",
                  voiceEnabled ? "text-primary" : "text-muted-foreground"
                )}
                title={voiceEnabled ? "Voice announcements on" : "Voice announcements off"}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">
            Sign here or point to symptoms
          </p>
          <p className="text-sm text-muted-foreground">
            The camera will recognize your signs and translate them
            {voiceEnabled && voiceSupported && " (voice announcements on)"}
          </p>
        </div>

        {/* Language Selector */}
        <SignLanguageSelector value={signLanguage} onChange={setSignLanguage} />

        {/* Camera Preview */}
        <CameraPreview
          ref={cameraRef}
          isActive={cameraActive}
          onToggle={handleCameraToggle}
          className="mt-8 mb-8"
          statusMessage={getStatusMessage()}
        />

        {/* AI Loading Indicator */}
        {cameraActive && isInitializing && (
          <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-xl">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Loading sign language AI model...
            </span>
          </div>
        )}

        {/* Real-time Detection Display */}
        {cameraActive && isDetecting && currentSign && !confirmedSign && (
          <div
            className={cn(
              "animate-fade-in p-4 border-2 rounded-2xl",
              currentSign.category === "emergency"
                ? "bg-critical/10 border-critical/50"
                : currentSign.category === "medical"
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-primary/10 border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              {currentSign.category === "emergency" ? (
                <AlertTriangle className="w-6 h-6 text-critical animate-pulse" />
              ) : currentSign.category === "medical" ? (
                <HeartCrack className="w-6 h-6 text-amber-500" />
              ) : (
                <Sparkles className="w-6 h-6 text-primary" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {currentSign.name}
                  </p>
                  {currentSign.category === "emergency" && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-critical text-white rounded animate-pulse">
                      URGENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hold steady for confirmation...
                </p>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  currentSign.category === "emergency"
                    ? "text-critical"
                    : currentSign.category === "medical"
                    ? "text-amber-600"
                    : "text-primary"
                )}
              >
                {currentSign.confidence}%
              </span>
            </div>
          </div>
        )}

        {/* Confirmed Recognition Result */}
        {confirmedSign && (
          <div className="space-y-4 animate-fade-in mt-4">
            <div
              className={cn(
                "p-5 bg-card border-2 rounded-2xl shadow-sm",
                confirmedSign.category === "emergency"
                  ? "border-critical bg-critical/5"
                  : confirmedSign.category === "medical"
                  ? "border-amber-500 bg-amber-500/5"
                  : "border-success"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {confirmedSign.category === "emergency" ? (
                  <AlertTriangle className="w-5 h-5 text-critical" />
                ) : confirmedSign.category === "medical" ? (
                  <Stethoscope className="w-5 h-5 text-amber-600" />
                ) : (
                  <Check className="w-5 h-5 text-success" />
                )}
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Recognized Sign ({signLanguage})
                </p>
                {confirmedSign.category === "emergency" && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-critical text-white rounded">
                    EMERGENCY
                  </span>
                )}
                {confirmedSign.category === "medical" && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded">
                    MEDICAL
                  </span>
                )}
              </div>
              <p className="text-xl font-bold leading-relaxed">{confirmedSign.name}</p>
              <p className="text-base text-muted-foreground mt-1">
                → "{confirmedSign.meaning}"
              </p>
            </div>

            <ConfidenceIndicator
              confidence={confirmedSign.confidence}
              label="Recognition Confidence"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 text-base"
                onClick={handleRetry}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Button
                className="flex-1 h-14 text-base bg-success hover:bg-success/90"
                onClick={onGoToSymptoms}
              >
                <Check className="w-5 h-5 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Sample Signs Guide - shown when camera is off or no detection */}
        {!cameraActive && !confirmedSign && (
          <div className="space-y-4">
            <SampleSignsGuide />
            <Button
              variant="outline"
              className="w-full h-14 text-base"
              onClick={onGoToSymptoms}
            >
              Or point to symptoms instead
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Detection Error */}
        {detectionError && (
          <div className="p-4 bg-critical/10 border border-critical/30 rounded-xl">
            <p className="text-sm text-critical font-medium">{detectionError}</p>
          </div>
        )}

        {/* Privacy Banner */}
        <div className="pt-4">
          <PrivacyBanner />
        </div>
      </div>
    </div>
  );
}
