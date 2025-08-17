# 🚀 CONFIGURATION NETLIFY POUR PRODUCTION

## ⚠️ **PROBLÈME ACTUEL**

Votre application ne fonctionne pas en production car **les variables d'environnement Supabase ne sont pas configurées dans Netlify**.

## 🔧 **SOLUTION : Configurer les variables d'environnement**

### **ÉTAPE 1 : Récupérer vos clés Supabase**

1. **Allez sur** [supabase.com](https://supabase.com)
2. **Sélectionnez votre projet**
3. **Allez dans** Settings → API
4. **Copiez** :
   - **Project URL** : `https://votre-projet-id.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **ÉTAPE 2 : Configurer dans Netlify**

1. **Allez sur** [netlify.com](https://netlify.com)
2. **Connectez-vous** à votre compte
3. **Trouvez votre site** "lustrous-crepe-0a441f"
4. **Cliquez sur** "Site settings"
5. **Allez dans** "Environment variables"
6. **Ajoutez ces variables** :

```
VITE_SUPABASE_URL = https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_NODE_ENV = production
```

### **ÉTAPE 3 : Redéployer**

1. **Dans Netlify**, allez dans "Deploys"
2. **Cliquez sur** "Trigger deploy" → "Deploy site"
3. **Attendez** que le déploiement soit terminé

## ✅ **APRÈS CONFIGURATION**

Votre application fonctionnera parfaitement avec :
- ✅ Inscription/Connexion opérationnelles
- ✅ Base de données Supabase connectée
- ✅ Toutes les fonctionnalités actives

## 🎯 **COMPTES DE TEST DISPONIBLES**

Une fois configuré, vous pourrez :

### **📱 Créer de nouveaux comptes :**
- Inscription avec téléphone + mot de passe
- Bonus automatique de 50,000 FCFA

### **👨‍💼 Accès admin :**
- URL : `https://votre-domaine.com/admin`
- Identifiants : `admin` / `admin123`

## 🚨 **IMPORTANT**

**Sans ces variables d'environnement, l'application ne peut pas se connecter à Supabase !**

Configurez-les maintenant dans Netlify pour que votre app fonctionne en production.