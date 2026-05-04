"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import { LOCALES, type Locale } from "@/shared/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        startTransition(() => {
          router.replace(pathname, { locale: next as Locale });
        });
      }}
      disabled={isPending}
    >
      <SelectTrigger className="h-8 w-[130px] gap-1.5">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue>
          {(v: string) =>
            (LOCALES as readonly string[]).includes(v)
              ? t(v as Locale)
              : t(locale)
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((l) => (
          <SelectItem key={l} value={l}>
            {t(l)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
