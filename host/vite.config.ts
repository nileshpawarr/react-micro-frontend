import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './src/environments')

  return {
    plugins: [
      react(),
      federation({
        name: 'host',
        filename: 'remoteEntry.js',
        remotes: {
          mfe1: env.VITE_MFE1_URL || 'http://localhost:5001/assets/remoteEntry.js',
          mfe2: env.VITE_MFE2_URL || 'http://localhost:5002/assets/remoteEntry.js'
        },
        exposes: {
          './store': './src/store'
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    },
    server: {
      port: Number(env.VITE_APP_PORT) || 5000,
      strictPort: true,
      cors: true
    },
    envDir: './src/environments'
  }
})