export const brandingConfig = {
  appName: import.meta.env.VITE_APP_NAME ?? 'VLB3 Remote',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@example.com',
  shortName: 'VLB3',
  poweredBy: 'VLB3 Remote Manager',
} as const;
