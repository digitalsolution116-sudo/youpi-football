import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, CreditCard, Link, Settings, Eye, EyeOff, TrendingUp, BarChart3 } from 'lucide-react';
import { PaymentAggregator } from '../../types/admin';
import { supabase } from '../../lib/supabase';

export const PaymentAggregators: React.FC = () => {
  const [aggregators, setAggregators] = useState<PaymentAggregator[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAggregator, setEditingAggregator] = useState<PaymentAggregator | null>(null);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'gateway' as 'payment_link' | 'gateway' | 'api',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    supportedCountries: [''],
    supportedCurrencies: [''],
    feesPercentage: 0,
    isActive: true
  });

  useEffect(() => {
    loadAggregators();
  }, []);

  const loadAggregators = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payment_aggregators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAggregators: PaymentAggregator[] = (data || []).map(agg => ({
        id: agg.id,
        name: agg.name,
        type: agg.type,
        apiKey: agg.api_key,
        secretKey: agg.secret_key,
        webhookUrl: agg.webhook_url,
        supportedCountries: agg.supported_countries || [],
        supportedCurrencies: agg.supported_currencies || [],
        feesPercentage: agg.fees_percentage,
        isActive: agg.is_active,
        configuration: agg.configuration
      }));

      setAggregators(formattedAggregators);
    } catch (error) {
      console.error('Erreur chargement agrégateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const aggregatorData = {
        name: formData.name,
        type: formData.type,
        api_key: formData.apiKey,
        secret_key: formData.secretKey,
        webhook_url: formData.webhookUrl,
        supported_countries: formData.supportedCountries.filter(c => c.trim()),
        supported_currencies: formData.supportedCurrencies.filter(c => c.trim()),
        fees_percentage: formData.feesPercentage,
        is_active: formData.isActive
      };

      if (editingAggregator) {
        const { error } = await supabase
          .from('payment_aggregators')
          .update(aggregatorData)
          .eq('id', editingAggregator.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payment_aggregators')
          .insert(aggregatorData);

        if (error) throw error;
      }

      await loadAggregators();
      setShowCreateModal(false);
      setEditingAggregator(null);
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde agrégateur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'gateway',
      apiKey: '',
      secretKey: '',
      webhookUrl: '',
      supportedCountries: [''],
      supportedCurrencies: [''],
      feesPercentage: 0,
      isActive: true
    });
  };

  const handleEdit = (aggregator: PaymentAggregator) => {
    setEditingAggregator(aggregator);
    setFormData({
      name: aggregator.name,
      type: aggregator.type,
      apiKey: aggregator.apiKey || '',
      secretKey: aggregator.secretKey || '',
      webhookUrl: aggregator.webhookUrl || '',
      supportedCountries: aggregator.supportedCountries.length > 0 ? aggregator.supportedCountries : [''],
      supportedCurrencies: aggregator.supportedCurrencies.length > 0 ? aggregator.supportedCurrencies : [''],
      feesPercentage: aggregator.feesPercentage,
      isActive: aggregator.isActive
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (aggregatorId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agrégateur ?')) {
      try {
        const { error } = await supabase
          .from('payment_aggregators')
          .delete()
          .eq('id', aggregatorId);

        if (error) throw error;
        await loadAggregators();
      } catch (error) {
        console.error('Erreur suppression agrégateur:', error);
      }
    }
  };

  const toggleActive = async (aggregatorId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_aggregators')
        .update({ is_active: !isActive })
        .eq('id', aggregatorId);

      if (error) throw error;
      await loadAggregators();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const getTypeIcon = (type: PaymentAggregator['type']) => {
    switch (type) {
      case 'payment_link': return <Link className="text-blue-600" size={20} />;
      case 'gateway': return <CreditCard className="text-green-600" size={20} />;
      case 'api': return <Settings className="text-purple-600" size={20} />;
      default: return <Globe className="text-gray-600" size={20} />;
    }
  };

  const getTypeColor = (type: PaymentAggregator['type']) => {
    switch (type) {
      case 'payment_link': return 'text-blue-600 bg-blue-100';
      case 'gateway': return 'text-green-600 bg-green-100';
      case 'api': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CreateAggregatorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingAggregator ? 'Modifier l\'agrégateur' : 'Nouvel agrégateur de paiement'}
            </h2>
            <button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingAggregator(null);
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
                  Nom de l'agrégateur
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: PayPal, Stripe, Flutterwave"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="payment_link">Lien de paiement</option>
                  <option value="gateway">Passerelle de paiement</option>
                  <option value="api">API directe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé API
                </label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  placeholder="Clé API publique"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé secrète
                </label>
                <input
                  type="password"
                  value={formData.secretKey}
                  onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                  placeholder="Clé secrète"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Webhook
                </label>
                <input
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                  placeholder="https://votre-site.com/webhook"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays supportés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.supportedCountries.join(', ')}
                  onChange={(e) => setFormData({...formData, supportedCountries: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="France, Côte d'Ivoire, Nigeria"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devises supportées
                </label>
                <input
                  type="text"
                  value={formData.supportedCurrencies.join(', ')}
                  onChange={(e) => setFormData({...formData, supportedCurrencies: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="XOF, USD, EUR, NGN"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frais (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.feesPercentage}
                  onChange={(e) => setFormData({...formData, feesPercentage: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Actif
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAggregator(null);
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
                {editingAggregator ? 'Modifier' : 'Créer'}
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
          <h1 className="text-2xl font-bold text-gray-800">Agrégateurs de paiement</h1>
          <p className="text-gray-600">Gérez les moyens de paiement externes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Nouvel agrégateur</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agrégateurs actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {aggregators.filter(a => a.isActive).length}
              </p>
            </div>
            <CreditCard className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total agrégateurs</p>
              <p className="text-2xl font-bold text-blue-600">{aggregators.length}</p>
            </div>
            <Globe className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pays couverts</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(aggregators.flatMap(a => a.supportedCountries)).size}
              </p>
            </div>
            <Globe className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Frais moyens</p>
              <p className="text-2xl font-bold text-orange-600">
                {aggregators.length > 0 
                  ? (aggregators.reduce((sum, a) => sum + a.feesPercentage, 0) / aggregators.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <BarChart3 className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Liste des agrégateurs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agrégateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays/Devises
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aggregators.map((aggregator) => (
                <tr key={aggregator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(aggregator.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{aggregator.name}</div>
                        <div className="text-sm text-gray-500">
                          {aggregator.apiKey && (
                            <span className="font-mono">
                              {showSecrets[aggregator.id] 
                                ? aggregator.apiKey 
                                : `${aggregator.apiKey.slice(0, 8)}...`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(aggregator.type)}`}>
                      {aggregator.type === 'payment_link' ? 'Lien' : 
                       aggregator.type === 'gateway' ? 'Passerelle' : 'API'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {aggregator.supportedCountries.slice(0, 2).join(', ')}
                      {aggregator.supportedCountries.length > 2 && ` +${aggregator.supportedCountries.length - 2}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {aggregator.supportedCurrencies.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {aggregator.feesPercentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(aggregator.id, aggregator.isActive)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        aggregator.isActive 
                          ? 'text-green-600 bg-green-100' 
                          : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {aggregator.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setShowSecrets(prev => ({
                          ...prev,
                          [aggregator.id]: !prev[aggregator.id]
                        }))}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {showSecrets[aggregator.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(aggregator)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(aggregator.id)}
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

      {showCreateModal && <CreateAggregatorModal />}
    </div>
  );
};