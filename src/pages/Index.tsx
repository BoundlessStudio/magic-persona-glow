import { useState } from "react";
import { Ripple } from "@/components/ui/ripple";
import { Persona, type PersonaState } from "@/components/ai-elements/persona";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { Circle, Mic, Brain, Megaphone, Moon, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const stateIcons: { state: PersonaState; icon: typeof Circle }[] = [
  { state: "idle", icon: Circle },
  { state: "listening", icon: Mic },
  { state: "thinking", icon: Brain },
  { state: "speaking", icon: Megaphone },
  { state: "asleep", icon: Moon },
  { state: "upload", icon: Upload },
];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <Ripple className="z-0" />
      <div className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity ${currentState === "upload" ? "opacity-30" : ""}`}>
        <Persona state={currentState === "upload" ? "idle" : currentState} variant="halo" className="size-64 pointer-events-auto" />
      </div>
      {currentState === "upload" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center animate-in fade-in duration-300">
          <UploadDropzone
            description={{ maxFiles: 4, maxFileSize: "2MB", fileTypes: "JPEG, PNG, GIF" }}
            onDrop={(files) => {
              toast({ title: "Files selected", description: `${files.length} file(s) — no server to upload to.` });
            }}
            className="w-80 bg-background/80 backdrop-blur-sm"
          />
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
