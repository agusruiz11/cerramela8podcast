/**
 * Vercel Serverless Function: POST /api/subscribe
 * Suscripción a newsletter vía Brevo. Anti-spam: honeypot + rate-limit + reCAPTCHA v3 (opcional).
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Rate limit: 3 suscripciones/min por IP (in-memory; en serverless es best-effort por instancia)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const RECAPTCHA_MIN_SCORE = 0.5;

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now >= bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateLimitMap.set(ip, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed) && trimmed.length <= 254;
}

async function verifyRecaptcha(token, remoteip, secretKey) {
  if (!token || typeof token !== 'string' || !secretKey) return { ok: false };
  const params = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteip) params.set('remoteip', remoteip);
  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  const data = await res.json().catch(() => ({}));
  const success = data.success === true && (data.score ?? 1) >= RECAPTCHA_MIN_SCORE;
  return { ok: success, score: data.score };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    res.status(400).json({ ok: false, error: 'Body JSON inválido' });
    return;
  }

  const { email, source, website, recaptchaToken } = body;
  const ip = getClientIp(req);

  // 1) Honeypot: si "website" tiene contenido, es bot → bloquear sin revelar motivo
  if (website && String(website).trim() !== '') {
    res.status(400).json({ ok: false, error: 'Solicitud no válida' });
    return;
  }

  // 2) Rate limit: demasiados intentos desde la misma IP
  if (isRateLimited(ip)) {
    res.status(429).json({ ok: false, error: 'Demasiados intentos. Esperá un minuto e intentá de nuevo.' });
    return;
  }

  // 3) reCAPTCHA v3 (opcional): si está configurado, exigir y verificar token
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const { ok } = await verifyRecaptcha(recaptchaToken, ip, recaptchaSecret);
    if (!ok) {
      res.status(400).json({ ok: false, error: 'No pudimos verificar que no sos un bot. Recargá la página e intentá de nuevo.' });
      return;
    }
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'Email inválido' });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;
  const listId = listIdRaw ? parseInt(listIdRaw, 10) : null;

  // Modo mock: si faltan credenciales, responder ok sin llamar a Brevo
  if (!apiKey || !listId || Number.isNaN(listId)) {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const payload = {
      email: email.trim().toLowerCase(),
      listIds: [listId],
      updateEnabled: true,
      attributes: {}
    };

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      res.status(200).json({ ok: true });
      return;
    }

    // Contacto ya existe u otro 4xx: intentar idempotencia (si Brevo dice "duplicate", considerar éxito)
    if (response.status === 400 && data.code === 'duplicate_parameter') {
      res.status(200).json({ ok: true });
      return;
    }

    const message =
      data.message || (typeof data === 'string' ? data : 'Error al suscribir');
    res.status(response.status >= 500 ? 502 : 400).json({
      ok: false,
      error: message
    });
  } catch (err) {
    const message = err.message || 'Error de conexión con el servicio';
    res.status(502).json({ ok: false, error: message });
  }
}
