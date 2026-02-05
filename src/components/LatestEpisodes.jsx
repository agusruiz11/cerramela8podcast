
import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { youtubeService } from '@/services/youtube';
import { Loader2 } from 'lucide-react';

// Fallback data ensures the UI looks premium even if the API quota is hit or fails
const FALLBACK_VIDEOS = [
  {
    id: '1',
    title: 'Hoy un bar debe tener gastronomía',
    thumbnail: 'https://images.unsplash.com/photo-1515169067750-d51a73b50981?w=800&q=80',
    url: 'https://youtube.com'
  },
  {
    id: '2',
    title: 'Los pizza-café siguen firmes',
    thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    url: 'https://youtube.com'
  },
  {
    id: '3',
    title: 'Adrian Valenti: MBA en Negocios',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    url: 'https://youtube.com'
  }
];

const LatestEpisodes = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await youtubeService.fetchLatestVideos();
        if (fetchedVideos && fetchedVideos.length > 0) {
          // Take only the first 3 videos to match the layout
          setVideos(fetchedVideos.slice(0, 3));
        } else {
          setVideos(FALLBACK_VIDEOS);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section id="escuchanos" className="py-16 px-4 bg-[#0F0F0F]">
      <div className="container mx-auto max-w-6xl">
        {/* Title - Reduced prominence */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-archivo text-4xl md:text-5xl font-normal text-center mb-12 uppercase tracking-wide"
        >
          <span className="text-white">ÚLTIMOS</span> <span className="text-[#2A51F4]">EPISODIOS</span>
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#2A51F4]" size={32} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {videos.map((video, index) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative block"
              >
                {/* Thumbnail Card */}
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/20 group-hover:border-[#2A51F4] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(42,81,244,0.4)]">
                  <img
                    src={video.thumbnail || FALLBACK_VIDEOS[index % 3].thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Clean hover state - no icons, just subtle light interaction */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                </div>
                {/* Titles removed as requested */}
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Centered Button - Estilo referencia: rectángulo redondeado, azul, texto centrado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a
            href="https://youtube.com/@cerramelaochopodcast"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center
              gap-0
              min-h-[50px] px-6 sm:px-4 py-2
              bg-[#2A51F4]
              border border-[rgba(255,255,255,0.85)]
              rounded-[10px]
              text-white font-thunder text-3xl sm:text-2xl lg:text-3xl uppercase tracking-[0.06em]
              leading-none whitespace-nowrap
              shadow-[0_0_20px_rgba(42,81,244,0.5)]
              hover:shadow-[0_0_30px_rgba(42,81,244,0.7)]
              hover:bg-[#1a3ec9]
              transition-all duration-300
            "
            style={{ letterSpacing: '0.02em' }}
          >
            <span className="inline-block translate-y-[3px]">
              TODOS LOS EPISODIOS ACÁ
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(LatestEpisodes);
