import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AdminPrediction } from '../../types/admin';
import { getCountryFlag } from '../../utils/countries';
import { supabase } from '../../lib/supabase';

export const PredictionManagement: React.FC = () => {
  const [predictions, setPredictions] = useState<AdminPrediction[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<AdminPrediction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'settled'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    league: '',
    country: 'France',
    date: '',
    time: '',
    prediction: 'home' as 'home' | 'draw' | 'away',
    confidenceLevel: 3,
    homeOdds: 2.0,
    drawOdds: 3.0,
    awayOdds: 2.5,
    minimumBet: 1000,
    maximumBet: 50000
  });

  const leagues = [
    'Ligue 1', 'La Liga', 'Serie A', 'Premier League', 'Bundesliga',
    'Liga Portuguesa', 'Eredivisie', 'Pro League', 'Liga MX',
    'Liga Argentina', 'Liga Brasileira', 'Liga Colombiana'
  ];

  const countries = [
    'France', 'Espagne', 'Italie', 'Angleterre', 'Allemagne',
    'Portugal', 'Pays-Bas', 'Belgique', 'Mexique', 'Argentine',
    'Brésil', 'Colombie', 'Côte d\'Ivoire', 'Sénégal', 'Nigeria',
    'Ghana', 'Cameroun', 'Maroc', 'Algérie', 'Tunisie'
  ];

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin_predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPredictions: AdminPrediction[] = (data || []).map(pred => ({
        id: pred.id,
        adminId: pred.admin_id,
        homeTeam: pred.home_team,
        awayTeam: pred.away_team,
        league: pred.league,
        country: pred.country,
        matchDate: new Date(pred.match_date),
        prediction: pred.prediction,
        confidenceLevel: pred.confidence_level,
        odds: {
          home: pred.odds_home,
          draw: pred.odds_draw,
          away: pred.odds_away
        },
        minimumBet: pred.minimum_bet,
        maximumBet: pred.maximum_bet,
        refundPercentage: pred.refund_percentage,
        status: pred.status,
        result: pred.result,
        totalBets: pred.total_bets,
        totalAmount: pred.total_amount,
        createdAt: new Date(pred.created_at),
        updatedAt: new Date(pred.updated_at)
      }));

      setPredictions(formattedPredictions);
    } catch (error) {
      console.error('Erreur chargement prédictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prediction.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prediction.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prediction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const adminData = JSON.parse(localStorage.getItem('auth_admin') || '{}');
      
      const { data, error } = await supabase.rpc('create_admin_prediction', {
        p_admin_id: adminData.id,
        p_home_team: formData.homeTeam,
        p_away_team: formData.awayTeam,
        p_league: formData.league,
        p_country: formData.country,
        p_match_date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        p_prediction: formData.prediction,
        p_confidence: formData.confidenceLevel,
        p_odds_home: formData.homeOdds,
        p_odds_draw: formData.drawOdds,
        p_odds_away: formData.awayOdds
      });

      if (error) throw error;

      await loadPredictions();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur création prédiction:', error);
      alert('Erreur lors de la création de la prédiction');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeam: '',
      awayTeam: '',
      league: '',
      country: 'France',
      date: '',
      time: '',
      prediction: 'home',
      confidenceLevel: 3,
      homeOdds: 2.0,
      drawOdds: 3.0,
      awayOdds: 2.5,
      minimumBet: 1000,
      maximumBet: 50000
    });
  };

  const handleDelete = async (predictionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prédiction ?')) {
      try {
        const { error } = await supabase
          .from('admin_predictions')
          .delete()
          .eq('id', predictionId);

        if (error) throw error;
        await loadPredictions();
      } catch (error) {
        console.error('Erreur suppression prédiction:', error);
      }
    }
  };

  const getStatusColor = (status: AdminPrediction['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-yellow-600 bg-yellow-100';
      case 'settled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const CreatePredictionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Créer une prédiction
            </h2>
            <button 
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  Pays
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Prédiction</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Résultat prédit
                    </label>
                    <select
                      value={formData.prediction}
                      onChange={(e) => setFormData({...formData, prediction: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="home">Victoire domicile</option>
                      <option value="draw">Match nul</option>
                      <option value="away">Victoire extérieur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau de confiance (1-5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.confidenceLevel}
                      onChange={(e) => setFormData({...formData, confidenceLevel: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Faible</span>
                      <span className={getConfidenceColor(formData.confidenceLevel)}>
                        {formData.confidenceLevel}/5
                      </span>
                      <span>Élevé</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Limites de paris</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mise minimum (FCFA)
                    </label>
                    <input
                      type="number"
                      value={formData.minimumBet}
                      onChange={(e) => setFormData({...formData, minimumBet: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mise maximum (FCFA)
                    </label>
                    <input
                      type="number"
                      value={formData.maximumBet}
                      onChange={(e) => setFormData({...formData, maximumBet: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Cotes (pour information)</h3>
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
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">📋 Système de paris inversés</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Remboursement de 6% en cas de perte</li>
                <li>• Gains basés sur le niveau VIP de l'utilisateur</li>
                <li>• Maximum 2 paris par jour par utilisateur</li>
                <li>• Prédictions visibles uniquement après publication</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
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
                Publier la prédiction
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Prédictions Admin</h1>
          <p className="text-gray-600">Créez et gérez vos prédictions de matchs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Nouvelle prédiction</span>
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prédictions actives</p>
              <p className="text-2xl font-bold text-green-600">
                {predictions.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total paris</p>
              <p className="text-2xl font-bold text-blue-600">
                {predictions.reduce((sum, p) => sum + p.totalBets, 0)}
              </p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Volume total</p>
              <p className="text-2xl font-bold text-purple-600">
                {predictions.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()} F
              </p>
            </div>
            <DollarSign className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de réussite</p>
              <p className="text-2xl font-bold text-orange-600">85%</p>
            </div>
            <Award className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filtres */}
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
              <option value="active">Actives</option>
              <option value="closed">Fermées</option>
              <option value="settled">Réglées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des prédictions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prédiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
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
              {filteredPredictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCountryFlag(prediction.country)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                        <div className="text-sm text-gray-500">{prediction.league}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-600">
                        {prediction.prediction === 'home' ? 'Domicile' : 
                         prediction.prediction === 'away' ? 'Extérieur' : 'Nul'}
                      </span>
                      <span className={`text-sm ${getConfidenceColor(prediction.confidenceLevel)}`}>
                        ({prediction.confidenceLevel}/5)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {prediction.matchDate.toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prediction.matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prediction.status)}`}>
                      {prediction.status === 'active' ? 'Active' : 
                       prediction.status === 'closed' ? 'Fermée' : 'Réglée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prediction.totalBets} paris</div>
                    <div className="text-sm text-gray-500">{prediction.totalAmount.toLocaleString()} F</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDelete(prediction.id)}
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

      {showCreateModal && <CreatePredictionModal />}
    </div>
  );
};