import * as React from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Hook to detect if the device is mobile-like (touchscreen).
// Uses CSS media query for "coarse pointer" as a proxy for touch devices.
function useIsMobileLike() {
  // “coarse pointer” is a good proxy for touch devices (phones/tablets)
  const [isMobileLike, setIsMobileLike] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(pointer: coarse)");
    const update = () => setIsMobileLike(!!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  return isMobileLike;
}

// HelpHint component: shows a help icon with tooltip on desktop, or inline text on mobile.
// Props:
// - text: the help text to show
// - className: optional CSS class for the inline text (mobile)
export function HelpHint({ text, mobileText, className }: { text: string; mobileText?: string; className?: string }) {
  const isMobileLike = useIsMobileLike();

  if (isMobileLike) {
    // Mobile: show inline explanatory text instead of tooltip.
    return <div className={className ?? "text-xs opacity-70"}>{mobileText ?? text}</div>;
  }

  // Desktop: show question mark icon with tooltip.
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1 opacity-70 hover:opacity-100"
            aria-label="Help"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
