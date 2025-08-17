import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Crown,
  Globe
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'matches', label: 'Matchs', icon: Calendar },
  { id: 'predictions', label: 'Prédictions', icon: Target },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'vip', label: 'Système VIP', icon: Crown },
  { id: 'payments', label: 'Agrégateurs', icon: Globe },
  { id: 'analytics', label: 'Analyses', icon: BarChart3 },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const { adminUser, logoutAdmin } = useAdmin();

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-gray-400">{adminUser?.username}</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title={isCollapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};