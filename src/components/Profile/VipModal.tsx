import React from 'react';
import { X, Crown, Star, Gift, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  if (!isOpen) return null;

  const vipLevels = [
    {
      level: 'VIP 1', 
      minBalance: 1000,
      maxBalance: 30000,
      dailyReward: 10,
      firstBetPercentage: 1.0,
      secondBetPercentage: 1.5,
      referralBonus: 500,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    },
    {
      level: 'VIP 2', 
      minBalance: 31000,
      maxBalance: 200000,
      dailyReward: 10,
      firstBetPercentage: 1.5,
      secondBetPercentage: 1.5,
      referralBonus: 500,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      level: 'VIP 3', 
      minBalance: 201000,
      maxBalance: 500000,
      dailyReward: 10,
      firstBetPercentage: 2.0,
      secondBetPercentage: 2.0,
      referralBonus: 500,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      level: 'VIP 4', 
      minBalance: 501000,
      maxBalance: 800000,
      dailyReward: 10,
      firstBetPercentage: 2.5,
      secondBetPercentage: 2.5,
      referralBonus: 500,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    },
    {
      level: 'VIP 5', 
      minBalance: 801000,
      maxBalance: 1500000,
      dailyReward: 10,
      firstBetPercentage: 3.0,
      secondBetPercentage: 3.0,
      referralBonus: 500,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-800'
    },
    {
      level: 'VIP 6', 
      minBalance: 1501000,
      maxBalance: 2000000,
      dailyReward: 10,
      firstBetPercentage: 3.5,
      secondBetPercentage: 3.5,
      referralBonus: 500,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    }
  ];

  // Simuler le statut actuel de l'utilisateur
  const currentUserStats = {
    balance: user?.balance || 50,
    currentLevel: 'Standard'
  };

  const getCurrentVipLevel = () => {
    const balance = currentUserStats.balance;
    
    for (const level of vipLevels) {
      if (balance >= level.minBalance && balance <= level.maxBalance) {
        return level.level;
      }
    }
    return 'Standard';
  };

  const getNextVipLevel = () => {
    const currentLevel = getCurrentVipLevel();
    if (currentLevel === 'Standard') return vipLevels[0];
    if (currentLevel === 'VIP 6') return null;
    
    const currentIndex = vipLevels.findIndex(level => level.level === currentLevel);
    return currentIndex < vipLevels.length - 1 ? vipLevels[currentIndex + 1] : null;
  };

  const currentLevel = getCurrentVipLevel();
  const nextLevel = getNextVipLevel();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Crown className="text-yellow-500" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Programme VIP</h2>
                <p className="text-gray-600">Boostez vos gains grâce à vos performances et votre réseau</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Statut actuel */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center">
              <Star className="mr-2" size={20} />
              Votre statut actuel : {currentLevel}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-2xl">💰</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentUserStats.balance.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Solde actuel (FCFA)</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-2xl">🎁</div>
                </div>
                <div className="text-2xl font-bold text-green-600">10</div>
                <div className="text-sm text-gray-600">Récompense quotidienne</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-2xl">📈</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Paris quotidiens max</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-2xl">🏆</div>
                </div>
                <div className="text-2xl font-bold text-orange-600">6%</div>
                <div className="text-sm text-gray-600">Remboursement</div>
              </div>
            </div>

            {nextLevel && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Prochain niveau : {nextLevel.level}
                </h4>
                <div className="text-sm">
                  <span className="text-gray-600">Solde requis : </span>
                  <span className="font-semibold">{nextLevel.minBalance.toLocaleString()} FCFA</span>
                </div>
              </div>
            )}
          </div>

          {/* Niveaux VIP */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tous les niveaux VIP</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vipLevels.map((vip, index) => (
                <div key={index} className={`border-2 rounded-xl p-4 ${
                  currentLevel === vip.level ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${vip.color} text-white font-bold text-lg`}>
                      {vip.level}
                    </div>
                    {vip.bonus > 0 && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Gift size={16} />
                        <span className="font-bold">{vip.bonus.toLocaleString()} FCFA</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde minimum :</span>
                      <span className="font-semibold">{vip.minBalance.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde maximum :</span>
                      <span className="font-semibold">{vip.maxBalance.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Récompense quotidienne :</span>
                      <span className="font-semibold">{vip.dailyReward} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">1er pari :</span>
                      <span className="font-semibold">+{vip.firstBetPercentage}% du capital</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">2ème pari :</span>
                      <span className="font-semibold">+{vip.secondBetPercentage}% du capital</span>
                    </div>
                    
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-green-600 font-medium">Bonus parrainage :</span>
                      <span className="font-bold text-green-600">🎁 {vip.referralBonus} FCFA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment progresser */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Comment fonctionne le système VIP ?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
              <div>
                <h5 className="font-semibold mb-2">💰 Classification automatique :</h5>
                <ul className="space-y-1">
                  <li>• Basée sur votre solde disponible</li>
                  <li>• Mise à jour automatique en temps réel</li>
                  <li>• Récompenses quotidiennes de 10 FCFA</li>
                  <li>• Bonus sur les prédictions admin</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">🎯 Prédictions admin :</h5>
                <ul className="space-y-1">
                  <li>• Maximum 2 paris par jour</li>
                  <li>• Gains basés sur votre niveau VIP</li>
                  <li>• Remboursement de 6% en cas de perte</li>
                  <li>• Prédictions d'experts vérifiées</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
            >
              Compris, commençons !
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};