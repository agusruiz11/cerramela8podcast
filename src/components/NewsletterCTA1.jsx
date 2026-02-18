import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { validateEmail } from '@/lib/validators';
import newsletterImage from '../assets/images/CL8_WEB2.jpg';

const carouselImages = [
  newsletterImage,
  'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=1200&h=800&fit=crop'
];

const NewsletterCTA1 = memo(({ onSubscribeSuccess }) => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [errorMessage, setErrorMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const emailInputRef = useRef(null);
  const { execute, loading } = useApi(api.subscribe);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const result = validateEmail(email);
    if (!result.valid) {
      setErrorMessage(result.error);
      emailInputRef.current?.focus?.();
      toast({
        title: 'Revisá el email',
        description: result.error,
        variant: 'destructive'
      });
      return;
    }

    try {
      const res = await execute({
        email: result.value,
        website
      });
      toast({
        title: '¡Éxito!',
        description: res?.alreadySubscribed
          ? 'Ya estabas suscripto. ¡Gracias!'
          : '¡Gracias por suscribirte a nuestro newsletter!'
      });
      setEmail('');
      onSubscribeSuccess(result.value, res?.subscriberId ?? null);
    } catch (error) {
      const msg =
        error.message ||
        'No pudimos completar la suscripción. Probá de nuevo en un momento.';
      setErrorMessage(msg);
      emailInputRef.current?.focus?.();
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive'
      });
    }
  }, [email, website, execute, onSubscribeSuccess, toast]);

  return (
    <section id="newsletter" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-[#0F0F0F]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[420px] sm:min-h-[460px] md:min-h-[500px] rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl bg-[#0F0F0F]"
        >
          {/* Imagen de fondo a pantalla completa */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={carouselImages[currentImageIndex]}
                alt="Cerrame la 8 Podcast - Newsletter"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full object-cover sm:object-none object-center sm:object-right"
                loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </AnimatePresence>
          </div>

          {/* Panel CTA con gradiente semi-transparente que deja ver la imagen */}
          <div
            className="absolute left-0 top-0 bottom-0 w-full lg:max-w-[45%] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16 flex flex-col justify-center z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(42, 81, 244, 0.98) 0%, rgba(42, 81, 244, 0.85) 35%, rgba(8, 7, 71, 0.4) 85%, rgba(8, 7, 71, 0) 100%)'
            }}
          >
            <div className="mb-6 sm:mb-8 md:mb-10 w-full max-w-xl">
              <h2 className="font-thunder text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[4rem] leading-[0.88] uppercase text-[#FAEED1]" style={{ letterSpacing: '0.01em' }}>
                <span className="font-semibold block">SUSCRIBITE AL</span>
                <span className="font-semibold block">RESUMEN EJECUTIVO</span>
                <span className="font-semibold block">DEL PODCAST</span>
                <span className="font-extrabold block text-[#F6EED5]/95 text-[0.9em] sm:text-[1em]">#1 DE GASTRONOMÍA</span>
                <span className="font-extrabold block text-[#F6EED5]/95 text-[0.9em] sm:text-[1em]">Y COMPETITIVIDAD</span>
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true" />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="TU EMAIL"
                    disabled={loading}
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? 'newsletter-email-error' : undefined}
                    className={`w-full flex-1 bg-[#050505] border text-white placeholder:text-white/90 px-4 py-2.5 h-11 sm:h-10 rounded-[10px] focus:outline-none transition-all font-archivo uppercase text-xs sm:text-sm tracking-widest min-w-0 ${errorMessage ? 'border-[#E82D06] focus:border-[#E82D06]' : 'border-white focus:border-[#2A51F4]'}`}
                  />
                  {errorMessage && (
                    <p id="newsletter-email-error" className="text-[#F6EED5] bg-[#E82D06]/90 text-xs font-archivo font-medium px-2 py-1.5 rounded-md flex items-center gap-1.5" role="alert">
                      <AlertCircle size={14} className="shrink-0" aria-hidden />
                      {errorMessage}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-11 sm:h-10 px-4 py-0 min-w-0 sm:min-w-[120px] bg-[#E82D06] border border-white rounded-[10px] text-white font-thunder font-semibold text-3xl sm:text-lg md:text-3xl tracking-[0.06em] uppercase hover:bg-[#c42505] shadow-[0_0_25px_rgba(232,45,6,0.6)] hover:shadow-[0_0_35px_rgba(232,45,6,0.8)] transition-all duration-300 flex items-center justify-center leading-none shrink-0" style={{ letterSpacing: '0.02em' }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin shrink-0" size={20} />
                  ) : (
                    <span className="inline-block translate-y-[2px] sm:translate-y-[3px]">SUSCRIBITE</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
            }}
          />

          {/* Carousel indicators - Minimal Bottom Right */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 flex gap-1.5 sm:gap-2 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  index === currentImageIndex
                    ? 'bg-white w-6 opacity-100'
                    : 'bg-white w-3 opacity-40 hover:opacity-70'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

NewsletterCTA1.displayName = 'NewsletterCTA1';

export default NewsletterCTA1;
