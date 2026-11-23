# Mon Pokédex — TP Développement frontend avancé

Application React qui affiche les pokémons de [PokéAPI](https://pokeapi.co) avec pagination, fiche détail, recherche, favoris et un formulaire pour créer ses propres pokémons.

- **Site en ligne :** https://mon-pokedex-beige.vercel.app/
- **Dépôt GitHub :** https://github.com/lynabrahimi15-bit/mon-pokedex

## Stack

| Besoin | Outil |
|---|---|
| Interface | React 19 + Vite |
| Routage | React Router (`BrowserRouter`, `Routes`, `Link`, `NavLink`, `useParams`, `useSearchParams`) |
| Appels HTTP | Axios (GET vers PokéAPI, POST vers `/api/pokemons`) |
| État global | Zustand (+ middleware `persist`) |
| Tests | Vitest + React Testing Library |
| CI/CD | GitHub Actions → Vercel |

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # tests unitaires + fonctionnels
npm run lint     # ESLint
npm run build    # build de production dans dist/
```

En local, `npm run dev` sert aussi l'API `/api/pokemons` (petit plugin dans `vite.config.js` qui réutilise le fichier `api/pokemons.js`). Aucun serveur à lancer à côté.

## Fonctionnalités (grille « Projet initial »)

| Critère | Où le trouver |
|---|---|
| Liste de pokémons | `pages/Home.jsx` + `organisms/PokemonGrid.jsx` + `molecules/PokeCard.jsx` |
| Navigation liste → fiche détail | Lien « Voir détails » → route `/poke/:id` (`pages/PokeDetails.jsx`) |
| Formulaire d'ajout | `pages/AddPokemon.jsx` + `organisms/PokemonForm.jsx` (route `/ajouter`) |
| Menu de navigation global | `organisms/Navbar.jsx` (Pokédex, Ajouter, Mes Pokémon) |
| React Router | `main.jsx` (`BrowserRouter`) et `App.jsx` (`Routes` / `Route`) |
| API REST consommée | PokéAPI (`/pokemon`, `/pokemon/:id`, `/pokemon-species/:id`) |
| Axios GET et POST | `services/api.js` (instances) + `services/pokemonService.js` |
| Pagination précédent / suivant | `molecules/Pagination.jsx` ; boutons désactivés sur la 1re et la dernière page |
| Hooks `useState` / `useEffect` | `hooks/usePokemonPage.js`, `hooks/usePokemonDetails.js`, formulaire |
| Composants séparés | Dossier `components/` organisé en Atomic Design (voir plus bas) |

Également : états de chargement, d'erreur et « Aucun pokemon disponible. », recherche par nom ou numéro, favoris, page 404.

### L'API du projet : `POST /api/pokemons`

PokéAPI est en lecture seule. Pour le POST, le projet a sa propre route serverless : `api/pokemons.js`, déployée automatiquement par Vercel.

- Elle valide les données avec **la même fonction que le formulaire** (`utils/validation.js`).
- Elle renvoie `201` avec le pokémon créé, `422` avec le détail des erreurs, ou `405` pour une autre méthode.
- Le pokémon renvoyé est ajouté au store Zustand, qui est persisté dans le `localStorage`. Il reste donc visible après un rechargement de la page. C'est un choix volontaire pour ne pas gérer de base de données dans ce TP.

Pour utiliser une autre API (une API Symfony par exemple), il suffit de changer `VITE_APP_API_URL` (voir `.env.example`).

---

## Partie 4 — Extended

### 1. Mise en ligne et pipeline CI/CD

Le site est hébergé sur **Vercel**, relié au dépôt GitHub.

- **CI (intégration continue)** : le fichier `.github/workflows/ci-cd.yml` lance GitHub Actions à chaque push et à chaque Pull Request. Il fait `npm ci`, puis `lint`, `test` et `build`. Si une étape échoue, le commit ou la Pull Request est marqué en rouge.
- **CD (déploiement continu)** : Vercel déploie automatiquement chaque push sur `main` en production. Chaque Pull Request obtient aussi sa propre URL de prévisualisation pour tester avant de fusionner.
- Avec une règle de protection de la branche `main` (« Require status checks to pass »), on peut obliger la CI à être verte avant toute fusion : rien n'arrive en production sans que les tests passent.
- `vercel.json` contient une règle de réécriture vers `index.html`, pour que les URL comme `/poke/25` fonctionnent quand on recharge la page. La fonction `api/pokemons.js` est déployée automatiquement par Vercel comme fonction serverless.

### 2. Tests (unitaires et fonctionnels)

`npm test` lance **16 tests**.

**Tests unitaires** (une fonction ou un module isolé) :
- `src/utils/pokemon.test.js` : extraction de l'id depuis une URL, calcul du nombre de pages, traduction des éléments, formatage d'une réponse PokéAPI.
- `src/utils/validation.test.js` : règles de validation du formulaire.
- `src/store/usePokedexStore.test.js` : actions du store (favoris, suppression).
- `api/pokemons.test.js` : codes de réponse de l'API (201, 422, 405).

**Tests fonctionnels** (parcours utilisateur sur l'application complète, avec le routeur et le store ; seule la couche réseau est simulée) :
- `src/__tests__/functional/navigation.test.jsx` :
  - afficher la liste, puis passer à la page suivante, avec les boutons désactivés aux extrémités ;
  - cliquer sur « Voir détails » et arriver sur la fiche ;
  - voir les messages « liste vide » et « erreur ».
- `src/__tests__/functional/addPokemon.test.jsx` :
  - un formulaire invalide est bloqué ;
  - un formulaire valide déclenche le POST, redirige vers la fiche, puis le pokémon apparaît dans « Mes Pokémon ».

### 3. Optimisation des performances

**Notion principale : le code splitting par route** avec `React.lazy` et `Suspense` (`App.jsx`). Chaque page est un fichier JavaScript séparé (`Home-xxx.js`, `PokeDetails-xxx.js`…) qui n'est téléchargé qu'à la première visite de la page. Le chargement initial est donc plus léger.

Compléments :
- **Cache des requêtes** (`pokemonService.js`) : chaque GET est mis en cache en mémoire. Revenir sur une page ou une fiche déjà vue ne relance aucun appel réseau, et deux appels identiques simultanés n'en font qu'un.
- **Requêtes en parallèle** : les détails des 12 pokémons d'une page sont chargés en même temps avec `Promise.all`, et non l'un après l'autre.
- **`React.memo` sur `PokeCard`** : une carte ne se re-rend pas si ses props n'ont pas changé, par exemple quand on ajoute un autre pokémon en favori.
- **Images optimisées** : `loading="lazy"`, `decoding="async"`, `width` et `height` fixés pour éviter les décalages de mise en page (CLS), `preconnect` vers les domaines de l'API et des images.

### 4. Stratégie KISS et qualité du code

**Notion principale : une responsabilité par fichier, et une seule source de vérité.**
- Les composants **affichent**, les hooks **chargent les données**, les services **parlent à l'API**, les utils **transforment les données**. Par exemple, `Home.jsx` ne sait pas qu'Axios existe.
- La **validation est écrite une seule fois** (`utils/validation.js`) et utilisée à la fois par le formulaire et par l'API. On ne risque pas d'avoir deux règles différentes.
- Les **fonctions pures** (`utils/`) sont simples à lire et à tester.
- **Pas de dépendance inutile** : pas de bibliothèque de formulaires ni d'UI. Des solutions simples suffisent pour ce besoin.
- **Outils qualité** : ESLint (règles React Hooks comprises) et les tests sont exécutés automatiquement dans la CI. Un code qui ne passe pas le lint ou les tests n'est pas déployé.

### 5. Gestion d'état moderne

**Notion principale : un store global avec Zustand** (`store/usePokedexStore.js`).
- Il contient les favoris et les pokémons créés, et les actions `toggleFavorite`, `addCreated` et `removeCreated`.
- Pas de *Provider* ni de *prop drilling* : la Navbar (compteur), les cartes (étoile), la fiche et la page « Mes Pokémon » lisent le même state directement.
- Les **sélecteurs** (`usePokedexStore(state => state.favorites)`) font qu'un composant ne se re-rend que si la partie du state qu'il utilise change.
- Le **middleware `persist`** sauvegarde le store dans le `localStorage`.

Complément : **l'URL comme état**. La page courante est stockée dans l'URL (`?page=3`, via `useSearchParams`) plutôt que dans un `useState`. On peut ainsi partager le lien, recharger la page, et le bouton « Retour » du navigateur fonctionne.

Les états propres à un seul composant (champs du formulaire, chargement, erreurs) restent dans des `useState` locaux. Chaque état est rangé au niveau où il sert.

### 6. Stratégie de rendu

L'application utilise le **CSR (Client-Side Rendering)** sous forme de **SPA** (Single Page Application), avec **code splitting**.

- Le serveur (le CDN de Vercel) envoie un `index.html` presque vide et les fichiers JavaScript. React construit ensuite la page dans le navigateur.
- React Router change de page **sans recharger** (API History du navigateur). Seul le JavaScript de la page demandée est téléchargé, grâce à `React.lazy`.
- Les données sont récupérées côté client (Axios dans `useEffect`), avec un état de chargement affiché pendant ce temps.

**Pourquoi ce choix ?** Un Pokédex est une application très interactive (pagination, favoris, formulaire) qui n'a pas besoin de référencement page par page. Le CSR est le plus simple à héberger : des fichiers statiques sur un CDN, plus une fonction serverless.

**Les autres stratégies modernes, et quand elles seraient utiles :**
- **SSR** (Server-Side Rendering, par exemple avec Next.js) : le HTML est généré à chaque requête. C'est utile pour le SEO et l'affichage du premier écran.
- **SSG** (Static Site Generation) : les pages sont générées au build. Ce serait idéal pour des fiches qui changent rarement, comme les fiches pokémon.
- **ISR** (Incremental Static Regeneration) : du SSG régénéré périodiquement.
- **React Server Components** : des composants exécutés côté serveur, sans JavaScript envoyé au client.

### 7. Organisation : Atomic Design (+ découpage en couches)

```
api/
└── pokemons.js              → fonction serverless POST /api/pokemons
src/
├── main.jsx                 → point d'entrée, <BrowserRouter>
├── App.jsx                  → layout + routes (pages chargées en lazy)
├── components/
│   ├── atoms/               → plus petits éléments, sans logique métier
│   │   ├── Button.jsx
│   │   ├── TypeBadge.jsx
│   │   ├── Loader.jsx
│   │   ├── Message.jsx
│   │   └── PokemonImage.jsx
│   ├── molecules/           → assemblage de quelques atomes, une fonction précise
│   │   ├── PokeCard.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FavoriteButton.jsx
│   │   └── FormField.jsx
│   ├── organisms/           → sections complètes de l'interface
│   │   ├── Navbar.jsx
│   │   ├── PokemonGrid.jsx
│   │   └── PokemonForm.jsx
│   └── templates/           → mise en page commune, sans données
│       └── PageLayout.jsx   → bandeau bleu (hero) + contenu posé dessus
├── pages/                   → une page par route (niveau "pages" de l'Atomic Design)
│   ├── Home.jsx             → /
│   ├── PokeDetails.jsx      → /poke/:id
│   ├── AddPokemon.jsx       → /ajouter
│   ├── MyPokemons.jsx       → /mes-pokemons
│   └── NotFound.jsx         → *
├── hooks/                   → logique de chargement réutilisable
├── services/                → accès à l'API (Axios)
├── store/                   → état global (Zustand)
└── utils/                   → fonctions pures (formatage, validation)
```

- **Atomes → molécules → organismes → pages** : chaque niveau n'utilise que les niveaux inférieurs. Par exemple, `PokeCard` (molécule) assemble `TypeBadge`, `PokemonImage` (atomes) et `FavoriteButton` ; `PokemonGrid` (organisme) répète des `PokeCard` ; `Home` (page) assemble `SearchBar`, `PokemonGrid` et `Pagination`.
- Le niveau *templates* est `templates/PageLayout.jsx` : toutes les pages l'utilisent pour avoir le même bandeau et la même mise en page, chacune y passe seulement son contenu.
- La logique est rangée **en couches**, comme les couches du Feature-Sliced Design : `pages` → `components` → `hooks` / `store` → `services` → `utils`. Une couche n'importe que les couches en dessous d'elle. Par exemple, un atome n'importe jamais une page, et les utils n'importent rien de React.