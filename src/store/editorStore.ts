import { create } from "zustand";
import { ProfileModel } from "@/model/profile";

type EditorSelection =
  | { type: "none" }
  | { type: "signal"; frameId: string; signalId: string }
  | { type: "derived"; derivedId: string }
  | { type: "columns" };

type EditorState = {
  profile: ProfileModel;
  selection: EditorSelection;
  dirty: boolean;

  select: (sel: EditorSelection) => void;
  updateProfile: (fn: (p: ProfileModel) => void) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  profile: {
    meta: { name: "New Profile", version: "1.0" },
    frames: {},
    derivedFields: {},
    columns: [],
  },
  selection: { type: "none" },
  dirty: false,

  select: (selection) => set({ selection }),

  updateProfile: (fn) =>
    set((state) => {
      const copy = structuredClone(state.profile);
      fn(copy);
      return { profile: copy, dirty: true };
    }),
}));
