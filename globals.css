# Mauvais Grain

Site vitrine du studio de production vidéo **Mauvais Grain** (Timéo Taris, Bordeaux).
Next.js 15 (App Router) + Tailwind CSS v4. Design cinématique sombre, grain argentique,
typographie poster.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

## Travailler à deux (Timéo + Arthur, sur deux ordis)

Le code vit sur GitHub. Chacun travaille sur sa machine et synchronise via GitHub :
pas besoin de tout réinstaller à chaque fois (seul `package-lock.json` est versionné,
`npm install` reconstruit le reste).

**La première fois sur un nouvel ordi** (Mac de Timéo, ordi d'Arthur…) :

```bash
git clone https://github.com/arthurbazin33/mauvais-grain-site.git
cd mauvais-grain-site
./start.sh
```

**Ensuite, à chaque session de travail :**

```bash
./start.sh                 # récupère le travail de l'autre + lance le site
# … tu modifies le site …
./save.sh "ce que j'ai fait"   # envoie ton travail sur GitHub
```

- `./start.sh` — récupère les dernières modifs depuis GitHub, installe ce qu'il
  faut, et lance le site sur http://localhost:3000.
- `./save.sh "message"` — sauvegarde tes changements sur GitHub pour que l'autre
  les récupère. Le message est optionnel.

> Réflexe pour éviter les conflits : lance `./start.sh` **avant** de commencer, et
> `./save.sh` **dès que** tu as fini un bout de travail. Les deux scripts récupèrent
> automatiquement les modifs distantes avant d'agir.

## Build de production

```bash
npm run build
npm run start
```

## Modifier le contenu

Tout le contenu éditorial est centralisé dans [`lib/site.ts`](lib/site.ts) :

- **Coordonnées** (`site`) : email, téléphone, adresse, réseaux sociaux.
- **Réseaux sociaux** : remplacer les `href: "#"` par les vraies URL.
- **Services** (`services`) et **valeurs** (`values`).
- **Réalisations** (`projects`) : titre, client, catégorie, année, résumé.

### Ajouter la vidéo d'une réalisation

Chaque projet a un champ `video?` (à remplir avec un lien YouTube/Vimeo).
Le composant [`ProjectFrame`](components/ProjectFrame.tsx) affiche aujourd'hui un
cadre placeholder ; il suffira d'y brancher un `<iframe>` quand les liens seront
fournis.

## Structure

```
app/
  layout.tsx              en-tête, pied de page, polices, grain
  page.tsx                accueil (hero, réalisations, services, studio)
  realisations/[slug]/    page détail d'une réalisation
components/                Header, Footer, Grain, Reveal, Marquee, ProjectFrame
lib/site.ts                contenu éditorial
```

## Déploiement

Compatible Vercel (`vercel`) sans configuration supplémentaire.
