import React from "react";

interface SectionHeaderProps {
  /** Small uppercase label above the heading */
  eyebrow?: string;
  /** Main heading text */
  title: string;
  /** Portion of the title to render with gradient text */
  titleGradient?: string;
  /** Subtitle / description text */
  description?: string;
  /** Text alignment */
  align?: "left" | "center";
  /** Optional right-side action element (e.g. "Lihat semua" link) */
  action?: React.ReactNode;
  /** Additional className on the wrapper */
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleGradient,
  description,
  align = "left",
  action,
  className = "",
}: SectionHeaderProps) {
  const center = align === "center";

  // Split title around the gradient portion
  const renderTitle = () => {
    if (!titleGradient || !title.includes(titleGradient)) {
      return <span>{title}</span>;
    }
    const [before, after] = title.split(titleGradient);
    return (
      <>
        {before}
        <span className="text-gradient">{titleGradient}</span>
        {after}
      </>
    );
  };

  return (
    <div className={`${center ? "text-center" : "flex items-end justify-between gap-4"} mb-8 ${className}`}>
      <div className={center ? "mx-auto max-w-2xl" : "flex-1"}>
        {eyebrow && (
          <p
            className={`section-label ${center ? "justify-center" : ""}`}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className="text-3xl sm:text-4xl font-bold leading-tight mb-0"
          style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.02em" }}
        >
          {renderTitle()}
        </h2>

        {description && (
          <p
            className="mt-3 text-sm leading-relaxed max-w-xl"
            style={{
              color: "var(--text-muted)",
              marginLeft: center ? "auto" : 0,
              marginRight: center ? "auto" : 0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {action && !center && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
}
