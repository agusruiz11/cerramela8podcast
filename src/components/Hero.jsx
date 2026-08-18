
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import heroWebp from '../assets/images/hero-programas.webp';
import heroJpg from '../assets/images/hero-programas.jpg';

const Hero = memo(() => {
  return (
    <section className="relative min-h-0 h-[80vw] mt-28 md:mt-0 mb-0 md:min-h-screen md:h-screen flex items-center justify-center overflow-hidden bg-[#0B1020]">
      {/* Mobile: 80vw + object-cover recorta los costados vacios y agranda el arte.
          Recorta 285px de cada lado; los logos arrancan en x=365, con 80px de margen. */}
      {/* Imagen de fondo: los tres programas */}
      <picture>
        <source srcSet={heroWebp} type="image/webp" />
        <img
          src={heroJpg}
          alt="Cerrame la Ocho, Late Check Out y No Compres Humo: los tres programas de CL8"
          width={1920}
          height={1080}
          loading="eager"
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </picture>

      {/* Capas de overlay para mantener legibilidad y atmósfera */}

      {/* 1. Viñeta suave: integra el hero sin apagar los verdes y rojos del arte */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 45%, rgba(11,16,32,0.75) 100%)'
        }}
      />

      {/* 2. Bottom Fade to Black */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent pointer-events-none" />

      {/* 3. Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

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
