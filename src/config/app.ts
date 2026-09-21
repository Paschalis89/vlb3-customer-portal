const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

export const appConfig = {
  version: '0.6.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  demoMode: parseBoolean(import.meta.env.VITE_DEMO_MODE, true),
} as const;
