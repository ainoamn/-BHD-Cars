export default function Loading() {
  return (
    <div className="page-wrap px-5 py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-3 w-28 animate-pulse rounded bg-line" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-4 w-full animate-pulse rounded bg-line" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-line" />
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-line" />
          <div className="h-28 animate-pulse rounded-2xl bg-line" />
          <div className="h-28 animate-pulse rounded-2xl bg-line" />
        </div>
      </div>
    </div>
  );
}
