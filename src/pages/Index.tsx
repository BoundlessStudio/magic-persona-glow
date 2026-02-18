import { useState, useEffect, useRef } from "react";
import { Ripple } from "@/components/ui/ripple";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { ClientTweetCard } from "@/components/ui/tweet-card";
import { VideoPlayer } from "@/components/ui/video-player";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
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
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanTrigger,
  PlanContent,
  PlanFooter,
  PlanAction,
} from "@/components/ai-elements/plan";
import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
  QueueItemDescription,
} from "@/components/ai-elements/queue";
import {
  EnvironmentVariables,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariablesContent,
  EnvironmentVariable,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariableCopyButton,
  EnvironmentVariableRequired,
} from "@/components/ai-elements/environment-variables";
import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
} from "@/components/ai-elements/file-tree";
import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ai-elements/code-block";
import {
  Sandbox,
  SandboxHeader,
  SandboxContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabContent,
} from "@/components/ai-elements/sandbox";
import { Canvas } from "@/components/ai-elements/canvas";
import { Edge } from "@/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeHandle,
  NodeTitle,
} from "@/components/ai-elements/node";
import { nanoid } from "nanoid";
import {
  StackTrace,
  StackTraceHeader,
  StackTraceError,
  StackTraceErrorType,
  StackTraceErrorMessage,
  StackTraceActions,
  StackTraceCopyButton,
  StackTraceExpandButton,
  StackTraceContent,
  StackTraceFrames,
} from "@/components/ai-elements/stack-trace";
import {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalStatus,
  TerminalActions,
  TerminalCopyButton,
  TerminalContent,
} from "@/components/ai-elements/terminal";
import {
  TestResults,
  TestResultsHeader,
  TestResultsSummary,
  TestResultsDuration,
  TestResultsProgress,
  TestResultsContent,
  TestSuite,
  TestSuiteName,
  TestSuiteContent,
  Test,
  TestError,
  TestErrorMessage,
  TestErrorStack,
} from "@/components/ai-elements/test-results";
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
  ClipboardList,
  ListOrdered,
  KeyRound,
  FolderTree,
  Box,
  AlertTriangle,
  TerminalSquare,
  FlaskConical,
  Workflow,
  Twitter,
  Gauge,
  CreditCard,
  CalendarDays,
  Video,
  TableIcon,
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
  { state: "plan", icon: ClipboardList },
  { state: "queue", icon: ListOrdered },
  { state: "env-vars", icon: KeyRound },
  { state: "file-tree", icon: FolderTree },
  { state: "sandbox", icon: Box },
  { state: "stack-trace", icon: AlertTriangle },
  { state: "terminal", icon: TerminalSquare },
  { state: "test-results", icon: FlaskConical },
  { state: "workflow", icon: Workflow },
  { state: "tweet-card", icon: CreditCard },
  { state: "progress-bar", icon: Gauge },
  { state: "hx-calendar", icon: CalendarDays },
  { state: "hx-video", icon: Video },
  { state: "hx-table", icon: TableIcon },
];

type OverlayState = "upload" | "preview" | "attachments" | "chain-of-thought" | "confirmation" | "plan" | "queue" | "env-vars" | "file-tree" | "sandbox" | "stack-trace" | "terminal" | "test-results" | "workflow" | "tweet-card" | "progress-bar" | "hx-calendar" | "hx-video" | "hx-table";

