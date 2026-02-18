/**
 * Vercel Serverless: PUT /api/newsletter/profile
 * Actualiza perfil del suscriptor (job, country) en Brevo (Kit comentado).
 * CORS: permite peticiones desde www.cerramelaocho.com (Hostinger).
 */

// import * as kitProvider from '../providers/kitProvider.js'; // Comentado: usar Brevo
import * as brevoProvider from '../providers/brevoProvider.js';
import { handleCorsPreflight, setCorsHeaders } from '../lib/cors.js';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  res.setHeader('Content-Type', 'application/json');

  if (handleCorsPreflight(req, res)) return;
  if (req.method !== 'PUT') {
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

  const { subscriberId, email, job, businessType, country } = body;

  const provider = process.env.NEWSLETTER_PROVIDER || 'brevo';

  // Brevo (activo) - usa email en lugar de subscriberId
  if (provider === 'brevo') {
    if (!email) {
      res.status(400).json({ ok: false, error: 'email es requerido para Brevo' });
      return;
    }
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      res.status(200).json({ ok: true });
      return;
    }
    try {
      await brevoProvider.updateProfile({ apiKey, email, job, businessType, country });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
    return;
  }

  // Kit (comentado - usar Brevo)
  // if (!subscriberId) {
  //   res.status(400).json({ ok: false, error: 'subscriberId es requerido' });
  //   return;
  // }
  // if (provider === 'kit') {
  //   const apiKey = process.env.KIT_API_KEY;
  //   if (!apiKey) {
  //     res.status(200).json({ ok: true });
  //     return;
  //   }
  //   try {
  //     await kitProvider.updateProfile({
  //       apiKey,
  //       subscriberId,
  //       job: job ?? '',
  //       country: country ?? ''
  //     });
  //     res.status(200).json({ ok: true });
  //   } catch (err) {
  //     res.status(400).json({ ok: false, error: err.message || 'Error al actualizar perfil' });
  //   }
  //   return;
  // }

  res.status(200).json({ ok: true });
}
