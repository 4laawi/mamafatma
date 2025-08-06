import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Skeleton({ 
  className = "", 
  width = "w-full", 
  height = "h-4", 
  rounded = "md" 
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200",
        width,
        height,
        {
          "rounded-sm": rounded === "sm",
          "rounded-md": rounded === "md",
          "rounded-lg": rounded === "lg",
          "rounded-xl": rounded === "xl",
          "rounded-full": rounded === "full",
        },
        className
      )}
    />
  );
}

// Predefined skeleton components for common use cases
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4 h-full min-h-[280px] md:min-h-[300px]">
      <div className="relative mb-3 h-48 md:h-56 lg:h-64">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 flex flex-col w-full mb-3">
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="w-full flex flex-col items-center justify-end">
        <Skeleton className="w-20 h-6" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full aspect-[4/5] md:aspect-[21/7] rounded-none shadow-lg shadow-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center relative">
      <div className="w-full h-full bg-gray-200 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
      <div className="absolute inset-0 flex flex-col px-4 py-6 z-20 items-start text-left">
        <Skeleton className="w-3/4 h-8 md:h-12 lg:h-16 mb-4" />
        <Skeleton className="w-1/2 h-4 md:h-6" />
      </div>
    </div>
  );
}

export function ProductGallerySkeleton() {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center px-0 md:px-6">
      <div className="w-full max-w-lg bg-white overflow-hidden shadow-xl">
        <div className="aspect-square bg-gray-200 animate-pulse" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 flex justify-center gap-2 px-4 py-1 rounded-full bg-white/80 shadow">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-2.5 h-2.5 rounded-full" />
          ))}
        </div>
      </div>
      <div className="hidden md:flex gap-3 mt-5 justify-center">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-16 h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ProductInfoSkeleton() {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 px-4 md:px-0 mt-6 md:mt-0">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="w-3/4 h-8 md:h-12" />
        <div className="flex flex-wrap gap-2 items-center mt-1">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
        <Skeleton className="w-24 h-8" />
      </div>
      <Skeleton className="w-full h-20" />
      <div className="sticky bottom-4 flex w-full gap-1 z-20 items-center justify-between">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="flex-1 h-16 rounded-2xl" />
      </div>
    </div>
  );
} 