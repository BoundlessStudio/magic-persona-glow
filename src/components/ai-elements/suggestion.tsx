import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Suggestions ─── */

const Suggestions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap gap-2 px-4 py-2", className)}
    {...props}
  >
    {children}
  </div>
));
Suggestions.displayName = "Suggestions";

/* ─── Suggestion ─── */

interface SuggestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

const Suggestion = React.forwardRef<HTMLButtonElement, SuggestionProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Suggestion.displayName = "Suggestion";

export { Suggestions, Suggestion };
