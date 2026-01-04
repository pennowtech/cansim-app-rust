import { cn } from "@/lib/utils";

type HighlightColor = "blue" | "green" | "red" | "yellow";

export type PayloadHighlight = {
  id: string;
  start: number; // byte index
  length: number; // byte count
  color?: HighlightColor;
  label?: string;
};

export type PayloadPreviewProps = {
  data: Uint8Array; // payload (0–64)
  maxLength?: number; // default 64
  highlights?: PayloadHighlight[];
  dimUnused?: boolean; // bytes beyond data.length
};

const COLOR_CLASS: Record<HighlightColor, string> = {
  blue: "bg-blue-500/20 border-blue-500",
  green: "bg-green-500/20 border-green-500",
  red: "bg-red-500/20 border-red-500",
  yellow: "bg-yellow-500/20 border-yellow-500",
};

export function PayloadPreview({ data, maxLength = 64, highlights = [], dimUnused = true }: PayloadPreviewProps) {
  const bytes = Array.from({ length: maxLength }, (_, i) => (i < data.length ? data[i] : null));

  function getHighlight(byteIndex: number) {
    return highlights.find((h) => byteIndex >= h.start && byteIndex < h.start + h.length);
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="text-sm font-medium">
        Payload ({data.length} / {maxLength} bytes)
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-2">
        {bytes.map((value, index) => {
          const highlight = getHighlight(index);

          return (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-center rounded-md border px-2 py-1 text-xs font-mono",
                dimUnused && value === null ? "opacity-30" : "opacity-100",
                highlight ? COLOR_CLASS[highlight.color ?? "blue"] : "border-muted",
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
