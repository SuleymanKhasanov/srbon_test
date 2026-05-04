import { NextResponse, type NextRequest } from "next/server";
import { callSarbon } from "@/shared/api/server";
import { SARBON_ENDPOINTS } from "@/shared/config/api-routes";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/shared/i18n/routing";

const ALLOWED_PARAMS = new Set([
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
]);

function pickLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const queryLocale = req.nextUrl.searchParams.get("locale");
  const candidate = (queryLocale ?? cookieLocale ?? DEFAULT_LOCALE) as Locale;
  return (LOCALES as readonly string[]).includes(candidate)
    ? candidate
    : DEFAULT_LOCALE;
}

export async function GET(req: NextRequest) {
  const locale = pickLocale(req);
  const query: Record<string, string> = {};
  for (const [k, v] of req.nextUrl.searchParams.entries()) {
    if (ALLOWED_PARAMS.has(k) && v !== "") query[k] = v;
  }

  const result = await callSarbon<unknown>({
    path: SARBON_ENDPOINTS.cargoAll,
    query,
    locale,
    signal: req.signal,
  });

  if (result.ok) {
    return NextResponse.json(result.data, {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  if (result.error.kind === "token-expired") {
    return NextResponse.json(
      {
        status: "error",
        code: 401,
        errorCode: "TOKEN_EXPIRED",
        description: result.error.description,
      },
      { status: 401 },
    );
  }

  const status = result.error.kind === "upstream" ? result.error.status : 502;
  return NextResponse.json(
    {
      status: "error",
      code: status || 502,
      errorCode: "UPSTREAM_ERROR",
      description: result.error.description,
    },
    { status: 502 },
  );
}
