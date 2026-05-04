import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CargoListPage } from "@/views/cargo-list";

export const dynamic = "force-dynamic";

export default async function DispatcherCargoRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <CargoListPage />
    </Suspense>
  );
}
