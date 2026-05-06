import type { Cargo, CargoType, RoutePoint } from "../api/types";
import type { Locale } from "@/shared/i18n/routing";

export function localizeCargoTypeName(
  type: CargoType | null,
  locale: Locale,
): string {
  if (!type) return "";
  switch (locale) {
    case "ru":
      return type.name_ru;
    case "uz":
      return type.name_uz;
    case "en":
      return type.name_en;
    default:
      return type.name_en;
  }
}

export function pickMainRoute(cargo: Cargo): {
  load: RoutePoint | null;
  unload: RoutePoint | null;
} {
  const sorted = [...cargo.route_points].sort(
    (a, b) => a.point_order - b.point_order,
  );
  const load = sorted.find((p) => p.is_main_load) ?? sorted.find((p) => p.type === "LOAD") ?? null;
  const unload =
    [...sorted].reverse().find((p) => p.is_main_unload) ??
    [...sorted].reverse().find((p) => p.type === "UNLOAD") ??
    null;
  return { load, unload };
}
