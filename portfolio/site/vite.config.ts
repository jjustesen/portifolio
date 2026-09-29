import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // PORT lets tooling assign a port; otherwise 5173, moving on if it is taken.
  server: {
    port: Number(process.env.PORT) || 5173,
    // Native file events were dropping quick successive edits on Windows; polling is reliable.
    watch: { usePolling: true, interval: 150 },
  },
});
