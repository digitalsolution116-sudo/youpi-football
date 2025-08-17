import React, { useState } from 'react';
import { CreditCard, Shield, AlertCircle, Lock } from 'lucide-react';
import { PaymentMethod, PaymentRequest } from '../../types/payment';
import { useAuth } from '../../contexts/AuthContext';

interface BankCardFormProps {
  method: PaymentMethod;
  amount: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BankCardForm: React.FC<BankCardFormProps> = ({
  method,
  amount,
  type,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      // Formater le numéro de carte (XXXX XXXX XXXX XXXX)
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    } else if (field === 'expiryDate') {
      // Formater la date d'expiration (MM/YY)
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (field === 'cvv') {
      // Limiter le CVV à 3-4 chiffres
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateCard = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = formData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      return 'Numéro de carte invalide';
    }
    
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return 'Date d\'expiration invalide (MM/YY)';
    }
    
    if (!cvv || cvv.length < 3) {
      return 'CVV invalide';
    }
    
    if (!cardholderName || cardholderName.length < 2) {
      return 'Nom du titulaire requis';
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (amount < method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal']) {
      setError(`Montant minimum : ${method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal'].toLocaleString()} FCFA`);
      return;
    }

    const request: PaymentRequest = {
      userId: user!.id,
      method: method.type,
      amount,
      currency: 'XOF',
      details: {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName
      },
      reference: `CARD-${Date.now()}`
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
            src="https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
            alt="Carte bancaire"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop';
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Carte Bancaire</h3>
          <p className="text-gray-600">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'} par carte
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de carte
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'expiration
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du titulaire
          </label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value.toUpperCase())}
            placeholder="NOM PRÉNOM"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
              <span>Frais ({method.fees[type]}%) :</span>
              <span className="font-medium">{fees.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">
                {type === 'deposit' ? 'Total à débiter :' : 'Vous recevrez :'}
              </span>
              <span className="font-bold text-lg">
                {totalAmount.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="text-green-600" size={16} />
            <span className="font-semibold text-green-800">Sécurité SSL 256-bit</span>
          </div>
          <p className="text-sm text-green-700">
            Vos données bancaires sont chiffrées et sécurisées. Nous ne stockons aucune information sensible.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={16} />
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
            className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Confirmer le ${type === 'deposit' ? 'dépôt' : 'retrait'}`}
          </button>
        </div>
      </form>
    </div>
  );
};