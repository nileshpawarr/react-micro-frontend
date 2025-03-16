/**
 * Environment variables utility
 */

export const env = {
    appName: import.meta.env.VITE_APP_NAME || 'Host App',
    environment: import.meta.env.VITE_APP_ENV || 'development',
    isProduction: import.meta.env.VITE_PRODUCTION === 'true',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    mfe1Url: import.meta.env.VITE_MFE1_URL || 'http://localhost:5001/assets/remoteEntry.js',
    mfe2Url: import.meta.env.VITE_MFE2_URL || 'http://localhost:5002/assets/remoteEntry.js',
}; 