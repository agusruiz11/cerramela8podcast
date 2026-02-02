/**
 * reCAPTCHA v3 (invisible). Carga el script y obtiene token para enviar al backend.
 * Solo se usa si VITE_RECAPTCHA_SITE_KEY está definido.
 */

const SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?render=';
let loadPromise = null;

function loadScript(siteKey) {
  if (typeof window === 'undefined' || !siteKey) return Promise.resolve(null);
  if (window.grecaptcha && window.grecaptcha.execute) return Promise.resolve(siteKey);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL + siteKey;
    script.async = true;
    script.onload = () => resolve(siteKey);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Error al cargar reCAPTCHA'));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

/**
 * Obtiene un token reCAPTCHA v3 para la acción dada.
 * @param {string} siteKey - VITE_RECAPTCHA_SITE_KEY
 * @param {string} action - ej. 'newsletter' o 'hablemos'
 * @returns {Promise<string|null>} Token o null si no hay siteKey
 */
export async function getRecaptchaToken(siteKey, action = 'submit') {
  if (!siteKey || typeof siteKey !== 'string') return null;
  try {
    await loadScript(siteKey);
    const token = await window.grecaptcha.execute(siteKey, { action });
    return token || null;
  } catch {
    return null;
  }
}
