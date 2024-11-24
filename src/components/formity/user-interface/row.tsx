import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RowProps {
  items: ReactNode[];
  columns: number;
}

export default function Row({ items, columns }: RowProps) {
  return (
    <div className={cn(
      "grid grid-cols-[repeat(auto-fit,minmax(theme(spacing.40),1fr))] gap-4", {
        "grid-cols-3": columns === 3,
      }
    )}>
      {items}
    </div>
  );
}
