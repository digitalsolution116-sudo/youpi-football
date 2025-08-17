import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter, Eye } from 'lucide-react';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StatementEntry {
  id: string;
  date: Date;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'refund' | 'bonus' | 'referral';
  description: string;
  amount: number;
  balance: number;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockStatements: StatementEntry[] = [
  {
    id: '1',
    date: new Date('2024-08-12T14:30:00'),
    type: 'win',
    description: 'Pari gagné - FC Porto vs Zuliano',
    amount: 105000,
    balance: 155000,
    reference: 'WIN-2024-001',
    status: 'completed'
  },
  {
    id: '2',
    date: new Date('2024-08-12T10:15:00'),
    type: 'bet',
    description: 'Pari placé - FC Porto vs Zuliano',
    amount: -50000,
    balance: 50000,
    reference: 'BET-2024-001',
    status: 'completed'
  },
  {
    id: '3',
    date: new Date('2024-08-11T16:45:00'),
    type: 'refund',
    description: 'Remboursement 80% - Match annulé',
    amount: 40000,
    balance: 100000,
    reference: 'REF-2024-001',
    status: 'completed'
  },
  {
    id: '4',
    date: new Date('2024-08-11T09:00:00'),
    type: 'deposit',
    description: 'Dépôt Mobile Money',
    amount: 100000,
    balance: 60000,
    reference: 'DEP-2024-001',
    status: 'completed'
  },
  {
    id: '5',
    date: new Date('2024-08-10T18:20:00'),
    type: 'bonus',
    description: 'Bonus de parrainage - Niveau 1',
    amount: 15000,
    balance: -40000,
    reference: 'BON-2024-001',
    status: 'completed'
  },
  {
    id: '6',
    date: new Date('2024-08-10T12:30:00'),
    type: 'withdrawal',
    description: 'Retrait vers Mobile Money',
    amount: -75000,
    balance: -55000,
    reference: 'WIT-2024-001',
    status: 'pending'
  }
];

export const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedType, setSelectedType] = useState<'all' | 'deposit' | 'withdrawal' | 'bet' | 'win' | 'refund' | 'bonus'>('all');

  if (!isOpen) return null;

  const filteredStatements = mockStatements.filter(statement => {
    const now = new Date();
    const statementDate = statement.date;
    
    let dateMatch = true;
    if (selectedPeriod === '7d') {
      dateMatch = statementDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (selectedPeriod === '30d') {
      dateMatch = statementDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (selectedPeriod === '90d') {
      dateMatch = statementDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const typeMatch = selectedType === 'all' || statement.type === selectedType;
    
    return dateMatch && typeMatch;
  });

  const getTypeIcon = (type: StatementEntry['type']) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'bonus':
      case 'refund':
      case 'referral':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'withdrawal':
      case 'bet':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <BarChart3 className="text-gray-500" size={16} />;
    }
  };

  const getTypeColor = (type: StatementEntry['type']) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'bonus':
      case 'refund':
      case 'referral':
        return 'text-green-600';
      case 'withdrawal':
      case 'bet':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: StatementEntry['type']) => {
    const labels = {
      deposit: 'Dépôt',
      withdrawal: 'Retrait',
      bet: 'Pari',
      win: 'Gain',
      refund: 'Remboursement',
      bonus: 'Bonus',
      referral: 'Parrainage'
    };
    return labels[type];
  };

  const getStatusColor = (status: StatementEntry['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculs des totaux
  const totalIn = filteredStatements
    .filter(s => s.amount > 0 && s.status === 'completed')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const totalOut = filteredStatements
    .filter(s => s.amount < 0 && s.status === 'completed')
    .reduce((sum, s) => sum + Math.abs(s.amount), 0);
  
  const netAmount = totalIn - totalOut;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-blue-600" size={28} />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Relevé de compte</h2>
                <p className="text-sm sm:text-base text-gray-600">Historique détaillé de vos transactions</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Résumé financier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total entrant</p>
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
                  <p className="text-sm text-red-700">Total sortant</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">
                    -{totalOut.toLocaleString()} FCFA
                  </p>
                </div>
                <TrendingDown className="text-red-500" size={32} />
              </div>
            </div>

            <div className={`bg-gradient-to-r ${netAmount >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} p-4 sm:p-6 rounded-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Solde net</p>
                  <p className={`text-xl sm:text-2xl font-bold ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netAmount >= 0 ? '+' : ''}{netAmount.toLocaleString()} FCFA
                  </p>
                </div>
                <BarChart3 className={`${netAmount >= 0 ? 'text-blue-500' : 'text-orange-500'}`} size={32} />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                  <option value="all">Tout l'historique</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="deposit">Dépôts</option>
                  <option value="withdrawal">Retraits</option>
                  <option value="bet">Paris</option>
                  <option value="win">Gains</option>
                  <option value="refund">Remboursements</option>
                  <option value="bonus">Bonus</option>
                </select>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <Download size={16} />
                <span>Exporter PDF</span>
              </button>
            </div>
          </div>

          {/* Liste des transactions */}
          <div className="space-y-3">
            {filteredStatements.map((statement) => (
              <div key={statement.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getTypeIcon(statement.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {statement.description}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(statement.status)}`}>
                          {statement.status === 'completed' ? 'Terminé' : 
                           statement.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>{statement.date.toLocaleDateString('fr-FR')} à {statement.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-medium">{getTypeLabel(statement.type)}</span>
                        {statement.reference && (
                          <span className="font-mono">{statement.reference}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`font-bold text-sm sm:text-lg ${getTypeColor(statement.type)}`}>
                      {statement.amount > 0 ? '+' : ''}{statement.amount.toLocaleString()} FCFA
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Solde: {statement.balance.toLocaleString()} FCFA
                    </div>
                  </div>
                  
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStatements.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune transaction</h3>
              <p className="text-gray-400">Aucune transaction trouvée pour cette période</p>
            </div>
          )}

          {/* Informations légales */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">📋 Informations importantes</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Ce relevé est généré en temps réel et certifié conforme</p>
              <p>• Toutes les transactions sont sécurisées et traçables</p>
              <p>• En cas de litige, contactez notre support client</p>
              <p>• Conservation des données : 5 ans selon la réglementation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};