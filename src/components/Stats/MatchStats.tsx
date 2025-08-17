import React from 'react';
import { TrendingUp, Users, Target, Clock, Award, BarChart3 } from 'lucide-react';
import { Match } from '../../types';

interface MatchStatsProps {
  match: Match;
}

interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: ('W' | 'D' | 'L')[];
  possession: number;
  shots: number;
  shotsOnTarget: number;
}

const mockStats: { [key: string]: TeamStats } = {
  'FC Porto Gaza': {
    wins: 8,
    draws: 3,
    losses: 2,
    goalsFor: 24,
    goalsAgainst: 12,
    form: ['W', 'W', 'D', 'W', 'L'],
    possession: 58,
    shots: 15,
    shotsOnTarget: 6
  },
  'Zuliano': {
    wins: 6,
    draws: 4,
    losses: 3,
    goalsFor: 18,
    goalsAgainst: 15,
    form: ['L', 'W', 'D', 'W', 'W'],
    possession: 42,
    shots: 12,
    shotsOnTarget: 4
  }
};

export const MatchStats: React.FC<MatchStatsProps> = ({ match }) => {
  const homeStats = mockStats[match.homeTeam] || mockStats['FC Porto Gaza'];
  const awayStats = mockStats[match.awayTeam] || mockStats['Zuliano'];

  const getFormColor = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
    }
  };

  const StatBar: React.FC<{ 
    homeValue: number; 
    awayValue: number; 
    label: string;
    format?: (value: number) => string;
  }> = ({ homeValue, awayValue, label, format = (v) => v.toString() }) => {
    const total = homeValue + awayValue;
    const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>{format(homeValue)}</span>
          <span className="text-gray-600">{label}</span>
          <span>{format(awayValue)}</span>
        </div>
        <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${homePercentage}%` }}
          />
          <div 
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${100 - homePercentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Statistiques du match</h3>
      </div>

      {/* Team Headers */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <h4 className="font-semibold text-blue-600">{match.homeTeam}</h4>
          <p className="text-sm text-gray-500">Domicile</p>
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-red-600">{match.awayTeam}</h4>
          <p className="text-sm text-gray-500">Extérieur</p>
        </div>
      </div>

      {/* Form */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <TrendingUp size={16} className="mr-2" />
          Forme récente (5 derniers matchs)
        </h5>
        <div className="flex justify-between">
          <div className="flex space-x-1">
            {homeStats.form.map((result, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${getFormColor(result)} text-white text-xs flex items-center justify-center font-semibold`}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="flex space-x-1">
            {awayStats.form.map((result, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${getFormColor(result)} text-white text-xs flex items-center justify-center font-semibold`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <StatBar
          homeValue={homeStats.wins}
          awayValue={awayStats.wins}
          label="Victoires"
        />
        
        <StatBar
          homeValue={homeStats.goalsFor}
          awayValue={awayStats.goalsFor}
          label="Buts marqués"
        />
        
        <StatBar
          homeValue={homeStats.goalsAgainst}
          awayValue={awayStats.goalsAgainst}
          label="Buts encaissés"
        />
        
        <StatBar
          homeValue={homeStats.possession}
          awayValue={awayStats.possession}
          label="Possession (%)"
          format={(v) => `${v}%`}
        />
        
        <StatBar
          homeValue={homeStats.shots}
          awayValue={awayStats.shots}
          label="Tirs"
        />
        
        <StatBar
          homeValue={homeStats.shotsOnTarget}
          awayValue={awayStats.shotsOnTarget}
          label="Tirs cadrés"
        />
      </div>

      {/* Head to Head */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Award size={16} className="mr-2" />
          Confrontations directes (5 derniers)
        </h5>
        <div className="grid grid-cols-5 gap-2">
          {['2-1', '0-0', '1-3', '2-0', '1-1'].map((score, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs font-semibold">{score}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>3 victoires</span>
          <span>1 nul</span>
          <span>1 victoire</span>
        </div>
      </div>

      {/* Prediction */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="text-purple-600" size={16} />
            <span className="text-sm font-medium text-purple-800">Prédiction IA</span>
          </div>
          <p className="text-sm text-purple-700">
            Match équilibré avec un léger avantage pour {match.homeTeam} à domicile. 
            Probabilité de plus de 2.5 buts : 65%
          </p>
        </div>
      </div>
    </div>
  );
};