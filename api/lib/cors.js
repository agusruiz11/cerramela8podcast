/**
 * CORS para permitir peticiones desde Hostinger (www.cerramelaocho.com).
 */

const ALLOWED_ORIGINS = [
  'https://www.cerramelaocho.com',
  'https://cerramelaocho.com',
  'https://cerramela8podcast.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.CORS_ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) || [])
];

export function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export function handleCorsPreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}
