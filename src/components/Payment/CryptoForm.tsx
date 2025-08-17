import React, { useState } from 'react';
import { Coins, Copy, AlertTriangle, ExternalLink, QrCode } from 'lucide-react';
import { PaymentMethod, PaymentRequest } from '../../types/payment';
import { cryptocurrencies } from '../../config/paymentMethods';
import { useAuth } from '../../contexts/AuthContext';

interface CryptoFormProps {
  method: PaymentMethod;
  amount: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({
  method,
  amount,
  type,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('USDT');
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Adresses de dépôt de la plateforme (à remplacer par vos vraies adresses)
  const platformAddresses = {
    USDT: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt',
    TRX: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt',
    DOGE: 'DQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt',
    CORE: 'CQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt'
  };

  const selectedCryptoData = cryptocurrencies.find(crypto => crypto.symbol === selectedCrypto);
  const platformAddress = platformAddresses[selectedCrypto as keyof typeof platformAddresses];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(platformAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'deposit' && !txHash) {
      setError('Veuillez entrer le hash de transaction');
      return;
    }

    if (type === 'withdrawal' && !walletAddress) {
      setError('Veuillez entrer votre adresse de portefeuille');
      return;
    }

    // Convertir le montant en crypto (simulation - en production, utiliser une API de taux de change)
    const cryptoRates = {
      USDT: 0.0016, // 1 FCFA = 0.0016 USDT
      TRX: 0.02,    // 1 FCFA = 0.02 TRX
      DOGE: 0.001,  // 1 FCFA = 0.001 DOGE
      CORE: 0.005   // 1 FCFA = 0.005 CORE
    };

    const cryptoAmount = amount * (cryptoRates[selectedCrypto as keyof typeof cryptoRates] || 0.0016);

    const request: PaymentRequest = {
      userId: user!.id,
      method: method.type,
      amount,
      currency: selectedCrypto as any,
      details: {
        walletAddress: type === 'withdrawal' ? walletAddress : platformAddress,
        network: selectedCryptoData?.network,
        txHash: type === 'deposit' ? txHash : undefined
      },
      reference: `CRYPTO-${selectedCrypto}-${Date.now()}`
    };

    onSubmit(request);
  };

  const networkFees = {
    USDT: '1 USDT',
    TRX: '10 TRX',
    DOGE: '1 DOGE',
    CORE: '0.1 CORE'
  };

  const fees = Math.ceil(amount * method.fees[type] / 100);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
          <img 
            src="" alt="" />
          <div className="text-3xl">{selectedCryptoData?.icon}</div>
          <div className="hidden w-full h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded items-center justify-center">
            <Coins className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Cryptomonnaies</h3>
          <p className="text-gray-600">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'} en crypto
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection de la cryptomonnaie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choisir la cryptomonnaie
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cryptocurrencies.filter(crypto => crypto.isActive).map((crypto) => (
              <button
                key={crypto.symbol}
                type="button"
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCrypto === crypto.symbol
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <div className="text-3xl">{crypto.icon}</div>
                </div>
                <div className="font-bold text-gray-800">{crypto.symbol}</div>
                <div className="text-xs text-gray-600">{crypto.network}</div>
              </button>
            ))}
          </div>
        </div>

        {type === 'deposit' ? (
          // Formulaire de dépôt crypto
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Adresse de dépôt {selectedCrypto} ({selectedCryptoData?.network})
              </h4>
              <div className="flex items-center space-x-2 bg-white p-3 rounded border">
                <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                  {platformAddress}
                </code>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied ? '✓' : <Copy size={16} />}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-1">✓ Adresse copiée</p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-red-600 mt-0.5" size={16} />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">⚠️ Important :</p>
                  <ul className="space-y-1">
                    <li>• Envoyez uniquement du {selectedCrypto} sur le réseau {selectedCryptoData?.network}</li>
                    <li>• Montant minimum : {(amount * 0.0016).toFixed(4)} {selectedCrypto}</li>
                    <li>• Les dépôts sont crédités après 1-3 confirmations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hash de transaction (après envoi)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Collez le hash de votre transaction ici"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous trouverez ce hash dans votre portefeuille après l'envoi
              </p>
            </div>
          </div>
        ) : (
          // Formulaire de retrait crypto
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre adresse de portefeuille {selectedCrypto}
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={`Votre adresse ${selectedCrypto} (${selectedCryptoData?.network})`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Assurez-vous que l'adresse est compatible avec le réseau {selectedCryptoData?.network}
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-orange-600 mt-0.5" size={16} />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">Frais de réseau :</p>
                  <p>Les frais de réseau {selectedCrypto} ({networkFees[selectedCrypto as keyof typeof networkFees]}) seront déduits du montant envoyé.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Résumé */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Résumé</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Montant :</span>
              <span className="font-medium">{amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Équivalent crypto :</span>
              <span className="font-medium">
                ~{(amount * 0.0016).toFixed(4)} {selectedCrypto}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frais plateforme :</span>
              <span className="font-medium">{fees.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Temps de traitement :</span>
              <span className="font-medium">{method.processingTime[type]}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || (type === 'deposit' && !txHash) || (type === 'withdrawal' && !walletAddress)}
            className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Confirmer le ${type === 'deposit' ? 'dépôt' : 'retrait'}`}
          </button>
        </div>
      </form>
    </div>
  );
};