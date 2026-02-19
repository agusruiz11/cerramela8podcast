/**
 * Vercel Serverless: GET /api/youtube-videos
 * Lista los últimos episodios del canal de YouTube.
 * Cache en el servidor/edge (1 h) para no agotar la cuota con mucho tráfico.
 * Todas las visitas reciben la misma respuesta cacheada → ~24 llamadas/día a YouTube.
 */

import { handleCorsPreflight, setCorsHeaders } from './lib/cors.js';

const FALLBACK_VIDEOS = [
  { id: 'fallback1', title: 'HOY UN BAR DEBE TENER GASTRONOMÍA', thumbnail: 'https://images.unsplash.com/photo-1693904501551-4e7e716a780d?w=800&h=450&fit=crop', url: 'https://youtube.com' },
  { id: 'fallback2', title: 'LOS PIZZA-CAFÉ SIGUEN FIRMES. PASEN Y VEA', thumbnail: 'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=800&h=450&fit=crop', url: 'https://youtube.com' },
  { id: 'fallback3', title: 'ADRIAN VALENTI: MARCA EN NEGOCIOS DE FRANQUICIA', thumbnail: 'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=800&h=450&fit=crop', url: 'https://youtube.com' }
];

const CACHE_MAX_AGE = 3600;        // 1 hora: ~24 llamadas/día a YouTube
const STALE_WHILE_REVALIDATE = 86400; // 24 h: sirve copia antigua mientras revalida

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (handleCorsPreflight(req, res)) return;
  setCorsHeaders(req, res);

  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`);
    res.status(200).json({ ok: true, videos: FALLBACK_VIDEOS, fallback: true });
    return;
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      channelId,
      part: 'snippet,id',
      order: 'date',
      type: 'video',
      videoDuration: 'long',
      maxResults: '5'
    });

    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    const data = await ytRes.json().catch(() => ({}));

    if (!ytRes.ok) {
      console.error('YouTube API error:', data?.error?.message || ytRes.status);
      res.setHeader('Cache-Control', `public, s-maxage=60, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`);
      res.status(200).json({ ok: true, videos: FALLBACK_VIDEOS, fallback: true });
      return;
    }

    const toVideo = (item) => {
      const thumbnails = item.snippet?.thumbnails || {};
      const thumbnail = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '';
      return {
        id: item.id.videoId,
        title: item.snippet?.title || 'Video',
        thumbnail,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      };
    };

    const items = (data.items || [])
      .filter((i) => i.id?.videoId)
      .sort((a, b) => (b.snippet?.publishedAt || '').localeCompare(a.snippet?.publishedAt || ''));
    const videos = items.slice(0, 3).map(toVideo);

    const result = videos.length > 0 ? videos : FALLBACK_VIDEOS;
    const isFallback = videos.length === 0;

    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`);
    res.status(200).json({ ok: true, videos: result, fallback: isFallback });
  } catch (err) {
    console.error('YouTube fetch error:', err);
    res.setHeader('Cache-Control', `public, s-maxage=60, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`);
    res.status(200).json({ ok: true, videos: FALLBACK_VIDEOS, fallback: true });
  }
}
