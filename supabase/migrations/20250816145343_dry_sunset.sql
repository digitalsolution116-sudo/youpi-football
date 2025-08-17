/*
  # Créer les tables manquantes pour l'administration

  1. Nouvelles tables
    - `admin_predictions` - Prédictions créées par les administrateurs
    - `weekly_commissions` - Commissions hebdomadaires de parrainage
    - `payment_aggregators` - Agrégateurs de paiement externes
    - `vip_levels` - Niveaux VIP avec leurs avantages
    - `daily_rewards` - Récompenses quotidiennes VIP
    - `referral_bonuses` - Bonus de parrainage

  2. Sécurité
    - Activer RLS sur toutes les nouvelles tables
    - Ajouter les politiques d'accès appropriées

  3. Fonctions
    - Fonctions pour gérer les prédictions admin
    - Fonctions pour traiter les récompenses et commissions
*/

-- Table des niveaux VIP
CREATE TABLE IF NOT EXISTS vip_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  name text NOT NULL,
  min_balance numeric NOT NULL,
  max_balance numeric NOT NULL,
  daily_reward numeric DEFAULT 10,
  first_bet_percentage numeric NOT NULL,
  second_bet_percentage numeric NOT NULL,
  referral_bonus numeric DEFAULT 500,
  referral_requirement integer DEFAULT 4,
  created_at timestamptz DEFAULT now()
);

-- Table des prédictions admin
CREATE TABLE IF NOT EXISTS admin_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_accounts(id),
  home_team text NOT NULL,
  away_team text NOT NULL,
  league text NOT NULL,
  country text NOT NULL,
  match_date timestamptz NOT NULL,
  prediction text NOT NULL CHECK (prediction IN ('home', 'draw', 'away')),
  confidence_level integer CHECK (confidence_level BETWEEN 1 AND 5),
  odds_home numeric NOT NULL,
  odds_draw numeric NOT NULL,
  odds_away numeric NOT NULL,
  minimum_bet numeric DEFAULT 1000,
  maximum_bet numeric DEFAULT 100000,
  refund_percentage numeric DEFAULT 6,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'settled')),
  result text CHECK (result IN ('home', 'draw', 'away')),
  total_bets integer DEFAULT 0,
  total_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des commissions hebdomadaires
CREATE TABLE IF NOT EXISTS weekly_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  week_end date NOT NULL,
  level_1_amount numeric DEFAULT 0,
  level_2_amount numeric DEFAULT 0,
  total_commission numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Table des agrégateurs de paiement
CREATE TABLE IF NOT EXISTS payment_aggregators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('payment_link', 'gateway', 'api')),
  api_key text,
  secret_key text,
  webhook_url text,
  supported_countries text[],
  supported_currencies text[],
  fees_percentage numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  configuration jsonb,
  created_at timestamptz DEFAULT now()
);

-- Table des récompenses quotidiennes
CREATE TABLE IF NOT EXISTS daily_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reward_date date DEFAULT CURRENT_DATE,
  amount numeric DEFAULT 10,
  vip_level integer,
  claimed boolean DEFAULT false,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, reward_date)
);

-- Table des bonus de parrainage
CREATE TABLE IF NOT EXISTS referral_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES users(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level IN (1, 2, 3)),
  bonus_type text NOT NULL CHECK (bonus_type IN ('first_deposit', 'weekly_commission')),
  amount numeric NOT NULL,
  percentage numeric NOT NULL,
  base_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE vip_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_aggregators ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_bonuses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour vip_levels
CREATE POLICY "Anyone can view VIP levels"
  ON vip_levels
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour admin_predictions
CREATE POLICY "Anyone can view admin predictions"
  ON admin_predictions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage predictions"
  ON admin_predictions
  FOR ALL
  TO authenticated
  USING (true);

-- Politiques RLS pour weekly_commissions
CREATE POLICY "Users can view own weekly commissions"
  ON weekly_commissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour payment_aggregators
CREATE POLICY "Authenticated users can view payment aggregators"
  ON payment_aggregators
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage payment aggregators"
  ON payment_aggregators
  FOR ALL
  TO authenticated
  USING (true);

-- Politiques RLS pour daily_rewards
CREATE POLICY "Users can view own daily rewards"
  ON daily_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim own daily rewards"
  ON daily_rewards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour referral_bonuses
CREATE POLICY "Users can view own referral bonuses"
  ON referral_bonuses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

-- Insérer les niveaux VIP selon vos spécifications
INSERT INTO vip_levels (level_number, name, min_balance, max_balance, daily_reward, first_bet_percentage, second_bet_percentage) VALUES
(1, 'VIP 1', 1000, 30000, 10, 1.0, 1.5),
(2, 'VIP 2', 31000, 200000, 10, 1.5, 1.5),
(3, 'VIP 3', 201000, 500000, 10, 2.0, 2.0),
(4, 'VIP 4', 501000, 800000, 10, 2.5, 2.5),
(5, 'VIP 5', 801000, 1500000, 10, 3.0, 3.0),
(6, 'VIP 6', 1501000, 2000000, 10, 3.5, 3.5)
ON CONFLICT (level_number) DO NOTHING;

