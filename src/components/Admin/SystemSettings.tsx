import React, { useState } from 'react';
import { 
  Save, 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

export const SystemSettings: React.FC = () => {
  const { settings, updateSettings, isLoading } = useAdmin();
  const [formData, setFormData] = useState(settings || {
    minimumBet: 1000,
    maximumBet: 1000000,
    refundPercentage: 80,
    bonusPercentage: 10,
    withdrawalFee: 2.5,
    maintenanceMode: false,
    allowRegistration: true,
    maxDailyWithdrawal: 500000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  const handleToggle = (field: 'maintenanceMode' | 'allowRegistration') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const settingSections = [
    {
      title: 'Paramètres des paris',
      icon: DollarSign,
      color: 'blue',
      settings: [
        {
          key: 'minimumBet',
          label: 'Mise minimum (FCFA)',
          type: 'number',
          description: 'Montant minimum pour placer un pari'
        },
        {
          key: 'maximumBet',
          label: 'Mise maximum (FCFA)',
          type: 'number',
          description: 'Montant maximum pour placer un pari'
        },
        {
          key: 'refundPercentage',
          label: 'Pourcentage de remboursement (%)',
          type: 'number',
          description: 'Pourcentage remboursé en cas de perte'
        },
        {
          key: 'bonusPercentage',
          label: 'Pourcentage de bonus (%)',
          type: 'number',
          description: 'Bonus accordé sur les dépôts'
        }
      ]
    },
    {
      title: 'Paramètres financiers',
      icon: Shield,
      color: 'green',
      settings: [
        {
          key: 'withdrawalFee',
          label: 'Frais de retrait (%)',
          type: 'number',
          description: 'Pourcentage de frais sur les retraits'
        },
        {
          key: 'maxDailyWithdrawal',
          label: 'Retrait maximum journalier (FCFA)',
          type: 'number',
          description: 'Montant maximum de retrait par jour'
        }
      ]
    },
    {
      title: 'Paramètres système',
      icon: SettingsIcon,
      color: 'purple',
      settings: [
        {
          key: 'maintenanceMode',
          label: 'Mode maintenance',
          type: 'toggle',
          description: 'Activer le mode maintenance pour bloquer l\'accès'
        },
        {
          key: 'allowRegistration',
          label: 'Autoriser les inscriptions',
          type: 'toggle',
          description: 'Permettre aux nouveaux utilisateurs de s\'inscrire'
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres système</h1>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          <span>Sauvegarder</span>
        </button>
      </div>

      {formData.maintenanceMode && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle size={20} />
            <span className="font-semibold">Mode maintenance activé</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            L'application est actuellement en mode maintenance. Les utilisateurs ne peuvent pas accéder aux fonctionnalités.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`bg-${section.color}-50 px-6 py-4 border-b border-${section.color}-100`}>
                <div className="flex items-center space-x-3">
                  <Icon className="text-blue-600" size={24} />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      
                      {setting.type === 'toggle' ? (
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => handleToggle(setting.key as any)}
                            className={`flex items-center p-1 rounded-full transition-colors ${
                              formData[setting.key as keyof typeof formData]
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            {formData[setting.key as keyof typeof formData] ? (
                              <ToggleRight className="text-white" size={24} />
                            ) : (
                              <ToggleLeft className="text-gray-600" size={24} />
                            )}
                          </button>
                          <span className={`text-sm font-medium ${
                            formData[setting.key as keyof typeof formData]
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`}>
                            {formData[setting.key as keyof typeof formData] ? 'Activé' : 'Désactivé'}
                          </span>
                        </div>
                      ) : (
                        <input
                          type={setting.type}
                          value={formData[setting.key as keyof typeof formData] as number}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [setting.key]: setting.type === 'number' 
                              ? parseFloat(e.target.value) || 0 
                              : e.target.value
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min={setting.type === 'number' ? 0 : undefined}
                          step={setting.key.includes('Percentage') || setting.key === 'withdrawalFee' ? 0.1 : 1}
                        />
                      )}
                      
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Advanced Settings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-orange-600" size={24} />
              <h2 className="text-lg font-semibold text-orange-800">
                Paramètres avancés
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Délai d'expiration des sessions (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                />
                <p className="text-xs text-gray-500">
                  Durée avant déconnexion automatique
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Limite de tentatives de connexion
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
                <p className="text-xs text-gray-500">
                  Nombre maximum de tentatives avant blocage
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email administrateur
                </label>
                <input
                  type="email"
                  defaultValue="admin@footballbet.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  Email pour les notifications importantes
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fuseau horaire
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                  <option value="Africa/Abidjan">Africa/Abidjan (UTC+0)</option>
                  <option value="America/Caracas">America/Caracas (UTC-4)</option>
                </select>
                <p className="text-xs text-gray-500">
                  Fuseau horaire pour l'affichage des dates
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};