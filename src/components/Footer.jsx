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
                href="https://www.youtube.com/@cerramelaochopodcast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#F6EED5]/90 hover:text-[#FF0000] transition-colors duration-300"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cerramelaochopodcast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#F6EED5]/90 hover:text-[#E4405F] transition-colors duration-300"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@cerramelaocho.podcast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-[#F6EED5]/90 hover:text-white transition-colors duration-300"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://podcasts.apple.com/ar/podcast/cerrame-la-ocho-podcast/id1714448321"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apple Podcast"
                className="text-[#F6EED5]/90 hover:text-[#FA57C1] transition-colors duration-300"
              >
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.12 0c-3.937-0.011-7.131 3.183-7.12 7.12v17.76c-0.011 3.937 3.183 7.131 7.12 7.12h17.76c3.937 0.011 7.131-3.183 7.12-7.12v-17.76c0.011-3.937-3.183-7.131-7.12-7.12zM15.817 3.421c3.115 0 5.932 1.204 8.079 3.453 1.631 1.693 2.547 3.489 3.016 5.855 0.161 0.787 0.161 2.932 0.009 3.817-0.5 2.817-2.041 5.339-4.317 7.063-0.812 0.615-2.797 1.683-3.115 1.683-0.12 0-0.129-0.12-0.077-0.615 0.099-0.792 0.192-0.953 0.64-1.141 0.713-0.296 1.932-1.167 2.677-1.911 1.301-1.303 2.229-2.932 2.677-4.719 0.281-1.1 0.244-3.543-0.063-4.672-0.969-3.595-3.907-6.385-7.5-7.136-1.041-0.213-2.943-0.213-4 0-3.636 0.751-6.647 3.683-7.563 7.371-0.245 1.004-0.245 3.448 0 4.448 0.609 2.443 2.188 4.681 4.255 6.015 0.407 0.271 0.896 0.547 1.1 0.631 0.447 0.192 0.547 0.355 0.629 1.14 0.052 0.485 0.041 0.62-0.072 0.62-0.073 0-0.62-0.235-1.199-0.511l-0.052-0.041c-3.297-1.62-5.407-4.364-6.177-8.016-0.187-0.943-0.224-3.187-0.036-4.052 0.479-2.323 1.396-4.135 2.921-5.739 2.199-2.319 5.027-3.543 8.172-3.543zM16 7.172c0.541 0.005 1.068 0.052 1.473 0.14 3.715 0.828 6.344 4.543 5.833 8.229-0.203 1.489-0.713 2.709-1.619 3.844-0.448 0.573-1.537 1.532-1.729 1.532-0.032 0-0.063-0.365-0.063-0.803v-0.808l0.552-0.661c2.093-2.505 1.943-6.005-0.339-8.296-0.885-0.896-1.912-1.423-3.235-1.661-0.853-0.161-1.031-0.161-1.927-0.011-1.364 0.219-2.417 0.744-3.355 1.672-2.291 2.271-2.443 5.791-0.348 8.296l0.552 0.661v0.813c0 0.448-0.037 0.807-0.084 0.807-0.036 0-0.349-0.213-0.683-0.479l-0.047-0.016c-1.109-0.885-2.088-2.453-2.495-3.995-0.244-0.932-0.244-2.697 0.011-3.625 0.672-2.505 2.521-4.448 5.079-5.359 0.547-0.193 1.509-0.297 2.416-0.281zM15.823 11.156c0.417 0 0.828 0.084 1.131 0.24 0.645 0.339 1.183 0.989 1.385 1.677 0.62 2.104-1.609 3.948-3.631 3.005h-0.015c-0.953-0.443-1.464-1.276-1.475-2.36 0-0.979 0.541-1.828 1.484-2.328 0.297-0.156 0.709-0.235 1.125-0.235zM15.812 17.464c1.319-0.005 2.271 0.463 2.625 1.291 0.265 0.62 0.167 2.573-0.292 5.735-0.307 2.208-0.479 2.765-0.905 3.141-0.589 0.52-1.417 0.667-2.209 0.385h-0.004c-0.953-0.344-1.157-0.808-1.553-3.527-0.452-3.161-0.552-5.115-0.285-5.735 0.348-0.823 1.296-1.285 2.624-1.291z"/>
                </svg>
              </a>
              <a
                href="https://open.spotify.com/show/65ROCy1qgiLBCPMErOLAdT?si=efbf04f2b37b4977"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="text-[#F6EED5]/90 hover:text-[#1DB954] transition-colors duration-300"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
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
