import React, { useState, useEffect } from 'react';
import { Crown, Users, TrendingUp, Gift, Star, Award, Calendar } from 'lucide-react';
import { VipLevel } from '../../types/admin';
import { supabase } from '../../lib/supabase';

export const VipManagement: React.FC = () => {
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [vipStats, setVipStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVipData();
  }, []);

  const loadVipData = async () => {
    try {
      setIsLoading(true);

      // Charger les niveaux VIP
      const { data: levelsData, error: levelsError } = await supabase
        .from('vip_levels')
        .select('*')
        .order('level_number', { ascending: true });

      if (levelsError) throw levelsError;

      const formattedLevels: VipLevel[] = (levelsData || []).map(level => ({
        id: level.id,
        levelNumber: level.level_number,
        name: level.name,
        minBalance: level.min_balance,
        maxBalance: level.max_balance,
        dailyReward: level.daily_reward,
        firstBetPercentage: level.first_bet_percentage,
        secondBetPercentage: level.second_bet_percentage,
        referralBonus: level.referral_bonus,
        referralRequirement: level.referral_requirement
      }));

      setVipLevels(formattedLevels);

      // Charger les statistiques VIP
      const { data: statsData, error: statsError } = await supabase
        .from('users')
        .select('vip_level, balance')
        .eq('status', 'active');

      if (!statsError && statsData) {
        const stats: any = {};
        formattedLevels.forEach(level => {
          const usersInLevel = statsData.filter(user => 
            user.balance >= level.minBalance && user.balance <= level.maxBalance
          );
          stats[level.name] = {
            count: usersInLevel.length,
            totalBalance: usersInLevel.reduce((sum, user) => sum + user.balance, 0)
          };
        });
        setVipStats(stats);
      }

    } catch (error) {
      console.error('Erreur chargement données VIP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAllDailyRewards = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer tous les utilisateurs actifs
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .eq('status', 'active');

      if (error) throw error;

      let processedCount = 0;
      for (const user of users || []) {
        try {
          const { data } = await supabase.rpc('process_daily_reward', {
            p_user_id: user.id
          });
          if (data?.success) processedCount++;
        } catch (err) {
          console.error('Erreur traitement récompense pour', user.id, err);
        }
      }

      alert(`${processedCount} récompenses quotidiennes traitées`);
      await loadVipData();
    } catch (error) {
      console.error('Erreur traitement récompenses:', error);
      alert('Erreur lors du traitement des récompenses');
    } finally {
      setIsLoading(false);
    }
  };

  const processWeeklyCommissions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('process_weekly_commissions');
      
      if (error) throw error;
      
      alert(`${data?.processed_users || 0} commissions traitées pour un total de ${data?.total_commissions?.toLocaleString() || 0} FCFA`);
      await loadVipData();
    } catch (error) {
      console.error('Erreur traitement commissions:', error);
      alert('Erreur lors du traitement des commissions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion VIP</h1>
          <p className="text-gray-600">Système automatique de classification VIP</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={processAllDailyRewards}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Gift size={16} />
            <span>Traiter récompenses quotidiennes</span>
          </button>
          <button
            onClick={processWeeklyCommissions}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Calendar size={16} />
            <span>Traiter commissions hebdo</span>
          </button>
        </div>
      </div>

      {/* Niveaux VIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {vipLevels.map((level) => (
          <div key={level.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 bg-gradient-to-r ${
              level.levelNumber === 1 ? 'from-gray-400 to-gray-600' :
              level.levelNumber === 2 ? 'from-blue-400 to-blue-600' :
              level.levelNumber === 3 ? 'from-green-400 to-green-600' :
              level.levelNumber === 4 ? 'from-purple-400 to-purple-600' :
              level.levelNumber === 5 ? 'from-pink-400 to-pink-600' :
              'from-orange-400 to-orange-600'
            } text-white`}>
              <div className="flex items-center space-x-3">
                <Crown size={24} />
                <div>
                  <h3 className="text-lg font-bold">{level.name}</h3>
                  <p className="text-sm opacity-90">
                    {level.minBalance.toLocaleString()} - {level.maxBalance.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilisateurs :</span>
                  <span className="font-semibold">{vipStats[level.name]?.count || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Récompense quotidienne :</span>
                  <span className="font-semibold text-green-600">{level.dailyReward} FCFA</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">1er pari :</span>
                  <span className="font-semibold text-blue-600">+{level.firstBetPercentage}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">2ème pari :</span>
                  <span className="font-semibold text-blue-600">+{level.secondBetPercentage}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bonus parrainage :</span>
                  <span className="font-semibold text-purple-600">{level.referralBonus} FCFA</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    Volume total : {vipStats[level.name]?.totalBalance?.toLocaleString() || 0} FCFA
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Système de parrainage */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Système de parrainage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Bonus premier dépôt</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span>Niveau 1 (direct) :</span>
                <span className="font-bold text-green-600">3%</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span>Niveau 2 :</span>
                <span className="font-bold text-blue-600">2%</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span>Niveau 3 :</span>
                <span className="font-bold text-purple-600">1%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Commissions hebdomadaires</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span>Niveau 1 (mises) :</span>
                <span className="font-bold text-green-600">1%</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span>Niveau 2 (mises) :</span>
                <span className="font-bold text-blue-600">0.5%</span>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <span className="text-sm text-yellow-700">Versement tous les lundis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};