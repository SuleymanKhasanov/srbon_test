"use client";

import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { STATUS_OPTIONS, useFiltersState } from "@/features/filter-cargo";
import { CargoFiltersSheet } from "./CargoFiltersSheet";

const ANY_STATUS = "__any__";

const SORT_OPTIONS = [
  { value: "created_at:desc", labelKey: "sortNewest" as const },
  { value: "created_at:asc", labelKey: "sortOldest" as const },
];

export function CargoFiltersPanel() {
  const t = useTranslations("filters");
  const tStatus = useTranslations("status");
  const sp = useSearchParams();
  const { setInstant } = useFiltersState();

  const status = sp.get("status") ?? "SEARCHING_ALL";
  const sort = sp.get("sort") ?? "created_at:desc";

  const cardClass =
    "rounded-2xl border border-border/60 bg-card shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]";
  const triggerClass =
    "h-12 rounded-xl text-sm bg-background/60 hover:bg-background";
  const labelClass =
    "text-[11px] font-semibold uppercase tracking-wide text-primary";

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <div className={`${cardClass} flex flex-wrap items-end gap-4 px-4 py-3`}>
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>{t("status")}</span>
          <Select
            value={status || ANY_STATUS}
            onValueChange={(v) => {
              const next = !v || v === ANY_STATUS ? "" : v;
              setInstant({ status: next, page: 1 });
            }}
          >
            <SelectTrigger className={`${triggerClass} w-[200px]`}>
              <SelectValue>
                {(v: string) =>
                  !v || v === ANY_STATUS ? t("anyStatus") : tStatus(v)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_STATUS}>{t("anyStatus")}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {tStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>{t("sortLabel")}</span>
          <Select
            value={sort}
            onValueChange={(v) => {
              if (v) setInstant({ sort: v, page: 1 });
            }}
          >
            <SelectTrigger className={`${triggerClass} w-[220px]`}>
              <SelectValue>
                {(v: string) => {
                  const opt = SORT_OPTIONS.find((o) => o.value === v);
                  return opt ? t(opt.labelKey) : t("sortNewest");
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {t(o.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`${cardClass} ml-auto flex items-center px-2`}>
        <CargoFiltersSheet
          triggerLabel={t("openMobile")}
          triggerIcon={<Filter className="h-4 w-4" />}
          triggerClassName="h-10 rounded-xl px-4 text-sm font-medium"
        />
      </div>
    </div>
  );
}
