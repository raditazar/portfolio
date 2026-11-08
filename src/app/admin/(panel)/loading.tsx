import { Skeleton, SkeletonTiles, SkeletonRows } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-14 w-72 mb-10" />
      <SkeletonTiles count={4} className="mb-10" />
      <SkeletonRows count={4} />
    </div>
  );
}
