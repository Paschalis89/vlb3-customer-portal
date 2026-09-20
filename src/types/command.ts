export type CustomerCommandType =
  | 'VLB3_START'
  | 'VLB3_STOP'
  | 'VLB3_SET_FREQUENCY';

export type CustomerCommandStatus =
  | 'QUEUED'
  | 'DELIVERED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'EXPIRED';

export interface CreateCustomerCommandRequest {
  type: CustomerCommandType;
  frequencyHz?: number;
}

export interface CustomerCommand {
  id: string;
  deviceId: string;
  type: CustomerCommandType;
  status: CustomerCommandStatus;
  frequencyHz: number | null;
  createdAt: string;
  updatedAt: string;
  failureMessage: string | null;
}
