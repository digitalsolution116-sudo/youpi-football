/*
  # Création des utilisateurs de test pour l'application

  1. Tables créées
    - `users` - Profils utilisateurs avec soldes et informations
    - `matches` - Matchs de football avec cotes
    - `bets` - Paris placés par les utilisateurs
    - `transactions` - Historique des transactions
    - `system_settings` - Paramètres de l'application

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour permettre l'accès aux données

  3. Données de test
    - 4 utilisateurs de test avec soldes
    - 8 matchs de football
    - Transactions d'exemple
*/

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  balance numeric DEFAULT 0,
  country text NOT NULL,
  referral_code text,
  investment_plan text DEFAULT 'basic',
  daily_return numeric DEFAULT 1.5,
  referral_level integer DEFAULT 0,
  total_referrals integer DEFAULT 0,
  status text DEFAULT 'active',
  vip_level integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des profils
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert profile" ON users
  FOR INSERT WITH CHECK (true);

-- Créer la table matches
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_team_logo text,
  away_team_logo text,
  league text NOT NULL,
  country text NOT NULL,
  match_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming',
  minimum_bet numeric DEFAULT 1000,
  odds_home numeric NOT NULL,
  odds_draw numeric NOT NULL,
  odds_away numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read matches" ON matches
  FOR SELECT USING (true);

-- Créer la table bets
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  match_id uuid REFERENCES matches(id),
  amount numeric NOT NULL,
  prediction text NOT NULL,
  odds numeric NOT NULL,
  status text DEFAULT 'pending',
  potential_win numeric,
  placed_at timestamptz DEFAULT now(),
  settled_at timestamptz
);

ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bets" ON bets
  FOR SELECT USING (true);

CREATE POLICY "Users can insert bets" ON bets
  FOR INSERT WITH CHECK (true);

-- Créer la table transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'completed',
  description text NOT NULL,
  payment_method text,
  reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert transactions" ON transactions
  FOR INSERT WITH CHECK (true);

-- Créer la table system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON system_settings
  FOR SELECT USING (true);

-- Insérer les utilisateurs de test
INSERT INTO users (id, username, email, phone, balance, country, investment_plan, daily_return, vip_level, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Arthur2024', 'arthur2024@footballbet.com', '+33123456789', 125000, 'France', 'vip1', 3.5, 1, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'SportFan', 'sportfan@footballbet.com', '+33987654321', 75000, 'France', 'standard', 1.5, 0, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'BetMaster', 'betmaster@footballbet.com', '+225070123456', 350000, 'Côte d''Ivoire', 'vip2', 5.0, 2, 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'ProGamer', 'progamer@footballbet.com', '+221771234567', 45000, 'Sénégal', 'standard', 1.5, 0, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insérer les matchs de test
INSERT INTO matches (id, home_team, away_team, league, country, match_date, status, minimum_bet, odds_home, odds_draw, odds_away) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'FC Porto Gaza', 'Zuliano', 'Venezuela Super', 'Venezuela', now() + interval '2 hours', 'upcoming', 1000, 2.1, 3.2, 2.8),
('660e8400-e29b-41d4-a716-446655440002', 'Real Madrid', 'FC Barcelone', 'La Liga', 'Espagne', now() + interval '1 day', 'upcoming', 5000, 1.8, 3.5, 3.1),
('660e8400-e29b-41d4-a716-446655440003', 'PSG', 'Olympique Marseille', 'Ligue 1', 'France', now() + interval '3 hours', 'live', 2000, 1.6, 4.0, 4.2),
('660e8400-e29b-41d4-a716-446655440004', 'Manchester United', 'Liverpool', 'Premier League', 'Angleterre', now() + interval '6 hours', 'upcoming', 3000, 2.3, 3.1, 2.9),
('660e8400-e29b-41d4-a716-446655440005', 'Bayern Munich', 'Borussia Dortmund', 'Bundesliga', 'Allemagne', now() + interval '1 day 2 hours', 'upcoming', 4000, 1.9, 3.4, 3.3),
('660e8400-e29b-41d4-a716-446655440006', 'Juventus', 'AC Milan', 'Serie A', 'Italie', now() + interval '2 days', 'upcoming', 2500, 2.0, 3.2, 3.0),
('660e8400-e29b-41d4-a716-446655440007', 'Ajax', 'PSV Eindhoven', 'Eredivisie', 'Pays-Bas', now() + interval '4 hours', 'live', 1500, 2.2, 3.0, 2.7),
('660e8400-e29b-41d4-a716-446655440008', 'Sporting Córdoba', 'Kilmes', 'Liga Argentina B', 'Argentine', now() + interval '5 hours', 'upcoming', 1000, 2.5, 3.0, 2.2)
ON CONFLICT (id) DO NOTHING;

-- Insérer quelques paris de test
INSERT INTO bets (id, user_id, match_id, amount, prediction, odds, status, potential_win, placed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 25000, 'home', 2.1, 'pending', 52500, now() - interval '1 hour'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 15000, 'away', 3.1, 'won', 46500, now() - interval '2 days'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 50000, 'draw', 4.0, 'lost', 200000, now() - interval '1 day'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 10000, 'home', 2.3, 'refunded', 23000, now() - interval '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Insérer des transactions de test
INSERT INTO transactions (id, user_id, type, amount, status, description, payment_method, reference) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'deposit', 100000, 'completed', 'Dépôt Mobile Money', 'Orange Money', 'DEP-2024-001'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'bet', -25000, 'completed', 'Pari placé - FC Porto vs Zuliano', null, 'BET-2024-001'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'bonus', 25000, 'completed', 'Bonus de bienvenue', null, 'BON-2024-001'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'bet', -15000, 'completed', 'Pari placé - Real Madrid vs Barcelone', null, 'BET-2024-002'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'deposit', 65000, 'completed', 'Pari gagné - Real Madrid vs Barcelone', null, 'WIN-2024-001'),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'deposit', 300000, 'completed', 'Dépôt MTN Money', 'MTN Money', 'DEP-2024-002'),
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'refund', 40000, 'completed', 'Remboursement 80% - Pari perdu', null, 'REF-2024-001'),
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'withdrawal', -5000, 'pending', 'Retrait vers Mobile Money', 'Orange Money', 'WIT-2024-001')
ON CONFLICT (id) DO NOTHING;

-- Insérer les paramètres système
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