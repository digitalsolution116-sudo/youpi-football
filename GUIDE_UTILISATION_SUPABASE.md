# 🚀 GUIDE D'UTILISATION AVEC SUPABASE

## 📋 CONFIGURATION REQUISE

### 1. **Activer l'authentification par Email dans Supabase**
- Allez dans votre dashboard Supabase
- **Authentication** → **Settings** → **Providers**
- Activez **Email** (désactivez Phone si activé)

### 2. **Configurer les politiques RLS pour la table users**
```sql
-- Politique pour permettre aux utilisateurs de créer leur profil
CREATE POLICY "Users can insert own profile" ON users
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de lire leur profil
CREATE POLICY "Users can read own profile" ON users
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de modifier leur profil
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE TO authenticated
USING (auth.uid() = id);
```

## 🧪 COMPTES DE TEST

### **Utilisateurs de test** (à créer manuellement dans Supabase) :

1. **Arthur2024**
   - Email: `arthur@test.com`
   - Téléphone: `+225 07 12 34 56 78`
   - Mot de passe: `password123`
   - Solde: 125,000 FCFA

2. **SportFan**
   - Email: `sportfan@test.com`
   - Téléphone: `+225 05 98 76 54 32`
   - Mot de passe: `password123`
   - Solde: 75,000 FCFA

3. **BetMaster**
   - Email: `betmaster@test.com`
   - Téléphone: `+225 01 23 45 67 89`
   - Mot de passe: `password123`
   - Solde: 350,000 FCFA

4. **ProGamer**
   - Email: `progamer@test.com`
   - Téléphone: `+225 09 87 65 43 21`
   - Mot de passe: `password123`
   - Solde: 45,000 FCFA

## 🔧 COMMENT TESTER

1. **Connexion** : Utilisez le numéro de téléphone et le mot de passe
2. **L'app convertit automatiquement** le téléphone en email pour l'authentification
3. **Toutes les fonctionnalités** sont opérationnelles

## ⚠️ IMPORTANT

- Les utilisateurs de test doivent être créés manuellement dans votre base Supabase
- L'authentification utilise l'email en arrière-plan
- L'interface utilisateur continue d'afficher les numéros de téléphone