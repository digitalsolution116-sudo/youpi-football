import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { Bet } from '../types';
import { betService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';


export const BetsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserBets();
    }
  }, [user]);

  const loadUserBets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const betsData = await betService.getUserBets(user.id);
      
      const formattedBets: Bet[] = betsData.map(bet => ({
        id: bet.id,
        userId: bet.user_id,
        matchId: bet.match_id,
        amount: bet.amount,
        prediction: bet.prediction as 'home' | 'draw' | 'away',
        odds: bet.odds,
        status: bet.status as 'pending' | 'won' | 'lost' | 'refunded',
        placedAt: new Date(bet.placed_at)
      }));
      
      setBets(formattedBets);
    } catch (error) {
      console.error('Erreur chargement paris:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeBets = bets.filter(bet => bet.status === 'pending');
  const completedBets = bets.filter(bet => bet.status !== 'pending');

  const getStatusIcon = (status: Bet['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'won':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'lost':
        return <XCircle className="text-red-500" size={20} />;
      case 'refunded':
        return <RefreshCw className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Bet['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      case 'refunded':
        return 'Remboursé';
      default:
        return '';
    }
  };

  const getStatusColor = (status: Bet['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'won':
        return 'text-green-600 bg-green-50';
      case 'lost':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-blue-600 bg-blue-50';
      default:
        return '';
    }
  };

  const BetCard: React.FC<{ bet: Bet }> = ({ bet }) => (
    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(bet.status)}
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(bet.status)}`}>
            {getStatusText(bet.status)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Mise</div>
          <div className="font-bold text-gray-800">{bet.amount.toLocaleString()} FCFA</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Prédiction</div>
        <div className="font-medium text-gray-800">
          {bet.prediction === 'home' ? 'Victoire domicile' : 
           bet.prediction === 'away' ? 'Victoire extérieur' : 'Match nul'}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="text-gray-600">Cote: </span>
          <span className="font-bold text-blue-600">{bet.odds}x</span>
        </div>
        <div>
          <span className="text-gray-600">Gain potentiel: </span>
          <span className="font-bold text-green-600">
            {(bet.amount * bet.odds).toLocaleString()} FCFA
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Placé le {bet.placedAt.toLocaleDateString('fr-FR')} à {bet.placedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Mes Paris" />
      
      <div className="p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm opacity-90">Paris gagnés</span>
            </div>
            <div className="text-2xl font-bold">
              {bets.filter(bet => bet.status === 'won').length}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw size={20} />
              <span className="text-sm opacity-90">Remboursements</span>
            </div>
            <div className="text-2xl font-bold">
              {bets.filter(bet => bet.status === 'refunded').length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Paris actifs ({activeBets.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Historique ({completedBets.length})
          </button>
        </div>

        {/* Bets List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
          {activeTab === 'active' ? (
            activeBets.length > 0 ? (
              activeBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Aucun pari actif</div>
                <div className="text-gray-500 text-sm">
                  Vos paris en cours apparaîtront ici
                </div>
              </div>
            )
          ) : (
            completedBets.length > 0 ? (
              completedBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Aucun historique</div>
                <div className="text-gray-500 text-sm">
                  Vos paris terminés apparaîtront ici
                </div>
              </div>
            )
          )}
        </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};