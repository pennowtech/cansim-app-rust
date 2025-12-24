/**
 * useHorizontalSplitter.ts
 * ------------------------------------------------------------
 * Resizeable and reusable horizontal panel resize hook.
 // This mimics the behavior of a splitter between two panels.
 // In current React, there is no built-in splitter component, so we implement it manually.
 // It splits the DataTable and DetailPanel horizontally in desktop view.
 *
 * RESPONSIBILITY
 * - Track resizable panel width
 * - Handle mouse move / mouse up safely
 *
 * CONVENTIONS
 * - Pure UI behavior hook
 * - No knowledge of CAN or data
 *
 * ALLOWED
 * - window event listeners
 * - refs for mutable state
 *
 * NOT ALLOWED
 * - Layout markup
 * - Business logic
 *
 * DESIGN GOAL
 * - Fully reusable for any split-panel UI
 */

import { useEffect, useRef, useState } from "react";

// Hook to manage a horizontal splitter between two panels.
export function useHorizontalSplitter(initialWidth = 340) {
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dx = e.clientX - startXRef.current;
      let next = startWidthRef.current - dx;
      const MIN = 240;
      const MAX = 600;
      if (next < MIN) next = MIN;
      if (next > MAX) next = MAX;
      setPanelWidth(next);
    };

    const handleUp = () => {
      isResizingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const onSplitterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
  };

  return { panelWidth, onSplitterMouseDown };
}
