interface LoadingSkeletonProps {
  /** Type of skeleton to render */
  variant?: "card" | "list-item" | "text-block";
  /** Number of skeleton items to render */
  count?: number;
  /** Optional additional className */
  className?: string;
}

function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${className}`}
      style={{ borderColor: "var(--border-light)", background: "var(--bg-surface)" }}
    >
      {/* Image area */}
      <div
        className="w-full aspect-[4/5] shimmer"
        style={{ background: "var(--bg-muted)" }}
      />
      {/* Content area */}
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-3/4 rounded-full shimmer" />
        <div className="h-2.5 w-1/2 rounded-full shimmer" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 rounded-full shimmer" />
          <div className="h-5 w-16 rounded-full shimmer" />
        </div>
      </div>
    </div>
  );
}

function ListItemSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border ${className}`}
      style={{ borderColor: "var(--border-light)", background: "var(--bg-surface)" }}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl flex-shrink-0 shimmer" />
      {/* Text */}
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 rounded-full shimmer" />
        <div className="h-2.5 w-1/4 rounded-full shimmer" />
        <div className="h-2.5 w-1/2 rounded-full shimmer" />
      </div>
      {/* Badge area */}
      <div className="h-5 w-14 rounded-full shimmer flex-shrink-0" />
    </div>
  );
}

function TextBlockSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="h-4 w-full rounded-full shimmer" />
      <div className="h-4 w-11/12 rounded-full shimmer" />
      <div className="h-4 w-4/5 rounded-full shimmer" />
      <div className="h-4 w-3/4 rounded-full shimmer" />
    </div>
  );
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "card") {
    return (
      <>
        {items.map((i) => (
          <CardSkeleton key={i} className={className} />
        ))}
      </>
    );
  }

  if (variant === "list-item") {
    return (
      <div className="space-y-3">
        {items.map((i) => (
          <ListItemSkeleton key={i} className={className} />
        ))}
      </div>
    );
  }

  return (
    <>
      {items.map((i) => (
        <TextBlockSkeleton key={i} className={className} />
      ))}
    </>
  );
}
