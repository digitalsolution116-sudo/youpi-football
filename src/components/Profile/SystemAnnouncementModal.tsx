import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Info, CheckCircle, Star, Calendar, Filter } from 'lucide-react';

interface SystemAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Announcement {
  id: string;
  type: 'maintenance' | 'update' | 'promotion' | 'warning' | 'info';
  title: string;
  content: string;
  date: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  category: 'system' | 'promotion' | 'security' | 'feature';
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    type: 'maintenance',
    title: 'Maintenance programmée',
    content: 'Une maintenance technique aura lieu le dimanche 18 août de 2h à 4h du matin. Les services seront temporairement indisponibles pendant cette période.',
    date: new Date('2024-08-15T10:00:00'),
    priority: 'high',
    read: false,
    category: 'system'
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Nouveau bonus de bienvenue',
    content: 'Profitez de notre nouveau bonus de bienvenue de 100% sur votre premier dépôt ! Offre valable jusqu\'au 31 août 2024.',
    date: new Date('2024-08-12T14:30:00'),
    priority: 'medium',
    read: false,
    category: 'promotion'
  },
  {
    id: '3',
    type: 'update',
    title: 'Nouvelles cryptomonnaies disponibles',
    content: 'Nous avons ajouté le support pour DOGE et COREDAO. Vous pouvez maintenant effectuer des dépôts et retraits avec ces cryptomonnaies.',
    date: new Date('2024-08-10T16:45:00'),
    priority: 'medium',
    read: true,
    category: 'feature'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Sécurité renforcée',
    content: 'Pour votre sécurité, nous avons renforcé nos mesures d\'authentification. Pensez à activer l\'authentification à deux facteurs.',
    date: new Date('2024-08-08T09:15:00'),
    priority: 'high',
    read: true,
    category: 'security'
  },
  {
    id: '5',
    type: 'info',
    title: 'Nouveau programme VIP',
    content: 'Découvrez notre nouveau programme VIP à 7 niveaux avec des bonus exclusifs et des avantages premium pour nos joueurs les plus fidèles.',
    date: new Date('2024-08-05T11:20:00'),
    priority: 'low',
    read: true,
    category: 'feature'
  },
  {
    id: '6',
    type: 'promotion',
    title: 'Tournoi de paris spécial',
    content: 'Participez à notre tournoi de paris du mois d\'août ! Les 100 meilleurs joueurs remporteront des prix allant jusqu\'à 500 000 FCFA.',
    date: new Date('2024-08-01T08:00:00'),
    priority: 'medium',
    read: true,
    category: 'promotion'
  }
];

export const SystemAnnouncementModal: React.FC<SystemAnnouncementModalProps> = ({ isOpen, onClose }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'system' | 'promotion' | 'security' | 'feature'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');

  if (!isOpen) return null;

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    return matchesCategory && matchesPriority;
  });

  const unreadCount = announcements.filter(a => !a.read).length;

  const getAnnouncementIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'maintenance': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'update': return <CheckCircle className="text-blue-500" size={20} />;
      case 'promotion': return <Star className="text-purple-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-red-500" size={20} />;
      case 'info': return <Info className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'system': return 'text-blue-600 bg-blue-100';
      case 'promotion': return 'text-purple-600 bg-purple-100';
      case 'security': return 'text-red-600 bg-red-100';
      case 'feature': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: Announcement['priority']) => {
    const labels = {
      urgent: 'Urgent',
      high: 'Élevée',
      medium: 'Moyenne',
      low: 'Faible'
    };
    return labels[priority];
  };

  const getCategoryLabel = (category: Announcement['category']) => {
    const labels = {
      system: 'Système',
      promotion: 'Promotion',
      security: 'Sécurité',
      feature: 'Fonctionnalité'
    };
    return labels[category];
  };

  const markAsRead = (id: string) => {
    setAnnouncements(prev => 
      prev.map(a => a.id === id ? { ...a, read: true } : a)
    );
  };

  const markAllAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="text-yellow-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Annonces système</h2>
                <p className="text-gray-600">
                  Restez informé des dernières actualités
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      {unreadCount} non lues
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Actions rapides */}
          {unreadCount > 0 && (
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="text-blue-600" size={20} />
                  <span className="text-blue-800 font-medium">
                    Vous avez {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} annonce{unreadCount > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                <option value="system">Système</option>
                <option value="promotion">Promotions</option>
                <option value="security">Sécurité</option>
                <option value="feature">Fonctionnalités</option>
              </select>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>

          {/* Liste des annonces */}
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`border-2 rounded-xl p-6 transition-all hover:shadow-md ${
                  !announcement.read 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getAnnouncementIcon(announcement.type)}
                    <div>
                      <h3 className={`font-bold text-lg ${
                        !announcement.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {announcement.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {announcement.date.toLocaleDateString('fr-FR')} à {announcement.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(announcement.category)}`}>
                      {getCategoryLabel(announcement.category)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(announcement.priority)}`}>
                      {getPriorityLabel(announcement.priority)}
                    </span>
                    {!announcement.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {announcement.content}
                </p>

                {!announcement.read && (
                  <button
                    onClick={() => markAsRead(announcement.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune annonce</h3>
              <p className="text-gray-400">Aucune annonce trouvée avec ces filtres</p>
            </div>
          )}

          {/* Paramètres de notification */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-4">Paramètres de notification</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Notifications push</span>
                  <p className="text-sm text-gray-600">Recevoir les annonces importantes</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Notifications email</span>
                  <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire</p>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Promotions</span>
                  <p className="text-sm text-gray-600">Recevoir les offres spéciales</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};