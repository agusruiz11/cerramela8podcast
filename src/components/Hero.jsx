
import React, { useRef, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import introVideo from '../assets/video/CL8_2026_INTRO.mp4';

const Hero = memo(() => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Empieza muteado para que autoplay funcione

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  const handleVideoPlay = useCallback(() => setIsPlaying(true), []);
  const handleVideoPause = useCallback(() => setIsPlaying(false), []);

  return (
    <section className="relative min-h-0 h-[56.25vw] mt-28 md:mt-0 mb-0 md:min-h-screen md:h-screen flex items-center justify-center overflow-hidden bg-[#0B1020]">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain md:object-cover z-0"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      >
        <source src={introVideo} type="video/mp4" />
      </video>

      {/* Capas de overlay para mantener legibilidad y atmósfera */}
      
      {/* 1. Intense Blue Spotlight (Left-Center) */}
      <div 
        className="absolute top-1/2 left-0 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #2A51F4 0%, transparent 70%)',
          transform: 'translate(-25%, -50%)'
        }}
      />
      
      {/* 2. Vignette (Darker corners) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, #0B1020 100%)'
        }}
      />

      {/* 3. Bottom Fade to Black */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent pointer-events-none" />

      {/* 4. Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Main Content - Centered Logo
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center leading-none select-none text-white"
      >
        // Top Line 
        <span className="font-thunder text-[5vw] md:text-[80px] tracking-tighter uppercase pl-1 opacity-90">
          CERRAME
        </span>
        
        // Bottom Line with Graphic '8' 
        <div className="flex items-baseline -mt-2 md:-mt-5">
          <span className="font-thunder text-[3vw] md:text-[50px] tracking-tighter mr-2 md:mr-4 self-center opacity-80">
            LA
          </span>
          <span className="font-thunder text-[12vw] md:text-[180px] tracking-tighter leading-[0.75] text-white">
            8CHO
          </span>
        </div>
      </motion.div> 
      */}

      {/* Controles de video: play/pause y mute */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 right-6 md:right-10 z-20 flex items-center gap-3"
      >
        <button
          type="button"
          onClick={togglePlay}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
        {/* <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button> */}
      </motion.div>

      {/* Scroll indicator - oculto en mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity } }}
        className="hidden sm:block absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-archivo">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
