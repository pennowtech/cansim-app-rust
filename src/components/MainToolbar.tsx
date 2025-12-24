import React from "react";
import { Play, Square, Download, Upload, FileDown, FileUp, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isCapturing: boolean;
  onStartLive: () => void;
  onStopLive: () => void;
  onExportCsv: () => void;
  onImportCsv: () => void;
  onExportRaw: () => void;
  onImportRaw: () => void;
  onLoadDemo: () => void;
}

function ToolbarButton(props: {
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.icon}
          <span className="hidden sm:inline">{props.label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{props.tooltip}</TooltipContent>
    </Tooltip>
  );
}

export const MainToolbar: React.FC<Props> = ({
  isCapturing,
  onStartLive,
  onStopLive,
  onExportCsv,
  onImportCsv,
  onExportRaw,
  onImportRaw,
  onLoadDemo,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 px-2 py-1 border-b bg-background/80 backdrop-blur">
        {/* Live capture */}
        <ToolbarButton
          label="Capture live"
          tooltip="Start capturing live CAN frames"
          icon={<Play className="h-4 w-4" />}
          onClick={onStartLive}
          disabled={isCapturing}
        />

        <ToolbarButton
          label="Stop"
          tooltip="Stop capturing live CAN frames"
          icon={<Square className="h-4 w-4" />}
          onClick={onStopLive}
          disabled={!isCapturing}
        />

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* CSV */}
        <ToolbarButton
          label="Export CSV"
          tooltip="Export visible data as CSV"
          icon={<Download className="h-4 w-4" />}
          onClick={onExportCsv}
        />

        <ToolbarButton
          label="Import CSV"
          tooltip="Load CSV into table (clears existing data)"
          icon={<Upload className="h-4 w-4" />}
          onClick={onImportCsv}
        />

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Raw logs */}
        <ToolbarButton
          label="Export candump"
          tooltip="Export current data as raw CAN log"
          icon={<FileDown className="h-4 w-4" />}
          onClick={onExportRaw}
        />

        <ToolbarButton
          label="Import candump"
          tooltip="Load raw CAN log file"
          icon={<FileUp className="h-4 w-4" />}
          onClick={onImportRaw}
        />

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Demo */}
        <ToolbarButton
          label="Load demo"
          tooltip="Load built-in demo data"
          icon={<FlaskConical className="h-4 w-4" />}
          onClick={onLoadDemo}
        />
      </div>
    </TooltipProvider>
  );
};
