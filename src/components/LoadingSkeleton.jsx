export function PosterSkeleton() {
  return (
    <div className="shrink-0 w-[150px]">
      <div className="aspect-[2/3] rounded-2xl skeleton" />
      <div className="h-10 mt-2 rounded-xl skeleton" />
    </div>
  );
}

export function HorizontalSkeleton() {
  return <div className="h-[120px] rounded-2xl skeleton" />;
}

export function GridSkeleton() {
  return <div className="aspect-[2/3] rounded-2xl skeleton" />;
}

export default function LoadingSkeleton({ kind = "row" }) {
  if (kind === "row") {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <PosterSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (kind === "horizontal") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <HorizontalSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <GridSkeleton key={i} />
      ))}
    </div>
  );
}
