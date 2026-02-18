"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, Code, MonitorPlay } from "lucide-react";

/* ── Types ── */
export type SandboxState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

const stateLabels: Record<SandboxState, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "input-streaming": { label: "Running", variant: "secondary" },
  "input-available": { label: "Pending", variant: "outline" },
  "output-available": { label: "Completed", variant: "default" },
  "output-error": { label: "Error", variant: "destructive" },
};

/* ── Root ── */
interface SandboxProps {
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export const Sandbox: FC<SandboxProps> = ({
  defaultOpen = true,
  className,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </Collapsible>
  );
};

/* ── Header ── */
interface SandboxHeaderProps {
  title?: string;
  state?: SandboxState;
  className?: string;
}

export const SandboxHeader: FC<SandboxHeaderProps> = ({
  title = "code.tsx",
  state = "output-available",
  className,
}) => {
  const { label, variant } = stateLabels[state];
  return (
    <CollapsibleTrigger asChild>
      <button
        className={cn(
          "flex w-full items-center justify-between gap-2 border-b border-border px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Code className="size-4 text-muted-foreground" />
          <span className="font-medium">{title}</span>
          <Badge variant={variant} className="text-[10px] px-1.5 py-0">
            {label}
          </Badge>
        </div>
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
      </button>
    </CollapsibleTrigger>
  );
};

/* ── Content ── */
interface SandboxContentProps {
  className?: string;
  children: ReactNode;
}

export const SandboxContent: FC<SandboxContentProps> = ({
  className,
  children,
}) => (
  <CollapsibleContent>
    <div className={cn(className)}>{children}</div>
  </CollapsibleContent>
);

/* ── Tabs ── */
export const SandboxTabs: FC<{
  defaultValue?: string;
  className?: string;
  children: ReactNode;
}> = ({ defaultValue = "code", className, children }) => (
  <Tabs defaultValue={defaultValue} className={className}>
    {children}
  </Tabs>
);

export const SandboxTabsBar: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      "flex items-center border-b border-border bg-muted/30 px-2",
      className
    )}
  >
    {children}
  </div>
);

export const SandboxTabsList: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => (
  <TabsList
    className={cn("h-8 bg-transparent gap-1 p-0", className)}
  >
    {children}
  </TabsList>
);

export const SandboxTabsTrigger: FC<{
  value: string;
  className?: string;
  children: ReactNode;
}> = ({ value, className, children }) => (
  <TabsTrigger
    value={value}
    className={cn(
      "h-8 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
      className
    )}
  >
    {children}
  </TabsTrigger>
);

export const SandboxTabContent: FC<{
  value: string;
  className?: string;
  children: ReactNode;
}> = ({ value, className, children }) => (
  <TabsContent value={value} className={cn("mt-0", className)}>
    {children}
  </TabsContent>
);
