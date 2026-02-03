/**
 * API service: llama a Vercel Serverless /api/newsletter (subscribe, profile).
 * Provider: Brevo activo; Kit comentado.
 */

import config from '@/config/config';

const API_BASE = '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || data.details || `Error ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data;
}

export const api = {
  /**
   * Suscripción a newsletter (Kit/Brevo).
   * @param {{ email: string, website?: string }} payload - website es honeypot (oculto)
   * @returns {{ ok: boolean, subscriberId?: number, alreadySubscribed?: boolean }}
   */
  async subscribe(payload) {
    const email = typeof payload === 'string' ? payload : payload?.email;
    const website = typeof payload === 'object' && payload ? payload.website : undefined;
    const trimmed = email ? String(email).trim() : '';
    if (!trimmed) {
      throw new Error('El email es obligatorio.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 254) {
      throw new Error('Ingresá un email válido (ej: nombre@dominio.com).');
    }
    return request('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: trimmed, website: website ?? '' })
    });
  },

  /**
   * Actualizar perfil del suscriptor (job, country).
   * Brevo usa email; Kit usa subscriberId (comentado).
   * @param {{ subscriberId?: number, email?: string, job?: string, country?: string }} data
   */
  async submitProfile(data) {
    const provider = config.NEWSLETTER_PROVIDER || 'brevo';
    if (provider === 'brevo') {
      const email = data?.email;
      if (!email || String(email).trim() === '') {
        throw new Error('email requerido para actualizar perfil');
      }
      return request('/api/newsletter/profile', {
        method: 'PUT',
        body: JSON.stringify({
          email: String(email).trim(),
          job: data.job ?? '',
          country: data.country ?? ''
        })
      });
    }
    // Kit (comentado)
    const subscriberId = data?.subscriberId;
    if (subscriberId == null || subscriberId === '') {
      throw new Error('subscriberId requerido');
    }
    return request('/api/newsletter/profile', {
      method: 'PUT',
      body: JSON.stringify({
        subscriberId: Number(subscriberId),
        job: data.job ?? '',
        country: data.country ?? ''
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
