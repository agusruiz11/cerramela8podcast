/**
 * Brevo (Sendinblue) provider - COMPLETO PERO DESHABILITADO.
 *
 * CÓMO REACTIVAR:
 * 1. En api/newsletter/subscribe.js y api/newsletter/profile.js,
 *    cambiar el provider a 'brevo' cuando NEWSLETTER_PROVIDER === 'brevo'.
 * 2. Definir en .env / Vercel:
 *    - BREVO_API_KEY
 *    - BREVO_LIST_ID
 *    - (opcional) BREVO_ATTR_JOB_TITLE, BREVO_ATTR_COUNTRY
 * 3. Descomentar las importaciones y el case 'brevo' en los handlers.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

/**
 * Suscribe un email a la lista de Brevo.
 * @param {{ apiKey: string, listId: number, email: string }} opts
 * @returns {{ subscriberId?: string, alreadySubscribed?: boolean }}
 */
async function subscribeBrevo(opts) {
  const { apiKey, listId, email } = opts;
  const trimmed = String(email).trim().toLowerCase();

  const payload = {
    email: trimmed,
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
    return { subscriberId: data?.id?.toString(), alreadySubscribed: false };
  }

  if (response.status === 400 && data?.code === 'duplicate_parameter') {
    return { subscriberId: undefined, alreadySubscribed: true };
  }

  throw new Error(data?.message || 'Error al suscribir con Brevo');
}

/**
 * Actualiza atributos del contacto en Brevo por email.
 * @param {{ apiKey: string, email: string, job?: string, country?: string }} opts
 */
async function updateProfileBrevo(opts) {
  const { apiKey, email, job, country } = opts;
  const attrJob = process.env.BREVO_ATTR_JOB_TITLE || 'JOB_TITLE';
  const attrCountry = process.env.BREVO_ATTR_COUNTRY || 'COUNTRY';
  const MAX = 100;

  const attributes = {};
  if (job && String(job).trim()) attributes[attrJob] = String(job).trim().slice(0, MAX);
  if (country && String(country).trim()) attributes[attrCountry] = String(country).trim().slice(0, MAX);

  if (Object.keys(attributes).length === 0) {
    return { ok: true };
  }

  const identifier = encodeURIComponent(String(email).trim().toLowerCase());
  const url = `${BREVO_API_URL}/${identifier}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ attributes })
  });

  if (response.ok) return { ok: true };

  const data = await response.json().catch(() => ({}));
  throw new Error(data?.message || 'Error al actualizar perfil en Brevo');
}

export { subscribeBrevo as subscribe, updateProfileBrevo as updateProfile };
