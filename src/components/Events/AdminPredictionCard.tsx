import React from 'react';
import { Clock, Target, Star, Award, Shield } from 'lucide-react';
import { AdminPrediction } from '../../types/admin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getCountryFlag } from '../../utils/countries';

interface AdminPredictionCardProps {
  prediction: AdminPrediction;
  onBetClick: (prediction: AdminPrediction, betType: 'first' | 'second') => void;
  userVipLevel: number;
  userDailyBets: number;
}

export const AdminPredictionCard: React.FC<AdminPredictionCardProps> = ({ 
  prediction, 
  onBetClick, 
  userVipLevel,
  userDailyBets 
}) => {
  const canPlaceBet = userDailyBets < 2 && prediction.status === 'active';
  
  const getVipPercentage = (betType: 'first' | 'second') => {
    const vipLevels = [
      { level: 1, first: 1.0, second: 1.5 },
      { level: 2, first: 1.5, second: 1.5 },
      { level: 3, first: 2.0, second: 2.0 },
      { level: 4, first: 2.5, second: 2.5 },
      { level: 5, first: 3.0, second: 3.0 },
      { level: 6, first: 3.5, second: 3.5 }
    ];
    
    const vipData = vipLevels.find(v => v.level === userVipLevel);
    return vipData ? vipData[betType] : 1.0;
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 4) return 'text-green-600 bg-green-100';
    if (level >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < level ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
      
      {/* Header avec badge admin */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCountryFlag(prediction.country)}</span>
            <span className="font-medium text-gray-700 text-sm">{prediction.league}</span>
            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
              <Target size={10} />
              <span>PRÉDICTION ADMIN</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
              Confiance: {prediction.confidenceLevel}/5
            </div>
            <div className="flex space-x-0.5">
              {getConfidenceStars(prediction.confidenceLevel)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">H</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800">{prediction.homeTeam}</div>
              <div className="text-xs text-blue-600 font-medium">Domicile</div>
            </div>
          </div>
          
          <div className="text-center mx-4">
            <div className="text-2xl font-bold text-gray-400 mb-1">VS</div>
            <div className="text-xs text-gray-500">
              {format(prediction.matchDate, 'HH:mm', { locale: fr })}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="flex-1 text-right">
              <div className="font-bold text-gray-800">{prediction.awayTeam}</div>
              <div className="text-xs text-red-600 font-medium">Extérieur</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">A</span>
            </div>
          </div>
        </div>

        {/* Prédiction de l'admin */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="text-purple-600" size={16} />
              <span className="font-semibold text-purple-800">Prédiction :</span>
            </div>
            <div className="font-bold text-purple-600">
              {prediction.prediction === 'home' ? `Victoire ${prediction.homeTeam}` : 
               prediction.prediction === 'away' ? `Victoire ${prediction.awayTeam}` : 'Match nul'}
            </div>
          </div>
        </div>

        {/* Infos du match */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-blue-500" />
            <span>{format(prediction.matchDate, 'dd/MM à HH:mm', { locale: fr })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield size={14} className="text-green-500" />
            <span>Remboursement: {prediction.refundPercentage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award size={14} className="text-purple-500" />
            <span>{prediction.totalBets} paris</span>
          </div>
        </div>

        {/* Boutons de paris VIP */}
        {canPlaceBet ? (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => onBetClick(prediction, 'first')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
            >
              <div className="text-center">
                <div className="text-sm">1er Pari</div>
                <div className="text-lg font-bold">+{getVipPercentage('first')}%</div>
                <div className="text-xs opacity-90">du capital</div>
              </div>
            </button>
            
            <button
              onClick={() => onBetClick(prediction, 'second')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <div className="text-center">
                <div className="text-sm">2ème Pari</div>
                <div className="text-lg font-bold">+{getVipPercentage('second')}%</div>
                <div className="text-xs opacity-90">du capital</div>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <div className="text-gray-600 text-sm">
              {userDailyBets >= 2 ? '✅ Limite quotidienne atteinte (2 paris max)' : 
               prediction.status !== 'active' ? '⏹️ Prédiction fermée' : 
               '⏰ Prédiction non disponible'}
            </div>
          </div>
        )}

        {/* Limites */}
        <div className="text-xs text-gray-500 text-center">
          Mise: {prediction.minimumBet.toLocaleString()} - {prediction.maximumBet.toLocaleString()} FCFA
        </div>
      </div>
    </div>
  );
};