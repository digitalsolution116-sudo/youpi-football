import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { TransactionManagement as TransactionType } from '../../types/admin';

export const TransactionManagement: React.FC = () => {
  const { transactions, updateTransaction, isLoading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.userPhone.includes(searchQuery) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = async (transactionId: string, newStatus: TransactionType['status']) => {
    await updateTransaction(transactionId, { status: newStatus });
  };

  const getTransactionIcon = (type: TransactionType['type']) => {
    switch (type) {
      case 'deposit':
      case 'bonus':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'withdrawal':
      case 'bet':
        return <TrendingDown className="text-red-500" size={20} />;
      case 'refund':
        return <RefreshCw className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TransactionType['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: TransactionType['type']) => {
    switch (type) {
      case 'deposit':
      case 'bonus':
        return 'text-green-600';
      case 'withdrawal':
      case 'bet':
        return 'text-red-600';
      case 'refund':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: TransactionType['type']) => {
    switch (type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'bet': return 'Pari';
      case 'refund': return 'Remboursement';
      case 'bonus': return 'Bonus';
      default: return type;
    }
  };

  const TransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Détails de la transaction</h2>
              <button 
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Transaction</label>
                  <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                    {selectedTransaction.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{selectedTransaction.userName}</div>
                    <div className="text-sm text-gray-600">{selectedTransaction.userPhone}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    {getTransactionIcon(selectedTransaction.type)}
                    <span className={`font-medium ${getTypeColor(selectedTransaction.type)}`}>
                      {getTypeLabel(selectedTransaction.type)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                  <div className={`p-3 bg-gray-50 rounded-lg font-bold text-lg ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount.toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={selectedTransaction.status}
                    onChange={(e) => handleStatusChange(selectedTransaction.id, e.target.value as TransactionType['status'])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="completed">Terminé</option>
                    <option value="failed">Échoué</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {selectedTransaction.paymentMethod || 'Non spécifié'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                  <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                    {selectedTransaction.reference || 'Aucune'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {selectedTransaction.createdAt.toLocaleDateString('fr-FR')} à {selectedTransaction.createdAt.toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {selectedTransaction.description}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes administrateur</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ajouter des notes..."
                defaultValue={selectedTransaction.notes}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate totals
  const totalDeposits = filteredTransactions
    .filter(t => (t.type === 'deposit' || t.type === 'bonus') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = filteredTransactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des transactions</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download size={16} />
          <span>Exporter</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total dépôts</p>
              <p className="text-2xl font-bold text-green-600">{totalDeposits.toLocaleString()} FCFA</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total retraits</p>
              <p className="text-2xl font-bold text-red-600">{totalWithdrawals.toLocaleString()} FCFA</p>
            </div>
            <TrendingDown className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par utilisateur, téléphone ou description..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
              <option value="bet">Paris</option>
              <option value="refund">Remboursements</option>
              <option value="bonus">Bonus</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminés</option>
              <option value="failed">Échoués</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {transaction.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                      <div className="text-sm text-gray-500">{transaction.userPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getTypeColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Terminé' : 
                       transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.createdAt.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowTransactionModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      {transaction.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(transaction.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(transaction.id, 'failed')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTransactionModal && <TransactionModal />}
    </div>
  );
};