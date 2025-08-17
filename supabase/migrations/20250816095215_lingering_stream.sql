/*
  # Corriger le bonus de bienvenue à 50 FCFA

  1. Mise à jour
    - Modifier le bonus de bienvenue par défaut à 50 FCFA
    - Mettre à jour la fonction de création d'utilisateur
  
  2. Sécurité
    - Maintenir les politiques RLS existantes
*/

-- Mettre à jour le solde par défaut des nouveaux utilisateurs
ALTER TABLE users ALTER COLUMN balance SET DEFAULT 50;

-- Fonction pour créer un utilisateur avec le bon bonus
CREATE OR REPLACE FUNCTION create_user_with_welcome_bonus(
  p_user_id uuid,
  p_username text,
  p_email text,
  p_phone text,
  p_country text,
  p_referral_code text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insérer l'utilisateur avec 50 FCFA de bonus
  INSERT INTO users (
    id, username, email, phone, country, 
    balance, referral_code, investment_plan, 
    daily_return, status, vip_level
  ) VALUES (
    p_user_id, p_username, p_email, p_phone, p_country,
    50, COALESCE(p_referral_code, p_username), 'basic',
    1.5, 'active', 'Standard'
  );

  -- Créer la transaction de bonus
  INSERT INTO transactions (
    user_id, type, amount, status, description, reference
  ) VALUES (
    p_user_id, 'bonus', 50, 'completed',
    'Bonus de bienvenue - 50 FCFA',
    'WELCOME-' || extract(epoch from now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;