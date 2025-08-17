import React, { useState } from 'react';
import { CreditCard, Smartphone, AlertTriangle, CheckCircle, Globe } from 'lucide-react';
import { PaymentMethod, PaymentRequest } from '../../types/payment';
import { useAuth } from '../../contexts/AuthContext';

interface PaydunyaFormProps {
  method: PaymentMethod;
  amount: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PaydunyaForm: React.FC<PaydunyaFormProps> = ({
  method,
  amount,
  type,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [paymentType, setPaymentType] = useState<'mobile_money' | 'bank_card'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [error, setError] = useState('');

  const operators = [
    { code: 'orange', name: 'Orange Money', countries: ['CI', 'SN', 'ML', 'BF', 'NE', 'GN'] },
    { code: 'mtn', name: 'MTN Mobile Money', countries: ['CI', 'GH', 'NG', 'CM', 'UG', 'RW'] },
    { code: 'moov', name: 'Moov Money', countries: ['CI', 'BJ', 'TG', 'BF', 'NE', 'ML'] },
    { code: 'wave', name: 'Wave', countries: ['SN', 'CI', 'UG'] },
    { code: 'flooz', name: 'Flooz', countries: ['TG', 'BJ'] }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    if (!operator) {
      setError('Veuillez sélectionner votre opérateur');
      return;
    }

    if (amount < method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal']) {
      setError(`Montant minimum : ${method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal'].toLocaleString()} FCFA`);
      return;
    }

    const request: PaymentRequest = {
      userId: user!.id,
      method: 'paydunya',
      amount,
      currency: 'XOF',
      details: {
        phoneNumber,
        operatorCode: operator,
        paymentType
      },
      reference: `PAYDUNYA-${Date.now()}`
    };

    onSubmit(request);
  };

  const fees = Math.ceil(amount * method.fees[type] / 100);
  const totalAmount = type === 'deposit' ? amount + fees : amount - fees;

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
          <img 
            src="https://paydunya.com/assets/img/logo.png" 
            alt="Paydunya"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-full h-full bg-blue-100 rounded flex items-center justify-center text-2xl">💳</div>';
              }
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Paydunya</h3>
          <p className="text-gray-600">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'} sécurisé
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du type de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de paiement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentType('mobile_money')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentType === 'mobile_money'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-sm font-medium">Mobile Money</div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentType('bank_card')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentType === 'bank_card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-sm font-medium">Carte Bancaire</div>
            </button>
          </div>
        </div>

        {/* Formulaire Mobile Money */}
        {paymentType === 'mobile_money' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opérateur Mobile Money
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un opérateur</option>
                {operators.map((op) => (
                  <option key={op.code} value={op.code}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +225 07 12 34 56 78"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {/* Informations Paydunya */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="text-blue-600" size={16} />
            <span className="font-semibold text-blue-800">Paydunya - Paiement sécurisé</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Plateforme de paiement certifiée en Afrique de l'Ouest</li>
            <li>• Support de tous les opérateurs Mobile Money</li>
            <li>• Transactions sécurisées et chiffrées</li>
            <li>• Traitement instantané des paiements</li>
          </ul>
        </div>

        {/* Résumé */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Résumé de la transaction</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Montant :</span>
              <span className="font-medium">{amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Frais Paydunya ({method.fees[type]}%) :</span>
              <span className="font-medium">{fees.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">
                {type === 'deposit' ? 'Total à payer :' : 'Vous recevrez :'}
              </span>
              <span className="font-bold text-lg">
                {totalAmount.toLocaleString()} FCFA
              </span>
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
            disabled={isLoading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Confirmer le ${type === 'deposit' ? 'dépôt' : 'retrait'}`}
          </button>
        </div>
      </form>
    </div>
  );
};