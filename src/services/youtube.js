
import config from '@/config/config';

const CACHE_KEY = 'youtube_videos_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const FALLBACK_VIDEOS = [
  {
    id: 'fallback1',
    title: 'HOY UN BAR DEBE TENER GASTRONOMÍA',
    thumbnail: 'https://images.unsplash.com/photo-1693904501551-4e7e716a780d?w=800&h=450&fit=crop',
    url: 'https://youtube.com'
  },
  {
    id: 'fallback2',
    title: 'LOS PIZZA-CAFÉ SIGUEN FIRMES. PASEN Y VEA',
    thumbnail: 'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=800&h=450&fit=crop',
    url: 'https://youtube.com'
  },
  {
    id: 'fallback3',
    title: 'ADRIAN VALENTI: MARCA EN NEGOCIOS DE FRANQUICIA',
    thumbnail: 'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=800&h=450&fit=crop',
    url: 'https://youtube.com'
  }
];

class YouTubeService {
  getCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache videos:', error);
    }
  }

  async fetchLatestVideos() {
    // Check cache first
    const cached = this.getCache();
    if (cached) {
      return cached;
    }

    // If no API key configured, return fallback videos
    if (!config.YOUTUBE_API_KEY || !config.YOUTUBE_CHANNEL_ID) {
      return FALLBACK_VIDEOS;
    }

    try {
      // Excluir Shorts: videoDuration "short" = <4 min. Usamos medium (4-20 min) y long (>20 min)
      const baseParams = {
        key: config.YOUTUBE_API_KEY,
        channelId: config.YOUTUBE_CHANNEL_ID,
        part: 'snippet,id',
        order: 'date',
        type: 'video',
        maxResults: '5'
      };

      const [resMedium, resLong] = await Promise.all([
        fetch(`https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({ ...baseParams, videoDuration: 'medium' }).toString()}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({ ...baseParams, videoDuration: 'long' }).toString()}`)
      ]);

      const [dataMedium, dataLong] = await Promise.all([
        resMedium.json().catch(() => ({})),
        resLong.json().catch(() => ({}))
      ]);

      if (!resMedium.ok) {
        const msg = dataMedium?.error?.message || 'YouTube API request failed';
        throw new Error(msg);
      }

      const toVideo = (item) => {
        const thumbnails = item.snippet?.thumbnails || {};
        const thumbnail = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '';
        return {
          id: item.id.videoId,
          title: item.snippet?.title || 'Video',
          thumbnail,
          publishedAt: item.snippet?.publishedAt || '',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
      };

      const allItems = [
        ...(dataMedium.items || []).filter(i => i.id?.videoId),
        ...(dataLong.items || []).filter(i => i.id?.videoId)
      ];

      const seen = new Set();
      const videos = allItems
        .filter(item => {
          if (seen.has(item.id.videoId)) return false;
          seen.add(item.id.videoId);
          return true;
        })
        .map(toVideo)
        .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
        .slice(0, 3)
        .map(({ publishedAt, ...v }) => v);

      if (videos.length > 0) {
        this.setCache(videos);
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
