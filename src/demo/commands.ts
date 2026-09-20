import {
  getDemoDevice,
  updateDemoDeviceFrequency,
  updateDemoDevicePumpState,
} from './deviceStore';
import type {
  CreateCustomerCommandRequest,
  CustomerCommand,
  CustomerCommandStatus,
} from '../types/command';

interface DemoCommandRecord extends CustomerCommand {
  applied: boolean;
}

const commands = new Map<string, DemoCommandRecord>();

function createId(): string {
  return `demo-command-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function validateRequest(deviceId: string, request: CreateCustomerCommandRequest): void {
  const device = getDemoDevice(deviceId);

  if (!device) {
    throw new Error('Dispositivo non trovato.');
  }

  if (device.connectivity !== 'ONLINE') {
    throw new Error("L'impianto non è collegato. Riprova quando sarà nuovamente online.");
  }

  if (request.type === 'VLB3_START' && device.hasFault) {
    throw new Error('La pompa è in allarme. Avvio remoto non disponibile.');
  }

  if (request.type === 'VLB3_SET_FREQUENCY') {
    if (
      request.frequencyHz === undefined ||
      !Number.isFinite(request.frequencyHz) ||
      request.frequencyHz < 30 ||
      request.frequencyHz > 50
    ) {
      throw new Error('La frequenza deve essere compresa tra 30.00 e 50.00 Hz.');
    }
  }
}

function statusForElapsedTime(milliseconds: number): CustomerCommandStatus {
  if (milliseconds < 700) {
    return 'QUEUED';
  }

  if (milliseconds < 1_500) {
    return 'DELIVERED';
  }

  return 'SUCCEEDED';
}

function applySuccessfulCommand(command: DemoCommandRecord): void {
  if (command.applied) {
    return;
  }

  switch (command.type) {
    case 'VLB3_START':
      updateDemoDevicePumpState(command.deviceId, 'RUNNING');
      break;
    case 'VLB3_STOP':
      updateDemoDevicePumpState(command.deviceId, 'STOPPED');
      break;
    case 'VLB3_SET_FREQUENCY':
      if (command.frequencyHz !== null) {
        updateDemoDeviceFrequency(command.deviceId, command.frequencyHz);
      }
      break;
  }

  command.applied = true;
}

function cloneCommand(command: DemoCommandRecord): CustomerCommand {
  const { applied: _applied, ...result } = command;
  return { ...result };
}

export async function createDemoCommand(
  deviceId: string,
  request: CreateCustomerCommandRequest,
): Promise<CustomerCommand> {
  validateRequest(deviceId, request);

  const now = new Date().toISOString();
  const command: DemoCommandRecord = {
    id: createId(),
    deviceId,
    type: request.type,
    status: 'QUEUED',
    frequencyHz: request.type === 'VLB3_SET_FREQUENCY' ? (request.frequencyHz ?? null) : null,
    createdAt: now,
    updatedAt: now,
    failureMessage: null,
    applied: false,
  };

  commands.set(command.id, command);
  return cloneCommand(command);
}

export async function getDemoCommand(commandId: string): Promise<CustomerCommand> {
  const command = commands.get(commandId);

  if (!command) {
    throw new Error('Comando non trovato.');
  }

  const elapsed = Date.now() - new Date(command.createdAt).getTime();
  command.status = statusForElapsedTime(elapsed);
  command.updatedAt = new Date().toISOString();

  if (command.status === 'SUCCEEDED') {
    applySuccessfulCommand(command);
  }

  return cloneCommand(command);
}
