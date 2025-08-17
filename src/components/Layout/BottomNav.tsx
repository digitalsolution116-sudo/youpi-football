import React from 'react';
import { Calendar, Trophy, History, User, Home, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'events', label: 'Sport', icon: Calendar, path: '/events', gradient: 'from-blue-500 to-blue-600' },
  { id: 'bets', label: 'Mes Paris', icon: Trophy, path: '/bets', gradient: 'from-green-500 to-green-600' },
  { id: 'history', label: 'Historique', icon: History, path: '/history', gradient: 'from-purple-500 to-purple-600' },
  { id: 'profile', label: 'Compte', icon: User, path: '/profile', gradient: 'from-orange-500 to-orange-600' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl safe-area-pb">
      <div className="flex justify-around py-1 sm:py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-0.5 sm:space-y-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`p-0.5 sm:p-1 rounded-lg ${isActive ? 'bg-white/20' : ''}`}>
                <Icon size={18} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs font-semibold truncate max-w-[60px] sm:max-w-none">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-white rounded-full hidden sm:block"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};