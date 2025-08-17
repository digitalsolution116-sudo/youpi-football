import React, { useState } from 'react';
import { X, Shield, Lock, Eye, EyeOff, Smartphone, Mail, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  icon: React.ComponentType<any>;
  action: string;
}

const securitySettings: SecuritySetting[] = [
  {
    id: 'password',
    title: 'Mot de passe',
    description: 'Dernière modification il y a 15 jours',
    status: 'active',
    icon: Lock,
    action: 'Modifier'
  },
  {
    id: '2fa',
    title: 'Authentification à deux facteurs',
    description: 'Protection renforcée avec SMS',
    status: 'active',
    icon: Smartphone,
    action: 'Gérer'
  },
  {
    id: 'email',
    title: 'Email de sécurité',
    description: 'arthur@example.com - Vérifié',
    status: 'active',
    icon: Mail,
    action: 'Modifier'
  },
  {
    id: 'sessions',
    title: 'Sessions actives',
    description: '3 appareils connectés',
    status: 'active',
    icon: Eye,
    action: 'Voir tout'
  },
  {
    id: 'backup',
    title: 'Codes de récupération',
    description: 'Codes de sauvegarde non générés',
    status: 'inactive',
    icon: Key,
    action: 'Générer'
  }
];

interface SecurityLog {
  id: string;
  action: string;
  device: string;
  location: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

const securityLogs: SecurityLog[] = [
  {
    id: '1',
    action: 'Connexion réussie',
    device: 'iPhone 14 Pro',
    location: 'Abidjan, Côte d\'Ivoire',
    timestamp: new Date(),
    status: 'success'
  },
  {
    id: '2',
    action: 'Retrait effectué',
    device: 'Chrome sur Windows',
    location: 'Abidjan, Côte d\'Ivoire',
    timestamp: new Date(Date.now() - 3600000),
    status: 'success'
  },
  {
    id: '3',
    action: 'Tentative de connexion échouée',
    device: 'Appareil inconnu',
    location: 'Lagos, Nigeria',
    timestamp: new Date(Date.now() - 7200000),
    status: 'warning'
  },
  {
    id: '4',
    action: 'Mot de passe modifié',
    device: 'Safari sur iPhone',
    location: 'Abidjan, Côte d\'Ivoire',
    timestamp: new Date(Date.now() - 86400000 * 15),
    status: 'success'
  }
];

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'privacy'>('settings');
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  if (!isOpen) return null;

  const getStatusColor = (status: SecuritySetting['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogStatusColor = (status: SecurityLog['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLogStatusIcon = (status: SecurityLog['status']) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'error': return <X size={16} className="text-red-600" />;
      default: return <Eye size={16} className="text-gray-600" />;
    }
  };

  const recoveryCodes = [
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0',
    'E1F2-G3H4-I5J6',
    'K7L8-M9N0-O1P2',
    'Q3R4-S5T6-U7V8'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="text-red-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Centre de sécurité</h2>
                <p className="text-gray-600">Protégez votre compte et vos fonds</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Score de sécurité */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Score de sécurité</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-green-600">85/100</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Très bon niveau de sécurité</p>
                  </div>
                </div>
              </div>
              <Shield className="text-green-500" size={48} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
            {[
              { key: 'settings' as const, label: 'Paramètres', icon: Shield },
              { key: 'logs' as const, label: 'Journaux', icon: Eye },
              { key: 'privacy' as const, label: 'Confidentialité', icon: Lock }
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

          {/* Paramètres de sécurité */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {securitySettings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <Icon className="text-gray-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                          <p className="text-sm text-gray-600">{setting.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(setting.status)}`}>
                          {setting.status === 'active' ? 'Actif' : 
                           setting.status === 'inactive' ? 'Inactif' : 'En attente'}
                        </span>
                        <button 
                          onClick={() => {
                            if (setting.id === 'backup') {
                              setShowRecoveryCodes(true);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          {setting.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Codes de récupération */}
              {showRecoveryCodes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-yellow-800">Codes de récupération</h4>
                    <button
                      onClick={() => setShowRecoveryCodes(false)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <EyeOff size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {recoveryCodes.map((code, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-yellow-200">
                        <code className="text-sm font-mono text-gray-800">{code}</code>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Sauvegardez ces codes dans un endroit sûr. Ils vous permettront de récupérer votre compte si vous perdez l'accès à votre téléphone.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Journaux de sécurité */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
              
              {securityLogs.map((log) => (
                <div key={log.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getLogStatusIcon(log.status)}
                      <div>
                        <h4 className="font-medium text-gray-800">{log.action}</h4>
                        <div className="text-sm text-gray-600">
                          {log.device} • {log.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {log.timestamp.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confidentialité */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Paramètres de confidentialité</h3>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Profil public</h4>
                      <p className="text-sm text-gray-600">Permettre aux autres utilisateurs de voir votre profil</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Statistiques publiques</h4>
                      <p className="text-sm text-gray-600">Afficher vos statistiques de paris dans les classements</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Notifications marketing</h4>
                      <p className="text-sm text-gray-600">Recevoir des offres promotionnelles par email</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-800 mb-4">Zone de danger</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <div className="font-medium text-red-800">Exporter mes données</div>
                    <div className="text-sm text-red-600">Télécharger toutes vos données personnelles</div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <div className="font-medium text-red-800">Supprimer mon compte</div>
                    <div className="text-sm text-red-600">Suppression définitive de votre compte</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Conseils de sécurité */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Shield className="mr-2" size={20} />
              Conseils de sécurité
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-semibold mb-2">🔒 Bonnes pratiques :</h5>
                <ul className="space-y-1">
                  <li>• Utilisez un mot de passe unique et fort</li>
                  <li>• Activez l'authentification à deux facteurs</li>
                  <li>• Ne partagez jamais vos identifiants</li>
                  <li>• Vérifiez régulièrement vos sessions actives</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">⚠️ Signaux d'alerte :</h5>
                <ul className="space-y-1">
                  <li>• Connexions depuis des lieux inhabituels</li>
                  <li>• Emails de sécurité non sollicités</li>
                  <li>• Modifications non autorisées</li>
                  <li>• Activité suspecte sur votre compte</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};