# React Microfrontend Architecture

This repository demonstrates a microfrontend architecture using React, Vite, and Module Federation. The project consists of a host application and multiple microfrontends that can be developed, deployed, and scaled independently.

## Architecture Overview

The architecture consists of:

1. **Host Application**: The container application that integrates microfrontends
2. **Microfrontend 1 (MFE1)**: A standalone application exposed to the host
3. **Microfrontend 2 (MFE2)**: Another standalone application exposed to the host

Each application is a complete React application with its own build process, dependencies, and deployment pipeline. They communicate through Module Federation, allowing them to share components, state, and dependencies.

## Key Features

- **Independent Development**: Each microfrontend can be developed independently
- **Shared Dependencies**: Common libraries like React are shared to avoid duplication
- **State Management**: Centralized state management using Zustand
- **Environment Configuration**: Environment-specific configuration for different deployment targets
- **TypeScript Support**: Full TypeScript support across all applications

## Prerequisites

- Node.js (v18+)
- Yarn or npm
- Basic knowledge of React, TypeScript, and Vite

## Project Structure

```
react-microfrontend/
├── host/                 # Host application
│   ├── src/              # Source code
│   │   ├── environments/ # Environment configurations
│   │   ├── store/        # Shared state management
│   │   └── ...
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.ts    # Vite and Module Federation configuration
├── mfe1/                 # Microfrontend 1
│   ├── src/              # Source code
│   │   ├── environments/ # Environment configurations
│   │   └── ...
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.ts    # Vite and Module Federation configuration
└── mfe2/                 # Microfrontend 2
    ├── src/              # Source code
    │   ├── environments/ # Environment configurations
    │   └── ...
    ├── package.json      # Dependencies and scripts
    └── vite.config.ts    # Vite and Module Federation configuration
```

## Step-by-Step Setup Guide

### 1. Create the Project Structure

```bash
mkdir react-microfrontend
cd react-microfrontend
mkdir host mfe1 mfe2
```

### 2. Set Up the Host Application

```bash
cd host
yarn create vite . --template react-ts
```

Install additional dependencies:

```bash
yarn add zustand
yarn add -D @originjs/vite-plugin-federation concurrently nodemon
```

### 3. Set Up Microfrontend 1

```bash
cd ../mfe1
yarn create vite . --template react-ts
yarn add -D @originjs/vite-plugin-federation concurrently nodemon
```

### 4. Set Up Microfrontend 2

```bash
cd ../mfe2
yarn create vite . --template react-ts
yarn add -D @originjs/vite-plugin-federation concurrently nodemon
```

### 5. Configure Module Federation

#### Host Application (vite.config.ts)

```typescript
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
```

#### Microfrontend 1 (vite.config.ts)

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './src/environments')

  return {
    plugins: [
      react(),
      federation({
        name: 'mfe1',
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
      cssCodeSplit: false,
    },
    server: {
      port: Number(env.VITE_APP_PORT) || 5001,
      strictPort: true,
      cors: true
    }
  }
})
```

#### Microfrontend 2 (vite.config.ts)

Configure similarly to MFE1, but with port 5002.

### 6. Set Up Environment Configuration

Create environment files for each application:

#### Host (src/environments/.env.dev)

```
VITE_ENV=dev
VITE_PRODUCTION=false
VITE_APP_NAME=Host App
VITE_APP_ENV=development
VITE_APP_PORT=5000
VITE_MFE1_URL=http://localhost:5001/assets/remoteEntry.js
VITE_MFE2_URL=http://localhost:5002/assets/remoteEntry.js
VITE_API_URL=http://localhost:8080/api
```

Create similar files for MFE1 and MFE2 with appropriate values.

### 7. Create State Management in Host

#### Host (src/store/index.ts)

```typescript
import { create } from 'zustand'

interface Store {
    count: number
    increment: () => void
    clear: () => void
}

const useStore = create<Store>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    clear: () => set({ count: 0 }),
}))

export default useStore;
```

### 8. Implement the Host Application

#### Host (src/App.tsx)

```typescript
import React, { lazy, Suspense } from 'react'
import './App.css'
import { env } from './utils/env'
import useStore from './store'

const MFE1 = lazy(() => import('mfe1/App'))
const MFE2 = lazy(() => import('mfe2/App'))

