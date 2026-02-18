import { useState, useEffect, useRef } from "react";
import { Ripple } from "@/components/ui/ripple";
import { Persona, type PersonaState } from "@/components/ai-elements/persona";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import {
  Circle, Mic, Brain, Megaphone, Moon, Upload, Globe,
  ArrowLeft, ArrowRight, RefreshCcw, MousePointerClick, ExternalLink, Maximize2, Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const stateIcons: { state: PersonaState; icon: typeof Circle }[] = [
  { state: "idle", icon: Circle },
  { state: "listening", icon: Mic },
  { state: "thinking", icon: Brain },
  { state: "speaking", icon: Megaphone },
  { state: "upload", icon: Upload },
  { state: "preview", icon: Globe },
  { state: "asleep", icon: Moon },
];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");
  const [showOverlay, setShowOverlay] = useState<"upload" | "preview" | null>(null);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();

  const overlayStates = ["upload", "preview"] as const;
  const isOverlayState = overlayStates.includes(currentState as any);

  useEffect(() => {
    if (isOverlayState) {
      setOverlayExiting(false);
      setShowOverlay(currentState as "upload" | "preview");
    } else if (showOverlay) {
      setOverlayExiting(true);
      clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => {
        setShowOverlay(null);
        setOverlayExiting(false);
      }, 200);
    }
    return () => clearTimeout(exitTimer.current);
  }, [currentState]);

  const isOverlayVisible = showOverlay !== null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <Ripple className="z-0" />
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isOverlayVisible && !overlayExiting ? "opacity-30" : ""}`}
      >
        <Persona
          state={isOverlayState ? "idle" : currentState}
          variant="halo"
          className="size-64 pointer-events-auto"
        />
      </div>
      {isOverlayVisible && (
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center pointer-events-none ${overlayExiting ? "animate-scale-out" : "animate-scale-in"}`}
        >
          {showOverlay === "upload" && (
            <UploadDropzone
              description={{ maxFiles: 4, maxFileSize: "2MB", fileTypes: "JPEG, PNG, GIF" }}
              onDrop={(files) => {
                toast({ title: "Files selected", description: `${files.length} file(s) — no server to upload to.` });
              }}
              className="w-80 bg-background/80 backdrop-blur-sm pointer-events-auto"
            />
          )}
          {showOverlay === "preview" && (
            <WebPreview
              defaultUrl="https://www.example.com/"
              className="w-[960px] h-[640px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <WebPreviewNavigation>
                <WebPreviewNavigationButton tooltip="Back">
                  <ArrowLeft className="size-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Forward">
                  <ArrowRight className="size-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Refresh">
                  <RefreshCcw className="size-4" />
                </WebPreviewNavigationButton>
                <WebPreviewUrl />
                <WebPreviewNavigationButton tooltip="Select">
                  <MousePointerClick className="size-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Open in new tab">
                  <ExternalLink className="size-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Fullscreen">
                  <Maximize2 className="size-4" />
                </WebPreviewNavigationButton>
              </WebPreviewNavigation>
              <WebPreviewBody />
              <WebPreviewConsole />
            </WebPreview>
          )}
        </div>
      )}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1 rounded-full bg-secondary/80 p-1.5 backdrop-blur-sm">
        {stateIcons.map(({ state, icon: Icon }) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            className={`rounded-full p-2.5 transition-all ${
              currentState === state
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
