import { useEditorStore } from "@/store/editorStore";

export function NavigationTree() {
  const { profile, select } = useEditorStore();

  return (
    <div className="w-64 border-r p-2">
      <h3 className="font-semibold mb-2">{profile.meta.name}</h3>

      <div className="text-sm space-y-1">
        {Object.values(profile.frames).map((frame) => (
          <div key={frame.id}>
            <div className="font-medium">{frame.id}</div>
            {Object.values(frame.signals).map((sig) => (
              <button
                key={sig.id}
                className="ml-4"
                onClick={() =>
                  select({
                    type: "signal",
                    frameId: frame.id,
                    signalId: sig.id,
                  })
                }
              >
                {sig.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Derived Fields */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground">Derived Fields</div>

        {Object.values(profile.derivedFields).length === 0 && (
          <div className="ml-2 text-xs text-muted-foreground">(none)</div>
        )}

        {Object.values(profile.derivedFields).map((df) => (
          <button
            key={df.id}
            className="ml-2 text-sm text-left hover:underline"
            onClick={() => select({ type: "derived", derivedId: df.id })}
          >
            {df.name}
          </button>
        ))}
      </div>

      {/* Columns */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground">Columns</div>

        <button className="ml-2 text-sm hover:underline" onClick={() => select({ type: "columns" })}>
          Edit Columns
        </button>
      </div>
    </div>
  );
}
