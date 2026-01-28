import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import PostSubscriptionModal from './PostSubscriptionModal';
import laptopImage from '../assets/images/laptop.png';

const HablemosSection = memo(() => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { execute, loading } = useApi(api.subscribe);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa tu email',
        variant: 'destructive'
      });
      return;
    }

    try {
      await execute(email);
      toast({
        title: '¡Enviado!',
        description: 'Gracias por ponerte en contacto.'
      });
      setEmail('');
      setShowModal(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error',
        variant: 'destructive'
      });
    }
  }, [email, execute, toast]);

  return (
    <section id="contacto" className="py-12 sm:py-16 md:py-24 px-4 sm:px-5 md:px-6 bg-white relative overflow-x-hidden overflow-y-visible">
      <div className="container mx-auto max-w-7xl relative">
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center min-h-0 md:min-h-[500px] gap-0">
          
          {/* Laptop delante (z-20), superpuesta a la tarjeta */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-full md:w-[50%] max-w-[620px] flex-shrink-0 -mb-8 sm:-mb-10 md:mb-0 md:-mr-[14%] order-1 md:order-1 px-2 sm:px-0"
          >
            <img
              src={laptopImage}
              alt="Laptop Cerrame La 8"
              className="w-full h-auto object-contain pt-0 sm:pt-12 md:pt-20 max-h-[320px] sm:max-h-[320px] md:max-h-none"
              loading="lazy"
              decoding="async"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))'
              }}
            />
          </motion.div>

          {/* Tarjeta azul detrás (z-10), título + formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex-1 flex flex-col justify-center md:pl-0 min-w-0 order-2 md:order-2"
          >
            {/* Título HABLEMOS: arriba de la tarjeta, siempre visible por encima */}
            <div className="relative z-20 w-full text-center md:text-right pr-0 sm:pr-8 md:pr-32 pb-4 sm:pb-8 md:pb-16 pt-4 mb-1 md:mb-2">
              <h2 className="font-thunder text-4xl sm:text-5xl md:text-7xl text-[#0F0F0F] uppercase tracking-tighter font-semibold inline-block break-keep" style={{ letterSpacing: '0.01em' }}>
                HABLEMOS
              </h2>
            </div>

            {/* Tarjeta azul: parte izquierda tapada por la laptop; un poco más arriba */}
            <div className="w-full md:min-w-0 md:-ml-[12%] md:-mt-16 p-5 sm:p-6 md:p-8 md:pl-[30%] md:pr-8 md:py-16 md:min-h-[200px] bg-[#2A51F4] rounded-[1.5rem] sm:rounded-[2rem] relative overflow-visible flex flex-col justify-center">
              <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden pointer-events-none" aria-hidden>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3b60ff] to-transparent opacity-30" />
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col sm:flex-row gap-3 items-stretch w-full max-w-xl md:ml-auto shrink-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="TU EMAIL"
                  disabled={loading}
                  className="flex-1 min-w-0 bg-[#050505] border border-white text-white placeholder:text-white/90 px-3 sm:px-4 py-2.5 h-10 sm:h-10 rounded-[7px] focus:outline-none focus:border-white transition-all font-archivo uppercase text-xs sm:text-sm tracking-widest text-left"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-4 py-0 min-w-[100px] sm:min-w-[120px] bg-[#E82D06] border border-white rounded-[7px] text-white font-thunder font-semibold text-3xl sm:text-2xl md:text-3xl tracking-[0.06em] uppercase hover:bg-[#c42505] shadow-[0_0_25px_rgba(232,45,6,0.6)] hover:shadow-[0_0_35px_rgba(232,45,6,0.8)] transition-all duration-300 flex items-center justify-center leading-none shrink-0" style={{ letterSpacing: '0.02em' }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin shrink-0" size={20} />
                  ) : (
                    <span className="inline-block translate-y-[3px]">SUSCRIBITE</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
      
      <PostSubscriptionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </section>
  );
});

HablemosSection.displayName = 'HablemosSection';

export default HablemosSection;
