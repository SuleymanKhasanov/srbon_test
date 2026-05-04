"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import { useFiltersState } from "../model/useFiltersState";
import { TRUCK_TYPE_OPTIONS, type FilterFormValues } from "../model/schema";

const ANY_VALUE = "__any__";

type Props = {
  onSubmitted?: () => void;
  className?: string;
};

export function CargoFiltersForm({ onSubmitted, className }: Props) {
  const t = useTranslations("filters");
  const tTruck = useTranslations("truckType");
  const { initialValues, applyFilters, resetFilters } = useFiltersState();

  const form = useForm<FilterFormValues>({
    defaultValues: initialValues,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const truckType = watch("truck_type") || "";
  const withOffers = watch("with_offers") ?? false;

  const onSubmit = handleSubmit((values) => {
    applyFilters(values);
    onSubmitted?.();
  });

  const onReset = () => {
    resetFilters();
    reset({
      q: "",
      truck_type: "",
      from_city_code: "",
      to_city_code: "",
      weight_min: "",
      weight_max: "",
      created_from: "",
      created_to: "",
      with_offers: false,
    });
    onSubmitted?.();
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label={t("search")}>
          <Input
            placeholder={t("search")}
            {...register("q")}
            autoComplete="off"
          />
        </Field>

        <Field label={t("truckType")}>
          <Select
            value={truckType || ANY_VALUE}
            onValueChange={(v) => {
              const next = !v || v === ANY_VALUE ? "" : v;
              setValue("truck_type", next, { shouldDirty: true });
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {(v: string) =>
                  !v || v === ANY_VALUE
                    ? t("any")
                    : tTruck(v as (typeof TRUCK_TYPE_OPTIONS)[number])
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>{t("any")}</SelectItem>
              {TRUCK_TYPE_OPTIONS.map((tt) => (
                <SelectItem key={tt} value={tt}>
                  {tTruck(tt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("fromCity")}>
          <Input
            placeholder="TAS"
            {...register("from_city_code")}
            autoComplete="off"
            className="uppercase"
          />
        </Field>
        <Field label={t("toCity")}>
          <Input
            placeholder="SAM"
            {...register("to_city_code")}
            autoComplete="off"
            className="uppercase"
          />
        </Field>

        <Field label={t("weightMin")}>
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            min={0}
            {...register("weight_min")}
          />
        </Field>
        <Field label={t("weightMax")}>
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            min={0}
            {...register("weight_max")}
          />
        </Field>

        <Field label={t("createdFrom")}>
          <Input type="date" {...register("created_from")} />
        </Field>
        <Field label={t("createdTo")}>
          <Input type="date" {...register("created_to")} />
        </Field>

        <Label className="col-span-full mt-1 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border border-input accent-foreground"
            {...register("with_offers")}
            checked={withOffers}
            onChange={(e) =>
              setValue("with_offers", e.target.checked, { shouldDirty: true })
            }
          />
          {t("withOffers")}
        </Label>
      </div>

      <Separator className="my-5" />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onReset}>
          {t("reset")}
        </Button>
        <Button type="submit" disabled={!isDirty}>
          {t("apply")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
