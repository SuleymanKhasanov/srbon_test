import { APP_API_ROUTES } from "@/shared/config/api-routes";
import {
  cargoApiErrorSchema,
  cargoListResponseSchema,
} from "./schemas";
import type { CargoListData, CargoListParams } from "./types";

export class CargoApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly errorCode:
      | "TOKEN_EXPIRED"
      | "UPSTREAM_ERROR"
      | "INVALID_QUERY"
      | "NETWORK"
      | "PARSE",
    public readonly description?: string,
  ) {
    super(`${errorCode}: ${description ?? code}`);
    this.name = "CargoApiError";
  }
}

function buildQuery(params: CargoListParams): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    usp.set(key, String(value));
  }
  return usp.toString();
}

export async function fetchCargoList(
  params: CargoListParams,
  signal?: AbortSignal,
): Promise<CargoListData> {
  const qs = buildQuery(params);
  const url = `${APP_API_ROUTES.cargo}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const parsedError = cargoApiErrorSchema.safeParse(json);
    if (parsedError.success) {
      throw new CargoApiError(
        parsedError.data.code,
        parsedError.data.errorCode ?? "UPSTREAM_ERROR",
        parsedError.data.description,
      );
    }
    throw new CargoApiError(
      res.status,
      res.status === 401 ? "TOKEN_EXPIRED" : "NETWORK",
      `HTTP ${res.status}`,
    );
  }

  const parsed = cargoListResponseSchema.safeParse(json);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[cargoApi] Zod parse failed",
        parsed.error.issues,
        "first item:",
        json?.data?.items?.[0],
      );
    }
    throw new CargoApiError(200, "PARSE", parsed.error.message);
  }
  return parsed.data.data;
}
