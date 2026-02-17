import { useState } from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Persona, type PersonaState } from "@/components/ai-elements/persona";

const states: PersonaState[] = ["idle", "listening", "thinking", "speaking", "asleep"];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="white"
        maxOpacity={0.15}
        flickerChance={0.1}
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <Persona state={currentState} variant="command" className="size-64" />
        <div className="flex gap-2">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setCurrentState(s)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                currentState === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
