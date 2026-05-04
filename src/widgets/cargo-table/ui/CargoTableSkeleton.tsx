import { Skeleton } from "@/shared/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function CargoTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i} className="border-border">
            <TableCell className="py-3">
              <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-5 w-20" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-4 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
