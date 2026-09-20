import { appConfig } from '../config/app';
import { createDemoCommand, getDemoCommand } from '../demo/commands';
import type {
  CreateCustomerCommandRequest,
  CustomerCommand,
} from '../types/command';
import { apiRequest } from './client';

export async function createDeviceCommand(
  deviceId: string,
  request: CreateCustomerCommandRequest,
): Promise<CustomerCommand> {
  if (appConfig.demoMode) {
    return createDemoCommand(deviceId, request);
  }

  return apiRequest<CustomerCommand>(
    `/customer/devices/${encodeURIComponent(deviceId)}/commands`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  );
}

export async function getCommand(commandId: string): Promise<CustomerCommand> {
  if (appConfig.demoMode) {
    return getDemoCommand(commandId);
  }

  return apiRequest<CustomerCommand>(
    `/customer/commands/${encodeURIComponent(commandId)}`,
  );
}
