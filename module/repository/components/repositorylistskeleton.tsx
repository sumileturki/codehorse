import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RepositoryListSkeletonProps {
  count?: number;
}

export function RepositoryListSkeleton({
  count = 6,
}: RepositoryListSkeletonProps) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          {/* Header */}
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              {/* Left */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-20" />
                </div>

                <Skeleton className="h-4 w-full max-w-md" />
              </div>

              {/* Right actions */}
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
