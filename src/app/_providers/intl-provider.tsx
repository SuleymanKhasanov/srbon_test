"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { DEFAULT_TIME_ZONE } from "@/shared/i18n/routing";

type Props = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function IntlProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={DEFAULT_TIME_ZONE}
    >
      {children}
    </NextIntlClientProvider>
  );
}
