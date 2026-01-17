import {
  GestureRecognizer,
  FilesetResolver,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

export interface DetectedSign {
  name: string;
  meaning: string;
  confidence: number;
}

export const SAMPLE_SIGNS = [
  {
    id: "thumbs_up",
    name: "Thumbs Up",
    meaning: "I'm okay / Yes / Good",
    gesture: "Closed_Fist", // Will also check thumb position
    description: "Make a fist and extend your thumb upward",
  },
  {
    id: "open_palm",
    name: "Open Palm",
    meaning: "Hello / Stop / Wait",
    gesture: "Open_Palm",
    description: "Show your open hand with fingers spread",
  },
  {
    id: "pointing_up",
    name: "Pointing Up",
    meaning: "I need attention / Important",
    gesture: "Pointing_Up",
    description: "Point your index finger upward",
  },
];

class SignLanguageDetector {
  private gestureRecognizer: GestureRecognizer | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

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

      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
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
      const results: GestureRecognizerResult =
        this.gestureRecognizer.recognizeForVideo(video, timestamp);

      if (results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        const gestureName = gesture.categoryName;
        const confidence = gesture.score;

        // Map MediaPipe gestures to our sample signs
        const matchedSign = this.mapGestureToSign(gestureName, confidence);
        return matchedSign;
      }
    } catch (error) {
      console.error("Detection error:", error);
    }

    return null;
  }

  private mapGestureToSign(
    gestureName: string,
    confidence: number
  ): DetectedSign | null {
    // MediaPipe gestures: None, Closed_Fist, Open_Palm, Pointing_Up, Thumb_Down, Thumb_Up, Victory, ILoveYou
    
    const gestureMapping: Record<string, { name: string; meaning: string }> = {
      Thumb_Up: {
        name: "Thumbs Up",
        meaning: "I'm okay / Yes / Good",
      },
      Open_Palm: {
        name: "Open Palm / Hello",
        meaning: "Hello / Stop / Wait / I need help",
      },
      Pointing_Up: {
        name: "Pointing Up",
        meaning: "I need attention / Important / Look here",
      },
      Victory: {
        name: "Peace / Victory",
        meaning: "I'm okay / Two / Peace",
      },
      ILoveYou: {
        name: "I Love You",
        meaning: "I love you / Thank you",
      },
      Closed_Fist: {
        name: "Closed Fist",
        meaning: "Stop / No / Hold on",
      },
      Thumb_Down: {
        name: "Thumbs Down",
        meaning: "No / Not good / Problem",
      },
    };

    const mapped = gestureMapping[gestureName];
    if (mapped && confidence > 0.5) {
      return {
        name: mapped.name,
        meaning: mapped.meaning,
        confidence: Math.round(confidence * 100),
      };
    }

    return null;
  }

  isReady(): boolean {
    return this.gestureRecognizer !== null;
  }

  dispose(): void {
    if (this.gestureRecognizer) {
      this.gestureRecognizer.close();
      this.gestureRecognizer = null;
    }
  }
}

// Singleton instance
export const signLanguageDetector = new SignLanguageDetector();
