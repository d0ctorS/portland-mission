import { defineConfig } from 'vite';
export default defineConfig({ base: '/portland-mission/', build: { chunkSizeWarningLimit: 1600 }, server: { host: '0.0.0.0' } });
