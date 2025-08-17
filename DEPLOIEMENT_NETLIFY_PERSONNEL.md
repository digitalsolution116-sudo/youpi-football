# 🚀 DÉPLOYER SUR VOTRE PROPRE COMPTE NETLIFY

## 📋 **ÉTAPES COMPLÈTES POUR DÉPLOYER SUR youpi-football.com**

---

## 🔧 **MÉTHODE 1 : Déploiement via GitHub (Recommandé)**

### **ÉTAPE 1 : Préparer le code**
1. **Téléchargez** tout le code de votre projet Bolt
2. **Créez un repository GitHub** :
   - Allez sur [github.com](https://github.com)
   - Cliquez sur "New repository"
   - Nom : `youpi-football-app`
   - Cochez "Public" ou "Private"
   - Cliquez "Create repository"

### **ÉTAPE 2 : Uploader le code**
```bash
# Dans votre dossier de projet local
git init
git add .
git commit -m "Initial commit - Football betting app"
git branch -M main
git remote add origin https://github.com/votre-username/youpi-football-app.git
git push -u origin main
```

### **ÉTAPE 3 : Connecter à Netlify**
1. **Allez sur** [netlify.com](https://netlify.com)
2. **Connectez-vous** à votre compte
3. **Cliquez sur** "New site from Git"
4. **Choisissez** "GitHub"
5. **Sélectionnez** votre repository `youpi-football-app`
6. **Configurez** :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : `18`

---

## 🔧 **MÉTHODE 2 : Déploiement manuel**

### **ÉTAPE 1 : Build local**
```bash
# Dans votre projet
npm install
npm run build
```

### **ÉTAPE 2 : Upload manuel**
1. **Dans Netlify** → **Sites** → **Add new site** → **Deploy manually**
2. **Glissez-déposez** le dossier `dist` généré
3. **Attendez** le déploiement

---

## 🌐 **CONFIGURER LE DOMAINE youpi-football.com**

### **ÉTAPE 1 : Ajouter le domaine dans Netlify**
1. **Dans votre site Netlify** → **Domain settings**
2. **Cliquez sur** "Add custom domain"
3. **Entrez** : `youpi-football.com`
4. **Cliquez** "Verify" puis "Add domain"

### **ÉTAPE 2 : Configurer le DNS**

**Chez votre registrar (OVH, Namecheap, GoDaddy, etc.) :**

#### **Option A : Nameservers Netlify (Recommandé)**
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

#### **Option B : Enregistrements DNS**
```
Type A    : @     → 75.2.60.5
Type CNAME: www   → votre-site.netlify.app
Type CNAME: *     → votre-site.netlify.app
```

---

## ⚙️ **CONFIGURER LES VARIABLES D'ENVIRONNEMENT**

### **🔑 ÉTAPE CRITIQUE : Variables Supabase**

**Dans Netlify** → **Site settings** → **Environment variables** :

```
VITE_SUPABASE_URL = https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_NODE_ENV = production
```

### **📍 Où trouver vos clés Supabase :**
1. **Allez sur** [supabase.com](https://supabase.com)
2. **Votre projet** → **Settings** → **API**
3. **Copiez** :
   - **Project URL**
   - **anon public key**

---

## 🔄 **REDÉPLOYER APRÈS CONFIGURATION**

1. **Deploys** → **Trigger deploy** → **Deploy site**
2. **Attendez** 2-3 minutes
3. **Testez** votre site

---

## ✅ **VÉRIFICATIONS FINALES**

### **🌐 DNS (24-48h pour propagation complète) :**
```bash
# Tester la résolution DNS
nslookup youpi-football.com
```

### **🔒 SSL (Automatique Netlify) :**
- Certificat HTTPS activé automatiquement
- Redirection HTTP → HTTPS

### **📱 Test de fonctionnement :**
1. **Inscription** : Créer un nouveau compte
2. **Connexion** : Se connecter avec les identifiants
3. **Paris** : Placer un pari de test
4. **Admin** : Tester `/admin` avec `admin` / `admin123`

---

## 🚨 **PROBLÈMES COURANTS**

### **❌ "Configuration Supabase manquante"**
- Vérifiez les variables d'environnement dans Netlify
- Redéployez après ajout des variables

### **❌ "Site not found"**
- Vérifiez la configuration DNS
- Attendez la propagation (24-48h max)

### **❌ "Build failed"**
- Vérifiez que `npm run build` fonctionne localement
- Vérifiez les logs de build dans Netlify

---

## 🎯 **RÉSULTAT FINAL**

Après configuration, vous aurez :
- ✅ **youpi-football.com** pointant vers votre app
- ✅ **HTTPS** automatique
- ✅ **Inscription/Connexion** fonctionnelles
- ✅ **Base de données** Supabase connectée
- ✅ **Administration** accessible sur `/admin`

---

## 📞 **BESOIN D'AIDE ?**

1. **Vérifiez** les variables d'environnement dans Netlify
2. **Testez** la résolution DNS avec `nslookup`
3. **Consultez** les logs de déploiement Netlify

**Commencez par configurer les variables Supabase dans Netlify !** 🔑