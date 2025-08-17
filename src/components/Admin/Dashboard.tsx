import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

export const Dashboard: React.FC = () => {
  const { stats, refreshData, isLoading } = useAdmin();

  if (!stats) return null;

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Utilisateurs actifs',
      value: stats.activeUsers.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Revenus totaux',
      value: `${stats.totalRevenue.toLocaleString()} FCFA`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Paris aujourd\'hui',
      value: stats.todayBets.toLocaleString(),
      change: '-3%',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.changeType === 'positive' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenus des 7 derniers jours</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 78, 52, 89, 67, 95].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h2>
          <div className="space-y-4">
            {[
              { user: 'User123', action: 'Nouveau pari placé', amount: '50,000 FCFA', time: '2 min' },
              { user: 'BetMaster', action: 'Retrait demandé', amount: '75,000 FCFA', time: '5 min' },
              { user: 'SportFan', action: 'Dépôt effectué', amount: '100,000 FCFA', time: '8 min' },
              { user: 'ProBetter', action: 'Pari remboursé', amount: '25,000 FCFA', time: '12 min' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{activity.amount}</p>
                  <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};