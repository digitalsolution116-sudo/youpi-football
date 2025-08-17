import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    !supabaseUrl.includes('your-project') && 
                    !supabaseAnonKey.includes('your-anon')

if (!isConfigured) {
  console.error('❌ Configuration Supabase manquante ou invalide')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey ? 'Présente mais invalide' : 'Manquante')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Fonction pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    if (!isConfigured) {
      throw new Error('Configuration Supabase manquante')
    }
    
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erreur connexion Supabase:', error)
    return false
  }
}

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          phone: string
          balance: number
          country: string
          referral_code?: string
          investment_plan?: string
          daily_return?: number
          referral_level?: number
          total_referrals?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          phone: string
          balance?: number
          country: string
          referral_code?: string
          investment_plan?: string
          daily_return?: number
          referral_level?: number
          total_referrals?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          phone?: string
          balance?: number
          country?: string
          referral_code?: string
          investment_plan?: string
          daily_return?: number
          referral_level?: number
          total_referrals?: number
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          home_team: string
          away_team: string
          home_team_logo?: string
          away_team_logo?: string
          league: string
          country: string
          match_date: string
          status: 'upcoming' | 'live' | 'finished'
          minimum_bet: number
          odds_home: number
          odds_draw: number
          odds_away: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          home_team: string
          away_team: string
          home_team_logo?: string
          away_team_logo?: string
          league: string
          country: string
          match_date: string
          status?: 'upcoming' | 'live' | 'finished'
          minimum_bet: number
          odds_home: number
          odds_draw: number
          odds_away: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          home_team?: string
          away_team?: string
          home_team_logo?: string
          away_team_logo?: string
          league?: string
          country?: string
          match_date?: string
          status?: 'upcoming' | 'live' | 'finished'
          minimum_bet?: number
          odds_home?: number
          odds_draw?: number
          odds_away?: number
          updated_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          user_id: string
          match_id: string
          amount: number
          prediction: 'home' | 'draw' | 'away'
          odds: number
          status: 'pending' | 'won' | 'lost' | 'refunded'
          placed_at: string
          settled_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          match_id: string
          amount: number
          prediction: 'home' | 'draw' | 'away'
          odds: number
          status?: 'pending' | 'won' | 'lost' | 'refunded'
          placed_at?: string
          settled_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          match_id?: string
          amount?: number
          prediction?: 'home' | 'draw' | 'away'
          odds?: number
          status?: 'pending' | 'won' | 'lost' | 'refunded'
          placed_at?: string
          settled_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus' | 'referral'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          description: string
          payment_method?: string
          reference?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus' | 'referral'
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          description: string
          payment_method?: string
          reference?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus' | 'referral'
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          description?: string
          payment_method?: string
          reference?: string
          updated_at?: string
        }
      }
      investment_plans: {
        Row: {
          id: string
          name: string
          min_amount: number
          max_amount: number
          daily_return_percentage: number
          description: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          min_amount: number
          max_amount: number
          daily_return_percentage: number
          description: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          min_amount?: number
          max_amount?: number
          daily_return_percentage?: number
          description?: string
          is_active?: boolean
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          level: number
          commission_percentage: number
          total_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          level: number
          commission_percentage: number
          total_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          level?: number
          commission_percentage?: number
          total_earned?: number
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: string
          description?: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string
          updated_at?: string
        }
      }
    }
  }
}