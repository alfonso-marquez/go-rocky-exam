import LoadingState from "@/components/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center  p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
      <div className="mx-auto my-30 w-full max-w-6xl">
        <Card>
          <div className="flex items-center justify-center px-10 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold md:mb-2">
                My Albums
              </h1>
              <p className="text-muted-foreground">All albums</p>
            </div>
            <div className="flex gap-2 ml-auto">
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
  );
}
