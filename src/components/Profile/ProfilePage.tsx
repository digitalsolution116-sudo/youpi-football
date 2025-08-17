@@ .. @@
 import { VipModal } from '../components/Profile/VipModal';
 import { CodeModal } from '../components/Profile/CodeModal';
 import { InviteModal } from '../components/Profile/InviteModal';
 import { EventCenterModal } from '../components/Profile/EventCenterModal';
 import { StatementModal } from '../components/Profile/StatementModal';
 import { OrdersModal } from '../components/Profile/OrdersModal';
 import { TransactionDetailsModal } from '../components/Profile/TransactionDetailsModal';
 import { WalletManagementModal } from '../components/Profile/WalletManagementModal';
+import { CurrencyModal } from '../components/Profile/CurrencyModal';
+import { CountryModal } from '../components/Profile/CountryModal';
+import { SecurityCenterModal } from '../components/Profile/SecurityCenterModal';
+import { TeamManagementModal } from '../components/Profile/TeamManagementModal';
+import { SystemAnnouncementModal } from '../components/Profile/SystemAnnouncementModal';
+import { DailyRewardModal } from '../components/Profile/DailyRewardModal';

 export const ProfilePage: React.FC = () => {
   const { user, logout } = useAuth();
@@ .. @@
   const [showOrdersModal, setShowOrdersModal] = useState(false);
   const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false);
   const [showWalletManagementModal, setShowWalletManagementModal] = useState(false);
+  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
+  const [showCountryModal, setShowCountryModal] = useState(false);
+  const [showSecurityModal, setShowSecurityModal] = useState(false);
+  const [showTeamModal, setShowTeamModal] = useState(false);
+  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
+  const [showDailyRewardModal, setShowDailyRewardModal] = useState(false);
+  const [selectedCurrency, setSelectedCurrency] = useState<'XOF' | 'USD'>('XOF');
+  const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');

@@ .. @@
     { 
       icon: Shield, 
       label: 'Centre de sécurité', 
       color: 'text-blue-600', 
       bgColor: 'bg-blue-100',
-      onClick: () => console.log('Centre sécurité')
+      onClick: () => setShowSecurityModal(true)
     },
     
     { 
       icon: Users, 
       label: 'Mon équipe', 
       color: 'text-red-600', 
       bgColor: 'bg-red-100',
-      onClick: () => console.log('Mon équipe')
+      onClick: () => setShowTeamModal(true)
     },
     { 
       icon: DollarSign, 
       label: 'Volume de l\'équipe', 
       color: 'text-blue-600', 
       bgColor: 'bg-blue-100',
-      onClick: () => console.log('Volume équipe')
+      onClick: () => setShowTeamModal(true)
     },
     { 
       icon: Bell, 
       label: 'Annonce système', 
       color: 'text-yellow-600', 
       bgColor: 'bg-yellow-100',
-      onClick: () => console.log('Annonces')
+      onClick: () => setShowAnnouncementModal(true)
     },
     { 
       icon: Target, 
@@ -142,7 +159,7 @@ export const ProfilePage: React.FC = () => {
     { 
       icon: Calendar, 
       label: 'Récompense quotidienne', 
       color: 'text-yellow-600', 
       bgColor: 'bg-yellow-100',
-      onClick: () => console.log('Récompenses')
+      onClick: () => setShowDailyRewardModal(true)
     },
     { 
       icon: Globe, 
       label: 'Changer de pays', 
       color: 'text-orange-600', 
       bgColor: 'bg-orange-100',
-      onClick: () => console.log('Changer pays')
+      onClick: () => setShowCountryModal(true)
     },
   ];

@@ .. @@
           {/* Solde */}
           <div className="text-center mb-6 sm:mb-8">
             <div className="text-xl sm:text-2xl font-bold mb-1">
-              {user?.balance?.toLocaleString() || '50.00'} <span className="text-xs sm:text-sm opacity-75">(XOF)</span>
+              {user?.balance?.toLocaleString() || '50.00'} <span className="text-xs sm:text-sm opacity-75">({selectedCurrency})</span>
             </div>
             <div className="text-base sm:text-lg opacity-90">
               0.00 <span className="text-xs sm:text-sm opacity-75">(USDT)</span> &nbsp; 
               0.00 <span className="text-xs sm:text-sm opacity-75">(TRX)</span> &nbsp;
               0.00 <span className="text-xs sm:text-sm opacity-75">(DOGE)</span> &nbsp;
               0.00 <span className="text-xs sm:text-sm opacity-75">(COREDAO)</span> 
-              
             </div>
             
-            <div className="text-xs sm:text-sm opacity-75 mt-1">Solde</div>
+            <div className="flex items-center justify-center space-x-2 mt-2">
+              <div className="text-xs sm:text-sm opacity-75">Solde</div>
+              <button
+                onClick={() => setShowCurrencyModal(true)}
+                className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-colors"
+              >
+                Changer devise
+              </button>
+            </div>
           </div>

@@ .. @@
       {showOrdersModal && <OrdersModal isOpen={showOrdersModal} onClose={() => setShowOrdersModal(false)} />}
       {showTransactionDetailsModal && <TransactionDetailsModal isOpen={showTransactionDetailsModal} onClose={() => setShowTransactionDetailsModal(false)} />}
       {showWalletManagementModal && <WalletManagementModal isOpen={showWalletManagementModal} onClose={() => setShowWalletManagementModal(false)} />}
+      {showCurrencyModal && <CurrencyModal isOpen={showCurrencyModal} onClose={() => setShowCurrencyModal(false)} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />}
+      {showCountryModal && <CountryModal isOpen={showCountryModal} onClose={() => setShowCountryModal(false)} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />}
+      {showSecurityModal && <SecurityCenterModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />}
+      {showTeamModal && <TeamManagementModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />}
+      {showAnnouncementModal && <SystemAnnouncementModal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} />}
+      {showDailyRewardModal && <DailyRewardModal isOpen={showDailyRewardModal} onClose={() => setShowDailyRewardModal(false)} />}

       <BottomNav />
     </div>