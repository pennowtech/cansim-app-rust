import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { Theme, ResolvedTheme } from "@/theme-provider";

type Props = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  onThemeChange: (t: Theme) => void;
};

function ThemeIcon({ theme, resolvedTheme }: { theme: Theme; resolvedTheme: ResolvedTheme }) {
  if (theme === "system") return <Monitor className="h-5 w-5" />;
  return resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;
}

export function ThemeToggle({ theme, resolvedTheme, onThemeChange }: Props) {
  const label = theme === "system" ? `Theme: System (${resolvedTheme})` : `Theme: ${theme}`;

  // Quick toggle behavior:
  // - if currently system, toggle to the opposite of resolvedTheme
  // - else toggle between light/dark
  const onQuickToggle = () => {
    if (theme === "system") {
      onThemeChange(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      onThemeChange(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={label}
                title={label}
                onClick={(e) => {
                  // Left click = quick toggle
                  // Right click / menu open still works via dropdown trigger
                  // We only quick-toggle on normal click; user can open menu via caret? (not shown)
                  // To keep it simple: quick toggle on click, menu opens on keyboard/context menu.
                  // If you prefer: remove onClick and rely purely on dropdown menu.
                  onQuickToggle();
                  e.preventDefault();
                }}
              >
                <ThemeIcon theme={theme} resolvedTheme={resolvedTheme} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>

        {/* Menu for explicit choice */}
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onThemeChange("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onThemeChange("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onThemeChange("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            System ({resolvedTheme})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
