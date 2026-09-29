export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div aria-hidden className={`animate-pulse rounded bg-slate-200 ${className}`} />
);
