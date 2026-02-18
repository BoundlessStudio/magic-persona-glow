"use client";

import * as React from "react";
import qrcode from "qrcode-generator";
import { cn } from "@/lib/utils";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface QRCodeProps {
  data: string;
  foreground?: string;
  background?: string;
  robustness?: ErrorCorrectionLevel;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  data,
  foreground,
  background,
  robustness = "M",
  className,
}) => {
  const svgContent = React.useMemo(() => {
    const qr = qrcode(0, robustness);
    qr.addData(data);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const cellSize = 1;
    const size = moduleCount * cellSize;

    const rects: string[] = [];
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          rects.push(
            `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" />`
          );
        }
      }
    }

    return { rects: rects.join(""), size };
  }, [data, robustness]);

  return (
    <div className={cn("inline-flex", className)}>
      <svg
        viewBox={`0 0 ${svgContent.size} ${svgContent.size}`}
        className="size-full"
        style={{
          color: foreground,
          backgroundColor: background,
        }}
      >
        <rect
          width={svgContent.size}
          height={svgContent.size}
          fill={background || "hsl(var(--background))"}
        />
        <g
          fill={foreground || "hsl(var(--foreground))"}
          dangerouslySetInnerHTML={{ __html: svgContent.rects }}
        />
      </svg>
    </div>
  );
};

QRCode.displayName = "QRCode";

export { QRCode, type QRCodeProps, type ErrorCorrectionLevel };
