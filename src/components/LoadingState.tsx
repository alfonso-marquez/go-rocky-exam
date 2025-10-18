import { Skeleton } from "./ui/skeleton";

export default function LoadingState({
  height = 250,
  width = 400,
  count = 6,
  isCentered = false,
}: {
  height?: number;
  width?: number;
  count?: number;
  isCentered?: boolean;
}) {
  return (
    <div className="container mx-auto px-4">
      <div
        style={{ justifyContent: isCentered ? "center" : "flex-start" }}
        className="flex flex-wrap justify-center gap-6 "
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="space-y-2 max-w-[400px]">
            <Skeleton
              style={{ height: `${height}px`, width: `${width}px` }}
              className=" rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
