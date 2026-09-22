import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.visiontech.whatsapp',
  appName: 'Vision Tech',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
