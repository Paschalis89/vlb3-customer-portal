import { appConfig } from '../config/app';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiRequestOptions extends RequestInit {
  skipJsonContentType?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { skipJsonContentType = false, headers, ...requestOptions } = options;
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: {
      ...(skipJsonContentType ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = 'Si e verificato un errore durante la richiesta.';

    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep the generic customer-facing error.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
