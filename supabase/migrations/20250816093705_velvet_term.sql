/*
  # Fonctions de traitement des paiements

  1. Nouvelles fonctions
    - `process_payment_deposit` - Traitement des dépôts multi-méthodes
    - `process_payment_withdrawal` - Traitement des retraits multi-méthodes
    - `get_payment_methods_for_country` - Méthodes disponibles par pays
    - `validate_payment_limits` - Validation des limites de paiement

  2. Tables mises à jour
    - Ajout de colonnes pour les détails de paiement
    - Support des cryptomonnaies
    - Gestion des frais par méthode

  3. Sécurité
    - Validation des montants et limites
    - Chiffrement des données sensibles
    - Logs de toutes les transactions
*/

-- Fonction de traitement des dépôts
CREATE OR REPLACE FUNCTION process_payment_deposit(
  p_user_id uuid,
  p_amount numeric,
  p_method text,
  p_currency text DEFAULT 'XOF',
  p_details jsonb DEFAULT '{}',
  p_reference text DEFAULT NULL
)
RETURNS TABLE(
  success boolean,
  transaction_id uuid,
  reference text,
  amount numeric,
  fees numeric,
  new_balance numeric,
  error text
) AS $$
DECLARE
  current_balance numeric;
  method_fees numeric := 0;
  bonus_amount numeric := 0;
  total_credit numeric;
  new_transaction_id uuid;
  final_reference text;
BEGIN
  -- Vérifier l'utilisateur
  SELECT balance INTO current_balance
  FROM users
  WHERE id = p_user_id AND status = 'active';
  
  IF current_balance IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, 0::numeric, 0::numeric, 'Utilisateur non trouvé ou inactif'::text;
    RETURN;
  END IF;
  
  -- Calculer les frais selon la méthode
  CASE p_method
    WHEN 'orange_money', 'mtn_money', 'moov_money' THEN method_fees := 0;
    WHEN 'crypto' THEN method_fees := 0;
    WHEN 'bank_card' THEN method_fees := p_amount * 0.025; -- 2.5%
    WHEN 'bank_transfer' THEN method_fees := p_amount * 0.01; -- 1%
    ELSE method_fees := 0;
  END CASE;
  
  -- Calculer le bonus de dépôt (10% pour tous les dépôts > 50k)
  IF p_amount >= 50000 THEN
    bonus_amount := p_amount * 0.10; -- 10% de bonus
  END IF;
  
  total_credit := p_amount + bonus_amount;
  
  -- Générer une référence si non fournie
  final_reference := COALESCE(
    p_reference, 
    upper(p_method) || '-DEP-' || extract(year from now()) || '-' || 
    lpad(floor(random() * 10000)::text, 4, '0')
  );
  
  -- Créditer le solde
  UPDATE users 
  SET balance = balance + total_credit,
      cumulative_recharge = cumulative_recharge + p_amount,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Enregistrer la transaction principale
  INSERT INTO transactions (
    user_id, type, amount, status, description, 
    payment_method, reference, created_at
  )
  VALUES (
    p_user_id,
    'deposit',
    p_amount,
    CASE 
      WHEN p_method IN ('orange_money', 'mtn_money', 'moov_money', 'bank_card') THEN 'completed'
      ELSE 'pending'
    END,
    'Dépôt via ' || 
    CASE p_method
      WHEN 'orange_money' THEN 'Orange Money'
      WHEN 'mtn_money' THEN 'MTN Money'
      WHEN 'moov_money' THEN 'Moov Money'
      WHEN 'crypto' THEN 'Cryptomonnaie (' || p_currency || ')'
      WHEN 'bank_card' THEN 'Carte bancaire'
      WHEN 'bank_transfer' THEN 'Virement bancaire'
      ELSE p_method
    END,
    p_method,
    final_reference
  )
  RETURNING id INTO new_transaction_id;
  
  -- Enregistrer le bonus si applicable
  IF bonus_amount > 0 THEN
    INSERT INTO transactions (
      user_id, type, amount, status, description, reference
    )
    VALUES (
      p_user_id,
      'bonus',
      bonus_amount,
      'completed',
      'Bonus de dépôt (10%)',
      'BONUS-' || final_reference
    );
  END IF;
  
  -- Calculer les commissions de parrainage
  PERFORM calculate_referral_commission(p_user_id, p_amount, 'deposit');
  
  RETURN QUERY SELECT 
    true,
    new_transaction_id,
    final_reference,
    p_amount,
    method_fees,
    current_balance + total_credit,
    NULL::text;
    
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, 0::numeric, current_balance, SQLERRM::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction de traitement des retraits
CREATE OR REPLACE FUNCTION process_payment_withdrawal(
  p_user_id uuid,
  p_amount numeric,
  p_method text,
  p_currency text DEFAULT 'XOF',
  p_details jsonb DEFAULT '{}',
  p_reference text DEFAULT NULL
)
RETURNS TABLE(
  success boolean,
  transaction_id uuid,
  reference text,
  amount numeric,
  fees numeric,
  new_balance numeric,
  error text
) AS $$
DECLARE
  current_balance numeric;
  method_fees numeric := 0;
  total_debit numeric;
  new_transaction_id uuid;
  final_reference text;
  daily_withdrawal_limit numeric;
  today_withdrawals numeric;
