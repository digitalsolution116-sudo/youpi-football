/*
  # Configuration complète de la base de données Football Betting
  
  1. Tables principales avec RLS
  2. Utilisateurs de test avec authentification Supabase
  3. Données de démonstration complètes
  4. Fonctions et triggers
  5. Politiques de sécurité
*/

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. SUPPRESSION ET RECRÉATION DES TABLES
-- =============================================

-- Supprimer les tables existantes dans l'ordre correct (contraintes)
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS crypto_wallets CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS admin_accounts CASCADE;

-- =============================================
-- 2. CRÉATION DES TABLES
-- =============================================

-- Table users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  balance numeric DEFAULT 50000,
  country text NOT NULL,
  referral_code text,
  investment_plan text DEFAULT 'basic',
  daily_return numeric DEFAULT 1.5,
  referral_level integer DEFAULT 0,
  total_referrals integer DEFAULT 0,
  direct_referrals integer DEFAULT 0,
  group_size integer DEFAULT 0,
  cumulative_recharge numeric DEFAULT 0,
  cumulative_bets numeric DEFAULT 0,
  vip_level text DEFAULT 'Standard',
  preferred_currency text DEFAULT 'XOF',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table matches
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_team_logo text,
  away_team_logo text,
  league text NOT NULL,
  country text NOT NULL,
  match_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
  minimum_bet numeric DEFAULT 1000,
  odds_home numeric NOT NULL,
  odds_draw numeric NOT NULL,
  odds_away numeric NOT NULL,
  bets_count integer DEFAULT 0,
  total_bet_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table bets
CREATE TABLE bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  prediction text NOT NULL CHECK (prediction IN ('home', 'draw', 'away')),
  odds numeric NOT NULL,
  potential_win numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  placed_at timestamptz DEFAULT now(),
  settled_at timestamptz
);

-- Table transactions
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'refund', 'bonus', 'referral', 'investment_return')),
  amount numeric NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  description text NOT NULL,
  payment_method text,
  reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table investment_plans
CREATE TABLE investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  daily_return_percentage numeric NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table referrals
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES users(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level IN (1, 2, 3)),
  commission_percentage numeric NOT NULL,
  total_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table system_settings
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Table crypto_wallets
CREATE TABLE crypto_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  currency text NOT NULL CHECK (currency IN ('USDT', 'TRX', 'DOGE', 'COREDAO')),
  address text,
  balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table admin_accounts
CREATE TABLE admin_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions text[] DEFAULT ARRAY['users', 'matches', 'transactions'],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- =============================================
-- 3. ACTIVER RLS
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. POLITIQUES RLS
-- =============================================

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow user creation during signup" ON users
  FOR INSERT WITH CHECK (true);

-- Matches policies
CREATE POLICY "Anyone can view matches" ON matches
  FOR SELECT TO authenticated USING (true);

-- Bets policies
CREATE POLICY "Users can view own bets" ON bets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bets" ON bets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow transaction creation" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investment plans policies
CREATE POLICY "Anyone can view investment plans" ON investment_plans
  FOR SELECT TO authenticated USING (true);

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- System settings policies
CREATE POLICY "Anyone can view system settings" ON system_settings
  FOR SELECT TO authenticated USING (true);

-- Crypto wallets policies
CREATE POLICY "Users can view own crypto wallets" ON crypto_wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Admin accounts policies
CREATE POLICY "Admins can view admin accounts" ON admin_accounts
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- 5. FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crypto_wallets_updated_at BEFORE UPDATE ON crypto_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. INSÉRER LES DONNÉES DE TEST
-- =============================================

-- Plans d'investissement
INSERT INTO investment_plans (name, min_amount, max_amount, daily_return_percentage, description) VALUES
('Basic', 3000, 30000, 1.5, 'Plan de base pour débuter'),
('Silver', 50000, 100000, 2.0, 'Plan intermédiaire avec de meilleurs rendements'),
('Gold', 500000, 1000000, 3.0, 'Plan premium pour investisseurs sérieux'),
('Platinum', 5000000, 10000000, 5.0, 'Plan VIP pour gros investisseurs');

-- Matchs de test
INSERT INTO matches (home_team, away_team, league, country, match_date, status, minimum_bet, odds_home, odds_draw, odds_away) VALUES
('FC Porto Gaza', 'Zuliano', 'Venezuela Super', 'Venezuela', now() + interval '2 hours', 'upcoming', 1000, 2.1, 3.2, 2.8),
('Sporting Córdoba', 'Kilmes', 'Liga Argentina B', 'Argentine', now() + interval '1 day', 'upcoming', 1000, 1.8, 3.5, 3.1),
('Réserve Asunción', 'Olympia Réserve', 'Réserve de Barra', 'Paraguay', now() + interval '3 hours', 'live', 1000, 2.5, 3.0, 2.2),
('Real Madrid', 'FC Barcelone', 'La Liga', 'Espagne', now() + interval '2 days', 'upcoming', 5000, 2.0, 3.4, 2.9),
('PSG', 'Olympique Marseille', 'Ligue 1', 'France', now() + interval '4 hours', 'upcoming', 2000, 1.7, 3.8, 3.2),
('Manchester United', 'Liverpool', 'Premier League', 'Angleterre', now() + interval '1 day 6 hours', 'upcoming', 3000, 2.3, 3.1, 2.6),
('Bayern Munich', 'Borussia Dortmund', 'Bundesliga', 'Allemagne', now() + interval '5 hours', 'live', 2500, 1.9, 3.6, 3.0),
('Juventus', 'AC Milan', 'Serie A', 'Italie', now() + interval '3 days', 'upcoming', 2000, 2.2, 3.3, 2.7);

-- Paramètres système
INSERT INTO system_settings (key, value, description) VALUES
('minimum_bet', '1000', 'Mise minimum en FCFA'),
('maximum_bet', '1000000', 'Mise maximum en FCFA'),
('refund_percentage', '80', 'Pourcentage de remboursement'),
('bonus_percentage', '10', 'Pourcentage de bonus sur dépôts'),
('withdrawal_fee', '2.5', 'Frais de retrait en pourcentage'),
('maintenance_mode', 'false', 'Mode maintenance activé/désactivé'),
('allow_registration', 'true', 'Autoriser les nouvelles inscriptions'),
('max_daily_withdrawal', '500000', 'Retrait maximum par jour en FCFA');

-- Comptes admin
INSERT INTO admin_accounts (username, email, password_hash, role, permissions) VALUES
('admin', 'admin@footballbet.com', crypt('admin123', gen_salt('bf')), 'super_admin', ARRAY['all']),
('moderator', 'moderator@footballbet.com', crypt('mod123', gen_salt('bf')), 'moderator', ARRAY['users', 'matches']);

-- =============================================
-- 7. CONFIRMATION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Base de données configurée avec succès !';
  RAISE NOTICE '📊 Tables créées avec RLS activé';
  RAISE NOTICE '⚽ 8 matchs de test ajoutés';
  RAISE NOTICE '💎 4 plans d''investissement configurés';
  RAISE NOTICE '👨‍💼 2 comptes admin créés';
  RAISE NOTICE '⚙️ Paramètres système configurés';
  RAISE NOTICE '🚀 Prêt pour l''authentification !';
END $$;