# Sillage — by RLN Consulting — Phase 1

Analyse patrimoniale & conseil 360°.

## Ce qui a été créé (Phase 1)

- Projet **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind.
- Identité visuelle réelle RLN Consulting dès le départ : logo, couleurs
  or/prune/noir extraites de la charte officielle, typographie Bodoni Moda.
- Authentification Supabase (email/mot de passe) : `/login`, `/register`.
- Proxy Next.js (`proxy.ts`, anciennement "middleware") qui protège
  `/dashboard` et `/clients` et redirige vers `/login` si non connecté.
- Base de données Postgres (`database/migrations/0001_init.sql`) :
  tables `profiles`, `clients`, `conjoints`, `enfants`, avec Row Level
  Security (chaque conseiller ne voit que ses propres clients).
- Dashboard conseiller avec cartes statistiques (patrimoine, capacité
  d'épargne et opportunités en placeholder — Phase 3 et 6).
- Module Clients **complet pour la Phase 1**, création ET modification :
  - liste des clients (`/clients`)
  - création (`/clients/nouveau`) et **modification** (`/clients/[id]/modifier`)
    d'un client — identité, situation familiale, conjoint, enfants
  - fiche client en lecture avec suppression (`/clients/[id]`)
  - API interne `GET/POST /api/clients`, `GET/PATCH/DELETE /api/clients/[id]`
- Système unifié "information manquante" (bordeaux), validé sur la
  maquette avant d'être codé : `components/layout/missing-info.tsx`.
- Architecture modulaire posée dès maintenant : `/calculations`, `/rules`,
  `/prompts`, `/documents` existent (vides, avec un README expliquant à
  quelle phase ils se remplissent), pour respecter le pipeline
  DONNÉES → CALCULS → RÈGLES → DIAGNOSTICS → CLAUDE dès la structure.

## Comment lancer le projet

```bash
npm install
cp .env.example .env.local
# renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Puis appliquer la migration sur votre projet Supabase (éditeur SQL de
Supabase, ou `npx supabase db push` si la CLI est configurée) en exécutant
le contenu de `database/migrations/0001_init.sql`.

### Nom de domaine

Pas besoin d'acheter un nouveau nom de domaine : l'application peut être
déployée en sous-domaine de rlnconsulting.fr, par exemple
`app.rlnconsulting.fr`, pour rester dans le même univers de marque que
le site existant.

## Variables d'environnement

Voir `.env.example` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY` (réservée à la Phase 5, non utilisée pour l'instant)

## Tests réalisés

- `npm install` : installation propre, **0 vulnérabilité** (`npm audit`
  entièrement nettoyé — voir point de sécurité ci-dessous).
- `npx next build` : build de production réussi, 9 routes générées,
  aucune erreur de compilation ni de typage, `SupabaseClient<Database>`
  strict de bout en bout.
- `npx next dev` : serveur de développement réellement démarré et testé :
  - `GET /login` → 200 (page publique accessible)
  - `GET /dashboard` sans session → 307 vers `/login?redirectedFrom=...`
    (le proxy protège bien les routes conseiller)

## Point de sécurité important — Next.js 14 → 16

Le projet a été **initialement construit sur Next.js 14**, avant qu'on
découvre en cours de route que cette version est en fin de vie depuis
octobre 2025 et ne reçoit plus de correctif de sécurité — y compris pour
une faille de déni de service (CVE-2026-23864, janvier 2026) touchant
directement l'App Router, sans correctif prévu pour la branche 14.x.

Le projet a donc été entièrement basculé sur **Next.js 16** (version
activement supportée à ce jour), ce qui a impliqué :

- React 19 (nouvelle exigence de Next 16).
- `cookies()` et les `params` de route dynamique sont désormais
  **asynchrones** (`await cookies()`, `await params`) — déjà appliqué
  partout dans le code livré.
- Renommage de `middleware.ts` en **`proxy.ts`** (nouvelle convention
  Next 16) — important car plusieurs correctifs de sécurité de cette
  couche ne s'activent que sous ce nouveau nom.
- Mise à jour de `@react-pdf/renderer` (3.x → 4.9, pour la compatibilité
  React 19 ; non utilisé avant la Phase 7 de toute façon) et de la chaîne
  de test `vitest` (2.x → 4.x, vulnérabilités corrigées).

**Recommandation pour la suite** : Next.js publie des versions de
sécurité régulièrement. Avant chaque mise en production, ou au minimum
une fois par trimestre, relancer `npm audit` et vérifier sur
nextjs.org/blog qu'aucune nouvelle fin de vie n'approche.

### Point de vigilance technique restant — typage Supabase

Comme pour la première version du projet, `types/database.types.ts` a
été généré par introspection directe du schéma Postgres réellement
appliqué (Docker, requis par `npx supabase gen types typescript`, n'est
pas disponible dans cet environnement de build). Le typage est fidèle au
schéma, mais à régénérer avec la commande officielle dès qu'un projet
Supabase réel et Docker seront disponibles :

```bash
npx supabase gen types typescript --project-id <votre-project-id> > types/database.types.ts
```

## Phase 2 — sous-étape 1 : mode client (fondation)

Un client peut désormais avoir son propre compte de connexion, distinct
du conseiller qui gère son dossier :

- **Migration** `database/migrations/0002_client_access.sql` : ajoute
  `clients.user_id` (lien vers `auth.users`) et des policies RLS pour
  qu'un client connecté ne voie que sa propre fiche.
- **Invitation** : depuis la fiche client (section "Espace client"), le
  conseiller clique sur "Inviter à se connecter". Ça envoie un email
  d'invitation Supabase, crée le profil avec le rôle `client`, et relie
  le compte à la fiche.
- **Espace client** (`/mon-espace`) : zone séparée du dashboard
  conseiller, avec sa propre garde d'accès. Pour l'instant en lecture
  seule (identité) — le questionnaire modifiable arrive à la sous-étape
  suivante.
- **Redirection par rôle** : après connexion, un conseiller atterrit sur
  `/dashboard`, un client sur `/mon-espace` — chacun est bloqué de
  l'espace de l'autre même en devinant l'URL.

### Nouvelle variable d'environnement sensible

L'invitation d'un client nécessite la **clé `service_role`** de Supabase
(`SUPABASE_SERVICE_ROLE_KEY` dans `.env.example`), qui contourne toutes
les règles de sécurité de la base — à ne jamais préfixer par
`NEXT_PUBLIC_`, ni exposer côté navigateur. Elle n'est utilisée que dans
`lib/supabase/admin.ts`, importé uniquement par la route serveur
`app/api/clients/[clientId]/inviter/route.ts`.

**Avant de redéployer** : ajouter cette clé dans les variables
d'environnement Vercel (disponible dans Supabase > Settings > API Keys,
section "Secret keys" — pas "Publishable key").

## Prochaines étapes (Phase 2, suite)

- Questionnaire guidé (parcours en 12 étapes) permettant au client de
  compléter lui-même son dossier depuis `/mon-espace`.
- Module Documents (upload, catégories, statut, version) — avec le même
  badge bordeaux "information manquante" que sur la fiche client.

Aucune règle patrimoniale avancée, aucune préconisation, aucun rapport
PDF n'a été développé à ce stade, conformément à la feuille de route.
