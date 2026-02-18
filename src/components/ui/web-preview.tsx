import { useState, useRef, type FC } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Maximize2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebPreviewProps {
  defaultUrl?: string;
  className?: string;
}

export const WebPreview: FC<WebPreviewProps> = ({
  defaultUrl = "https://www.example.com/",
  className,
}) => {
  const [url, setUrl] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-solid border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Navigation bar */}
      <div className="flex items-center gap-1.5 border-b border-border px-2 py-1.5 bg-card">
        <NavButton icon={ArrowLeft} tooltip="Back" />
        <NavButton icon={ArrowRight} tooltip="Forward" />
        <NavButton icon={RotateCcw} tooltip="Refresh" />

        <div className="flex-1 mx-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="/"
          />
        </div>

        <NavButton icon={Sparkles} tooltip="AI" />
        <NavButton icon={ExternalLink} tooltip="Open in new tab" />
        <NavButton icon={Maximize2} tooltip="Fullscreen" />
      </div>

      {/* Preview body */}
      <div className="relative flex-1 min-h-0 bg-background">
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Preview will appear here
        </div>
      </div>

      {/* Console toggle */}
      <button
        onClick={() => setConsoleOpen(!consoleOpen)}
        className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Console</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            consoleOpen && "rotate-180"
          )}
        />
      </button>

      {/* Console panel */}
      {consoleOpen && (
        <div className="border-t border-border bg-background px-3 py-2 h-24 overflow-auto">
          <p className="text-xs text-muted-foreground font-mono">
            No console output
          </p>
        </div>
      )}
    </div>
  );
};

const NavButton: FC<{
  icon: typeof ArrowLeft;
  tooltip: string;
  onClick?: () => void;
}> = ({ icon: Icon, tooltip, onClick }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
  >
    <Icon size={14} />
  </button>
);
