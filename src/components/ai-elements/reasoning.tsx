import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Brain, ChevronDown } from "lucide-react";

/* ─── Reasoning ─── */

interface ReasoningProps extends React.ComponentPropsWithoutRef<typeof Collapsible> {
  duration?: number;
}

const ReasoningContext = React.createContext<{ duration?: number }>({});

const Reasoning: React.FC<ReasoningProps> = ({
  className,
  children,
  duration,
  ...props
}) => (
  <ReasoningContext.Provider value={{ duration }}>
    <Collapsible className={cn("w-full", className)} {...props}>
      {children}
    </Collapsible>
  </ReasoningContext.Provider>
);
Reasoning.displayName = "Reasoning";

/* ─── ReasoningTrigger ─── */

const ReasoningTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CollapsibleTrigger>
>(({ className, children, ...props }, ref) => {
  const { duration } = React.useContext(ReasoningContext);

  return (
    <CollapsibleTrigger
      ref={ref}
      className={cn(
        "group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      {...props}
    >
      <Brain className="h-3.5 w-3.5" />
      <span>{children ?? "Reasoning"}</span>
      {duration != null && (
        <span className="tabular-nums">{duration}s</span>
      )}
      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
});
ReasoningTrigger.displayName = "ReasoningTrigger";

/* ─── ReasoningContent ─── */

const ReasoningContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsibleContent
    ref={ref}
    className={cn(
      "mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </CollapsibleContent>
));
ReasoningContent.displayName = "ReasoningContent";

export { Reasoning, ReasoningTrigger, ReasoningContent };
