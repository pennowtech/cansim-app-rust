export type CANConnectionMode = "remote" | "local";
export type RemoteProtocol = "grpc" | "ws" | "tcp";

export type CANConnectionSettings = {
  mode: CANConnectionMode;
  remoteProtocol: RemoteProtocol;
  host: string;
  port: number;
  iface: string;
};

export type SavedConnectionProfile = {
  id: string;
  name: string;
  connectionSettings: CANConnectionSettings;
  updatedAt: number;
};
