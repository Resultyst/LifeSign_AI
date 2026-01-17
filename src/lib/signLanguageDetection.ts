import {
  GestureRecognizer,
  FilesetResolver,
  GestureRecognizerResult,
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface DetectedSign {
  name: string;
  meaning: string;
  confidence: number;
  category?: "general" | "medical" | "emergency";
  icon?: string;
}

export interface MedicalGesture {
  id: string;
  name: string;
  meaning: string;
  description: string;
  category: "general" | "medical" | "emergency";
  icon: string;
}

// Sample signs users can try - including medical-specific ones
export const SAMPLE_SIGNS: MedicalGesture[] = [
  {
    id: "help",
    name: "Help / Emergency",
    meaning: "I need help immediately",
    description: "Wave both hands or show open palm repeatedly",
    category: "emergency",
    icon: "alert-triangle",
  },
  {
    id: "pain",
    name: "Pain",
    meaning: "I am in pain",
    description: "Make a fist and press it against your body",
    category: "medical",
    icon: "heart-crack",
  },
  {
    id: "cant_breathe",
    name: "Can't Breathe",
    meaning: "I'm having trouble breathing",
    description: "Point to your throat/chest with open hand",
    category: "emergency",
    icon: "wind",
  },
  {
    id: "medicine",
    name: "Medicine / Pills",
    meaning: "I need medicine / medication question",
    description: "Make pill-taking gesture (thumb to mouth)",
    category: "medical",
    icon: "pill",
  },
  {
    id: "yes",
    name: "Yes / Okay",
    meaning: "Yes / I understand / I'm okay",
    description: "Thumbs up gesture",
    category: "general",
    icon: "thumbs-up",
  },
  {
    id: "no",
    name: "No / Problem",
    meaning: "No / Not good / I have a problem",
    description: "Thumbs down or shake head",
    category: "general",
    icon: "thumbs-down",
  },
  {
    id: "dizzy",
    name: "Dizzy / Faint",
    meaning: "I feel dizzy or faint",
    description: "Circular motion near head with finger",
    category: "medical",
    icon: "loader",
  },
  {
    id: "allergic",
    name: "Allergic Reaction",
    meaning: "I'm having an allergic reaction",
    description: "Scratch motion on arm or point to swelling",
    category: "emergency",
    icon: "shield-alert",
  },
];

// Medical context mappings for MediaPipe gestures
interface MedicalGestureMapping {
  name: string;
  meaning: string;
  category: "general" | "medical" | "emergency";
  icon: string;
  alternativeMeanings?: string[];
}

const MEDICAL_GESTURE_MAPPINGS: Record<string, MedicalGestureMapping> = {
  Thumb_Up: {
    name: "Yes / I'm Okay",
    meaning: "Yes, I understand / I'm okay / Feeling better",
    category: "general",
    icon: "thumbs-up",
    alternativeMeanings: ["Confirm", "Agree", "Good"],
  },
  Thumb_Down: {
    name: "No / Problem",
    meaning: "No / Not good / I have a problem / Pain worsening",
    category: "medical",
    icon: "thumbs-down",
    alternativeMeanings: ["Disagree", "Bad", "Worse"],
  },
  Open_Palm: {
    name: "Stop / Help Needed",
    meaning: "Stop / I need help / Wait / Attention needed",
    category: "emergency",
    icon: "hand",
    alternativeMeanings: ["Hello", "Five", "Pause"],
  },
  Closed_Fist: {
    name: "Pain / Hold",
    meaning: "I'm in pain / Hold on / Cramping / Tightness",
    category: "medical",
    icon: "heart-crack",
    alternativeMeanings: ["Wait", "Stop", "Tight feeling"],
  },
  Pointing_Up: {
    name: "Urgent / Important",
    meaning: "This is urgent / Pay attention / Important symptom",
    category: "emergency",
    icon: "alert-triangle",
    alternativeMeanings: ["One", "Look here", "This area"],
  },
  Victory: {
    name: "Two / Second Issue",
    meaning: "Two symptoms / Second problem / Moderate pain (2/10)",
    category: "medical",
    icon: "hash",
    alternativeMeanings: ["Peace", "Okay", "Two"],
  },
  ILoveYou: {
    name: "Thank You / Understood",
    meaning: "Thank you / I appreciate it / Message received",
    category: "general",
    icon: "heart",
    alternativeMeanings: ["Love", "Thanks", "Appreciate"],
  },
};

// Hand landmark indices for custom gesture detection
const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20,
  INDEX_MCP: 5,
  MIDDLE_MCP: 9,
};

