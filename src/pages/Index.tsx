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
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  type AttachmentData,
} from "@/components/ai-elements/attachments";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
} from "@/components/ai-elements/chain-of-thought";
import {
  Confirmation,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";
import {
  Circle,
  Mic,
  Brain,
  Megaphone,
  Moon,
  Upload,
  Globe,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  ExternalLink,
  Maximize2,
  Sparkles,
  Paperclip,
  Search,
  ListTree,
  ShieldCheck,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sampleAttachments: AttachmentData[] = [
  {
    id: "1",
    type: "file",
    filename: "mountain-landscape.jpg",
    mediaType: "image/jpeg",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    type: "file",
    filename: "quarterly-report-2024.pdf",
    mediaType: "application/pdf",
  },
  {
    id: "3",
    type: "file",
    filename: "product-demo.mp4",
    mediaType: "video/mp4",
  },
  {
    id: "4",
    type: "source-document",
    title: "API Documentation",
    mediaType: "text/html",
  },
  {
    id: "5",
    type: "file",
    filename: "meeting-recording.mp3",
    mediaType: "audio/mpeg",
  },
];

const personaStates: { state: PersonaState; icon: typeof Circle }[] = [
  { state: "idle", icon: Circle },
  { state: "listening", icon: Mic },
  { state: "thinking", icon: Brain },
  { state: "speaking", icon: Megaphone },
  { state: "asleep", icon: Moon },
];

const componentStates: { state: PersonaState; icon: typeof Circle }[] = [
  { state: "upload", icon: Upload },
  { state: "preview", icon: Globe },
  { state: "attachments", icon: Paperclip },
  { state: "chain-of-thought", icon: ListTree },
  { state: "confirmation", icon: ShieldCheck },
];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");
  const [showOverlay, setShowOverlay] = useState<"upload" | "preview" | "attachments" | "chain-of-thought" | "confirmation" | null>(null);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();

  const overlayStates = ["upload", "preview", "attachments", "chain-of-thought", "confirmation"] as const;
  const isOverlayState = overlayStates.includes(currentState as any);

  useEffect(() => {
    if (isOverlayState) {
      setOverlayExiting(false);
      setShowOverlay(currentState as "upload" | "preview" | "attachments" | "chain-of-thought" | "confirmation");
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
                <WebPreviewNavigationButton tooltip="Back"><ArrowLeft size={14} /></WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Forward"><ArrowRight size={14} /></WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Refresh"><RefreshCcw size={14} /></WebPreviewNavigationButton>
                <WebPreviewUrl />
                <WebPreviewNavigationButton tooltip="AI"><Sparkles size={14} /></WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Open in new tab"><ExternalLink size={14} /></WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Fullscreen"><Maximize2 size={14} /></WebPreviewNavigationButton>
              </WebPreviewNavigation>
              <WebPreviewBody />
              <WebPreviewConsole />
            </WebPreview>
          )}
          {showOverlay === "attachments" && (
            <Attachments
              variant="list"
              className="w-[480px] bg-background/80 backdrop-blur-sm rounded-lg border border-border p-4 pointer-events-auto"
            >
              {sampleAttachments.map((file) => (
                <Attachment
                  key={file.id}
                  data={file}
                  onRemove={() =>
                    toast({
                      title: "Removed",
                      description: `${file.filename || (file as any).title} removed (demo only).`,
                    })
                  }
                >
                  <AttachmentPreview />
                  <AttachmentInfo showMediaType />
                  <AttachmentRemove />
                </Attachment>
              ))}
            </Attachments>
          )}
          {showOverlay === "chain-of-thought" && (
            <ChainOfThought
              defaultOpen
              className="w-[480px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <ChainOfThoughtHeader>Chain of Thought</ChainOfThoughtHeader>
              <ChainOfThoughtContent>
                <ChainOfThoughtStep
                  icon={Search}
                  label="Searching for profiles for Hayden Bleasel"
                  status="complete"
                >
                  <ChainOfThoughtSearchResults>
                    <ChainOfThoughtSearchResult>www.x.com</ChainOfThoughtSearchResult>
                    <ChainOfThoughtSearchResult>www.instagram.com</ChainOfThoughtSearchResult>
                    <ChainOfThoughtSearchResult>www.github.com</ChainOfThoughtSearchResult>
                  </ChainOfThoughtSearchResults>
                </ChainOfThoughtStep>
                <ChainOfThoughtStep
                  label="Found the profile photo for Hayden Bleasel"
                  status="complete"
                  description="Hayden Bleasel is an Australian product designer, software engineer, and founder. He is currently based in the United States working for Vercel."
                />
                <ChainOfThoughtStep
                  icon={Search}
                  label="Searching for recent work..."
                  status="active"
                >
                  <ChainOfThoughtSearchResults>
                    <ChainOfThoughtSearchResult>www.github.com</ChainOfThoughtSearchResult>
                    <ChainOfThoughtSearchResult>www.dribbble.com</ChainOfThoughtSearchResult>
                  </ChainOfThoughtSearchResults>
                </ChainOfThoughtStep>
              </ChainOfThoughtContent>
            </ChainOfThought>
          )}
          {showOverlay === "confirmation" && (
            <Confirmation
              state="approval-requested"
              approval={{ id: "demo-1" }}
              className="w-[480px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <ConfirmationRequest>
                This tool wants to delete the file <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/tmp/example.txt</code>. Do you approve this action?
              </ConfirmationRequest>
              <ConfirmationAccepted>
                <CheckIcon className="size-4" />
                <span>You approved this tool execution</span>
              </ConfirmationAccepted>
              <ConfirmationRejected>
                <XIcon className="size-4" />
                <span>You rejected this tool execution</span>
              </ConfirmationRejected>
              <ConfirmationActions>
                <ConfirmationAction
                  variant="outline"
                  onClick={() => toast({ title: "Rejected", description: "Tool execution rejected (demo only)." })}
                >
                  Reject
                </ConfirmationAction>
                <ConfirmationAction
                  onClick={() => toast({ title: "Approved", description: "Tool execution approved (demo only)." })}
                >
                  Approve
                </ConfirmationAction>
              </ConfirmationActions>
            </Confirmation>
          )}
        </div>
      )}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="flex gap-1 rounded-full bg-secondary/80 p-1.5 backdrop-blur-sm">
          {personaStates.map(({ state, icon: Icon }) => (
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
        <div className="flex gap-1 rounded-full bg-secondary/80 p-1.5 backdrop-blur-sm">
          {componentStates.map(({ state, icon: Icon }) => (
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
    </div>
  );
};

export default Index;
