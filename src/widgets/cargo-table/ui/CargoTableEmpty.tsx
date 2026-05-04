"use client";

import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { useFiltersState } from "@/features/filter-cargo";

export function CargoTableEmpty({ canReset = false }: { canReset?: boolean }) {
  const t = useTranslations("states.empty");
  const { resetFilters } = useFiltersState();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <PackageOpen className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold">{t("title")}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t("description")}
      </p>
      {canReset && (
        <Button variant="outline" size="sm" onClick={resetFilters}>
          {t("reset")}
        </Button>
      )}
    </div>
  );
}
