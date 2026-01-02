/**
 * CanConnectDialog.tsx
 * ------------------------------------------------------------
 * Dialog for creating and managing CAN connection profiles.
 *
 * RESPONSIBILITY
 * - Provides a UI for users to create/edit connection profiles
 * - Supports local SocketCAN and remote daemon connections
 * - Saves profiles to global state and initiates connections
 *
 * CONVENTIONS
 * - Uses Tabs to switch between local and remote connection settings
 * - Uses Zustand for state management
 * - Generates unique IDs for new profiles
 * - Validates input fields before saving
 *
 * HOW TO USE
 * - Import and include <ConnectDialog /> in the application
 * - Control visibility via `open` prop and `onOpenChange` callback
 */

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useConnectionStore } from "@/store/connectionStore";
import { ConnectionProfile } from "@/model/connection";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CanConnectDialog({
  open,
  onOpenChange,
  editProfileId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editProfileId?: string;
}) {
  const { addProfile, connect } = useConnectionStore();
  const { profiles, updateProfile } = useConnectionStore();

  const [profile, setProfile] = useState<ConnectionProfile | null>(null);

  useEffect(() => {
    if (!open) return;

    if (editProfileId) {
      const existing = profiles.find((p) => p.id === editProfileId);
      if (existing) {
        setProfile(structuredClone(existing));
      }
    } else {
      setProfile({
        id: uuid(), // ✅ only here
        name: "New Connection",
        mode: "local",
        iface: "can0",
        autoReconnect: true,
      });
    }
  }, [open, editProfileId, profiles]);

  // Simple validation function
  function isValid(p: ConnectionProfile): string | null {
    if (!p.name) return "Name is required";

    if (p.mode === "local") {
      if (!p.iface) return "Interface required";
    }

    if (p.mode === "remote") {
      if (!p.host) return "Host required";
      if (!p.port) return "Port required";
      if (!p.protocol) return "Protocol required";
    }

    return null;
  }

  function saveAndConnect() {
    if (!profile) return;

    const error = isValid(profile);
    if (error) {
      // TODO: Show error message to user
      console.error(error);
      return;
    }
    if (editProfileId) {
      updateProfile(profile);
    } else {
      addProfile(profile);
    }
    connect(profile.id);
    onOpenChange(false);
  }

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Connect to CAN</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Connection Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>

          <Tabs
            value={profile.mode}
            onValueChange={(v) =>
              setProfile({
                ...profile,
                mode: v as "local" | "remote",
              })
            }
          >
            <TabsList>
              <TabsTrigger value="local">Local SocketCAN</TabsTrigger>
              <TabsTrigger value="remote">Remote Daemon</TabsTrigger>
            </TabsList>

            {/* LOCAL */}
            <TabsContent value="local" className="space-y-4">
              <div className="space-y-2">
                <Label>Interface</Label>
                <Input
                  value={profile.iface ?? ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      iface: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Linux only (e.g. can0, vcan0)</p>
              </div>
            </TabsContent>

            {/* REMOTE */}
            <TabsContent value="remote" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input
                    placeholder="192.168.1.10"
                    value={profile.host ?? ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        host: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input
                    type="number"
                    value={profile.port ?? 0}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        port: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Protocol</Label>
                <Select
                  value={profile.protocol}
                  onValueChange={(v) =>
                    setProfile({
                      ...profile,
                      protocol: v as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ws-json">WebSocket (JSON)</SelectItem>
                    <SelectItem value="ws-binary">WebSocket (Binary)</SelectItem>
                    <SelectItem value="tcp-jsonl">TCP (JSONL)</SelectItem>
                    <SelectItem value="grpc">gRPC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={profile.autoReconnect}
              onCheckedChange={(v) =>
                setProfile({
                  ...profile,
                  autoReconnect: Boolean(v),
                })
              }
            />
            <Label>Auto reconnect</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={saveAndConnect}>Save & Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
