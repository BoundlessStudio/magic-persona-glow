import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

interface WebPreviewCtx {
  url: string;
  setUrl: (u: string) => void;
}

const Ctx = createContext<WebPreviewCtx | null>(null);

function useWebPreview() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Must be used inside <WebPreview>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */

interface WebPreviewProps {
  defaultUrl?: string;
  className?: string;
  children?: ReactNode;
}

export const WebPreview: FC<WebPreviewProps> = ({
  defaultUrl = "https://www.example.com/",
  className,
  children,
}) => {
  const [url, setUrl] = useState(defaultUrl);

  return (
    <Ctx.Provider value={{ url, setUrl }}>
      <div
        className={cn(
          "flex flex-col rounded-lg border border-solid border-border bg-card overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*  Navigation bar                                                    */
/* ------------------------------------------------------------------ */

export const WebPreviewNavigation: FC<{ children?: ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center gap-1.5 border-b border-border px-2 py-1.5 bg-card">
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Navigation button                                                 */
/* ------------------------------------------------------------------ */

export const WebPreviewNavigationButton: FC<{
  tooltip?: string;
  onClick?: () => void;
  children?: ReactNode;
}> = ({ tooltip, onClick, children }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  URL bar                                                           */
/* ------------------------------------------------------------------ */

export const WebPreviewUrl: FC = () => {
  const { url, setUrl } = useWebPreview();

  return (
    <div className="flex-1 mx-1">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="/"
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Body (iframe / placeholder)                                       */
/* ------------------------------------------------------------------ */

export const WebPreviewBody: FC<{ className?: string }> = ({ className }) => {
  const { url } = useWebPreview();

  return (
    <div className={cn("relative flex-1 min-h-0 bg-background", className)}>
      <iframe
        src={url}
        title="Web Preview"
        className="absolute inset-0 w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Console                                                           */
/* ------------------------------------------------------------------ */

export const WebPreviewConsole: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Console</span>
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-border bg-background px-3 py-2 h-24 overflow-auto">
          <p className="text-xs text-muted-foreground font-mono">
            No console output
          </p>
        </div>
      )}
    </>
  );
};
