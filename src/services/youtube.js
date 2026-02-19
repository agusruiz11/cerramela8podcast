/**
 * Servicio de YouTube: obtiene los últimos episodios desde nuestra API (cache en servidor).
 * Así solo se llama a la API de YouTube ~24 veces/día (1/hora) sin importar el tráfico.
 */

const CACHE_KEY = 'youtube_videos_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 min en el cliente (la cache fuerte está en el servidor)

const FALLBACK_VIDEOS = [
  { id: 'fallback1', title: 'HOY UN BAR DEBE TENER GASTRONOMÍA', thumbnail: 'https://images.unsplash.com/photo-1693904501551-4e7e716a780d?w=800&h=450&fit=crop', url: 'https://youtube.com' },
  { id: 'fallback2', title: 'LOS PIZZA-CAFÉ SIGUEN FIRMES. PASEN Y VEA', thumbnail: 'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=800&h=450&fit=crop', url: 'https://youtube.com' },
  { id: 'fallback3', title: 'ADRIAN VALENTI: MARCA EN NEGOCIOS DE FRANQUICIA', thumbnail: 'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=800&h=450&fit=crop', url: 'https://youtube.com' }
];

const API_BASE = import.meta.env.VITE_API_BASE || '';

function getCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.error('Failed to cache videos:', e);
  }
}

class YouTubeService {
  async fetchLatestVideos() {
    const cached = getCache();
    if (cached) return cached;

    try {
      const res = await fetch(`${API_BASE}/api/youtube-videos`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Error ${res.status}`);
      }

      const videos = Array.isArray(data?.videos) ? data.videos : [];
      if (videos.length > 0) {
        setCache(videos);
        return videos;
      }

      return FALLBACK_VIDEOS;
    } catch (error) {
      console.error('YouTube API error:', error);
      return FALLBACK_VIDEOS;
    }
  }
}

export const youtubeService = new YouTubeService();
