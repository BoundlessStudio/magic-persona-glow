"use client";

import type { FC, ReactNode } from "react";
import { useMemo, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface CanvasNode {
  id: string;
  position: { x: number; y: number };
  type: string;
  data: Record<string, unknown>;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

type NodeRenderer = FC<{ data: any }>;
type EdgeRenderer = FC<{ d: string }>;

interface CanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  nodeTypes: Record<string, NodeRenderer>;
  edgeTypes: Record<string, EdgeRenderer>;
  className?: string;
  children?: ReactNode;
}

/* ── Helpers ── */
const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

function buildPath(sx: number, sy: number, tx: number, ty: number): string {
  const mx = (sx + tx) / 2;
  return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;
}

/* ── Canvas ── */
export const Canvas: FC<CanvasProps> = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeEls, setNodeEls] = useState<Map<string, DOMRect>>(new Map());

  const layout = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      if (n.position.x < minX) minX = n.position.x;
      if (n.position.y < minY) minY = n.position.y;
      if (n.position.x + NODE_WIDTH > maxX) maxX = n.position.x + NODE_WIDTH;
      if (n.position.y + NODE_HEIGHT > maxY) maxY = n.position.y + NODE_HEIGHT;
    }
    const pad = 40;
    return {
      offsetX: -minX + pad,
      offsetY: -minY + pad,
      width: maxX - minX + pad * 2,
      height: maxY - minY + pad * 2,
    };
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new Map<string, DOMRect>();
    for (const n of nodes) {
      const el = containerRef.current.querySelector(`[data-node-id="${n.id}"]`);
      if (el) map.set(n.id, el.getBoundingClientRect());
    }
    setNodeEls(map);
  }, [nodes]);

  const edgePaths = useMemo(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    return edges.map((edge) => {
      const sNode = nodes.find((n) => n.id === edge.source);
      const tNode = nodes.find((n) => n.id === edge.target);
      if (!sNode || !tNode) return { ...edge, d: "" };

      let sx: number, sy: number, tx: number, ty: number;
      const sRect = nodeEls.get(edge.source);
      const tRect = nodeEls.get(edge.target);

      if (sRect && tRect && containerRect) {
        sx = sRect.right - containerRect.left;
        sy = sRect.top + sRect.height / 2 - containerRect.top;
        tx = tRect.left - containerRect.left;
        ty = tRect.top + tRect.height / 2 - containerRect.top;
      } else {
        sx = sNode.position.x + layout.offsetX + NODE_WIDTH;
        sy = sNode.position.y + layout.offsetY + NODE_HEIGHT / 2;
        tx = tNode.position.x + layout.offsetX;
        ty = tNode.position.y + layout.offsetY + NODE_HEIGHT / 2;
      }

      return { ...edge, d: buildPath(sx, sy, tx, ty) };
    });
  }, [edges, nodes, layout, nodeEls]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Inner content sized to fit all nodes */}
      <div
        className="relative"
        style={{ minWidth: layout.width, minHeight: layout.height }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          width={layout.width}
          height={layout.height}
        >
          {edgePaths.map((ep) => {
            const Renderer = edgeTypes[ep.type];
            return Renderer ? <Renderer key={ep.id} d={ep.d} /> : null;
          })}
        </svg>

        {nodes.map((node) => {
          const Renderer = nodeTypes[node.type];
          if (!Renderer) return null;
          return (
            <div
              key={node.id}
              data-node-id={node.id}
              className="absolute"
              style={{
                left: node.position.x + layout.offsetX,
                top: node.position.y + layout.offsetY,
              }}
            >
              <Renderer data={node.data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
