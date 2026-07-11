/**
 * Resolve API base URL.
 * Priority:
 *   1. REACT_APP_API_URL env var (set in Vercel dashboard or .env.production)
 *   2. Local dev: port 3000 → same host at :8000
 *   3. Known production hostname → hardcoded Render backend
 *   4. Fallback: localhost:8000
 */

export const getApiBaseUrl = () => {
  // 1. Always prefer explicitly configured env var (baked in at build time)
  if (process.env.REACT_APP_API_URL) {
    return `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;

    // If running through a tunnel, use relative path to leverage the proxy
    if (
      hostname.includes('serveousercontent.com') ||
      hostname.includes('loca.lt') ||
      hostname.includes('ngrok-free.app') ||
      hostname.includes('ngrok-free.dev')
    ) {
      return '/api';
    }

    // 2. Local dev server (CRA default port or other standard dev server ports like 3001)
    if (['3000', '3001', '3002', '3003', '3004', '3005'].includes(port)) {
      return `${protocol}//${hostname}:8000/api`;
    }

    // 3. Fallback: LAN / same-host deployment
    const portStr = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portStr}/api`;
  }

  return '/api';
};