-- Insérer quelques agrégateurs de paiement
INSERT INTO payment_aggregators (name, type, supported_countries, supported_currencies, fees_percentage) VALUES
('PayPal', 'gateway', ARRAY['Tous'], ARRAY['USD', 'EUR', 'XOF'], 2.9),
('Stripe', 'gateway', ARRAY['Tous'], ARRAY['USD', 'EUR'], 2.9),
('Flutterwave', 'gateway', ARRAY['Nigeria', 'Ghana', 'Kenya', 'Afrique du Sud'], ARRAY['NGN', 'GHS', 'KES', 'ZAR'], 1.4),
('Paystack', 'gateway', ARRAY['Nigeria', 'Ghana'], ARRAY['NGN', 'GHS'], 1.5)
ON CONFLICT DO NOTHING;

-- Fonction pour calculer automatiquement le niveau VIP
CREATE OR REPLACE FUNCTION calculate_vip_level(user_balance numeric)
RETURNS integer AS $$
BEGIN
  IF user_balance >= 1501000 AND user_balance <= 2000000 THEN
    RETURN 6;
  ELSIF user_balance >= 801000 AND user_balance <= 1500000 THEN
    RETURN 5;
  ELSIF user_balance >= 501000 AND user_balance <= 800000 THEN
    RETURN 4;
  ELSIF user_balance >= 201000 AND user_balance <= 500000 THEN
    RETURN 3;
  ELSIF user_balance >= 31000 AND user_balance <= 200000 THEN
    RETURN 2;
  ELSIF user_balance >= 1000 AND user_balance <= 30000 THEN
    RETURN 1;
  ELSE
    RETURN 0; -- Standard
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour traiter les récompenses quotidiennes
CREATE OR REPLACE FUNCTION process_daily_reward(p_user_id uuid)
RETURNS TABLE(
  success boolean,
  reward_amount numeric,
  new_balance numeric,
  error text
) AS $$
DECLARE
  user_record users%ROWTYPE;
  user_vip_level integer;
  reward_amount numeric := 10;
  existing_reward daily_rewards%ROWTYPE;
BEGIN
  -- Récupérer l'utilisateur
  SELECT * INTO user_record FROM users WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::numeric, 0::numeric, 'Utilisateur non trouvé'::text;
    RETURN;
  END IF;
  
  -- Vérifier si la récompense a déjà été réclamée aujourd'hui
  SELECT * INTO existing_reward 
  FROM daily_rewards 
  WHERE user_id = p_user_id AND reward_date = CURRENT_DATE;
  
  IF FOUND AND existing_reward.claimed THEN
    RETURN QUERY SELECT false, 0::numeric, user_record.balance, 'Récompense déjà réclamée aujourd''hui'::text;
    RETURN;
  END IF;
  
  -- Calculer le niveau VIP
  user_vip_level := calculate_vip_level(user_record.balance);
  
  -- Créditer la récompense
  UPDATE users 
  SET balance = balance + reward_amount,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Enregistrer ou mettre à jour la récompense
  INSERT INTO daily_rewards (user_id, reward_date, amount, vip_level, claimed, claimed_at)
  VALUES (p_user_id, CURRENT_DATE, reward_amount, user_vip_level, true, now())
  ON CONFLICT (user_id, reward_date)
  DO UPDATE SET 
    claimed = true,
    claimed_at = now();
  
  -- Enregistrer la transaction
  INSERT INTO transactions (user_id, type, amount, status, description, reference)
  VALUES (
    p_user_id,
    'bonus',
    reward_amount,
    'completed',
    'Récompense quotidienne VIP ' || user_vip_level,
    'DAILY-' || CURRENT_DATE || '-' || p_user_id
  );
  
  RETURN QUERY SELECT true, reward_amount, user_record.balance + reward_amount, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer une prédiction admin
CREATE OR REPLACE FUNCTION create_admin_prediction(
  p_admin_id uuid,
  p_home_team text,
  p_away_team text,
  p_league text,
  p_country text,
  p_match_date timestamptz,
  p_prediction text,
  p_confidence integer,
  p_odds_home numeric,
  p_odds_draw numeric,
  p_odds_away numeric
)
RETURNS TABLE(
  success boolean,
  prediction_id uuid,
  error text
) AS $$
DECLARE
  new_prediction_id uuid;
BEGIN
  -- Créer la prédiction
  INSERT INTO admin_predictions (
    admin_id, home_team, away_team, league, country, match_date,
    prediction, confidence_level, odds_home, odds_draw, odds_away
  )
  VALUES (
    p_admin_id, p_home_team, p_away_team, p_league, p_country, p_match_date,
    p_prediction, p_confidence, p_odds_home, p_odds_draw, p_odds_away
  )
  RETURNING id INTO new_prediction_id;
  
  RETURN QUERY SELECT true, new_prediction_id, NULL::text;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, NULL::uuid, SQLERRM::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour traiter les commissions hebdomadaires
