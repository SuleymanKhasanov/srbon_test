"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatRelative } from "@/shared/lib/formatters/date";
import { formatNumber } from "@/shared/lib/formatters/weight";
import type { Locale } from "@/shared/i18n/routing";
import type { Cargo } from "../api/types";
import { CargoMarkers } from "./CargoMarkers";
import { CargoPriceCell } from "./CargoPriceCell";
import { CargoRouteCell } from "./CargoRouteCell";
import { CargoStatusBadge } from "./CargoStatusBadge";

type Props = {
  cargo: Cargo;
  onSelect?: (cargo: Cargo) => void;
};

export function CargoCard({ cargo, onSelect }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  return (
    <button
      type="button"
      onClick={() => onSelect?.(cargo)}
      className="group flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-foreground/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{cargo.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatRelative(cargo.created_at, locale)}
          </p>
        </div>
        <CargoStatusBadge status={cargo.status} />
      </div>

      <CargoRouteCell cargo={cargo} />

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>
            {formatNumber(cargo.weight, locale)} {t("weightUnit")}
            {" / "}
            {formatNumber(cargo.volume, locale)} {t("volumeUnit")}
          </span>
          <CargoMarkers cargo={cargo} className="mt-1.5" />
        </div>
        <CargoPriceCell payment={cargo.payment} />
      </div>
    </button>
  );
}
