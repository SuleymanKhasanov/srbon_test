export function formatNumber(value: number | null | undefined, locale: string): string {
  if (value == null) return "—";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}
