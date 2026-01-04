import { create } from "zustand";
import { CanFrame } from "@/can/frame";

type PreviewState = {
  frames: CanFrame[];
  selectedIndex: number;

  setFrames: (frames: CanFrame[]) => void;
  selectIndex: (index: number) => void;
};

export const usePreviewStore = create<PreviewState>((set) => ({
  frames: [],
  selectedIndex: 0,

  setFrames: (frames) => set({ frames, selectedIndex: 0 }),

  selectIndex: (index) => set({ selectedIndex: index }),
}));
