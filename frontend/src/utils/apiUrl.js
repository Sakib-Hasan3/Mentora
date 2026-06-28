/**
 * Resolve API base URL.
 * Priority:
 *   1. REACT_APP_API_URL env var (set in Vercel dashboard or .env.production)
 *   2. Local dev: port 3000 → same host at :8000
 *   3. Known production hostname → hardcoded Render backend
 *   4. Fallback: localhost:8000
 */

const PRODUCTION_API = 'https://mentora-q60e.onrender.com';

export const getApiBaseUrl = () => {
  // 1. Always prefer explicitly configured env var (baked in at build time)
  if (process.env.REACT_APP_API_URL) {
    return `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;

    // 2. Local dev server (CRA default port)
    if (port === '3000') {
      return `${protocol}//${hostname}:8000/api`;
    }

    // 3. Running on Vercel production → use Render backend
    if (hostname.includes('vercel.app') || hostname.includes('mentora')) {
      return `${PRODUCTION_API}/api`;
    }

    // 4. LAN / same-host deployment
    const portStr = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portStr}/api`;
  }

  return `${PRODUCTION_API}/api`;
};

