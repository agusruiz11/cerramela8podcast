/**
 * API service: llama a Vercel Serverless /api (subscribe, profile).
 * En preview de Vercel las env BREVO_* activan Brevo; si faltan, backend responde ok (modo mock).
 */

const API_BASE = '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  /**
   * Suscripción a newsletter.
   * @param {{ email: string, source?: string, website?: string, recaptchaToken?: string }} payload
   */
  async subscribe(payload) {
    const email = typeof payload === 'string' ? payload : payload?.email;
    const source = typeof payload === 'object' && payload ? payload.source : undefined;
    const website = typeof payload === 'object' && payload ? payload.website : undefined;
    const recaptchaToken = typeof payload === 'object' && payload ? payload.recaptchaToken : undefined;
    const trimmed = email ? String(email).trim() : '';
    if (!trimmed) {
      throw new Error('El email es obligatorio.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 254) {
      throw new Error('Ingresá un email válido (ej: nombre@dominio.com).');
    }
    const body = { email: trimmed, source, website };
    if (recaptchaToken) body.recaptchaToken = recaptchaToken;
    return request('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  /**
   * Actualizar perfil del contacto (ocupación, país).
   * @param {{ email: string, ocupacion: string, pais: string }} data
   */
  async submitProfile(data) {
    if (!data?.email || !String(data.email).includes('@')) {
      throw new Error('Email requerido');
    }
    return request('/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        email: String(data.email).trim(),
        ocupacion: data.ocupacion ?? '',
        pais: data.pais ?? ''
      })
    });
  },

  async getLatestVideos() {
    // Mock: mantener endpoint mock existente
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      videos: [
        {
          id: 'video1',
          title: 'HOY UN BAR DEBE TENER GASTRONOMÍA',
          thumbnail: 'https://images.unsplash.com/photo-1693904501501-4e7e716a780d?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        },
        {
          id: 'video2',
          title: 'LOS PIZZA-CAFÉ SIGUEN FIRMES. PASEN Y VEA',
          thumbnail: 'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        },
        {
          id: 'video3',
          title: 'ADRIAN VALENTI: MARCA EN NEGOCIOS DE FRANQUICIA',
          thumbnail: 'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        }
      ]
    };
  }
};
