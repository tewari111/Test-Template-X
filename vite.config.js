import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

const baseUrl = 'http://65.1.132.241:8000';
export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  define: {
    'process.env': {
      scanOrg: `${baseUrl}/scanOrg`,
      settings: `${baseUrl}/settings`,
      getOrgScan: `${baseUrl}/getOrgScan`,
      scanRepo: `${baseUrl}/scanRepo`,
      setWhitelistSecrets: `${baseUrl}/setWhitelistSecrets`,
      webhookConfig: `${baseUrl}/webhookConfig`,
      prScanSecret: `${baseUrl}/prScanSecret`,
      removeWhitelistSecrets: `${baseUrl}/removeWhitelistSecrets`,
      getWhitelistSecrets: `${baseUrl}/getWhitelistSecrets`,
      getLogs: `${baseUrl}/getLogs`,
      fetchScanFile: `${baseUrl}/fetchScanFile?date_of_scan=`,
    },
  },
  server: {
    port: 3030,
  },
  preview: {
    port: 3030,
  },
});
