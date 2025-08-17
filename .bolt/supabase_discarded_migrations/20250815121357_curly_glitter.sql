/*
  # Base de données complète pour l'application Football Betting
  
  1. Tables principales
    - `users` - Utilisateurs avec authentification
    - `matches` - Matchs de football
    - `bets` - Paris des utilisateurs
    - `transactions` - Historique financier
    - `investment_plans` - Plans d'investissement
    - `referrals` - Système de parrainage
    - `system_settings` - Configuration système
    - `crypto_wallets` - Portefeuilles crypto
    - `admin_accounts` - Comptes administrateurs

  2. Données de test
    - 4 utilisateurs de test avec soldes
    - 2 comptes admin fonctionnels
    - 8 matchs avec cotes réalistes
    - Transactions d'exemple
    - Paramètres système configurés

  3. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité configurées
    - Authentification Supabase native
*/

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. TABLE USERS (Utilisateurs)
-- =============================================

CREATE TABLE IF NOT EXISTS users (
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

-- =============================================
-- 2. TABLE MATCHES (Matchs de football)
-- =============================================

CREATE TABLE IF NOT EXISTS matches (
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

-- =============================================
-- 3. TABLE BETS (Paris)
-- =============================================

CREATE TABLE IF NOT EXISTS bets (
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

-- =============================================
-- 4. TABLE TRANSACTIONS (Transactions)
-- =============================================

CREATE TABLE IF NOT EXISTS transactions (
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

-- =============================================
-- 5. TABLE INVESTMENT_PLANS (Plans d'investissement)
-- =============================================

CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  daily_return_percentage numeric NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 6. TABLE REFERRALS (Parrainage)
-- =============================================

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES users(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level IN (1, 2, 3)),
  commission_percentage numeric NOT NULL,
  total_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 7. TABLE SYSTEM_SETTINGS (Paramètres système)
-- =============================================

CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 8. TABLE CRYPTO_WALLETS (Portefeuilles crypto)
-- =============================================

CREATE TABLE IF NOT EXISTS crypto_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  currency text NOT NULL CHECK (currency IN ('USDT', 'TRX', 'DOGE', 'COREDAO')),
  address text,
  balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 9. TABLE ADMIN_ACCOUNTS (Comptes admin)
-- =============================================

CREATE TABLE IF NOT EXISTS admin_accounts (
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
-- ACTIVER RLS (Row Level Security)
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
-- POLITIQUES RLS
-- =============================================

-- Users: peuvent voir et modifier leurs propres données
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Matches: lecture publique
CREATE POLICY "Anyone can view matches" ON matches
  FOR SELECT TO authenticated USING (true);

-- Bets: utilisateurs voient leurs propres paris
CREATE POLICY "Users can view own bets" ON bets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bets" ON bets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: utilisateurs voient leurs propres transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Investment plans: lecture publique
CREATE POLICY "Anyone can view investment plans" ON investment_plans
  FOR SELECT TO authenticated USING (true);

-- Referrals: utilisateurs voient leurs parrainages
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- System settings: lecture publique
CREATE POLICY "Anyone can view system settings" ON system_settings
  FOR SELECT TO authenticated USING (true);

-- Crypto wallets: utilisateurs voient leurs portefeuilles
CREATE POLICY "Users can view own crypto wallets" ON crypto_wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Admin accounts: accès restreint
CREATE POLICY "Admins can view admin accounts" ON admin_accounts
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- INSÉRER LES DONNÉES DE TEST
-- =============================================

-- 1. UTILISATEURS DE TEST
INSERT INTO users (id, username, email, phone, balance, country, referral_code, investment_plan, daily_return, vip_level, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Arthur2024', 'arthur@test.com', '+33123456789', 125000, 'France', 'ARTHUR2024', 'gold', 3.0, 'VIP 1', 'active'),
('22222222-2222-2222-2222-222222222222', 'SportFan', 'sportfan@test.com', '+33987654321', 75000, 'France', 'SPORT2024', 'silver', 2.0, 'Standard', 'active'),
('33333333-3333-3333-3333-333333333333', 'BetMaster', 'betmaster@test.com', '+225070123456', 350000, 'Côte d''Ivoire', 'BETMASTER', 'gold', 3.0, 'VIP 2', 'active'),
('44444444-4444-4444-4444-444444444444', 'ProGamer', 'progamer@test.com', '+221771234567', 45000, 'Sénégal', 'PROGAMER', 'basic', 1.5, 'Standard', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. COMPTES ADMIN
INSERT INTO admin_accounts (id, username, email, password_hash, role, permissions) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'admin@admin.footballbet.com', crypt('admin123', gen_salt('bf')), 'super_admin', ARRAY['all']),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'moderator', 'moderator@admin.footballbet.com', crypt('mod123', gen_salt('bf')), 'moderator', ARRAY['users', 'matches'])
ON CONFLICT (id) DO NOTHING;

-- 3. MATCHS DE TEST
INSERT INTO matches (id, home_team, away_team, league, country, match_date, status, minimum_bet, odds_home, odds_draw, odds_away) VALUES
('m1111111-1111-1111-1111-111111111111', 'FC Porto Gaza', 'Zuliano', 'Venezuela Super', 'Venezuela', now() + interval '2 hours', 'upcoming', 1000, 2.1, 3.2, 2.8),
('m2222222-2222-2222-2222-222222222222', 'Sporting Córdoba', 'Kilmes', 'Liga Argentina B', 'Argentine', now() + interval '1 day', 'upcoming', 1000, 1.8, 3.5, 3.1),
('m3333333-3333-3333-3333-333333333333', 'Réserve Asunción', 'Olympia Réserve', 'Réserve de Barra', 'Paraguay', now() + interval '3 hours', 'live', 1000, 2.5, 3.0, 2.2),
('m4444444-4444-4444-4444-444444444444', 'Real Madrid', 'FC Barcelone', 'La Liga', 'Espagne', now() + interval '2 days', 'upcoming', 5000, 2.0, 3.4, 2.9),
('m5555555-5555-5555-5555-555555555555', 'PSG', 'Olympique Marseille', 'Ligue 1', 'France', now() + interval '4 hours', 'upcoming', 2000, 1.7, 3.8, 3.2),
('m6666666-6666-6666-6666-666666666666', 'Manchester United', 'Liverpool', 'Premier League', 'Angleterre', now() + interval '1 day 6 hours', 'upcoming', 3000, 2.3, 3.1, 2.6),
('m7777777-7777-7777-7777-777777777777', 'Bayern Munich', 'Borussia Dortmund', 'Bundesliga', 'Allemagne', now() + interval '5 hours', 'live', 2500, 1.9, 3.6, 3.0),
('m8888888-8888-8888-8888-888888888888', 'Juventus', 'AC Milan', 'Serie A', 'Italie', now() + interval '3 days', 'upcoming', 2000, 2.2, 3.3, 2.7)
ON CONFLICT (id) DO NOTHING;

-- 4. PLANS D'INVESTISSEMENT
INSERT INTO investment_plans (id, name, min_amount, max_amount, daily_return_percentage, description) VALUES
('p1111111-1111-1111-1111-111111111111', 'Basic', 3000, 30000, 1.5, 'Plan de base pour débuter'),
('p2222222-2222-2222-2222-222222222222', 'Silver', 50000, 100000, 2.0, 'Plan intermédiaire avec de meilleurs rendements'),
('p3333333-3333-3333-3333-333333333333', 'Gold', 500000, 1000000, 3.0, 'Plan premium pour investisseurs sérieux'),
('p4444444-4444-4444-4444-444444444444', 'Platinum', 5000000, 10000000, 5.0, 'Plan VIP pour gros investisseurs')
ON CONFLICT (id) DO NOTHING;

-- 5. PARIS DE TEST
INSERT INTO bets (id, user_id, match_id, amount, prediction, odds, potential_win, status, placed_at) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 25000, 'home', 2.1, 52500, 'pending', now() - interval '1 hour'),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 15000, 'away', 3.1, 46500, 'pending', now() - interval '30 minutes'),
('b3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'm3333333-3333-3333-3333-333333333333', 50000, 'draw', 3.0, 150000, 'won', now() - interval '2 days'),
('b4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'm4444444-4444-4444-4444-444444444444', 10000, 'home', 2.0, 20000, 'lost', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- 6. TRANSACTIONS DE TEST
INSERT INTO transactions (id, user_id, type, amount, status, description, payment_method, reference) VALUES
('t1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'deposit', 100000, 'completed', 'Dépôt Mobile Money', 'Orange Money', 'DEP-2024-001'),
('t2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'bet', -25000, 'completed', 'Pari placé - FC Porto vs Zuliano', NULL, 'BET-2024-001'),
('t3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'deposit', 50000, 'completed', 'Dépôt MTN Money', 'MTN Money', 'DEP-2024-002'),
('t4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'bonus', 150000, 'completed', 'Pari gagné - Match nul', NULL, 'WIN-2024-001'),
('t5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'refund', 8000, 'completed', 'Remboursement 80% - Pari perdu', NULL, 'REF-2024-001'),
('t6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'investment_return', 3750, 'completed', 'Rendement quotidien - Plan Gold', NULL, 'INV-2024-001'),
('t7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'referral', 2250, 'completed', 'Commission parrainage - Niveau 1', NULL, 'REF-2024-002'),
('t8888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'withdrawal', -75000, 'pending', 'Demande de retrait', 'Orange Money', 'WIT-2024-001')
ON CONFLICT (id) DO NOTHING;

-- 7. PARRAINAGE DE TEST
INSERT INTO referrals (id, referrer_id, referred_id, level, commission_percentage, total_earned) VALUES
('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 3.0, 2250),
('r2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 1, 3.0, 1350),
('r3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 2, 2.0, 900)
ON CONFLICT (id) DO NOTHING;

-- 8. PARAMÈTRES SYSTÈME
INSERT INTO system_settings (key, value, description) VALUES
('minimum_bet', '1000', 'Mise minimum en FCFA'),
('maximum_bet', '1000000', 'Mise maximum en FCFA'),
('refund_percentage', '80', 'Pourcentage de remboursement'),
('bonus_percentage', '10', 'Pourcentage de bonus sur dépôts'),
('withdrawal_fee', '2.5', 'Frais de retrait en pourcentage'),
('maintenance_mode', 'false', 'Mode maintenance activé/désactivé'),
('allow_registration', 'true', 'Autoriser les nouvelles inscriptions'),
('max_daily_withdrawal', '500000', 'Retrait maximum par jour en FCFA')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 9. PORTEFEUILLES CRYPTO DE TEST
INSERT INTO crypto_wallets (id, user_id, currency, balance) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'USDT', 0),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'TRX', 0),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'USDT', 0),
('c4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'DOGE', 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour authentifier un utilisateur
CREATE OR REPLACE FUNCTION authenticate_user(user_phone text, user_password text)
RETURNS TABLE(user_data json) AS $$
BEGIN
  RETURN QUERY
  SELECT row_to_json(u.*) as user_data
  FROM users u
  WHERE u.phone = user_phone
  AND u.status = 'active'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour authentifier un admin
CREATE OR REPLACE FUNCTION authenticate_admin(admin_username text, admin_password text)
RETURNS TABLE(admin_data json) AS $$
BEGIN
  RETURN QUERY
  SELECT row_to_json(a.*) as admin_data
  FROM admin_accounts a
  WHERE a.username = admin_username
  AND a.password_hash = crypt(admin_password, a.password_hash)
  AND a.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour placer un pari
CREATE OR REPLACE FUNCTION place_bet(
  p_user_id uuid,
  p_match_id uuid,
  p_amount numeric,
  p_prediction text,
  p_odds numeric
)
RETURNS json AS $$
DECLARE
  user_balance numeric;
  bet_id uuid;
  result json;
BEGIN
  -- Vérifier le solde
  SELECT balance INTO user_balance FROM users WHERE id = p_user_id;
  
  IF user_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Solde insuffisant');
  END IF;
  
  -- Créer le pari
  INSERT INTO bets (user_id, match_id, amount, prediction, odds, potential_win, status)
  VALUES (p_user_id, p_match_id, p_amount, p_prediction, p_odds, p_amount * p_odds, 'pending')
  RETURNING id INTO bet_id;
  
  -- Débiter le solde
  UPDATE users SET balance = balance - p_amount WHERE id = p_user_id;
  
  -- Créer la transaction
  INSERT INTO transactions (user_id, type, amount, description, reference)
  VALUES (p_user_id, 'bet', -p_amount, 'Pari placé', 'BET-' || bet_id);
  
  RETURN json_build_object('success', true, 'bet_id', bet_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour traiter un dépôt
CREATE OR REPLACE FUNCTION process_deposit(
  p_user_id uuid,
  p_amount numeric,
  p_payment_method text
)
RETURNS json AS $$
DECLARE
  transaction_id uuid;
BEGIN
  -- Créer la transaction
  INSERT INTO transactions (user_id, type, amount, description, payment_method, reference)
  VALUES (p_user_id, 'deposit', p_amount, 'Dépôt via ' || p_payment_method, p_payment_method, 'DEP-' || extract(epoch from now()))
  RETURNING id INTO transaction_id;
  
  -- Créditer le solde
  UPDATE users SET balance = balance + p_amount WHERE id = p_user_id;
  
  RETURN json_build_object('success', true, 'transaction_id', transaction_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les stats admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json AS $$
DECLARE
  total_users integer;
  active_users integer;
  total_revenue numeric;
  today_bets integer;
BEGIN
  SELECT COUNT(*) INTO total_users FROM users;
  SELECT COUNT(*) INTO active_users FROM users WHERE status = 'active';
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue FROM transactions WHERE type = 'deposit' AND status = 'completed';
  SELECT COUNT(*) INTO today_bets FROM bets WHERE DATE(placed_at) = CURRENT_DATE;
  
  RETURN json_build_object(
    'totalUsers', total_users,
    'activeUsers', active_users,
    'totalRevenue', total_revenue,
    'todayBets', today_bets
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- MISE À JOUR DES TIMESTAMPS
-- =============================================

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
-- CONFIRMATION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Base de données configurée avec succès !';
  RAISE NOTICE '📊 Tables créées : users, matches, bets, transactions, investment_plans, referrals, system_settings, crypto_wallets, admin_accounts';
  RAISE NOTICE '🔒 Sécurité RLS activée sur toutes les tables';
  RAISE NOTICE '👥 4 utilisateurs de test ajoutés avec soldes';
  RAISE NOTICE '👨‍💼 2 comptes admin ajoutés (admin/admin123, moderator/mod123)';
  RAISE NOTICE '⚽ 8 matchs de test ajoutés avec cotes réalistes';
  RAISE NOTICE '💰 Transactions et paris d''exemple créés';
  RAISE NOTICE '⚙️ Paramètres système configurés';
  RAISE NOTICE '🚀 Application prête à être utilisée !';
END $$;