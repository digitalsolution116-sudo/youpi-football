# 🚀 CONFIGURATION SUPABASE - GUIDE COMPLET

## 📋 ÉTAPES À SUIVRE MAINTENANT

### **🔗 ÉTAPE 1 : Connecter Supabase (2 minutes)**

1. **Cliquez sur "Connect to Supabase"** en haut à droite de Bolt
2. **Connectez-vous** à votre compte Supabase
3. **Sélectionnez votre projet** ou créez-en un nouveau

### **🗄️ ÉTAPE 2 : Exécuter le script SQL (3 minutes)**

1. **Allez dans votre projet Supabase**
2. **Cliquez sur "SQL Editor"** dans le menu de gauche
3. **Cliquez sur "New query"**
4. **Copiez TOUT le contenu** du fichier `supabase/migrations/setup_complete_database.sql`
5. **Collez-le** dans l'éditeur SQL
6. **Cliquez sur "Run"** ▶️

✅ **Vous devriez voir** : "Success. No rows returned" avec plusieurs messages de confirmation

### **🔐 ÉTAPE 3 : Configurer l'authentification (1 minute)**

1. **Allez dans "Authentication"** → **"Settings"**
2. **Désactivez** "Enable email confirmations" ❌
3. **Dans "Site URL"**, mettez : `http://localhost:5173`
4. **Dans "Redirect URLs"**, ajoutez : `http://localhost:5173/**`

### **✅ ÉTAPE 4 : Vérifier la configuration**

1. **Allez dans "Database"** → **"Tables"**
2. **Vérifiez que ces tables existent** :
   - ✅ `users` (4 utilisateurs de test)
   - ✅ `admin_accounts` (2 admins)
   - ✅ `football_matches` (8 matchs)
   - ✅ `user_bets` (paris de test)
   - ✅ `user_transactions` (transactions)
   - ✅ `crypto_wallets` (portefeuilles crypto)

3. **Allez dans "Database"** → **"Functions"**
4. **Vérifiez que ces fonctions existent** :
   - ✅ `authenticate_user`
   - ✅ `authenticate_admin`
   - ✅ `place_bet`
   - ✅ `process_deposit`
   - ✅ `get_admin_stats`

---

## 🎯 **APRÈS CONFIGURATION, TESTEZ :**

### **🔑 Comptes utilisateurs (FONCTIONNELS) :**
- **Arthur2024** → `+33123456789` / `password123` (125k FCFA, VIP 1)
- **SportFan** → `+33987654321` / `password123` (75k FCFA, Standard)
- **BetMaster** → `+225070123456` / `password123` (350k FCFA, VIP 2)
- **ProGamer** → `+221771234567` / `password123` (45k FCFA, Standard)

### **👨‍💼 Comptes admin (FONCTIONNELS) :**
- **Super Admin** → `admin` / `admin123`
- **Modérateur** → `moderator` / `mod123`

---

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **❌ Erreur "Invalid API key"**
- Vérifiez que Supabase est bien connecté
- Redémarrez le serveur de développement

### **❌ Erreur "Function not found"**
- Le script SQL n'a pas été exécuté complètement
- Réexécutez le script dans SQL Editor

### **❌ Erreur "RLS policy violation"**
- Les politiques de sécurité sont créées automatiquement
- Vérifiez dans Database → Policies

### **❌ Erreur de CORS**
- Ajoutez `http://localhost:5173` dans Authentication → Settings
- Vérifiez les Redirect URLs

---

## 🎉 **RÉSULTAT FINAL**

Une fois configuré, vous aurez :
- ✅ **Connexion fonctionnelle** avec vrais utilisateurs
- ✅ **Paris en temps réel** avec base de données
- ✅ **Administration complète** opérationnelle
- ✅ **Transactions crypto** fonctionnelles
- ✅ **Système VIP** et parrainage actifs
- ✅ **Multi-devises** FCFA/USD + cryptos

**Votre application sera 100% opérationnelle avec Supabase !** 🏆

---

## 📞 **BESOIN D'AIDE ?**

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs Supabase dans "Logs" → "API"
3. Assurez-vous que toutes les étapes sont suivies dans l'ordre

**Commencez par cliquer sur "Connect to Supabase" en haut à droite !** 🚀