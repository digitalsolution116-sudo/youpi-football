import { supabase } from '../lib/supabase'
import { checkSupabaseConnection } from '../lib/supabase'
import { User, Match, Bet, Transaction } from '../types'

// =============================================
// SERVICE D'AUTHENTIFICATION COMPLET
// =============================================

export const authService = {
  async signUp(userData: {
    username: string
    email: string
    phone: string
    password: string
    country: string
    referralCode?: string
  }) {
    try {
      // 1. Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            phone: userData.phone,
            country: userData.country
          }
        }
      })

      if (authError) {
        console.error('Erreur Supabase Auth:', authError);
        throw new Error('Erreur lors de la création du compte. Veuillez réessayer.')
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte.')
      }

      // 2. Créer le profil dans notre table users
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          country: userData.country,
          referral_code: userData.referralCode || userData.username.toUpperCase(),
          balance: 50,
          investment_plan: 'basic',
          daily_return: 1.5,
          status: 'active',
          vip_level: 'Standard',
          total_referrals: 0,
          direct_referrals: 0,
          group_size: 0,
          cumulative_recharge: 0,
          cumulative_bets: 0
        })
        .select()
        .single()

      if (profileError) {
        console.error('Erreur création profil:', profileError);
        throw new Error('Ce nom d\'utilisateur ou téléphone est déjà utilisé.')
      }

      // 3. Créer la transaction de bonus
      await supabase
        .from('transactions')
        .insert({
          user_id: authData.user.id,
          type: 'bonus',
          amount: 50,
          status: 'completed',
          description: 'Bonus de bienvenue - 50 FCFA',
          reference: `WELCOME-${Date.now()}`
        })

      return { user: profileData, session: authData.session }
    } catch (error) {
      console.error('Erreur inscription:', error)
      throw error
    }
  },

  async signIn(phone: string, password: string) {
    try {
      // 1. Trouver l'utilisateur par téléphone
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (userError || !userData) {
        throw new Error('Numéro de téléphone non trouvé.')
      }

      // 2. Authentifier avec Supabase Auth en utilisant l'email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      })

      if (authError) {
        throw new Error('Mot de passe incorrect.')
      }

      return {
        user: userData,
        session: authData.session
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      throw error
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      // Vérifier d'abord la session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        console.log('Aucune session utilisateur active');
        return null
      }

      // Vérifier que l'utilisateur existe toujours dans Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser.user) {
        console.warn('Utilisateur non trouvé dans Supabase Auth:', authError);
        return null;
      }

      // Récupérer le profil complet
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.user.id)
        .single()

      if (error) {
        console.warn('Profil utilisateur non trouvé:', error);
        // Si le profil n'existe pas, déconnecter l'utilisateur
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut();
        }
        return null;
      }
      
      return profileData
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error)
      return null
    }
  },

  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Erreur rafraîchissement session:', error);
      return null;
    }
  }
}

// =============================================
// SERVICE D'ADMINISTRATION
// =============================================

export const adminService = {
  async loginAdmin(username: string, password: string) {
    try {
      // Utiliser la fonction SQL pour authentifier l'admin
      const { data, error } = await supabase
        .rpc('authenticate_admin', {
          admin_username: username,
          admin_password: password
        })

      if (error || !data || data.length === 0) {
        throw new Error('Identifiants administrateur incorrects')
      }

      const adminData = data[0].admin_data
      localStorage.setItem('auth_admin', JSON.stringify(adminData))
      return adminData
    } catch (error) {
      console.error('Erreur connexion admin:', error)
      throw error
    }
  },

  async getStats() {
    try {
      // Vérifier la connexion Supabase
      const isConnected = await checkSupabaseConnection()
      if (!isConnected) {
        throw new Error('Configuration Supabase requise')
      }
      
      const { data, error } = await supabase.rpc('get_admin_stats')
      
      if (error) throw error
      
      // Ajouter les nouvelles statistiques
      const { data: predictionsCount, error: predError } = await supabase
        .from('admin_predictions')
        .select('count')
        .eq('status', 'active')
      
      if (predError) {
        console.warn('Table admin_predictions non trouvée:', predError)
      }
      
      const { data: vipUsersCount, error: vipError } = await supabase
        .from('users')
        .select('count')
        .neq('vip_level', 'Standard')
      
      if (vipError) {
        console.warn('Erreur récupération VIP users:', vipError)
      }
      
      const { data: weeklyCommissions, error: weeklyError } = await supabase
        .from('weekly_commissions')
        .select('total_commission')
        .eq('status', 'paid')
        .gte('week_start', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      
      if (weeklyError) {
        console.warn('Table weekly_commissions non trouvée:', weeklyError)
      }
      
      return {
        ...(data || {}),
        totalUsers: data?.[0]?.total_users || 0,
        activeUsers: data?.[0]?.active_users || 0,
        totalRevenue: data?.[0]?.total_revenue || 0,
        todayBets: data?.[0]?.today_bets || 0,
        pendingWithdrawals: data?.[0]?.pending_withdrawals || 0,
        todayRevenue: data?.[0]?.today_revenue || 0,
        conversionRate: data?.[0]?.conversion_rate || 0,
        adminPredictions: predictionsCount && !predError ? predictionsCount[0]?.count || 0 : 0,
        vipUsers: vipUsersCount && !vipError ? vipUsersCount[0]?.count || 0 : 0,
        weeklyCommissions: weeklyCommissions && !weeklyError ? weeklyCommissions.reduce((sum, c) => sum + c.total_commission, 0) : 0
      };
    } catch (error) {
      console.error('Erreur récupération stats:', error)
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        todayBets: 0,
        pendingWithdrawals: 0,
        todayRevenue: 0,
        conversionRate: 0,
        adminPredictions: 0,
        vipUsers: 0,
        weeklyCommissions: 0
      }
    }
  }
}

