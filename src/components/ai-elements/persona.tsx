import type { RiveParameters } from "@rive-app/react-webgl2";
import type { FC } from "react";

import { cn } from "@/lib/utils";
import {
  useRive,
  useStateMachineInput,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
} from "@rive-app/react-webgl2";
import { memo, useEffect, useMemo, useRef, useState } from "react";

export type PersonaState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "asleep"
  | "upload"
  | "preview"
  | "attachments"
  | "chain-of-thought"
  | "confirmation"
  | "plan"
  | "queue"
  | "env-vars"
  | "file-tree";

interface PersonaProps {
  state?: PersonaState;
  onLoad?: RiveParameters["onLoad"];
  onLoadError?: RiveParameters["onLoadError"];
  onReady?: () => void;
  onPause?: RiveParameters["onPause"];
  onPlay?: RiveParameters["onPlay"];
  onStop?: RiveParameters["onStop"];
  className?: string;
  variant?: keyof typeof sources;
}

const stateMachine = "default";

const sources = {
  command: {
    dynamicColor: true,
    hasModel: true,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv",
  },
  glint: {
    dynamicColor: true,
    hasModel: true,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv",
  },
  halo: {
    dynamicColor: true,
    hasModel: true,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
  },
  mana: {
    dynamicColor: false,
    hasModel: true,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.riv",
  },
  obsidian: {
    dynamicColor: true,
    hasModel: true,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
  },
  opal: {
    dynamicColor: false,
    hasModel: false,
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
  },
};

const getCurrentTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};

const useTheme = (enabled: boolean) => {
  const [theme, setTheme] = useState<"light" | "dark">(getCurrentTheme);

  useEffect(() => {
    if (!enabled) return;

    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    let mql: MediaQueryList | null = null;
    const handleMediaChange = () => {
      setTheme(getCurrentTheme());
    };

    if (window.matchMedia) {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", handleMediaChange);
    }

    return () => {
      observer.disconnect();
      if (mql) {
        mql.removeEventListener("change", handleMediaChange);
      }
    };
  }, [enabled]);

  return theme;
};

interface PersonaWithModelProps {
  rive: ReturnType<typeof useRive>["rive"];
  source: (typeof sources)[keyof typeof sources];
  children: React.ReactNode;
}

const PersonaWithModel = memo(
  ({ rive, source, children }: PersonaWithModelProps) => {
    const theme = useTheme(source.dynamicColor);
    const viewModel = useViewModel(rive, { useDefault: true });
    const viewModelInstance = useViewModelInstance(viewModel, {
      rive,
      useDefault: true,
    });
    const viewModelInstanceColor = useViewModelInstanceColor(
      "color",
      viewModelInstance
    );

    useEffect(() => {
      if (!(viewModelInstanceColor && source.dynamicColor)) return;

      const [r, g, b] = theme === "dark" ? [255, 255, 255] : [0, 0, 0];
      viewModelInstanceColor.setRgb(r, g, b);
    }, [viewModelInstanceColor, theme, source.dynamicColor]);

    return <>{children}</>;
  }
);

PersonaWithModel.displayName = "PersonaWithModel";

const PersonaWithoutModel = memo(
  ({ children }: { children: React.ReactNode }) => <>{children}</>
);

PersonaWithoutModel.displayName = "PersonaWithoutModel";

export const Persona: FC<PersonaProps> = memo(
  ({
    variant = "obsidian",
    state = "idle",
    onLoad,
    onLoadError,
    onReady,
    onPause,
    onPlay,
    onStop,
    className,
  }) => {
    const source = sources[variant];

    if (!source) {
      throw new Error(`Invalid variant: ${variant}`);
    }

    const callbacksRef = useRef({
      onLoad,
      onLoadError,
      onPause,
      onPlay,
      onReady,
      onStop,
    });

    useEffect(() => {
      callbacksRef.current = {
        onLoad,
        onLoadError,
        onPause,
        onPlay,
        onReady,
        onStop,
      };
    }, [onLoad, onLoadError, onPause, onPlay, onReady, onStop]);

    const stableCallbacks = useMemo(
      () => ({
        onLoad: ((loadedRive: unknown) =>
          callbacksRef.current.onLoad?.(
            loadedRive as Parameters<NonNullable<RiveParameters["onLoad"]>>[0]
          )) as RiveParameters["onLoad"],
        onLoadError: ((err: unknown) =>
          callbacksRef.current.onLoadError?.(
            err as Parameters<NonNullable<RiveParameters["onLoadError"]>>[0]
          )) as RiveParameters["onLoadError"],
        onPause: ((event: unknown) =>
          callbacksRef.current.onPause?.(
            event as Parameters<NonNullable<RiveParameters["onPause"]>>[0]
          )) as RiveParameters["onPause"],
        onPlay: ((event: unknown) =>
          callbacksRef.current.onPlay?.(
            event as Parameters<NonNullable<RiveParameters["onPlay"]>>[0]
          )) as RiveParameters["onPlay"],
        onReady: () => callbacksRef.current.onReady?.(),
        onStop: ((event: unknown) =>
          callbacksRef.current.onStop?.(
            event as Parameters<NonNullable<RiveParameters["onStop"]>>[0]
          )) as RiveParameters["onStop"],
      }),
      []
    );

    const { rive, RiveComponent } = useRive({
      autoplay: true,
      onLoad: stableCallbacks.onLoad,
      onLoadError: stableCallbacks.onLoadError,
      onPause: stableCallbacks.onPause,
      onPlay: stableCallbacks.onPlay,
      onRiveReady: stableCallbacks.onReady,
      onStop: stableCallbacks.onStop,
      src: source.source,
      stateMachines: stateMachine,
    });

    const listeningInput = useStateMachineInput(
      rive,
      stateMachine,
      "listening"
    );
    const thinkingInput = useStateMachineInput(rive, stateMachine, "thinking");
    const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");
    const asleepInput = useStateMachineInput(rive, stateMachine, "asleep");

    useEffect(() => {
      try {
        if (listeningInput) {
          listeningInput.value = state === "listening";
        }
        if (thinkingInput) {
          thinkingInput.value = state === "thinking";
        }
        if (speakingInput) {
          speakingInput.value = state === "speaking";
        }
        if (asleepInput) {
          asleepInput.value = state === "asleep";
        }
      } catch {
        // Rive state machine inputs may not be ready yet
      }
    }, [state, listeningInput, thinkingInput, speakingInput, asleepInput]);

    const Component = source.hasModel ? PersonaWithModel : PersonaWithoutModel;

    return (
      <Component rive={rive} source={source}>
        <RiveComponent className={cn("size-32", className)} />
      </Component>
    );
  }
);

Persona.displayName = "Persona";