class SignLanguageDetector {
  private gestureRecognizer: GestureRecognizer | null = null;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;
  private lastGestures: string[] = [];
  private gestureHistory: { gesture: string; timestamp: number }[] = [];

  async initialize(): Promise<void> {
    if (this.gestureRecognizer) return;
    if (this.initPromise) return this.initPromise;

    this.isInitializing = true;
    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Initialize gesture recognizer
      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      // Initialize hand landmarker for custom gesture detection
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      console.log("Sign language detector initialized successfully");
    } catch (error) {
      console.error("Failed to initialize gesture recognizer:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  detectFromVideo(
    video: HTMLVideoElement,
    timestamp: number
  ): DetectedSign | null {
    if (!this.gestureRecognizer || video.readyState < 2) {
      return null;
    }

    try {
      // Get gesture recognition results
      const gestureResults: GestureRecognizerResult =
        this.gestureRecognizer.recognizeForVideo(video, timestamp);

      // Get hand landmarks for custom gestures
      let handResults: HandLandmarkerResult | null = null;
      if (this.handLandmarker) {
        handResults = this.handLandmarker.detectForVideo(video, timestamp);
      }

      // PRIORITY 1: Check MediaPipe recognized gestures FIRST
      // These are more accurate for standard gestures like thumbs up/down
      if (gestureResults.gestures && gestureResults.gestures.length > 0) {
        const gesture = gestureResults.gestures[0][0];
        const gestureName = gesture.categoryName;
        const confidence = gesture.score;

        // Skip "None" gestures
        if (gestureName !== "None" && confidence > 0.6) {
          // Check for two-handed gestures (emergency signals)
          if (gestureResults.gestures.length === 2) {
            const twoHandGesture = this.detectTwoHandGestures(gestureResults);
            if (twoHandGesture) {
              return twoHandGesture;
            }
          }

          // Map to medical context
          const matchedSign = this.mapGestureToMedicalSign(gestureName, confidence);
          if (matchedSign) {
            this.updateGestureHistory(gestureName);
            return matchedSign;
          }
        }
      }

      // PRIORITY 2: Only check custom medical gestures if no standard gesture detected
      // This prevents thumbs up/down from being misclassified as chest pain
      const customGesture = this.detectCustomMedicalGestures(handResults, gestureResults);
      if (customGesture) {
        this.updateGestureHistory(customGesture.name);
        return customGesture;
      }
    } catch (error) {
      console.error("Detection error:", error);
    }

    return null;
  }

  private updateGestureHistory(gesture: string) {
    const now = Date.now();
    this.gestureHistory.push({ gesture, timestamp: now });
    // Keep only last 5 seconds of history
    this.gestureHistory = this.gestureHistory.filter(
      (g) => now - g.timestamp < 5000
    );
  }

  private detectTwoHandGestures(
    results: GestureRecognizerResult
  ): DetectedSign | null {
    if (results.gestures.length < 2) return null;

    const gesture1 = results.gestures[0][0].categoryName;
    const gesture2 = results.gestures[1][0].categoryName;
    const avgConfidence =
      (results.gestures[0][0].score + results.gestures[1][0].score) / 2;

    // Both hands open palm = EMERGENCY HELP
    if (gesture1 === "Open_Palm" && gesture2 === "Open_Palm") {
      return {
        name: "🚨 EMERGENCY - HELP!",
        meaning: "I need immediate emergency assistance!",
        confidence: Math.round(avgConfidence * 100),
        category: "emergency",
        icon: "alert-triangle",
      };
    }

    // Both hands closed fist = Severe pain/cramping
    if (gesture1 === "Closed_Fist" && gesture2 === "Closed_Fist") {
      return {
        name: "Severe Pain",
        meaning: "I'm experiencing severe pain or cramping",
        confidence: Math.round(avgConfidence * 100),
        category: "emergency",
        icon: "heart-crack",
      };
    }

    // One pointing + one open = "Look here, help"
    if (
      (gesture1 === "Pointing_Up" && gesture2 === "Open_Palm") ||
      (gesture1 === "Open_Palm" && gesture2 === "Pointing_Up")
    ) {
      return {
        name: "Help Here",
        meaning: "I need help with this specific area/issue",
        confidence: Math.round(avgConfidence * 100),
        category: "medical",
        icon: "map-pin",
      };
    }

    return null;
  }

  private detectCustomMedicalGestures(
    results: HandLandmarkerResult | null,
    gestureResults?: GestureRecognizerResult
  ): DetectedSign | null {
    if (!results || !results.landmarks || results.landmarks.length === 0) {
      return null;
    }

    // If MediaPipe detected a known gesture, don't override with custom detection
    // This prevents thumbs up/down from being misclassified
    if (gestureResults?.gestures && gestureResults.gestures.length > 0) {
      const detectedGesture = gestureResults.gestures[0][0];
      const knownGestures = ["Thumb_Up", "Thumb_Down", "Open_Palm", "Closed_Fist", "Pointing_Up", "Victory", "ILoveYou"];
      if (knownGestures.includes(detectedGesture.categoryName) && detectedGesture.score > 0.5) {
        return null; // Let MediaPipe handle this gesture
      }
    }

    const landmarks = results.landmarks[0];

    const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
    const wrist = landmarks[HAND_LANDMARKS.WRIST];
    const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
    const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];

    const isHandFlat = this.isHandFlat(landmarks);
    const areFingersCurled = this.areFingersClosed(landmarks);

    // ===== MEDICINE / PILLS GESTURE =====
    // Hand near mouth with thumb extended (pill-taking motion)
    // Must be in upper portion AND thumb clearly extended toward mouth
    const isInMouthRegion = thumbTip.y < 0.3 && thumbTip.x > 0.3 && thumbTip.x < 0.7;
    const isThumbExtended = Math.abs(thumbTip.x - wrist.x) > 0.05 || thumbTip.y < wrist.y - 0.15;
    const isHandNearFace = wrist.y < 0.45;
    
    if (isInMouthRegion && isThumbExtended && isHandNearFace && areFingersCurled) {
      return {
        name: "Medicine / Pills",
        meaning: "I need medicine",
        confidence: 78,
        category: "medical",
        icon: "pill",
      };
    }

    // ===== DIZZY / FAINT GESTURE =====
    // Hand near temple/side of head with circular or wobbling motion
    // Index finger pointing at temple area (side of head, not center)
    const isAtTemple = indexTip.y < 0.35 && (indexTip.x < 0.3 || indexTip.x > 0.7);
    const isWristLower = wrist.y > indexTip.y + 0.1;
    
    if (isAtTemple && isWristLower && !isHandFlat) {
      return {
        name: "Dizzy / Faint",
        meaning: "I feel dizzy or faint",
        confidence: 75,
        category: "medical",
        icon: "loader",
      };
    }

    // ===== ALLERGIC REACTION =====
    // Scratching motion on arm - hand clearly to the side of body
    // Must be very far to the side (on arm position)
    const isOnArmSide = indexTip.x < 0.2 || indexTip.x > 0.8;
    const isArmHeight = indexTip.y > 0.35 && indexTip.y < 0.65;
    const isWristCentered = wrist.x > 0.3 && wrist.x < 0.7;
    
    if (isOnArmSide && isArmHeight && isWristCentered) {
      return {
        name: "Allergic Reaction",
        meaning: "I'm having an allergic reaction",
        confidence: 68,
        category: "emergency",
        icon: "shield-alert",
      };
    }

    // ===== CHEST DISCOMFORT =====
    // Hand flat on chest - must be clearly in center chest region
    const isInChestRegion = indexTip.y > 0.4 && indexTip.y < 0.6 && indexTip.x > 0.35 && indexTip.x < 0.65;
    const isPalmFacingCamera = wrist.z > indexTip.z;

    if (isInChestRegion && isHandFlat && isPalmFacingCamera) {
      return {
        name: "Chest Discomfort",
        meaning: "I'm experiencing chest pain",
        confidence: 75,
        category: "emergency",
        icon: "heart-pulse",
      };
    }

    // ===== THROAT / BREATHING ISSUE =====
    // Hand at throat level with flat palm
    const isAtThroat = indexTip.y > 0.25 && indexTip.y < 0.4 && indexTip.x > 0.35 && indexTip.x < 0.65;
    
    if (isAtThroat && isHandFlat && wrist.y < 0.5) {
      return {
        name: "Breathing Issue",
        meaning: "I'm having trouble breathing",
        confidence: 70,
        category: "emergency",
        icon: "wind",
      };
    }

    // ===== HEADACHE =====
    // Hand touching top of head - both wrist and fingers must be very high
    const isAtTopOfHead = wrist.y < 0.2 && indexTip.y < 0.25 && indexTip.x > 0.3 && indexTip.x < 0.7;
    
    if (isAtTopOfHead && isHandFlat) {
      return {
        name: "Headache",
        meaning: "I have a headache",
        confidence: 70,
        category: "medical",
        icon: "brain",
      };
    }

    // ===== STOMACH PAIN =====
    // Hand clearly in lower abdomen - must be very low AND centered
    const isInStomachRegion = indexTip.y > 0.7 && indexTip.x > 0.35 && indexTip.x < 0.65;
    const isWristAlsoLow = wrist.y > 0.6;
    
    if (isInStomachRegion && isWristAlsoLow && isHandFlat) {
      return {
        name: "Stomach Pain",
        meaning: "I have stomach pain",
        confidence: 72,
        category: "medical",
        icon: "circle-dot",
      };
    }

    return null;
  }

