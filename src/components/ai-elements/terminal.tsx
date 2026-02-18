"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, TerminalSquare } from "lucide-react";

/* ── Context ── */

interface TerminalContextValue {
  output: string;
  isStreaming: boolean;
  onClear?: () => void;
}

const TerminalContext = createContext<TerminalContextValue>({
  output: "",
  isStreaming: false,
});

/* ── Root ── */

interface TerminalProps {
  output?: string;
  isStreaming?: boolean;
  autoScroll?: boolean;
  onClear?: () => void;
  className?: string;
  children: ReactNode;
}

export const Terminal: FC<TerminalProps> = ({
  output = "",
  isStreaming = false,
  onClear,
  className,
  children,
}) => (
  <TerminalContext.Provider value={{ output, isStreaming, onClear }}>
    <div
      className={cn(
        "rounded-lg border border-border bg-[hsl(var(--card))] text-card-foreground shadow-sm overflow-hidden font-mono text-sm",
        className
      )}
    >
      {children}
    </div>
  </TerminalContext.Provider>
);

/* ── Header ── */

export const TerminalHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "flex items-center justify-between border-b border-border px-4 py-2",
      className
    )}
  >
    {children}
  </div>
);

export const TerminalTitle: FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-2 text-xs font-medium", className)}>
    <TerminalSquare className="size-3.5 text-muted-foreground" />
    {children ?? "Terminal"}
  </div>
);

export const TerminalStatus: FC<{ className?: string }> = ({ className }) => {
  const { isStreaming } = useContext(TerminalContext);
  if (!isStreaming) return null;
  return (
    <div className={cn("flex items-center gap-1.5 text-[10px] text-muted-foreground", className)}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      Running
    </div>
  );
};

export const TerminalActions: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-1", className)}>{children}</div>
);

export const TerminalCopyButton: FC<{
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
}> = ({ onCopy, onError, timeout = 2000, className }) => {
  const { output } = useContext(TerminalContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  return (
    <Button variant="ghost" size="icon" className={cn("size-6", className)} onClick={handleCopy}>
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </Button>
  );
};

export const TerminalClearButton: FC<{ className?: string }> = ({ className }) => {
  const { onClear } = useContext(TerminalContext);
  if (!onClear) return null;
  return (
    <Button variant="ghost" size="icon" className={cn("size-6", className)} onClick={onClear}>
      <Trash2 className="size-3" />
    </Button>
  );
};

/* ── Content ── */

export const TerminalContent: FC<{
  className?: string;
  children?: ReactNode;
}> = ({ className }) => {
  const { output, isStreaming } = useContext(TerminalContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "max-h-64 overflow-auto p-4 text-xs leading-relaxed whitespace-pre-wrap",
        className
      )}
    >
      {output}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3.5 bg-foreground animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
};
