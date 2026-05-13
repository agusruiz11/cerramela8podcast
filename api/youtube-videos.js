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
    // playlistItems.list cuesta 1 unidad (search cuesta 100)
    const playlistId = channelId.replace(/^UC/, 'UU');
    const params = new URLSearchParams({
      key: apiKey,
      playlistId,
      part: 'snippet',
      maxResults: '25'
    });

    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`);
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
      const videoId = item.snippet?.resourceId?.videoId || '';
      return {
        id: videoId,
        title: item.snippet?.title || 'Video',
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    };

    // Parse ISO 8601 duration (e.g. PT1M30S) to seconds
    const parseDuration = (iso) => {
      const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!m) return 0;
      return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
    };

    const allItems = (data.items || []).filter((i) => i.snippet?.resourceId?.videoId);

    // Fetch durations to exclude Shorts (≤60s)
    const videoIds = allItems.map((i) => i.snippet.resourceId.videoId).join(',');
    const detailsParams = new URLSearchParams({ key: apiKey, id: videoIds, part: 'contentDetails,snippet' });
    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`);
    const detailsData = await detailsRes.json().catch(() => ({}));
    const videoMeta = {};
    for (const v of (detailsData.items || [])) {
      const tags = (v.snippet?.tags || []).map(t => t.toLowerCase());
      videoMeta[v.id] = {
        duration: parseDuration(v.contentDetails?.duration),
        description: (v.snippet?.description || '').toLowerCase(),
        tags,
      };
    }

    const isShort = (item) => {
      const id = item.snippet.resourceId.videoId;
      const meta = videoMeta[id] || {};
      // YouTube Shorts can be up to 3 minutes (180s)
      if (meta.duration <= 180) return true;
      const titleAndDesc = `${item.snippet?.title || ''} ${meta.description}`.toLowerCase();
      if (titleAndDesc.includes('#short')) return true;
      if ((meta.tags || []).some(t => t === 'shorts' || t === 'short')) return true;
      return false;
    };

    const items = allItems
      .filter((i) => !isShort(i))
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
