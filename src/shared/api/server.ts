import "server-only";

import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/shared/config/env";
import type { Locale } from "@/shared/i18n/routing";

const sarbonClient: AxiosInstance = axios.create({
  baseURL: env.SARBON_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "X-Device-Type": "web",
    "X-Client-Token": env.SARBON_CLIENT_TOKEN,
    "X-User-Token": env.SARBON_USER_TOKEN,
  },
});

export type SarbonError =
  | { kind: "token-expired"; status: number; description?: string }
  | { kind: "upstream"; status: number; description?: string }
  | { kind: "network"; description: string };

export async function callSarbon<T>(opts: {
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  locale: Locale;
  signal?: AbortSignal;
}): Promise<{ ok: true; data: T } | { ok: false; error: SarbonError }> {
  const params = opts.query
    ? Object.fromEntries(
        Object.entries(opts.query).filter(
          ([, v]) => v !== undefined && v !== null && v !== "",
        ),
      )
    : undefined;

  try {
    const res = await sarbonClient.get<T>(opts.path, {
      params,
      headers: { "X-Language": opts.locale },
      signal: opts.signal,
    });
    return { ok: true, data: res.data };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 0;
      const description =
        (err.response?.data as { description?: string } | undefined)
          ?.description ?? err.message;

      if (status === 401) {
        return {
          ok: false,
          error: { kind: "token-expired", status, description },
        };
      }
      return {
        ok: false,
        error: { kind: "upstream", status: status || 502, description },
      };
    }
    return {
      ok: false,
      error: {
        kind: "network",
        description: err instanceof Error ? err.message : "Unknown error",
      },
    };
  }
}
