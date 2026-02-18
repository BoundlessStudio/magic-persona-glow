"use client";

import * as React from "react";
import {
  HexColorPicker,
  HexAlphaColorPicker,
  HexColorInput,
} from "react-colorful";
import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";

/* ── Context ── */
interface ColorPickerContextValue {
  color: string;
  setColor: (c: string) => void;
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null
);

const useColorPicker = () => {
  const ctx = React.useContext(ColorPickerContext);
  if (!ctx) throw new Error("Must be used within <ColorPicker>");
  return ctx;
};

/* ── Root ── */
interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value = "#6366f1", onChange, className, children }, ref) => {
    const [color, setColorState] = React.useState(value);

    const setColor = React.useCallback(
      (c: string) => {
        setColorState(c);
        onChange?.(c);
      },
      [onChange]
    );

    return (
      <ColorPickerContext.Provider value={{ color, setColor }}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 w-[320px]",
            className
          )}
        >
          {children}
        </div>
      </ColorPickerContext.Provider>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

/* ── Selection (saturation square) ── */
const ColorPickerSelection: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { color, setColor } = useColorPicker();
  return (
    <div className={cn("color-picker-selection", className)}>
      <HexColorPicker
        color={color}
        onChange={setColor}
        style={{ width: "100%", height: "auto", aspectRatio: "1 / 1" }}
      />
    </div>
  );
};
ColorPickerSelection.displayName = "ColorPickerSelection";

/* ── Hue slider ── */
const ColorPickerHue: React.FC<{ className?: string }> = ({ className }) => {
  const { color, setColor } = useColorPicker();
  // react-colorful bundles hue inside the main picker; we render
  // an alpha-enabled picker that includes the hue bar, hidden behind
  // the Selection. As a standalone sub-component we re-use the full picker
  // but only show its hue strip via CSS.
  return (
    <div className={cn("color-picker-hue-only", className)}>
      <HexAlphaColorPicker
        color={color}
        onChange={setColor}
        style={{ width: "100%" }}
      />
    </div>
  );
};
ColorPickerHue.displayName = "ColorPickerHue";

/* ── Alpha slider ── */
const ColorPickerAlpha: React.FC<{ className?: string }> = ({ className }) => {
  const { color, setColor } = useColorPicker();
  return (
    <div className={cn("color-picker-alpha-only", className)}>
      <HexAlphaColorPicker
        color={color}
        onChange={setColor}
        style={{ width: "100%" }}
      />
    </div>
  );
};
ColorPickerAlpha.displayName = "ColorPickerAlpha";

/* ── EyeDropper ── */
const ColorPickerEyeDropper: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { setColor } = useColorPicker();
  const supported =
    typeof window !== "undefined" && "EyeDropper" in window;

  if (!supported) return null;

  const handlePick = async () => {
    try {
      // @ts-ignore
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      setColor(result.sRGBHex);
    } catch {
      // cancelled
    }
  };

  return (
    <button
      type="button"
      onClick={handlePick}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className
      )}
      title="Pick color from screen"
    >
      <Pipette className="size-4" />
    </button>
  );
};
ColorPickerEyeDropper.displayName = "ColorPickerEyeDropper";

/* ── Format selector (label) ── */
const ColorPickerFormat: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "flex h-9 items-center gap-1 rounded-md border border-border bg-secondary px-2.5 text-xs font-medium text-muted-foreground select-none",
      className
    )}
  >
    HEX
  </div>
);
ColorPickerFormat.displayName = "ColorPickerFormat";

/* ── Output (hex input + preview swatch) ── */
const ColorPickerOutput: React.FC<{ className?: string }> = ({ className }) => {
  const { color, setColor } = useColorPicker();
  return (
    <div className={cn("flex flex-1 items-center gap-2", className)}>
      <div className="flex flex-1 items-center rounded-md border border-border bg-secondary px-2.5 h-9">
        <HexColorInput
          color={color}
          onChange={setColor}
          prefixed
          alpha
          className="flex-1 bg-transparent text-xs text-foreground outline-none font-mono"
        />
      </div>
      <div
        className="size-9 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
ColorPickerOutput.displayName = "ColorPickerOutput";

export {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerOutput,
};
