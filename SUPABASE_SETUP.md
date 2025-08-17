# 🚀 Configuration Supabase - Guide Complet

## 📋 Étapes de configuration

### 1. 🔑 Récupérer vos clés Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet (ou créez-en un nouveau)
4. Allez dans **Settings** → **API**
5. Copiez :
   - **Project URL** (commence par https://xxx.supabase.co)
   - **anon public** key (clé publique)

### 2. 📝 Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Copiez .env.example vers .env
cp .env.example .env
```

Puis modifiez `.env` avec vos vraies clés :

```env
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

### 3. 🗄️ Créer la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu du fichier `supabase/migrations/create_complete_schema.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur **Run** pour exécuter

### 4. 🔐 Configurer l'authentification

1. Allez dans **Authentication** → **Settings**
2. **Désactivez** "Enable email confirmations"
3. Dans **Site URL**, ajoutez votre domaine de production
4. Dans **Redirect URLs**, ajoutez :
   - `http://localhost:5173` (développement)
   - `https://votre-domaine.com` (production)

### 5. 🛡️ Vérifier la sécurité (RLS)

1. Allez dans **Database** → **Tables**
2. Vérifiez que toutes les tables ont **RLS enabled** ✅
3. Vérifiez les **Policies** pour chaque table

### 6. 📊 Données de test (optionnel)

Pour ajouter des matchs de démonstration :

```sql
-- Insérer quelques matchs de test
INSERT INTO matches (home_team, away_team, league, country, match_date, odds_home, odds_draw, odds_away) VALUES
('FC Porto Gaza', 'Zuliano', 'Venezuela Super', 'Venezuela', now() + interval '2 hours', 2.1, 3.2, 2.8),
('Sporting Córdoba', 'Kilmes', 'Liga Argentina B', 'Argentine', now() + interval '1 day', 1.8, 3.5, 3.1),
('Réserve Asunción', 'Olympia Réserve', 'Réserve de Barra', 'Paraguay', now() + interval '3 hours', 2.5, 3.0, 2.2);
```

## ✅ Vérification

Pour tester que tout fonctionne :

1. Lancez l'application : `npm run dev`
2. Essayez de vous inscrire avec un nouvel utilisateur
3. Vérifiez dans Supabase → **Authentication** → **Users**
4. Vérifiez dans **Database** → **Table Editor** → **users**

## 🚨 Problèmes courants

### Erreur "Invalid API key"
- Vérifiez que vos clés sont correctes
- Redémarrez le serveur de développement

### Erreur "RLS policy violation"
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que l'utilisateur est bien authentifié

### Erreur de CORS
- Ajoutez votre domaine dans les **Redirect URLs**
- Vérifiez la **Site URL**

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Supabase dans **Logs** → **API**
3. Consultez la documentation Supabase

---

Une fois configuré, votre application sera **100% fonctionnelle** ! 🎉