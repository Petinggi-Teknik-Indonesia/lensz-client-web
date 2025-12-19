export type Scanner = {
  ID: number;
  deviceName: string;
  organizationId: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type ScannerInput = {
    deviceName: string;
};

export type UpdateScannerInput = {
    deviceName: string;
};