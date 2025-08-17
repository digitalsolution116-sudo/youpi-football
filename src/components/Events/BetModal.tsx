import React, { useState } from 'react';
import { X, Calculator, AlertTriangle } from 'lucide-react';
import { Match } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getCountryFlag } from '../../utils/countries';
import { betService } from '../../services/api';

interface BetModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBet: (matchId: string, amount: number, prediction: 'home' | 'draw' | 'away') => void;
}

export const BetModal: React.FC<BetModalProps> = ({ match, isOpen, onClose, onPlaceBet }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<'home' | 'draw' | 'away' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const { user } = useAuth();

  if (!isOpen || !match) return null;

  const handlePlaceBet = async () => {
    if (!selectedPrediction || !betAmount) return;
    
    const amount = parseInt(betAmount);
    if (amount < match.minimumBet) return;
    if (amount > (user?.balance || 0)) return;

    try {
      setIsPlacing(true);
      await betService.placeBet({
        userId: user!.id,
        matchId: match.id,
        amount: amount,
        prediction: selectedPrediction,
        odds: match.odds[selectedPrediction]
      });
      
      onPlaceBet(match.id, amount, selectedPrediction);
      onClose();
      setBetAmount('');
      setSelectedPrediction(null);
    } catch (error) {
      console.error('Erreur placement pari:', error);
      alert('Erreur lors du placement du pari');
    } finally {
      setIsPlacing(false);
    }
  };

  const potentialWin = selectedPrediction && betAmount ? 
    parseInt(betAmount) * match.odds[selectedPrediction] : 0;

  const isValidAmount = betAmount && parseInt(betAmount) >= match.minimumBet && parseInt(betAmount) <= (user?.balance || 0);
  const predictionOptions = [
    { key: 'home' as const, label: match.homeTeam, odds: match.odds.home },
    { key: 'draw' as const, label: 'Match Nul', odds: match.odds.draw },
    { key: 'away' as const, label: match.awayTeam, odds: match.odds.away },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Placer un pari</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2 flex items-center justify-center space-x-2">
                  <span className="text-lg">{getCountryFlag(match.country)}</span>
                  <span>{match.league}</span>
                </div>
                <div className="font-semibold text-lg">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Choisir votre prédiction :</h3>
              {predictionOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedPrediction(option.key)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-gray-800 ${
                    selectedPrediction === option.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-bold text-green-600">
                      {option.odds}x
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant du pari (FCFA)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder={`Minimum ${match.minimumBet.toLocaleString()}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 text-sm text-gray-600">
              Solde disponible: {user?.balance?.toLocaleString()} FCFA
            </div>
          </div>

          {selectedPrediction && betAmount && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calculator size={16} className="text-blue-600" />
                <span className="font-medium text-blue-800">Gain potentiel</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {potentialWin.toLocaleString()} FCFA
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle size={16} className="text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <div className="font-medium mb-1">Système de remboursement</div>
                <div>En cas de perte, vous serez remboursé selon nos conditions de remboursement inversé.</div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceBet}
            disabled={!selectedPrediction || !isValidAmount || isPlacing}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacing ? 'Placement en cours...' : 'Confirmer le pari'}
          </button>
        </div>
      </div>
    </div>
  );
};