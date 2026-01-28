
import config from '@/config/config';

// Newsletter adapter pattern - can be extended for Mailchimp/Brevo
class NewsletterService {
  constructor(provider) {
    this.provider = provider;
  }

  async subscribe(email) {
    switch (this.provider) {
      case 'mailchimp':
        return this.subscribeMailchimp(email);
      case 'brevo':
        return this.subscribeBrevo(email);
      default:
        return this.subscribeMock(email);
    }
  }

  async subscribeMock(email) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    return { success: true, message: '¡Suscripción exitosa!' };
  }

  async subscribeMailchimp(email) {
    // Placeholder for Mailchimp integration
    // Will be implemented when API keys are provided
    throw new Error('Mailchimp integration not configured');
  }

  async subscribeBrevo(email) {
    // Placeholder for Brevo integration
    // Will be implemented when API keys are provided
    throw new Error('Brevo integration not configured');
  }
}

export const newsletterService = new NewsletterService(config.NEWSLETTER_PROVIDER);
