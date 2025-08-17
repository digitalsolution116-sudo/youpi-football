import React, { useState } from 'react';
import { CreditCard, Smartphone, Coins, Building, Wallet } from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { getPaymentMethodsForCountry } from '../../config/paymentMethods';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
  type: 'deposit' | 'withdrawal';
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onMethodSelect,
  selectedMethod,
  type
}) => {
  const { user } = useAuth();
  const availableMethods = getPaymentMethodsForCountry(user?.country || 'Côte d\'Ivoire');

  const getMethodIcon = (methodType: PaymentMethod['type']) => {
    switch (methodType) {
      case 'paydunya':
        return <Globe className="text-blue-600" size={24} />;
      case 'orange_money':
      case 'mtn_money':
      case 'moov_money':
        return <Smartphone className="text-blue-600" size={24} />;
      case 'crypto':
        return <Coins className="text-purple-600" size={24} />;
      case 'bank_card':
        return <CreditCard className="text-green-600" size={24} />;
      case 'bank_transfer':
        return <Building className="text-orange-600" size={24} />;
      default:
        return <Wallet className="text-gray-600" size={24} />;
    }
  };

  const getMethodColor = (methodType: PaymentMethod['type']) => {
    switch (methodType) {
      case 'paydunya': return 'from-blue-500 to-blue-600';
      case 'orange_money': return 'from-orange-500 to-orange-600';
      case 'mtn_money': return 'from-yellow-500 to-yellow-600';
      case 'moov_money': return 'from-blue-500 to-blue-600';
      case 'crypto': return 'from-purple-500 to-purple-600';
      case 'bank_card': return 'from-green-500 to-green-600';
      case 'bank_transfer': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatFee = (fee: number) => {
    return fee === 0 ? 'Gratuit' : `${fee}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Choisir une méthode de {type === 'deposit' ? 'dépôt' : 'retrait'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method)}
            className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback vers une icône par défaut
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-gray-100 rounded flex items-center justify-center text-2xl">${
                        method.type === 'orange_money' ? '🟠' :
                        method.type === 'mtn_money' ? '🟡' :
                        method.type === 'moov_money' ? '🔵' :
                        method.type === 'crypto' ? '₿' :
                        method.type === 'bank_card' ? '💳' :
                        '🏦'
                      }</div>`;
                    }
                  }}
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800">{method.name}</h4>
                <p className="text-sm text-gray-600">
                  {method.processingTime[type]}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Frais :</span>
                <span className="font-medium">
                  {formatFee(method.fees[type])}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum :</span>
                <span className="font-medium">
                  {type === 'deposit' 
                    ? method.limits.minDeposit.toLocaleString()
                    : method.limits.minWithdrawal.toLocaleString()
                  } FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maximum :</span>
                <span className="font-medium">
                  {type === 'deposit' 
                    ? method.limits.maxDeposit.toLocaleString()
                    : method.limits.maxWithdrawal.toLocaleString()
                  } FCFA
                </span>
              </div>
            </div>
            
            {selectedMethod?.id === method.id && (
              <div className="mt-4 p-2 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-800 text-center">✓ Méthode sélectionnée</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};