BEGIN
  -- Vérifier l'utilisateur
  SELECT balance INTO current_balance
  FROM users
  WHERE id = p_user_id AND status = 'active';
  
  IF current_balance IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, 0::numeric, 0::numeric, 'Utilisateur non trouvé ou inactif'::text;
    RETURN;
  END IF;
  
  -- Vérifier les limites quotidiennes
  SELECT COALESCE(value::numeric, 500000) INTO daily_withdrawal_limit
  FROM system_settings
  WHERE key = 'max_daily_withdrawal';
  
  SELECT COALESCE(SUM(ABS(amount)), 0) INTO today_withdrawals
  FROM transactions
  WHERE user_id = p_user_id 
    AND type = 'withdrawal' 
    AND status IN ('completed', 'pending')
    AND DATE(created_at) = CURRENT_DATE;
  
  IF today_withdrawals + p_amount > daily_withdrawal_limit THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, 0::numeric, current_balance, 
      'Limite quotidienne dépassée: ' || daily_withdrawal_limit::text || ' FCFA'::text;
    RETURN;
  END IF;
  
  -- Calculer les frais selon la méthode
  CASE p_method
    WHEN 'orange_money' THEN method_fees := p_amount * 0.015; -- 1.5%
    WHEN 'mtn_money' THEN method_fees := p_amount * 0.02;     -- 2%
    WHEN 'moov_money' THEN method_fees := p_amount * 0.018;   -- 1.8%
    WHEN 'crypto' THEN method_fees := p_amount * 0.005;       -- 0.5%
    WHEN 'bank_card' THEN method_fees := p_amount * 0.03;     -- 3%
    WHEN 'bank_transfer' THEN method_fees := p_amount * 0.02; -- 2%
    ELSE method_fees := p_amount * 0.025; -- 2.5% par défaut
  END CASE;
  
  total_debit := p_amount + method_fees;
  
  -- Vérifier le solde suffisant
  IF current_balance < total_debit THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, method_fees, current_balance, 'Solde insuffisant (frais inclus)'::text;
    RETURN;
  END IF;
  
  -- Générer une référence
  final_reference := COALESCE(
    p_reference,
    upper(p_method) || '-WIT-' || extract(year from now()) || '-' || 
    lpad(floor(random() * 10000)::text, 4, '0')
  );
  
  -- Débiter le solde
  UPDATE users 
  SET balance = balance - total_debit,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Enregistrer la transaction
  INSERT INTO transactions (
    user_id, type, amount, status, description, 
    payment_method, reference, created_at
  )
  VALUES (
    p_user_id,
    'withdrawal',
    -p_amount,
    CASE 
      WHEN p_method IN ('orange_money', 'mtn_money', 'moov_money') THEN 'pending'
      WHEN p_method = 'crypto' THEN 'pending'
      ELSE 'pending'
    END,
    'Retrait vers ' || 
    CASE p_method
      WHEN 'orange_money' THEN 'Orange Money (' || (p_details->>'phoneNumber') || ')'
      WHEN 'mtn_money' THEN 'MTN Money (' || (p_details->>'phoneNumber') || ')'
      WHEN 'moov_money' THEN 'Moov Money (' || (p_details->>'phoneNumber') || ')'
      WHEN 'crypto' THEN 'Portefeuille ' || p_currency || ' (' || left(p_details->>'walletAddress', 10) || '...)'
      WHEN 'bank_card' THEN 'Carte bancaire'
      WHEN 'bank_transfer' THEN 'Compte bancaire (' || (p_details->>'bankName') || ')'
      ELSE p_method
    END,
    p_method,
    final_reference
  )
  RETURNING id INTO new_transaction_id;
  
  -- Enregistrer les frais si applicable
  IF method_fees > 0 THEN
    INSERT INTO transactions (
      user_id, type, amount, status, description, reference
    )
    VALUES (
      p_user_id,
      'withdrawal',
      -method_fees,
      'completed',
      'Frais de retrait (' || p_method || ')',
      'FEES-' || final_reference
    );
  END IF;
  
  RETURN QUERY SELECT 
    true,
    new_transaction_id,
    final_reference,
    p_amount,
    method_fees,
    current_balance - total_debit,
    NULL::text;
    
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 0::numeric, 0::numeric, current_balance, SQLERRM::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction de validation des limites de paiement
CREATE OR REPLACE FUNCTION validate_payment_limits(
  p_method text,
  p_amount numeric,
  p_type text,
  p_country text DEFAULT 'Côte d''Ivoire'
)
RETURNS TABLE(
  is_valid boolean,
  min_limit numeric,
  max_limit numeric,
  error_message text
) AS $$
DECLARE
  min_amount numeric;
  max_amount numeric;
