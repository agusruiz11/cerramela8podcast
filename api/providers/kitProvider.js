/**
 * Kit (ConvertKit rebrand) API v4 provider.
 * Crea suscriptores, los agrega al form y actualiza custom fields (job, country).
 */

const KIT_API_BASE = 'https://api.kit.com/v4';

function extractKitError(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => (typeof e === 'string' ? e : e?.message || JSON.stringify(e))).join('; ');
  }
  if (data.error) return data.error;
  return fallback;
}

/**
 * Crea un subscriber en Kit (upsert por email) y lo agrega al form.
 * Intenta primero "add by email" (más simple); si falla, usa create + add.
 * @param {{ apiKey: string, formId: string, email: string }} opts
 * @returns {{ subscriberId: number, alreadySubscribed?: boolean }}
 */
export async function subscribe(opts) {
  const { apiKey, formId, email } = opts;
  const trimmed = String(email).trim().toLowerCase();
  const formIdNum = parseInt(String(formId), 10);
  if (Number.isNaN(formIdNum)) {
    throw new Error('KIT_FORM_ID inválido.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': apiKey
  };

  // 1) Intentar agregar por email (algunos forms lo permiten aunque el doc diga que debe existir)
  const addByEmailRes = await fetch(`${KIT_API_BASE}/forms/${formIdNum}/subscribers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email_address: trimmed })
  });
  const addByEmailData = await addByEmailRes.json().catch(() => ({}));

  if (addByEmailRes.ok) {
    const sub = addByEmailData?.subscriber;
    return { subscriberId: sub?.id, alreadySubscribed: addByEmailRes.status === 200 };
  }

  // 2) Si 404 (subscriber no existe), crear y agregar por ID
  if (addByEmailRes.status === 404 || addByEmailRes.status === 422) {
    const createRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: trimmed })
    });
    const createData = await createRes.json().catch(() => ({}));

    if (!createRes.ok) {
      throw new Error(extractKitError(createData, `Error Kit create: ${createRes.status}`));
    }

    const subscriberId = createData?.subscriber?.id;
    if (!subscriberId) {
      throw new Error('Kit no devolvió ID de suscriptor.');
    }

    const addRes = await fetch(`${KIT_API_BASE}/forms/${formIdNum}/subscribers/${subscriberId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    const addData = await addRes.json().catch(() => ({}));

    if (addRes.ok) {
      return { subscriberId, alreadySubscribed: addRes.status === 200 };
    }
    if (addRes.status === 404) {
      throw new Error('Form no encontrado. Verificá KIT_FORM_ID (ej: en app.kit.com → Forms → tu form).');
    }
    throw new Error(extractKitError(addData, `Error al agregar al form: ${addRes.status}`));
  }

  // 401, etc.
  if (addByEmailRes.status === 401) {
    throw new Error('API Key inválida. Verificá KIT_API_KEY en app.kit.com → Settings → Developer.');
  }
  throw new Error(extractKitError(addByEmailData, `Error Kit: ${addByEmailRes.status}`));
}

/**
 * Actualiza custom fields del subscriber (job, country).
 * Los keys deben coincidir con los custom fields en Kit (Settings → Custom fields).
 * Si usás otros nombres, cambiá fields.job y fields.country acá.
 * @param {{ apiKey: string, subscriberId: number, job?: string, country?: string }} opts
 */
export async function updateProfile(opts) {
  const { apiKey, subscriberId, job, country } = opts;
  const id = parseInt(String(subscriberId), 10);
  if (Number.isNaN(id)) {
    throw new Error('subscriberId inválido');
  }

  const fields = {};
  if (job && String(job).trim()) fields.job = String(job).trim().slice(0, 100);
  if (country && String(country).trim()) fields.country = String(country).trim().slice(0, 100);

  if (Object.keys(fields).length === 0) {
    return { ok: true };
  }

  const res = await fetch(`${KIT_API_BASE}/subscribers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey
    },
    body: JSON.stringify({ fields })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `Error al actualizar perfil: ${res.status}`);
  }

  return { ok: true };
}
