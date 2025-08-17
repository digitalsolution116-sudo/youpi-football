import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
  Key
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { UserManagement as UserType } from '../../types/admin';
import { UserCredentialsModal } from './UserCredentialsModal';

export const UserManagement: React.FC = () => {
  const { users, updateUser, isLoading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (userId: string, newStatus: UserType['status']) => {
    await updateUser(userId, { status: newStatus });
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ? Cette action est irréversible.`)) {
      try {
        // Supprimer l'utilisateur de Supabase Auth et de la table users
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) console.warn('Erreur suppression auth:', error);
        
        // La suppression en cascade se chargera du reste
        await updateUser(userId, { status: 'deleted' as any });
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };
  const getStatusColor = (status: UserType['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: UserType['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const UserModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Détails utilisateur</h2>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <User size={16} className="text-gray-400" />
                    <span>{selectedUser.username}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Phone size={16} className="text-gray-400" />
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => handleStatusChange(selectedUser.id, e.target.value as UserType['status'])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Actif</option>
                    <option value="suspended">Suspendu</option>
                    <option value="banned">Banni</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Statistiques</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Solde actuel:</span>
                      <span className="font-medium">{selectedUser.balance.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total paris:</span>
                      <span className="font-medium">{selectedUser.totalBets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total dépôts:</span>
                      <span className="font-medium">{selectedUser.totalDeposits.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total retraits:</span>
                      <span className="font-medium">{selectedUser.totalWithdrawals.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Niveau de risque</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedUser.riskLevel)}`}>
                    {selectedUser.riskLevel === 'low' ? 'Faible' : 
                     selectedUser.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes administrateur</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Ajouter des notes..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <div className="text-sm text-gray-600">
          {filteredUsers.length} utilisateur(s) trouvé(s)
        </div>
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
              placeholder="Rechercher par nom, email ou téléphone..."
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
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="banned">Bannis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.country}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.balance.toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Actif' : 
                       user.status === 'suspended' ? 'Suspendu' : 'Banni'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 ${getRiskColor(user.riskLevel)}`}>
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">
                        {user.riskLevel === 'low' ? 'Faible' : 
                         user.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActivity.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCredentialsModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
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

      {showUserModal && <UserModal />}
      {showCredentialsModal && selectedUser && (
        <UserCredentialsModal
          user={selectedUser}
          isOpen={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false);
            setSelectedUser(null);
          }}
          onUpdate={() => {
            // Recharger les données
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};