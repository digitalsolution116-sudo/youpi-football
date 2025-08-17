import React, { useState } from 'react';
import { X, Wallet, CreditCard, Smartphone, Shield, Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';

interface WalletManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'orange_money' | 'mtn_money' | 'bank_card' | 'bank_account';
  name: string;
  number: string;
  isDefault: boolean;
  isVerified: boolean;
  addedAt: Date;
}

interface WalletSettings {
  autoWithdraw: boolean;
  withdrawalLimit: number;
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'orange_money',
    name: 'Orange Money Principal',
    number: '+225 07 12 34 56 78',
    isDefault: true,
    isVerified: true,
    addedAt: new Date('2024-07-15')
  },
  {
    id: '2',
    type: 'mtn_money',
    name: 'MTN Money Secondaire',
    number: '+225 05 98 76 54 32',
    isDefault: false,
    isVerified: true,
    addedAt: new Date('2024-08-01')
  },
  {
    id: '3',
    type: 'bank_card',
    name: 'Carte Visa',
    number: '**** **** **** 1234',
    isDefault: false,
    isVerified: false,
    addedAt: new Date('2024-08-10')
  }
];

export const WalletManagementModal: React.FC<WalletManagementModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'methods' | 'settings' | 'security'>('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  
  const [walletSettings, setWalletSettings] = useState<WalletSettings>({
    autoWithdraw: false,
    withdrawalLimit: 500000,
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false
  });

  if (!isOpen) return null;

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'orange_money': return '🟠';
      case 'mtn_money': return '🟡';
      case 'bank_card': return '💳';
      case 'bank_account': return '🏦';
      default: return '💰';
    }
  };

  const getMethodColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'orange_money': return 'text-orange-600 bg-orange-100';
      case 'mtn_money': return 'text-yellow-600 bg-yellow-100';
      case 'bank_card': return 'text-blue-600 bg-blue-100';
      case 'bank_account': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodLabel = (type: PaymentMethod['type']) => {
    const labels = {
      orange_money: 'Orange Money',
      mtn_money: 'MTN Money',
      bank_card: 'Carte bancaire',
      bank_account: 'Compte bancaire'
    };
    return labels[type];
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  const handleDeleteMethod = (methodId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    }
  };

  const AddMethodForm = () => (
    <div className="bg-gray-50 p-4 rounded-xl mb-6">
      <h3 className="font-semibold text-gray-800 mb-4">Ajouter une méthode de paiement</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="orange_money">Orange Money</option>
            <option value="mtn_money">MTN Money</option>
            <option value="bank_card">Carte bancaire</option>
            <option value="bank_account">Compte bancaire</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input
            type="text"
            placeholder="Ex: Mon Orange Money"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro</label>
          <input
            type="text"
            placeholder="Ex: +225 07 12 34 56 78"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddMethod(false)}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Wallet className="text-blue-600" size={28} />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestion du portefeuille</h2>
                <p className="text-sm sm:text-base text-gray-600">Gérez vos méthodes de paiement et paramètres</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
            {[
              { key: 'methods' as const, label: 'Méthodes', icon: CreditCard },
              { key: 'settings' as const, label: 'Paramètres', icon: Wallet },
              { key: 'security' as const, label: 'Sécurité', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Méthodes de paiement */}
          {activeTab === 'methods' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Méthodes de paiement</h3>
                <button
                  onClick={() => setShowAddMethod(!showAddMethod)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>

              {showAddMethod && <AddMethodForm />}

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getMethodIcon(method.type)}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{method.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{showNumbers ? method.number : method.number.replace(/\d(?=\d{4})/g, '*')}</span>
                            <button
                              onClick={() => setShowNumbers(!showNumbers)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {showNumbers ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                            Par défaut
                          </span>
                        )}
                        {method.isVerified ? (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                            Vérifié
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                            Non vérifié
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Ajouté le {method.addedAt.toLocaleDateString('fr-FR')}
                      </div>
                      
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          >
                            Définir par défaut
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMethod(method.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paramètres */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Paramètres du portefeuille</h3>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Retrait automatique</h4>
                      <p className="text-sm text-gray-600">Retirer automatiquement les gains</p>
                    </div>
                    <button
                      onClick={() => setWalletSettings(prev => ({ ...prev, autoWithdraw: !prev.autoWithdraw }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        walletSettings.autoWithdraw ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        walletSettings.autoWithdraw ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Limite de retrait quotidien</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={walletSettings.withdrawalLimit}
                      onChange={(e) => setWalletSettings(prev => ({ ...prev, withdrawalLimit: parseInt(e.target.value) }))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">FCFA</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Montant maximum que vous pouvez retirer par jour
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-800">Notifications email</span>
                        <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                      </div>
                      <button
                        onClick={() => setWalletSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          walletSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          walletSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-800">Notifications SMS</span>
                        <p className="text-sm text-gray-600">Recevoir les alertes par SMS</p>
                      </div>
                      <button
                        onClick={() => setWalletSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          walletSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          walletSettings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Sécurité du portefeuille</h3>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Authentification à deux facteurs</h4>
                      <p className="text-sm text-gray-600">Sécurité renforcée pour vos transactions</p>
                    </div>
                    <button
                      onClick={() => setWalletSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        walletSettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        walletSettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  {walletSettings.twoFactorAuth && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ Authentification à deux facteurs activée
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Historique de sécurité</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Connexion réussie', date: new Date(), ip: '192.168.1.1' },
                      { action: 'Retrait effectué', date: new Date(Date.now() - 86400000), ip: '192.168.1.1' },
                      { action: 'Mot de passe modifié', date: new Date(Date.now() - 172800000), ip: '192.168.1.2' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{event.action}</p>
                          <p className="text-xs text-gray-500">IP: {event.ip}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.date.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Actions de sécurité</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="font-medium text-blue-800">Changer le mot de passe</div>
                      <div className="text-sm text-blue-600">Dernière modification il y a 30 jours</div>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                      <div className="font-medium text-yellow-800">Déconnecter tous les appareils</div>
                      <div className="text-sm text-yellow-600">Forcer la déconnexion sur tous les appareils</div>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="font-medium text-red-800">Suspendre le compte</div>
                      <div className="text-sm text-red-600">Suspendre temporairement votre compte</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations importantes */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">🔒 Sécurité et confidentialité</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Vos données de paiement sont chiffrées et sécurisées</p>
              <p>• Nous ne stockons jamais vos codes PIN ou mots de passe</p>
              <p>• Toutes les transactions sont surveillées 24h/7j</p>
              <p>• En cas de problème, contactez immédiatement le support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};