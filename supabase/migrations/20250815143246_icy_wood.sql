/*
  # Fonctions SQL pour l'application Football Betting
  
  1. Fonctions d'authentification
  2. Fonctions de gestion des paris
  3. Fonctions de gestion des transactions
  4. Fonctions d'administration
*/

-- =============================================
-- FONCTION D'AUTHENTIFICATION ADMIN
-- =============================================

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

-- =============================================
-- FONCTION POUR PLACER UN PARI
-- =============================================

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
BEGIN
  -- Vérifier le solde
  SELECT balance INTO user_balance FROM users WHERE id = p_user_id;
  
  IF user_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Utilisateur non trouvé');
  END IF;
  
  IF user_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Solde insuffisant');
  END IF;
  
  -- Créer le pari
  INSERT INTO bets (user_id, match_id, amount, prediction, odds, potential_win, status)
  VALUES (p_user_id, p_match_id, p_amount, p_prediction, p_odds, p_amount * p_odds, 'pending')
  RETURNING id INTO bet_id;
  
  -- Débiter le solde
  UPDATE users SET 
    balance = balance - p_amount,
    cumulative_bets = cumulative_bets + p_amount,
    updated_at = now()
  WHERE id = p_user_id;
  
  -- Créer la transaction
  INSERT INTO transactions (user_id, type, amount, description, reference, status)
  VALUES (p_user_id, 'bet', -p_amount, 'Pari placé', 'BET-' || bet_id, 'completed');
  
  RETURN json_build_object('success', true, 'bet_id', bet_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FONCTION POUR TRAITER UN DÉPÔT
-- =============================================

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
  INSERT INTO transactions (user_id, type, amount, description, payment_method, reference, status)
  VALUES (p_user_id, 'deposit', p_amount, 'Dépôt via ' || p_payment_method, p_payment_method, 'DEP-' || extract(epoch from now()), 'completed')
  RETURNING id INTO transaction_id;
  
  -- Créditer le solde
  UPDATE users SET 
    balance = balance + p_amount,
    cumulative_recharge = cumulative_recharge + p_amount,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN json_build_object('success', true, 'transaction_id', transaction_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FONCTION POUR LES STATISTIQUES ADMIN
-- =============================================

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json AS $$
DECLARE
  total_users integer;
  active_users integer;
  total_revenue numeric;
  today_bets integer;
  pending_withdrawals integer;
  today_revenue numeric;
BEGIN
  -- Compter les utilisateurs
  SELECT COUNT(*) INTO total_users FROM users;
  SELECT COUNT(*) INTO active_users FROM users WHERE status = 'active';
  
  -- Calculer les revenus
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue 
  FROM transactions 
  WHERE type = 'deposit' AND status = 'completed';
  
  SELECT COALESCE(SUM(amount), 0) INTO today_revenue 
  FROM transactions 
  WHERE type = 'deposit' AND status = 'completed' 
  AND DATE(created_at) = CURRENT_DATE;
  
  -- Compter les paris d'aujourd'hui
  SELECT COUNT(*) INTO today_bets 
  FROM bets 
  WHERE DATE(placed_at) = CURRENT_DATE;
  
  -- Compter les retraits en attente
  SELECT COUNT(*) INTO pending_withdrawals 
  FROM transactions 
  WHERE type = 'withdrawal' AND status = 'pending';
  
  RETURN json_build_object(
    'totalUsers', total_users,
    'activeUsers', active_users,
    'totalRevenue', total_revenue,
    'todayBets', today_bets,
    'pendingWithdrawals', pending_withdrawals,
    'todayRevenue', today_revenue,
    'conversionRate', CASE WHEN total_users > 0 THEN (active_users::float / total_users * 100) ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FONCTION POUR TRAITER UN RETRAIT
-- =============================================

CREATE OR REPLACE FUNCTION process_withdrawal(
  p_user_id uuid,
  p_amount numeric,
  p_payment_method text
)
RETURNS json AS $$
DECLARE
  user_balance numeric;
  transaction_id uuid;
  withdrawal_fee numeric;
  net_amount numeric;
BEGIN
  -- Vérifier le solde
  SELECT balance INTO user_balance FROM users WHERE id = p_user_id;
  
  IF user_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Utilisateur non trouvé');
  END IF;
  
  -- Calculer les frais
  SELECT COALESCE(value::numeric, 2.5) INTO withdrawal_fee 
  FROM system_settings WHERE key = 'withdrawal_fee';
  
  net_amount := p_amount * (1 - withdrawal_fee / 100);
  
  IF user_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Solde insuffisant');
  END IF;
  
  -- Créer la transaction
  INSERT INTO transactions (user_id, type, amount, description, payment_method, reference, status)
  VALUES (p_user_id, 'withdrawal', -p_amount, 'Retrait vers ' || p_payment_method, p_payment_method, 'WIT-' || extract(epoch from now()), 'pending')
  RETURNING id INTO transaction_id;
  
  -- Débiter le solde
  UPDATE users SET 
    balance = balance - p_amount,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN json_build_object('success', true, 'transaction_id', transaction_id, 'net_amount', net_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CONFIRMATION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Fonctions SQL créées avec succès !';
  RAISE NOTICE '🔐 authenticate_admin - Authentification admin';
  RAISE NOTICE '🎯 place_bet - Placement de paris';
  RAISE NOTICE '💰 process_deposit - Traitement des dépôts';
  RAISE NOTICE '💸 process_withdrawal - Traitement des retraits';
  RAISE NOTICE '📊 get_admin_stats - Statistiques admin';
  RAISE NOTICE '🚀 Toutes les fonctions sont opérationnelles !';
END $$;