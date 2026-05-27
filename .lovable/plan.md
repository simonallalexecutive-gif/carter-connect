
# Plan — Passage en production avec audit stockage / affichage

## Diagnostic actuel

J'ai inspecté le code et la base. Voici les écarts critiques :

### Côté candidat
- `Step6Review` sauvegarde un blob `submission_data` (JSONB) dans `candidate_registrations` après `signUp`.
- **Champs manquants dans la sauvegarde** (présents dans le store mais non envoyés) : `bullets`, `notaBene` est OK, mais panneaux spécialisés (Concurrence, Fiscal, Droit Public, Arbitration, Projects/Energy, Real Estate complet, M&A détaillé, Social détaillé) sont **partiellement perdus** — seules quelques clés top-level sont incluses.
- **Fichiers non uploadés** : `photo` (File), `cvFile` → seules les URL preview blob sont stockées, elles disparaissent au refresh.
- `useLoadCandidateProfile` lit bien le blob mais ne sait pas reconstruire ce qui n'a pas été sauvegardé.

### Côté cabinet
- `CabinetStep6Confirm` fait `signUp` mais **n'enregistre AUCUNE donnée métier** (raison sociale, RIB, référents, critères de recherche, notification alerts).
- Le trigger `handle_new_user` crée une ligne vide dans `cabinet_accounts` (juste `cabinet_name`).
- Tout le contenu du `cabinetStore` (337 lignes de champs) est perdu au refresh.
- `CabinetAccount.tsx` affiche probablement du mock data.

### Côté admin
- `AdminRegistration` et `AdminProfiles` lisent `candidate_registrations` — OK pour candidats.
- Aucune table équivalente pour les cabinets côté admin.

### Déploiement
- Lovable Cloud actuel = un seul environnement (preview ≡ prod).
- Pour une **prod isolée**, il faut **remix le projet** (nouveau projet Lovable avec sa propre base Cloud), puis publier sur ton domaine.

---

## Ce que je vais faire

### Phase 1 — Compléter le stockage candidat
1. **Étendre `submission_data`** dans `Step6Review` pour inclure 100 % des champs du store (tous les panneaux spécialisés, bullets, notaBene, raisonsBaisseRetro, etc.).
2. **Créer un bucket Storage `candidate-files`** (privé, RLS par user_id) et uploader `photo` + `cvFile` lors de la soumission. Stocker les `path` dans `submission_data`.
3. **Étendre `useLoadCandidateProfile`** pour hydrater tous ces champs et générer des URL signées pour photo/CV.
4. **Vérifier `CandidateProfile.tsx`** pour qu'il affiche bien chaque section (déjà partiel).

### Phase 2 — Persister le cabinet
1. **Migration** : ajouter colonnes à `cabinet_accounts` (`siret`, `address`, `rib_iban`, `rib_bic`, `referents` jsonb, `subscription_plan`, `subscription_status`) + créer table `cabinet_searches` (critères de recherche du Step3) + table `cabinet_referents` si besoin séparé.
2. **Bucket Storage `cabinet-files`** pour RIB PDF + logo.
3. **Modifier `CabinetStep6Confirm`** : après `signUp`, insérer toutes les données du `cabinetStore` dans `cabinet_accounts` / `cabinet_searches`.
4. **Hook `useLoadCabinetProfile`** : équivalent du hook candidat pour hydrater le cabinetStore depuis la DB.
5. **Brancher `CabinetAccount.tsx` et `CabinetDashboard.tsx`** sur les vraies données.

### Phase 3 — Admin (lecture cabinets)
1. Étendre `admin_list_candidate_registrations` ou créer `admin_list_cabinet_accounts` (security definer + role admin).
2. Page admin cabinet : liste + détail.

### Phase 4 — Validation E2E
- Inscription candidat complète → vérif DB → vérif dashboard candidat → vérif admin.
- Inscription cabinet complète → idem.
- Reload navigateur : toutes les données restent affichées.

### Phase 5 — Mise en prod isolée
Lovable Cloud n'a pas de split dev/prod intégré. Deux options à choisir **par toi** après l'audit :

- **A. Remix** : je guide la duplication du projet (bouton "Remix" dans Lovable). Le nouveau projet aura sa propre base Cloud vierge. Tu publies ce nouveau projet sur `logan-law.com`. Le projet actuel reste ton bac à sable.
- **B. Reset + publish** : on vide la base actuelle, on publie ce projet sur `logan-law.com`. Pas de séparation dev/prod, plus risqué pour les itérations futures.

Je recommande **A**.

---

## Détails techniques

- Storage : buckets privés, policies `auth.uid()::text = (storage.foldername(name))[1]` pour candidats ; admins ont accès via `has_role`.
- Migrations dans l'ordre : tables → GRANTs → RLS → policies, en suivant la convention du projet.
- Aucun changement aux flux d'auth existants (signup email + password + confirmation).
- Le store Zustand reste la source de vérité pendant le funnel ; la DB devient la source de vérité après soumission.

---

## Périmètre exclu (à valider si tu veux les ajouter)

- Refonte du système de notifications / mises en relation (utilise déjà `cabinet_candidate_interests`).
- Paiement abonnement cabinet (Stripe) — Step4Subscription est cosmétique pour l'instant.
- Édition post-inscription des données (formulaire d'édition profil).

Veux-tu que je lance les phases 1 à 4 puis qu'on parle déploiement à la fin (avec option A), ou tu préfères qu'on commence par dupliquer le projet pour bosser directement dans la prod ?
