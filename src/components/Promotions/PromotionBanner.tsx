import React, { useState, useEffect } from 'react';
import { Gift, X, Star, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'bonus' | 'cashback' | 'free_bet' | 'deposit_bonus';
  value: number;
  validUntil: Date;
  minDeposit?: number;
  code?: string;
  isActive: boolean;
  image?: string;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Bonus de Bienvenue',
    description: 'Recevez 100% de bonus sur votre premier dépôt',
    type: 'deposit_bonus',
    value: 100,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    minDeposit: 10000,
    code: 'WELCOME100',
    isActive: true
  },
  {
    id: '2',
    title: 'Programme de Parrainage',
    description: 'Gagnez jusqu\'à 3% sur 3 niveaux de parrainage',
    type: 'cashback',
    value: 3,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    id: '3',
    title: 'Investissement Quotidien',
    description: 'Jusqu\'à 5% de rendement par jour selon votre plan',
    type: 'free_bet',
    value: 5,
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

export const PromotionBanner: React.FC = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [promotions] = useState(mockPromotions.filter(p => p.isActive));

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % promotions.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  if (!isVisible || promotions.length === 0) return null;

  const promotion = promotions[currentPromo];

  const getPromotionIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'bonus':
      case 'deposit_bonus':
        return <Gift className="text-yellow-500" size={24} />;
      case 'cashback':
        return <Star className="text-blue-500" size={24} />;
      case 'free_bet':
        return <Users className="text-green-500" size={24} />;
      default:
        return <Gift className="text-purple-500" size={24} />;
    }
  };

  const getPromotionColor = (type: Promotion['type']) => {
    switch (type) {
      case 'bonus':
      case 'deposit_bonus':
        return 'from-yellow-500 to-orange-500';
      case 'cashback':
        return 'from-blue-500 to-purple-500';
      case 'free_bet':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`relative bg-gradient-to-r ${getPromotionColor(promotion.type)} text-white p-4 mx-4 mt-4 rounded-xl shadow-lg overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {getPromotionIcon(promotion.type)}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{promotion.title}</h3>
              <p className="text-sm opacity-90">{promotion.description}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                {promotion.code && (
                  <div className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                    Code: {promotion.code}
                  </div>
                )}
                
                <div className="flex items-center space-x-1 text-xs">
                  <Clock size={12} />
                  <span>Expire dans {formatTimeRemaining(promotion.validUntil)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold">
                {promotion.type === 'free_bet' 
                  ? `${promotion.value.toLocaleString()} FCFA`
                  : `${promotion.value}%`
                }
              </div>
              {promotion.minDeposit && (
                <div className="text-xs opacity-75">
                  Min: {promotion.minDeposit.toLocaleString()} FCFA
                </div>
              )}
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        {promotions.length > 1 && (
          <div className="flex space-x-1 mt-3 justify-center">
            {promotions.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-all ${
                  index === currentPromo ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -bottom-2 -right-2 bg-white text-gray-800 px-4 py-2 rounded-tl-xl rounded-br-xl font-semibold text-sm shadow-lg"
        >
          Profiter maintenant
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};