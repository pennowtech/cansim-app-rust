import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConnectionForm } from "./ConnectionForm";
import { CANConnectionSettings } from "@/types/CANConnectionSettings";
import { SocketCANCapabilities } from "@/hooks/useCANCapabilities";

type Props = {
  connectionSettings: CANConnectionSettings;
  setConnectionSettings: React.Dispatch<React.SetStateAction<CANConnectionSettings>>;

  // capabilities
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isLinux: boolean;
  socketCanCapabilities: SocketCANCapabilities | null;

  handleConnect: (settings: CANConnectionSettings) => void;
  handleLiveCapture: (settings: CANConnectionSettings) => void;
  // ifaces
  listIfaces: string[];
  // Fetch available ifaces
  fetchIfaces?: () => void;

  profiles: { id: string; name: string }[];
  onGetProfileName: (id: string) => string;
  onSaveProfile: (name: string) => void;
  onLoadProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
};

export function MobileLauncher(props: Props) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Connect</SheetTitle>
        </SheetHeader>

        <div className="pt-4">
          <ConnectionForm
            connectionSettings={props.connectionSettings}
            setConnectionSettings={props.setConnectionSettings}
            isLinux={props.isLinux}
            socketCanCapabilities={props.socketCanCapabilities}
            listIfaces={props.listIfaces}
            fetchIfaces={props.fetchIfaces}
            handleConnect={() => props.handleConnect(props.connectionSettings)}
            handleLiveCapture={() => props.handleLiveCapture(props.connectionSettings)}
            profiles={props.profiles}
            onGetProfileName={props.onGetProfileName}
            onSaveProfile={props.onSaveProfile}
            onLoadProfile={props.onLoadProfile}
            onDeleteProfile={props.onDeleteProfile}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
