"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";

/* ── Context ── */

interface FileTreeContextValue {
  expanded: Set<string>;
  toggleExpanded: (path: string) => void;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

const FileTreeContext = createContext<FileTreeContextValue>({
  expanded: new Set(),
  toggleExpanded: () => {},
});

/* ── Root ── */

interface FileTreeProps {
  expanded?: Set<string>;
  defaultExpanded?: Set<string>;
  selectedPath?: string;
  onSelect?: (path: string) => void;
  onExpandedChange?: (expanded: Set<string>) => void;
  className?: string;
  children: ReactNode;
}

export const FileTree: FC<FileTreeProps> = ({
  expanded: controlledExpanded,
  defaultExpanded,
  selectedPath,
  onSelect,
  onExpandedChange,
  className,
  children,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    defaultExpanded ?? new Set()
  );
  const expanded = controlledExpanded ?? internalExpanded;

  const toggleExpanded = useCallback(
    (path: string) => {
      const next = new Set(expanded);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [expanded, onExpandedChange]
  );

  return (
    <FileTreeContext.Provider
      value={{ expanded, toggleExpanded, selectedPath, onSelect }}
    >
      <div
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-sm p-2 text-sm",
          className
        )}
        role="tree"
      >
        {children}
      </div>
    </FileTreeContext.Provider>
  );
};

/* ── Folder ── */

interface FileTreeFolderProps {
  path: string;
  name: string;
  className?: string;
  children?: ReactNode;
}

export const FileTreeFolder: FC<FileTreeFolderProps> = ({
  path,
  name,
  className,
  children,
}) => {
  const { expanded, toggleExpanded } = useContext(FileTreeContext);
  const isOpen = expanded.has(path);

  return (
    <div className={className} role="treeitem">
      <button
        onClick={() => toggleExpanded(path)}
        className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-sm hover:bg-muted/50 transition-colors"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
        {isOpen ? (
          <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <Folder className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{name}</span>
      </button>
      {isOpen && children && (
        <div className="ml-4 border-l border-border pl-1" role="group">
          {children}
        </div>
      )}
    </div>
  );
};

/* ── File ── */

interface FileTreeFileProps {
  path: string;
  name: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const FileTreeFile: FC<FileTreeFileProps> = ({
  path,
  name,
  icon,
  className,
  children,
}) => {
  const { selectedPath, onSelect } = useContext(FileTreeContext);
  const isSelected = selectedPath === path;

  return (
    <div
      role="treeitem"
      className={cn(
        "group flex items-center gap-1 rounded-md px-1.5 py-1 text-sm cursor-pointer transition-colors",
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/50 text-foreground",
        className
      )}
      onClick={() => onSelect?.(path)}
    >
      <span className="size-3.5 shrink-0" />
      {icon ?? <File className="size-4 shrink-0 text-muted-foreground" />}
      <span className="truncate">{name}</span>
      {children}
    </div>
  );
};

/* ── Subcomponents ── */

export const FileTreeIcon: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => (
  <span className={cn("size-4 shrink-0", className)}>{children}</span>
);

export const FileTreeName: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => (
  <span className={cn("truncate", className)}>{children}</span>
);

interface FileTreeActionsProps {
  className?: string;
  children: ReactNode;
}

export const FileTreeActions: FC<FileTreeActionsProps> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
      className
    )}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);
