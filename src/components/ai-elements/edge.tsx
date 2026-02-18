"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";

/* ── Shared edge props ── */
interface EdgeProps {
  /** SVG path d attribute */
  d: string;
  className?: string;
}

/* ── Animated edge (solid, with dash animation) ── */
const Animated: FC<EdgeProps> = ({ d, className }) => (
  <g>
    <path
      d={d}
      fill="none"
      strokeWidth={2}
      className={cn("stroke-primary/40", className)}
    />
    <path
      d={d}
      fill="none"
      strokeWidth={2}
      strokeDasharray="6 4"
      className={cn("stroke-primary animate-edge-flow", className)}
    />
  </g>
);

/* ── Temporary edge (dashed, muted) ── */
const Temporary: FC<EdgeProps> = ({ d, className }) => (
  <path
    d={d}
    fill="none"
    strokeWidth={1.5}
    strokeDasharray="4 4"
    className={cn("stroke-muted-foreground/40", className)}
  />
);

export const Edge = { Animated, Temporary };
