export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="min-h-[40vh] animate-pulse bg-night/90" />
      <div className="page-wrap grid gap-4 px-5 py-10 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
