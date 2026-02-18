"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

/* ── Context ── */

interface CodeBlockContextValue {
  code: string;
  language: string;
}

const CodeBlockContext = createContext<CodeBlockContextValue>({
  code: "",
  language: "text",
});

/* ── Root ── */

interface CodeBlockProps {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  children?: ReactNode;
}

export const CodeBlock: FC<CodeBlockProps> = ({
  code = "",
  language = "text",
  showLineNumbers = false,
  className,
  children,
}) => {
  const lines = code.split("\n");

  return (
    <CodeBlockContext.Provider value={{ code, language }}>
      <div
        className={cn(
          "group relative rounded-lg border border-border bg-muted/30 text-sm overflow-hidden",
          className
        )}
      >
        {children}
        <div className="overflow-auto">
          <pre className="p-4 text-xs font-mono leading-relaxed">
            {showLineNumbers ? (
              <table className="border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="pr-4 text-right text-muted-foreground select-none w-8">
                        {i + 1}
                      </td>
                      <td className="whitespace-pre-wrap">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <code className="whitespace-pre-wrap">{code}</code>
            )}
          </pre>
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

/* ── Header ── */

export const CodeBlockHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "flex items-center justify-between border-b border-border px-4 py-2 text-xs",
      className
    )}
  >
    {children}
  </div>
);

export const CodeBlockTitle: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
    {children}
  </div>
);

export const CodeBlockFilename: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <span className={cn("font-mono font-medium", className)}>{children}</span>
);

export const CodeBlockActions: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("flex items-center gap-2", className)}>{children}</div>
);

/* ── Copy Button ── */

interface CodeBlockCopyButtonProps {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
  size?: "default" | "sm" | "icon";
  children?: ReactNode;
}

export const CodeBlockCopyButton: FC<CodeBlockCopyButtonProps> = ({
  onCopy,
  onError,
  timeout = 2000,
  className,
  size = "icon",
}) => {
  const { code } = useContext(CodeBlockContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
      size={size}
      className={cn("size-7 shrink-0", className)}
      onClick={handleCopy}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </Button>
  );
};
