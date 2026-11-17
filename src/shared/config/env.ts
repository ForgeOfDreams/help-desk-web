const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';
const appName = import.meta.env.VITE_APP_NAME?.trim() || 'Help Desk';

if (!apiBaseUrl.startsWith('/') && !/^https?:\/\//i.test(apiBaseUrl)) {
  throw new Error('VITE_API_BASE_URL must be a path such as /api or an absolute HTTP(S) URL.');
}

export const appConfig = Object.freeze({
  appName,
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
});
