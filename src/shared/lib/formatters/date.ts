import { formatDistanceToNow, format, parseISO } from "date-fns";
import { enUS, ru, uz } from "date-fns/locale";
import type { Locale } from "@/shared/i18n/routing";

const LOCALES = { ru, uz, en: enUS } as const;

export function formatRelative(iso: string, locale: Locale): string {
  try {
    return formatDistanceToNow(parseISO(iso), {
      addSuffix: true,
      locale: LOCALES[locale],
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso: string, locale: Locale, fmt = "d MMM yyyy"): string {
  try {
    return format(parseISO(iso), fmt, { locale: LOCALES[locale] });
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string, locale: Locale): string {
  return formatDate(iso, locale, "d MMM");
}
