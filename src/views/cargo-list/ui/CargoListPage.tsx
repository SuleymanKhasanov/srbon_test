"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CargoPagination } from "@/features/paginate-cargo";
import { CargoDetailSheet } from "@/features/view-cargo-detail";
import { Header } from "@/widgets/header";
import { CargoCardList } from "@/widgets/cargo-card-list";
import { CargoFiltersPanel } from "@/widgets/cargo-filters-panel";
import {
  CargoTable,
  CargoTableEmpty,
  CargoTableError,
} from "@/widgets/cargo-table";
import { useCargoList, type Cargo } from "@/entities/cargo";
import {
  isEmptyOfFilters,
  parseSearchParams,
} from "@/shared/lib/search-params";

export function CargoListPage() {
  const sp = useSearchParams();
  const params = useMemo(() => parseSearchParams(sp), [sp]);
  const filtersEmpty = useMemo(() => isEmptyOfFilters(params), [params]);

  const [selected, setSelected] = useState<Cargo | null>(null);
  const [open, setOpen] = useState(false);

  const query = useCargoList(params);

  const onSelect = (cargo: Cargo) => {
    setSelected(cargo);
    setOpen(true);
  };

  return (
    <div className="flex min-h-full flex-col pt-2">
      <Header />

      <main className="container mx-auto flex flex-1 flex-col gap-4 px-4 pt-4 pb-8 md:gap-6 md:px-6 md:pt-6 md:pb-12">
        <CargoFiltersPanel />

        <ErrorBoundary
          resetKeys={[params]}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <CargoTableError error={error} onRetry={resetErrorBoundary} />
          )}
        >
          {query.isError ? (
            <CargoTableError
              error={query.error}
              onRetry={() => query.refetch()}
            />
          ) : !query.isPending && query.data?.items.length === 0 ? (
            <CargoTableEmpty canReset={!filtersEmpty} />
          ) : (
            <>
              <div className="hidden md:block">
                <CargoTable
                  items={query.data?.items ?? []}
                  isFetching={query.isPending || query.isFetching}
                  onSelect={onSelect}
                />
              </div>
              <div className="md:hidden">
                <CargoCardList
                  items={query.data?.items ?? []}
                  onSelect={onSelect}
                  isFetching={query.isPending || query.isFetching}
                />
              </div>
              {query.data && (
                <CargoPagination
                  page={params.page ?? 1}
                  limit={params.limit ?? 20}
                  total={query.data.total}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      <CargoDetailSheet
        cargo={selected}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSelected(null);
        }}
      />
    </div>
  );
}
