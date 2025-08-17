# 🚀 Guide de Configuration Supabase - Application Football Betting

## 📋 Étape 1 : Créer un projet Supabase

1. **Allez sur [supabase.com](https://supabase.com)**
2. **Cliquez sur "Start your project"**
3. **Connectez-vous** avec GitHub, Google ou email
4. **Créez un nouveau projet** :
   - Nom : `football-betting-app`
   - Mot de passe DB : `votre-mot-de-passe-securise`
   - Région : `Europe (eu-west-1)` ou la plus proche

⏱️ **Attendez 2-3 minutes** que le projet soit créé.

---

## 🔑 Étape 2 : Récupérer vos clés API

1. **Dans votre projet Supabase**, allez dans **Settings** → **API**
2. **Copiez ces informations** :
   - **Project URL** : `https://votre-projet-id.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📝 Étape 3 : Configurer les variables d'environnement

1. **Créez un fichier `.env`** à la racine du projet
2. **Ajoutez vos clés** :

```env
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_NODE_ENV=development
```

⚠️ **Remplacez** `votre-projet-id` et la clé par vos vraies valeurs !

---

## 🗄️ Étape 4 : Créer la base de données

1. **Dans Supabase**, allez dans **SQL Editor**
2. **Cliquez sur "New query"**
3. **Copiez TOUT le contenu** du fichier `supabase/migrations/create_complete_operational_schema.sql`
4. **Collez-le** dans l'éditeur SQL
5. **Cliquez sur "Run"** ▶️

✅ **Vous devriez voir** : "Success. No rows returned"

---

## 🔐 Étape 5 : Configurer l'authentification

1. **Allez dans Authentication** → **Settings**
2. **Désactivez** "Enable email confirmations" ❌
3. **Dans Site URL**, ajoutez : `http://localhost:5173`
4. **Dans Redirect URLs**, ajoutez :
   - `http://localhost:5173`
   - `http://localhost:5173/**`

---

## ✅ Étape 6 : Vérifier que tout fonctionne

### **Vérifier les tables :**
1. **Allez dans Database** → **Tables**
2. **Vous devriez voir** :
   - ✅ `auth_users` (4 utilisateurs)
   - ✅ `user_profiles` (4 profils)
   - ✅ `admin_accounts` (2 admins)
   - ✅ `football_matches` (8 matchs)
   - ✅ `user_bets` (paris)
   - ✅ `user_transactions` (transactions)

### **Vérifier les fonctions :**
1. **Allez dans Database** → **Functions**
2. **Vous devriez voir** :
   - ✅ `authenticate_user`
   - ✅ `authenticate_admin`
   - ✅ `place_bet`
   - ✅ `process_deposit`

---

## 🎯 Étape 7 : Tester l'application

### **Redémarrez l'application :**
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

### **Testez la connexion :**
- **Utilisateur** : `+33123456789` / `password123`
- **Admin** : `admin` / `admin123`

---

## 🚨 Problèmes courants et solutions

### **Erreur "Invalid API key"**
- ✅ Vérifiez vos clés dans `.env`
- ✅ Redémarrez le serveur de dev

### **Erreur "Function not found"**
- ✅ Exécutez le script SQL complet
- ✅ Vérifiez dans Database → Functions

### **Erreur "RLS policy violation"**
- ✅ Les politiques RLS sont créées automatiquement
- ✅ Vérifiez dans Database → Policies

### **Erreur de CORS**
- ✅ Ajoutez `http://localhost:5173` dans Authentication → Settings

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez la console** du navigateur (F12)
2. **Vérifiez les logs** Supabase dans Logs → API
3. **Assurez-vous** que toutes les étapes sont suivies

---

## 🎉 Résultat final

Une fois configuré, vous aurez :
- ✅ **Connexion fonctionnelle** avec les comptes de test
- ✅ **Paris en temps réel** avec vraie base de données
- ✅ **Administration complète** opérationnelle
- ✅ **Transactions crypto** fonctionnelles
- ✅ **Système VIP** et parrainage actifs

**Votre application sera 100% opérationnelle !** 🏆