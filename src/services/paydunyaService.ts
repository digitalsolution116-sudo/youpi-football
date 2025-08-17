import { supabase } from '../lib/supabase';

interface PaydunyaConfig {
  masterKey: string;
  privateKey: string;
  publicKey: string;
  token: string;
  mode: 'test' | 'live';
  baseUrl: string;
}

interface PaydunyaPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  return_url: string;
  cancel_url: string;
  custom_data?: any;
}

interface PaydunyaPaymentResponse {
  success: boolean;
  token?: string;
  invoice_url?: string;
  response_code?: string;
  response_text?: string;
  error?: string;
}

export class PaydunyaService {
  private config: PaydunyaConfig;

  constructor() {
    this.config = {
      masterKey: import.meta.env.VITE_PAYDUNYA_MASTER_KEY || '**************************',
      privateKey: import.meta.env.VITE_PAYDUNYA_PRIVATE_KEY || '**************************',
      publicKey: import.meta.env.VITE_PAYDUNYA_PUBLIC_KEY || '**************************',
      token: import.meta.env.VITE_PAYDUNYA_TOKEN || '**************************',
      mode: import.meta.env.VITE_PAYDUNYA_MODE || 'test',
      baseUrl: import.meta.env.VITE_PAYDUNYA_MODE === 'live' 
        ? 'https://app.paydunya.com/api/v1' 
        : 'https://app.paydunya.com/sandbox-api/v1'
    };
  }

  async createPayment(request: PaydunyaPaymentRequest): Promise<PaydunyaPaymentResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Configuration Paydunya manquante');
      }

      const headers = {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': this.config.masterKey,
        'PAYDUNYA-PRIVATE-KEY': this.config.privateKey,
        'PAYDUNYA-TOKEN': this.config.token
      };

      const response = await fetch(`${this.config.baseUrl}/checkout-invoice/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          invoice: {
            total_amount: request.amount,
            description: request.description
          },
          store: {
            name: 'YOUPI FOOTBALL',
            website_url: window.location.origin
          },
          actions: {
            callback_url: request.callback_url,
            return_url: request.return_url,
            cancel_url: request.cancel_url
          },
          custom_data: request.custom_data
        })
      });

      const data = await response.json();

      if (data.response_code === '00') {
        return {
          success: true,
          token: data.token,
          invoice_url: data.response_text,
          response_code: data.response_code
        };
      } else {
        return {
          success: false,
          error: data.response_text || 'Erreur lors de la création du paiement'
        };
      }
    } catch (error) {
      console.error('Erreur Paydunya:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion Paydunya'
      };
    }
  }

  async checkPaymentStatus(token: string): Promise<any> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': this.config.masterKey,
        'PAYDUNYA-PRIVATE-KEY': this.config.privateKey,
        'PAYDUNYA-TOKEN': this.config.token
      };

      const response = await fetch(`${this.config.baseUrl}/checkout-invoice/confirm/${token}`, {
        method: 'GET',
        headers
      });

      return await response.json();
    } catch (error) {
      console.error('Erreur vérification statut Paydunya:', error);
      throw error;
    }
  }

  private isConfigured(): boolean {
    return !!(
      this.config.masterKey && 
      this.config.privateKey && 
      this.config.publicKey && 
      this.config.token
    );
  }

  getConfigurationStatus() {
    return {
      isConfigured: this.isConfigured(),
      mode: this.config.mode,
      missingKeys: [
        !this.config.masterKey && 'VITE_PAYDUNYA_MASTER_KEY',
        !this.config.privateKey && 'VITE_PAYDUNYA_PRIVATE_KEY',
        !this.config.publicKey && 'VITE_PAYDUNYA_PUBLIC_KEY',
        !this.config.token && 'VITE_PAYDUNYA_TOKEN'
      ].filter(Boolean)
    };
  }
}

export const paydunyaService = new PaydunyaService();