# Sillage — by RLN Consulting

Analyse patrimoniale & conseil 360°.

**État au 30 août 2026** : Phase 1 (fondations), Phase 2 sous-étape 1
(mode client, en pause), et une bonne partie de la Phase 3 (revenus,
charges, patrimoine, objectifs) sont construites et déployées sur
`https://sillage-ecru.vercel.app`.

---

## Ce qui fonctionne aujourd'hui

### Identité et infrastructure
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind + Supabase.
- Identité visuelle réelle RLN Consulting : logo, couleurs or/prune/noir
  extraites de la charte officielle, typographie Bodoni Moda.
- Hébergement Vercel, base de données Supabase (projet "Sillage by RLN").
- **0 vulnérabilité** (`npm audit`) — voir "Historique des décisions
  techniques" plus bas pour le détail du passage Next.js 14 → 16.

### Authentification
- Connexion, inscription conseiller, mot de passe oublié — `/login`,
  `/register`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe`.
- Un trigger côté base de données (`0003_fix_profile_trigger.sql`) crée
  automatiquement le profil (rôle conseiller ou client) à la création du
  compte — voir "Bugs corrigés" plus bas pour comprendre pourquoi c'était
  nécessaire.

### Module Clients
- Liste, création, **modification**, suppression — `/clients`,
  `/clients/nouveau`, `/clients/[id]`, `/clients/[id]/modifier`.
- Identité, situation familiale, conjoint, enfants.
- Badge bordeaux unifié "information manquante" (un seul système, que ce
  soit bloquant à la création ou juste incomplet dans un dossier existant)
  — `components/layout/missing-info.tsx`.

### Module Documents (checklist, sans upload de fichier pour l'instant)
- Sur chaque fiche client : liste de pièces attendues avec statut
  manquant/reçu.
- Bouton "Checklist standard" qui pré-remplit 4 pièces courantes (identité,
  avis d'imposition, RIB, justificatif de domicile).
- Bandeau "X pièces manquantes pour ce dossier" — pensé pour être repris
  tel quel dans un message au client.
- **Volontairement sans upload de fichier** pour l'instant (décision du
  30/08 pour ne pas construire "une usine à gaz" avant que le besoin soit
  validé à l'usage). L'extraction automatique de données depuis les
  documents (mentionnée dans le cahier des charges initial) suppose cet
  upload — ce sera la suite logique de ce module.

### Module Finances (Phase 3)
- Sur chaque fiche client, 5 sections : **Revenus, Charges, Patrimoine
  immobilier, Placements financiers, Objectifs** — ajout et suppression.
- Une **synthèse patrimoniale** en haut de la fiche (patrimoine brut,
  patrimoine net, revenus mensuels, capacité d'épargne), calculée par des
  fonctions déterministes (`calculations/patrimoine.ts`, testées avec
  Vitest — 8 tests), jamais par l'IA, conformément au principe posé dès
  le cahier des charges initial.
- Champs volontairement resserrés par rapport au cahier des charges
  d'origine (ex. périodicité mensuel/annuel plutôt que la liste complète
  des sous-champs prévus) — à enrichir une fois l'usage validé.

### Mode client — construit puis mis en pause
Un client peut avoir son propre compte (`clients.user_id`, invitation
depuis la fiche client, espace séparé `/mon-espace` en lecture seule).
**Décision du 30/08 : mis en pause.** Pour l'instant, cet espace n'offre
aucune valeur au client (il ne peut rien y saisir) pour un coût de
complexité réel (clé Supabase sensible, emails à gérer). Le code reste
fonctionnel et testé, mais n'est plus enrichi tant que la collecte de
données côté conseiller (Finances, Documents) n'est pas plus avancée.
**Ne pas inviter de vrai client à se connecter pour l'instant.**

---

## Comment lancer le projet

```bash
npm install
cp .env.example .env.local
# renseigner NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# et SUPABASE_SERVICE_ROLE_KEY (nécessaire même si le mode client est en
# pause, car le code qui l'utilise est toujours présent)
npm run dev
```

Appliquer les migrations dans l'ordre, dans l'éditeur SQL Supabase :
`0001_init.sql` → `0002_client_access.sql` → `0003_fix_profile_trigger.sql`
→ `0004_documents.sql` → `0005_finances.sql`.

### Méthode de déploiement

Le code est poussé sur GitHub (dépôt `RLN-Consulting-972/Sillage`) via
**GitHub Desktop** (pas la ligne de commande) : dézipper la nouvelle
version, copier-remplacer le contenu du dossier cloné
(`C:\Users\RLN Co\Documents\GitHub\Sillage`), puis Commit + Push. Vercel
redéploie automatiquement à chaque push sur `main`.

### Nom de domaine

Pas besoin d'acheter un nouveau nom de domaine : l'application peut être
déployée en sous-domaine de rlnconsulting.fr (ex. `app.rlnconsulting.fr`)
le jour où on veut sortir de l'adresse `.vercel.app` fournie gratuitement.

## Variables d'environnement

Voir `.env.example` :

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase > Settings > Data API > "Project URL"
  (pas l'URL qui finit par `/rest/v1/`, juste la base).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase > Settings > API Keys >
  "Publishable key" (nouveau nom Supabase pour l'ancienne "anon key").
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase > Settings > API Keys >
  "Secret keys". **Sensible : jamais de préfixe `NEXT_PUBLIC_`.**
- `ANTHROPIC_API_KEY` — réservée à la Phase 5, non utilisée pour l'instant.

---

## Bugs corrigés en cours de route (30/08)

### Profil conseiller manquant après inscription
`app/(auth)/register/page.tsx` créait le profil juste après
`supabase.auth.signUp()`, à un moment où la session n'est pas encore
établie — les règles de sécurité bloquaient silencieusement cette
insertion (aucune erreur visible). Résultat : impossible de créer le
moindre client (`clients_conseiller_id_fkey` violée), sans message clair.

**Corrigé** par `0003_fix_profile_trigger.sql` : un trigger côté base de
données crée le profil de façon fiable, avec le bon rôle lu dans les
métadonnées du compte (`conseiller` par défaut, `client` pour une
invitation). Testé sous 3 scénarios avant livraison (inscription,
invitation, rattrapage d'un compte déjà bloqué).

### Emails d'authentification non personnalisés
Les emails (confirmation, invitation, mot de passe oublié) sont encore
envoyés par l'adresse générique Supabase, en anglais. **Reporté
volontairement** : Supabase verrouille la personnalisation du texte des
emails sur les projets gratuits créés après juin 2026, tant qu'un service
SMTP personnalisé (Resend, SendGrid...) n'est pas connecté avec un vrai
domaine. À faire avant toute utilisation avec de vrais clients invités à
se connecter (donc pas urgent tant que le mode client reste en pause).

---

## Historique des décisions techniques importantes

### Next.js 14 → 16 (sécurité)
Le projet a été initialement construit sur Next.js 14, avant la
découverte que cette version est en fin de vie depuis octobre 2025, avec
une faille de déni de service (CVE-2026-23864) sans correctif prévu pour
cette branche. Basculé sur Next.js 16, impliquant :
- React 19.
- `cookies()` et les `params` de route dynamique sont désormais
  asynchrones (`await cookies()`, `await params`).
- `middleware.ts` renommé en **`proxy.ts`** (nouvelle convention Next
  16 — plusieurs correctifs de sécurité ne s'activent que sous ce nom).
- `@react-pdf/renderer` 3.x → 4.9 et `vitest` 2.x → 4.x pour compatibilité
  React 19 et vulnérabilités corrigées.

**Recommandation** : relancer `npm audit` avant toute mise en production
importante, et surveiller nextjs.org/blog pour les fins de vie à venir.

### Typage Supabase par introspection
`types/database.types.ts` est généré par introspection directe du schéma
Postgres (script `introspect.js`, hors du projet livré), Docker n'étant
pas disponible dans l'environnement de build pour utiliser
`npx supabase gen types typescript` directement. Le typage est fidèle,
mais à régénérer avec la commande officielle dès que Docker est
disponible :
```bash
npx supabase gen types typescript --project-id <votre-project-id> > types/database.types.ts
```

---

## Point de vigilance avant usage avec de vrais clients

Pas encore construits à ce stade : sauvegarde/export des données,
traçabilité des actions (qui a modifié quoi, quand — prévue dans le
cahier des charges initial), audit de sécurité externe. Pour un usage
réglementé (statut MIOBSP/MIA/ORIAS), garder les documents et données
sources ailleurs en parallèle tant que ces briques n'existent pas.

---

## Module Opportunités (RULES_V0.1)

Sur chaque fiche client, une section "Opportunités" affiche des pistes
détectées **automatiquement** à partir des revenus, charges et patrimoine
déjà saisis — sans upload de document, sans IA, juste 6 règles
déterministes (`rules/opportunites.ts`, 13 tests unitaires) :

1. Concentration immobilière (> 70% du patrimoine brut)
2. Faible liquidité (moins de 3 mois de charges couverts par l'épargne
   disponible)
3. Endettement élevé (mensualités de crédit > 33% des revenus)
4. Assurance emprunteur à vérifier (dès qu'un crédit immobilier est en
   cours)
5. Regroupement de crédits à étudier (2 crédits actifs ou plus)
6. Capacité d'épargne à valoriser (épargne mensuelle notable sans
   PER/PERCOL/assurance-vie)

Ces 6 règles reprennent une partie de la liste de "10 règles de
démonstration" du cahier des charges initial (RULES_V0.1) — les 4
restantes (écart retraite, diversification financière faible,
transmission à étudier, protection du conjoint à étudier) demandent des
données pas encore collectées (retraite, succession) et attendront ces
modules. Le tableau de bord agrège aussi le nombre total d'opportunités
sur l'ensemble du portefeuille.

**Toujours des pistes, jamais des vérités** : chaque opportunité affiche
un rappel qu'elle ne doit jamais être présentée telle quelle à un client
sans validation par la conseillère — conforme au principe "le conseiller
reste décisionnaire" du cahier des charges initial.

## Catégories de revenus et charges — reprises du réseau CGP

Sur transmission d'un tableau budgétaire type utilisé par le réseau de
gestion de patrimoine de l'utilisatrice, les catégories de **revenus**
(31, en 5 groupes) et de **charges** (60, en 10 groupes) ont été
entièrement reprises de cette nomenclature professionnelle, pour rester
cohérente avec les outils déjà utilisés côté réseau :

- Revenus : Revenus d'activité, Pensions, Revenus fonciers, Aides
  sociales, Autres revenus.
- Charges : Impôts et cotisations, Logement, Vie courante, Enfants,
  Animaux, Transports, Banque et assurance, Immobilier locatif, Loisirs,
  Autres charges.

Le menu déroulant regroupe visuellement ces catégories par `<optgroup>`
(`components/clients/finance-section.tsx`) pour rester lisible malgré le
volume. Les anciennes valeurs génériques (ex. "Salaire", "Crédit
immobilier") restent acceptées en base et dans le menu (sous "Général
(ancien)"), pour ne jamais invalider une donnée déjà saisie.

**Extraction automatique** : la migration `0007_categories_revenus_charges.sql`
est générée à partir des valeurs de `modules/finances/types.ts` (pas
recopiée à la main), pour garantir qu'il n'y ait jamais de décalage entre
le code et la contrainte `CHECK` en base.

## Autres corrections de ce lot

- Les libellés de situation familiale ("Marié(e)", "Célibataire"...)
  s'affichent maintenant correctement partout — un bug affichait la
  valeur technique brute ("marie", "celibataire") sur la fiche client et
  la liste des clients.
- Les 5 modules financiers (revenus, charges, immobilier, placements,
  objectifs) sont maintenant **modifiables** (icône crayon), plus
  seulement supprimables.
- Nouvelles catégories de patrimoine financier : CEL, PEL, compte sur
  livret, PERCOL/PERCO.
- La synthèse patrimoniale (cartes en haut de la fiche client) se
  rafraîchit maintenant automatiquement après chaque ajout/modification/
  suppression, sans recharger la page.
- `vitest.config.mts` ajouté (résolution de l'alias `@/` pour les tests
  situés hors de `calculations/` et `modules/`).

## Prochaines étapes possibles

1. **Upload de fichiers** dans le module Documents (actuellement
   checklist seule) — nécessaire avant l'extraction automatique de
   données par Claude.
2. **Rapport PDF** — le livrable final à transmettre au client.
3. Reprendre le **mode client** une fois qu'il y aura une vraie valeur à
   y ajouter (questionnaire que le client peut remplir lui-même).
4. Enrichir le moteur de règles avec les 4 règles restantes une fois les
   modules retraite/succession construits, puis envisager un vrai
   versionnage des règles (actuellement figées dans le code, pas encore
   configurables sans redéploiement).

La base documentaire RAG et l'intégration Claude pour l'analyse restent
dans la vision long terme du projet mais n'ont pas encore été entamées.
