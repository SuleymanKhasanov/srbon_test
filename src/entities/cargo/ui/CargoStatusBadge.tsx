import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  SEARCHING_ALL:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:border-amber-400/30",
  SEARCHING:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:border-amber-400/30",
  IN_PROGRESS:
    "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-400/30",
  DELIVERED:
    "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-100 dark:border-emerald-400/30",
  CANCELLED:
    "bg-red-100 text-red-900 border-red-200 dark:bg-red-500/20 dark:text-red-100 dark:border-red-400/30",
  MODERATION:
    "bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-500/20 dark:text-violet-100 dark:border-violet-400/30",
  DRAFT: "bg-muted text-muted-foreground border-border",
};

export function CargoStatusBadge({ status }: { status: string }) {
  const t = useTranslations("status");
  const label = (() => {
    try {
      return t(status as never);
    } catch {
      return status;
    }
  })();
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border";
  return <Badge className={cn("border font-medium", style)}>{label}</Badge>;
}
