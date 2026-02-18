"use client";

import type { FC, ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

/* ── Types ── */

export interface QueueMessagePart {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
}

export interface QueueMessage {
  id: string;
  parts: QueueMessagePart[];
}

export interface QueueTodo {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}

/* ── Root ── */

interface QueueProps {
  className?: string;
  children: ReactNode;
}

export const Queue: FC<QueueProps> = ({ className, children }) => (
  <div className={cn("flex flex-col gap-2", className)}>{children}</div>
);

/* ── Section ── */

interface QueueSectionProps {
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export const QueueSection: FC<QueueSectionProps> = ({
  defaultOpen = true,
  className,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      {children}
    </Collapsible>
  );
};

interface QueueSectionTriggerProps {
  className?: string;
  children: ReactNode;
}

export const QueueSectionTrigger: FC<QueueSectionTriggerProps> = ({
  className,
  children,
}) => (
  <CollapsibleTrigger asChild>
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      {children}
      <ChevronDown className="ml-auto size-3 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
    </button>
  </CollapsibleTrigger>
);

interface QueueSectionLabelProps {
  label?: string;
  count?: number;
  icon?: ReactNode;
  className?: string;
}

export const QueueSectionLabel: FC<QueueSectionLabelProps> = ({
  label,
  count,
  icon,
  className,
}) => (
  <span className={cn("flex items-center gap-1.5", className)}>
    {icon}
    {label && <span>{label}</span>}
    {count !== undefined && (
      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
        {count}
      </span>
    )}
  </span>
);

interface QueueSectionContentProps {
  className?: string;
  children: ReactNode;
}

export const QueueSectionContent: FC<QueueSectionContentProps> = ({
  className,
  children,
}) => (
  <CollapsibleContent>
    <div className={cn("mt-1", className)}>{children}</div>
  </CollapsibleContent>
);

/* ── List ── */

interface QueueListProps {
  className?: string;
  children: ReactNode;
}

export const QueueList: FC<QueueListProps> = ({ className, children }) => (
  <ScrollArea className={cn("max-h-64", className)}>
    <ul className="flex flex-col">{children}</ul>
  </ScrollArea>
);

/* ── Item ── */

interface QueueItemProps {
  className?: string;
  children: ReactNode;
}

export const QueueItem: FC<QueueItemProps> = ({ className, children }) => (
  <li
    className={cn(
      "group flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors",
      className
    )}
  >
    {children}
  </li>
);

interface QueueItemIndicatorProps {
  completed?: boolean;
  className?: string;
}

export const QueueItemIndicator: FC<QueueItemIndicatorProps> = ({
  completed = false,
  className,
}) => (
  <span className={cn("mt-0.5 shrink-0", className)}>
    {completed ? (
      <CheckCircle2 className="size-4 text-primary" />
    ) : (
      <Circle className="size-4 text-muted-foreground" />
    )}
  </span>
);

interface QueueItemContentProps {
  completed?: boolean;
  className?: string;
  children: ReactNode;
}

export const QueueItemContent: FC<QueueItemContentProps> = ({
  completed = false,
  className,
  children,
}) => (
  <span
    className={cn(
      "flex-1 text-sm",
      completed && "line-through text-muted-foreground",
      className
    )}
  >
    {children}
  </span>
);

interface QueueItemDescriptionProps {
  completed?: boolean;
  className?: string;
  children: ReactNode;
}

export const QueueItemDescription: FC<QueueItemDescriptionProps> = ({
  completed,
  className,
  children,
}) => (
  <div
    className={cn(
      "text-xs text-muted-foreground mt-0.5",
      completed && "line-through",
      className
    )}
  >
    {children}
  </div>
);

interface QueueItemActionsProps {
  className?: string;
  children: ReactNode;
}

export const QueueItemActions: FC<QueueItemActionsProps> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
      className
    )}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

interface QueueItemActionProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const QueueItemAction: FC<QueueItemActionProps> = ({
  className,
  children,
  onClick,
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("size-6", className)}
    onClick={onClick}
  >
    {children}
  </Button>
);
