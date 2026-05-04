import { ArrowRight, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDateShort } from "@/shared/lib/formatters/date";
import type { Locale } from "@/shared/i18n/routing";
import type { Cargo } from "../api/types";
import { pickMainRoute } from "../lib/cargo-helpers";

export function CargoRouteCell({ cargo }: { cargo: Cargo }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("table");
  const { load, unload } = pickMainRoute(cargo);

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{load?.city_name ?? "—"}</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{unload?.city_name ?? "—"}</span>
      </div>
      {(load?.date || unload?.date) && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {load?.date && (
            <span>
              {t("loadDate")}: {formatDateShort(load.date, locale)}
            </span>
          )}
          {unload?.date && (
            <span>
              {t("unloadDate")}: {formatDateShort(unload.date, locale)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
