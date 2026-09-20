import { useCallback, useEffect, useRef, useState } from 'react';
import { createDeviceCommand, getCommand } from '../api/commands';
import type {
  CreateCustomerCommandRequest,
  CustomerCommand,
  CustomerCommandStatus,
} from '../types/command';

interface UseDeviceCommandOptions {
  onSucceeded?: (command: CustomerCommand) => void | Promise<void>;
}

interface UseDeviceCommandResult {
  command: CustomerCommand | null;
  error: string | null;
  isPending: boolean;
  execute: (request: CreateCustomerCommandRequest) => Promise<void>;
  reset: () => void;
}

const terminalStatuses: CustomerCommandStatus[] = ['SUCCEEDED', 'FAILED', 'EXPIRED'];

function isTerminal(status: CustomerCommandStatus): boolean {
  return terminalStatuses.includes(status);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non è stato possibile inviare il comando.';
}

export function useDeviceCommand(
  deviceId: string,
  options: UseDeviceCommandOptions = {},
): UseDeviceCommandResult {
  const [command, setCommand] = useState<CustomerCommand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const onSucceededRef = useRef(options.onSucceeded);

  useEffect(() => {
    onSucceededRef.current = options.onSucceeded;
  }, [options.onSucceeded]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  const poll = useCallback(
    async (commandId: string) => {
      try {
        const next = await getCommand(commandId);
        if (!mountedRef.current) {
          return;
        }

        setCommand(next);

        if (isTerminal(next.status)) {
          stopPolling();
          if (next.status === 'SUCCEEDED') {
            await onSucceededRef.current?.(next);
          }
          return;
        }

        pollTimerRef.current = window.setTimeout(() => {
          void poll(commandId);
        }, 450);
      } catch (pollError) {
        if (!mountedRef.current) {
          return;
        }

        stopPolling();
        setError(getErrorMessage(pollError));
      }
    },
    [stopPolling],
  );

  const execute = useCallback(
    async (request: CreateCustomerCommandRequest) => {
      stopPolling();
      setError(null);
      setCommand(null);

      try {
        const created = await createDeviceCommand(deviceId, request);
        if (!mountedRef.current) {
          return;
        }

        setCommand(created);
        await poll(created.id);
      } catch (executeError) {
        if (!mountedRef.current) {
          return;
        }
        setError(getErrorMessage(executeError));
      }
    },
    [deviceId, poll, stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setCommand(null);
    setError(null);
  }, [stopPolling]);

  return {
    command,
    error,
    isPending: command !== null && !isTerminal(command.status),
    execute,
    reset,
  };
}
