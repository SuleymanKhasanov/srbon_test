import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/switch-language";

export function Header() {
  const t = useTranslations("header");
  return (
    <div className="sticky top-2 z-30 px-3 md:px-6">
      <header className="container mx-auto flex h-14 items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur supports-[backdrop-filter]:bg-card/80 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo/logo.svg"
            alt="Sarbon"
            width={120}
            height={32}
            priority
            className="h-7 w-auto md:h-8"
          />
          <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />
          <p className="hidden text-xs leading-tight text-muted-foreground sm:block">
            {t("subtitle")}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </header>
    </div>
  );
}
