import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ExternalLink, Link2 } from "lucide-react";

/* ─── Sources ─── */

const Sources: React.FC<React.ComponentPropsWithoutRef<typeof Collapsible>> = ({
  className,
  children,
  ...props
}) => (
  <Collapsible className={cn("w-full", className)} {...props}>
    {children}
  </Collapsible>
);
Sources.displayName = "Sources";

/* ─── SourcesTrigger ─── */

interface SourcesTriggerProps
  extends React.ComponentPropsWithoutRef<typeof CollapsibleTrigger> {
  count?: number;
}

const SourcesTrigger = React.forwardRef<HTMLButtonElement, SourcesTriggerProps>(
  ({ className, children, count, ...props }, ref) => (
    <CollapsibleTrigger
      ref={ref}
      className={cn(
        "group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      {...props}
    >
      <Link2 className="h-3.5 w-3.5" />
      <span>{children ?? "Sources"}</span>
      {count != null && (
        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] tabular-nums">
          {count}
        </span>
      )}
      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  )
);
SourcesTrigger.displayName = "SourcesTrigger";

/* ─── SourcesContent ─── */

const SourcesContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsibleContent
    ref={ref}
    className={cn("mt-2 flex flex-col gap-1", className)}
    {...props}
  >
    {children}
  </CollapsibleContent>
));
SourcesContent.displayName = "SourcesContent";

/* ─── Source ─── */

interface SourceProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
}

const Source = React.forwardRef<HTMLAnchorElement, SourceProps>(
  ({ className, title, href, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
        className
      )}
      {...props}
    >
      <ExternalLink className="h-3 w-3 shrink-0" />
      <span className="truncate">{title}</span>
    </a>
  )
);
Source.displayName = "Source";

export { Sources, SourcesTrigger, SourcesContent, Source };
