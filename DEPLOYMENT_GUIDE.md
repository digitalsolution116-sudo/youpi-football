# 🚀 Guide de Déploiement - Application de Paris Sportifs

## 📋 Prérequis

### 1. Compte Supabase (Base de données)
- Créer un compte sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Noter l'URL du projet et la clé API anonyme

### 2. Hébergement (Choisir une option)
- **Netlify** (Recommandé - Gratuit)
- **Vercel** (Gratuit)
- **Hostinger/OVH** (Payant)
- **VPS** (Avancé)

## 🔧 Configuration Supabase

### Étape 1: Créer les tables
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- (Le code SQL est déjà dans supabase/migrations/)

-- 1. Activer les extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Créer les tables (voir fichier migration)
-- 3. Configurer RLS (Row Level Security)
-- 4. Créer les politiques de sécurité
```

### Étape 2: Configuration Auth
- Aller dans Authentication > Settings
- Désactiver "Email confirmations" 
- Configurer les redirections

## 🌐 Déploiement sur différentes plateformes

### Option 1: Netlify (Recommandé)
```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Build du projet
npm run build

# 3. Déployer
netlify deploy --prod --dir=dist
```

### Option 2: Vercel
```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer
vercel --prod
```

### Option 3: Hébergement traditionnel
```bash
# 1. Build du projet
npm run build

# 2. Uploader le dossier 'dist' sur votre serveur
# 3. Configurer le serveur web (Apache/Nginx)
```

## ⚙️ Variables d'environnement

### Sur Netlify:
1. Site settings > Environment variables
2. Ajouter:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Sur Vercel:
1. Project settings > Environment Variables
2. Ajouter les mêmes variables

## 🔒 Sécurité

### 1. Clés API
- ✅ Utiliser les clés "anon" pour le frontend
- ❌ JAMAIS exposer les clés "service_role"

### 2. CORS
- Configurer les domaines autorisés dans Supabase
- Ajouter votre domaine de production

### 3. RLS (Row Level Security)
- ✅ Activé sur toutes les tables
- ✅ Politiques configurées

## 📱 PWA (Application Mobile)

### Configuration automatique:
- ✅ Manifest.json configuré
- ✅ Service Worker (optionnel)
- ✅ Icônes PWA incluses

### Installation:
- Les utilisateurs peuvent "Ajouter à l'écran d'accueil"
- Fonctionne comme une app native

## 🎯 Fonctionnalités à configurer

### 1. Paiements Mobile Money
- Intégrer les APIs Orange Money / MTN Money
- Configurer les webhooks

### 2. Notifications Push
- Configurer Firebase (optionnel)
- Notifications en temps réel

### 3. Analytics
- Google Analytics
- Supabase Analytics

## 🚨 Checklist avant déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données Supabase créée
- [ ] Tables et politiques RLS configurées
- [ ] Tests sur différents appareils
- [ ] Domaine personnalisé configuré
- [ ] SSL/HTTPS activé
- [ ] Sauvegarde de la base de données

## 📞 Support

En cas de problème:
1. Vérifier les logs de build
2. Tester en local avec `npm run build && npm run preview`
3. Vérifier la console du navigateur
4. Contrôler les variables d'environnement

## 🎉 Après déploiement

Votre application sera accessible à:
- `https://votre-domaine.com`
- Fonctionnalités complètes
- Interface responsive
- PWA installable