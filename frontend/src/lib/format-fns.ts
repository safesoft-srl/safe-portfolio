import { format, parseISO, isValid } from "date-fns";
import { es, enUS, type Locale } from "date-fns/locale";

/** 1. Restrict allowed locales */
type LocaleId = "es" | "enUS";

/** 2. Strongly typed locale map */
const LOCALES: Record<LocaleId, Locale> = {
  es,
  enUS,
};

/** 3. Strongly typed translations */
const TRANSLATIONS: Record<LocaleId, { present: string }> = {
  es: { present: "Presente" },
  enUS: { present: "Present" },
};

/** 4. Input type (explicit and strict) */
export interface Experience {
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
}

/** 5. Safe way to get locale (no random string indexing) */
function getLocaleId(): LocaleId {
  const raw = (window as unknown as { __localeId__?: string }).__localeId__;

  if (raw === "es" || raw === "enUS") {
    return raw;
  }

  return "enUS"; // fallback
}

/** 6. Safe date formatter */
function safeFormat(dateStr: string, locale: Locale): string {
  const date = parseISO(dateStr);

  if (!isValid(date)) return "";

  return format(date, "MMM yyyy", { locale });
}

/** 7. Final helper */
export function formatExperienceDate(exp: Experience): string {
  const localeId = getLocaleId();
  const locale = LOCALES[localeId];

  const start = exp.start_date ? safeFormat(exp.start_date, locale) : "";

  const end = exp.is_current
    ? TRANSLATIONS[localeId].present
    : exp.end_date
      ? safeFormat(exp.end_date, locale)
      : "";

  return `${start} - ${end}`.trim();
}
