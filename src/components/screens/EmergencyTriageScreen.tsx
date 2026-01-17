import { useState, useEffect, useRef, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PainScale } from "@/components/ui/PainScale";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { SignAvatar } from "@/components/ui/SignAvatar";
import { CameraPreview, CameraPreviewHandle } from "@/components/ui/CameraPreview";
import { Button } from "@/components/ui/button";
import { signLanguageDetector } from "@/lib/signLanguageDetection";
import {
  Heart,
  Wind,
  Pill,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronRight,
  Check,
  Volume2,
  Camera,
  Hand,
} from "lucide-react";

interface EmergencyTriageScreenProps {
  onBack: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

type TriageStep = "pain" | "location" | "breathing" | "allergies" | "duration" | "complete";

const triageQuestions: Record<TriageStep, string> = {
  pain: "Rate your pain from 0 to 10",
  location: "Where is the pain?",
  breathing: "Are you having trouble breathing?",
  allergies: "Are you allergic to any medications?",
  duration: "When did this start?",
  complete: "",
};

export function EmergencyTriageScreen({
  onBack,
  isHighContrast,
  onToggleHighContrast,
}: EmergencyTriageScreenProps) {
  const [currentStep, setCurrentStep] = useState<TriageStep>("pain");
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isShowingAvatar, setIsShowingAvatar] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Sign language detection for pain rating
  const [useSignDetection, setUseSignDetection] = useState(false);
  const [detectedNumber, setDetectedNumber] = useState<number | null>(null);
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [stableCount, setStableCount] = useState(0);
  const lastDetectedRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cameraRef = useRef<CameraPreviewHandle>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize sign language detector when camera mode is enabled
  useEffect(() => {
    if (useSignDetection && !isDetectorReady) {
      signLanguageDetector.initialize().then(() => {
        setIsDetectorReady(true);
      });
    }
  }, [useSignDetection, isDetectorReady]);

