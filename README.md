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

### 5. Project Architecture

<img width="877" alt="image" src="https://github.com/user-attachments/assets/be71c152-9990-4241-a31a-375aa74b487f" />



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
