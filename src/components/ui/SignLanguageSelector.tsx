import { cn } from "@/lib/utils";

export type SignLanguage = "ASL" | "BSL" | "ISL";

interface SignLanguageSelectorProps {
  value: SignLanguage;
  onChange: (lang: SignLanguage) => void;
}

const languages: { id: SignLanguage; label: string; full: string }[] = [
  { id: "ASL", label: "ASL", full: "American Sign Language" },
  { id: "BSL", label: "BSL", full: "British Sign Language" },
  { id: "ISL", label: "ISL", full: "International Sign Language" },
];

export function SignLanguageSelector({ value, onChange }: SignLanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-150",
            value === lang.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={lang.full}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
