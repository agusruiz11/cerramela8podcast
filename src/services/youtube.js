
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
      // Placeholder for actual YouTube API call
      // When implemented, this will fetch real videos from YouTube
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${config.YOUTUBE_API_KEY}&channelId=${config.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=3`
      );

      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }

      const data = await response.json();
      const videos = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

      this.setCache(videos);
      return videos;
    } catch (error) {
      console.error('YouTube API error:', error);
      return FALLBACK_VIDEOS;
    }
  }
}

export const youtubeService = new YouTubeService();
