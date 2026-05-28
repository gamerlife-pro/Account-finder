import React from "react";

export default function SkeletonCard() {
  return (
    <div className="p-4.5 border border-slate-205 dark:border-white/10 rounded-2xl bg-white/70 dark:bg-white/[0.03] glass shadow-sm space-y-4 animate-pulse">
      {/* Upper header section */}
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
        </div>
        <div className="w-16 h-5 bg-slate-200 dark:bg-white/10 rounded" />
      </div>

      {/* Bio section */}
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-5/6" />
      </div>

      {/* Tags section */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <div className="w-14 h-5 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="w-16 h-5 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="w-12 h-5 bg-slate-200 dark:bg-white/10 rounded" />
      </div>

      {/* Numerical logs splits */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded w-12" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20" />
        </div>
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded w-12" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20" />
        </div>
      </div>

      {/* Bottom buttons actions skeleton */}
      <div className="flex gap-2 pt-1">
        <div className="flex-1 h-8 bg-slate-200 dark:bg-white/10 rounded-lg" />
        <div className="w-20 h-8 bg-slate-200 dark:bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}
