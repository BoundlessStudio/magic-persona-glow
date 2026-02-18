"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

/* ── Context ── */

interface EnvVarsContextValue {
  showValues: boolean;
  setShowValues: (v: boolean) => void;
}

const EnvVarsContext = createContext<EnvVarsContextValue>({
  showValues: false,
  setShowValues: () => {},
});

interface EnvVarContextValue {
  name: string;
  value: string;
}

const EnvVarContext = createContext<EnvVarContextValue>({
  name: "",
  value: "",
});

/* ── Root ── */

interface EnvironmentVariablesProps {
  showValues?: boolean;
  defaultShowValues?: boolean;
  onShowValuesChange?: (show: boolean) => void;
  className?: string;
  children: ReactNode;
}

export const EnvironmentVariables: FC<EnvironmentVariablesProps> = ({
  showValues: controlledShow,
  defaultShowValues = false,
  onShowValuesChange,
  className,
  children,
}) => {
  const [internalShow, setInternalShow] = useState(defaultShowValues);
  const showValues = controlledShow ?? internalShow;

  const setShowValues = useCallback(
    (v: boolean) => {
      setInternalShow(v);
      onShowValuesChange?.(v);
    },
    [onShowValuesChange]
  );

  return (
    <EnvVarsContext.Provider value={{ showValues, setShowValues }}>
      <div
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
          className
        )}
      >
        {children}
      </div>
    </EnvVarsContext.Provider>
  );
};

/* ── Header ── */

interface EnvironmentVariablesHeaderProps {
  className?: string;
  children: ReactNode;
}

export const EnvironmentVariablesHeader: FC<EnvironmentVariablesHeaderProps> = ({
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

interface EnvironmentVariablesTitleProps {
  className?: string;
  children?: ReactNode;
}

export const EnvironmentVariablesTitle: FC<EnvironmentVariablesTitleProps> = ({
  className,
  children,
}) => (
  <h3 className={cn("text-sm font-semibold", className)}>
    {children ?? "Environment Variables"}
  </h3>
);

export const EnvironmentVariablesToggle: FC<{ className?: string }> = ({
  className,
}) => {
  const { showValues, setShowValues } = useContext(EnvVarsContext);
  return (
    <Switch
      checked={showValues}
      onCheckedChange={setShowValues}
      className={className}
    />
  );
};

/* ── Content ── */

interface EnvironmentVariablesContentProps {
  className?: string;
  children: ReactNode;
}

export const EnvironmentVariablesContent: FC<
  EnvironmentVariablesContentProps
> = ({ className, children }) => (
  <div className={cn("divide-y divide-border", className)}>{children}</div>
);

/* ── Single Variable ── */

interface EnvironmentVariableProps {
  name: string;
  value: string;
  className?: string;
  children: ReactNode;
}

export const EnvironmentVariable: FC<EnvironmentVariableProps> = ({
  name,
  value,
  className,
  children,
}) => (
  <EnvVarContext.Provider value={{ name, value }}>
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-2.5",
        className
      )}
    >
      {children}
    </div>
  </EnvVarContext.Provider>
);

interface EnvironmentVariableGroupProps {
  className?: string;
  children: ReactNode;
}

export const EnvironmentVariableGroup: FC<EnvironmentVariableGroupProps> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-2", className)}>{children}</div>
);

export const EnvironmentVariableName: FC<{
  className?: string;
  children?: ReactNode;
}> = ({ className, children }) => {
  const { name } = useContext(EnvVarContext);
  return (
    <span className={cn("font-mono text-xs font-medium", className)}>
      {children ?? name}
    </span>
  );
};

export const EnvironmentVariableValue: FC<{
  className?: string;
  children?: ReactNode;
}> = ({ className, children }) => {
  const { value } = useContext(EnvVarContext);
  const { showValues } = useContext(EnvVarsContext);

  const masked = "•".repeat(Math.min(value.length, 20));

  return (
    <span className={cn("font-mono text-xs text-muted-foreground", className)}>
      {children ?? (showValues ? value : masked)}
    </span>
  );
};

interface EnvironmentVariableCopyButtonProps {
  copyFormat?: "name" | "value" | "export";
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
}

export const EnvironmentVariableCopyButton: FC<
  EnvironmentVariableCopyButtonProps
> = ({ copyFormat = "value", onCopy, onError, timeout = 2000, className }) => {
  const { name, value } = useContext(EnvVarContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      let text = value;
      if (copyFormat === "name") text = name;
      if (copyFormat === "export") text = `export ${name}="${value}"`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-6 shrink-0", className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-3 text-primary" />
      ) : (
        <Copy className="size-3 text-muted-foreground" />
      )}
    </Button>
  );
};

export const EnvironmentVariableRequired: FC<{
  className?: string;
  children?: ReactNode;
}> = ({ className, children }) => (
  <Badge
    variant="secondary"
    className={cn("text-[10px] font-normal px-1.5 py-0", className)}
  >
    {children ?? "Required"}
  </Badge>
);
