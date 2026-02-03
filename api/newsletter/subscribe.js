/**
 * Vercel Serverless: POST /api/newsletter/subscribe
 * Suscripción a newsletter vía Brevo (Kit comentado).
 * Anti-spam: honeypot + rate-limit.
 */

// import * as kitProvider from '../providers/kitProvider.js'; // Comentado: usar Brevo
import * as brevoProvider from '../providers/brevoProvider.js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map();

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

  const { email, website } = body;
  const ip = getClientIp(req);

  // Honeypot: si "website" tiene contenido, es bot
  if (website && String(website).trim() !== '') {
    res.status(400).json({ ok: false, error: 'Solicitud no válida' });
    return;
  }

  if (isRateLimited(ip)) {
    res.status(429).json({
      ok: false,
      error: 'Demasiados intentos. Esperá un minuto e intentá de nuevo.'
    });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'Email inválido' });
    return;
  }

  const provider = process.env.NEWSLETTER_PROVIDER || 'brevo';

  // Brevo (activo)
  if (provider === 'brevo') {
    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_LIST_ID || '0', 10);
    if (!apiKey || !listId) {
      res.status(200).json({ ok: true });
      return;
    }
    try {
      const result = await brevoProvider.subscribe({ apiKey, listId, email: email.trim() });
      res.status(200).json({ ok: true, subscriberId: result.subscriberId, alreadySubscribed: result.alreadySubscribed ?? false });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
    return;
  }

  // Kit (comentado - usar Brevo)
  // if (provider === 'kit') {
  //   const apiKey = process.env.KIT_API_KEY;
  //   const formId = process.env.KIT_FORM_ID || '9042648';
  //   if (!apiKey) {
  //     res.status(200).json({ ok: true, subscriberId: null });
  //     return;
  //   }
  //   try {
  //     const result = await kitProvider.subscribe({ apiKey, formId, email: email.trim() });
  //     res.status(200).json({
  //       ok: true,
  //       subscriberId: result.subscriberId,
  //       alreadySubscribed: result.alreadySubscribed ?? false
  //     });
  //   } catch (err) {
  //     const msg = err.message || 'Error al suscribir';
  //     if (msg.toLowerCase().includes('ya') || msg.toLowerCase().includes('already')) {
  //       res.status(200).json({ ok: true, subscriberId: null, alreadySubscribed: true });
  //       return;
  //     }
  //     res.status(400).json({ ok: false, error: msg });
  //   }
  //   return;
  // }

  res.status(200).json({ ok: true, subscriberId: null });
}
