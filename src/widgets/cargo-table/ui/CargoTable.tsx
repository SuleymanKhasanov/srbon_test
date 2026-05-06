"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import { formatRelative } from "@/shared/lib/formatters/date";
import { formatNumber } from "@/shared/lib/formatters/weight";
import type { Locale } from "@/shared/i18n/routing";
import {
  CargoMarkers,
  CargoPriceCell,
  CargoRouteCell,
  CargoStatusBadge,
  localizeCargoTypeName,
  type Cargo,
} from "@/entities/cargo";

import { CargoTableSkeleton } from "./CargoTableSkeleton"; // ← импортируем

type Props = {
  items: Cargo[];
  isFetching?: boolean;
  onSelect?: (cargo: Cargo) => void;
};

export function CargoTable({ items, isFetching = false, onSelect }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("table");
  const tCommon = useTranslations("common");

  // Показываем скелетон при первой загрузке или когда явно идёт fetching и данных мало
  const showSkeleton = isFetching && (items.length === 0 || items.length < 3);

  return (
      <div
          className="relative overflow-hidden rounded-xl border bg-card shadow-sm p-4"
          aria-busy={isFetching ? "true" : undefined}
          aria-label={t("ariaBusy")}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
              <TableRow className="border-border">
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.name")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.route")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.markers")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.weight")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.price")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.status")}
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-primary">
                  {t("columns.created")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {showSkeleton ? (
                  <CargoTableSkeleton rows={8} />
              ) : (
                  items.map((cargo) => (
                      <TableRow
                          key={cargo.id}
                          className={cn(
                              "cursor-pointer border-border transition-colors hover:bg-muted/50",
                          )}
                          onClick={() => onSelect?.(cargo)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onSelect?.(cargo);
                            }
                          }}
                      >
                        <TableCell className="max-w-[260px] py-3 align-top">
                          <div className="font-semibold leading-tight">
                            {cargo.name}
                          </div>
                          {cargo.cargo_type && (
                            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {localizeCargoTypeName(cargo.cargo_type, locale)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 align-top">
                          <CargoRouteCell cargo={cargo} />
                        </TableCell>
                        <TableCell className="py-3 align-top">
                          <CargoMarkers cargo={cargo} />
                        </TableCell>
                        <TableCell className="py-3 align-top tabular-nums">
                    <span className="text-sm">
                      {formatNumber(cargo.weight, locale)} {tCommon("weightUnit")}
                    </span>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(cargo.volume, locale)} {tCommon("volumeUnit")}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 align-top">
                          <CargoPriceCell payment={cargo.payment} />
                        </TableCell>
                        <TableCell className="py-3 align-top">
                          <CargoStatusBadge status={cargo.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap py-3 align-top text-xs text-muted-foreground">
                          {formatRelative(cargo.created_at, locale)}
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Тонкая полоска сверху при фоновой подгрузке (опционально) */}
        {isFetching && !showSkeleton && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 animate-pulse bg-primary/40" />
        )}
      </div>
  );
}