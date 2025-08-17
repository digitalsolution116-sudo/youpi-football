import { supabase } from '../lib/supabase';
import { PaymentRequest, PaymentResponse } from '../types/payment';
import { paydunyaService } from './paydunyaService';

export const paymentService = {
  async processPayment(request: PaymentRequest, type: 'deposit' | 'withdrawal'): Promise<PaymentResponse> {
    try {
      // Appeler la fonction SQL appropriée selon le type
      if (type === 'deposit') {
        return await this.processDeposit(request);
      } else {
        return await this.processWithdrawal(request);
      }
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de traitement'
      };
    }
  },

  async processDeposit(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Traitement spécial pour Paydunya
      if (request.method === 'paydunya') {
        return await this.processPaydunyaPayment(request, 'deposit');
      }

      const { data, error } = await supabase.rpc('process_payment_deposit', {
        p_user_id: request.userId,
        p_amount: request.amount,
        p_method: request.method,
        p_currency: request.currency,
        p_details: JSON.stringify(request.details),
        p_reference: request.reference
      });

      if (error) throw error;

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Erreur lors du dépôt'
        };
      }

      return {
        success: true,
        transactionId: data.transaction_id,
        reference: data.reference,
        amount: data.amount,
        fees: data.fees,
        estimatedTime: this.getEstimatedTime(request.method, 'deposit'),
        instructions: this.getInstructions(request.method, 'deposit', request.details)
      };
    } catch (error) {
      throw error;
    }
  },

  async processWithdrawal(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Traitement spécial pour Paydunya
      if (request.method === 'paydunya') {
        return await this.processPaydunyaPayment(request, 'withdrawal');
      }

      const { data, error } = await supabase.rpc('process_payment_withdrawal', {
        p_user_id: request.userId,
        p_amount: request.amount,
        p_method: request.method,
        p_currency: request.currency,
        p_details: JSON.stringify(request.details),
        p_reference: request.reference
      });

      if (error) throw error;

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Erreur lors du retrait'
        };
      }

      return {
        success: true,
        transactionId: data.transaction_id,
        reference: data.reference,
        amount: data.amount,
        fees: data.fees,
        estimatedTime: this.getEstimatedTime(request.method, 'withdrawal'),
        instructions: this.getInstructions(request.method, 'withdrawal', request.details)
      };
    } catch (error) {
      throw error;
    }
  },

  async processPaydunyaPayment(request: PaymentRequest, type: 'deposit' | 'withdrawal'): Promise<PaymentResponse> {
    try {
      // Créer la demande de paiement Paydunya
      const paydunyaRequest = {
        amount: request.amount,
        currency: 'XOF',
        description: `${type === 'deposit' ? 'Dépôt' : 'Retrait'} - ${request.amount.toLocaleString()} FCFA`,
        callback_url: `${window.location.origin}/api/paydunya/callback`,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        custom_data: {
          userId: request.userId,
          type,
          reference: request.reference
        }
      };

      const paydunyaResponse = await paydunyaService.createPayment(paydunyaRequest);

      if (!paydunyaResponse.success) {
        throw new Error(paydunyaResponse.error || 'Erreur Paydunya');
      }

      // Enregistrer la transaction en attente
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: request.userId,
          type: type === 'deposit' ? 'deposit' : 'withdrawal',
          amount: type === 'deposit' ? request.amount : -request.amount,
          status: 'pending',
          description: `${type === 'deposit' ? 'Dépôt' : 'Retrait'} Paydunya`,
          payment_method: 'Paydunya',
          reference: request.reference
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        transactionId: data.id,
        reference: request.reference,
        amount: request.amount,
        estimatedTime: 'Instantané',
        instructions: `Vous allez être redirigé vers Paydunya pour finaliser le paiement. URL: ${paydunyaResponse.invoice_url}`
      };
    } catch (error) {
      console.error('Erreur Paydunya:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de traitement Paydunya'
      };
    }
  },

  getEstimatedTime(method: PaymentRequest['method'], type: 'deposit' | 'withdrawal'): string {
    const times = {
      paydunya: { deposit: 'Instantané', withdrawal: '5-30 minutes' },
      orange_money: { deposit: 'Instantané', withdrawal: '5-30 minutes' },
      mtn_money: { deposit: 'Instantané', withdrawal: '5-30 minutes' },
      moov_money: { deposit: 'Instantané', withdrawal: '10-45 minutes' },
      crypto: { deposit: '1-3 confirmations', withdrawal: '5-15 minutes' },
      bank_card: { deposit: 'Instantané', withdrawal: '1-3 jours ouvrés' },
      bank_transfer: { deposit: '1-2 jours ouvrés', withdrawal: '2-5 jours ouvrés' }
    };
    
    return times[method]?.[type] || '1-24 heures';
  },

  getInstructions(method: PaymentRequest['method'], type: 'deposit' | 'withdrawal', details: any): string {
    if (type === 'deposit') {
      switch (method) {
        case 'orange_money':
        case 'mtn_money':
        case 'moov_money':
          return `Vous allez recevoir un SMS de confirmation sur ${details.phoneNumber}. Entrez votre code PIN pour valider.`;
        case 'crypto':
          return `Votre dépôt sera crédité après 1-3 confirmations sur la blockchain ${details.network}.`;
        case 'bank_card':
          return 'Votre carte sera débitée immédiatement. Vérifiez votre SMS bancaire.';
        case 'bank_transfer':
          return 'Effectuez le virement avec la référence fournie. Crédit sous 1-2 jours ouvrés.';
        default:
          return 'Suivez les instructions reçues par email.';
      }
    } else {
      switch (method) {
        case 'orange_money':
        case 'mtn_money':
        case 'moov_money':
          return `Les fonds seront envoyés sur ${details.phoneNumber} sous 5-30 minutes.`;
        case 'crypto':
          return `Les fonds seront envoyés à ${details.walletAddress} sur le réseau ${details.network}.`;
        case 'bank_card':
          return 'Le remboursement sera effectué sur votre carte sous 1-3 jours ouvrés.';
        case 'bank_transfer':
          return 'Le virement sera effectué vers votre compte bancaire sous 2-5 jours ouvrés.';
        default:
          return 'Vous recevrez une confirmation par email.';
      }
    }
  }
};