const App: React.FC = () => {
  const { count } = useStore()

  return (
    <div className="container">
      <header className="main-header">
        <h1>{env.appName}</h1>
      </header>

      <section>
        <h2>Host Count: {count}</h2>
      </section>

      <div className="mfe-grid">
        <Suspense fallback={<div>Loading MFE1...</div>}>
          <MFE1 />
        </Suspense>

        <Suspense fallback={<div>Loading MFE2...</div>}>
          <MFE2 />
        </Suspense>
      </div>
    </div>
  )
}

export default App
```

### 9. Implement Microfrontend 1

#### MFE1 (src/App.tsx)

```typescript
import React, { useState } from 'react';
import { env } from './utils/env';
import useStore from 'host/store'
import './App.css';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const { count: hostCount, increment, clear } = useStore()

  return (
    <div className="mfe1-wrapper mfe-card">
      <h2>{env.appName} Application</h2>
      <div className="mfe-content">
        <div className="feature-container">
          <div className="button-container">
            <button
              onClick={() => setCount(prev => prev + 1)}
              className="button"
            >
              Count: {count}
            </button>
            <button
              onClick={() => setCount(0)}
              className="button"
            >
              Clear
            </button>
          </div>
          <div className="button-container">
            <div className="button-group">
              <button
                onClick={increment}
                className="button"
              >
                Host Count: {hostCount}
              </button>
            </div>
            <div className="button-group">
              <button
                onClick={clear}
                className="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 10. Implement Microfrontend 2

Implement similarly to MFE1, with appropriate styling changes.

### 11. Configure Package Scripts

#### Host (package.json)

```json
"scripts": {
  "dev": "vite --mode dev --port 5000 --strictPort",
  "dev:fed": "concurrently \"vite build --watch --mode dev\" \"yarn preview:watch\"",
  "dev:all": "concurrently \"yarn dev:fed\" \"yarn --cwd ../mfe1 dev:fed\" \"yarn --cwd ../mfe2 dev:fed\"",
  "build": "tsc -b && vite build",
  "build:dev": "tsc && vite build --mode dev",
  "build:qa": "tsc && vite build --mode qa",
  "build:prod": "tsc && vite build --mode prod",
  "lint": "eslint .",
  "preview": "vite preview",
  "preview:watch": "nodemon --watch dist --exec \"vite preview --port 5000 --strictPort\""
}
```

#### MFE1 and MFE2 (package.json)

Configure similar scripts with appropriate port numbers.

### 12. Configure TypeScript

Ensure TypeScript is properly configured to recognize the remote modules:

#### Host (src/vite-env.d.ts)

```typescript
/// <reference types="vite/client" />

declare module 'mfe1/App';
declare module 'mfe2/App';
```

#### MFE1 and MFE2 (src/vite-env.d.ts)

```typescript
/// <reference types="vite/client" />

declare module 'host/store';
```

## Running the Application

### Development Mode (Individual Applications)

```bash
# In host directory
yarn dev

# In mfe1 directory
yarn dev

# In mfe2 directory
yarn dev
```

### Development Mode (All Applications)

```bash
# In host directory
yarn dev:all
```

### Production Build

```bash
# In each directory (host, mfe1, mfe2)
yarn build
```

## Deployment Considerations

1. **Independent Deployment**: Each microfrontend can be deployed independently
2. **Environment Configuration**: Use different environment files for different deployment targets
3. **URL Configuration**: Update the remote URLs in environment files for production deployments
4. **Versioning**: Consider versioning your microfrontends for better stability

## Advanced Topics

1. **Routing**: Implement routing within microfrontends using React Router
2. **Authentication**: Share authentication state between microfrontends
3. **Error Boundaries**: Implement error boundaries to prevent one microfrontend from crashing others
4. **Performance Optimization**: Optimize bundle sizes and loading strategies
5. **Testing**: Implement unit and integration tests for microfrontends

## Troubleshooting

1. **Module Federation Issues**: Ensure shared dependencies have compatible versions
2. **CORS Issues**: Make sure CORS is properly configured in development and production
3. **Build Issues**: Check that all applications are built with compatible settings

## Conclusion

This microfrontend architecture provides a scalable approach to building complex React applications. By separating concerns into independent applications, teams can work more efficiently and deploy more frequently, while still providing a cohesive user experience. 