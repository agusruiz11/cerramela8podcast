
// Mock API service - replace with actual API calls when backend is ready
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async subscribe(email) {
    await delay(1000);
    
    // Mock validation
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    // Mock success response
    return {
      success: true,
      message: '¡Gracias por suscribirte!'
    };
  },

  async submitProfile(data) {
    await delay(1000);
    
    // Mock validation
    if (!data.email) {
      throw new Error('Email requerido');
    }
    
    // Mock success response
    return {
      success: true,
      message: 'Perfil actualizado correctamente'
    };
  },

  async getLatestVideos() {
    await delay(500);
    
    // Mock response with fallback videos
    return {
      success: true,
      videos: [
        {
          id: 'video1',
          title: 'HOY UN BAR DEBE TENER GASTRONOMÍA',
          thumbnail: 'https://images.unsplash.com/photo-1693904501551-4e7e716a780d?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        },
        {
          id: 'video2',
          title: 'LOS PIZZA-CAFÉ SIGUEN FIRMES. PASEN Y VEA',
          thumbnail: 'https://images.unsplash.com/photo-1668605335608-0b74662e45e2?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        },
        {
          id: 'video3',
          title: 'ADRIAN VALENTI: MARCA EN NEGOCIOS DE FRANQUICIA',
          thumbnail: 'https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?w=800&h=450&fit=crop',
          url: 'https://youtube.com'
        }
      ]
    };
  }
};
