"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { CargoFiltersForm } from "@/features/filter-cargo";

type Props = {
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
};

export function CargoFiltersSheet({
  triggerLabel,
  triggerIcon,
  triggerClassName,
}: Props) {
  const t = useTranslations("filters");
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" className={triggerClassName}>
            {triggerIcon}
            {triggerLabel}
          </Button>
        }
      />
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-5">
          <CargoFiltersForm onSubmitted={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
