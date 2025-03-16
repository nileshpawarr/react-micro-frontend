/**
 * Environment variables utility
 */

export const env = {
    appName: import.meta.env.VITE_APP_NAME || 'MFE2',
    environment: import.meta.env.VITE_APP_ENV || 'development',
    isProduction: import.meta.env.VITE_PRODUCTION === 'true',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    hostUrl: import.meta.env.VITE_HOST_URL || 'http://localhost:5000',
}; 