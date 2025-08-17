import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  CreditCard, 
  Gift, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus,
  Minus,
  Copy,
  Shield,
  Star,
  Users,
  FileText,
  DollarSign,
  Bell,
  Globe,
  ArrowLeft,
  Download,
  Upload,
  Bookmark,
  Award,
  Target,
  MessageCircle,
  Calendar,
  TrendingUp,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { VipModal } from '../components/Profile/VipModal';
import { CodeModal } from '../components/Profile/CodeModal';
import { InviteModal } from '../components/Profile/InviteModal';
import { EventCenterModal } from '../components/Profile/EventCenterModal';
import { StatementModal } from '../components/Profile/StatementModal';
import { OrdersModal } from '../components/Profile/OrdersModal';
import { TransactionDetailsModal } from '../components/Profile/TransactionDetailsModal';
import { WalletManagementModal } from '../components/Profile/WalletManagementModal';
import { CurrencyModal } from '../components/Profile/CurrencyModal';
import { CountryModal } from '../components/Profile/CountryModal';
import { SecurityCenterModal } from '../components/Profile/SecurityCenterModal';
import { TeamManagementModal } from '../components/Profile/TeamManagementModal';
import { SystemAnnouncementModal } from '../components/Profile/SystemAnnouncementModal';
import { DailyRewardModal } from '../components/Profile/DailyRewardModal';
import { PaymentModal } from '../components/Payment/PaymentModal';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEventCenterModal, setShowEventCenterModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false);
  const [showWalletManagementModal, setShowWalletManagementModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showDailyRewardModal, setShowDailyRewardModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedCurrency, setSelectedCurrency] = useState<'XOF' | 'USD'>('XOF');
  const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');

  // Fonction pour déterminer le plan d'investissement
  const getInvestmentPlan = (balance: number) => {
    if (balance >= 5000000) {
      return { name: 'Platinum', rate: '5%', color: 'purple' };
    } else if (balance >= 500000) {
      return { name: 'Gold', rate: '3%', color: 'yellow' };
    } else if (balance >= 50000) {
      return { name: 'Silver', rate: '2%', color: 'gray' };
    } else {
      return { name: 'Basic', rate: '1,5%', color: 'blue' };
    }
  };

  const currentPlan = getInvestmentPlan(user?.balance || 0);

  const menuItems = [
    { 
      icon: Star, 
      label: 'Centre des événements', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      onClick: () => setShowEventCenterModal(true)
    },
    { 
      icon: Gift, 
      label: 'Privilèges VIP', 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-100',
      onClick: () => setShowVipModal(true)
    },
    { 
      icon: Bookmark, 
      label: 'Utiliser les codes', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      onClick: () => setShowCodeModal(true)
    },
    { 
      icon: BarChart3, 
      label: 'Relevé', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      onClick: () => setShowStatementModal(true)
    },
    
    { 
      icon: FileText, 
      label: 'Commandes', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      onClick: () => setShowOrdersModal(true)
    },
    { 
      icon: ArrowUpRight, 
      label: 'Détails de la transaction', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      onClick: () => setShowTransactionDetailsModal(true)
    },
    { 
      icon: Wallet, 
      label: 'Gestion du portefeuille', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      onClick: () => setShowWalletManagementModal(true)
    },
    { 
      icon: Shield, 
      label: 'Centre de sécurité', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      onClick: () => setShowSecurityModal(true)
    },
    
    { 
      icon: Users, 
      label: 'Mon équipe', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      onClick: () => setShowTeamModal(true)
    },
    { 
      icon: DollarSign, 
      label: 'Volume de l\'équipe', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      onClick: () => setShowTeamModal(true)
    },
    { 
      icon: Bell, 
      label: 'Annonce système', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      onClick: () => setShowAnnouncementModal(true)
    },
    { 
      icon: Target, 
      label: 'Inviter des amis', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      onClick: () => setShowInviteModal(true)
    },
    
    { 
      icon: HelpCircle, 
      label: 'À propos de nous', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      onClick: () => console.log('À propos')
    },
    { 
      icon: ArrowLeft, 
      label: 'Retour', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      onClick: () => window.history.back()
    },
    { 
      icon: Calendar, 
      label: 'Récompense quotidienne', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      onClick: () => setShowDailyRewardModal(true)
    },
    { 
      icon: Globe, 
      label: 'Changer de pays', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      onClick: () => setShowCountryModal(true)
    },
  ];

  const DepositModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Dépôt</h2>
          <button onClick={() => setShowDepositModal(false)} className="text-gray-500">
            ×
          </button>
        </div>
        
        {/* Plans d'investissement */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">Plans d'investissement disponibles</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>3 000 - 30 000 FCFA:</span>
              <span className="font-medium text-green-600">1,5% par jour</span>
            </div>
            <div className="flex justify-between">
              <span>50 000 - 100 000 FCFA:</span>
              <span className="font-medium text-green-600">2% par jour</span>
            </div>
            <div className="flex justify-between">
              <span>500 000 - 1 000 000 FCFA:</span>
              <span className="font-medium text-green-600">3% par jour</span>
            </div>
            <div className="flex justify-between">
              <span>5 000 000 - 10 000 000 FCFA:</span>
              <span className="font-medium text-green-600">5% par jour</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (FCFA)
            </label>
            <input
              type="number"
              placeholder="Montant minimum: 3 000"
              min="3000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-xs text-gray-500 mt-1">
              Dépôt minimum: 3 000 FCFA
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Mobile Money</option>
              <option>Orange Money</option>
              <option>MTN Money</option>
              <option>Carte bancaire</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDepositModal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Annuler
            </button>
            <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WithdrawModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Retrait</h2>
          <button onClick={() => setShowWithdrawModal(false)} className="text-gray-500">
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (FCFA)
            </label>
            <input
              type="number"
              placeholder="Montant minimum: 3 000"
              min="3000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-500 mt-1">
              Solde disponible: {user?.balance?.toLocaleString()} FCFA<br/>
              <span className="text-xs">Retrait minimum: 3 000 FCFA</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de retrait
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Mobile Money</option>
              <option>Orange Money</option>
              <option>MTN Money</option>
              <option>Virement bancaire</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Annuler
            </button>
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 text-white relative overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Contenu du header */}
        <div className="relative px-4 pt-8 sm:pt-12 pb-6 sm:pb-8">
          {/* Nom d'utilisateur */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="bg-white bg-opacity-20 rounded-full px-3 sm:px-4 py-1 sm:py-2 flex items-center space-x-2">
              <User size={14} className="sm:w-4 sm:h-4" />
              <span className="font-medium text-sm sm:text-base">{user?.username || 'Arthur'}</span>
            </div>
          </div>

          {/* Badge de niveau central */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 sm:border-4 border-white border-opacity-30">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Solde */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {user?.balance?.toLocaleString() || '50.00'} <span className="text-xs sm:text-sm opacity-75">({selectedCurrency})</span>
            </div>
            <div className="text-base sm:text-lg opacity-90">
              0.00 <span className="text-xs sm:text-sm opacity-75">(USDT)</span> &nbsp; 
              0.00 <span className="text-xs sm:text-sm opacity-75">(TRX)</span> &nbsp;
              0.00 <span className="text-xs sm:text-sm opacity-75">(DOGE)</span> &nbsp;
              0.00 <span className="text-xs sm:text-sm opacity-75">(COREDAO)</span> 
            </div>
            
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="text-xs sm:text-sm opacity-75">Solde</div>
              <button
                onClick={() => setShowCurrencyModal(true)}
                className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                Changer devise
              </button>
            </div>
          </div>

          {/* Boutons Recharger/Retrait */}
          <div className="flex justify-center space-x-6 sm:space-x-8 mb-4 sm:mb-6">
            <button
              onClick={() => {
                setPaymentType('deposit');
                setShowPaymentModal(true);
              }}
              className="flex flex-col items-center space-y-1 sm:space-y-2 bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 min-w-[70px] sm:min-w-[80px] hover:bg-opacity-20 transition-all"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Download size={14} className="sm:w-4 sm:h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium">recharger</span>
            </button>
            
            <button
              onClick={() => {
                setPaymentType('withdrawal');
                setShowPaymentModal(true);
              }}
              className="flex flex-col items-center space-y-1 sm:space-y-2 bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 min-w-[70px] sm:min-w-[80px] hover:bg-opacity-20 transition-all"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Upload size={14} className="sm:w-4 sm:h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium">Retrait</span>
            </button>
          </div>
        </div>

        {/* Forme courbe en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-6 sm:h-8 fill-gray-50">
            <path d="M0,120 C240,60 480,60 720,80 C960,100 1200,100 1440,80 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* Grille des fonctionnalités */}
      <div className="px-3 sm:px-4 -mt-3 sm:-mt-4 relative z-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-1 sm:space-y-2 min-h-[80px] sm:min-h-[100px]"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon size={16} className={`sm:w-5 sm:h-5 ${item.color}`} />
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan d'investissement actuel */}
      <div className="px-3 sm:px-4 mt-4 sm:mt-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Votre plan d'investissement</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs sm:text-sm text-gray-600">Plan {currentPlan.name}</div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {currentPlan.rate} par jour
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-600">Gain estimé/jour</div>
                <div className="text-base sm:text-lg font-bold text-blue-600">
                  {user?.balance ? Math.floor(user.balance * (
                    user.balance >= 5000000 ? 0.05 :
                    user.balance >= 500000 ? 0.03 :
                    user.balance >= 50000 ? 0.02 : 0.015
                  )).toLocaleString() : '0'} FCFA
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-xs text-gray-500">
            Jours de travail: Lundi au Samedi • Dimanche: repos
          </div>
        </div>
      </div>

      {/* Déconnexion */}
      <div className="px-3 sm:px-4 mt-4 sm:mt-6 mb-4 sm:mb-6">
        <button
          onClick={logout}
          className="w-full bg-red-50 text-red-600 py-2 sm:py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Déconnexion</span>
        </button>
      </div>

      {showDepositModal && <DepositModal />}
      {showWithdrawModal && <WithdrawModal />}
      {showVipModal && <VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />}
      {showCodeModal && <CodeModal isOpen={showCodeModal} onClose={() => setShowCodeModal(false)} />}
      {showInviteModal && <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />}
      {showEventCenterModal && <EventCenterModal isOpen={showEventCenterModal} onClose={() => setShowEventCenterModal(false)} />}
      {showStatementModal && <StatementModal isOpen={showStatementModal} onClose={() => setShowStatementModal(false)} />}
      {showOrdersModal && <OrdersModal isOpen={showOrdersModal} onClose={() => setShowOrdersModal(false)} />}
      {showTransactionDetailsModal && <TransactionDetailsModal isOpen={showTransactionDetailsModal} onClose={() => setShowTransactionDetailsModal(false)} />}
      {showWalletManagementModal && <WalletManagementModal isOpen={showWalletManagementModal} onClose={() => setShowWalletManagementModal(false)} />}
      {showCurrencyModal && <CurrencyModal isOpen={showCurrencyModal} onClose={() => setShowCurrencyModal(false)} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />}
      {showCountryModal && <CountryModal isOpen={showCountryModal} onClose={() => setShowCountryModal(false)} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />}
      {showSecurityModal && <SecurityCenterModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />}
      {showTeamModal && <TeamManagementModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />}
      {showAnnouncementModal && <SystemAnnouncementModal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} />}
      {showDailyRewardModal && <DailyRewardModal isOpen={showDailyRewardModal} onClose={() => setShowDailyRewardModal(false)} />}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          type={paymentType}
        />
      )}

      <BottomNav />
    </div>
  );
};