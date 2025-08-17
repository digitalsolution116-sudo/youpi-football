import React, { useState } from 'react';
import { X, Users, TrendingUp, Award, Crown, DollarSign, Calendar, Search, Filter } from 'lucide-react';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  username: string;
  level: 1 | 2 | 3;
  joinDate: Date;
  totalDeposits: number;
  totalBets: number;
  status: 'active' | 'inactive';
  commissionEarned: number;
  directReferrals: number;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalVolume: number;
  totalCommissions: number;
  thisMonthCommissions: number;
  level1Members: number;
  level2Members: number;
  level3Members: number;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'commissions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalVolume: 0,
    totalCommissions: 0,
    thisMonthCommissions: 0,
    level1Members: 0,
    level2Members: 0,
    level3Members: 0
  });

  useEffect(() => {
    if (isOpen && user) {
      loadTeamData();
    }
  }, [isOpen, user]);

  const loadTeamData = async () => {
    try {
      // Charger les parrainages de l'utilisateur
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:referred_id (
            id,
            username,
            balance,
            status,
            created_at,
            cumulative_bets,
            cumulative_recharge
          )
        `)
        .eq('referrer_id', user?.id);

      if (!error && referrals) {
        const members: TeamMember[] = referrals.map(ref => ({
          id: ref.referred.id,
          username: ref.referred.username,
          level: ref.level,
          joinDate: new Date(ref.referred.created_at),
          totalDeposits: ref.referred.cumulative_recharge || 0,
          totalBets: ref.referred.cumulative_bets || 0,
          status: ref.referred.status === 'active' ? 'active' : 'inactive',
          commissionEarned: ref.total_earned || 0,
          directReferrals: 0 // À calculer si nécessaire
        }));

        setTeamMembers(members);

        // Calculer les statistiques
        const stats: TeamStats = {
          totalMembers: members.length,
          activeMembers: members.filter(m => m.status === 'active').length,
          totalVolume: members.reduce((sum, m) => sum + m.totalBets, 0),
          totalCommissions: members.reduce((sum, m) => sum + m.commissionEarned, 0),
          thisMonthCommissions: 0, // À calculer avec les transactions du mois
          level1Members: members.filter(m => m.level === 1).length,
          level2Members: members.filter(m => m.level === 2).length,
          level3Members: members.filter(m => m.level === 3).length
        };

        setTeamStats(stats);
      }
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  if (!isOpen) return null;

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || member.level.toString() === levelFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getLevelColor = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelCommission = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1: return '3%';
      case 2: return '2%';
      case 3: return '1%';
      default: return '0%';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestion d'équipe</h2>
                <p className="text-gray-600">Gérez votre réseau de parrainage sur 3 niveaux</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
            {[
              { key: 'overview' as const, label: 'Vue d\'ensemble', icon: TrendingUp },
              { key: 'members' as const, label: 'Membres', icon: Users },
              { key: 'commissions' as const, label: 'Commissions', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <Users className="text-blue-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-600">{teamStats.totalMembers}</div>
                  <div className="text-sm text-blue-700">Total membres</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <TrendingUp className="text-green-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-green-600">{teamStats.activeMembers}</div>
                  <div className="text-sm text-green-700">Membres actifs</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <DollarSign className="text-purple-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-purple-600">{teamStats.totalVolume.toLocaleString()}</div>
                  <div className="text-sm text-purple-700">Volume total (FCFA)</div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                  <Award className="text-orange-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-orange-600">{teamStats.totalCommissions.toLocaleString()}</div>
                  <div className="text-sm text-orange-700">Commissions (FCFA)</div>
                </div>
              </div>

              {/* Répartition par niveau */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition par niveau</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">{teamStats.level1Members}</div>
                    <div className="text-sm text-green-700 mb-1">Niveau 1</div>
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Commission: 3%
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{teamStats.level2Members}</div>
                    <div className="text-sm text-blue-700 mb-1">Niveau 2</div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Commission: 2%
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{teamStats.level3Members}</div>
                    <div className="text-sm text-purple-700 mb-1">Niveau 3</div>
                    <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      Commission: 1%
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance du mois */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">Performance ce mois-ci</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {teamStats.thisMonthCommissions.toLocaleString()} FCFA
                    </div>
                    <div className="text-orange-700">Commissions gagnées</div>
                    <div className="text-sm text-orange-600 mt-1">+15% par rapport au mois dernier</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                    <div className="text-orange-700">Nouveaux membres</div>
                    <div className="text-sm text-orange-600 mt-1">Objectif: 5 membres/mois</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste des membres */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {/* Filtres */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un membre..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="1">Niveau 1</option>
                  <option value="2">Niveau 2</option>
                  <option value="3">Niveau 3</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>

              {/* Liste des membres */}
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{member.username}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>Rejoint le {member.joinDate.toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(member.level)}`}>
                          Niveau {member.level} ({getLevelCommission(member.level)})
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'active' 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {member.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Dépôts totaux</div>
                        <div className="font-semibold text-gray-800">{member.totalDeposits.toLocaleString()} FCFA</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Mises totales</div>
                        <div className="font-semibold text-gray-800">{member.totalBets.toLocaleString()} FCFA</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Commission gagnée</div>
                        <div className="font-semibold text-green-600">{member.commissionEarned.toLocaleString()} FCFA</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Parrainages directs</div>
                        <div className="font-semibold text-blue-600">{member.directReferrals}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Aucun membre trouvé</h3>
                  <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
                </div>
              )}
            </div>
          )}

          {/* Commissions */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique des commissions</h3>
                <div className="space-y-3">
                  {[
                    { date: new Date(), member: 'SportFan2024', level: 1, amount: 2500, type: 'Dépôt' },
                    { date: new Date(Date.now() - 86400000), member: 'BetMaster', level: 1, amount: 1800, type: 'Pari' },
                    { date: new Date(Date.now() - 172800000), member: 'ProGamer', level: 2, amount: 950, type: 'Dépôt' },
                    { date: new Date(Date.now() - 259200000), member: 'LuckyPlayer', level: 1, amount: 1200, type: 'Pari' },
                    { date: new Date(Date.now() - 345600000), member: 'FootballKing', level: 3, amount: 450, type: 'Dépôt' }
                  ].map((commission, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          commission.level === 1 ? 'bg-green-500' :
                          commission.level === 2 ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          {commission.level}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{commission.member}</div>
                          <div className="text-sm text-gray-600">{commission.type} • {commission.date.toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{commission.amount.toLocaleString()} FCFA</div>
                        <div className="text-xs text-gray-500">Niveau {commission.level} ({getLevelCommission(commission.level as 1 | 2 | 3)})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Guide du parrainage */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Crown className="mr-2" size={20} />
              Comment développer votre équipe ?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-semibold mb-2">🎯 Stratégies efficaces :</h5>
                <ul className="space-y-1">
                  <li>• Partagez votre code de parrainage</li>
                  <li>• Aidez vos filleuls à commencer</li>
                  <li>• Restez en contact régulièrement</li>
                  <li>• Partagez vos conseils et stratégies</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">💰 Maximiser vos gains :</h5>
                <ul className="space-y-1">
                  <li>• Niveau 1 : 3% de commission</li>
                  <li>• Niveau 2 : 2% de commission</li>
                  <li>• Niveau 3 : 1% de commission</li>
                  <li>• Commissions payées instantanément</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};