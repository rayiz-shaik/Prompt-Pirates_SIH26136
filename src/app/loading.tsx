import { Skeleton } from "@/components/ui/Skeleton";
export default function Loading() {
  return <div role="status" aria-label="Loading" className="space-y-4 p-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-40" /></div>;
}
