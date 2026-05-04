"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { LIMIT_OPTIONS } from "@/shared/lib/search-params";
import { useFiltersState } from "@/features/filter-cargo";

type Props = {
  page: number;
  limit: number;
  total: number;
};

export function CargoPagination({ page, limit, total }: Props) {
  const t = useTranslations("pagination");
  const { setInstant } = useFiltersState();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const to = Math.min(total, safePage * limit);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground tabular-nums">
        {t("summary", { from, to, total })}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{t("limitLabel")}</span>
        <Select
          value={String(limit)}
          onValueChange={(v) => {
            if (v) setInstant({ limit: v, page: 1 });
          }}
        >
          <SelectTrigger className="h-7 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((o) => (
              <SelectItem key={o} value={String(o)}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setInstant({ page: safePage - 1 })}
            aria-label={t("prev")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("prev")}</span>
          </Button>
          <span className="px-2 text-xs tabular-nums text-muted-foreground">
            {t("page", { page: safePage, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setInstant({ page: safePage + 1 })}
            aria-label={t("next")}
          >
            <span className="hidden sm:inline">{t("next")}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
