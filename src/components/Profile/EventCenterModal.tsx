import React, { useState } from 'react';
import { X, Star, Calendar, Trophy, Gift, Clock, Users, Target, Award, Zap } from 'lucide-react';

interface EventCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  reward: number;
  progress: number;
  maxProgress: number;
  status: 'active' | 'completed' | 'locked';
  endDate: Date;
  icon: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Connexion quotidienne',
    description: 'Connectez-vous chaque jour pour gagner des bonus',
    type: 'daily',
    reward: 1000,
    progress: 5,
    maxProgress: 7,
    status: 'active',
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    icon: '📅'
  },
  {
    id: '2',
    title: 'Paris de la semaine',
    description: 'Placez 10 paris cette semaine',
    type: 'weekly',
    reward: 15000,
    progress: 7,
    maxProgress: 10,
    status: 'active',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    icon: '⚽'
  },
  {
    id: '3',
    title: 'Défi mensuel',
    description: 'Atteignez 500k FCFA de mises ce mois',
    type: 'monthly',
    reward: 50000,
    progress: 320000,
    maxProgress: 500000,
    status: 'active',
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    icon: '🎯'
  },
  {
    id: '4',
    title: 'Événement spécial',
    description: 'Tournoi de paris - Classement top 100',
    type: 'special',
    reward: 100000,
    progress: 45,
    maxProgress: 100,
    status: 'active',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    icon: '🏆'
  },
  {
    id: '5',
    title: 'Parrainage champion',
    description: 'Invitez 5 amis actifs',
    type: 'special',
    reward: 25000,
    progress: 3,
    maxProgress: 5,
    status: 'active',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    icon: '👥'
  },
  {
    id: '6',
    title: 'Série de victoires',
    description: 'Gagnez 5 paris consécutifs',
    type: 'weekly',
    reward: 20000,
    progress: 5,
    maxProgress: 5,
    status: 'completed',
    endDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: '🔥'
  }
];

export const EventCenterModal: React.FC<EventCenterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'special'>('all');

  if (!isOpen) return null;

  const filteredEvents = mockEvents.filter(event => 
    activeTab === 'all' || event.type === activeTab
  );

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'daily': return 'from-blue-500 to-blue-600';
      case 'weekly': return 'from-green-500 to-green-600';
      case 'monthly': return 'from-purple-500 to-purple-600';
      case 'special': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'locked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return 'Expiré';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  };

  const tabs = [
    { key: 'all' as const, label: 'Tout', count: mockEvents.length },
    { key: 'daily' as const, label: 'Quotidien', count: mockEvents.filter(e => e.type === 'daily').length },
    { key: 'weekly' as const, label: 'Hebdo', count: mockEvents.filter(e => e.type === 'weekly').length },
    { key: 'monthly' as const, label: 'Mensuel', count: mockEvents.filter(e => e.type === 'monthly').length },
    { key: 'special' as const, label: 'Spécial', count: mockEvents.filter(e => e.type === 'special').length },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Star className="text-yellow-500" size={28} />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Centre des événements</h2>
                <p className="text-sm sm:text-base text-gray-600">Participez aux défis et gagnez des récompenses</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl text-center">
              <Trophy className="text-blue-600 mx-auto mb-2" size={20} />
              <div className="text-lg sm:text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs sm:text-sm text-blue-700">Défis terminés</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-xl text-center">
              <Gift className="text-green-600 mx-auto mb-2" size={20} />
              <div className="text-lg sm:text-2xl font-bold text-green-600">185k</div>
              <div className="text-xs sm:text-sm text-green-700">FCFA gagnés</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl text-center">
              <Zap className="text-purple-600 mx-auto mb-2" size={20} />
              <div className="text-lg sm:text-2xl font-bold text-purple-600">5</div>
              <div className="text-xs sm:text-sm text-purple-700">Série actuelle</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl text-center">
              <Award className="text-orange-600 mx-auto mb-2" size={20} />
              <div className="text-lg sm:text-2xl font-bold text-orange-600">Gold</div>
              <div className="text-xs sm:text-sm text-orange-700">Rang actuel</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <span>{tab.label}</span>
                  <span className={`text-xs px-1 sm:px-2 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className={`bg-gradient-to-r ${getEventColor(event.type)} p-1 rounded-xl`}>
                <div className="bg-white rounded-lg p-4 sm:p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl sm:text-3xl">{event.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{event.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                      {event.status === 'active' ? 'Actif' : 
                       event.status === 'completed' ? 'Terminé' : 'Verrouillé'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Progression</span>
                      <span>
                        {event.type === 'monthly' 
                          ? `${event.progress.toLocaleString()} / ${event.maxProgress.toLocaleString()}`
                          : `${event.progress} / ${event.maxProgress}`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className={`bg-gradient-to-r ${getEventColor(event.type)} h-2 sm:h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min((event.progress / event.maxProgress) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className="text-green-600" size={16} />
                      <span className="font-bold text-green-600 text-sm sm:text-base">
                        {event.reward.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatTimeRemaining(event.endDate)}</span>
                    </div>
                  </div>

                  {event.status === 'completed' && (
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold text-sm">
                      ✅ Récompense réclamée
                    </button>
                  )}
                  
                  {event.status === 'active' && event.progress >= event.maxProgress && (
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700">
                      🎁 Réclamer la récompense
                    </button>
                  )}
                  
                  {event.status === 'active' && event.progress < event.maxProgress && (
                    <button className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-gray-700">
                      🎯 Continuer le défi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Règles */}
          <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center">
              <Target className="mr-2" size={20} />
              Comment participer aux événements ?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
              <div>
                <h5 className="font-semibold mb-2">📋 Règles générales :</h5>
                <ul className="space-y-1">
                  <li>• Connectez-vous quotidiennement</li>
                  <li>• Participez activement aux paris</li>
                  <li>• Invitez vos amis</li>
                  <li>• Respectez les conditions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">🎁 Récompenses :</h5>
                <ul className="space-y-1">
                  <li>• Bonus en FCFA</li>
                  <li>• Points VIP</li>
                  <li>• Accès privilèges</li>
                  <li>• Cadeaux exclusifs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};