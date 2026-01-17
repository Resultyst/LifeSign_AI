import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { SignAvatar } from "@/components/ui/SignAvatar";
import { SignLanguageSelector, SignLanguage } from "@/components/ui/SignLanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Pill,
  Gauge,
  Clock,
  Wind,
  Heart,
  Thermometer,
  Send,
  Mic,
  X,
} from "lucide-react";

interface StaffModeScreenProps {
  onBack: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

const emergencyPhrases = [
  { id: "pain-location", label: "Where is the pain?", icon: MapPin },
  { id: "allergies", label: "Any medication allergies?", icon: Pill, critical: true },
  { id: "pain-scale", label: "Rate pain 1-10", icon: Gauge },
  { id: "when-started", label: "When did this start?", icon: Clock },
  { id: "breathing", label: "Trouble breathing?", icon: Wind, critical: true },
  { id: "chest-pain", label: "Chest pain?", icon: Heart, critical: true },
  { id: "fever", label: "Do you have a fever?", icon: Thermometer },
];

export function StaffModeScreen({
  onBack,
  isHighContrast,
  onToggleHighContrast,
}: StaffModeScreenProps) {
  const [signLanguage, setSignLanguage] = useState<SignLanguage>("ASL");
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const sendMessage = (message: string) => {
    setIsAnimating(true);
    setCurrentMessage(message);

    // Simulate avatar animation duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };

  const handlePhraseClick = (phrase: string) => {
    sendMessage(phrase);
  };

  const handleCustomSend = () => {
    if (customInput.trim()) {
      sendMessage(customInput.trim());
      setCustomInput("");
    }
  };

  const clearMessage = () => {
    setCurrentMessage(null);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Medical Staff Mode"
        subtitle="Communicate with patient"
        onBack={onBack}
        showAccessibility
        onToggleHighContrast={onToggleHighContrast}
        isHighContrast={isHighContrast}
      />

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Language Selector */}
        <SignLanguageSelector value={signLanguage} onChange={setSignLanguage} />

        {/* Avatar Display */}
        {currentMessage ? (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header mb-0">Showing to Patient</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessage}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
            <SignAvatar message={currentMessage} isAnimating={isAnimating} />
          </div>
        ) : (
          <div className="p-6 bg-muted/50 rounded-2xl text-center">
            <p className="text-muted-foreground">
              Select a question below or type a custom message
            </p>
          </div>
        )}

        {/* Quick Phrases */}
        <section>
          <h2 className="section-header">Emergency Questions</h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyPhrases.map((phrase) => (
              <QuickActionButton
                key={phrase.id}
                label={phrase.label}
                icon={phrase.icon}
                variant={phrase.critical ? "critical" : "default"}
                onClick={() => handlePhraseClick(phrase.label)}
              />
            ))}
          </div>
        </section>

        {/* Custom Input */}
        <section>
          <h2 className="section-header">Custom Message</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your question..."
                className="h-14 text-base pr-12"
                onKeyDown={(e) => e.key === "Enter" && handleCustomSend()}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                aria-label="Voice input (simulated)"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <Button
              onClick={handleCustomSend}
              disabled={!customInput.trim()}
              className="h-14 px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Note */}
        <p className="text-xs text-center text-muted-foreground px-4">
          The avatar will display the message in {signLanguage}.
          <br />
          Show the screen to the patient.
        </p>
      </div>
    </div>
  );
}
