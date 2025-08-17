# 🌐 GUIDE : Configurer youpi-football.com sur Netlify

## 🎯 **OBJECTIF**
Faire pointer votre domaine `youpi-football.com` vers votre application Netlify.

---

## 📋 **ÉTAPES À SUIVRE**

### **🔗 ÉTAPE 1 : Ajouter le domaine dans Netlify**

1. **Allez sur** [netlify.com](https://netlify.com) et connectez-vous
2. **Trouvez votre site** "lustrous-crepe-0a441f"
3. **Cliquez sur** "Domain settings"
4. **Cliquez sur** "Add custom domain"
5. **Entrez** : `youpi-football.com`
6. **Cliquez sur** "Verify" puis "Add domain"

### **🌐 ÉTAPE 2 : Configurer le DNS**

Vous avez **2 options** :

#### **Option A : Utiliser les nameservers Netlify (Recommandé)**
1. **Dans Netlify**, notez les nameservers :
   - `dns1.p01.nsone.net`
   - `dns2.p01.nsone.net` 
   - `dns3.p01.nsone.net`
   - `dns4.p01.nsone.net`

2. **Chez votre registrar** (OVH, Namecheap, etc.) :
   - Changez les nameservers pour ceux de Netlify
   - **Délai** : 24-48h pour propagation

#### **Option B : Enregistrements DNS manuels**
1. **Chez votre registrar**, ajoutez :
   - **Type A** : `@` → `75.2.60.5`
   - **Type CNAME** : `www` → `lustrous-crepe-0a441f.netlify.app`

### **🔒 ÉTAPE 3 : Activer HTTPS**
- Netlify activera automatiquement le certificat SSL
- **Délai** : 5-10 minutes après configuration DNS

### **⚙️ ÉTAPE 4 : Configurer les variables d'environnement**

**CRITIQUE** : Ajoutez vos clés Supabase dans Netlify :

1. **Site settings** → **Environment variables**
2. **Ajoutez** :
   ```
   VITE_SUPABASE_URL = https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY = votre-clé-anonyme
   VITE_NODE_ENV = production
   ```

### **🔄 ÉTAPE 5 : Redéployer**
1. **Deploys** → **Trigger deploy** → **Deploy site**
2. **Attendez** que le build soit terminé

---

## ✅ **RÉSULTAT FINAL**

Votre application sera accessible sur :
- ✅ `https://youpi-football.com`
- ✅ `https://www.youpi-football.com`
- ✅ Certificat SSL automatique
- ✅ Redirection HTTP → HTTPS

---

## 🚨 **POINTS IMPORTANTS**

### **Variables d'environnement obligatoires :**
Sans vos clés Supabase, l'app ne fonctionnera pas en production !

### **Propagation DNS :**
- **Nameservers** : 24-48h
- **Enregistrements CNAME/A** : 1-4h

### **Test de fonctionnement :**
Une fois configuré, testez :
- ✅ Inscription/Connexion
- ✅ Placement de paris
- ✅ Administration

---

## 📞 **BESOIN D'AIDE ?**

1. **Vérifiez** que votre domaine pointe vers Netlify
2. **Testez** avec `nslookup youpi-football.com`
3. **Contactez** le support de votre registrar si nécessaire

**Votre app sera live sur youpi-football.com une fois le DNS configuré !** 🚀