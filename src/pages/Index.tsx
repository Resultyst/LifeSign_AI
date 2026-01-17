import { useState, useEffect } from "react";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { PatientModeScreen } from "@/components/screens/PatientModeScreen";
import { SymptomSelectionScreen, SymptomData } from "@/components/screens/SymptomSelectionScreen";
import { ConfirmationScreen } from "@/components/screens/ConfirmationScreen";
import { StaffModeScreen } from "@/components/screens/StaffModeScreen";
import { EmergencyTriageScreen } from "@/components/screens/EmergencyTriageScreen";

type AppScreen =
  | "home"
  | "patient-camera"
  | "patient-symptoms"
  | "patient-confirmation"
  | "staff"
  | "emergency";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [symptomData, setSymptomData] = useState<SymptomData>({
    painLevel: null,
    bodyParts: [],
    symptoms: [],
  });
  const [recognizedText, setRecognizedText] = useState<string | undefined>();

  // Toggle high contrast mode
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  const handleModeSelect = (mode: "patient" | "staff" | "emergency") => {
    switch (mode) {
      case "patient":
        setCurrentScreen("patient-camera");
        break;
      case "staff":
        setCurrentScreen("staff");
        break;
      case "emergency":
        setCurrentScreen("emergency");
        break;
    }
  };

  const handleSymptomConfirm = (data: SymptomData) => {
    setSymptomData(data);
    setCurrentScreen("patient-confirmation");
  };

  const goHome = () => {
    setCurrentScreen("home");
    setSymptomData({ painLevel: null, bodyParts: [], symptoms: [] });
    setRecognizedText(undefined);
  };

  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);

  return (
    <div className="min-h-screen">
      {currentScreen === "home" && (
        <HomeScreen onSelectMode={handleModeSelect} />
      )}

      {currentScreen === "patient-camera" && (
        <PatientModeScreen
          onBack={goHome}
          onGoToSymptoms={() => setCurrentScreen("patient-symptoms")}
          isHighContrast={isHighContrast}
          onToggleHighContrast={toggleHighContrast}
        />
      )}

      {currentScreen === "patient-symptoms" && (
        <SymptomSelectionScreen
          onBack={() => setCurrentScreen("patient-camera")}
          onConfirm={handleSymptomConfirm}
          isHighContrast={isHighContrast}
          onToggleHighContrast={toggleHighContrast}
        />
      )}

      {currentScreen === "patient-confirmation" && (
        <ConfirmationScreen
          symptomData={symptomData}
          recognizedText={recognizedText}
          onBack={() => setCurrentScreen("patient-symptoms")}
          onGoHome={goHome}
          isHighContrast={isHighContrast}
          onToggleHighContrast={toggleHighContrast}
        />
      )}

      {currentScreen === "staff" && (
        <StaffModeScreen
          onBack={goHome}
          isHighContrast={isHighContrast}
          onToggleHighContrast={toggleHighContrast}
        />
      )}

      {currentScreen === "emergency" && (
        <EmergencyTriageScreen
          onBack={goHome}
          isHighContrast={isHighContrast}
          onToggleHighContrast={toggleHighContrast}
        />
      )}
    </div>
  );
};

export default Index;
