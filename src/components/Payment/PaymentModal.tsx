import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { PaymentMethod, PaymentRequest, PaymentResponse } from '../../types/payment';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { MobileMoneyForm } from './MobileMoneyForm';
import { CryptoForm } from './CryptoForm';
import { BankCardForm } from './BankCardForm';
import { BankTransferForm } from './BankTransferForm';
import { PaydunyaForm } from './PaydunyaForm';
import { paymentService } from '../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdrawal';
  initialAmount?: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  initialAmount = 0
}) => {
  const [step, setStep] = useState<'amount' | 'method' | 'form' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState(initialAmount);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);

  if (!isOpen) return null;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('form');
  };

  const handlePaymentSubmit = async (request: PaymentRequest) => {
    setIsLoading(true);
    setStep('processing');
    
    try {
      const response = await paymentService.processPayment(request, type);
      setResult(response);
      setStep('success');
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de traitement'
      });
      setStep('success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount(initialAmount);
    setSelectedMethod(null);
    setResult(null);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'amount':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {type === 'deposit' ? 'Effectuer un dépôt' : 'Effectuer un retrait'}
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="Entrez le montant"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                min="1000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Montant minimum : 1,000 FCFA
              </p>
            </div>

            <button
              onClick={() => setStep('method')}
              disabled={amount < 1000}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Continuer
            </button>
          </div>
        );

      case 'method':
        return (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setStep('amount')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Méthode de paiement</h2>
                <p className="text-gray-600">Montant : {amount.toLocaleString()} FCFA</p>
              </div>
            </div>
            
            <PaymentMethodSelector
              onMethodSelect={handleMethodSelect}
              selectedMethod={selectedMethod}
              type={type}
            />
          </div>
        );

      case 'form':
        if (!selectedMethod) return null;
        
        return (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setStep('method')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedMethod.name}</h2>
                <p className="text-gray-600">Montant : {amount.toLocaleString()} FCFA</p>
              </div>
            </div>

            {(selectedMethod.type === 'orange_money' || 
              selectedMethod.type === 'mtn_money' || 
              selectedMethod.type === 'moov_money') && (
              <MobileMoneyForm
                method={selectedMethod}
                amount={amount}
                type={type}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setStep('method')}
                isLoading={isLoading}
              />
            )}

            {selectedMethod.type === 'crypto' && (
              <CryptoForm
                method={selectedMethod}
                amount={amount}
                type={type}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setStep('method')}
                isLoading={isLoading}
              />
            )}

            {selectedMethod.type === 'bank_card' && (
              <BankCardForm
                method={selectedMethod}
                amount={amount}
                type={type}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setStep('method')}
                isLoading={isLoading}
              />
            )}

            {selectedMethod.type === 'bank_transfer' && (
              <BankTransferForm
                method={selectedMethod}
                amount={amount}
                type={type}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setStep('method')}
                isLoading={isLoading}
              />
            )}

            {selectedMethod.type === 'paydunya' && (
              <PaydunyaForm
                method={selectedMethod}
                amount={amount}
                type={type}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setStep('method')}
                isLoading={isLoading}
              />
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Traitement en cours...</h2>
            <p className="text-gray-600">
              Veuillez patienter pendant le traitement de votre {type === 'deposit' ? 'dépôt' : 'retrait'}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            {result?.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-green-600 text-2xl">✓</div>
                </div>
                <h2 className="text-xl font-bold text-green-600">
                  {type === 'deposit' ? 'Dépôt' : 'Retrait'} initié avec succès !
                </h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800">
                    Référence : <span className="font-mono">{result.reference}</span>
                  </p>
                  {result.estimatedTime && (
                    <p className="text-green-700 mt-1">
                      Temps estimé : {result.estimatedTime}
                    </p>
                  )}
                </div>
                {result.instructions && (
                  <div className="bg-blue-50 p-4 rounded-lg text-left">
                    <p className="text-blue-800 text-sm">{result.instructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-red-600 text-2xl">✗</div>
                </div>
                <h2 className="text-xl font-bold text-red-600">Erreur de traitement</h2>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800">{result?.error}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              {step !== 'amount' && step !== 'processing' && step !== 'success' && (
                <button
                  onClick={() => setStep(step === 'form' ? 'method' : 'amount')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
};