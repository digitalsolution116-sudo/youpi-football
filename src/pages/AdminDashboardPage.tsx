import React, { useState } from 'react';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { Dashboard } from '../components/Admin/Dashboard';
import { UserManagement } from '../components/Admin/UserManagement';
import { MatchManagement } from '../components/Admin/MatchManagement';
import { TransactionManagement } from '../components/Admin/TransactionManagement';
import { SystemSettings } from '../components/Admin/SystemSettings';
import { PredictionManagement } from '../components/Admin/PredictionManagement';
import { VipManagement } from '../components/Admin/VipManagement';
import { PaymentAggregators } from '../components/Admin/PaymentAggregators';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'matches':
        return <MatchManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'predictions':
        return <PredictionManagement />;
      case 'vip':
        return <VipManagement />;
      case 'payments':
        return <PaymentAggregators />;
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Analyses et Rapports</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-400 text-lg mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Analyses avancées</h2>
              <p className="text-gray-600">
                Cette section contiendra des graphiques détaillés, des rapports de performance,
                et des analyses prédictives pour optimiser la plateforme.
              </p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Sécurité</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-400 text-lg mb-4">🔒</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestion de la sécurité</h2>
              <p className="text-gray-600">
                Logs de sécurité, gestion des accès, détection de fraude,
                et paramètres de sécurité avancés.
              </p>
            </div>
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};