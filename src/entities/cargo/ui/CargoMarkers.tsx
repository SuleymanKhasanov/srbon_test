import { Heart, Truck, Users, AlertTriangle, Snowflake } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Cargo } from "../api/types";

export function CargoMarkers({ cargo, className }: { cargo: Cargo; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {cargo.truck_type && (
        <Badge variant="outline" className="gap-1 px-1.5 py-0.5 text-[11px]">
          <Truck className="h-3 w-3" />
          {cargo.truck_type === "REFRIGERATOR" && (
            <Snowflake className="h-3 w-3 text-sky-500" />
          )}
          {cargo.truck_type}
        </Badge>
      )}
      {cargo.adr_enabled && (
        <Badge
          variant="outline"
          className="gap-1 border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-900 dark:bg-amber-500/15 dark:text-amber-100"
        >
          <AlertTriangle className="h-3 w-3" />
          ADR{cargo.adr_class ? ` ${cargo.adr_class}` : ""}
        </Badge>
      )}
      {cargo.is_two_drivers_required && (
        <Badge variant="outline" className="gap-1 px-1.5 py-0.5 text-[11px]">
          <Users className="h-3 w-3" />2
        </Badge>
      )}
      {cargo.is_liked && (
        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
      )}
    </div>
  );
}
