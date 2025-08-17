import { PaymentMethod, CryptoCurrency, CountryPaymentConfig } from '../types/payment';

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'paydunya',
    type: 'paydunya' as any,
    name: 'Paydunya',
    logo: 'https://paydunya.com/assets/img/logo.png',
    isActive: true,
    supportedCountries: ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Guinée', 'Cameroun', 'Bénin', 'Togo', 'Ghana', 'Nigeria'],
    fees: {
      deposit: 2.5,
      withdrawal: 3.0
    },
    limits: {
      minDeposit: 1000,
      maxDeposit: 5000000,
      minWithdrawal: 5000,
      maxWithdrawal: 2000000
    },
    processingTime: {
      deposit: 'Instantané',
      withdrawal: '5-30 minutes'
    }
  },
  {
    id: 'orange_money',
    type: 'orange_money',
    name: 'Orange Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    isActive: true,
    supportedCountries: ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Guinée', 'Cameroun', 'Bénin', 'Togo', 'République démocratique du Congo', 'Madagascar', 'Jordanie', 'Moldavie', 'Roumanie', 'Slovaquie', 'Belgique', 'Luxembourg', 'France', 'Espagne', 'Pologne'],
    fees: {
      deposit: 0, // Gratuit
      withdrawal: 1.5 // 1.5%
    },
    limits: {
      minDeposit: 1000,
      maxDeposit: 1000000,
      minWithdrawal: 5000,
      maxWithdrawal: 500000
    },
    processingTime: {
      deposit: 'Instantané',
      withdrawal: '5-30 minutes'
    }
  },
  {
    id: 'mtn_money',
    type: 'mtn_money',
    name: 'MTN Mobile Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    isActive: true,
    supportedCountries: ['Côte d\'Ivoire', 'Ghana', 'Nigeria', 'Cameroun', 'Ouganda', 'Rwanda', 'Zambie', 'Bénin', 'Congo', 'Guinée-Bissau', 'Liberia', 'Sud-Soudan', 'Soudan', 'Swaziland', 'Afghanistan', 'Iran', 'Syrie', 'Yémen'],
    fees: {
      deposit: 0,
      withdrawal: 2.0
    },
    limits: {
      minDeposit: 1000,
      maxDeposit: 1000000,
      minWithdrawal: 5000,
      maxWithdrawal: 500000
    },
    processingTime: {
      deposit: 'Instantané',
      withdrawal: '5-30 minutes'
    }
  },
  {
    id: 'moov_money',
    type: 'moov_money',
    name: 'Moov Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/200px-Moov_Africa_logo.svg.png',
    isActive: true,
    supportedCountries: ['Côte d\'Ivoire', 'Bénin', 'Togo', 'Burkina Faso', 'Niger', 'Mali', 'Guinée', 'République centrafricaine', 'Tchad', 'Gabon'],
    fees: {
      deposit: 0,
      withdrawal: 1.8
    },
    limits: {
      minDeposit: 1000,
      maxDeposit: 500000,
      minWithdrawal: 5000,
      maxWithdrawal: 300000
    },
    processingTime: {
      deposit: 'Instantané',
      withdrawal: '10-45 minutes'
    }
  },
  {
    id: 'crypto',
    type: 'crypto',
    name: 'Cryptomonnaies',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    isActive: true,
    supportedCountries: ['Tous les pays'],
    fees: {
      deposit: 0,
      withdrawal: 0.5 // Frais de réseau
    },
    limits: {
      minDeposit: 10, // USD équivalent
      maxDeposit: 50000,
      minWithdrawal: 20,
      maxWithdrawal: 10000
    },
    processingTime: {
      deposit: '1-3 confirmations',
      withdrawal: '5-15 minutes'
    }
  },
  {
    id: 'bank_card',
    type: 'bank_card',
    name: 'Carte Bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
    isActive: true,
    supportedCountries: ['Tous les pays'],
    fees: {
      deposit: 2.5,
      withdrawal: 3.0
    },
    limits: {
      minDeposit: 5000,
      maxDeposit: 2000000,
      minWithdrawal: 10000,
      maxWithdrawal: 1000000
    },
    processingTime: {
      deposit: 'Instantané',
      withdrawal: '1-3 jours ouvrés'
    }
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    name: 'Virement Bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/SEPA_logo.svg/200px-SEPA_logo.svg.png',
    isActive: true,
    supportedCountries: ['Tous les pays'],
    fees: {
      deposit: 1.0,
      withdrawal: 2.0
    },
    limits: {
      minDeposit: 10000,
      maxDeposit: 5000000,
      minWithdrawal: 20000,
      maxWithdrawal: 2000000
    },
    processingTime: {
      deposit: '1-2 jours ouvrés',
      withdrawal: '2-5 jours ouvrés'
    }
  }
];