CREATE OR REPLACE FUNCTION process_weekly_commissions()
RETURNS TABLE(
  processed_users integer,
  total_commissions numeric
) AS $$
DECLARE
  user_record users%ROWTYPE;
  week_start date;
  week_end date;
  level_1_bets numeric;
  level_2_bets numeric;
  level_1_commission numeric;
  level_2_commission numeric;
  total_commission numeric;
  processed_count integer := 0;
  total_amount numeric := 0;
BEGIN
  -- Calculer la semaine précédente (lundi à dimanche)
  week_start := date_trunc('week', CURRENT_DATE - interval '1 week')::date;
  week_end := week_start + interval '6 days';
  
  -- Traiter chaque utilisateur qui a des filleuls
  FOR user_record IN 
    SELECT DISTINCT u.* FROM users u
    INNER JOIN referrals r ON r.referrer_id = u.id
    WHERE u.status = 'active'
  LOOP
    -- Calculer les mises des filleuls niveau 1
    SELECT COALESCE(SUM(ABS(t.amount)), 0) INTO level_1_bets
    FROM transactions t
    INNER JOIN referrals r ON r.referred_id = t.user_id
    WHERE r.referrer_id = user_record.id 
      AND r.level = 1
      AND t.type = 'bet'
      AND t.status = 'completed'
      AND DATE(t.created_at) BETWEEN week_start AND week_end;
    
    -- Calculer les mises des filleuls niveau 2
    SELECT COALESCE(SUM(ABS(t.amount)), 0) INTO level_2_bets
    FROM transactions t
    INNER JOIN referrals r ON r.referred_id = t.user_id
    WHERE r.referrer_id = user_record.id 
      AND r.level = 2
      AND t.type = 'bet'
      AND t.status = 'completed'
      AND DATE(t.created_at) BETWEEN week_start AND week_end;
    
    -- Calculer les commissions
    level_1_commission := level_1_bets * 0.01; -- 1%
    level_2_commission := level_2_bets * 0.005; -- 0.5%
    total_commission := level_1_commission + level_2_commission;
    
    -- Si il y a des commissions à payer
    IF total_commission > 0 THEN
      -- Créditer les commissions
      UPDATE users 
      SET balance = balance + total_commission
      WHERE id = user_record.id;
      
      -- Enregistrer la commission hebdomadaire
      INSERT INTO weekly_commissions (user_id, week_start, week_end, level_1_amount, level_2_amount, total_commission, status, paid_at)
      VALUES (user_record.id, week_start, week_end, level_1_commission, level_2_commission, total_commission, 'paid', now())
      ON CONFLICT (user_id, week_start) DO NOTHING;
      
      -- Enregistrer la transaction
      INSERT INTO transactions (user_id, type, amount, status, description, reference)
      VALUES (
        user_record.id,
        'referral',
        total_commission,
        'completed',
        'Commission hebdomadaire ' || week_start || ' - ' || week_end,
        'WEEKLY-' || week_start || '-' || user_record.id
      );
      
      processed_count := processed_count + 1;
      total_amount := total_amount + total_commission;
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT processed_count, total_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour les timestamps
CREATE TRIGGER update_admin_predictions_updated_at
  BEFORE UPDATE ON admin_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer quelques prédictions admin de test (seulement si admin existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_accounts WHERE username = 'admin') THEN
    INSERT INTO admin_predictions (
      admin_id, home_team, away_team, league, country, match_date,
      prediction, confidence_level, odds_home, odds_draw, odds_away,
      minimum_bet, maximum_bet
    ) VALUES
    (
      (SELECT id FROM admin_accounts WHERE username = 'admin' LIMIT 1),
      'Real Madrid', 'FC Barcelone', 'La Liga', 'Espagne',
      now() + interval '2 hours',
      'home', 4, 2.1, 3.2, 2.8, 1000, 50000
    ),
    (
      (SELECT id FROM admin_accounts WHERE username = 'admin' LIMIT 1),
      'PSG', 'Olympique Marseille', 'Ligue 1', 'France',
      now() + interval '1 day',
      'home', 5, 1.8, 3.5, 3.1, 1000, 75000
    );
  END IF;
END $$;

-- Insérer quelques agrégateurs de paiement
INSERT INTO payment_aggregators (name, type, supported_countries, supported_currencies, fees_percentage) VALUES
('PayPal', 'gateway', ARRAY['Tous'], ARRAY['USD', 'EUR', 'XOF'], 2.9),
('Stripe', 'gateway', ARRAY['Tous'], ARRAY['USD', 'EUR'], 2.9),
('Flutterwave', 'gateway', ARRAY['Nigeria', 'Ghana', 'Kenya', 'Afrique du Sud'], ARRAY['NGN', 'GHS', 'KES', 'ZAR'], 1.4),
('Paystack', 'gateway', ARRAY['Nigeria', 'Ghana'], ARRAY['NGN', 'GHS'], 1.5)
ON CONFLICT DO NOTHING;