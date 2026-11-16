export default function Loading() {
  return (
    <div className="page-wrap px-5 py-10" aria-busy="true">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-line" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-line">
            <div className="aspect-[16/10] animate-pulse bg-line" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
