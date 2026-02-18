"use client";

import * as React from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value = "#6366f1", onChange, className }, ref) => {
    const [color, setColor] = React.useState(value);

    const handleChange = (newColor: string) => {
      setColor(newColor);
      onChange?.(newColor);
    };

    const handleEyeDropper = async () => {
      try {
        // @ts-ignore - EyeDropper API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        handleChange(result.sRGBHex);
      } catch {
        // User cancelled or API not supported
      }
    };

    const supportsEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 w-[320px]",
          className
        )}
      >
        <HexAlphaColorPicker
          color={color}
          onChange={handleChange}
          style={{ width: "100%", height: "200px" }}
        />

        <div className="flex items-center gap-2">
          {supportsEyeDropper && (
            <button
              type="button"
              onClick={handleEyeDropper}
              className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Pick color from screen"
            >
              <Pipette className="size-3.5" />
            </button>
          )}
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-secondary px-2 py-1">
            <span className="text-xs text-muted-foreground select-none">HEX</span>
            <HexColorInput
              color={color}
              onChange={handleChange}
              prefixed
              alpha
              className="flex-1 bg-transparent text-xs text-foreground outline-none font-mono"
            />
          </div>
          <div
            className="size-8 shrink-0 rounded-md border border-border"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
