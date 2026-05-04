"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCargoList } from "../api/cargoApi";
import type { CargoListParams } from "../api/types";

export function cargoListQueryKey(locale: string, params: CargoListParams) {
  return ["cargo-list", locale, params] as const;
}

export function useCargoList(params: CargoListParams) {
  const locale = useLocale();
  return useQuery({
    queryKey: cargoListQueryKey(locale, params),
    queryFn: ({ signal }) => fetchCargoList(params, signal),
    placeholderData: keepPreviousData,
  });
}