  // Run finger count detection loop
  useEffect(() => {
    if (!useSignDetection || !isDetectorReady) {
      return;
    }

    const detectLoop = () => {
      const videoElement = cameraRef.current?.getVideoElement();
      if (videoElement && videoElement.readyState >= 2) {
        const result = signLanguageDetector.detectFingerCount(
          videoElement,
          performance.now()
        );
        
        if (result && result.numericValue !== undefined) {
          const num = result.numericValue;
          
          // Check stability - same number detected multiple times
          if (num === lastDetectedRef.current) {
            setStableCount((prev) => prev + 1);
          } else {
            setStableCount(0);
            lastDetectedRef.current = num;
          }
          
          setDetectedNumber(num);
          
          // Auto-confirm after stable detection (30 frames ≈ 0.5 seconds)
          if (stableCount >= 30 && num === lastDetectedRef.current) {
            setPainLevel(num);
            setStableCount(0);
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    animationFrameRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [useSignDetection, isDetectorReady, stableCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCritical =
    (painLevel !== null && painLevel >= 8) ||
    responses.breathing === "yes" ||
    responses.location === "chest";

  const handlePainConfirm = () => {
    if (painLevel !== null) {
      setUseSignDetection(false);
      setCurrentStep("location");
      setIsShowingAvatar(true);
    }
  };

  const handleLocationResponse = (location: string) => {
    setResponses((prev) => ({ ...prev, location }));
    setCurrentStep("breathing");
    setIsShowingAvatar(true);
  };

  const handleBreathingResponse = (answer: string) => {
    setResponses((prev) => ({ ...prev, breathing: answer }));
    setCurrentStep("allergies");
    setIsShowingAvatar(true);
  };

  const handleAllergiesResponse = (answer: string) => {
    setResponses((prev) => ({ ...prev, allergies: answer }));
    setCurrentStep("duration");
    setIsShowingAvatar(true);
  };

  const handleDurationResponse = (duration: string) => {
    setResponses((prev) => ({ ...prev, duration }));
    setCurrentStep("complete");
  };

  const getStepNumber = () => {
    const steps: TriageStep[] = ["pain", "location", "breathing", "allergies", "duration", "complete"];
    return steps.indexOf(currentStep) + 1;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Emergency Triage"
        subtitle={`Step ${getStepNumber()} of 5`}
        onBack={onBack}
        showAccessibility
        onToggleHighContrast={onToggleHighContrast}
        isHighContrast={isHighContrast}
      />

      {/* Timer & Status Bar */}
      <div className="sticky top-[57px] z-40 bg-background border-b border-border px-4 py-2">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
          </div>
          {isCritical && (
            <div className="flex items-center gap-2 px-3 py-1 bg-critical/10 rounded-full animate-pulse-soft">
              <AlertTriangle className="w-4 h-4 text-critical" />
              <span className="text-sm font-bold text-critical">Critical</span>
            </div>
          )}
          <div className="flex gap-1">
            {["pain", "location", "breathing", "allergies", "duration"].map((step, i) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  getStepNumber() > i + 1
                    ? "bg-success"
                    : getStepNumber() === i + 1
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {currentStep === "complete" ? (
          /* Complete Screen */
          <div className="text-center space-y-6 animate-fade-in">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                isCritical ? "bg-critical/10" : "bg-success/10"
              }`}
            >
              {isCritical ? (
                <AlertTriangle className="w-12 h-12 text-critical" />
              ) : (
                <Check className="w-12 h-12 text-success" />
              )}
            </div>
            <div>
              <h2 className="text-display mb-2">Triage Complete</h2>
              <p className="text-muted-foreground text-lg">
                Time: <strong className="text-foreground">{formatTime(elapsedTime)}</strong>
              </p>
            </div>

            {/* Summary */}
            <div className="text-left bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold">Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Pain Level</span>
                  <p className="font-bold text-lg">{painLevel}/10</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-bold text-lg capitalize">{responses.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Breathing Issue</span>
                  <p className="font-bold text-lg capitalize">{responses.breathing}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Allergies</span>
                  <p className="font-bold text-lg capitalize">{responses.allergies}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Started</span>
                <p className="font-bold capitalize">{responses.duration}</p>
              </div>
            </div>

            <Button className="w-full h-14 text-lg" onClick={onBack}>
              Done - Return to Home
            </Button>
          </div>
        ) : (
          /* Question Flow */
          <div className="space-y-6">
            {/* Avatar showing question */}
            {isShowingAvatar && currentStep !== "pain" && (
              <div className="mb-6 animate-fade-in">
                <SignAvatar
                  message={triageQuestions[currentStep]}
                  isAnimating={true}
                />
              </div>
            )}

            {/* Question Display */}
            <div className="text-center p-4 bg-primary/5 rounded-2xl">
              <Volume2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{triageQuestions[currentStep]}</p>
            </div>

            {/* Pain Scale */}
            {currentStep === "pain" && (
              <div className="space-y-6 animate-fade-in">
                {/* Toggle between manual and sign detection */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant={!useSignDetection ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseSignDetection(false)}
                  >
                    <Hand className="w-4 h-4 mr-2" />
                    Tap to Select
                  </Button>
                  <Button
                    variant={useSignDetection ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseSignDetection(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Show Fingers
                  </Button>
                </div>

                {useSignDetection ? (
                  <div className="space-y-4">
                    {/* Camera preview */}
                    <div className="relative">
                      <CameraPreview
                        ref={cameraRef}
                        isActive={true}
                        onToggle={() => setUseSignDetection(false)}
                        className="rounded-2xl overflow-hidden"
                      />
                      
                      {/* Detected number overlay */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">Detected:</span>
                          <span className="text-3xl font-bold text-primary">
                            {detectedNumber !== null ? detectedNumber : "—"}
                          </span>
                          {stableCount > 10 && detectedNumber !== null && (
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <p className="text-center text-sm text-muted-foreground">
                      Hold up fingers (0-10) to indicate pain level. Keep steady for auto-confirm.
                    </p>

                    {/* Selected pain level */}
                    {painLevel !== null && (
                      <div className="text-center p-3 bg-primary/10 rounded-xl animate-fade-in">
                        <span className="text-lg">Pain Level: <strong className="text-2xl">{painLevel}</strong>/10</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <PainScale value={painLevel} onChange={setPainLevel} />
                )}

                <Button
                  className="w-full h-14 text-lg"
                  onClick={handlePainConfirm}
                  disabled={painLevel === null}
                >
                  Confirm <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Location Selection */}
            {currentStep === "location" && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <QuickActionButton
                  label="Head"
                  icon={MapPin}
                  onClick={() => handleLocationResponse("head")}
                />
                <QuickActionButton
                  label="Chest"
                  icon={Heart}
                  variant="critical"
                  onClick={() => handleLocationResponse("chest")}
                />
                <QuickActionButton
                  label="Abdomen"
                  icon={MapPin}
                  onClick={() => handleLocationResponse("abdomen")}
                />
                <QuickActionButton
                  label="Arms/Legs"
                  icon={MapPin}
                  onClick={() => handleLocationResponse("limbs")}
                />
                <QuickActionButton
                  label="Back"
                  icon={MapPin}
                  onClick={() => handleLocationResponse("back")}
                  className="col-span-2"
                />
              </div>
            )}

            {/* Breathing */}
            {currentStep === "breathing" && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <Button
                  variant="outline"
                  className="h-20 text-lg font-bold border-2"
                  onClick={() => handleBreathingResponse("no")}
                >
                  No
                </Button>
                <Button
                  className="h-20 text-lg font-bold bg-critical hover:bg-critical/90"
                  onClick={() => handleBreathingResponse("yes")}
                >
                  <Wind className="w-6 h-6 mr-2" />
                  Yes
                </Button>
              </div>
            )}

            {/* Allergies */}
            {currentStep === "allergies" && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 text-lg font-bold border-2"
                    onClick={() => handleAllergiesResponse("no")}
                  >
                    No Allergies
                  </Button>
                  <Button
                    className="h-20 text-lg font-bold bg-urgent hover:bg-urgent/90"
                    onClick={() => handleAllergiesResponse("yes")}
                  >
                    <Pill className="w-6 h-6 mr-2" />
                    Yes
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => handleAllergiesResponse("unknown")}
                >
                  I don't know
                </Button>
              </div>
            )}

            {/* Duration */}
            {currentStep === "duration" && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <QuickActionButton
                  label="Just now"
                  icon={Clock}
                  onClick={() => handleDurationResponse("just now")}
                />
                <QuickActionButton
                  label="Minutes ago"
                  icon={Clock}
                  onClick={() => handleDurationResponse("minutes ago")}
                />
                <QuickActionButton
                  label="Hours ago"
                  icon={Clock}
                  onClick={() => handleDurationResponse("hours ago")}
                />
                <QuickActionButton
                  label="Days ago"
                  icon={Clock}
                  onClick={() => handleDurationResponse("days ago")}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