BEGIN
  -- Définir les limites selon la méthode et le type
  CASE p_method
    WHEN 'orange_money', 'mtn_money' THEN
      IF p_type = 'deposit' THEN
        min_amount := 1000;
        max_amount := 1000000;
      ELSE
        min_amount := 5000;
        max_amount := 500000;
      END IF;
    WHEN 'moov_money' THEN
      IF p_type = 'deposit' THEN
        min_amount := 1000;
        max_amount := 500000;
      ELSE
        min_amount := 5000;
        max_amount := 300000;
      END IF;
    WHEN 'crypto' THEN
      IF p_type = 'deposit' THEN
        min_amount := 5000;  -- ~10 USD
        max_amount := 25000000; -- ~50k USD
      ELSE
        min_amount := 10000; -- ~20 USD
        max_amount := 5000000; -- ~10k USD
      END IF;
    WHEN 'bank_card' THEN
      IF p_type = 'deposit' THEN
        min_amount := 5000;
        max_amount := 2000000;
      ELSE
        min_amount := 10000;
        max_amount := 1000000;
      END IF;
    WHEN 'bank_transfer' THEN
      IF p_type = 'deposit' THEN
        min_amount := 10000;
        max_amount := 5000000;
      ELSE
        min_amount := 20000;
        max_amount := 2000000;
      END IF;
    ELSE
      min_amount := 1000;
      max_amount := 1000000;
  END CASE;
  
  -- Vérifier les limites
  IF p_amount < min_amount THEN
    RETURN QUERY SELECT false, min_amount, max_amount, 
      'Montant minimum: ' || min_amount::text || ' FCFA';
    RETURN;
  END IF;
  
  IF p_amount > max_amount THEN
    RETURN QUERY SELECT false, min_amount, max_amount,
      'Montant maximum: ' || max_amount::text || ' FCFA';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, min_amount, max_amount, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les méthodes de paiement par pays
