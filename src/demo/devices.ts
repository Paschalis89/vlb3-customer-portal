import { getDemoDevice } from './deviceStore';
import type { CustomerDeviceDetail } from '../types/device';

const DEMO_LATENCY_MS = 220;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function loadDemoDevice(deviceId: string): Promise<CustomerDeviceDetail> {
  await delay(DEMO_LATENCY_MS);

  const device = getDemoDevice(deviceId);

  if (!device) {
    throw new Error('Dispositivo non trovato.');
  }

  return device;
}
