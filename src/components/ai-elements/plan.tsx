"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanContextValue {
  isStreaming: boolean;
}

const PlanContext = createContext<PlanContextValue>({ isStreaming: false });

interface PlanProps {
  isStreaming?: boolean;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export const Plan: FC<PlanProps> = ({
  isStreaming = false,
  defaultOpen = false,
  className,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <PlanContext.Provider value={{ isStreaming }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
            className
          )}
        >
          {children}
        </div>
      </Collapsible>
    </PlanContext.Provider>
  );
};

interface PlanHeaderProps {
  className?: string;
  children: ReactNode;
}

export const PlanHeader: FC<PlanHeaderProps> = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-1.5 p-4", className)}>
    {children}
  </div>
);

interface PlanTitleProps {
  className?: string;
  children?: string;
}

export const PlanTitle: FC<PlanTitleProps> = ({ className, children }) => {
  const { isStreaming } = useContext(PlanContext);

  return (
    <h3
      className={cn(
        "text-sm font-semibold leading-none tracking-tight",
        isStreaming && !children && "h-4 w-48 animate-pulse rounded bg-muted",
        className
      )}
    >
      {children}
    </h3>
  );
};

interface PlanDescriptionProps {
  className?: string;
  children?: string;
}

export const PlanDescription: FC<PlanDescriptionProps> = ({
  className,
  children,
}) => {
  const { isStreaming } = useContext(PlanContext);

  return (
    <p
      className={cn(
        "text-xs text-muted-foreground",
        isStreaming && !children && "h-3 w-full animate-pulse rounded bg-muted mt-1",
        className
      )}
    >
      {children}
    </p>
  );
};

interface PlanTriggerProps {
  className?: string;
  children?: ReactNode;
}

export const PlanTrigger: FC<PlanTriggerProps> = ({ className, children }) => (
  <CollapsibleTrigger asChild>
    <button
      className={cn(
        "flex items-center gap-1 px-4 pb-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
        className
      )}
    >
      {children ?? "Toggle plan"}
      <ChevronDown className="size-3 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
    </button>
  </CollapsibleTrigger>
);

interface PlanContentProps {
  className?: string;
  children: ReactNode;
}

export const PlanContent: FC<PlanContentProps> = ({ className, children }) => (
  <CollapsibleContent>
    <div className={cn("px-4 pb-4 text-sm text-muted-foreground", className)}>
      {children}
    </div>
  </CollapsibleContent>
);

interface PlanFooterProps {
  className?: string;
  children: ReactNode;
}

export const PlanFooter: FC<PlanFooterProps> = ({ className, children }) => (
  <div
    className={cn(
      "flex items-center justify-end gap-2 border-t border-border px-4 py-3",
      className
    )}
  >
    {children}
  </div>
);

interface PlanActionProps {
  className?: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary";
  onClick?: () => void;
}

export const PlanAction: FC<PlanActionProps> = ({
  className,
  children,
  variant = "default",
  onClick,
}) => (
  <Button
    variant={variant}
    size="sm"
    className={cn("text-xs", className)}
    onClick={onClick}
  >
    {children}
  </Button>
);
