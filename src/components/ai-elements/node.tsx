"use client";

import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Handle (diamond connector) ── */
export const NodeHandle: FC<{
  position: "left" | "right";
  className?: string;
}> = ({ position, className }) => (
  <div
    className={cn(
      "absolute top-1/2 -translate-y-1/2 size-2 rotate-45 border border-muted-foreground/60 bg-card",
      position === "left" ? "-left-1" : "-right-1",
      className
    )}
  />
);

/* ── Node ── */
interface NodeProps {
  className?: string;
  children: ReactNode;
}

export const Node: FC<NodeProps> = ({ className, children }) => (
  <div
    className={cn(
      "relative rounded-lg border border-border bg-card text-card-foreground shadow-sm min-w-[180px] max-w-[240px]",
      className
    )}
  >
    {children}
  </div>
);

/* ── Header ── */
export const NodeHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("px-4 pt-3 pb-1", className)}>{children}</div>
);

/* ── Title ── */
export const NodeTitle: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <h4 className={cn("text-sm font-semibold leading-tight", className)}>
    {children}
  </h4>
);

/* ── Description ── */
export const NodeDescription: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => (
  <p className={cn("text-xs text-muted-foreground mt-0.5", className)}>
    {children}
  </p>
);

/* ── Content ── */
export const NodeContent: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => <div className={cn("px-4 py-2", className)}>{children}</div>;

/* ── Footer ── */
export const NodeFooter: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "px-4 pb-3 pt-1 border-t border-border text-xs text-muted-foreground",
      className
    )}
  >
    {children}
  </div>
);
