import { PayloadHighlight } from "@/components/PayloadPreview";
import { SignalModel } from "@/model/profile";

export function highlightForSignal(signal: SignalModel): PayloadHighlight {
  return {
    id: signal.id,
    start: signal.startByte,
    length: signal.length,
    color: "blue",
    label: signal.name,
  };
}
