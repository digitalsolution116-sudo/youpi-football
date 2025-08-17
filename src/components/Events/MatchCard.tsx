import React from 'react';
import { Clock, TrendingUp, Users, Star } from 'lucide-react';
import { Match } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getCountryFlag } from '../../utils/countries';

interface MatchCardProps {
  match: Match;
  onBetClick: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onBetClick }) => {
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-l-4 ${
      isLive ? 'border-red-500' : isUpcoming ? 'border-green-500' : 'border-gray-300'
    } hover:shadow-xl transition-all duration-300`}>
      
      {/* Header avec ligue et statut */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-base sm:text-lg">{getCountryFlag(match.country)}</span>
            <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{match.league}</span>
            <Star size={12} className="sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
          </div>
          {isLive && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-bold">
                🔴 EN DIRECT
              </span>
            </div>
          )}
          {match.status === 'upcoming' && (
            <span className="bg-green-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-bold">
              ⏰ À VENIR
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Teams avec photos */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="relative">
              <img 
                src={match.homeTeamLogo || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'}
                alt={match.homeTeam}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-4 border-blue-200 shadow-lg"
              />
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm sm:text-lg text-gray-800 truncate">{match.homeTeam}</div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Domicile</div>
            </div>
          </div>
          
          <div className="text-center mx-2 sm:mx-6 flex-shrink-0">
            <div className="text-xl sm:text-3xl font-bold text-gray-400 mb-1">VS</div>
            <div className="text-xs text-gray-500">
              {format(match.date, 'HH:mm', { locale: fr })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end min-w-0">
            <div className="flex-1 text-right min-w-0">
              <div className="font-bold text-sm sm:text-lg text-gray-800 truncate">{match.awayTeam}</div>
              <div className="text-xs sm:text-sm text-red-600 font-medium">Extérieur</div>
            </div>
            <div className="relative">
              <img 
                src={match.awayTeamLogo || 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'}
                alt={match.awayTeam}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-4 border-red-200 shadow-lg"
              />
              <div className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infos du match */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-2 sm:p-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock size={14} className="sm:w-4 sm:h-4 text-blue-500" />
            <span className="truncate">{format(match.date, 'dd/MM à HH:mm', { locale: fr })}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <TrendingUp size={14} className="sm:w-4 sm:h-4 text-green-500" />
            <span className="truncate">Min: {match.minimumBet.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Users size={14} className="sm:w-4 sm:h-4 text-purple-500" />
            <span>1.2k paris</span>
          </div>
        </div>

        {/* Cotes avec style moderne */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-4 rounded-xl text-center border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
            <div className="text-xs text-green-700 mb-1 font-medium">1 - Domicile</div>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{match.odds.home}</div>
            <div className="text-xs text-green-600 mt-1">+{((match.odds.home - 1) * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 sm:p-4 rounded-xl text-center border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer">
            <div className="text-xs text-yellow-700 mb-1 font-medium">X - Nul</div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">{match.odds.draw}</div>
            <div className="text-xs text-yellow-600 mt-1">+{((match.odds.draw - 1) * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 rounded-xl text-center border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
            <div className="text-xs text-blue-700 mb-1 font-medium">2 - Extérieur</div>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{match.odds.away}</div>
            <div className="text-xs text-blue-600 mt-1">+{((match.odds.away - 1) * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Bouton de pari avec gradient */}
        <button
          onClick={() => onBetClick(match)}
          disabled={match.status === 'finished'}
          className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {match.status === 'finished' ? '⏹️ Match terminé' : '🎯 PARIER MAINTENANT'}
        </button>
      </div>
    </div>
  );
};