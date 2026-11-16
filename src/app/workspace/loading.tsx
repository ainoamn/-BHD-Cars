export default function Loading() {
  return (
    <div className="p-6" aria-busy="true">
      <div className="mb-4 h-8 w-56 animate-pulse rounded bg-[var(--desk-line,#dde8e3)]" />
      <div className="h-40 animate-pulse rounded-xl bg-[var(--desk-line,#dde8e3)]" />
    </div>
  );
}