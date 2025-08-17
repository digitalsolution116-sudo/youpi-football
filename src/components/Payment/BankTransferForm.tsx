import React, { useState } from 'react';
import { Building, Copy, AlertCircle, FileText } from 'lucide-react';
import { PaymentMethod, PaymentRequest } from '../../types/payment';
import { useAuth } from '../../contexts/AuthContext';

interface BankTransferFormProps {
  method: PaymentMethod;
  amount: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BankTransferForm: React.FC<BankTransferFormProps> = ({
  method,
  amount,
  type,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    accountHolderName: ''
  });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  // Informations bancaires de la plateforme pour les dépôts
  const platformBankInfo = {
    bankName: 'Banque Atlantique Côte d\'Ivoire',
    accountNumber: 'CI05 CI001 01234567890123456789',
    swiftCode: 'ATCICIAB',
    accountHolder: 'YOUPI FOOTBALL SARL',
    reference: `DEP-${user?.username}-${Date.now()}`
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'withdrawal') {
      if (!formData.bankName || !formData.accountNumber || !formData.accountHolderName) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
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
      details: type === 'withdrawal' ? {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        swiftCode: formData.swiftCode
      } : {
        bankName: platformBankInfo.bankName,
        accountNumber: platformBankInfo.accountNumber,
        swiftCode: platformBankInfo.swiftCode
      },
      reference: type === 'deposit' ? platformBankInfo.reference : `BANK-WIT-${Date.now()}`
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
            src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
            alt="Virement bancaire"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop';
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Virement Bancaire</h3>
          <p className="text-gray-600">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'} par virement
          </p>
        </div>
      </div>

      {type === 'deposit' ? (
        // Formulaire de dépôt - Afficher les coordonnées bancaires
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-4">
              Coordonnées bancaires pour le virement
            </h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <span className="text-sm text-gray-600">Banque :</span>
                  <div className="font-semibold">{platformBankInfo.bankName}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(platformBankInfo.bankName, 'bank')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied === 'bank' ? '✓' : <Copy size={16} />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <span className="text-sm text-gray-600">IBAN :</span>
                  <div className="font-mono font-semibold">{platformBankInfo.accountNumber}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(platformBankInfo.accountNumber, 'iban')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied === 'iban' ? '✓' : <Copy size={16} />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <span className="text-sm text-gray-600">Code SWIFT :</span>
                  <div className="font-mono font-semibold">{platformBankInfo.swiftCode}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(platformBankInfo.swiftCode, 'swift')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied === 'swift' ? '✓' : <Copy size={16} />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <span className="text-sm text-gray-600">Bénéficiaire :</span>
                  <div className="font-semibold">{platformBankInfo.accountHolder}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(platformBankInfo.accountHolder, 'holder')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied === 'holder' ? '✓' : <Copy size={16} />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded border border-yellow-300">
                <div>
                  <span className="text-sm text-yellow-700">Référence obligatoire :</span>
                  <div className="font-mono font-bold text-yellow-800">{platformBankInfo.reference}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(platformBankInfo.reference, 'ref')}
                  className="text-yellow-700 hover:text-yellow-800"
                >
                  {copied === 'ref' ? '✓' : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-orange-600 mt-0.5" size={16} />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">Instructions importantes :</p>
                <ul className="space-y-1">
                  <li>• Effectuez le virement avec la référence exacte</li>
                  <li>• Le montant doit correspondre exactement</li>
                  <li>• Conservez le reçu de virement</li>
                  <li>• Crédit sous 1-2 jours ouvrés après vérification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Formulaire de retrait - Demander les coordonnées du bénéficiaire
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la banque *
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              placeholder="Ex: Banque Atlantique"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de compte / IBAN *
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Ex: CI05 CI001 01234567890123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code SWIFT (international)
              </label>
              <input
                type="text"
                value={formData.swiftCode}
                onChange={(e) => setFormData(prev => ({ ...prev, swiftCode: e.target.value.toUpperCase() }))}
                placeholder="Ex: ATCICIAB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code banque (local)
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                placeholder="Ex: 001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du titulaire du compte *
            </label>
            <input
              type="text"
              value={formData.accountHolderName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value.toUpperCase() }))}
              placeholder="NOM PRÉNOM (comme sur le compte)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Résumé financier */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">Détails financiers</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Montant :</span>
            <span className="font-medium">{amount.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Frais ({method.fees[type]}%) :</span>
            <span className="font-medium">{fees.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Délai de traitement :</span>
            <span className="font-medium">{method.processingTime[type]}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">
              {type === 'deposit' ? 'Montant à virer :' : 'Vous recevrez :'}
            </span>
            <span className="font-bold text-lg">
              {totalAmount.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg mt-4">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? 'Traitement...' : `Confirmer le ${type === 'deposit' ? 'dépôt' : 'retrait'}`}
        </button>
      </div>
    </div>
  );
};