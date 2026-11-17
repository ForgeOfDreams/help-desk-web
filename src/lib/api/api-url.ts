import { appConfig } from '../../config/env';

export function resolveApiUrl(path: string, baseUrl = appConfig.apiBaseUrl): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}/${normalizedPath}`;
}
