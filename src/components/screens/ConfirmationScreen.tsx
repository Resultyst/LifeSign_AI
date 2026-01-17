import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { SymptomData } from "@/components/screens/SymptomSelectionScreen";
import { Check, AlertTriangle, Home, ArrowLeft, Heart } from "lucide-react";

interface ConfirmationScreenProps {
  symptomData: SymptomData;
  recognizedText?: string;
  onBack: () => void;
  onGoHome: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

const symptomLabels: Record<string, string> = {
  "chest-pain": "Chest Pain",
  "breathing": "Trouble Breathing",
  "unconscious": "Losing Consciousness",
  "fever": "Fever",
  "bleeding": "Bleeding",
  "dizziness": "Dizziness",
  "allergies": "Allergies",
  "nausea": "Nausea",
};

const painDescriptions: Record<number, string> = {
  0: "No pain",
  1: "Very mild",
  2: "Mild",
  3: "Mild to moderate",
  4: "Moderate",
  5: "Moderate",
  6: "Moderate to severe",
  7: "Severe",
  8: "Very severe",
  9: "Extremely severe",
  10: "Worst possible pain",
};

export function ConfirmationScreen({
  symptomData,
  recognizedText,
  onBack,
  onGoHome,
  isHighContrast,
  onToggleHighContrast,
}: ConfirmationScreenProps) {
  const hasCritical = symptomData.symptoms.some((s) =>
    ["chest-pain", "breathing", "unconscious"].includes(s)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Information Sent"
        onBack={onBack}
        showAccessibility
        onToggleHighContrast={onToggleHighContrast}
        isHighContrast={isHighContrast}
      />

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Success Indicator */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              hasCritical ? "bg-critical/10" : "bg-success/10"
            }`}
          >
            {hasCritical ? (
              <AlertTriangle className="w-10 h-10 text-critical animate-pulse-soft" />
            ) : (
              <Check className="w-10 h-10 text-success" />
            )}
          </div>
          <h2 className="text-title mb-2">
            {hasCritical ? "Priority Alert Sent" : "Information Received"}
          </h2>
          <p className="text-muted-foreground">
            {hasCritical
              ? "Medical staff have been notified of your critical symptoms"
              : "Medical staff can now see your symptoms"}
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            What the system understood
          </h3>

          {/* Recognized Sign Language */}
          {recognizedText && (
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                From Sign Language
              </p>
              <p className="text-lg font-medium">"{recognizedText}"</p>
            </div>
          )}

          {/* Pain Level */}
          {symptomData.painLevel !== null && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pain Level</p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-xl ${
                    symptomData.painLevel >= 7
                      ? "bg-critical text-critical-foreground"
                      : symptomData.painLevel >= 4
                      ? "bg-urgent text-urgent-foreground"
                      : "bg-success text-success-foreground"
                  }`}
                >
                  {symptomData.painLevel}
                </span>
                <span className="font-medium">
                  {painDescriptions[symptomData.painLevel]}
                </span>
              </div>
            </div>
          )}

          {/* Body Parts */}
          {symptomData.bodyParts.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Affected Areas</p>
              <div className="flex flex-wrap gap-2">
                {symptomData.bodyParts.map((part) => (
                  <span
                    key={part}
                    className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium capitalize"
                  >
                    {part.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {symptomData.symptoms.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {symptomData.symptoms.map((symptom) => {
                  const isCritical = ["chest-pain", "breathing", "unconscious"].includes(symptom);
                  return (
                    <span
                      key={symptom}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        isCritical
                          ? "bg-critical/10 text-critical border border-critical/30"
                          : "bg-muted"
                      }`}
                    >
                      {symptomLabels[symptom] || symptom}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button
            variant="outline"
            className="w-full h-14 text-base"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Add More Information
          </Button>
          <Button
            className="w-full h-14 text-base"
            onClick={onGoHome}
          >
            <Home className="w-5 h-5 mr-2" />
            Done - Return Home
          </Button>
        </div>

        {/* Reassurance */}
        <p className="text-center text-sm text-muted-foreground mt-8 px-4">
          A medical professional will be with you shortly.
          <br />
          <span className="font-medium">You can show them this screen.</span>
        </p>
      </div>
    </div>
  );
}
