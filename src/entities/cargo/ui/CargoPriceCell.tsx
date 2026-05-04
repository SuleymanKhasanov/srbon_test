import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/shared/lib/formatters/currency";
import type { Payment } from "../api/types";

export function CargoPriceCell({ payment }: { payment: Payment }) {
  const locale = useLocale();
  const t = useTranslations("table");
  if (payment.price_request) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  const main = formatCurrency(payment.total_amount, payment.total_currency, locale);
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold tabular-nums">{main}</span>
      {payment.is_negotiable && (
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {t("negotiable")}
        </span>
      )}
    </div>
  );
}
