import React, { useState } from 'react';
import { X, Gift, Check, AlertCircle } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage('Veuillez entrer un code');
      setMessageType('error');
      return;
    }

    // Simulation de validation de code
    const validCodes = ['WELCOME100', 'BONUS50', 'VIP2024', 'FRIEND25'];
    
    if (validCodes.includes(code.toUpperCase())) {
      setMessage('Code validé avec succès ! Bonus ajouté à votre compte.');
      setMessageType('success');
      setCode('');
    } else {
      setMessage('Code invalide ou expiré');
      setMessageType('error');
    }
  };

  const availableCodes = [
    {
      code: 'WELCOME100',
      description: 'Bonus de bienvenue 100%',
      type: 'Nouveau joueur',
      color: 'bg-green-100 text-green-800'
    },
    {
      code: 'BONUS50',
      description: 'Bonus de dépôt 50%',
      type: 'Dépôt',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      code: 'VIP2024',
      description: 'Code VIP exclusif',
      type: 'VIP',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      code: 'FRIEND25',
      description: 'Bonus parrainage 25%',
      type: 'Parrainage',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Gift className="text-red-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Utiliser les codes</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code promotionnel
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Entrez votre code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              />
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {messageType === 'success' ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Valider le code
            </button>
          </form>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Codes disponibles (démo)</h3>
            <div className="space-y-3">
              {availableCodes.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono font-bold text-lg">{item.code}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.color}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <button
                    onClick={() => setCode(item.code)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                  >
                    Utiliser ce code
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Comment obtenir des codes ?</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Suivez nos réseaux sociaux</li>
              <li>• Participez aux événements spéciaux</li>
              <li>• Invitez vos amis</li>
              <li>• Restez actif sur la plateforme</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};