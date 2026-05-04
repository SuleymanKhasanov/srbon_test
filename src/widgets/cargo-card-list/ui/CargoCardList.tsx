"use client";

import { CargoCard, type Cargo } from "@/entities/cargo";

type Props = {
  items: Cargo[];
  onSelect?: (cargo: Cargo) => void;
  isFetching?: boolean;
};

export function CargoCardList({ items, onSelect, isFetching }: Props) {
  return (
    <div
      className="flex flex-col gap-3"
      aria-busy={isFetching ? "true" : undefined}
    >
      {items.map((cargo) => (
        <CargoCard key={cargo.id} cargo={cargo} onSelect={onSelect} />
      ))}
    </div>
  );
}
