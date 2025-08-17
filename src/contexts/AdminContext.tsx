import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminStats, MatchManagement, UserManagement, TransactionManagement, SystemSettings } from '../types/admin';
import { Match } from '../types';
import { adminService, adminManagementService, matchService } from '../services/api';

interface AdminContextType {
  adminUser: AdminUser | null;
  stats: AdminStats | null;
  matches: MatchManagement[];
  users: UserManagement[];
  transactions: TransactionManagement[];
  settings: SystemSettings | null;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => Promise<boolean>;
  createMatch: (match: Omit<Match, 'id'>) => Promise<boolean>;
  deleteMatch: (matchId: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<UserManagement>) => Promise<boolean>;
  updateTransaction: (transactionId: string, updates: Partial<TransactionManagement>) => Promise<boolean>;
  updateSettings: (settings: Partial<SystemSettings>) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [matches, setMatches] = useState<MatchManagement[]>([]);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [transactions, setTransactions] = useState<TransactionManagement[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      // Vérifier la session admin locale
      const localAdmin = localStorage.getItem('auth_admin');
      if (localAdmin) {
        const adminData = JSON.parse(localAdmin);
        setAdminUser({
          id: adminData.id,
          username: adminData.username,
          email: adminData.email,
          role: adminData.role || (adminData.username === 'admin' ? 'super_admin' : 'moderator'),
          permissions: adminData.permissions || (adminData.username === 'admin' ? ['all'] : ['users', 'matches']),
          createdAt: new Date(adminData.created_at || Date.now())
        });
        await loadAdminData();
      }
    } catch (error) {
      console.error('Erreur vérification session admin:', error);
    }
  };

  const loadAdminData = async () => {
    try {
      setIsLoading(true);

      // Charger les statistiques
      const statsData = await adminService.getStats();
      setStats(statsData);

      // Charger les matchs
      const matchesData = await matchService.getMatches();
      const formattedMatches = matchesData.map(match => ({
        id: match.id,
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        homeTeamLogo: match.home_team_logo,
        awayTeamLogo: match.away_team_logo,
        country: match.country,
        league: match.league,
        status: match.status,
        date: new Date(match.match_date),
        minimumBet: match.minimum_bet,
        odds: {
          home: match.odds_home,
          draw: match.odds_draw,
          away: match.odds_away
        },
        createdBy: '',
        betsCount: match.bets_count || 0,
        totalBetAmount: match.total_bet_amount || 0
      }));
      setMatches(formattedMatches);

      // Charger les utilisateurs
      const usersData = await adminManagementService.getUsers();
      const formattedUsers = usersData.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        country: user.country,
        status: user.status || 'active',
        createdAt: new Date(user.created_at),
        totalBets: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        lastActivity: new Date(),
        riskLevel: 'low' as const
      }));
      setUsers(formattedUsers);

      // Charger les transactions
      const transactionsData = await adminManagementService.getTransactions();
      const formattedTransactions = transactionsData.map(transaction => ({
        id: transaction.id,
        userId: transaction.user_id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        description: transaction.description,
        createdAt: new Date(transaction.created_at),
        updatedAt: new Date(transaction.updated_at),
        userName: transaction.users?.username || 'Utilisateur inconnu',
        userPhone: transaction.users?.phone || 'N/A',
        paymentMethod: transaction.payment_method,
        reference: transaction.reference,
        notes: transaction.notes
      }));
      setTransactions(formattedTransactions);

      // Charger les paramètres
      const settingsData = await adminManagementService.getSystemSettings();
      setSettings(settingsData);

    } catch (error) {
      console.error('Erreur chargement données admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const adminData = await adminService.loginAdmin(username, password);
      
      const admin: AdminUser = {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.username === 'admin' ? 'super_admin' : 'moderator',
        permissions: adminData.username === 'admin' ? ['all'] : ['users', 'matches'],
        createdAt: new Date(adminData.created_at)
      };
      
      setAdminUser(admin);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur connexion admin:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      localStorage.removeItem('auth_admin');
      setAdminUser(null);
      setStats(null);
      setMatches([]);
      setUsers([]);
      setTransactions([]);
      setSettings(null);
    } catch (error) {
      console.error('Erreur déconnexion admin:', error);
    }
  };

  const updateMatch = async (matchId: string, updates: Partial<Match>): Promise<boolean> => {
    try {
      await matchService.updateMatch(matchId, updates);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur mise à jour match:', error);
      return false;
    }
  };

  const createMatch = async (match: Omit<Match, 'id'>): Promise<boolean> => {
    try {
      await matchService.createMatch(match);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur création match:', error);
      return false;
    }
  };

  const deleteMatch = async (matchId: string): Promise<boolean> => {
    try {
      await matchService.deleteMatch(matchId);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur suppression match:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserManagement>): Promise<boolean> => {
    try {
      await adminManagementService.updateUser(userId, updates);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      return false;
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<TransactionManagement>): Promise<boolean> => {
    try {
      await adminManagementService.updateTransaction(transactionId, updates);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur mise à jour transaction:', error);
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>): Promise<boolean> => {
    try {
      await adminManagementService.updateSystemSettings(newSettings);
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error);
      return false;
    }
  };

  const refreshData = async (): Promise<void> => {
    await loadAdminData();
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      stats,
      matches,
      users,
      transactions,
      settings,
      loginAdmin,
      logoutAdmin,
      updateMatch,
      createMatch,
      deleteMatch,
      updateUser,
      updateTransaction,
      updateSettings,
      refreshData,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
};