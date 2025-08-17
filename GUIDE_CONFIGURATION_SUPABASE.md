# 🚀 GUIDE CONFIGURATION SUPABASE - ÉTAPE PAR ÉTAPE

## 🎯 **OBJECTIF : Rendre votre application 100% opérationnelle avec Supabase**

---

## 📋 **ÉTAPE 1 : Connecter Supabase (2 minutes)**

### **🔗 Dans Bolt :**
1. **Cliquez sur "Connect to Supabase"** en haut à droite de votre écran
2. **Connectez-vous** à votre compte Supabase
3. **Sélectionnez votre projet** ou créez-en un nouveau

### **🆕 Si vous n'avez pas de projet Supabase :**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet :
   - **Nom** : `football-betting-app`
   - **Mot de passe DB** : choisissez un mot de passe sécurisé
   - **Région** : Europe (eu-west-1) ou la plus proche
4. **Attendez 2-3 minutes** que le projet soit créé

---

## 🗄️ **ÉTAPE 2 : Créer la base de données (3 minutes)**

### **📝 Dans votre projet Supabase :**

1. **Allez dans "SQL Editor"** (menu de gauche)
2. **Cliquez sur "New query"**
3. **Copiez TOUT le contenu** du fichier `supabase/migrations/setup_simple_database.sql`
4. **Collez-le** dans l'éditeur SQL
5. **Cliquez sur "Run"** ▶️

### **✅ Vous devriez voir :**
```
✅ Base de données configurée avec succès !
📊 Tables créées : users, matches, bets, transactions, system_settings
🔒 Sécurité RLS activée sur toutes les tables
⚽ 8 matchs de test ajoutés
⚙️ Paramètres système configurés
```

---

## 🔐 **ÉTAPE 3 : Configurer l'authentification (1 minute)**

### **🔧 Dans Supabase :**

1. **Allez dans "Authentication"** → **"Settings"**
2. **Désactivez** "Enable email confirmations" ❌
3. **Dans "Site URL"**, mettez : `http://localhost:5173`
4. **Dans "Redirect URLs"**, ajoutez : `http://localhost:5173/**`

---

## ✅ **ÉTAPE 4 : Vérifier que tout fonctionne (1 minute)**

### **🔍 Vérifier les tables :**
1. **Database** → **Tables**
2. **Vous devriez voir** :
   - ✅ `users` (vide pour l'instant)
   - ✅ `matches` (8 matchs de test)
   - ✅ `bets` (vide)
   - ✅ `transactions` (vide)
   - ✅ `system_settings` (8 paramètres)

### **🔍 Vérifier l'authentification :**
1. **Authentication** → **Settings**
2. **Email confirmations** doit être ❌ désactivé
3. **Site URL** doit être `http://localhost:5173`

---

## 🎯 **ÉTAPE 5 : Tester l'application (2 minutes)**

### **📱 Dans votre application :**

1. **Créez un nouveau compte** via l'inscription :
   - **Nom** : `TestUser`
   - **Téléphone** : `+33123456789`
   - **Mot de passe** : `password123`
   - **Pays** : `France`

2. **Connectez-vous** avec ces identifiants

3. **Vérifiez** que :
   - ✅ Vous êtes connecté
   - ✅ Vous avez 50,000 FCFA de bonus de bienvenue
   - ✅ Vous voyez les 8 matchs de test
   - ✅ Vous pouvez placer des paris

### **👨‍💼 Pour tester l'admin :**

1. **Créez un compte admin** :
   - **Nom** : `admin`
   - **Email** : `admin@admin.footballbet.com`
   - **Téléphone** : `+33999999999`
   - **Mot de passe** : `admin123`

2. **Allez sur** `/admin` et connectez-vous

---

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **❌ "Invalid API key"**
- Vérifiez que Supabase est bien connecté dans Bolt
- Redémarrez le serveur de développement

### **❌ "RLS policy violation"**
- Assurez-vous d'avoir exécuté le script SQL complet
- Vérifiez dans Database → Policies

### **❌ "User not found"**
- Créez un nouveau compte via l'inscription
- Ne pas utiliser les anciens comptes de test

---

## 🎉 **RÉSULTAT FINAL**

Après ces 5 étapes, vous aurez :

### **✅ Application 100% opérationnelle :**
- 🔐 **Authentification** Supabase native
- ⚽ **8 matchs** avec cotes réalistes
- 💰 **Système de paris** fonctionnel
- 🏦 **Transactions** en temps réel
- 👨‍💼 **Administration** complète
- 🔒 **Sécurité** RLS activée

### **✅ Fonctionnalités testables :**
- Inscription/Connexion
- Placement de paris avec débit du solde
- Historique des transactions
- Panel d'administration
- Gestion des matchs

**Votre application sera 100% opérationnelle avec Supabase !** 🚀

---

## 📞 **BESOIN D'AIDE ?**

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs Supabase dans "Logs" → "API"
3. Assurez-vous que toutes les étapes sont suivies dans l'ordre

**Commencez par cliquer sur "Connect to Supabase" en haut à droite !** 🔗