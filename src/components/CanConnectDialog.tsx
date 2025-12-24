import * as React from "react";
import { CircleHelp, PlugZap } from "lucide-react";

import { useIsMobileLike } from "@/hooks/useIsMobileLike";
import type { SocketCANCapabilities } from "@/hooks/useCANCapabilities";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpHint } from "@/components/help-hint";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type CANConnectionMode = "remote" | "local";
type Proto = "grpc" | "ws" | "tcp";

export type ConnectSettings = {
  mode: CANConnectionMode;
  proto: Proto;
  host: string;
  port: string;
  iface: string;
};

const defaultSettings: ConnectSettings = {
  mode: "remote",
  proto: "grpc",
  host: "127.0.0.1",
  port: "9502",
  iface: "can0",
};

function ConnectForm({
  socketCanCaps,
  value,
  onChange,
  onConnect,
}: {
  socketCanCaps: SocketCANCapabilities | null;
  value: ConnectSettings;
  onChange: (next: ConnectSettings) => void;
  onConnect: () => void;
}) {
  const socketcanDisabled = !!socketCanCaps && !socketCanCaps.socketcan_available;
  console.log("[ui] socketCanCaps:", socketCanCaps);

  // Safely set mode, falling back to remote if local is disabled.
  const setModeSafely = (nextMode: CANConnectionMode) => {
    if (nextMode === "local" && socketcanDisabled) {
      const msg = socketCanCaps?.socketcan_reason ?? "SocketCAN not supported on this platform.";
      console.warn(`[ui] Local SocketCAN blocked: ${msg}`);
      setStatus({ kind: "warn", msg });
      onChange({ ...value, mode: "remote" });
      return;
    }
    onChange({ ...value, mode: nextMode });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">CANConnectionMode</div>
          <HelpHint text="Remote works everywhere. Local SocketCAN is Linux-only." />
        </div>
        {socketCanCaps ? (
          <Badge variant={socketCanCaps.socketcan_available ? "default" : "secondary"}>{socketCanCaps.platform}</Badge>
        ) : (
          <Badge variant="secondary">loading…</Badge>
        )}
      </div>

      <RadioGroup value={value.mode} onValueChange={(v) => setModeSafely(v as CANConnectionMode)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="remote" id="mode-remote" />
          <Label htmlFor="mode-remote">Remote (TCP/WS/gRPC)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="local" id="mode-local" disabled={socketcanDisabled} />
          <Label htmlFor="mode-local" className={socketcanDisabled ? "opacity-50" : ""}>
            Local SocketCAN (Linux-only)
          </Label>
        </div>

        {socketcanDisabled ? (
          <div className="text-xs opacity-70">Local disabled: {socketCanCaps?.socketcan_reason}</div>
        ) : null}
      </RadioGroup>

      <Separator />

      {value.mode === "remote" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Remote settings</div>
            <HelpHint text="Use your daemon over the network. This is the main cross-platform workflow." />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="proto">Protocol</Label>
              <select
                id="proto"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={value.proto}
                onChange={(e) => onChange({ ...value, proto: e.target.value as Proto })}
              >
                <option value="grpc">gRPC</option>
                <option value="ws">WebSocket</option>
                <option value="tcp">TCP</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={value.host}
                onChange={(e) => onChange({ ...value, host: e.target.value })}
                placeholder="127.0.0.1"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={value.port}
                onChange={(e) => onChange({ ...value, port: e.target.value })}
                placeholder="9502"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Local SocketCAN</div>
            <HelpHint text="Linux-only. Next step: list actual interfaces from backend (can0, can1…)." />
          </div>

          <div className="space-y-1 max-w-sm">
            <Label htmlFor="iface">Interface</Label>
            <Input
              id="iface"
              value={value.iface}
              onChange={(e) => onChange({ ...value, iface: e.target.value })}
              placeholder="can0"
              disabled={socketcanDisabled}
            />
          </div>

          {socketcanDisabled ? (
            <Alert>
              <AlertTitle>Local mode unavailable</AlertTitle>
              <AlertDescription>{socketCanCaps?.socketcan_reason}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <Button onClick={onConnect} className="gap-2">
          <PlugZap className="h-4 w-4" />
          Connect (stub)
        </Button>
        <div className="text-xs opacity-70">Logs go to terminal.</div>
      </div>
    </div>
  );
}

export function CanConnectDialog({
  socketCanCaps,
  canDialogOpen,
  onOpenChange,
  onConnectHandler,
}: {
  socketCanCaps: SocketCANCapabilities | null;
  canDialogOpen: boolean;
  onOpenChange: (v: boolean) => void;
  onConnectHandler?: (settings: ConnectSettings) => void;
}) {
  const isMobileLike = useIsMobileLike();
  const isLinux = navigator.userAgent.toLowerCase().includes("linux");

  const [settings, setSettings] = React.useState<ConnectSettings>(() => {
    const saved = localStorage.getItem("connect_settings_v1");
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        // ignore
      }
    }
    return defaultSettings;
  });

  const onConnect = () => {
    // very lightweight validation for now
    if (settings.mode === "remote") {
      const nport = Number(settings.port);
      const okPort = Number.isInteger(nport) && nport >= 1 && nport <= 65535;
      if (!settings.host.trim() || !okPort) {
        console.warn("[ui] connect validation failed: host empty or invalid port");
        return;
      }
      const url =
        settings.proto === "grpc"
          ? `grpc://${settings.host.trim()}:${nport}`
          : settings.proto === "ws"
            ? `ws://${settings.host.trim()}:${nport}`
            : `tcp://${settings.host.trim()}:${nport}`;
      console.log(`[ui] connect (stub): remote -> ${url}`);
    } else {
      console.log(`[ui] connect (stub): local -> iface=${settings.iface.trim()}`);
    }

    localStorage.setItem("connect_settings_v1", JSON.stringify(settings));
    onConnectHandler?.(settings);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-3">
      <ConnectForm socketCanCaps={socketCanCaps} value={settings} onChange={setSettings} onConnect={onConnect} />
      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs opacity-70">
          Desktop UX: modal dialog keeps context. Mobile UX: bottom sheet is thumb-friendly.
        </CardContent>
      </Card>
    </div>
  );

  // Desktop: Dialog, Mobile: Sheet
  if (isMobileLike) {
    return (
      <Sheet open={canDialogOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button>Connect…</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Connect</SheetTitle>
            <SheetDescription>Choose remote or local connection.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={canDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Connect…</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Connect</DialogTitle>
          <DialogDescription>Choose remote or local connection.</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
