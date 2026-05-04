"use client";

import { AlertCircle, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { CargoApiError } from "@/entities/cargo";

type Props = {
  error: unknown;
  onRetry?: () => void;
};

export function CargoTableError({ error, onRetry }: Props) {
  const t = useTranslations("states.error");
  const tokenExpired =
    error instanceof CargoApiError && error.errorCode === "TOKEN_EXPIRED";

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive">
        {tokenExpired ? (
          <KeyRound className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>
      <h3 className="text-base font-semibold">
        {tokenExpired ? t("tokenExpiredTitle") : t("title")}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {tokenExpired ? t("tokenExpiredDescription") : t("description")}
      </p>
      {!tokenExpired && onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
