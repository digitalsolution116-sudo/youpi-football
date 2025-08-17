export interface PaymentMethod {
  id: string;
  type: 'paydunya' | 'orange_money' | 'mtn_money' | 'moov_money' | 'crypto' | 'bank_card' | 'bank_transfer';
  name: string;
  logo: string;
  isActive: boolean;
  supportedCountries: string[];
  fees: {
    deposit: number; // Pourcentage
    withdrawal: number; // Pourcentage
  };
  limits: {
    minDeposit: number;
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number;
  };
  processingTime: {
    deposit: string;
    withdrawal: string;
  };
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  network: string;
  contractAddress?: string;
  decimals: number;
  icon: string;
  isActive: boolean;
}

export interface PaymentRequest {
  userId: string;
  method: PaymentMethod['type'];
  amount: number;
  currency: 'XOF' | 'USD' | 'USDT' | 'TRX' | 'DOGE' | 'CORE';
  details: {
    // Mobile Money
    phoneNumber?: string;
    operatorCode?: string;
    
    // Crypto
    walletAddress?: string;
    network?: string;
    txHash?: string;
    
    // Bank Card
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    
    // Bank Transfer
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    swiftCode?: string;
  };
  reference?: string;
  notes?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  amount?: number;
  fees?: number;
  estimatedTime?: string;
  instructions?: string;
  error?: string;
}

export interface CountryPaymentConfig {
  country: string;
  countryCode: string;
  currency: 'XOF' | 'USD' | 'EUR' | 'GHS' | 'NGN';
  supportedMethods: PaymentMethod['type'][];
  mobileMoneyOperators: {
    code: string;
    name: string;
    type: PaymentMethod['type'];
    prefixes: string[];
    logo: string;
    logo: string;
  }[];
}