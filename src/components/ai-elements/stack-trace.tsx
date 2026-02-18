"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChevronDown, Copy, Check } from "lucide-react";

/* ── Types ── */

interface StackFrame {
  fn: string;
  file: string;
  line?: number;
  column?: number;
  isInternal: boolean;
}

interface ParsedTrace {
  errorType: string;
  errorMessage: string;
  frames: StackFrame[];
  raw: string;
}

function parseTrace(trace: string): ParsedTrace {
  const lines = trace.trim().split("\n");
  const firstLine = lines[0] ?? "";
  const colonIdx = firstLine.indexOf(":");
  const errorType = colonIdx > 0 ? firstLine.slice(0, colonIdx).trim() : "Error";
  const errorMessage = colonIdx > 0 ? firstLine.slice(colonIdx + 1).trim() : firstLine;

  const frames: StackFrame[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^at\s+(.+?)\s+\((.+?)(?::(\d+))?(?::(\d+))?\)$/);
    if (match) {
      frames.push({
        fn: match[1],
        file: match[2],
        line: match[3] ? Number(match[3]) : undefined,
        column: match[4] ? Number(match[4]) : undefined,
        isInternal: match[2].includes("node_modules") || match[2].startsWith("node:"),
      });
    }
  }

  return { errorType, errorMessage, frames, raw: trace };
}

/* ── Context ── */

interface StackTraceContextValue {
  parsed: ParsedTrace;
  open: boolean;
  setOpen: (v: boolean) => void;
  onFilePathClick?: (path: string, line?: number, column?: number) => void;
}

const StackTraceContext = createContext<StackTraceContextValue>({
  parsed: { errorType: "", errorMessage: "", frames: [], raw: "" },
  open: false,
  setOpen: () => {},
});

/* ── Root ── */

interface StackTraceProps {
  trace?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFilePathClick?: (path: string, line?: number, column?: number) => void;
  className?: string;
  children: ReactNode;
}

export const StackTrace: FC<StackTraceProps> = ({
  trace = "",
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  onFilePathClick,
  className,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      setInternalOpen(v);
      onOpenChange?.(v);
    },
    [onOpenChange]
  );

  const parsed = useMemo(() => parseTrace(trace), [trace]);

  return (
    <StackTraceContext.Provider value={{ parsed, open, setOpen, onFilePathClick }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            "rounded-lg border border-destructive/30 bg-card text-card-foreground shadow-sm overflow-hidden",
            className
          )}
        >
          {children}
        </div>
      </Collapsible>
    </StackTraceContext.Provider>
  );
};

/* ── Header ── */

export const StackTraceHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <CollapsibleTrigger asChild>
    <button
      className={cn(
        "flex w-full items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {children}
    </button>
  </CollapsibleTrigger>
);

export const StackTraceError: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-2 min-w-0", className)}>
    <AlertTriangle className="size-4 shrink-0 text-destructive" />
    {children}
  </div>
);

export const StackTraceErrorType: FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  const { parsed } = useContext(StackTraceContext);
  return (
    <span className={cn("font-semibold text-destructive shrink-0", className)}>
      {children ?? parsed.errorType}
    </span>
  );
};

export const StackTraceErrorMessage: FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  const { parsed } = useContext(StackTraceContext);
  return (
    <span className={cn("text-muted-foreground truncate", className)}>
      {children ?? parsed.errorMessage}
    </span>
  );
};

export const StackTraceActions: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn("flex items-center gap-1 shrink-0", className)}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

export const StackTraceCopyButton: FC<{
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
}> = ({ onCopy, onError, timeout = 2000, className }) => {
  const { parsed } = useContext(StackTraceContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parsed.raw);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  return (
    <Button variant="ghost" size="icon" className={cn("size-7", className)} onClick={handleCopy}>
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </Button>
  );
};

export const StackTraceExpandButton: FC<{ className?: string }> = ({ className }) => {
  const { open } = useContext(StackTraceContext);
  return (
    <ChevronDown
      className={cn(
        "size-3.5 text-muted-foreground transition-transform duration-200",
        open && "rotate-180",
        className
      )}
    />
  );
};

/* ── Content ── */

export const StackTraceContent: FC<{
  maxHeight?: number;
  className?: string;
  children: ReactNode;
}> = ({ maxHeight = 300, className, children }) => (
  <CollapsibleContent>
    <div
      className={cn("border-t border-border overflow-auto", className)}
      style={{ maxHeight }}
    >
      {children}
    </div>
  </CollapsibleContent>
);

/* ── Frames ── */

export const StackTraceFrames: FC<{
  showInternalFrames?: boolean;
  className?: string;
}> = ({ showInternalFrames = true, className }) => {
  const { parsed, onFilePathClick } = useContext(StackTraceContext);
  const frames = showInternalFrames
    ? parsed.frames
    : parsed.frames.filter((f) => !f.isInternal);

  return (
    <div className={cn("divide-y divide-border", className)}>
      {frames.map((frame, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-2 px-4 py-2 text-xs font-mono",
            frame.isInternal && "opacity-50"
          )}
        >
          <span className="text-muted-foreground shrink-0">at</span>
          <span className="text-foreground font-medium">{frame.fn}</span>
          <button
            className="text-muted-foreground hover:text-primary truncate transition-colors text-left"
            onClick={() =>
              onFilePathClick?.(frame.file, frame.line, frame.column)
            }
          >
            ({frame.file}
            {frame.line !== undefined && `:${frame.line}`}
            {frame.column !== undefined && `:${frame.column}`})
          </button>
        </div>
      ))}
    </div>
  );
};
