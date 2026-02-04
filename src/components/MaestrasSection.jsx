import React, { memo } from 'react';
import { motion } from 'framer-motion';
import personasImg from '../assets/images/personas.png';

const MaestrasSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-2 sm:px-4 bg-[#0F0F0F] flex justify-center" style={{ overflow: 'visible' }}>
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-[1200px] rounded-xl sm:rounded-2xl md:rounded-[2.5rem] shadow-2xl min-h-[200px] sm:min-h-[420px] md:min-h-[408px] pt-5 md:pt-10 md:pb-10"
        style={{
          background: 'linear-gradient(70deg, #000000 0%, #1a3bc4 50%, #000000 100%)',
          overflow: 'visible',
        }}
      >
        {/* Content Container */}
        <div className="relative z-10 w-full h-full px-2 sm:px-3 md:px-4" style={{ overflow: 'visible' }}>

          {/* Title "LAS MENTES MAESTRAS" - Top Left */}
          <div className="absolute top-2 sm:top-1 md:top-1 left-2 sm:left-4 md:left-12 z-20">
            <h2 className="font-thunder text-3xl sm:text-2xl md:text-4xl lg:text-5xl text-[#FAEED1] uppercase leading-[0.85] tracking-tight text-left font-semibold" style={{letterSpacing: '0.01em'}}>
              LAS<br/>MENTES<br/>MAESTRAS
            </h2>
          </div>

          {/* Image - Centered, protruding from top */}
          <div 
            className="absolute left-1/2 z-10 -top-[60px] md:-top-[120px] w-[min(320px,100%)] sm:w-[min(400px,100%)] md:w-auto"
            style={{ 
              transform: 'translateX(-50%)',
              bottom: '0',
            }}
          >
            <img 
              src={personasImg}
              alt="Martín Blanco y Sebastián Ríos Fernández"
              className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[750px] lg:max-w-[850px] h-full lg:h-auto object-contain md:object-center object-bottom"
              loading="lazy"
              decoding="async"
              style={{ 
                filter: 'grayscale(0%) contrast(1.05) brightness(0.98)',
                imageRendering: 'crisp-edges',
                display: 'block',
              }}
            />
          </div>

          {/* Martin Info - Left Side */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-2 sm:left-4 md:left-12 z-20 max-w-[140px] sm:max-w-[200px] md:max-w-[250px] text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-archivo text-sm sm:text-base md:text-2xl lg:text-2xl uppercase tracking-wide leading-tight mb-0 font-normal">
                MARTÍN BLANCO
              </h3>
              <p className="font-archivo text-xs sm:text-sm md:text-base font-normal tracking-wide mb-0 font-normal text-right">
                Director
              </p>
              <p className="font-archivo text-[10px] sm:text-xs md:text-sm font-normal leading-relaxed text-right">
                Moebius Marketing<br/>& Competitividad
              </p>
            </motion.div>
          </div>

          {/* Sebastian Info - Right Side */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-24 right-2 sm:right-4 md:right-16 z-20 max-w-[140px] sm:max-w-[200px] md:max-w-[250px] text-right">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-archivo text-sm sm:text-base md:text-2xl lg:text-2xl text-white uppercase tracking-wide leading-tight mb-0 font-normal text-left" style={{ lineHeight: '0.85em' }}>
                SEBASTIÁN<br/>RÍOS FERNÁNDEZ
              </h3>
              <p className="font-archivo text-xs sm:text-sm md:text-base text-white font-normal tracking-wide text-left">
                CEO Grupo RE
              </p>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default memo(MaestrasSection);
