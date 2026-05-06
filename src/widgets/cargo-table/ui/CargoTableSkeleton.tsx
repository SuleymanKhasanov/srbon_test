import { Skeleton } from "@/shared/ui/skeleton";
import { TableCell, TableRow } from "@/shared/ui/table";

const COL_WIDTHS = ["w-48", "w-40", "w-20", "w-24", "w-20", "w-24", "w-16"];

export function CargoTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="border-border">
          {COL_WIDTHS.map((w, j) => (
            <TableCell key={j} className="py-3">
              <Skeleton className={`h-4 ${w}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
