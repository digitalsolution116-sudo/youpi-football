import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, TrendingUp, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'bet_won' | 'bet_lost' | 'refund' | 'bonus' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  amount?: number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'bet_won',
    title: 'Pari gagné !',
    message: 'Votre pari sur FC Porto Gaza vs Zuliano a été gagné',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    amount: 105000
  },
  {
    id: '2',
    type: 'refund',
    title: 'Remboursement effectué',
    message: 'Vous avez été remboursé 80% de votre pari perdu',
    timestamp: new Date(Date.now() - 1800000),
    read: false,
    amount: 40000
  },
  {
    id: '3',
    type: 'bonus',
    title: 'Bonus de parrainage',
    message: 'Vous avez reçu un bonus pour avoir parrainé un ami',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    amount: 25000
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Promotion spéciale',
    message: 'Profitez de 20% de bonus sur votre prochain dépôt',
    timestamp: new Date(Date.now() - 7200000),
    read: true
  }
];

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bet_won':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'bet_lost':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'refund':
        return <Check className="text-blue-500" size={20} />;
      case 'bonus':
      case 'promotion':
        return <Gift className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border z-50 max-h-96 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.amount && (
                            <p className="text-sm font-semibold text-green-600 mt-1">
                              +{notification.amount.toLocaleString()} FCFA
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};