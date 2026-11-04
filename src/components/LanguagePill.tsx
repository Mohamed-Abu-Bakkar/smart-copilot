import { cn } from "@/lib/utils";

type Lang = "en" | "ta";

interface LanguagePillProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}

const LABELS: Record<Lang, string> = { en: "English", ta: "தமிழ்" };

export function LanguagePill({ lang, onChange, className }: LanguagePillProps) {
  return (
    <button
      onClick={() => onChange(lang === "en" ? "ta" : "en")}
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-sm transition-colors",
        className,
      )}
      aria-checked={lang === "ta"}
      role="switch"
    >
      <span
        className={cn(
          "relative z-10 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all duration-200",
          lang === "en"
            ? "bg-teal-primary text-white"
            : "text-slate-muted",
        )}
      >
        {LABELS.en}
      </span>
      <span className="mx-0.5 text-[10px] text-slate-300">|</span>
      <span
        className={cn(
          "relative z-10 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all duration-200",
          lang === "ta"
            ? "bg-teal-primary text-white"
            : "text-slate-muted",
        )}
      >
        {LABELS.ta}
      </span>
    </button>
  );
}
