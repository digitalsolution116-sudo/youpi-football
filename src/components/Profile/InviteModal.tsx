import React, { useState } from 'react';
import { X, Users, Copy, Share, Gift } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const referralCode = 'ARTHUR2024';
  const referralLink = `https://footballbet.com/register?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = {
    totalInvited: 12,
    activeReferrals: 8,
    totalEarned: 45000,
    thisMonth: 12000
  };

  const recentReferrals = [
    { name: 'User***123', date: '2024-08-10', status: 'Actif', earned: 5000 },
    { name: 'Bet***456', date: '2024-08-08', status: 'Actif', earned: 3000 },
    { name: 'Pro***789', date: '2024-08-05', status: 'Inactif', earned: 0 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Users className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Inviter des amis</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Programme de parrainage */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Programme de parrainage à 3 niveaux</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3%</div>
                <div className="text-sm text-gray-600">Niveau 1</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2%</div>
                <div className="text-sm text-gray-600">Niveau 2</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1%</div>
                <div className="text-sm text-gray-600">Niveau 3</div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-800">{referralStats.totalInvited}</div>
              <div className="text-sm text-gray-600">Total invités</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{referralStats.activeReferrals}</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{referralStats.totalEarned.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total gagné (FCFA)</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{referralStats.thisMonth.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ce mois (FCFA)</div>
            </div>
          </div>

          {/* Code et lien de parrainage */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre code de parrainage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                />
                <button
                  onClick={() => handleCopy(referralCode)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Copy size={16} />
                  <span>{copied ? 'Copié!' : 'Copier'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien de parrainage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={() => handleCopy(referralLink)}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Share size={16} />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parrainages récents */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Parrainages récents</h3>
            <div className="space-y-3">
              {recentReferrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{referral.name}</div>
                    <div className="text-sm text-gray-600">{referral.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      referral.status === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {referral.status}
                    </div>
                    <div className="text-sm font-semibold text-green-600 mt-1">
                      +{referral.earned.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
              <Gift size={16} />
              <span>Comment ça marche ?</span>
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Partagez votre code ou lien de parrainage</li>
              <li>• Vos amis s'inscrivent avec votre code</li>
              <li>• Vous gagnez des commissions sur leurs activités</li>
              <li>• Plus ils jouent, plus vous gagnez !</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};