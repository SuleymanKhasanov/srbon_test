import type { ReactNode } from "react";
import { Toaster } from "@/shared/ui/sonner";
import { IntlProvider } from "./intl-provider";
import { QueryProvider } from "./query-provider";

type Props = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function RootProvider({ children, locale, messages }: Props) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </IntlProvider>
  );
}
