import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, XCircle, Truck, Eye, Filter, Calendar } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  type: 'investment' | 'withdrawal' | 'bonus' | 'vip_upgrade';
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  reference: string;
  details?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    type: 'investment',
    title: 'Plan d\'investissement Gold',
    description: 'Activation du plan Gold - 3% par jour',
    amount: 500000,
    status: 'completed',
    createdAt: new Date('2024-08-10T09:00:00'),
    completedAt: new Date('2024-08-10T09:15:00'),
    reference: 'INV-2024-001',
    details: 'Plan activé avec succès. Rendements quotidiens de 3% activés.'
  },
  {
    id: '2',
    type: 'withdrawal',
    title: 'Demande de retrait',
    description: 'Retrait vers Mobile Money Orange',
    amount: 150000,
    status: 'processing',
    createdAt: new Date('2024-08-11T14:30:00'),
    reference: 'WIT-2024-002',
    details: 'Traitement en cours. Délai estimé: 24h'
  },
  {
    id: '3',
    type: 'vip_upgrade',
    title: 'Upgrade VIP 3',
    description: 'Passage au niveau VIP 3',
    amount: 0,
    status: 'pending',
    createdAt: new Date('2024-08-12T10:15:00'),
    reference: 'VIP-2024-003',
    details: 'En attente de validation des critères'
  },
  {
    id: '4',
    type: 'bonus',
    title: 'Bonus de parrainage',
    description: 'Commission niveau 1 - 5 nouveaux filleuls',
    amount: 45000,
    status: 'completed',
    createdAt: new Date('2024-08-09T16:45:00'),
    completedAt: new Date('2024-08-09T16:50:00'),
    reference: 'BON-2024-004',
    details: 'Bonus crédité automatiquement'
  },
  {
    id: '5',
    type: 'investment',
    title: 'Plan d\'investissement Basic',
    description: 'Activation du plan Basic - 1.5% par jour',
    amount: 50000,
    status: 'failed',
    createdAt: new Date('2024-08-08T11:20:00'),
    reference: 'INV-2024-005',
    details: 'Échec: Solde insuffisant au moment de l\'activation'
  },
  {
    id: '6',
    type: 'withdrawal',
    title: 'Demande de retrait',
    description: 'Retrait vers MTN Money',
    amount: 75000,
    status: 'cancelled',
    createdAt: new Date('2024-08-07T13:10:00'),
    reference: 'WIT-2024-006',
    details: 'Annulé par l\'utilisateur'
  }
];

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'investment' | 'withdrawal' | 'bonus' | 'vip_upgrade'>('all');

  if (!isOpen) return null;

  const filteredOrders = mockOrders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const typeMatch = typeFilter === 'all' || order.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'processing': return <Truck className="text-blue-500" size={20} />;
      case 'completed': return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled': return <XCircle className="text-gray-500" size={20} />;
      case 'failed': return <XCircle className="text-red-500" size={20} />;
      default: return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      failed: 'Échoué'
    };
    return labels[status];
  };

  const getTypeIcon = (type: Order['type']) => {
    switch (type) {
      case 'investment': return '💎';
      case 'withdrawal': return '💸';
      case 'bonus': return '🎁';
      case 'vip_upgrade': return '👑';
      default: return '📦';
    }
  };

  const getTypeLabel = (type: Order['type']) => {
    const labels = {
      investment: 'Investissement',
      withdrawal: 'Retrait',
      bonus: 'Bonus',
      vip_upgrade: 'Upgrade VIP'
    };
    return labels[type];
  };

  const getTypeColor = (type: Order['type']) => {
    switch (type) {
      case 'investment': return 'text-purple-600 bg-purple-100';
      case 'withdrawal': return 'text-red-600 bg-red-100';
      case 'bonus': return 'text-green-600 bg-green-100';
      case 'vip_upgrade': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Statistiques
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalAmount = filteredOrders
    .filter(o => o.status === 'completed' && o.type !== 'withdrawal')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Package className="text-blue-600" size={28} />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mes Commandes</h2>
                <p className="text-sm sm:text-base text-gray-600">Historique de vos demandes et transactions</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <Package className="text-blue-600 mx-auto mb-2" size={24} />
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalOrders}</div>
              <div className="text-xs sm:text-sm text-blue-700">Total commandes</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl text-center">
              <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
              <div className="text-xl sm:text-2xl font-bold text-green-600">{completedOrders}</div>
              <div className="text-xs sm:text-sm text-green-700">Terminées</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl text-center">
              <Clock className="text-yellow-600 mx-auto mb-2" size={24} />
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingOrders}</div>
              <div className="text-xs sm:text-sm text-yellow-700">En cours</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <div className="text-2xl mx-auto mb-2">💰</div>
              <div className="text-lg sm:text-xl font-bold text-purple-600">{totalAmount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-purple-700">FCFA traités</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="completed">Terminés</option>
                  <option value="cancelled">Annulés</option>
                  <option value="failed">Échoués</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Package size={20} className="text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="investment">Investissements</option>
                  <option value="withdrawal">Retraits</option>
                  <option value="bonus">Bonus</option>
                  <option value="vip_upgrade">Upgrades VIP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des commandes */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl sm:text-3xl">{getTypeIcon(order.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{order.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(order.type)}`}>
                          {getTypeLabel(order.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{order.description}</p>
                      <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>#{order.reference}</span>
                        <span>{order.createdAt.toLocaleDateString('fr-FR')} à {order.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(order.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    {order.amount > 0 && (
                      <div className="font-bold text-sm sm:text-lg text-gray-800">
                        {order.type === 'withdrawal' ? '-' : '+'}{order.amount.toLocaleString()} FCFA
                      </div>
                    )}
                  </div>
                </div>

                {order.details && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">{order.details}</p>
                  </div>
                )}

                {order.completedAt && (
                  <div className="text-xs text-gray-500 border-t pt-3">
                    Terminé le {order.completedAt.toLocaleDateString('fr-FR')} à {order.completedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button className="text-xs sm:text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                        Annuler
                      </button>
                    )}
                    {order.status === 'failed' && (
                      <button className="text-xs sm:text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        Réessayer
                      </button>
                    )}
                  </div>
                  <button className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700">
                    <Eye size={14} />
                    <span>Détails</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune commande</h3>
              <p className="text-gray-400">Aucune commande trouvée avec ces filtres</p>
            </div>
          )}

          {/* Aide */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Besoin d'aide ?</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>En attente</strong> : Votre demande est en file d'attente</p>
              <p>• <strong>En cours</strong> : Traitement en cours par nos équipes</p>
              <p>• <strong>Terminé</strong> : Commande traitée avec succès</p>
              <p>• Pour toute question, contactez notre support 24h/7j</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};