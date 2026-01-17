import { useState, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CameraPreview } from "@/components/ui/CameraPreview";
import { SignLanguageSelector, SignLanguage } from "@/components/ui/SignLanguageSelector";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { PrivacyBanner } from "@/components/ui/PrivacyBanner";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw, Check, Hand } from "lucide-react";

interface PatientModeScreenProps {
  onBack: () => void;
  onGoToSymptoms: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

// Simulated AI responses
const simulatedResponses = [
  "I have pain in my chest",
  "I feel dizzy",
  "I cannot breathe well",
  "My stomach hurts",
  "I feel very tired",
  "I have a headache",
];

export function PatientModeScreen({
  onBack,
  onGoToSymptoms,
  isHighContrast,
  onToggleHighContrast,
}: PatientModeScreenProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [signLanguage, setSignLanguage] = useState<SignLanguage>("ASL");
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateRecognition = useCallback(() => {
    if (!cameraActive) return;

    setIsProcessing(true);
    setRecognizedText(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const randomText = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      setRecognizedText(randomText);
      setConfidence(randomConfidence);
      setIsProcessing(false);
      
      // Haptic feedback simulation (would use navigator.vibrate on real device)
      if (window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }
    }, 1500);
  }, [cameraActive]);

  const handleCameraToggle = () => {
    const newState = !cameraActive;
    setCameraActive(newState);
    
    if (newState) {
      // Auto-simulate recognition when camera turns on
      setTimeout(simulateRecognition, 2000);
    } else {
      setRecognizedText(null);
      setConfidence(0);
    }
  };

  const handleRetry = () => {
    setRecognizedText(null);
    simulateRecognition();
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
        {/* Instructions */}
        <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <Hand className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-lg font-semibold text-foreground mb-1">
            Sign here or point to symptoms
          </p>
          <p className="text-sm text-muted-foreground">
            The camera will recognize your signs and translate them
          </p>
        </div>

        {/* Language Selector */}
        <SignLanguageSelector value={signLanguage} onChange={setSignLanguage} />

        {/* Camera Preview */}
        <CameraPreview
          isActive={cameraActive}
          onToggle={handleCameraToggle}
          className="mt-8 mb-8"
        />

        {/* Recognition Results */}
        {(isProcessing || recognizedText) && (
          <div className="space-y-4 animate-fade-in mt-8">
            {isProcessing ? (
              <div className="p-6 bg-muted rounded-2xl text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-medium">Processing signs...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            ) : recognizedText && (
              <>
                <div className="p-5 bg-card border-2 border-primary rounded-2xl shadow-sm">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">
                    Recognized ({signLanguage})
                  </p>
                  <p className="text-xl font-bold leading-relaxed">{recognizedText}</p>
                </div>

                <ConfidenceIndicator confidence={confidence} label="Recognition Confidence" />

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
                    Correct
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Alternative: Point to symptoms */}
        {!cameraActive && !recognizedText && (
          <Button
            variant="outline"
            className="w-full h-14 text-base mt-4"
            onClick={onGoToSymptoms}
          >
            Or point to symptoms instead
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {/* Privacy Banner */}
        <div className="pt-4">
          <PrivacyBanner />
        </div>
      </div>
    </div>
  );
}
