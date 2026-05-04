"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import type { FilterFormValues } from "./schema";

const FORM_KEYS = [
  "q",
  "truck_type",
  "from_city_code",
  "to_city_code",
  "weight_min",
  "weight_max",
  "created_from",
  "created_to",
  "with_offers",
] as const;

type InstantKey = "page" | "limit" | "status" | "sort";

function spToObject(sp: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of sp.entries()) out[k] = v;
  return out;
}

export function useFiltersState() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const initialValues: FilterFormValues = useMemo(
    () => ({
      q: sp.get("q") ?? "",
      truck_type: sp.get("truck_type") ?? "",
      from_city_code: sp.get("from_city_code") ?? "",
      to_city_code: sp.get("to_city_code") ?? "",
      weight_min: sp.get("weight_min") ?? "",
      weight_max: sp.get("weight_max") ?? "",
      created_from: sp.get("created_from") ?? "",
      created_to: sp.get("created_to") ?? "",
      with_offers: sp.get("with_offers") === "true",
    }),
    [sp],
  );

  const writeUrl = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      startTransition(() => {
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  const applyFilters = useCallback(
    (values: FilterFormValues) => {
      const next = new URLSearchParams(spToObject(sp));
      for (const key of FORM_KEYS) {
        const value = values[key as keyof FilterFormValues];
        if (key === "with_offers") {
          if (value) next.set(key, "true");
          else next.delete(key);
        } else {
          const str = (value as string | undefined)?.trim() ?? "";
          if (str) next.set(key, str);
          else next.delete(key);
        }
      }
      next.set("page", "1");
      writeUrl(next);
    },
    [sp, writeUrl],
  );

  const setInstant = useCallback(
    (patch: Partial<Record<InstantKey, string | number>>) => {
      const next = new URLSearchParams(spToObject(sp));
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === null || v === "") next.delete(k);
        else next.set(k, String(v));
      }
      writeUrl(next);
    },
    [sp, writeUrl],
  );

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams();
    next.set("page", "1");
    next.set("limit", sp.get("limit") ?? "20");
    next.set("status", "SEARCHING_ALL");
    next.set("sort", "created_at:desc");
    writeUrl(next);
  }, [sp, writeUrl]);

  return { initialValues, applyFilters, resetFilters, setInstant, isPending };
}
