export function formatCurrency(
  amount: number | null | undefined,
  currency: string | null | undefined,
  locale: string,
): string {
  if (amount == null || !currency) return "—";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(locale)} ${currency}`;
  }
}
