import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Match } from '../../types';
import { getCountryFlag, getLeagueCountry } from '../../utils/countries';

export const MatchManagement: React.FC = () => {
  const { matches, createMatch, updateMatch, deleteMatch, isLoading } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'finished'>('all');

  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    league: '',
    date: '',
    time: '',
    minimumBet: 1000,
    homeOdds: 2.0,
    drawOdds: 3.0,
    awayOdds: 2.5
  });

  const leagues = [
    'Venezuela Super', 'Liga Argentina B', 'Réserve de Barra', 'Liga Brasileira',
    'Liga Colombiana', 'Liga Peruana', 'Liga Uruguaya', 'Liga Chilena',
    'Ligue 1', 'La Liga', 'Serie A', 'Premier League', 'Bundesliga'
  ];

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const matchData: Omit<Match, 'id'> = {
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      homeTeamLogo: '',
      awayTeamLogo: '',
      league: formData.league,
      country: getLeagueCountry(formData.league),
      date: new Date(`${formData.date}T${formData.time}`),
      status: 'upcoming',
      minimumBet: formData.minimumBet,
      odds: {
        home: formData.homeOdds,
        draw: formData.drawOdds,
        away: formData.awayOdds
      }
    };

    if (editingMatch) {
      await updateMatch(editingMatch.id, matchData);
      setEditingMatch(null);
    } else {
      await createMatch(matchData);
    }

    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      homeTeam: '',
      awayTeam: '',
      league: '',
      date: '',
      time: '',
      minimumBet: 1000,
      homeOdds: 2.0,
      drawOdds: 3.0,
      awayOdds: 2.5
    });
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      date: match.date.toISOString().split('T')[0],
      time: match.date.toTimeString().slice(0, 5),
      minimumBet: match.minimumBet,
      homeOdds: match.odds.home,
      drawOdds: match.odds.draw,
      awayOdds: match.odds.away
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (matchId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) {
      await deleteMatch(matchId);
    }
  };

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'live': return 'text-red-600 bg-red-100';
      case 'finished': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CreateMatchModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingMatch ? 'Modifier le match' : 'Créer un nouveau match'}
            </h2>
            <button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingMatch(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipe domicile
                </label>
                <input
                  type="text"
                  value={formData.homeTeam}
                  onChange={(e) => setFormData({...formData, homeTeam: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipe extérieur
                </label>
                <input
                  type="text"
                  value={formData.awayTeam}
                  onChange={(e) => setFormData({...formData, awayTeam: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Championnat
                </label>
                <select
                  value={formData.league}
                  onChange={(e) => setFormData({...formData, league: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un championnat</option>
                  {leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mise minimum (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.minimumBet}
                  onChange={(e) => setFormData({...formData, minimumBet: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Cotes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domicile
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.homeOdds}
                    onChange={(e) => setFormData({...formData, homeOdds: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nul
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.drawOdds}
                    onChange={(e) => setFormData({...formData, drawOdds: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extérieur
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.awayOdds}
                    onChange={(e) => setFormData({...formData, awayOdds: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1.1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingMatch(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editingMatch ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des matchs</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Nouveau match</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par équipe ou championnat..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="live">En direct</option>
              <option value="finished">Terminés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Championnat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paris
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCountryFlag(match.country)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {match.minimumBet.toLocaleString()} FCFA
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{match.league}</div>
                    <div className="text-sm text-gray-500">{match.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <Calendar size={16} />
                      <span>{match.date.toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>{match.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                      {match.status === 'upcoming' ? 'À venir' : 
                       match.status === 'live' ? 'En direct' : 'Terminé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {match.odds.home} / {match.odds.draw} / {match.odds.away}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <Users size={16} />
                      <span>{match.betsCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <DollarSign size={16} />
                      <span>{(match.totalBetAmount || 0).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && <CreateMatchModal />}
    </div>
  );
};