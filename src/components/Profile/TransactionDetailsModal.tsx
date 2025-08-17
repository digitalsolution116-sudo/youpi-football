import React, { useState } from 'react';
import { X, ArrowUpRight, TrendingUp, TrendingDown, Calendar, Filter, Search, Eye, Download } from 'lucide-react';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransactionDetail {
  id: string;
  date: Date;
  type: 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_won' | 'bet_lost' | 'refund' | 'bonus' | 'referral' | 'investment_return';
  description: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'financial' | 'betting' | 'investment' | 'referral';
  details?: {
    matchName?: string;
    odds?: number;
    referralLevel?: number;
    investmentPlan?: string;
    paymentMethod?: string;
  };
}

const mockTransactions: TransactionDetail[] = [
  {
    id: '1',
    date: new Date('2024-08-12T14:30:00'),
    type: 'bet_won',
    description: 'Pari gagné - FC Porto vs Zuliano',
    amount: 105000,
    balanceBefore: 50000,
    balanceAfter: 155000,
    reference: 'BET-WIN-2024-001',
    status: 'completed',
    category: 'betting',
    details: {
      matchName: 'FC Porto Gaza vs Zuliano',
      odds: 2.1
    }
  },
  {
    id: '2',
    date: new Date('2024-08-12T10:15:00'),
    type: 'bet_placed',
    description: 'Pari placé - FC Porto vs Zuliano',
    amount: -50000,
    balanceBefore: 100000,
    balanceAfter: 50000,
    reference: 'BET-2024-001',
    status: 'completed',
    category: 'betting',
    details: {
      matchName: 'FC Porto Gaza vs Zuliano',
      odds: 2.1
    }
  },
  {
    id: '3',
    date: new Date('2024-08-11T16:45:00'),
    type: 'investment_return',
    description: 'Rendement quotidien - Plan Gold 3%',
    amount: 15000,
    balanceBefore: 85000,
    balanceAfter: 100000,
    reference: 'INV-RET-2024-001',
    status: 'completed',
    category: 'investment',
    details: {
      investmentPlan: 'Gold'
    }
  },
  {
    id: '4',
    date: new Date('2024-08-11T09:00:00'),
    type: 'deposit',
    description: 'Dépôt Mobile Money Orange',
    amount: 100000,
    balanceBefore: -15000,
    balanceAfter: 85000,
    reference: 'DEP-2024-001',
    status: 'completed',
    category: 'financial',
    details: {
      paymentMethod: 'Orange Money'
    }
  },
  {
    id: '5',
    date: new Date('2024-08-10T18:20:00'),
    type: 'referral',
    description: 'Commission parrainage - Niveau 1',
    amount: 15000,
    balanceBefore: -30000,
    balanceAfter: -15000,
    reference: 'REF-2024-001',
    status: 'completed',
    category: 'referral',
    details: {
      referralLevel: 1
    }
  },
  {
    id: '6',
    date: new Date('2024-08-10T12:30:00'),
    type: 'refund',
    description: 'Remboursement 80% - Match annulé',
    amount: 40000,
    balanceBefore: -70000,
    balanceAfter: -30000,
    reference: 'REF-2024-002',
    status: 'completed',
    category: 'betting'
  },
  {
    id: '7',
    date: new Date('2024-08-09T15:10:00'),
    type: 'withdrawal',
    description: 'Retrait vers MTN Money',
    amount: -75000,
    balanceBefore: 5000,
    balanceAfter: -70000,
    reference: 'WIT-2024-001',
    status: 'pending',
    category: 'financial',
    details: {
      paymentMethod: 'MTN Money'
    }
  }
];

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'financial' | 'betting' | 'investment' | 'referral'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  if (!isOpen) return null;

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getTypeIcon = (type: TransactionDetail['type']) => {
    switch (type) {
      case 'deposit':
      case 'bet_won':
      case 'refund':
      case 'bonus':
      case 'referral':
      case 'investment_return':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'withdrawal':
      case 'bet_placed':
      case 'bet_lost':
        return <TrendingDown className="text-red-500" size={20} />;
      default:
        return <ArrowUpRight className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: TransactionDetail['type']) => {
    switch (type) {
      case 'deposit':
      case 'bet_won':
      case 'refund':
      case 'bonus':
      case 'referral':
      case 'investment_return':
        return 'text-green-600';
      case 'withdrawal':
      case 'bet_placed':
      case 'bet_lost':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: TransactionDetail['type']) => {
    const labels = {
      deposit: 'Dépôt',
      withdrawal: 'Retrait',
      bet_placed: 'Pari placé',
      bet_won: 'Pari gagné',
      bet_lost: 'Pari perdu',
      refund: 'Remboursement',
      bonus: 'Bonus',
      referral: 'Parrainage',
      investment_return: 'Rendement'
    };
    return labels[type];
  };

  const getCategoryColor = (category: TransactionDetail['category']) => {
    switch (category) {
      case 'financial': return 'text-blue-600 bg-blue-100';
      case 'betting': return 'text-purple-600 bg-purple-100';
      case 'investment': return 'text-green-600 bg-green-100';
      case 'referral': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryLabel = (category: TransactionDetail['category']) => {
    const labels = {
      financial: 'Financier',
      betting: 'Paris',
      investment: 'Investissement',
      referral: 'Parrainage'
    };
    return labels[category];
  };

  const getStatusColor = (status: TransactionDetail['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculs des totaux
  const totalIn = filteredTransactions
    .filter(t => t.amount > 0 && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOut = filteredTransactions
    .filter(t => t.amount < 0 && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <ArrowUpRight className="text-blue-600" size={28} />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Détails des transactions</h2>
                <p className="text-sm sm:text-base text-gray-600">Analyse complète de vos mouvements financiers</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Résumé */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Entrées totales</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    +{totalIn.toLocaleString()} FCFA
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Sorties totales</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">
                    -{totalOut.toLocaleString()} FCFA
                  </p>
                </div>
                <TrendingDown className="text-red-500" size={32} />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Transactions</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {filteredTransactions.length}
                  </p>
                </div>
                <ArrowUpRight className="text-blue-500" size={32} />
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par description ou référence..."
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="financial">Financier</option>
                  <option value="betting">Paris</option>
                  <option value="investment">Investissement</option>
                  <option value="referral">Parrainage</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tous statuts</option>
                  <option value="completed">Terminé</option>
                  <option value="pending">En attente</option>
                  <option value="failed">Échoué</option>
                </select>

                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Download size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Liste des transactions */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    {getTypeIcon(transaction.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{transaction.description}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                          {getCategoryLabel(transaction.category)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500 mb-2">
                        <span className="font-mono">{transaction.reference}</span>
                        <span>{transaction.date.toLocaleDateString('fr-FR')} à {transaction.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' ? 'Terminé' : 
                           transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </div>
                      
                      {/* Détails spécifiques */}
                      {transaction.details && (
                        <div className="bg-gray-50 p-3 rounded-lg text-xs sm:text-sm">
                          {transaction.details.matchName && (
                            <p><strong>Match:</strong> {transaction.details.matchName}</p>
                          )}
                          {transaction.details.odds && (
                            <p><strong>Cote:</strong> {transaction.details.odds}x</p>
                          )}
                          {transaction.details.referralLevel && (
                            <p><strong>Niveau:</strong> {transaction.details.referralLevel}</p>
                          )}
                          {transaction.details.investmentPlan && (
                            <p><strong>Plan:</strong> {transaction.details.investmentPlan}</p>
                          )}
                          {transaction.details.paymentMethod && (
                            <p><strong>Méthode:</strong> {transaction.details.paymentMethod}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`font-bold text-lg sm:text-xl ${getTypeColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      Solde: {transaction.balanceAfter.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                {/* Évolution du solde */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">
                      Avant: {transaction.balanceBefore.toLocaleString()} FCFA
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-800 font-medium">
                      Après: {transaction.balanceAfter.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <ArrowUpRight size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune transaction</h3>
              <p className="text-gray-400">Aucune transaction trouvée avec ces critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};