const overlayStates: OverlayState[] = ["upload", "preview", "attachments", "chain-of-thought", "confirmation", "plan", "queue", "env-vars", "file-tree", "sandbox", "stack-trace", "terminal", "test-results", "workflow", "tweet-card", "progress-bar", "hx-calendar", "hx-video", "hx-table"];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");
  const [showOverlay, setShowOverlay] = useState<OverlayState | null>(null);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();

  const isOverlayState = overlayStates.includes(currentState as OverlayState);

  useEffect(() => {
    if (isOverlayState) {
      setOverlayExiting(false);
      setShowOverlay(currentState as OverlayState);
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
          {showOverlay === "plan" && (
            <Plan defaultOpen className="w-[480px] bg-background/80 backdrop-blur-sm pointer-events-auto">
              <PlanHeader>
                <PlanTitle>Rewrite AI Elements to SolidJS</PlanTitle>
                <PlanDescription>
                  Rewrite the AI Elements component library from React to SolidJS while maintaining compatibility with existing React-based shadcn/ui components.
                </PlanDescription>
              </PlanHeader>
              <PlanTrigger />
              <PlanContent>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Set up SolidJS project scaffolding</li>
                  <li>Create solid-js/compat adapter layer</li>
                  <li>Port all 29 components to SolidJS primitives</li>
                  <li>Update test suite for Solid testing library</li>
                  <li>Write migration guide for existing users</li>
                </ol>
              </PlanContent>
              <PlanFooter>
                <PlanAction variant="outline" onClick={() => toast({ title: "Cancelled" })}>Cancel</PlanAction>
                <PlanAction onClick={() => toast({ title: "Building…", description: "Plan execution started (demo only)." })}>Build ⌘↩</PlanAction>
              </PlanFooter>
            </Plan>
          )}
          {showOverlay === "queue" && (
            <Queue className="w-[480px] bg-background/80 backdrop-blur-sm rounded-lg border border-border p-4 pointer-events-auto">
              <QueueSection defaultOpen>
                <QueueSectionTrigger>
                  <QueueSectionLabel label="Queued" count={4} />
                </QueueSectionTrigger>
                <QueueSectionContent>
                  <QueueList>
                    <QueueItem><QueueItemIndicator /><QueueItemContent>How do I set up the project?</QueueItemContent></QueueItem>
                    <QueueItem><QueueItemIndicator /><QueueItemContent>What is the roadmap for Q4?</QueueItemContent></QueueItem>
                    <QueueItem><QueueItemIndicator /><QueueItemContent>Please generate a changelog.</QueueItemContent></QueueItem>
                    <QueueItem><QueueItemIndicator /><QueueItemContent>Add dark mode support.</QueueItemContent></QueueItem>
                  </QueueList>
                </QueueSectionContent>
              </QueueSection>
              <QueueSection defaultOpen>
                <QueueSectionTrigger>
                  <QueueSectionLabel label="Todo" count={3} />
                </QueueSectionTrigger>
                <QueueSectionContent>
                  <QueueList>
                    <QueueItem>
                      <QueueItemIndicator completed />
                      <div>
                        <QueueItemContent completed>Write project documentation</QueueItemContent>
                        <QueueItemDescription completed>Complete the README and API docs</QueueItemDescription>
                      </div>
                    </QueueItem>
                    <QueueItem>
                      <QueueItemIndicator />
                      <div>
                        <QueueItemContent>Implement authentication</QueueItemContent>
                      </div>
                    </QueueItem>
                    <QueueItem>
                      <QueueItemIndicator />
                      <div>
                        <QueueItemContent>Fix bug #42</QueueItemContent>
                        <QueueItemDescription>Resolve crash on settings page</QueueItemDescription>
                      </div>
                    </QueueItem>
                  </QueueList>
                </QueueSectionContent>
              </QueueSection>
            </Queue>
          )}
          {showOverlay === "env-vars" && (
            <EnvironmentVariables className="w-[480px] bg-background/80 backdrop-blur-sm pointer-events-auto">
              <EnvironmentVariablesHeader>
                <EnvironmentVariablesTitle>Environment Variables</EnvironmentVariablesTitle>
                <EnvironmentVariablesToggle />
              </EnvironmentVariablesHeader>
              <EnvironmentVariablesContent>
                <EnvironmentVariable name="DATABASE_URL" value="postgresql://user:pass@localhost:5432/db">
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableName />
                    <EnvironmentVariableRequired />
                  </EnvironmentVariableGroup>
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableValue />
                    <EnvironmentVariableCopyButton />
                  </EnvironmentVariableGroup>
                </EnvironmentVariable>
                <EnvironmentVariable name="API_KEY" value="sk-1234567890abcdef">
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableName />
                    <EnvironmentVariableRequired />
                  </EnvironmentVariableGroup>
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableValue />
                    <EnvironmentVariableCopyButton />
                  </EnvironmentVariableGroup>
                </EnvironmentVariable>
                <EnvironmentVariable name="NODE_ENV" value="production">
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableName />
                  </EnvironmentVariableGroup>
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableValue />
                    <EnvironmentVariableCopyButton />
                  </EnvironmentVariableGroup>
                </EnvironmentVariable>
                <EnvironmentVariable name="PORT" value="3000">
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableName />
                  </EnvironmentVariableGroup>
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableValue />
                    <EnvironmentVariableCopyButton />
                  </EnvironmentVariableGroup>
                </EnvironmentVariable>
              </EnvironmentVariablesContent>
            </EnvironmentVariables>
          )}
          {showOverlay === "file-tree" && (
            <FileTree
              defaultExpanded={new Set(["src", "src/components"])}
              onSelect={(path) => toast({ title: "Selected", description: path })}
              className="w-[320px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <FileTreeFolder path="src" name="src">
                <FileTreeFolder path="src/components" name="components">
                  <FileTreeFile path="src/components/button.tsx" name="button.tsx" />
                  <FileTreeFile path="src/components/input.tsx" name="input.tsx" />
                  <FileTreeFile path="src/components/modal.tsx" name="modal.tsx" />
                </FileTreeFolder>
                <FileTreeFolder path="src/hooks" name="hooks" />
                <FileTreeFolder path="src/lib" name="lib" />
                <FileTreeFile path="src/app.tsx" name="app.tsx" />
                <FileTreeFile path="src/main.tsx" name="main.tsx" />
              </FileTreeFolder>
              <FileTreeFile path="package.json" name="package.json" />
              <FileTreeFile path="tsconfig.json" name="tsconfig.json" />
              <FileTreeFile path="README.md" name="README.md" />
            </FileTree>
          )}
          {/* Sandbox */}
          {showOverlay === "sandbox" && (
            <Sandbox defaultOpen className="w-[960px] bg-background/80 backdrop-blur-sm pointer-events-auto">
              <SandboxHeader title="primes.py" state="output-available" />
              <SandboxContent>
                <SandboxTabs defaultValue="code">
                  <SandboxTabsBar>
                    <SandboxTabsList>
                      <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                      <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
                    </SandboxTabsList>
                  </SandboxTabsBar>
                  <SandboxTabContent value="code">
                    <CodeBlock
                      className="border-0 rounded-none"
                      code={`import math

def calculate_primes(limit):
    sieve = [True] * (limit + 1)
    sieve[0] = sieve[1] = False
    for i in range(2, int(math.sqrt(limit)) + 1):
        if sieve[i]:
            for j in range(i * i, limit + 1, i):
                sieve[j] = False
    return [i for i, is_prime in enumerate(sieve) if is_prime]

if __name__ == "__main__":
    primes = calculate_primes(50)
    print(f"Found {len(primes)} prime numbers up to 50:")
    print(primes)`}
                      language="python"
                    >
                      <CodeBlockCopyButton
                        className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        size="sm"
                      />
                    </CodeBlock>
                  </SandboxTabContent>
                  <SandboxTabContent value="output">
                    <CodeBlock
                      className="border-0 rounded-none"
                      code={`Found 15 prime numbers up to 50:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]`}
                      language="text"
                    />
                  </SandboxTabContent>
                </SandboxTabs>
              </SandboxContent>
            </Sandbox>
          )}
          {/* Stack Trace */}
          {showOverlay === "stack-trace" && (
            <StackTrace
              trace={`TypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (/app/components/UserList.tsx:15:23)\n    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)\n    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)\n    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)`}
              defaultOpen
              onFilePathClick={(path) => toast({ title: "File clicked", description: path })}
              className="w-[560px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <StackTraceHeader>
                <StackTraceError>
                  <StackTraceErrorType />
                  <StackTraceErrorMessage />
                </StackTraceError>
                <StackTraceActions>
                  <StackTraceCopyButton />
                  <StackTraceExpandButton />
                </StackTraceActions>
              </StackTraceHeader>
              <StackTraceContent>
                <StackTraceFrames />
              </StackTraceContent>
            </StackTrace>
          )}
          {/* Terminal */}
          {showOverlay === "terminal" && (
            <Terminal
              output={`\u001B[32m✓\u001B[0m Compiled successfully in 1.2s\n\u001B[1m\u001B[34minfo\u001B[0m  - Collecting page data...\n\u001B[1m\u001B[34minfo\u001B[0m  - Generating static pages (0/3)\n\u001B[32m✓\u001B[0m Generated static pages (3/3)\n\n\u001B[1m\u001B[33mwarn\u001B[0m  - Using \u001B[1mexperimental\u001B[0m server actions\n\n\u001B[36mRoute (app)\u001B[0m                              \u001B[36mSize\u001B[0m     \u001B[36mFirst Load JS\u001B[0m\n\u001B[37m┌ ○ /\u001B[0m                                    \u001B[32m5.2 kB\u001B[0m   \u001B[32m87.3 kB\u001B[0m\n\u001B[37m├ ○ /about\u001B[0m                               \u001B[32m2.1 kB\u001B[0m   \u001B[32m84.2 kB\u001B[0m\n\u001B[37m└ ○ /contact\u001B[0m                             \u001B[32m3.8 kB\u001B[0m   \u001B[32m85.9 kB\u001B[0m\n\n\u001B[32m✓\u001B[0m Build completed successfully!\n\u001B[90mTotal time: 3.45s\u001B[0m`}
              className="w-[560px] bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <TerminalHeader>
                <TerminalTitle>Build Output</TerminalTitle>
                <TerminalActions>
                  <TerminalStatus />
                  <TerminalCopyButton />
                </TerminalActions>
              </TerminalHeader>
              <TerminalContent />
            </Terminal>
          )}
          {/* Test Results */}
          {showOverlay === "test-results" && (
            <TestResults
              summary={{ passed: 12, failed: 2, skipped: 1, total: 15, duration: "3.25s" }}
              className="w-[960px] h-[640px] overflow-auto bg-background/80 backdrop-blur-sm pointer-events-auto"
            >
              <TestResultsHeader>
                <TestResultsSummary />
                <TestResultsDuration />
              </TestResultsHeader>
              <TestResultsProgress />
              <TestResultsContent>
                <TestSuite name="Authentication" defaultOpen>
                  <TestSuiteName>Authentication</TestSuiteName>
                  <TestSuiteContent>
                    <Test name="should login with valid credentials" status="passed" duration={45} />
                    <Test name="should reject invalid password" status="passed" duration={32} />
                    <Test name="should handle expired tokens" status="passed" duration={28} />
                  </TestSuiteContent>
                </TestSuite>
                <TestSuite name="User API" defaultOpen>
                  <TestSuiteName>User API</TestSuiteName>
                  <TestSuiteContent>
                    <Test name="should create new user" status="failed" duration={120}>
                      <TestError>
                        <TestErrorMessage>Expected status 200 but received 500</TestErrorMessage>
                        <TestErrorStack>{`  at Object.<anonymous> (src/user.test.ts:45:12)\n  at Promise.then.completed (node_modules/jest-circus/build/utils.js:391:28)`}</TestErrorStack>
                      </TestError>
                    </Test>
                    <Test name="should delete user" status="skipped" />
                  </TestSuiteContent>
                </TestSuite>
              </TestResultsContent>
            </TestResults>
          )}
          {/* Workflow */}
          {showOverlay === "workflow" && (() => {
            const nodeIds = {
              start: nanoid(),
              process1: nanoid(),
              decision: nanoid(),
              output1: nanoid(),
              output2: nanoid(),
              process2: nanoid(),
            };
            const wfNodes = [
              { id: nodeIds.start, position: { x: 0, y: 160 }, type: "workflow", data: { label: "Start", description: "Initialize workflow", handles: { source: true, target: false } } },
              { id: nodeIds.process1, position: { x: 240, y: 160 }, type: "workflow", data: { label: "Process Data", description: "Transform input", handles: { source: true, target: true } } },
              { id: nodeIds.decision, position: { x: 480, y: 160 }, type: "workflow", data: { label: "Decision Point", description: "Route based on conditions", handles: { source: true, target: true } } },
              { id: nodeIds.output1, position: { x: 720, y: 40 }, type: "workflow", data: { label: "Success Path", description: "Handle success case", handles: { source: true, target: true } } },
              { id: nodeIds.output2, position: { x: 720, y: 300 }, type: "workflow", data: { label: "Error Path", description: "Handle error case", handles: { source: true, target: true } } },
              { id: nodeIds.process2, position: { x: 960, y: 160 }, type: "workflow", data: { label: "Complete", description: "Finalize workflow", handles: { source: false, target: true } } },
            ];
            const wfEdges = [
              { id: nanoid(), source: nodeIds.start, target: nodeIds.process1, type: "animated" },
              { id: nanoid(), source: nodeIds.process1, target: nodeIds.decision, type: "animated" },
              { id: nanoid(), source: nodeIds.decision, target: nodeIds.output1, type: "animated" },
              { id: nanoid(), source: nodeIds.decision, target: nodeIds.output2, type: "temporary" },
              { id: nanoid(), source: nodeIds.output1, target: nodeIds.process2, type: "animated" },
              { id: nanoid(), source: nodeIds.output2, target: nodeIds.process2, type: "temporary" },
            ];
            const wfNodeTypes = {
              workflow: ({ data }: { data: { label: string; description: string; handles: { source: boolean; target: boolean } } }) => (
                <Node>
                  {data.handles.target && <NodeHandle position="left" />}
                  {data.handles.source && <NodeHandle position="right" />}
                  <NodeHeader>
                    <NodeTitle>{data.label}</NodeTitle>
                    <NodeDescription>{data.description}</NodeDescription>
                  </NodeHeader>
                  <NodeContent>
                    <p className="text-xs text-muted-foreground">test</p>
                  </NodeContent>
                  <NodeFooter>
                    <p className="text-xs">test</p>
                  </NodeFooter>
                </Node>
              ),
            };
            const wfEdgeTypes = {
              animated: Edge.Animated,
              temporary: Edge.Temporary,
            };
            return (
              <Canvas
                nodes={wfNodes}
                edges={wfEdges}
                nodeTypes={wfNodeTypes}
                edgeTypes={wfEdgeTypes}
                className="w-[960px] h-[540px] bg-background/80 backdrop-blur-sm rounded-lg border border-border pointer-events-auto"
              />
            );
          })()}
          {/* Tweet Card */}
          {showOverlay === "tweet-card" && (
            <div className="w-[480px] pointer-events-auto">
              <ClientTweetCard id="1668408059125702661" />
            </div>
          )}
          {/* Animated Circular Progress Bar */}
          {showOverlay === "progress-bar" && (
            <div className="flex flex-col items-center gap-4 pointer-events-auto bg-background/80 backdrop-blur-sm rounded-lg border border-border p-8">
              <AnimatedCircularProgressBar
                value={72}
                gaugePrimaryColor="hsl(239 84% 67%)"
                gaugeSecondaryColor="hsl(230 20% 14%)"
              />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          )}
          {/* HextaUI Calendar */}
          {showOverlay === "hx-calendar" && (
            <div className="pointer-events-auto bg-background/80 backdrop-blur-sm rounded-lg border border-border p-4">
              <Calendar
                mode="single"
                className="p-3 pointer-events-auto"
              />
            </div>
          )}
          {/* HextaUI Video Player */}
          {showOverlay === "hx-video" && (
            <VideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              size="lg"
              className="pointer-events-auto"
            />
          )}
          {/* HextaUI Table */}
          {showOverlay === "hx-table" && (
            <div className="w-[640px] pointer-events-auto bg-background/80 backdrop-blur-sm rounded-lg border border-border p-4">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
                    { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
                    { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
                    { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
                    { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
                    { id: "INV006", status: "Pending", method: "Bank Transfer", amount: "$200.00" },
                    { id: "INV007", status: "Unpaid", method: "Credit Card", amount: "$300.00" },
                  ].map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell>{inv.status}</TableCell>
                      <TableCell>{inv.method}</TableCell>
                      <TableCell className="text-right">{inv.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,250.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
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
