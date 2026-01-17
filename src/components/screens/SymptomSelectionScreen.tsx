import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PainScale } from "@/components/ui/PainScale";
import { BodyDiagram, BodyPart } from "@/components/ui/BodyDiagram";
import { SymptomChip } from "@/components/ui/SymptomChip";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Wind,
  Thermometer,
  Droplets,
  AlertCircle,
  Pill,
  Check,
} from "lucide-react";

interface SymptomSelectionScreenProps {
  onBack: () => void;
  onConfirm: (data: SymptomData) => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

export interface SymptomData {
  painLevel: number | null;
  bodyParts: BodyPart[];
  symptoms: string[];
}

const criticalSymptoms = [
  { id: "chest-pain", label: "Chest Pain", icon: Heart, critical: true },
  { id: "breathing", label: "Trouble Breathing", icon: Wind, critical: true },
  { id: "unconscious", label: "Losing Consciousness", icon: AlertCircle, critical: true },
];

const commonSymptoms = [
  { id: "fever", label: "Fever", icon: Thermometer, critical: false },
  { id: "bleeding", label: "Bleeding", icon: Droplets, critical: false },
  { id: "dizziness", label: "Dizziness", icon: AlertCircle, critical: false },
  { id: "allergies", label: "Allergies", icon: Pill, critical: false },
  { id: "nausea", label: "Nausea", icon: AlertCircle, critical: false },
];

export function SymptomSelectionScreen({
  onBack,
  onConfirm,
  isHighContrast,
  onToggleHighContrast,
}: SymptomSelectionScreenProps) {
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const hasCriticalSymptom = selectedSymptoms.some((s) =>
    criticalSymptoms.some((cs) => cs.id === s)
  );

  const toggleBodyPart = (part: BodyPart) => {
    setSelectedBodyParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm({
      painLevel,
      bodyParts: selectedBodyParts,
      symptoms: selectedSymptoms,
    });
  };

  const hasSelection = painLevel !== null || selectedBodyParts.length > 0 || selectedSymptoms.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Select Symptoms"
        subtitle="Tap to select what you're experiencing"
        onBack={onBack}
        showAccessibility
        onToggleHighContrast={onToggleHighContrast}
        isHighContrast={isHighContrast}
      />

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-8 pb-32">
        {/* Critical Symptoms Warning */}
        {hasCriticalSymptom && (
          <div className="p-4 bg-critical/10 border-2 border-critical rounded-2xl animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-critical flex-shrink-0 animate-pulse-soft" />
              <div>
                <p className="font-bold text-critical">Critical Symptoms Detected</p>
                <p className="text-sm text-critical/80">
                  Medical staff will be alerted immediately
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pain Scale */}
        <section>
          <h2 className="section-header">Rate Your Pain</h2>
          <PainScale value={painLevel} onChange={setPainLevel} />
        </section>

        {/* Body Diagram */}
        <section>
          <h2 className="section-header">Where Does It Hurt?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tap on the body to select affected areas
          </p>
          <BodyDiagram
            selectedParts={selectedBodyParts}
            onTogglePart={toggleBodyPart}
          />
        </section>

        {/* Critical Symptoms */}
        <section className="pt-8">
          <h2 className="section-header flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-critical" />
            Critical Symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {criticalSymptoms.map((symptom) => (
              <SymptomChip
                key={symptom.id}
                label={symptom.label}
                icon={symptom.icon}
                selected={selectedSymptoms.includes(symptom.id)}
                critical={symptom.critical}
                onToggle={() => toggleSymptom(symptom.id)}
              />
            ))}
          </div>
        </section>

        {/* Common Symptoms */}
        <section>
          <h2 className="section-header">Other Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <SymptomChip
                key={symptom.id}
                label={symptom.label}
                icon={symptom.icon}
                selected={selectedSymptoms.includes(symptom.id)}
                critical={symptom.critical}
                onToggle={() => toggleSymptom(symptom.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-area-inset">
        <div className="max-w-lg mx-auto">
          <Button
            className={`w-full h-16 text-lg font-bold ${
              hasCriticalSymptom
                ? "bg-critical hover:bg-critical/90"
                : "bg-primary hover:bg-primary/90"
            }`}
            onClick={handleConfirm}
            disabled={!hasSelection}
          >
            <Check className="w-6 h-6 mr-2" />
            {hasCriticalSymptom ? "Alert Medical Staff Now" : "Confirm Symptoms"}
          </Button>
        </div>
      </div>
    </div>
  );
}