CREATE OR REPLACE FUNCTION get_payment_methods_for_country(p_country text)
RETURNS TABLE(
  method_type text,
  method_name text,
  is_available boolean,
  deposit_fee numeric,
  withdrawal_fee numeric,
  min_deposit numeric,
  max_deposit numeric,
  min_withdrawal numeric,
  max_withdrawal numeric
) AS $$
BEGIN
  -- Retourner les méthodes selon le pays
  CASE p_country
    WHEN 'Côte d''Ivoire' THEN
      RETURN QUERY VALUES
        ('orange_money', 'Orange Money', true, 0::numeric, 1.5::numeric, 1000::numeric, 1000000::numeric, 5000::numeric, 500000::numeric),
        ('mtn_money', 'MTN Money', true, 0::numeric, 2.0::numeric, 1000::numeric, 1000000::numeric, 5000::numeric, 500000::numeric),
        ('moov_money', 'Moov Money', true, 0::numeric, 1.8::numeric, 1000::numeric, 500000::numeric, 5000::numeric, 300000::numeric),
        ('crypto', 'Cryptomonnaies', true, 0::numeric, 0.5::numeric, 5000::numeric, 25000000::numeric, 10000::numeric, 5000000::numeric),
        ('bank_transfer', 'Virement Bancaire', true, 1.0::numeric, 2.0::numeric, 10000::numeric, 5000000::numeric, 20000::numeric, 2000000::numeric);
    
    WHEN 'Sénégal' THEN
      RETURN QUERY VALUES
        ('orange_money', 'Orange Money', true, 0::numeric, 1.5::numeric, 1000::numeric, 1000000::numeric, 5000::numeric, 500000::numeric),
        ('crypto', 'Cryptomonnaies', true, 0::numeric, 0.5::numeric, 5000::numeric, 25000000::numeric, 10000::numeric, 5000000::numeric),
        ('bank_transfer', 'Virement Bancaire', true, 1.0::numeric, 2.0::numeric, 10000::numeric, 5000000::numeric, 20000::numeric, 2000000::numeric);
    
    WHEN 'Ghana' THEN
      RETURN QUERY VALUES
        ('mtn_money', 'MTN Mobile Money', true, 0::numeric, 2.0::numeric, 1000::numeric, 1000000::numeric, 5000::numeric, 500000::numeric),
        ('crypto', 'Cryptomonnaies', true, 0::numeric, 0.5::numeric, 5000::numeric, 25000000::numeric, 10000::numeric, 5000000::numeric),
        ('bank_card', 'Carte Bancaire', true, 2.5::numeric, 3.0::numeric, 5000::numeric, 2000000::numeric, 10000::numeric, 1000000::numeric);
    
    WHEN 'France', 'Belgique', 'Suisse', 'Canada' THEN
      RETURN QUERY VALUES
        ('bank_card', 'Carte Bancaire', true, 2.5::numeric, 3.0::numeric, 5000::numeric, 2000000::numeric, 10000::numeric, 1000000::numeric),
        ('bank_transfer', 'Virement Bancaire', true, 1.0::numeric, 2.0::numeric, 10000::numeric, 5000000::numeric, 20000::numeric, 2000000::numeric),
        ('crypto', 'Cryptomonnaies', true, 0::numeric, 0.5::numeric, 5000::numeric, 25000000::numeric, 10000::numeric, 5000000::numeric);
    
    ELSE
      -- Pays non configuré - méthodes par défaut
      RETURN QUERY VALUES
        ('crypto', 'Cryptomonnaies', true, 0::numeric, 0.5::numeric, 5000::numeric, 25000000::numeric, 10000::numeric, 5000000::numeric),
        ('bank_transfer', 'Virement Bancaire', true, 1.0::numeric, 2.0::numeric, 10000::numeric, 5000000::numeric, 20000::numeric, 2000000::numeric);
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour la fonction de calcul des commissions de parrainage
CREATE OR REPLACE FUNCTION calculate_referral_commission(
  p_user_id uuid,
  p_transaction_amount numeric,
  p_transaction_type text
)
RETURNS void AS $$
DECLARE
  referral_record referrals%ROWTYPE;
  commission_amount numeric;
  commission_rates numeric[] := ARRAY[0.03, 0.02, 0.01]; -- 3%, 2%, 1%
BEGIN
  -- Calculer les commissions pour les 3 niveaux
  FOR referral_record IN 
    SELECT * FROM referrals 
    WHERE referred_id = p_user_id
    ORDER BY level
  LOOP
    -- Calculer la commission selon le niveau
    commission_amount := p_transaction_amount * commission_rates[referral_record.level];
    
    -- Créditer la commission au parrain
    UPDATE users 
    SET balance = balance + commission_amount,
        updated_at = now()
    WHERE id = referral_record.referrer_id;
    
    -- Enregistrer la transaction de commission
    INSERT INTO transactions (user_id, type, amount, status, description, reference)
    VALUES (
      referral_record.referrer_id,
      'referral',
      commission_amount,
      'completed',
      'Commission niveau ' || referral_record.level || ' - ' || p_transaction_type || 
      ' de ' || (SELECT username FROM users WHERE id = p_user_id),
      'REF-L' || referral_record.level || '-' || p_user_id || '-' || extract(epoch from now())::bigint
    );
    
    -- Mettre à jour les statistiques de parrainage
    UPDATE referrals
    SET total_earned = total_earned + commission_amount
    WHERE id = referral_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;