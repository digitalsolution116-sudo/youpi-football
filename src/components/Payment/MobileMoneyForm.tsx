import React, { useState, useEffect } from 'react';
import { Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentMethod, PaymentRequest } from '../../types/payment';
import { detectOperatorFromPhone, getMobileMoneyOperators } from '../../config/paymentMethods';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMoneyFormProps {
  method: PaymentMethod;
  amount: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MobileMoneyForm: React.FC<MobileMoneyFormProps> = ({
  method,
  amount,
  type,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operatorCode, setOperatorCode] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [error, setError] = useState('');

  const operators = getMobileMoneyOperators(user?.country || 'Côte d\'Ivoire');

  // Auto-détecter l'opérateur basé sur le pays et le numéro
  useEffect(() => {
    if (phoneNumber && user?.country) {
      const detected = detectOperatorFromPhone(phoneNumber, user?.country || 'Côte d\'Ivoire');
      setDetectedOperator(detected);
      if (detected) {
        setOperatorCode(detected.code);
        setSelectedOperator(detected);
        // Auto-sélectionner la méthode correspondante si elle correspond
        if (
          (detected.type === 'orange_money' && method.type === 'orange_money') ||
          (detected.type === 'mtn_money' && method.type === 'mtn_money') ||
          (detected.type === 'moov_money' && method.type === 'moov_money')
        ) {
          setError(''); // Méthode correcte détectée
        } else {
          setError(`Ce numéro correspond à ${detected.name}. Veuillez sélectionner la bonne méthode.`);
        }
      } else {
        setSelectedOperator(null);
      }
    }
  }, [phoneNumber, user?.country, method.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    if (!operatorCode) {
      setError('Veuillez sélectionner un opérateur');
      return;
    }

    if (amount < method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal']) {
      setError(`Montant minimum : ${method.limits[type === 'deposit' ? 'minDeposit' : 'minWithdrawal'].toLocaleString()} FCFA`);
      return;
    }

    if (amount > method.limits[type === 'deposit' ? 'maxDeposit' : 'maxWithdrawal']) {
      setError(`Montant maximum : ${method.limits[type === 'deposit' ? 'maxDeposit' : 'maxWithdrawal'].toLocaleString()} FCFA`);
      return;
    }

    const request: PaymentRequest = {
      userId: user!.id,
      method: method.type,
      amount,
      currency: 'XOF',
      details: {
        phoneNumber,
        operatorCode
      },
      reference: `${method.type.toUpperCase()}-${Date.now()}`
    };

    onSubmit(request);
  };

  const fees = Math.ceil(amount * method.fees[type] / 100);
  const totalAmount = type === 'deposit' ? amount + fees : amount - fees;

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${
          method.type === 'orange_money' ? 'from-orange-500 to-orange-600' :
          method.type === 'mtn_money' ? 'from-yellow-500 to-yellow-600' :
          'from-blue-500 to-blue-600'
        }`}>
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{method.name}</h3>
          <p className="text-gray-600">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'} via Mobile Money
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone Mobile Money
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: +225 07 12 34 56 78"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {detectedOperator && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>Opérateur détecté : {detectedOperator.name}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opérateur Mobile Money
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {operators.map((operator) => (
              <button
                key={operator.code}
                type="button"
                onClick={() => {
                  setOperatorCode(operator.code);
                  setSelectedOperator(operator);
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  operatorCode === operator.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <img
                    src={operator.logo}
                    alt={operator.name}
                    className="w-full h-full object-contain rounded"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gray-100 rounded flex items-center justify-center text-2xl">${
                          operator.type === 'orange_money' ? '🟠' :
                          operator.type === 'mtn_money' ? '🟡' :
                          '🔵'
                        }</div>`;
                      }
                    }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-800">{operator.name}</div>
                <div className="text-xs text-gray-500">
                  {operator.prefixes.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Résumé de la transaction */}
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
                {type === 'deposit' ? 'Total à payer :' : 'Vous recevrez :'}
              </span>
              <span className="font-bold text-lg">
                {totalAmount.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions :</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Vérifiez que votre compte Mobile Money a suffisamment de fonds</li>
            <li>2. Gardez votre téléphone à portée de main</li>
            <li>3. Vous recevrez un SMS de confirmation</li>
            <li>4. Entrez votre code PIN Mobile Money quand demandé</li>
          </ol>
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
            disabled={isLoading || !phoneNumber || !operatorCode}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Confirmer le ${type === 'deposit' ? 'dépôt' : 'retrait'}`}
          </button>
        </div>
      </form>
    </div>
  );
};