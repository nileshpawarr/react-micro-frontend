import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './src/environments')

  return {
    plugins: [
      react(),
      federation({
        name: 'mfe2',
        filename: 'remoteEntry.js',
        remotes: {
          host: env.VITE_HOST_URL || 'http://localhost:5000/assets/remoteEntry.js'
        },
        exposes: {
          './App': './src/App.tsx'
        },
        shared: ['react', 'react-dom']
      })
    ],
    resolve: {
      alias: {
        "@": "./src",
      },
    },
    envDir: './src/environments',
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    },
    server: {
      port: Number(env.VITE_APP_PORT) || 5002,
      strictPort: true,
      cors: true
    }
  }
})
