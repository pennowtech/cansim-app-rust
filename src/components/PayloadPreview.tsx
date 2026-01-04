import { cn } from "@/lib/utils";

type HighlightColor = "blue" | "green" | "red" | "yellow";
export type PayloadPreviewMode = "compact" | "expanded";

export type PayloadHighlight = {
  id: string;
  start: number; // byte index
  length: number; // byte count
  color?: HighlightColor;
  label?: string;
};

// PayloadPreview component props definition
// - data: Uint8Array representing the payload to display (0–64 bytes).
// - maxLength: Optional number to limit the displayed length of the payload (default is 64).
// - highlights: Optional array of PayloadHighlight objects to highlight specific byte ranges.
// - mode: Optional display mode, either "compact" or "expanded" (default is "compact").
export type PayloadPreviewProps = {
  data: Uint8Array;
  maxLength?: number;
  highlights?: PayloadHighlight[];
  mode?: PayloadPreviewMode;
};

const HIGHLIGHT_BG: Record<HighlightColor, string> = {
  blue: "bg-blue-500/20 border-blue-500",
  green: "bg-green-500/20 border-green-500",
  red: "bg-red-500/20 border-red-500",
  yellow: "bg-yellow-500/20 border-yellow-500",
};

export function PayloadPreview({ data, maxLength = 64, highlights = [], mode = "compact" }: PayloadPreviewProps) {
  function highlightAt(index: number) {
    return highlights.find((h) => index >= h.start && index < h.start + h.length);
  }

  return mode === "compact" ? renderCompact() : renderExpanded();

  // =====================
  // COMPACT (hex dump)
  // =====================
  function renderCompact() {
    const rows = Math.ceil(maxLength / 16);

    return (
      <div className="font-mono text-xs space-y-1">
        {Array.from({ length: rows }).map((_, rowIdx) => {
          const rowStart = rowIdx * 16;

          return (
            <div key={rowIdx} className="flex gap-2">
              {/* Offset */}
              <div className="w-10 shrink-0 text-muted-foreground">{rowStart.toString(16).padStart(2, "0")}:</div>

              {/* Bytes */}
              <div className="flex flex-wrap gap-x-1">
                {Array.from({ length: 16 }).map((_, colIdx) => {
                  const index = rowStart + colIdx;
                  if (index >= maxLength) return null;

                  const value = index < data.length ? data[index] : null;
                  const h = highlightAt(index);

                  return (
                    <span
                      key={index}
                      className={cn(
                        "px-1 rounded-sm",
                        value === null ? "text-muted-foreground/40" : "text-foreground",
                        h && HIGHLIGHT_BG[h.color ?? "blue"],
                      )}
                      title={h?.label ? `${h.label} (byte ${index})` : `Byte ${index}`}
                    >
                      {value === null ? "--" : value.toString(16).padStart(2, "0").toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // =====================
  // EXPANDED (grid/cards)
  // =====================
  function renderExpanded() {
    return (
      <div className="space-y-2">
        {/* Grid */}
        <div className="grid grid-cols-16 gap-x-1">
          {Array.from({ length: maxLength }).map((_, index) => {
            const value = index < data.length ? data[index] : null;
            const highlight = highlightAt(index);

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border px-2 py-1 text-xs font-mono",
                  value === null ? "opacity-30" : "opacity-100",
                  highlight ? HIGHLIGHT_BG[highlight.color ?? "blue"] : "border-muted",
                )}
                title={highlight?.label ? `${highlight.label} (byte ${index})` : `Byte ${index}`}
              >
                <div className="text-muted-foreground">{index.toString().padStart(2, "0")}</div>
                <div>{value === null ? "--" : value.toString(16).padStart(2, "0").toUpperCase()}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
