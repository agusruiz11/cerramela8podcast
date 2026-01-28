import React, { memo } from 'react';
import { motion } from 'framer-motion';
import config from '@/config/config';
import logoWhite from '@/assets/images/logo/logo_white.png';

const Footer = () => {
  return (
    <footer className="relative bg-[#0F0F0F] text-[#F6EED5] py-12 px-4 overflow-hidden">
      {/* Decorative squares */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute top-10 right-10 w-16 h-16 border-4 border-[#2A51F4]/20 opacity-30"
      />
      
      <motion.div
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute bottom-10 left-20 w-24 h-24 border-4 border-[#E82D06]/20 opacity-20"
      />
      
      <motion.div
        animate={{
          rotate: [0, 180, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/2 right-32 w-12 h-12 border-4 border-[#F6EED5]/10 transform -translate-y-1/2"
      />

      <div className="container mx-auto max-w-8xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block"
          >
            <img
              src={logoWhite}
              alt="Cerrame la 8 Podcast"
              className="h-20 w-auto opacity-80 hover:opacity-100 object-contain transition-all duration-300 hover:scale-125 cursor-pointer"
              loading="lazy"
              decoding="async"
            />
          </motion.a>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <a
              href={config.TERMS_URL}
              className="font-archivo text-sm hover:text-[#2A51F4] transition-colors"
            >
              Términos y Condiciones
            </a>
            <span className="text-[#F6EED5]/30">|</span>
            <a
              href={config.PRIVACY_URL}
              className="font-archivo text-sm hover:text-[#2A51F4] transition-colors"
            >
              Política de Privacidad
            </a>
            <span className="text-[#F6EED5]/30">|</span>
            {/* Redes Sociales */}
            <div className="flex items-center gap-5 ml-4">
              <a
                href="https://www.instagram.com/cerramelaochopodcast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#F6EED5]/90 hover:text-[#E4405F] transition-colors duration-300"
              >
                {/* Instagram - logo oficial (cámara con lente y punto) */}
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@cerramelaochopodcast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#F6EED5]/90 hover:text-[#FF0000] transition-colors duration-300"
              >
                {/* YouTube - logo oficial (rectángulo con play) */}
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-[#F6EED5]/90 hover:text-white transition-colors duration-300"
              >
                {/* X (Twitter) - logo oficial actual */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-right"
          >
            <p className="font-archivo text-sm opacity-70">
              © {new Date().getFullYear()} Cerrame la Ocho Podcast
            </p>
            <p className="font-archivo text-xs opacity-50 mt-1">
              Todos los derechos reservados
            </p>
            <p className="font-archivo text-sm opacity-90 mt-1">
              Sitio por <a href="https://www.instagram.com/posicionarte.online" target="_blank" rel="noopener noreferrer" className="text-[#2A51F4]/80 hover:text-[#3b60ff] transition-colors">Posicionarte Online</a>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
