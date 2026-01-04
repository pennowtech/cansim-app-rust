import { EditorPanel } from "./EditorPanel";
import { NavigationTree } from "./NavigationTree";
import { useEditorStore } from "@/store/editorStore";

export function EditorShell() {
  useEditorStore.setState((state) => ({
    ...state,
    profile: {
      meta: { name: "Demo Profile", version: "1.0" },
      frames: {
        "0x18FF50E5": {
          id: "0x18FF50E5",
          name: "VehicleStatus",
          signals: {
            vehicleSpeed: {
              id: "vehicleSpeed",
              name: "VehicleSpeed",
              startByte: 1,
              length: 2,
              byteOrder: "little",
              factor: 0.01,
              offset: 0,
              unit: "km/h",
            },
          },
        },
      },
      derivedFields: {
        overspeed: {
          id: "overspeed",
          name: "Overspeed",
          source: "expression",
          expr: "VehicleSpeed > 120",
        },
      },
      columns: [],
    },
  }));

  return (
    <div className="flex h-screen">
      <NavigationTree />
      <EditorPanel />
    </div>
  );
}
