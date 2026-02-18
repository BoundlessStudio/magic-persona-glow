"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, MinusCircle, Loader2, ChevronDown } from "lucide-react";

/* ── Types ── */

export type TestStatus = "passed" | "failed" | "skipped" | "running";

export interface TestSummary {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration?: string;
}

/* ── Context ── */

interface TestResultsContextValue {
  summary?: TestSummary;
}

const TestResultsContext = createContext<TestResultsContextValue>({});

interface TestContextValue {
  name: string;
  status: TestStatus;
  duration?: number;
}

const TestContext = createContext<TestContextValue>({
  name: "",
  status: "passed",
});

/* ── Root ── */

interface TestResultsProps {
  summary?: TestSummary;
  className?: string;
  children: ReactNode;
}

export const TestResults: FC<TestResultsProps> = ({
  summary,
  className,
  children,
}) => (
  <TestResultsContext.Provider value={{ summary }}>
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  </TestResultsContext.Provider>
);

/* ── Header ── */

export const TestResultsHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "flex items-center justify-between border-b border-border px-4 py-3",
      className
    )}
  >
    {children}
  </div>
);

export const TestResultsSummary: FC<{ className?: string }> = ({ className }) => {
  const { summary } = useContext(TestResultsContext);
  if (!summary) return null;
  return (
    <div className={cn("flex items-center gap-3 text-xs", className)}>
      {summary.passed > 0 && (
        <span className="flex items-center gap-1 text-emerald-500 font-medium">
          {summary.passed} passed
        </span>
      )}
      {summary.failed > 0 && (
        <span className="flex items-center gap-1 text-destructive font-medium">
          {summary.failed} failed
        </span>
      )}
      {summary.skipped > 0 && (
        <span className="flex items-center gap-1 text-yellow-500 font-medium">
          {summary.skipped} skipped
        </span>
      )}
    </div>
  );
};

export const TestResultsDuration: FC<{ className?: string }> = ({ className }) => {
  const { summary } = useContext(TestResultsContext);
  if (!summary?.duration) return null;
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {summary.duration}
    </span>
  );
};

export const TestResultsProgress: FC<{ className?: string }> = ({ className }) => {
  const { summary } = useContext(TestResultsContext);
  if (!summary) return null;
  const pct = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
  return (
    <div className={cn("px-4 pb-3", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>{summary.passed}/{summary.total} tests passed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const TestResultsContent: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => <div className={cn("divide-y divide-border", className)}>{children}</div>;

/* ── Test Suite ── */

interface TestSuiteProps {
  name?: string;
  status?: TestStatus;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export const TestSuite: FC<TestSuiteProps> = ({
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

export const TestSuiteName: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <CollapsibleTrigger asChild>
    <button
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <ChevronDown className="size-3 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
      {children}
    </button>
  </CollapsibleTrigger>
);

export const TestSuiteStats: FC<{
  passed?: number;
  failed?: number;
  skipped?: number;
  className?: string;
}> = ({ passed, failed, skipped, className }) => (
  <div className={cn("flex items-center gap-2 ml-auto text-[10px]", className)}>
    {(passed ?? 0) > 0 && <span className="text-emerald-500">{passed} ✓</span>}
    {(failed ?? 0) > 0 && <span className="text-destructive">{failed} ✗</span>}
    {(skipped ?? 0) > 0 && <span className="text-yellow-500">{skipped} −</span>}
  </div>
);

export const TestSuiteContent: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <CollapsibleContent>
    <div className={cn("pl-6", className)}>{children}</div>
  </CollapsibleContent>
);

/* ── Individual Test ── */

interface TestProps {
  name?: string;
  status?: TestStatus;
  duration?: number;
  className?: string;
  children?: ReactNode;
}

export const Test: FC<TestProps> = ({
  name = "",
  status = "passed",
  duration,
  className,
  children,
}) => (
  <TestContext.Provider value={{ name, status, duration }}>
    <div className={cn("px-4 py-2", className)}>
      <div className="flex items-center gap-2 text-xs">
        <TestStatusIcon status={status} />
        <span
          className={cn(
            "flex-1",
            status === "failed" && "text-destructive",
            status === "skipped" && "text-muted-foreground line-through"
          )}
        >
          {name}
        </span>
        {duration !== undefined && (
          <span className="text-muted-foreground">{duration}ms</span>
        )}
      </div>
      {children}
    </div>
  </TestContext.Provider>
);

const TestStatusIcon: FC<{ status: TestStatus }> = ({ status }) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />;
    case "failed":
      return <XCircle className="size-3.5 text-destructive shrink-0" />;
    case "skipped":
      return <MinusCircle className="size-3.5 text-yellow-500 shrink-0" />;
    case "running":
      return <Loader2 className="size-3.5 text-primary animate-spin shrink-0" />;
  }
};

export const TestStatus: FC<{ className?: string }> = ({ className }) => {
  const { status } = useContext(TestContext);
  return <TestStatusIcon status={status} />;
};

export const TestName: FC<{ className?: string }> = ({ className }) => {
  const { name } = useContext(TestContext);
  return <span className={cn("text-xs", className)}>{name}</span>;
};

export const TestDuration: FC<{ className?: string }> = ({ className }) => {
  const { duration } = useContext(TestContext);
  if (duration === undefined) return null;
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {duration}ms
    </span>
  );
};

/* ── Error ── */

export const TestError: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("mt-2 rounded-md bg-destructive/10 p-2", className)}>
    {children}
  </div>
);

export const TestErrorMessage: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <p className={cn("text-xs text-destructive font-medium", className)}>
    {children}
  </p>
);

export const TestErrorStack: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <pre
    className={cn(
      "mt-1 text-[10px] text-muted-foreground font-mono whitespace-pre-wrap overflow-auto max-h-32",
      className
    )}
  >
    {children}
  </pre>
);
