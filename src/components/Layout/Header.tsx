import React from 'react';
import { User, Menu, Trophy, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from '../Notifications/NotificationCenter';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onMenuClick }) => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  useEffect(() => {
    // Surveiller l'état de la connexion
    const checkConnection = () => {
      if (navigator.onLine) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
      {connectionStatus === 'disconnected' && (
        <div className="bg-red-600 text-white text-center py-2 text-sm">
          ⚠️ Connexion perdue - Reconnexion automatique...
        </div>
      )}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onMenuClick && (
              <button onClick={onMenuClick} className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Menu size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Trophy className="text-yellow-300" size={20} className="sm:w-6 sm:h-6" />
              <h1 className="text-lg sm:text-xl font-bold truncate">YOUPI FOOTBALL</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <NotificationCenter />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-4 py-1 sm:py-2 border border-white/20">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Zap className="text-yellow-300" size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-bold">{user?.balance?.toLocaleString() || '0'}</span>
                <span className="text-xs opacity-75 hidden sm:inline">XOF</span>
              </div>
              {user?.vipLevel && user.vipLevel !== 'Standard' && (
                <div className="flex items-center space-x-1">
                  <Crown className="text-yellow-300" size={12} />
                  <span className="text-xs font-bold">{user.vipLevel}</span>
                </div>
              )}
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User size={14} className="sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barre de progression ou indicateur */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
    </header>
  );
};