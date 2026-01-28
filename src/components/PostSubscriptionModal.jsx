
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const PostSubscriptionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    ocupacion: '',
    pais: ''
  });
  const { execute, loading } = useApi(api.submitProfile);
  const { toast } = useToast();

  const ocupaciones = [
    'Empresario',
    'Estudiante',
    'Empleado',
    'Otro'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ocupacion || !formData.pais) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive'
      });
      return;
    }

    try {
      await execute(formData);
      toast({
        title: '¡Gracias!',
        description: 'Tu perfil se ha actualizado correctamente'
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error',
        variant: 'destructive'
      });
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="mb-6">
                <h2 className="font-thunder text-4xl font-bold text-[#0F0F0F] mb-2 uppercase tracking-tight">
                  ¡Queremos conocerte más!
                </h2>
                <p className="font-archivo text-gray-600">
                  Ayúdanos a personalizar tu experiencia
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ocupación Select */}
                <div>
                  <label className="block font-archivo font-semibold text-gray-700 mb-2">
                    Ocupación
                  </label>
                  <select
                    value={formData.ocupacion}
                    onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-archivo focus:outline-none focus:border-[#2A51F4] transition-all"
                  >
                    <option value="">Selecciona una opción</option>
                    {ocupaciones.map((ocupacion) => (
                      <option key={ocupacion} value={ocupacion}>
                        {ocupacion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* País Input */}
                <div>
                  <label className="block font-archivo font-semibold text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    placeholder="Ingresa tu país"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-archivo placeholder:text-gray-400 focus:outline-none focus:border-[#2A51F4] transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={loading}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-archivo font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                  >
                    Saltar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#2A51F4] hover:bg-[#1a3bc4] text-white font-archivo font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Enviando...
                      </>
                    ) : (
                      'Enviar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PostSubscriptionModal;