export const cryptocurrencies: CryptoCurrency[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    network: 'TRC20',
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 6,
    icon: '🟢',
    isActive: true
  },
  {
    symbol: 'TRX',
    name: 'TRON',
    network: 'TRC20',
    decimals: 6,
    icon: '🔴',
    isActive: true
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    network: 'DOGE',
    decimals: 8,
    icon: '🐕',
    isActive: true
  },
  {
    symbol: 'CORE',
    name: 'Core DAO',
    network: 'CORE',
    decimals: 18,
    icon: '🟠',
    isActive: true
  }
];

export const countryPaymentConfigs: CountryPaymentConfig[] = [
  {
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'mtn_money', 'moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['07', '08', '09'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' },
      { code: 'mtn', name: 'MTN Money', type: 'mtn_money', prefixes: ['05', '06'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' },
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['01', '02', '03'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Bénin',
    countryCode: 'BJ',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'mtn_money', 'moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['96', '97'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' },
      { code: 'mtn', name: 'MTN Money', type: 'mtn_money', prefixes: ['90', '91'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' },
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['94', '95'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Niger',
    countryCode: 'NE',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['93', '94'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' },
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['96', '97'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Cameroun',
    countryCode: 'CM',
    currency: 'XAF',
    supportedMethods: ['orange_money', 'mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['69', '65'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' },
      { code: 'mtn', name: 'MTN Money', type: 'mtn_money', prefixes: ['67', '68'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Nigeria',
    countryCode: 'NG',
    currency: 'NGN',
    supportedMethods: ['mtn_money', 'crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN MoMo', type: 'mtn_money', prefixes: ['0803', '0806', '0813', '0816', '0903', '0906'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Togo',
    countryCode: 'TG',
    currency: 'XOF',
    supportedMethods: ['moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['90', '91', '92'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Mali',
    countryCode: 'ML',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['70', '74', '75'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Burkina Faso',
    countryCode: 'BF',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['70', '76'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' },
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['71', '72'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Guinée',
    countryCode: 'GN',
    currency: 'GNF',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['62', '66'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Sénégal',
    countryCode: 'SN',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['77', '78'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Ghana',
    countryCode: 'GH',
    currency: 'GHS', 
    supportedMethods: ['mtn_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['024', '054', '055'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Gabon',
    countryCode: 'GA',
    currency: 'XAF',
    supportedMethods: ['moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['07', '08'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'République démocratique du Congo',
    countryCode: 'CD',
    currency: 'CDF',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['81', '82'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Madagascar',
    countryCode: 'MG',
    currency: 'MGA',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['32', '33'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'République du Congo',
    countryCode: 'CG',
    currency: 'XAF',
    supportedMethods: ['moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['06', '07'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'République centrafricaine',
    countryCode: 'CF',
    currency: 'XAF',
    supportedMethods: ['moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['75', '77'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Tchad',
    countryCode: 'TD',
    currency: 'XAF',
    supportedMethods: ['moov_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'moov', name: 'Moov Money', type: 'moov_money', prefixes: ['66', '77'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Moov_Africa_logo.svg/100px-Moov_Africa_logo.svg.png' }
    ]
  },
  {
    country: 'Ouganda',
    countryCode: 'UG',
    currency: 'UGX',
    supportedMethods: ['mtn_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['077', '078'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Rwanda',
    countryCode: 'RW',
    currency: 'RWF',
    supportedMethods: ['mtn_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['078', '079'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Zambie',
    countryCode: 'ZM',
    currency: 'ZMW',
    supportedMethods: ['mtn_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['096', '097'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Liberia',
    countryCode: 'LR',
    currency: 'LRD',
    supportedMethods: ['mtn_money', 'orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['088', '077'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' },
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['086', '087'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Sierra Leone',
    countryCode: 'SL',
    currency: 'SLL',
    supportedMethods: ['orange_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['076', '077'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Guinée-Bissau',
    countryCode: 'GW',
    currency: 'XOF',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['095', '096'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Soudan du Sud',
    countryCode: 'SS',
    currency: 'SSP',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['091', '092'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Soudan',
    countryCode: 'SD',
    currency: 'SDG',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['091', '092'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Swaziland',
    countryCode: 'SZ',
    currency: 'SZL',
    supportedMethods: ['mtn_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['076', '078'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Afghanistan',
    countryCode: 'AF',
    currency: 'AFN',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['070', '077'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Iran',
    countryCode: 'IR',
    currency: 'IRR',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['091', '099'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Syrie',
    countryCode: 'SY',
    currency: 'SYP',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['094', '095'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Yémen',
    countryCode: 'YE',
    currency: 'YER',
    supportedMethods: ['mtn_money', 'crypto', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'mtn', name: 'MTN Mobile Money', type: 'mtn_money', prefixes: ['077', '078'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MTN_Logo.svg/100px-MTN_Logo.svg.png' }
    ]
  },
  {
    country: 'Jordanie',
    countryCode: 'JO',
    currency: 'JOD',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['077', '078'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Moldavie',
    countryCode: 'MD',
    currency: 'MDL',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['069', '079'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Roumanie',
    countryCode: 'RO',
    currency: 'RON',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['074', '075'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Slovaquie',
    countryCode: 'SK',
    currency: 'EUR',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['090', '094'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Pologne',
    countryCode: 'PL',
    currency: 'PLN',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['060', '066'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Maroc',
    countryCode: 'MA',
    currency: 'MAD',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['060', '061'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Algérie',
    countryCode: 'DZ',
    currency: 'DZD',
    supportedMethods: ['crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Tunisie',
    countryCode: 'TN',
    currency: 'TND',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['020', '021'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Égypte',
    countryCode: 'EG',
    currency: 'EGP',
    supportedMethods: ['orange_money', 'crypto', 'bank_card'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['010', '011'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Kenya',
    countryCode: 'KE',
    currency: 'KES',
    supportedMethods: ['crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Tanzanie',
    countryCode: 'TZ',
    currency: 'TZS',
    supportedMethods: ['crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Afrique du Sud',
    countryCode: 'ZA',
    currency: 'ZAR',
    supportedMethods: ['crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Espagne',
    countryCode: 'ES',
    currency: 'EUR',
    supportedMethods: ['orange_money', 'crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['060', '061'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Luxembourg',
    countryCode: 'LU',
    currency: 'EUR',
    supportedMethods: ['orange_money', 'crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['062', '063'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'Belgique',
    countryCode: 'BE',
    currency: 'EUR',
    supportedMethods: ['orange_money', 'crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['046', '047'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'France',
    countryCode: 'FR',
    currency: 'XOF',
    supportedMethods: ['orange_money', 'crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: [
      { code: 'orange', name: 'Orange Money', type: 'orange_money', prefixes: ['060', '061'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/100px-Orange_logo.svg.png' }
    ]
  },
  {
    country: 'États-Unis',
    countryCode: 'US',
    currency: 'USD',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    currency: 'CAD',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Brésil',
    countryCode: 'BR',
    currency: 'BRL',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Argentine',
    countryCode: 'AR',
    currency: 'ARS',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Mexique',
    countryCode: 'MX',
    currency: 'MXN',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Colombie',
    countryCode: 'CO',
    currency: 'COP',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Venezuela',
    countryCode: 'VE',
    currency: 'VES',
    supportedMethods: ['crypto', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Chili',
    countryCode: 'CL',
    currency: 'CLP',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Pérou',
    countryCode: 'PE',
    currency: 'PEN',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Allemagne',
    countryCode: 'DE',
    currency: 'EUR',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Italie',
    countryCode: 'IT',
    currency: 'EUR',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Angleterre',
    countryCode: 'GB',
    currency: 'GBP',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Pays-Bas',
    countryCode: 'NL',
    currency: 'EUR',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Portugal',
    countryCode: 'PT',
    currency: 'EUR',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Suisse',
    countryCode: 'CH',
    currency: 'CHF',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Chine',
    countryCode: 'CN',
    currency: 'CNY',
    supportedMethods: ['crypto', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Japon',
    countryCode: 'JP',
    currency: 'JPY',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Inde',
    countryCode: 'IN',
    currency: 'INR',
    supportedMethods: ['crypto', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Corée du Sud',
    countryCode: 'KR',
    currency: 'KRW',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Thaïlande',
    countryCode: 'TH',
    currency: 'THB',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Vietnam',
    countryCode: 'VN',
    currency: 'VND',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Malaisie',
    countryCode: 'MY',
    currency: 'MYR',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Singapour',
    countryCode: 'SG',
    currency: 'SGD',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Australie',
    countryCode: 'AU',
    currency: 'AUD',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  {
    country: 'Russie',
    countryCode: 'RU',
    currency: 'RUB',
    supportedMethods: ['crypto', 'bank_transfer'],
    mobileMoneyOperators: []
  },
  {
    country: 'Turquie',
    countryCode: 'TR',
    currency: 'TRY',
    supportedMethods: ['bank_card', 'bank_transfer', 'crypto'],
    mobileMoneyOperators: []
  },
  // Configuration par défaut pour tous les autres pays
  {
    country: 'Défaut',
    countryCode: 'XX',
    currency: 'XOF',
    supportedMethods: ['crypto', 'bank_card', 'bank_transfer'],
    mobileMoneyOperators: []
  }
];

export const getPaymentMethodsForCountry = (country: string): PaymentMethod[] => {
  const config = countryPaymentConfigs.find(c => c.country === country);
  if (!config) {
    // Pays non configuré - utiliser la configuration par défaut
    const defaultConfig = countryPaymentConfigs.find(c => c.country === 'Défaut');
    return paymentMethods.filter(method => 
      defaultConfig?.supportedMethods.includes(method.type) || 
      method.type === 'crypto' || method.type === 'bank_transfer'
    );
  }
  
  return paymentMethods.filter(method => 
    config.supportedMethods.includes(method.type)
  );
};

export const getMobileMoneyOperators = (country: string) => {
  const config = countryPaymentConfigs.find(c => c.country === country);
  return config?.mobileMoneyOperators || [];
};

export const detectOperatorFromPhone = (phoneNumber: string, country: string) => {
  const operators = getMobileMoneyOperators(country);
  // Enlever les codes pays communs
  const cleanPhone = phoneNumber.replace(/\D/g, '')
    .replace(/^(\+225|225)/, '') // Côte d'Ivoire
    .replace(/^(\+229|229)/, '') // Bénin
    .replace(/^(\+227|227)/, '') // Niger
    .replace(/^(\+237|237)/, '') // Cameroun
    .replace(/^(\+234|234)/, '') // Nigeria
    .replace(/^(\+228|228)/, '') // Togo
    .replace(/^(\+223|223)/, '') // Mali
    .replace(/^(\+226|226)/, '') // Burkina Faso
    .replace(/^(\+224|224)/, '') // Guinée
    .replace(/^(\+221|221)/, '') // Sénégal
    .replace(/^(\+233|233)/, '') // Ghana
    .replace(/^(\+241|241)/, '') // Gabon
    .replace(/^(\+243|243)/, '') // RDC
    .replace(/^(\+261|261)/, '') // Madagascar
    .replace(/^(\+242|242)/, '') // Congo
    .replace(/^(\+236|236)/, '') // RCA
    .replace(/^(\+235|235)/, '') // Tchad
    .replace(/^(\+256|256)/, '') // Ouganda
    .replace(/^(\+250|250)/, '') // Rwanda
    .replace(/^(\+260|260)/, '') // Zambie
    .replace(/^(\+231|231)/, '') // Liberia
    .replace(/^(\+232|232)/, '') // Sierra Leone
    .replace(/^(\+245|245)/, '') // Guinée-Bissau
    .replace(/^(\+211|211)/, '') // Soudan du Sud
    .replace(/^(\+249|249)/, '') // Soudan
    .replace(/^(\+268|268)/, '') // Swaziland
    .replace(/^(\+93|93)/, '')   // Afghanistan
    .replace(/^(\+98|98)/, '')   // Iran
    .replace(/^(\+963|963)/, '') // Syrie
    .replace(/^(\+967|967)/, '') // Yémen
    .replace(/^(\+962|962)/, '') // Jordanie
    .replace(/^(\+373|373)/, '') // Moldavie
    .replace(/^(\+40|40)/, '')   // Roumanie
    .replace(/^(\+421|421)/, '') // Slovaquie
    .replace(/^(\+32|32)/, '')   // Belgique
    .replace(/^(\+352|352)/, '') // Luxembourg
    .replace(/^(\+33|33)/, '')   // France
    .replace(/^(\+34|34)/, '')   // Espagne
    .replace(/^(\+48|48)/, '')   // Pologne
    .replace(/^(\+212|212)/, '') // Maroc
    .replace(/^(\+213|213)/, '') // Algérie
    .replace(/^(\+216|216)/, '') // Tunisie
    .replace(/^(\+20|20)/, '')   // Égypte
    .replace(/^(\+1|1)/, '');    // USA/Canada
  
  for (const operator of operators) {
    for (const prefix of operator.prefixes) {
      if (cleanPhone.startsWith(prefix)) {
        return operator;
      }
    }
  }
  
  return null;
};