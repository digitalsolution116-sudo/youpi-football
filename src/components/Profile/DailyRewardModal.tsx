import React, { useState } from 'react';
import { X, Calendar, Gift, Star, CheckCircle, Clock, Award, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DailyReward {
  day: number;
  reward: number;
  type: 'coins' | 'bonus' | 'multiplier' | 'special';
  claimed: boolean;
  special?: string;
}

interface WeeklyBonus {
  week: number;
  requirement: number;
  reward: number;
  claimed: boolean;
  description: string;
}

const dailyRewards: DailyReward[] = [
  { day: 1, reward: 1000, type: 'coins', claimed: true },
  { day: 2, reward: 1500, type: 'coins', claimed: true },
  { day: 3, reward: 2000, type: 'coins', claimed: true },
  { day: 4, reward: 2500, type: 'coins', claimed: true },
  { day: 5, reward: 3000, type: 'coins', claimed: true },
  { day: 6, reward: 5000, type: 'bonus', claimed: false },
  { day: 7, reward: 10000, type: 'special', claimed: false, special: 'Bonus VIP' },
  { day: 8, reward: 1200, type: 'coins', claimed: false },
  { day: 9, reward: 1800, type: 'coins', claimed: false },
  { day: 10, reward: 2200, type: 'coins', claimed: false },
  { day: 11, reward: 2800, type: 'coins', claimed: false },
  { day: 12, reward: 3500, type: 'coins', claimed: false },
  { day: 13, reward: 6000, type: 'bonus', claimed: false },
  { day: 14, reward: 15000, type: 'special', claimed: false, special: 'Méga Bonus' },
  { day: 15, reward: 1500, type: 'coins', claimed: false },
  { day: 16, reward: 2000, type: 'coins', claimed: false },
  { day: 17, reward: 2500, type: 'coins', claimed: false },
  { day: 18, reward: 3000, type: 'coins', claimed: false },
  { day: 19, reward: 4000, type: 'coins', claimed: false },
  { day: 20, reward: 7500, type: 'bonus', claimed: false },
  { day: 21, reward: 20000, type: 'special', claimed: false, special: 'Jackpot' },
  { day: 22, reward: 1800, type: 'coins', claimed: false },
  { day: 23, reward: 2200, type: 'coins', claimed: false },
  { day: 24, reward: 2800, type: 'coins', claimed: false },
  { day: 25, reward: 3500, type: 'coins', claimed: false },
  { day: 26, reward: 4500, type: 'coins', claimed: false },
  { day: 27, reward: 8000, type: 'bonus', claimed: false },
  { day: 28, reward: 25000, type: 'special', claimed: false, special: 'Super Jackpot' },
  { day: 29, reward: 2000, type: 'coins', claimed: false },
  { day: 30, reward: 50000, type: 'special', claimed: false, special: 'Récompense Ultime' }
];

const weeklyBonuses: WeeklyBonus[] = [
  {
    week: 1,
    requirement: 7,
    reward: 15000,
    claimed: false,
    description: 'Connectez-vous 7 jours consécutifs'
  },
  {
    week: 2,
    requirement: 14,
    reward: 35000,
    claimed: false,
    description: 'Connectez-vous 14 jours consécutifs'
  },
  {
    week: 3,
    requirement: 21,
    reward: 75000,
    claimed: false,
    description: 'Connectez-vous 21 jours consécutifs'
  },
  {
    week: 4,
    requirement: 30,
    reward: 150000,
    claimed: false,
    description: 'Connectez-vous 30 jours consécutifs'
  }
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [userRewards, setUserRewards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    if (isOpen && user) {
      loadUserRewards();
    }
  }, [isOpen, user]);

  const loadUserRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('user_id', user?.id)
        .order('reward_date', { ascending: false });

      if (!error && data) {
        setUserRewards(data);
        
        // Calculer la série actuelle
        const today = new Date().toISOString().split('T')[0];
        const todayReward = data.find(r => r.reward_date === today);
        
        setCanClaim(!todayReward?.claimed);
        setCurrentDay(data.filter(r => r.claimed).length);
        
        // Calculer la série de connexions consécutives
        let consecutiveDays = 0;
        const sortedRewards = data.sort((a, b) => new Date(b.reward_date).getTime() - new Date(a.reward_date).getTime());
        
        for (let i = 0; i < sortedRewards.length; i++) {
          const rewardDate = new Date(sortedRewards[i].reward_date);
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (rewardDate.toDateString() === expectedDate.toDateString() && sortedRewards[i].claimed) {
            consecutiveDays++;
          } else {
            break;
          }
        }
        
        setStreak(consecutiveDays);
      }
    } catch (error) {
      console.error('Erreur chargement récompenses:', error);
    }
  };

  if (!isOpen) return null;

  const getRewardIcon = (type: DailyReward['type']) => {
    switch (type) {
      case 'coins': return '💰';
      case 'bonus': return '🎁';
      case 'multiplier': return '⚡';
      case 'special': return '🌟';
      default: return '💰';
    }
  };

  const getRewardColor = (type: DailyReward['type']) => {
    switch (type) {
      case 'coins': return 'from-yellow-400 to-yellow-600';
      case 'bonus': return 'from-green-400 to-green-600';
      case 'multiplier': return 'from-purple-400 to-purple-600';
      case 'special': return 'from-pink-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const claimReward = (day: number) => {
    if (canClaim) {
      claimDailyReward();
    }
  };

  const claimDailyReward = async () => {
    try {
      const { data, error } = await supabase.rpc('process_daily_reward', {
        p_user_id: user?.id
      });

      if (error) throw error;

      if (data?.success) {
        alert(`Récompense de ${data.reward_amount} FCFA réclamée !`);
        setCanClaim(false);
        setCurrentDay(currentDay + 1);
        setStreak(streak + 1);
        // Recharger le solde
        window.location.reload();
      } else {
        alert(data?.error || 'Récompense déjà réclamée aujourd\'hui');
      }
    } catch (error) {
      console.error('Erreur réclamation récompense:', error);
      alert('Erreur lors de la réclamation');
    }
  };
  const claimWeeklyBonus = (week: number) => {
    if (streak >= weeklyBonuses[week - 1].requirement) {
      // Logique pour réclamer le bonus hebdomadaire
    }
  };

  const nextRewardTime = new Date();
  nextRewardTime.setHours(24, 0, 0, 0); // Minuit du jour suivant

  const timeUntilNextReward = nextRewardTime.getTime() - Date.now();
  const hoursLeft = Math.floor(timeUntilNextReward / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeUntilNextReward % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="text-yellow-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Récompenses quotidiennes</h2>
                <p className="text-gray-600">Connectez-vous chaque jour pour gagner des bonus</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Statistiques de connexion */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{streak}</div>
                <div className="text-blue-700 font-medium">Jours consécutifs</div>
                <div className="text-sm text-blue-600">Série actuelle</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {dailyRewards.filter(r => r.claimed).reduce((sum, r) => sum + r.reward, 0).toLocaleString()}
                </div>
                <div className="text-green-700 font-medium">FCFA gagnés</div>
                <div className="text-sm text-green-600">Total réclamé</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {canClaim ? '✅' : `${hoursLeft}h ${minutesLeft}m`}
                </div>
                <div className="text-purple-700 font-medium">
                  {canClaim ? 'Disponible' : 'Prochaine récompense'}
                </div>
                <div className="text-sm text-purple-600">
                  {canClaim ? 'Réclamez maintenant' : 'Temps restant'}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'daily'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar size={16} />
              <span>Récompenses quotidiennes</span>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'weekly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Award size={16} />
              <span>Bonus hebdomadaires</span>
            </button>
          </div>

          {/* Récompenses quotidiennes */}
          {activeTab === 'daily' && (
            <div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-6">
                {dailyRewards.map((reward) => {
                  const isCurrent = reward.day === currentDay + 1;
                  const isAvailable = reward.day <= currentDay + 1 && canClaim && reward.day === currentDay + 1;
                  const isPast = reward.day <= currentDay;
                  
                  return (
                    <div
                      key={reward.day}
                      className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        reward.claimed 
                          ? 'border-green-500 bg-green-50' 
                          : isCurrent && canClaim
                          ? 'border-blue-500 bg-blue-50 animate-pulse'
                          : isPast
                          ? 'border-gray-300 bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => isAvailable && claimReward(reward.day)}
                    >
                      {reward.claimed && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-2xl mb-1">{getRewardIcon(reward.type)}</div>
                        <div className="text-xs font-bold text-gray-800 mb-1">Jour {reward.day}</div>
                        <div className="text-xs font-semibold text-green-600">
                          {reward.reward.toLocaleString()}
                        </div>
                        {reward.special && (
                          <div className="text-xs text-purple-600 mt-1 font-medium">
                            {reward.special}
                          </div>
                        )}
                      </div>
                      
                      {isCurrent && canClaim && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                          <Zap className="text-blue-600" size={20} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Prochaine récompense */}
              {!canClaim && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-yellow-600" size={20} />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Prochaine récompense dans {hoursLeft}h {minutesLeft}m</h4>
                      <p className="text-sm text-yellow-700">
                        Revenez demain pour réclamer votre récompense du jour {currentDay + 1} !
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bonus hebdomadaires */}
          {activeTab === 'weekly' && (
            <div className="space-y-4">
              {weeklyBonuses.map((bonus) => {
                const isUnlocked = streak >= bonus.requirement;
                const canClaimWeekly = isUnlocked && !bonus.claimed;
                
                return (
                  <div
                    key={bonus.week}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      bonus.claimed
                        ? 'border-green-500 bg-green-50'
                        : canClaimWeekly
                        ? 'border-blue-500 bg-blue-50'
                        : isUnlocked
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                          bonus.claimed ? 'from-green-400 to-green-600' :
                          canClaimWeekly ? 'from-blue-400 to-blue-600' :
                          isUnlocked ? 'from-yellow-400 to-yellow-600' :
                          'from-gray-400 to-gray-600'
                        } flex items-center justify-center text-white text-2xl font-bold`}>
                          {bonus.claimed ? '✓' : bonus.week}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Bonus Semaine {bonus.week}
                          </h3>
                          <p className="text-gray-600">{bonus.description}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            Progression: {Math.min(streak, bonus.requirement)}/{bonus.requirement} jours
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {bonus.reward.toLocaleString()} FCFA
                        </div>
                        {bonus.claimed ? (
                          <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                            ✓ Réclamé
                          </span>
                        ) : canClaimWeekly ? (
                          <button
                            onClick={() => claimWeeklyBonus(bonus.week)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                          >
                            Réclamer
                          </button>
                        ) : isUnlocked ? (
                          <span className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                            Disponible
                          </span>
                        ) : (
                          <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            Verrouillé
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="mt-4 bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(streak / bonus.requirement) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Conseils */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
              <Star className="mr-2" size={20} />
              Conseils pour maximiser vos récompenses
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
              <div>
                <h5 className="font-semibold mb-2">📅 Connexion quotidienne :</h5>
                <ul className="space-y-1">
                  <li>• Connectez-vous chaque jour avant minuit</li>
                  <li>• Ne manquez pas un jour pour garder votre série</li>
                  <li>• Les récompenses augmentent avec les jours</li>
                  <li>• Réclamez vos récompenses rapidement</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">🎁 Bonus spéciaux :</h5>
                <ul className="space-y-1">
                  <li>• Les jours 7, 14, 21, 28 et 30 sont spéciaux</li>
                  <li>• Bonus hebdomadaires pour les séries longues</li>
                  <li>• Récompenses VIP pour les membres fidèles</li>
                  <li>• Événements spéciaux pendant les fêtes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};