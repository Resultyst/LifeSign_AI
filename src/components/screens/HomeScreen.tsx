import { User, Stethoscope, AlertTriangle, Heart } from "lucide-react";
import { ModeCard } from "@/components/ui/ModeCard";
import { PrivacyBanner } from "@/components/ui/PrivacyBanner";

interface HomeScreenProps {
  onSelectMode: (mode: "patient" | "staff" | "emergency") => void;
}

export function HomeScreen({ onSelectMode }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <div className="flex flex-col px-4 py-6 max-w-lg mx-auto">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-display mb-2">LifeSign AI</h1>
          <p className="text-body-lg text-muted-foreground">
            Emergency communication made accessible
          </p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-4 mb-8">
          <ModeCard
            title="Patient Mode"
            description="Sign or point to symptoms. The app will translate for medical staff."
            icon={User}
            variant="patient"
            onClick={() => onSelectMode("patient")}
          />

          <ModeCard
            title="Medical Staff Mode"
            description="Ask questions quickly. The app will show signs to the patient."
            icon={Stethoscope}
            variant="staff"
            onClick={() => onSelectMode("staff")}
          />

          <ModeCard
            title="Emergency Quick Start"
            description="Critical triage questions. Get answers in under 2 minutes."
            icon={AlertTriangle}
            variant="emergency"
            onClick={() => onSelectMode("emergency")}
          />
        </div>

        {/* Privacy Banner */}
        <PrivacyBanner isOffline={true} />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Designed for accessibility in high-stress emergency situations.
          <br />
          No login required. Works offline.
        </p>
      </div>
    </div>
  );
}
