/**
 * Vercel Serverless Function: POST /api/profile
 * Actualiza atributos del contacto en Brevo. Modo mock si faltan env vars.
 */

const BREVO_API_BASE = 'https://api.brevo.com/v3/contacts';

// Nombres de atributos en Brevo (deben existir en tu cuenta)
// Por defecto Brevo usa JOB_TITLE y COUNTRY; si usás otros, cambiá acá o con env vars
const ATTR_OCUPACION = process.env.BREVO_ATTR_JOB_TITLE || 'JOB_TITLE';
const ATTR_PAIS = process.env.BREVO_ATTR_COUNTRY || 'COUNTRY';
const MAX_LENGTH = 100;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed) && trimmed.length <= 254;
}

function normalizeString(value) {
  if (value == null) return '';
  const s = String(value).trim();
  return s.slice(0, MAX_LENGTH);
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

  const { email, ocupacion, pais } = body;

  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'Email inválido' });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;

  // Modo mock: si no hay API key, responder ok sin llamar a Brevo
  if (!apiKey) {
    res.status(200).json({ ok: true });
    return;
  }

  const ocupacionNorm = normalizeString(ocupacion);
  const paisNorm = normalizeString(pais);

  const identifier = encodeURIComponent(email.trim().toLowerCase());
  const url = `${BREVO_API_BASE}/${identifier}`;

  try {
    const payload = {
      attributes: {
        [ATTR_OCUPACION]: ocupacionNorm || undefined,
        [ATTR_PAIS]: paisNorm || undefined
      }
    };
    // Brevo no acepta strings vacíos en algunos atributos; omitir si están vacíos
    Object.keys(payload.attributes).forEach((k) => {
      if (payload.attributes[k] === undefined || payload.attributes[k] === '') {
        delete payload.attributes[k];
      }
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      res.status(200).json({ ok: true });
      return;
    }

    const data = await response.json().catch(() => ({}));
    const message =
      data.message || (typeof data === 'string' ? data : 'Error al actualizar perfil');
    res.status(response.status >= 500 ? 502 : 400).json({
      ok: false,
      error: message
    });
  } catch (err) {
    const message = err.message || 'Error de conexión con el servicio';
    res.status(502).json({ ok: false, error: message });
  }
}
