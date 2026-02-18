import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight, Check, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtCtx {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Ctx = createContext<ChainOfThoughtCtx | null>(null);

function useChainOfThought() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Must be used inside <ChainOfThought>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtProps extends React.ComponentProps<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ChainOfThought: FC<ChainOfThoughtProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <Ctx.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      <CollapsiblePrimitive.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        asChild
      >
        <div
          className={cn(
            "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CollapsiblePrimitive.Root>
    </Ctx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*  Header / Trigger                                                  */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtHeaderProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {}

export const ChainOfThoughtHeader: FC<ChainOfThoughtHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  const { open } = useChainOfThought();

  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/50 cursor-pointer",
        className
      )}
      {...props}
    >
      <ChevronRight
        size={14}
        className={cn(
          "shrink-0 text-muted-foreground transition-transform duration-200",
          open && "rotate-90"
        )}
      />
      {children}
    </CollapsiblePrimitive.Trigger>
  );
};

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtContentProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Content> {}

export const ChainOfThoughtContent: FC<ChainOfThoughtContentProps> = ({
  className,
  children,
  ...props
}) => (
  <CollapsiblePrimitive.Content
    className={cn(
      "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="space-y-1 px-4 pb-4">{children}</div>
  </CollapsiblePrimitive.Content>
);

/* ------------------------------------------------------------------ */
/*  Step                                                              */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtStepProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon;
  label?: string;
  description?: string;
  status?: "complete" | "active" | "pending";
}

export const ChainOfThoughtStep: FC<ChainOfThoughtStepProps> = ({
  icon: Icon,
  label,
  description,
  status = "pending",
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-start gap-3 py-2", className)}
    {...props}
  >
    <div className="mt-0.5 shrink-0">
      {status === "complete" ? (
        <div className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Check size={12} />
        </div>
      ) : status === "active" ? (
        <div className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Loader2 size={12} className="animate-spin" />
        </div>
      ) : (
        <div className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {Icon ? <Icon size={12} /> : <div className="size-1.5 rounded-full bg-muted-foreground" />}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0 space-y-1.5">
      {label && (
        <p
          className={cn(
            "text-sm leading-tight",
            status === "complete" && "text-foreground",
            status === "active" && "text-foreground font-medium",
            status === "pending" && "text-muted-foreground"
          )}
        >
          {label}
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Search Results                                                    */
/* ------------------------------------------------------------------ */

export const ChainOfThoughtSearchResults: FC<React.ComponentProps<"div">> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-wrap gap-1.5 mt-1", className)} {...props}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Search Result (Badge)                                             */
/* ------------------------------------------------------------------ */

export const ChainOfThoughtSearchResult: FC<
  React.ComponentProps<typeof Badge>
> = ({ className, children, ...props }) => (
  <Badge
    variant="secondary"
    className={cn("text-xs font-normal", className)}
    {...props}
  >
    {children}
  </Badge>
);

/* ------------------------------------------------------------------ */
/*  Image                                                             */
/* ------------------------------------------------------------------ */

interface ChainOfThoughtImageProps extends React.ComponentProps<"div"> {
  caption?: string;
}

export const ChainOfThoughtImage: FC<ChainOfThoughtImageProps> = ({
  caption,
  className,
  children,
  ...props
}) => (
  <div className={cn("mt-2 space-y-1.5", className)} {...props}>
    <div className="overflow-hidden rounded-md border border-border">
      {children}
    </div>
    {caption && (
      <p className="text-xs text-muted-foreground italic">{caption}</p>
    )}
  </div>
);
