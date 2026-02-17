import { useState } from "react";
import { Ripple } from "@/components/ui/ripple";
import { Persona, type PersonaState } from "@/components/ai-elements/persona";
import { Circle, Mic, Brain, Megaphone, Moon } from "lucide-react";

const stateIcons: { state: PersonaState; icon: typeof Circle }[] = [
  { state: "idle", icon: Circle },
  { state: "listening", icon: Mic },
  { state: "thinking", icon: Brain },
  { state: "speaking", icon: Megaphone },
  { state: "asleep", icon: Moon },
];

const Index = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <Ripple className="z-0" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <Persona state={currentState} variant="halo" className="size-64" />
        <div className="flex gap-1 rounded-full bg-secondary/80 p-1.5 backdrop-blur-sm">
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
    </div>
  );
};

export default Index;
