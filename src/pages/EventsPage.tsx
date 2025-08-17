import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, TrendingUp, Clock } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { MatchCard } from '../components/Events/MatchCard';
import { BetModal } from '../components/Events/BetModal';
import { AdminPredictionCard } from '../components/Events/AdminPredictionCard';
import { PromotionBanner } from '../components/Promotions/PromotionBanner';
import { MatchStats } from '../components/Stats/MatchStats';
import { Match, AdminPrediction } from '../types';
import { getLeagueCountry } from '../utils/countries';
import { matchService } from '../services/api';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';


export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'tomorrow' | 'live'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [adminPredictions, setAdminPredictions] = useState<AdminPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [showStats, setShowStats] = useState<string | null>(null);
  const [userDailyBets, setUserDailyBets] = useState(0);

  useEffect(() => {
    loadMatches();
    loadAdminPredictions();
    loadUserDailyBets();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const matchesData = await matchService.getMatches();
      
      const formattedMatches: Match[] = matchesData.map(match => ({
        id: match.id,
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        homeTeamLogo: match.home_team_logo || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        awayTeamLogo: match.away_team_logo || 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        league: match.league,
        country: match.country,
        date: new Date(match.match_date),
        status: match.status as 'upcoming' | 'live' | 'finished',
        minimumBet: match.minimum_bet,
        odds: {
          home: match.odds_home,
          draw: match.odds_draw,
          away: match.odds_away
        }
      }));
      
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Erreur chargement matchs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_predictions')
        .select('*')
        .eq('status', 'active')
        .order('match_date', { ascending: true });

      if (error) throw error;

      const formattedPredictions: AdminPrediction[] = (data || []).map(pred => ({
        id: pred.id,
        adminId: pred.admin_id,
        homeTeam: pred.home_team,
        awayTeam: pred.away_team,
        league: pred.league,
        country: pred.country,
        matchDate: new Date(pred.match_date),
        prediction: pred.prediction,
        confidenceLevel: pred.confidence_level,
        odds: {
          home: pred.odds_home,
          draw: pred.odds_draw,
          away: pred.odds_away
        },
        minimumBet: pred.minimum_bet,
        maximumBet: pred.maximum_bet,
        refundPercentage: pred.refund_percentage,
        status: pred.status,
        result: pred.result,
        totalBets: pred.total_bets,
        totalAmount: pred.total_amount,
        createdAt: new Date(pred.created_at),
        updatedAt: new Date(pred.updated_at)
      }));

      setAdminPredictions(formattedPredictions);
    } catch (error) {
      console.error('Erreur chargement prédictions admin:', error);
    }
  };

  const loadUserDailyBets = async () => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('count')
        .eq('user_id', user?.id)
        .gte('placed_at', new Date().toISOString().split('T')[0]);

      if (!error && data) {
        setUserDailyBets(data.length);
      }
    } catch (error) {
      console.error('Erreur chargement paris quotidiens:', error);
    }
  };
  const tabs = [
    { key: 'live' as const, label: 'EN DIRECT', count: 15, icon: '🔴' },
    { key: 'today' as const, label: 'Aujourd\'hui', count: 85, icon: '📅' },
    { key: 'tomorrow' as const, label: 'Demain', count: 105, icon: '⏰' },
    { key: 'all' as const, label: 'Tout', count: 200, icon: '⚽' },
  ];

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'live') return matchesSearch && match.status === 'live';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const matchDate = new Date(match.date);
    
    if (activeTab === 'today') {
      return matchesSearch && matchDate.toDateString() === today.toDateString();
    }
    
    if (activeTab === 'tomorrow') {
      return matchesSearch && matchDate.toDateString() === tomorrow.toDateString();
    }
    
    return matchesSearch;
  });

  const handleBetClick = (match: Match) => {
    setSelectedMatch(match);
    setIsBetModalOpen(true);
  };

  const handlePlaceBet = (matchId: string, amount: number, prediction: 'home' | 'draw' | 'away') => {
    console.log('Placing bet:', { matchId, amount, prediction });
  };

  const handleAdminPredictionBet = async (prediction: AdminPrediction, betType: 'first' | 'second') => {
    try {
      const amount = Math.min(prediction.maximumBet, Math.max(prediction.minimumBet, user?.balance || 0));
      
      const { data, error } = await supabase.rpc('place_admin_prediction_bet', {
        p_user_id: user?.id,
        p_prediction_id: prediction.id,
        p_amount: amount,
        p_bet_type: betType
      });

      if (error) throw error;

      if (data?.success) {
        alert(`Pari placé avec succès ! Gain potentiel: ${data.potential_return?.toLocaleString()} FCFA`);
        await loadUserDailyBets();
        // Recharger le solde utilisateur
        window.location.reload();
      } else {
        alert(data?.error || 'Erreur lors du placement du pari');
      }
    } catch (error) {
      console.error('Erreur pari prédiction admin:', error);
      alert('Erreur lors du placement du pari');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <Header title="Paris Sportifs" />
      
      {/* Hero Section avec image de stade */}
      <div 
        className="relative h-32 sm:h-40 lg:h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=400&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">🏆 PARIS SPORTIFS</h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90">Les meilleurs matchs, les meilleures cotes</p>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-2 sm:mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2">
                <div className="text-xs sm:text-sm opacity-75">Matchs en direct</div>
                <div className="text-lg sm:text-xl font-bold">15</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2">
                <div className="text-xs sm:text-sm opacity-75">Cotes moyennes</div>
                <div className="text-lg sm:text-xl font-bold">2.5x</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PromotionBanner />
      
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Search Bar avec style moderne */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher équipes, ligues..."
            className="w-full pl-12 pr-12 sm:pr-16 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
            <Filter size={14} className="sm:hidden" />
            <span className="hidden sm:inline">Filtrer</span>
          </button>
        </div>

        {/* Tabs avec style moderne */}
        <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 bg-white p-1 sm:p-2 rounded-2xl shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className={`text-xs px-1 sm:px-2 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-xl text-center">
            <TrendingUp size={20} className="sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">85%</div>
            <div className="text-xs opacity-90">Taux de gain</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 rounded-xl text-center">
            <Star size={20} className="sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">2.8x</div>
            <div className="text-xs opacity-90">Cote moyenne</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-xl text-center">
            <Clock size={20} className="sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">24h</div>
            <div className="text-xs opacity-90">Support</div>
          </div>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="space-y-4">
            {/* Prédictions admin en premier */}
            {adminPredictions.map((prediction) => (
              <div key={`admin-${prediction.id}`}>
                <AdminPredictionCard
                  prediction={prediction}
                  onBetClick={handleAdminPredictionBet}
                  userVipLevel={user?.referralLevel || 0}
                  userDailyBets={userDailyBets}
                />
              </div>
            ))}
            
            {/* Séparateur si il y a des prédictions admin */}
            {adminPredictions.length > 0 && (
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-4 text-sm text-gray-500 bg-gray-100 rounded-full">
                  Matchs API officiels (sans remboursement)
                </div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            )}
            
            {/* Matchs normaux */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
          {filteredMatches.map((match) => (
            <div key={match.id}>
              <MatchCard
                match={match}
                onBetClick={handleBetClick}
              />
              
              {showStats === match.id && (
                <div className="mt-3 sm:mt-4">
                  <MatchStats match={match} />
                </div>
              )}
              
              <button
                onClick={() => setShowStats(showStats === match.id ? null : match.id)}
                className="w-full mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {showStats === match.id ? '📊 Masquer les stats' : '📈 Voir les statistiques'}
              </button>
            </div>
          ))}
        </div>
        )}

        {filteredMatches.length === 0 && adminPredictions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">⚽</div>
            <div className="text-gray-400 text-base sm:text-lg mb-2">Aucun match trouvé</div>
            <div className="text-gray-500 text-sm">
              Essayez de modifier vos critères de recherche
            </div>
          </div>
        )}
      </div>

      <BetModal
        match={selectedMatch}
        isOpen={isBetModalOpen}
        onClose={() => setIsBetModalOpen(false)}
        onPlaceBet={handlePlaceBet}
      />

      <BottomNav />
    </div>
  );
};