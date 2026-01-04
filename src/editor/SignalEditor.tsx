import { useEditorStore } from "@/store/editorStore";
import { usePreviewStore } from "@/store/previewStore";
import { PayloadPreview } from "@/components/PayloadPreview";
import { highlightForSignal } from "./utils/signalHighlight";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function SignalEditor({ frameId, signalId }: { frameId: string; signalId: string }) {
  const { profile, updateProfile } = useEditorStore();
  const { frames, selectedIndex, selectIndex } = usePreviewStore();

  const signal = profile.frames[frameId].signals[signalId];

  const sampleFrame = frames[selectedIndex];
  const payload = sampleFrame?.data ?? new Uint8Array(0);

  console.log("Signal Editor log");
  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Signal: {signal.name}</h2>
        <p className="text-sm text-muted-foreground">Frame {frameId}</p>
      </div>

      <Separator />

      {/* BASIC */}
      <Card>
        <CardHeader>
          <CardTitle>Basic</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Start Byte</Label>
            <Input
              type="number"
              min={0}
              max={63}
              value={signal.startByte}
              onChange={(e) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].startByte = Number(e.target.value);
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Input
              type="number"
              min={1}
              max={64}
              value={signal.length}
              onChange={(e) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].length = Number(e.target.value);
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Byte Order</Label>
            <Select
              value={signal.byteOrder}
              onValueChange={(value) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].byteOrder = value as "little" | "big";
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="little">Little Endian</SelectItem>
                <SelectItem value="big">Big Endian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Factor</Label>
            <Input
              type="number"
              step="any"
              value={signal.factor}
              onChange={(e) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].factor = Number(e.target.value);
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Offset</Label>
            <Input
              type="number"
              step="any"
              value={signal.offset}
              onChange={(e) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].offset = Number(e.target.value);
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={signal.unit ?? ""}
              onChange={(e) =>
                updateProfile((p) => {
                  p.frames[frameId].signals[signalId].unit = e.target.value;
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* PREVIEW */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Payload Preview</CardTitle>

          {frames.length > 1 && (
            <Select value={String(selectedIndex)} onValueChange={(v) => selectIndex(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frames.map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    Sample #{i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>

        <CardContent>
          <PayloadPreview data={payload} highlights={[highlightForSignal(signal)]} />
        </CardContent>
      </Card>
    </div>
  );
}
