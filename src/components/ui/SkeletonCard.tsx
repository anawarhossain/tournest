export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        <div className="h-3 w-full rounded bg-neutral-200" />
        <div className="h-3 w-2/3 rounded bg-neutral-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-16 rounded bg-neutral-200" />
          <div className="h-8 w-24 rounded-lg bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
