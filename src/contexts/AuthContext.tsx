import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          // Utilisateur connecté - récupérer le profil
          try {
            const userData = await authService.getCurrentUser();
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error('Erreur récupération profil après connexion:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          // Utilisateur déconnecté
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Token rafraîchi - vérifier si l'utilisateur existe toujours
          try {
            const userData = await authService.getCurrentUser();
            if (userData) {
              setUser(userData);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error('Erreur après rafraîchissement token:', error);
            setUser(null);
          }
        }
        
        setIsLoading(false);
      }
    );

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier la session Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur récupération session:', sessionError);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (!session) {
        console.log('Aucune session active');
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Session active - récupérer le profil utilisateur
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        // Session existe mais pas de profil - déconnecter
        console.warn('Session sans profil utilisateur - déconnexion');
        await supabase.auth.signOut();
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
      // Afficher un message d'erreur plus clair pour les problèmes de configuration
      if (error instanceof Error && error.message.includes('Supabase')) {
        console.error('🔧 CONFIGURATION REQUISE: Veuillez configurer Supabase en cliquant sur "Connect to Supabase" en haut à droite');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: userData, session } = await authService.signIn(phone, password);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erreur connexion:', error);
      alert(error instanceof Error ? error.message : 'Erreur de connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: newUser, session } = await authService.signUp({
        username: userData.username || '',
        email: userData.email || `${userData.username}@footballbet.com`,
        phone: userData.phone || '',
        password: userData.password,
        country: userData.country || '',
        referralCode: userData.referralCode,
      });
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error; // Propager l'erreur pour que le composant puisse l'afficher
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          description: 'Bonus de bienvenue - 50 FCFA',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};