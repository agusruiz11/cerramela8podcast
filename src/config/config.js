const config = {
  NEWSLETTER_PROVIDER: 'brevo', // 'brevo' activo | 'kit' comentado
  API_KEY: import.meta.env.VITE_API_KEY || '',
  LIST_ID: import.meta.env.VITE_LIST_ID || '',
  ENDPOINT_URL: import.meta.env.VITE_ENDPOINT_URL || '',
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  YOUTUBE_CHANNEL_ID: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
  TERMS_URL: '/terminos',
  PRIVACY_URL: '/privacidad'
};

export default config;