// =============================================
// SERVICE DES MATCHS
// =============================================

export const matchService = {
  async getMatches() {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération matchs:', error)
      return []
    }
  },

  async createMatch(matchData: Omit<Match, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          home_team: matchData.homeTeam,
          away_team: matchData.awayTeam,
          home_team_logo: matchData.homeTeamLogo,
          away_team_logo: matchData.awayTeamLogo,
          league: matchData.league,
          country: matchData.country,
          match_date: matchData.date.toISOString(),
          status: matchData.status,
          minimum_bet: matchData.minimumBet,
          odds_home: matchData.odds.home,
          odds_draw: matchData.odds.draw,
          odds_away: matchData.odds.away
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur création match:', error)
      throw error
    }
  },

  async updateMatch(matchId: string, updates: Partial<Match>) {
    try {
      const updateData: any = {}
      
      if (updates.homeTeam) updateData.home_team = updates.homeTeam
      if (updates.awayTeam) updateData.away_team = updates.awayTeam
      if (updates.league) updateData.league = updates.league
      if (updates.country) updateData.country = updates.country
      if (updates.date) updateData.match_date = updates.date.toISOString()
      if (updates.status) updateData.status = updates.status
      if (updates.minimumBet) updateData.minimum_bet = updates.minimumBet
      if (updates.odds) {
        updateData.odds_home = updates.odds.home
        updateData.odds_draw = updates.odds.draw
        updateData.odds_away = updates.odds.away
      }

      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', matchId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur mise à jour match:', error)
      throw error
    }
  },

  async deleteMatch(matchId: string) {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erreur suppression match:', error)
      throw error
    }
  }
}

// =============================================
// SERVICE DES PARIS
// =============================================

export const betService = {
  async placeBet(betData: {
    userId: string
    matchId: string
    amount: number
    prediction: 'home' | 'draw' | 'away'
    odds: number
  }) {
    try {
      // Utiliser la fonction SQL pour placer le pari
      const { data, error } = await supabase
        .rpc('place_bet', {
          p_user_id: betData.userId,
          p_match_id: betData.matchId,
          p_amount: betData.amount,
          p_prediction: betData.prediction,
          p_odds: betData.odds
        })

      if (error) throw error
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur placement pari')
      }

      return data
    } catch (error) {
      console.error('Erreur placement pari:', error)
      throw error
    }
  },

  async getUserBets(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          matches:match_id (
            home_team,
            away_team,
            league,
            match_date,
            country
          )
        `)
        .eq('user_id', userId)
        .order('placed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération paris:', error)
      return []
    }
  }
}

// =============================================
// SERVICE DES TRANSACTIONS
// =============================================

export const transactionService = {
  async getUserTransactions(userId: string, type?: string) {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (type && type !== 'all') {
        query = query.eq('type', type)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération transactions:', error)
      return []
    }
  },

  async createDeposit(userId: string, amount: number, paymentMethod: string, details?: any) {
    try {
      // Utiliser la nouvelle fonction de paiement
      const { data, error } = await supabase.rpc('process_payment_deposit', {
        p_user_id: userId,
        p_amount: amount,
        p_method: paymentMethod,
        p_currency: 'XOF',
        p_details: JSON.stringify(details || {}),
        p_reference: `${paymentMethod.toUpperCase()}-${Date.now()}`
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur dépôt:', error)
      throw error
    }
  },

  async createWithdrawal(userId: string, amount: number, paymentMethod: string, details?: any) {
    try {
      const { data, error } = await supabase.rpc('process_payment_withdrawal', {
        p_user_id: userId,
        p_amount: amount,
        p_method: paymentMethod,
        p_currency: 'XOF',
        p_details: JSON.stringify(details || {}),
        p_reference: `${paymentMethod.toUpperCase()}-WIT-${Date.now()}`
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur retrait:', error)
      throw error
    }
  }
}

// =============================================
// SERVICES D'ADMINISTRATION
// =============================================

export const adminManagementService = {
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error)
      return []
    }
  },

  async getTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          users:user_id (username, phone)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération transactions:', error)
      return []
    }
  },

  async updateUser(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error)
      throw error
    }
  },

  async updateTransaction(transactionId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur mise à jour transaction:', error)
      throw error
    }
  },

  async getSystemSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')

      if (error) throw error
      
      const settingsObj: any = {}
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value
      })

      return {
        minimumBet: parseInt(settingsObj.minimum_bet) || 1000,
        maximumBet: parseInt(settingsObj.maximum_bet) || 1000000,
        refundPercentage: parseInt(settingsObj.refund_percentage) || 80,
        bonusPercentage: parseInt(settingsObj.bonus_percentage) || 10,
        withdrawalFee: parseFloat(settingsObj.withdrawal_fee) || 2.5,
        maintenanceMode: settingsObj.maintenance_mode === 'true',
        allowRegistration: settingsObj.allow_registration !== 'false',
        maxDailyWithdrawal: parseInt(settingsObj.max_daily_withdrawal) || 500000
      }
    } catch (error) {
      console.error('Erreur récupération paramètres:', error)
      return {
        minimumBet: 1000,
        maximumBet: 1000000,
        refundPercentage: 80,
        bonusPercentage: 10,
        withdrawalFee: 2.5,
        maintenanceMode: false,
        allowRegistration: true,
        maxDailyWithdrawal: 500000
      }
    }
  },

  async updateSystemSettings(settings: any) {
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('system_settings')
          .upsert({
            key: key,
            value: value.toString(),
            updated_at: new Date().toISOString()
          })
      }
      return true
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error)
      throw error
    }
  }
}