import { Shield, Wifi, WifiOff } from "lucide-react";

interface PrivacyBannerProps {
  isOffline?: boolean;
}

export function PrivacyBanner({ isOffline = true }: PrivacyBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-success/10 rounded-xl">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-success flex-shrink-0" />
        <span className="text-xs font-medium text-success">
          No audio or video stored. All communication is processed locally.
        </span>
      </div>
      <div className="offline-badge flex-shrink-0">
        {isOffline ? (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline Ready</span>
          </>
        ) : (
          <>
            <Wifi className="w-3 h-3" />
            <span>Online</span>
          </>
        )}
      </div>
    </div>
  );
}
