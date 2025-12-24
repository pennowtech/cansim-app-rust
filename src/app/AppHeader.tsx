/**
 * AppHeader.tsx
 * ------------------------------------------------------------
 * Application-wide header / top bar.
 *
 * RESPONSIBILITY
 * - Display app title
 * - Tab switching (CAN / MQTT)
 * - Show active data source label
 * - Theme toggle
 *
 * CONVENTIONS
 * - Pure presentational component
 * - Receives all state via props
 * - Emits simple callbacks only
 *
 * ALLOWED
 * - Styling
 * - Small UI conditionals
 *
 * NOT ALLOWED
 * - useState for business logic
 * - useEffect
 * - Any CAN-specific logic
 * - Theme persistence logic
 *
 * DESIGN GOAL
 * - Header must be reusable and stateless
 * - Easy to replace or redesign later
 */

import { ThemeToggle } from "@/components/ThemeToggle";
import { Theme, ResolvedTheme } from "@/theme-provider";

export function AppHeader(props: {
  activeTab: "can" | "mqtt";
  onTabChange: (t: "can" | "mqtt") => void;
  dataSourceLabel: string;
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  onThemeChange: (t: Theme) => void;
}) {
  const { activeTab, onTabChange, dataSourceLabel, theme, resolvedTheme, onThemeChange } = props;

  return (
    <header
      className="
        border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
        px-4 py-2 flex items-center justify-between shadow-sm
      "
    >
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold">CAN Simulator</div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            className={
              "px-2 py-1 rounded-md " +
              (activeTab === "can"
                ? "border-b bg-background/50 text-foreground"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
            }
            onClick={() => onTabChange("can")}
          >
            CAN Viewer
          </button>

          <button
            className={
              "px-2 py-1 rounded-md " +
              (activeTab === "mqtt"
                ? "bg-black text-white dark:bg-black text-foreground"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
            }
            onClick={() => onTabChange("mqtt")}
          >
            MQTT Explorer
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[11px] text-foreground/50">Source: {dataSourceLabel}</div>
        <ThemeToggle theme={theme} resolvedTheme={resolvedTheme} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}
