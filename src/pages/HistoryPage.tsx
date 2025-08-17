import React, { useState, useEffect } from 'react';
import { Calendar, Filter, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { Transaction } from '../types';
import { transactionService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';


export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposits' | 'withdrawals' | 'bets' | 'refunds'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user, activeFilter]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const transactionsData = await transactionService.getUserTransactions(
        user.id, 
        activeFilter === 'all' ? undefined : activeFilter
      );
      
      const formattedTransactions: Transaction[] = transactionsData.map(transaction => ({
        id: transaction.id,
        userId: transaction.user_id,
        type: transaction.type as 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus',
        amount: transaction.amount,
        status: transaction.status as 'pending' | 'completed' | 'failed',
        createdAt: new Date(transaction.created_at),
        description: transaction.description
      }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { key: 'all' as const, label: 'Tout' },
    { key: 'deposits' as const, label: 'Dépôts' },
    { key: 'withdrawals' as const, label: 'Retraits' },
    { key: 'bets' as const, label: 'Paris' },
    { key: 'refunds' as const, label: 'Remboursements' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'deposits') return transaction.type === 'deposit' || transaction.type === 'bonus';
    if (activeFilter === 'withdrawals') return transaction.type === 'withdrawal';
    if (activeFilter === 'bets') return transaction.type === 'bet';
    if (activeFilter === 'refunds') return transaction.type === 'refund';
    return true;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
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

  const getTransactionColor = (type: Transaction['type']) => {
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

  const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getTransactionIcon(transaction.type)}
          <div>
            <div className="font-medium text-gray-800">{transaction.description}</div>
            <div className="text-sm text-gray-500">
              {transaction.createdAt.toLocaleDateString('fr-FR')} à {transaction.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            transaction.status === 'completed' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-yellow-100 text-yellow-600'
          }`}>
            {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
          </div>
        </div>
      </div>
    </div>
  );

  // Calculate totals
  const totalDeposits = transactions
    .filter(t => (t.type === 'deposit' || t.type === 'bonus') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalRefunds = transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Historique" />
      
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl">
            <div className="text-xs opacity-90 mb-1">Dépôts</div>
            <div className="text-lg font-bold">{totalDeposits.toLocaleString()}</div>
            <div className="text-xs opacity-75">FCFA</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl">
            <div className="text-xs opacity-90 mb-1">Retraits</div>
            <div className="text-lg font-bold">{totalWithdrawals.toLocaleString()}</div>
            <div className="text-xs opacity-75">FCFA</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl">
            <div className="text-xs opacity-90 mb-1">Remboursés</div>
            <div className="text-lg font-bold">{totalRefunds.toLocaleString()}</div>
            <div className="text-xs opacity-75">FCFA</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Aucune transaction</div>
              <div className="text-gray-500 text-sm">
                Aucune transaction trouvée pour ce filtre
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};