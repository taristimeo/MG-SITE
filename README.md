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

## Brouillon « Le banc de montage » (branche `claude/studio-audiovisuel-premium-7tx50p`)

Cette branche est une **proposition de refonte premium**, pas la version en
ligne. Elle garde la charte (crème chaud, terracotta, Gloock / JetBrains Mono /
Saira, le point du logotype) et la reprend dans un parti pris unique : *le site
est monté comme un film*.

**Le principe : deux tons.** Le crème de la charte pour tout ce qui se lit, le
noir chaud de la charte pour tout ce qui se regarde. N'importe quelle section
peut basculer en « salle de projection » avec `data-tone="dark"` : les
variables de couleur se rebasculent dans son sous-arbre, et les composants
n'ont rien à savoir du ton dans lequel on les pose. Le header suit
automatiquement (`ToneWatcher`), la barre d'état du navigateur aussi.

**Les six gestes signature** (dans `components/bench/`) :

| Composant | Ce que ça fait |
| --- | --- |
| `Moviola` | L'écran-titre est une table de montage : on promène le curseur sur la pellicule des six films et on scrubbe — la position choisit le film *et* l'instant dans ce film. Un seul extrait chargé à la fois. |
| `Hud` | Une réglette de visionneuse : le défilement devient un timecode, la progression un trait de montage, et le chapitre courant se nomme (lu sur les `data-chapter` de la page). |
| `FilmChapters` | La salle : les films phares projetés plein écran, épinglés, volets qui s'ouvrent à l'entrée du chapitre. |
| `GradeSplit` | Le rideau d'étalonnage : le même plan, rush à gauche, étalonné à droite. Suit le curseur, manœuvrable au doigt et au clavier. |
| `GrainLoupe` | La loupe à grain : au survol d'une image, un disque agrandit la matière — le nom du studio pris au mot. |
| `ContactSheet` | Les réalisations en planche-contact : vignettes perforées, numéros de tirage, et le crayon gras terracotta qui cercle la prise regardée. |

`ServiceIndex` complète l'ensemble : les métiers en index dépliant, avec la
planche du métier qui suit le curseur.

**Ce qui reste à trancher** : le rush du `GradeSplit` est une *simulation*
(contraste et saturation rabattus) — mention affichée sous le cadre. Pour la
mise en ligne, remplacer par un vrai export à plat du même plan.

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
