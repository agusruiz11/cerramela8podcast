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
 * Programas del podcast -> atributos booleanos en Brevo.
 * La clave es la que viaja desde el formulario; el valor es el Id del atributo.
 * El cliente arma un segmento por cada uno para elegir a quien le manda cada newsletter.
 */
const PROGRAM_ATTRS = {
  late_check_out: process.env.BREVO_ATTR_PROG_LATE_CHECK_OUT || 'PROG_LATE_CHECK_OUT',
  cerrame_la_8: process.env.BREVO_ATTR_PROG_CERRAME_LA_8 || 'PROG_CERRAME_LA_8',
  no_compres_humo: process.env.BREVO_ATTR_PROG_NO_COMPRES_HUMO || 'PROG_NO_COMPRES_HUMO'
};

const PROGRAM_KEYS = Object.keys(PROGRAM_ATTRS);

/**
 * Convierte la seleccion del formulario en los tres booleanos de Brevo.
 * Siempre escribe los tres: si solo mandaramos los true, desmarcar un programa
 * no lo sacaria del segmento.
 * @param {string[]} programs - claves de PROGRAM_ATTRS
 */
function programAttributes(programs) {
  const selected = new Set(Array.isArray(programs) ? programs : []);
  return PROGRAM_KEYS.reduce((acc, key) => {
    acc[PROGRAM_ATTRS[key]] = selected.has(key);
    return acc;
  }, {});
}

/**
 * Suscribe un email a la lista de Brevo.
 * @param {{ apiKey: string, listId: number, email: string }} opts
 * @returns {{ subscriberId?: string, alreadySubscribed?: boolean }}
 */
async function subscribeBrevo(opts) {
  const { apiKey, listId, email } = opts;
  const trimmed = String(email).trim().toLowerCase();

  // No se manda ningun atributo de programa en el alta: el contacto entra a la
  // lista sin marcar nada y recien elige en el modal. Omitirlos (en vez de
  // mandarlos en false) es deliberado -- con updateEnabled: true, un false
  // borraria la seleccion de un suscriptor viejo que vuelva a dejar su mail,
  // incluidos los que se importaron a mano a los tres programas.
  const payload = {
    email: trimmed,
    listIds: [listId],
    updateEnabled: true
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
 * @param {{ apiKey: string, email: string, job?: string, businessType?: string, country?: string, programs?: string[] }} opts
 */
async function updateProfileBrevo(opts) {
  const { apiKey, email, job, businessType, country, programs } = opts;
  const attrJob = process.env.BREVO_ATTR_JOB_TITLE || 'JOB_TITLE';
  const attrBusinessType = process.env.BREVO_ATTR_BUSINESS_TYPE || 'BUSINESS_TYPE';
  const attrCountry = process.env.BREVO_ATTR_COUNTRY || 'COUNTRY';
  const MAX = 100;

  const attributes = {};
  if (job && String(job).trim()) attributes[attrJob] = String(job).trim().slice(0, MAX);
  if (businessType && String(businessType).trim()) attributes[attrBusinessType] = String(businessType).trim().slice(0, MAX);
  if (country && String(country).trim()) attributes[attrCountry] = String(country).trim().slice(0, MAX);

  // Solo si el formulario mando una seleccion. Un array vacio se ignora para
  // que un payload incompleto no borre la seleccion que el contacto ya tenia.
  if (Array.isArray(programs) && programs.length > 0) {
    Object.assign(attributes, programAttributes(programs));
  }

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

export { subscribeBrevo as subscribe, updateProfileBrevo as updateProfile, PROGRAM_KEYS };
