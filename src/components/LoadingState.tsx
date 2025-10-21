import { Skeleton } from "./ui/skeleton";

export default function LoadingState({
  height = 250,
  width = 400,
  count = 6,
  isCentered = false,
  isAlbums = false,
}: {
  height?: number;
  width?: number;
  count?: number;
  isCentered?: boolean;
  isAlbums?: boolean;
}) {
  return (
    <div className="container mx-auto px-4">
      <div
        style={{ justifyContent: isCentered ? "center" : "flex-start" }}
        className={
          isAlbums
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-wrap justify-center gap-4"
        }
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="space-y-2 max-w-[400px]">
            <Skeleton
              style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
              className=" rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
