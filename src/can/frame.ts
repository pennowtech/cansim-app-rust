export type CanFrame = {
  timestamp: number;
  id: number;
  isExtended: boolean;
  isFD: boolean;
  brs?: boolean;
  esi?: boolean;
  dlc: number;
  data: Uint8Array; // 0–64 bytes
};
