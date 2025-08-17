import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, Coins, Wallet } from 'lucide-react';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: 'XOF' | 'USD';
  onCurrencyChange: (currency: 'XOF' | 'USD') => void;
}

interface Currency {
  code: 'XOF' | 'USD';
  name: string;
  symbol: string;
  flag: string;
  description: string;
  exchangeRate: number; // Taux par rapport à XOF
}

interface Cryptocurrency {
  code: string;
  name: string;
  symbol: string;
  icon: string;
  network: string;
  description: string;
  isActive: boolean;
}

const currencies: Currency[] = [
  {
    code: 'XOF',
    name: 'Franc CFA',
    symbol: 'FCFA',
    flag: '🇨🇮',
    description: 'Devise officielle de l\'Afrique de l\'Ouest',
    exchangeRate: 1
  },
  {
    code: 'USD',
    name: 'Dollar Américain',
    symbol: '$',
    flag: '🇺🇸',
    description: 'Devise internationale de référence',
    exchangeRate: 0.0016 // 1 XOF = 0.0016 USD (approximatif)
  }
];

const cryptocurrencies: Cryptocurrency[] = [
  {
    code: 'USDT',
    name: 'Tether',
    symbol: 'USDT',
    icon: '₮',
    network: 'TRC20',
    description: 'Stablecoin indexé sur le dollar américain',
    isActive: true
  },
  {
    code: 'TRX',
    name: 'TRON',
    symbol: 'TRX',
    icon: '⚡',
    network: 'TRC20',
    description: 'Cryptomonnaie native du réseau TRON',
    isActive: true
  },
  {
    code: 'DOGE',
    name: 'Dogecoin',
    symbol: 'DOGE',
    icon: '🐕',
    network: 'DOGE',
    description: 'Cryptomonnaie populaire et accessible',
    isActive: true
  },
  {
    code: 'COREDAO',
    name: 'Core DAO',
    symbol: 'CORE',
    icon: '🔥',
    network: 'CORE',
    description: 'Token natif de l\'écosystème Core DAO',
    isActive: true
  }
];

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedCurrency, 
  onCurrencyChange 
}) => {
  const [activeTab, setActiveTab] = useState<'fiat' | 'crypto'>('fiat');

  if (!isOpen) return null;

  const handleCurrencySelect = (currency: 'XOF' | 'USD') => {
    onCurrencyChange(currency);
    onClose();
  };

  const convertAmount = (amount: number, fromCurrency: 'XOF' | 'USD', toCurrency: 'XOF' | 'USD') => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    
    // Convertir d'abord en XOF, puis vers la devise cible
    const xofAmount = amount / fromRate;
    return xofAmount * toRate;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-green-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Devises & Cryptomonnaies</h2>
                <p className="text-gray-600">Choisissez votre devise préférée</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('fiat')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'fiat'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <DollarSign size={16} />
              <span>Devises Fiat</span>
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'crypto'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Coins size={16} />
              <span>Cryptomonnaies</span>
            </button>
          </div>

          {/* Devises Fiat */}
          {activeTab === 'fiat' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Devises traditionnelles</h3>
              
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedCurrency === currency.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCurrencySelect(currency.code)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{currency.flag}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {currency.name} ({currency.code})
                        </h4>
                        <p className="text-gray-600">{currency.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Symbole: {currency.symbol}
                          </span>
                          {selectedCurrency === currency.code && (
                            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              ✓ Sélectionné
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {currency.symbol}
                      </div>
                      {currency.code !== 'XOF' && (
                        <div className="text-sm text-gray-500">
                          1 {currency.code} = {(1 / currency.exchangeRate).toLocaleString()} XOF
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Conversion automatique</h4>
                <p className="text-sm text-blue-700">
                  Les montants seront automatiquement convertis selon les taux de change en temps réel.
                  Vous pouvez changer de devise à tout moment.
                </p>
              </div>
            </div>
          )}

          {/* Cryptomonnaies */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cryptomonnaies acceptées</h3>
              
              {cryptocurrencies.map((crypto) => (
                <div
                  key={crypto.code}
                  className={`border-2 rounded-xl p-6 ${
                    crypto.isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{crypto.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {crypto.name} ({crypto.code})
                        </h4>
                        <p className="text-gray-600">{crypto.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Réseau: {crypto.network}
                          </span>
                          {crypto.isActive && (
                            <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded">
                              ✓ Disponible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {crypto.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        Dépôts & Retraits
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-purple-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">🔐 Sécurité crypto</h4>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>• Toutes les transactions crypto sont vérifiées sur la blockchain</p>
                  <p>• Frais de réseau optimisés pour des transactions rapides</p>
                  <p>• Support 24h/7j pour les questions crypto</p>
                  <p>• Conversion automatique vers votre devise préférée</p>
                </div>
              </div>
            </div>
          )}

          {/* Calculateur de conversion */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Calculateur de conversion
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Montant</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Équivalent</label>
                <div className="px-4 py-3 bg-white border border-orange-200 rounded-lg">
                  <span className="text-orange-800 font-semibold">
                    {selectedCurrency === 'XOF' ? '1.60 USD' : '625 FCFA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};