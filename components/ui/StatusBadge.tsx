import { AlertTriangle, Leaf, Shield } from "lucide-react";
import React from "react";

interface StatusBadgeProps {
  /** "kritis" | "terancam" | "rentan" — matches species.json status field */
  status: string;
  /** Visual size of the badge */
  size?: "sm" | "md" | "lg";
  /** Whether badge is overlaid on a dark image (adjusts contrast) */
  overlay?: boolean;
  /** Show the icon alongside the text label */
  showIcon?: boolean;
  /** Additional class names */
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; label: string; iconEN: string; Icon: React.ElementType }
> = {
  kritis: {
    color: "var(--status-cr)",
    bg: "var(--status-cr-bg)",
    border: "var(--status-cr-border)",
    label: "Kritis",
    iconEN: "CR",
    Icon: AlertTriangle,
  },
  terancam: {
    color: "var(--status-en)",
    bg: "var(--status-en-bg)",
    border: "var(--status-en-border)",
    label: "Terancam",
    iconEN: "EN",
    Icon: Shield,
  },
  rentan: {
    color: "var(--status-vu)",
    bg: "var(--status-vu-bg)",
    border: "var(--status-vu-border)",
    label: "Rentan",
    iconEN: "VU",
    Icon: Leaf,
  },
};

const SIZE = {
  sm: { px: "px-2 py-0.5", text: "text-[10px]", icon: "w-2.5 h-2.5", minW: "min-w-[3rem]" },
  md: { px: "px-2.5 py-1", text: "text-xs", icon: "w-3 h-3", minW: "min-w-[3.5rem]" },
  lg: { px: "px-3 py-1.5", text: "text-sm", icon: "w-3.5 h-3.5", minW: "min-w-[4rem]" },
};

export default function StatusBadge({
  status,
  size = "md",
  overlay = false,
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["rentan"];
  const sz = SIZE[size];

  if (overlay) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide ${sz.px} ${sz.text} ${sz.minW} ${className}`}
        style={{
          background: "rgba(0,0,0,0.55)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        {showIcon && <cfg.Icon className={sz.icon} />}
        <span>{cfg.label}</span>
        <span className="opacity-70">· {cfg.iconEN}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${sz.px} ${sz.text} ${sz.minW} ${className}`}
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {showIcon && <cfg.Icon className={sz.icon} />}
      <span>{cfg.label}</span>
    </span>
  );
}
