export type SignalModel = {
  id: string;
  name: string;
  startByte: number;
  length: number;
  byteOrder: "little" | "big";
  factor: number;
  offset: number;
  unit?: string;
};

export type FrameModel = {
  id: string; // "0x18FF50E5"
  name?: string;
  signals: Record<string, SignalModel>;
};

export type DerivedFieldModel = {
  id: string;
  name: string;
  source: "signal" | "expression";
  signalId?: string;
  expr?: string;
  fieldTypeId?: string;
};

export type ColumnModel = {
  id: string;
  label: string;
  source: "frame" | "signal" | "derived" | "expression";
  key?: string;
  signalId?: string;
  derivedId?: string;
  expr?: string;
  unit?: string;
  visible: boolean;
};

export type ProfileModel = {
  meta: {
    name: string;
    version: string;
    description?: string;
  };
  frames: Record<string, FrameModel>;
  derivedFields: Record<string, DerivedFieldModel>;
  columns: ColumnModel[];
};
