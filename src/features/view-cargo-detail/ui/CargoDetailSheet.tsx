"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Calendar,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/lib/formatters/currency";
import { formatDate } from "@/shared/lib/formatters/date";
import { formatNumber } from "@/shared/lib/formatters/weight";
import type { Locale } from "@/shared/i18n/routing";
import {
  CargoMarkers,
  CargoStatusBadge,
  localizeCargoTypeName,
  type Cargo,
} from "@/entities/cargo";

type Props = {
  cargo: Cargo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CargoDetailSheet({ cargo, open, onOpenChange }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("detail");
  const tCommon = useTranslations("common");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-xl px-5"
      >
        {cargo ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-base sm:text-lg">
                    {cargo.name}
                  </SheetTitle>
                  <SheetDescription>
                    {localizeCargoTypeName(cargo.cargo_type, locale)}
                  </SheetDescription>
                </div>
                <CargoStatusBadge status={cargo.status} />
              </div>
              <CargoMarkers cargo={cargo} className="mt-2" />
            </SheetHeader>

            <Separator className="my-4" />

            <Section title={t("route")}>
              <ol className="space-y-3">
                {[...cargo.route_points]
                  .sort((a, b) => a.point_order - b.point_order)
                  .map((rp) => (
                    <li
                      key={rp.id}
                      className="flex gap-3 rounded-lg border bg-card p-3"
                    >
                      <div className="mt-0.5">
                        {rp.type === "LOAD" ? (
                          <ArrowUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {rp.city_name}
                          {rp.country_code ? (
                            <span className="text-xs text-muted-foreground">
                              · {rp.country_code}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 break-words text-xs text-muted-foreground">
                          {rp.address}
                        </p>
                        {rp.date && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(rp.date, locale, "d MMM yyyy")}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </Section>

            <Section title={t("payment")}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <KV
                  k={t("payment")}
                  v={formatCurrency(
                    cargo.payment.total_amount,
                    cargo.payment.total_currency,
                    locale,
                  )}
                />
                {cargo.payment.with_prepayment && (
                  <KV
                    k={t("prepayment")}
                    v={formatCurrency(
                      cargo.payment.prepayment_amount,
                      cargo.payment.prepayment_currency,
                      locale,
                    )}
                  />
                )}
                {cargo.payment.remaining_amount != null && (
                  <KV
                    k={t("remaining")}
                    v={formatCurrency(
                      cargo.payment.remaining_amount,
                      cargo.payment.remaining_currency,
                      locale,
                    )}
                  />
                )}
                {cargo.payment.payment_terms_note && (
                  <KV
                    k={t("paymentNote")}
                    v={cargo.payment.payment_terms_note}
                  />
                )}
              </dl>
            </Section>

            <Section title={t("vehicles")}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <KV k={t("vehiclesAmount")} v={cargo.vehicles_amount} />
                <KV k={t("vehiclesLeft")} v={cargo.vehicles_left} />
                {cargo.weight != null && (
                  <KV
                    k={tCommon("weightUnit")}
                    v={`${formatNumber(cargo.weight, locale)} ${tCommon("weightUnit")}`}
                  />
                )}
                {cargo.volume != null && (
                  <KV
                    k={tCommon("volumeUnit")}
                    v={`${formatNumber(cargo.volume, locale)} ${tCommon("volumeUnit")}`}
                  />
                )}
                {cargo.is_two_drivers_required && (
                  <KV k={t("twoDrivers")} v={tCommon("yes")} />
                )}
                {cargo.adr_enabled && (
                  <KV
                    k={t("adr")}
                    v={
                      cargo.adr_class
                        ? `${cargo.adr_class}`
                        : tCommon("yes")
                    }
                  />
                )}
                {(cargo.temp_min != null || cargo.temp_max != null) && (
                  <KV
                    k={t("temperature")}
                    v={`${cargo.temp_min ?? "—"}°…${cargo.temp_max ?? "—"}°`}
                  />
                )}
                {cargo.shipment_type && (
                  <KV k={t("shipmentType")} v={cargo.shipment_type} />
                )}
              </dl>
            </Section>

            {(cargo.contact_name || cargo.contact_phone) && (
              <Section title={t("contact")}>
                <dl className="grid grid-cols-1 gap-y-1.5 text-sm">
                  {cargo.contact_name && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{cargo.contact_name}</span>
                    </div>
                  )}
                  {cargo.contact_phone && (
                    <a
                      href={`tel:${cargo.contact_phone}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {cargo.contact_phone}
                    </a>
                  )}
                </dl>
              </Section>
            )}

            {cargo.comment && (
              <Section title={t("comment")}>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {cargo.comment}
                </p>
              </Section>
            )}

            {cargo.photos.length > 0 && (
              <Section title="">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {cargo.photos.map((src) => {
                    const url = src.startsWith("http")
                      ? src
                      : `https://api.sarbon.me${src}`;
                    return (
                      <div
                        key={src}
                        className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {cargo.moderation_rejection_reason && (
              <div className="mt-4 flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {cargo.moderation_rejection_reason}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>
                {t("createdAt")}: {formatDate(cargo.created_at, locale)}
              </span>
              <span className="text-right">
                {t("updatedAt")}: {formatDate(cargo.updated_at, locale)}
              </span>
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => onOpenChange(false)}
            >
              {t("close")}
            </Button>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      {title && (
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="text-right tabular-nums">{v}</dd>
    </>
  );
}
