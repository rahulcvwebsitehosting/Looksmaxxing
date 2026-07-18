"use client";

import { cn } from "@/lib/index";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div
      className={cn(
        "h-3 w-full bg-paper-aged pencil-border rounded-[8px_10px_8px_12px] overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-marker transition-all duration-500 ease-out",
          indicatorClassName
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
