/*
  # Schéma initial pour l'application de paris sportifs inversés

  1. Tables principales
    - `users` - Profils utilisateurs avec plans d'investissement
    - `matches` - Matchs de football avec cotes
    - `bets` - Paris placés par les utilisateurs
    - `transactions` - Historique financier complet
    - `investment_plans` - Plans d'investissement disponibles
    - `referrals` - Système de parrainage multi-niveaux
    - `system_settings` - Configuration système

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès appropriées
    - Triggers pour les mises à jour automatiques

  3. Fonctionnalités
    - Système de parrainage 3 niveaux (3%, 2%, 1%)
    - Plans d'investissement avec rendements quotidiens
    - Gestion complète des transactions
    - Système de remboursement inversé
*/

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_team_logo text,
  away_team_logo text,
  league text NOT NULL,
  country text NOT NULL,
  match_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
  minimum_bet numeric DEFAULT 3000,
  odds_home numeric NOT NULL,
  odds_draw numeric NOT NULL,
  odds_away numeric NOT NULL,
  result text CHECK (result IN ('home', 'draw', 'away')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des paris
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  prediction text NOT NULL CHECK (prediction IN ('home', 'draw', 'away')),
  odds numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  potential_win numeric GENERATED ALWAYS AS (amount * odds) STORED,
  placed_at timestamptz DEFAULT now(),
  settled_at timestamptz
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'refund', 'bonus', 'referral')),
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description text NOT NULL,
  payment_method text,
  reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des plans d'investissement
CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  daily_return_percentage numeric NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table des parrainages
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES users(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level IN (1, 2, 3)),
  commission_percentage numeric NOT NULL,
  total_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des paramètres système
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Insertion des plans d'investissement par défaut
INSERT INTO investment_plans (name, min_amount, max_amount, daily_return_percentage, description) VALUES
('basic', 3000, 30000, 1.5, 'Plan de base - 1,5% par jour'),
('silver', 50000, 100000, 2.0, 'Plan argent - 2% par jour'),
('gold', 500000, 1000000, 3.0, 'Plan or - 3% par jour'),
('platinum', 5000000, 10000000, 5.0, 'Plan platine - 5% par jour')
ON CONFLICT (name) DO NOTHING;

-- Insertion des paramètres système par défaut
INSERT INTO system_settings (key, value, description) VALUES
('min_deposit', '3000', 'Montant minimum de dépôt'),
('min_withdrawal', '3000', 'Montant minimum de retrait'),
('refund_percentage', '80', 'Pourcentage de remboursement en cas de perte'),
('working_days', 'monday,tuesday,wednesday,thursday,friday,saturday', 'Jours de travail pour les rendements'),
('maintenance_mode', 'false', 'Mode maintenance activé/désactivé'),
('referral_level_1', '3', 'Commission niveau 1 de parrainage (%)'),
('referral_level_2', '2', 'Commission niveau 2 de parrainage (%)'),
('referral_level_3', '1', 'Commission niveau 3 de parrainage (%)')
ON CONFLICT (key) DO NOTHING;

-- Activation de RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les utilisateurs
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Politiques RLS pour les matchs (lecture publique)
CREATE POLICY "Anyone can read matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour les paris
CREATE POLICY "Users can read own bets"
  ON bets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bets"
  ON bets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Politiques RLS pour les transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Politiques RLS pour les plans d'investissement (lecture publique)
CREATE POLICY "Anyone can read investment plans"
  ON investment_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Politiques RLS pour les parrainages
CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Politiques RLS pour les paramètres système (lecture publique)
CREATE POLICY "Anyone can read system settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Triggers pour les mises à jour automatiques
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer les rendements quotidiens
CREATE OR REPLACE FUNCTION calculate_daily_returns()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  daily_return numeric;
  plan_return numeric;
BEGIN
  -- Vérifier si c'est un jour de travail (lundi à samedi)
  IF EXTRACT(DOW FROM now()) = 0 THEN
    RETURN; -- Dimanche, pas de rendement
  END IF;

  -- Parcourir tous les utilisateurs actifs avec un solde > 0
  FOR user_record IN 
    SELECT * FROM users 
    WHERE status = 'active' AND balance > 0
  LOOP
    -- Déterminer le pourcentage de rendement selon le plan
    SELECT daily_return_percentage INTO plan_return
    FROM investment_plans
    WHERE name = user_record.investment_plan
    AND is_active = true;

    IF plan_return IS NOT NULL THEN
      -- Calculer le rendement quotidien
      daily_return := FLOOR(user_record.balance * (plan_return / 100));
      
      IF daily_return > 0 THEN
        -- Mettre à jour le solde
        UPDATE users 
        SET balance = balance + daily_return,
            updated_at = now()
        WHERE id = user_record.id;

        -- Créer une transaction
        INSERT INTO transactions (
          user_id, 
          type, 
          amount, 
          status, 
          description
        ) VALUES (
          user_record.id,
          'bonus',
          daily_return,
          'completed',
          'Rendement quotidien ' || plan_return || '%'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour traiter les remboursements inversés
CREATE OR REPLACE FUNCTION process_refunds()
RETURNS void AS $$
DECLARE
  bet_record RECORD;
  refund_amount numeric;
  refund_percentage numeric;
BEGIN
  -- Récupérer le pourcentage de remboursement
  SELECT value::numeric INTO refund_percentage
  FROM system_settings
  WHERE key = 'refund_percentage';

  -- Parcourir tous les paris perdus non remboursés
  FOR bet_record IN 
    SELECT b.*, u.balance
    FROM bets b
    JOIN users u ON b.user_id = u.id
    WHERE b.status = 'lost'
    AND NOT EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.user_id = b.user_id
      AND t.type = 'refund'
      AND t.description LIKE '%' || b.id || '%'
    )
  LOOP
    -- Calculer le montant du remboursement
    refund_amount := FLOOR(bet_record.amount * (refund_percentage / 100));
    
    -- Créditer le remboursement
    UPDATE users 
    SET balance = balance + refund_amount,
        updated_at = now()
    WHERE id = bet_record.user_id;

    -- Créer la transaction de remboursement
    INSERT INTO transactions (
      user_id,
      type,
      amount,
      status,
      description
    ) VALUES (
      bet_record.user_id,
      'refund',
      refund_amount,
      'completed',
      'Remboursement inversé ' || refund_percentage || '% - Pari ' || bet_record.id
    );

    -- Marquer le pari comme remboursé
    UPDATE bets 
    SET status = 'refunded',
        settled_at = now()
    WHERE id = bet_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;