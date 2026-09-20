import { appConfig } from '../config/app';
import { loadDemoDevice } from '../demo/devices';
import type { CustomerDeviceDetail } from '../types/device';
import { apiRequest } from './client';

export async function getDevice(deviceId: string): Promise<CustomerDeviceDetail> {
  if (appConfig.demoMode) {
    return loadDemoDevice(deviceId);
  }

  return apiRequest<CustomerDeviceDetail>(
    `/customer/devices/${encodeURIComponent(deviceId)}`,
  );
}