  private isHandFlat(landmarks: any[]): boolean {
    // Check if fingers are extended and spread (flat/open hand)
    const wrist = landmarks[HAND_LANDMARKS.WRIST];
    const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
    const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];
    const ringTip = landmarks[HAND_LANDMARKS.RING_TIP];
    const pinkyTip = landmarks[HAND_LANDMARKS.PINKY_TIP];

    // Fingers should be extended away from wrist
    const indexExtended = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y) > 0.15;
    const middleExtended = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y) > 0.15;
    const ringExtended = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y) > 0.12;
    const pinkyExtended = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y) > 0.1;

    // At least 3 fingers should be extended for a flat hand
    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
    return extendedCount >= 3;
  }

  private areFingersClosed(landmarks: any[]): boolean {
    // Check if fingertips are close to palm (closed fist)
    const palmCenter = landmarks[HAND_LANDMARKS.MIDDLE_MCP];
    const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
    const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];

    const distIndex = Math.hypot(
      indexTip.x - palmCenter.x,
      indexTip.y - palmCenter.y
    );
    const distMiddle = Math.hypot(
      middleTip.x - palmCenter.x,
      middleTip.y - palmCenter.y
    );

    return distIndex < 0.15 && distMiddle < 0.15;
  }

  private mapGestureToMedicalSign(
    gestureName: string,
    confidence: number
  ): DetectedSign | null {
    const mapping = MEDICAL_GESTURE_MAPPINGS[gestureName];

    if (mapping && confidence > 0.5) {
      return {
        name: mapping.name,
        meaning: mapping.meaning,
        confidence: Math.round(confidence * 100),
        category: mapping.category,
        icon: mapping.icon,
      };
    }

    return null;
  }

  // Get gesture sequence for complex meanings
  getRecentGestureSequence(): string[] {
    return this.gestureHistory.map((g) => g.gesture);
  }

  isReady(): boolean {
    return this.gestureRecognizer !== null;
  }

  dispose(): void {
    if (this.gestureRecognizer) {
      this.gestureRecognizer.close();
      this.gestureRecognizer = null;
    }
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
  }
}

// Singleton instance
export const signLanguageDetector = new SignLanguageDetector();
