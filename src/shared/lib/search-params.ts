import type { CargoListParams } from "@/entities/cargo/api/types";

export const DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
  sort: "created_at:desc",
  status: "SEARCHING_ALL",
} as const;

export const LIMIT_OPTIONS = [10, 20, 50] as const;
export type LimitOption = (typeof LIMIT_OPTIONS)[number];

const NUMBER_KEYS = new Set([
  "page",
  "limit",
  "weight_min",
  "weight_max",
]);
const BOOLEAN_KEYS = new Set(["with_offers"]);

function readString(
  sp: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? undefined;
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

export function parseSearchParams(
  sp: URLSearchParams | Record<string, string | string[] | undefined>,
): CargoListParams {
  const out: CargoListParams = {};
  const keys = [
    "page",
    "limit",
    "sort",
    "status",
    "truck_type",
    "weight_min",
    "weight_max",
    "created_from",
    "created_to",
    "with_offers",
    "q",
    "company_id",
    "from_city_code",
    "to_city_code",
  ] as const;

  for (const k of keys) {
    const raw = readString(sp, k);
    if (raw === undefined || raw === "") continue;
    if (NUMBER_KEYS.has(k)) {
      const n = Number(raw);
      if (!Number.isNaN(n)) (out as Record<string, unknown>)[k] = n;
    } else if (BOOLEAN_KEYS.has(k)) {
      (out as Record<string, unknown>)[k] = raw === "true";
    } else {
      (out as Record<string, unknown>)[k] = raw;
    }
  }

  out.page ??= DEFAULT_PARAMS.page;
  out.limit ??= DEFAULT_PARAMS.limit;
  out.sort ??= DEFAULT_PARAMS.sort;
  out.status ??= DEFAULT_PARAMS.status;
  return out;
}

export function serializeParams(params: CargoListParams): string {
  const usp = new URLSearchParams();
  const ordered: (keyof CargoListParams)[] = [
    "page",
    "limit",
    "sort",
    "status",
    "truck_type",
    "weight_min",
    "weight_max",
    "created_from",
    "created_to",
    "with_offers",
    "q",
    "company_id",
    "from_city_code",
    "to_city_code",
  ];
  for (const k of ordered) {
    const v = params[k];
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  return usp.toString();
}

export function isEmptyOfFilters(params: CargoListParams): boolean {
  const meaningful: (keyof CargoListParams)[] = [
    "truck_type",
    "weight_min",
    "weight_max",
    "created_from",
    "created_to",
    "with_offers",
    "q",
    "company_id",
    "from_city_code",
    "to_city_code",
  ];
  return meaningful.every((k) => params[k] === undefined || params[k] === "");
}
