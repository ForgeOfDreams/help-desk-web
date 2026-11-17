/** Reads a one-time token from an invitation/verification URL without changing it. */
export function readActionTokenFromUrl(href = window.location.href): string {
  const url = new URL(href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  return hashParams.get('token') ?? url.searchParams.get('token') ?? '';
}

/** Removes one-time tokens from the address bar after the page has captured them. */
export function clearActionTokenFromUrl(): void {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  const hasToken = hashParams.has('token') || url.searchParams.has('token');

  if (!hasToken) return;

  url.searchParams.delete('token');
  url.hash = '';
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
}
