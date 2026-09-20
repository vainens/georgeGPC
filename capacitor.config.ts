import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.georgegpc.app',
  appName: 'georgeGPC',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
