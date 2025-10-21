import LoadingState from "@/components/LoadingState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-w-[320px] w-full sm:px-8 lg:px-12 py-10 sm:py-16 gap-10 max-w-7xl mx-auto mt-10">
      <div className="w-full max-w-6xl">
        <Card className="w-full shadow-md">
          <CardHeader>
            <div className="flex flex-col px-10 gap-4">
              <Skeleton className="h-[20px] w-[160px]" />
              <Skeleton className="h-[20px] w-[160px]" />
              <Skeleton className="h-[20px] w-[160px]" />
            </div>
          </CardHeader>
        </Card>
        <div className="mt-6">
          <Card className="w-full min-w-[300px] shadow-sm">
            <div className="flex items-center justify-center px-10 gap-4">

              <div className="flex gap-4 ml-auto">
                <Skeleton className="h-[40px] w-[120px]" />
                <Skeleton className="h-[40px] w-[120px]" />
              </div>
            </div>
            <CardContent>
              <div className="container mx-auto p-6">
                <LoadingState
                  height={310}
                  width={230}
                  isCentered={false}
                  count={4}
                  isAlbums={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
