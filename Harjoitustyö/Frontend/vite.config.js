import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind so LAN/tunnel can reach it
    host: '192.168.10.50',
    port: 5173,

    // ✅ allow your public hostname
    allowedHosts: ['vite.jannenkoti.com'],

    // If you’re accessing via HTTPS through Cloudflare Tunnel,
    // make HMR connect back to the same host over WSS:443
    hmr: {
      host: 'vite.jannenkoti.com',
      protocol: 'wss',
      clientPort: 443,
      port: 5173, // server’s actual port
    },

    // (Optional but helps absolute URLs)
    origin: 'https://vite.jannenkoti.com',

    // (Optional) fail fast if 5173 is taken
    strictPort: true,
  },
})
