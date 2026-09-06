# Synthèse veille — sites de boîtes de production internationales

Source : `raw-prod-inter.md` (fetchs texte + extractions HTML d'un agent précédent) complété par 8 fetchs ciblés (Division /explore, Iconoclast /directors, lovesong.tv, landia.com, Knucklehead fiche Maceo Frost, Stink UK accueil, thedirectorsbureau.com, bullionproductions.com).

Limite méthodologique importante : presque tout vient de HTML converti en texte, pas de rendu. Les hover, autoplays, curseurs sont déduits des classes CSS et des compteurs (`autoplay`, `muted`, `playsinline`, `cursor`, `hover`) relevés dans le brut, pas observés à l'écran. Quand le brut ne dit rien, c'est écrit.

Sites en échec, non documentés : Rogue Films (503), Familia (503), BWGTBLD (503), Canada (canadalondon.com = domaine expiré, redirige vers dropcatch), Independ (403), Rebolucion (page quasi vide, 3 ko, seul le titre "Latest Work"), divisionfilms.com (503 — et c'est de toute façon une boîte de financement de longs-métrages à LA, pas Division Paris), Riff Raff via WebFetch (403, mais le curl a marché, voir fiche), Somesuch accueil (curl à 000, seule la nav a été lue).

---

## Sites

### Iconoclast — https://iconoclast.tv/us
**Type** : prod pub / clips / film+TV, réseau international (FR, US, UK, DE, BR, MX, ES), roster ~45 réalisateurs + section "NEW TALENTS".
**Accueil** : un seul film en plein écran à la fois ("Nike" / "Arnaud Bresson"), avec un index numérique "1 2 3 4 5 6 7 8 9 10" en bas. Les classes CSS confirment un carrousel vidéo Vimeo HLS (`VideoCarousel_timeline`, `_progress`, `_indexes`, `_active`, `_talent`, `_infosMask`) : timeline de progression par film, 10 films en boucle, autoplay muted. Nav en lettres espacées ("D i r e c t o r s", "f i l m + t v").
**Navigation** : nav horizontale Directors / film + tv / Management / Photographers / Music, sélecteur de pays "Our network". Page réalisateurs = liste texte alphabétique de noms, aucun visuel, deux groupes "ICONOCLAST" et "NEW TALENTS". Pas de filtre. Chaque nom mène à `/us/directors/slug`, et les films sont à `/us/directors/slug/film` (ex. `/directors/youth/dinamica`) : le film est toujours un enfant du réalisateur dans l'URL.
**Rare** : l'accueil réduit à un carrousel de 10 films numérotés avec timeline, sans grille, sans texte de présentation. Le sélecteur de marché (`MarketSelector`) qui change tout le roster.
**Faible** : la page réalisateurs est une liste de noms nue ; rien ne montre le travail avant le clic.

### Division — https://us.division.global
**Type** : prod pub / clips / branded, Paris + LA + Sydney, sous-domaines par région (FR, UK, NL, APAC, US).
**Accueil** : liste ou grille de blocs projets (`HomeProjectBlock_group / _items / _media`) nommés "Réalisateur – Projet" ("Marius Gonzalez – Nike x Rassvet", "Torso – Madonna", "François Rousselet – MacBook Pro"…), 14 vidéos muted/playsinline sur la page (les vignettes sont des vidéos, pas des stills). Next.js.
**Navigation** : 4 entrées seulement : Talent / Contact / Awards / Explore. Classes `isVideoPage` et `isVideoPageOutsideTalent` : la page film existe dans deux contextes (depuis un réalisateur, ou hors roster). La page "Explore" n'a pas pu être lue (contenu vide côté texte), on ne sait pas ce qu'elle liste.
**Rare** : curseur custom avec anneau de progression (`Cursor_progressRing`, `Cursor_ringSvg`, `Cursor_cursorPicto`) — le curseur sert probablement de barre de lecture / d'indicateur de chargement ; une entrée de nav "Awards" en première ligne ; une entrée "Explore" distincte du roster.
**Faible** : le brut ne donne aucune police ni couleur (tout en CSS modules), et "Explore" est illisible sans JS.

### Caviar — https://caviar.tv/london
**Type** : prod pub / clips / films & séries, 5 bureaux (London, LA, Paris, Brussels, Amsterdam), chaque ville a son site et ses menus.
**Accueil** : page vide en WebFetch (100 % JS Nuxt sur WordPress), mais le HTML récupéré liste ~18 entrées "featured" au format "Marque – Titre By – Réalisateur" ("Thumbs – Captain Morgan By – Keith Schofield", "Louis Vuitton – Men's Fall Winter 2025 By – Taichi Kimura"), 23 lecteurs Vimeo autoplay/muted/playsinline sur la page : grille de vignettes vidéo (`grid-work`), plus une grille news (`grid-news`).
**Navigation** : menu par ville (Directors / Films & TV Series / About / News / Contact), sous-menu "director-categories", fil d'Ariane (`breadcrumb__menu`, `breadcrumb__menu-sub`), mailing-list en footer. Une entrée "featured" peut pointer vers un réalisateur au lieu d'un film ("Yuki Chiba VN By – D + Y" → `/directors/dy/`).
**Rare** : typographie identifiée : GT Super Display (serif d'affichage, avec italique) + Moderat (grotesque) ; palette non noir/blanc : taupe/brun/olive (#392f2b, #a17365, #8e9077, #2c211a, #bab7bb). Le case study Funkhaus dit explicitement que l'ancien site "trop vibrant" concurrençait le portfolio et qu'ils sont passés à un design minimal.
**Faible** : illisible sans JS ; format "By –" un peu lourd ; 5 sites parallèles.

### Partizan — https://www.partizan.com
**Type** : prod pub / clips / animation (Partizan Studio), US / UK / France / World.
**Accueil** : grille de ~7 projets récents (vignette 480×270, réalisateur, titre), puis une section "Partizan Classics" : carrousel Prev/Next d'archives (surtout Gondry) avec tags de catégorie ("Music content", "Branded content", "Animation | Partizan Studio") et contrôles vidéo intégrés (Play/Pause/Fullscreen/Sound).
**Navigation** : Work / Directors / About / Contact + sélecteur de région + Instagram/LinkedIn.
**Rare** : une section "Classics" séparée du flux récent — l'archive assumée comme argument, avec ses propres tags.
**Faible** : mécanique convenue (grille + carrousel), typo "minimale et moderne" sans plus.

### Anonymous Content — https://www.anonymouscontent.com
**Type** : prod pub + film/TV + management de talents (US).
**Accueil** : carrousel showreel horizontal, cartes projet (titre, client/plateforme, "Directed By: …", icône play), flèches gauche/droite.
**Navigation** : Directors / Film + TV / AC Independent / Management / About / Careers / Contact / News. La page réalisateurs vit sous `/work/us/directors/anonymous-content/`.
**Rare** : rien de notable (monochrome, icônes SVG).
**Faible** : la home est un carrousel générique ; aucune fiche réalisateur lisible dans le brut.

### Great Guns — https://www.greatguns.com
**Type** : prod pub, USA / UK / EMEA / ASIA, filiale Ballistic.
**Accueil** : slider showreel d'environ 10 vidéos Vimeo autoplay avec titre + réalisateur, puis en dessous : "About Us" dépliable, grille de logos de prix (Cannes Lions, D&AD…), bloc Ballistic, section "Culture" (4 initiatives à icônes), et "GG Social" — leur gastro-pub avec horaires et plan.
**Navigation** : Directors / News (qui pointe vers /work) / Contact, sélecteur de région.
**Rare** : le pub de la boîte sur la home, avec horaires et carte — le lieu physique comme élément de marque.
**Faible** : pas de fiche réalisateur visible depuis la home, "News" et "Work" confondus.

### Park Pictures — https://www.parkpictures.com
**Type** : prod pub / clips / film & TV, 3 bureaux.
**Accueil** : liste verticale linéaire de projets (vignette, titre lié à la page vidéo, nom(s) de réalisateur liés à leur fiche), puis une section "LATEST PRESS" (vignette, titre, publication, date).
**Navigation** : Directors / Work / Film & Television / About / News / Contact. Plusieurs réalisateurs possibles par projet.
**Rare** : rien ; la simplicité de la liste verticale est sa seule signature.
**Faible** : aucune mécanique d'interaction décrite.

### Academy Films — https://www.academyfilms.com
**Type** : prod pub / clips, UK + US (site séparé usa.academyfilms.com), roster prestige (Glazer, Aster, Abbasi).
**Accueil** : grille de vignettes (titre + réalisateur), liens vers `/portfolio/slug`.
**Navigation** : Directors / Photographers en principal ; Work / Socials / About / Contact en secondaire ; page réalisateurs = liste de noms sous un titre "Academy".
**Rare** : rien.
**Faible** : liste de noms sans visuel ; Shopify-like (`/pages/`, `/portfolio/`).

### Stink Films — https://www.stinkfilms.com
**Type** : prod pub / clips, réseau (UK, autres pays).
**Accueil** ("Latest") : grille multi-colonnes de vignettes avec titre + réalisateur en surimpression ("Liberty" / Eoin Glaister, "Stella x The Gentlemen" / Fredrik Bond, "Playstation — It Happens on Playstation" / Felix Brady), hover qui révèle les infos, scroll infini, nav Latest / Directors / About répétée en bas de page.
**Navigation** : 3 entrées seulement. Page réalisateurs = liste texte alphabétique en trois groupes : roster principal, "Music Videos", "Special Projects".
**Rare** : le roster scindé par usage (pub / clips / projets spéciaux) plutôt que par région.
**Faible** : la page réalisateurs n'a aucune image dans le HTML (tout est chargé après), et le brut ne sait rien de la fiche réalisateur ni de la page film.

### Somesuch — https://somesuch.co
**Type** : prod pub / clips / film, London + LA, avec maison d'édition et boutique.
**Accueil** : non lue (curl 000). Nav : Latest / Directors / Archive / Editions / Film + About / Contact / Shop, panier "£0.00" dans le header, sélecteur UK/US.
**Navigation** : "Archive" séparée de "Latest" ; "Editions" = publications ; la page /directors/ pèse 332 ko mais seul le header a été extrait.
**Rare** : un panier e-commerce dans le header d'une boîte de prod ; une section "Editions" (objets imprimés) au même niveau que les films.
**Faible** : tout le reste est inconnu dans le brut.

### Prettybird — https://prettybird.co
**Type** : "creative think tank", prod pub / clips, Americas / Europe (troisième site Funkhaus pour eux, plus un site pour la filiale Ventureland).
**Accueil** : page-portail qui ne montre que le nom, une phrase de positionnement et deux liens "Americas Region" / "Europe Region", puis un bouton "Menu". Classes `scroll-is-locked` (scroll verrouillé sur le portail), 194 occurrences de `hover` et 4 de `cursor` dans le HTML.
**Navigation** : inconnue au-delà du portail ; la page /us/ fait 150 ko mais n'a pas été décrite.
**Rare** : polices nommées Halbfett / Kraftig / Buch (noms de graisses allemandes utilisés comme familles — probablement une fonte custom), palette strictement #000/#fff.
**Faible** : un écran de choix de région avant tout contenu.

### Smuggler — https://www.smugglersite.com
**Type** : prod pub / clips / théâtre & live / film & TV, LA-NY-London, deux nav (Global / Europe).
**Accueil** : image hero puis flux d'actualités en grille (vignette, titre, publication/date, chapeau) avec bouton "See More" paginé (URL encodée base64 d'un curseur GraphQL).
**Navigation** : Commercial / Music Video / Theatre&Live / Film&TV / Work / About / Culture ; réalisateurs classés par discipline (`/global/commercial/directors/`, `/global/music-video/directors/`).
**Rare** : la home est un fil de presse, pas un portfolio ; une section "Theatre & Immersive".
**Faible** : les films n'apparaissent qu'à travers des articles.

### Object & Animal — https://objectanimal.com
**Type** : collectif de réalisateurs, photographes et artistes (NY + London), pub / clips / film & TV.
**Accueil** : grille de cartes projet (vignette, nom de l'auteur lié, titre lié — les deux liens vont vers la même page projet). "Aidan Zamiri" → "Calvin Klein, 'Feel the Fit'".
**Navigation** : home / talent / photography / moving image / film & tv / contact, plus "search" et "archive" en secondaire.
**Rare** : une vraie fonction de recherche et une archive explicite ; le mot "talent" plutôt que "directors" (roster multi-métiers).
**Faible** : vignettes en GIF placeholder dans le HTML, pas de fiche talent visible dans le brut.

### Reset — https://www.resetcontent.com
**Type** : prod pub haut de gamme (fondée par David Fincher et David Morrison), US | UK.
**Accueil** : quasi vide : "RESET", toggle US|UK, un bouton "MENU" qui déploie directement la liste alphabétique des réalisateurs (~28 US, ~20 UK) et "CONTACT".
**Navigation** : le menu EST le roster ; page contact = organigramme (Managing Director, EPs, coordinatrice) avec emails par région (West Coast, Midwest, East Coast, UK).
**Rare** : pas de page "Work" du tout — on entre par le réalisateur ou pas du tout ; l'équipe de production nommée avec ses emails directs.
**Faible** : aucune image, aucun film sur la home ; "annuaire" plutôt que vitrine.

### Rattling Stick — https://www.rattlingstick.com
**Type** : prod pub, UK/US, sous-marque "Rattling Studio". Webflow.
**Accueil** : grille de projets récents (titre "AA - Spider-Man: Brand New Day", réalisateur lié `/directors/slug`, vignette), GIF animés comme éléments visuels, noir et blanc.
**Navigation** : DIRECTORS | WORK | Contact — trois entrées.
**Rare** : rien.
**Faible** : convenu, "portfolio-first typique" selon le fetch lui-même.

### Hungryman — https://www.hungryman.com
**Type** : prod pub, LA / NY / London / São Paulo.
**Accueil** : grille de travaux récents (vignette, titre, marque, réalisateur lié), CTA "See All Directors", newsletter.
**Navigation** : Directors / About / Contact / News & Awards. URL film = `/directors/[nom]/[projet]` : le film n'existe que sous son réalisateur. La page /directors fait 2,5 Mo (vidéos ou images inline).
**Rare** : liens footer "Accessibility" et "Complaints".
**Faible** : mécanique standard.

### MJZ — https://www.mjz.com
**Type** : prod pub historique (US/UK).
**Accueil** : le nom "MJZ", une ligne "Commercial Production Company", les trois dirigeants nommés, et trois liens : Directors / Contact / Sales. C'est tout.
**Navigation** : `/directors/uk/` — roster par pays ; page de 21 ko, pas décrite.
**Rare** : l'entrée "Sales" (reps commerciaux) au même niveau que Directors ; une home de 15 ko sans aucun film.
**Faible** : rien à voir sans cliquer.

### Friend London — https://www.friendlondon.tv
**Type** : prod pub / clips, London + US + France.
**Accueil** : page-index dense : listes de noms de réalisateurs par discipline ("Commercials / Music Video"), puis travaux mis en avant ("Gregory Ohrel - Superbowl - Bad Bunny"), puis cartes news ("WELCOMING NICOLEE TSIN", "NOEL PAUL WINS BEST DIRECTOR") et embeds Instagram (reels, posts). Vignettes 768×432.
**Navigation** : DIRECTORS / CONTACT / NEWS (lien Instagram direct). Footer = annuaire du staff avec rôles.
**Rare** : "News" qui envoie vers Instagram plutôt qu'une page interne ; embeds Instagram natifs sur la home.
**Faible** : home fourre-tout.

### Knucklehead — https://www.knucklehead.tv/us
**Type** : prod pub, UK / US, sous-marque "AIRHEAD".
**Accueil** : liste de films "Marque, Titre by Réalisateur" ("Hennessy x NBA, Game Never Stops by Maceo Frost", "Mercedes, The Roar by Chris Hewitt"), chaque bloc précédé d'un "Loading..." (vidéos Vimeo chargées en JS ; 7 muted, 6 playsinline → vignettes vidéo). Next.js.
**Navigation** : Directors / AIRHEAD / About / Contact + UK/US. URL film = `/us/directors/maceo-frost/commercials/maceo-frost-game-never-stops` (réalisateur > discipline > film). Fiche réalisateur (Maceo Frost) : 4 onglets "Showreel / Music Videos / Film & TV / BIO", grille de cartes titre seul, bio longue en minuscules ("maceo grew up in stockholm wanting to be a pilot…"), lien Instagram. Pas de suivant/précédent réalisateur.
**Rare** : la bio écrite en bas-de-casse intégral, ton personnel ; onglets par discipline dans la fiche.
**Faible** : les cartes film n'affichent ni année ni marque dans la fiche ; états "Loading..." visibles sans JS.

### Riff Raff Films — https://www.riffrafffilms.tv/uk
**Type** : prod pub / clips / animation, UK / US. Page de 9,3 Mo, 599 balises vidéo, 15 916 occurrences de "vimeo" : tout le catalogue est inline.
**Accueil** : liste des réalisateurs en tête (Ed Morris, Megaforce, François Rousselet, Tanu Muiño…), puis section animation avec des catégories de savoir-faire ("Our Animated Cousin", "2D Craft", "Character Design", "Stop Frame & Puppetry", "CG / VFX", "Anthropomorphism"), Awards, News, Photography, "Behind The Scenes", puis un long mur de films "Marque 'Titre'" (Nike "Londoner", Burberry "Open Spaces", Depeche Mode "People are Good") entrecoupé de "Riff Raff Modern Classics" numérotés ("3", "6", "7", "11", "14"). Tailwind : `group-hover/thumbnail:opacity-100` → vignette vidéo qui apparaît au survol.
**Navigation** : Directors / Contact, UK | US ; la liste des réalisateurs est répétée en pied de page.
**Rare** : le roster animation classé par technique (stop-motion, 2D, CG, anthropomorphisme) et non par personne ; les "Modern Classics" numérotés glissés dans le flux ; un "Animatic Comparison" (Declan McKenna) comme pièce de portfolio — montrer l'animatique à côté du résultat.
**Faible** : page monstrueuse (9 Mo, tout inline), impossible à lire sans rendu.

### Bullion Productions — https://www.bullionproductions.com
**Type** : studio prod pub / branded entertainment / social, London, B-Corp. Site Limesharp, Awwwards SOTD (2021 selon la page Awwwards, "19 juin 2025" selon la recherche — incohérence dans le brut).
**Accueil** : grille de vignettes ("The Rest is Football", "Nike Football", "Comic Relief 40"), phrase "Bullion is a B-Corp certified production studio, blurring the lines between advertising and entertainment", logo B Corp en header et footer, "Browse All Directors".
**Navigation** : Commercial / Branded Entertainment & TV / Social / Directors + About / Contact. Awwwards liste : intro animation, custom cursor, menu avec vidéo ("video-enhanced menu"), animation au scroll, GSAP, palette #000/#fff.
**Rare** : le menu qui joue de la vidéo ; la certification B-Corp comme élément de nav.
**Faible** : SEO/sémantique notée 6,67/10 par le jury ; le fetch texte ne voit aucune de ces mécaniques.

### The Directors Bureau — https://www.thedirectorsbureau.com
**Type** : prod pub / clips / creative studio (Roman Coppola), LA / London / NY. Site Funkhaus 2014 (HM Awwwards, tag "Unusual Navigation") ; nouvelle version par Dous Studio + Feijoo-Montenegro (HM Awwwards 2024).
**Accueil** : une page-porte : deux listes de noms, "Directors" (12 : Sofia Coppola, Wes Anderson, Roman Coppola… + "Creative Studio") et "Collaborators" (6 : Natasha Lyonne, Geoff McFetridge…), et un lien "ENTER" placé en bas de page vers `/tdb`. Page de 12 ko.
**Navigation** : DIRECTORS (= /tdb) / CONTACT / LEGAL / COOKIES, Instagram, LinkedIn.
**Rare** : un bouton "ENTER" en bas, après la liste des noms — l'inverse du splash classique ; une catégorie "Collaborators" distincte des réalisateurs.
**Faible** : on ne sait rien de ce qu'il y a derrière "ENTER".

### Landia — https://www.landia.com/us
**Type** : prod pub, réseau latino (Buenos Aires, Mexico, São Paulo, Madrid/Barcelona, US, Lisbon, Santiago, Bogotá).
**Accueil** : bandeau horizontal défilant de 19 noms de réalisateurs (+ 2 photographes à part), puis grille de cartes "'Titre'" / Marque / Réalisateur ("'Oreo Cows'" Oreo, "'Welcome Back Paisano'" Tecate), puis bloc réseau avec contacts par ville.
**Navigation** : Directors / Content + Projects / The Movement / About / Contact. Fiche réalisateur à `/us/director/slug/`.
**Rare** : la liste de réalisateurs comme bandeau horizontal scrollable au-dessus des films ; une section "The Movement".
**Faible** : rien d'autre dans le brut.

### Love Song — https://lovesong.tv
**Type** : prod pub / clips (Kelly Bayett + Daniel Wolfe), roster de 9.
**Accueil** : nom "Love Song" + 4 liens en minuscules : "directors" / "index" (→ `/video-index`) / "info" / "contact". Le contenu sous la nav n'a pas été lu (page de 208 ko).
**Navigation** : un "index" vidéo global à côté du roster.
**Rare** : le mot "index" pour la liste de tous les films — vocabulaire d'archive, pas de vitrine.
**Faible** : lovesong.co (l'URL initiale) est mort, c'est lovesong.tv.

### Pulse Films — https://www.pulsefilms.com
**Type** : prod pub / clips / doc / long-métrage, London.
**Accueil** : titre "Pulse Films — London-Based Production Company" + paragraphes explicatifs + un tableau de 4 services (Commercial, Music Video, Documentary, Feature Film) avec livrables. Pas de showreel ni grille décrits.
**Navigation** : Directors / Work / About / Contact ; page /directors de 13 ko seulement.
**Rare** : rien.
**Faible** : home rédactionnelle, type page SEO.

### Biscuit Filmworks — https://www.biscuitfilmworks.com
**Type** : prod pub, LA + London (25 ans).
**Accueil** : phrase de positionnement ("full-service production company… Creating culture over 25 years"), rien d'autre décrit.
**Navigation** : Directors / Music Videos & Longform / Experiential / News / Contact, US/UK. `/directors` renvoie un 404.
**Rare** : rien. **Faible** : rien de visible dans le brut.

### Blinkink — https://www.blinkink.co.uk
**Type** : prod animation / pub / clips / entertainment, London, filiale "Blink Industries".
**Accueil** : non décrite (nav + footer seulement). **Navigation** : Showcase / Directors / Our Work / Blink Industries / About, sous-menu Advertising / Music Videos / Entertainment, menu hamburger. Page /directors de 186 ko.
**Rare** : rien. **Faible** : rien de visible dans le brut.

### DVEIN — (via designrush.com, non fetché directement)
**Type** : duo de réalisateurs, Barcelone. Site Edu Prats & Basora.
**Accueil** : fond de gribouillis enfantins, photos groupées "en vrac" au centre qui mènent aux vidéos, menu en bas d'écran qui n'apparaît qu'au mouvement de la souris.
**Navigation** : curseur qui change de forme selon l'action (play / pause / hover) ; un menu "Draw" où le visiteur peut dessiner sur le site.
**Rare** : tout — le seul site "d'auteur" du corpus.
**Faible** : décrit de seconde main.

---

## Conventions

1. **La grille de vignettes titre + réalisateur comme home** — Stink, Academy, Partizan, Rattling Stick, Hungryman, Bullion, Landia, Object & Animal, Caviar, Friend. C'est le défaut absolu ; Park Pictures fait la même chose en liste verticale.
2. **Le nom du réalisateur cliquable sous chaque film** et une nav "Directors" en première position — quasi tous. Le film est presque toujours rangé sous son réalisateur dans l'URL (Hungryman `/directors/nom/projet`, Knucklehead `/us/directors/nom/commercials/projet`, Iconoclast `/directors/youth/dinamica`, Caviar `/directors/dy/`).
3. **Page roster = liste de noms nue, alphabétique, sans image** dans le HTML — Iconoclast, Stink, Academy, Reset, Riff Raff, Directors Bureau, Landia (bandeau). Les visuels arrivent en JS ou n'existent pas.
4. **Sélecteur de région / pays dans le header** avec roster distinct par marché — Iconoclast (7 pays), Division (5 sous-domaines), Caviar (5 villes), Partizan, Prettybird, Great Guns, Smuggler, Academy, Biscuit, Reset, MJZ, Knucklehead, Riff Raff, Landia.
5. **Vignettes vidéo autoplay muted/playsinline** (Vimeo) plutôt que stills — Iconoclast, Division (14), Caviar (23), Knucklehead, Great Guns (10), Riff Raff (599 balises vidéo). Le hover révèle la vidéo ou les infos (Stink, Riff Raff `group-hover/thumbnail`).
6. **Nav ultra-courte, 3 à 5 entrées** — Stink (3), Rattling Stick (3), MJZ (3), Riff Raff (2), Division (4), Love Song (4), Friend (3). Les gros réseaux (Anonymous, Smuggler, Iconoclast) montent à 6-8.
7. **Format de titre "Marque – Titre" ou "Marque, Titre" + "by Réalisateur"** — Caviar ("By –"), Knucklehead ("by"), Division ("Réalisateur – Projet"), Riff Raff (Marque "Titre"), Landia ('Titre' / Marque). Le nom de marque passe toujours avant le titre du film.
8. **Palette noir/blanc, typo neutre, "on laisse parler le travail"** — Bullion (#000/#fff), Prettybird (#000/#fff), Rattling Stick, Anonymous ; le case study Caviar dit explicitement avoir abandonné la couleur pour ne pas concurrencer les films. Caviar est l'exception (taupe/brun + serif GT Super).
9. **Roster découpé par discipline** plutôt que par personne — Stink (roster / Music Videos / Special Projects), Smuggler (commercial / music video / film&TV), Friend (Commercials / Music Video), Bullion (Commercial / Branded & TV / Social), Blinkink (Advertising / Music Videos / Entertainment), Knucklehead (onglets Showreel / Music Videos / Film & TV dans la fiche).
10. **Une section News / Press sur la home** — Park Pictures ("LATEST PRESS"), Smuggler (toute la home), Caviar (`grid-news`), Friend, Hungryman ("News & Awards"), Great Guns.
11. **Sous-marque ou filiale affichée dans la nav** — Rattling Studio, AIRHEAD (Knucklehead), Ballistic (Great Guns), Blink Industries, AC Independent, Partizan Studio, Ventureland (Prettybird).
12. **Stack** : Next.js/CSS modules (Iconoclast, Division, Knucklehead), Nuxt (Caviar sur WP, Prettybird, Riff Raff Entertainment), Webflow (Rattling Stick), Tailwind (Riff Raff). Conséquence commune : accueils vides sans JS, mauvais score sémantique (Bullion 6,67/10 sur Awwwards).

---

## Gestes rares

- **Carrousel de 10 films numérotés avec timeline de progression, et rien d'autre sur la home** — Iconoclast (`VideoCarousel_timeline`, index "1 2 3 … 10").
- **Curseur custom à anneau de progression** qui sert d'indicateur de lecture/chargement — Division (`Cursor_progressRing`, `Cursor_ringSvg`).
- **Le menu est le roster** : un bouton MENU qui déroule directement les noms des réalisateurs, sans page Work — Reset.
- **"ENTER" placé en bas de page, après la liste des noms** — The Directors Bureau ; la porte d'entrée est la conclusion, pas le splash.
- **Une catégorie "Collaborators" séparée des "Directors"** (acteurs, artistes graphiques) — The Directors Bureau.
- **Section "Classics" / "Modern Classics" numérotés mêlés au flux récent** — Partizan ("Partizan Classics" avec tags), Riff Raff ("Modern Classics 3, 6, 7, 11, 14").
- **Roster animation classé par technique** (Stop Frame & Puppetry, 2D Craft, CG/VFX, Anthropomorphism) — Riff Raff.
- **L'animatique comparée au film fini comme pièce de portfolio** ("Animatic Comparison") — Riff Raff.
- **Panier e-commerce et section "Editions" (objets imprimés) dans le header** — Somesuch.
- **Le pub de la boîte avec horaires et plan sur la home** — Great Guns ("GG Social").
- **Bio de réalisateur entièrement en bas-de-casse, ton de conversation** — Knucklehead / Maceo Frost.
- **"News" qui pointe directement vers Instagram, et reels embarqués sur la home** — Friend London.
- **Menu vidéo ("video-enhanced menu") et intro animée** — Bullion (d'après Awwwards).
- **Menu en bas d'écran qui n'apparaît qu'au mouvement de la souris, curseur qui change selon play/pause/hover, et un mode "Draw" où le visiteur griffonne sur le site** — DVEIN (source designrush).
- **Curseur qui affiche "View Work" en texte** — Pure Cinema (source designrush) ; **liste numérotée de 7 projets qui ouvre un lecteur cinémascope sur fond noir** — Maxx Hat (source designrush).
- **Un "index" vidéo global nommé comme tel, à côté du roster** — Love Song (`/video-index`) ; **recherche + archive** — Object & Animal.
- **Organigramme de la production avec emails directs par région** — Reset ; **"Sales" en entrée de nav** — MJZ.
- **Palette non monochrome + serif d'affichage** (GT Super Display + Moderat, taupe/brun/olive) — Caviar, seul à s'écarter du noir/blanc.

---

## Trous

Ce que le corpus ne fait jamais, et qu'un réalisateur seul à Bordeaux peut prendre :

1. **Aucun site n'est construit autour d'une seule personne.** Tous sont des rosters : la home dit "voici nos 20 à 45 réalisateurs", la fiche réalisateur est une page secondaire (liste de noms, onglets, bio). Le site d'un réalisateur unique peut inverser ça : la fiche réalisateur devient la home, avec ce que ces sites réservent à leurs fiches (onglets par discipline, bio, reel) directement au premier niveau, et sans la couche "Directors" intermédiaire.
2. **Aucun site ne montre le processus.** Un seul indice dans tout le corpus : l'"Animatic Comparison" et le "Behind The Scenes" de Riff Raff. Personne ne montre le brief, le repérage, le storyboard, le montage, le nombre de jours de tournage. Pour un client corporate/immobilier/tourisme, qui achète autant une méthode qu'un résultat, un "avant/après" ou une timeline de production par film est un vide net.
3. **Aucun site ne classe par usage client.** Les catégories sont toujours des formats d'industrie (Commercial / Music Video / Branded / Film & TV), jamais des situations ("faire visiter un bien", "raconter un événement", "recruter", "vendre une destination"). Un tri par métier du client (immobilier, tourisme, événementiel, corporate) n'existe nulle part dans ce corpus.
4. **Aucun site n'ancre un lieu, sauf le pub de Great Guns.** Les villes ne sont que des sélecteurs de marché. Bordeaux, la Gironde, l'estuaire, les vignes comme terrain de tournage récurrent — cartographier ses films par lieu, ou faire du territoire un argument (connaissance des décors, lumière, autorisations) — personne ne le fait.
5. **Aucun site ne donne de chiffres.** Ni durée, ni délai, ni budget indicatif, ni taille d'équipe. Reset nomme ses producteurs avec leurs emails, c'est le maximum de transparence relevé. Une fiche film avec "tourné en 2 jours, 1 opérateur, livré en 3 semaines" n'apparaît nulle part et parle directement au client corporate.
6. **Aucun site ne fait entendre le son ou la musique.** Tout est autoplay muted, contrôle "Sound" au mieux (Partizan). Pour un site de clips, un geste sur le son (une piste qui accompagne la navigation, un unmute progressif) est absent du corpus.
7. **Le format "Marque – Titre by Réalisateur" est inutile pour un réalisateur unique.** "by Mauvais Grain" sur chaque film ne dit rien. La place ainsi libérée peut servir au client, au lieu, à l'année ou à la durée.
8. **La liste verticale de Park Pictures et le carrousel numéroté d'Iconoclast sont les seules alternatives à la grille.** Un défilement séquentiel unique (un film après l'autre, avec compteur et timeline, comme Iconoclast) est réalisable seul avec 10-15 films, alors que la grille exige un volume que le corpus a et qu'un réalisateur seul n'a pas : 15 films en grille paraissent maigres, 15 films en séquence numérotée paraissent un programme.
9. **Personne ne réutilise le curseur comme outil de lecture** hormis Division (anneau de progression) et DVEIN (play/pause). Sur un site à un seul auteur, le curseur-scrub (avancer dans le film en déplaçant la souris) reste libre.
10. **Aucun site n'a de page "index" honnête ET visuelle** : Love Song a un `/video-index` et Object & Animal une archive, mais ce sont des listes. Une page-index complète, tous les films depuis le début avec année, client et lieu, en une seule colonne dense, est un geste d'archiviste qu'un réalisateur seul peut tenir à jour et que les rosters ne tiennent pas.

---

## À capturer

```
iconoclast|https://iconoclast.tv/us/
division|https://us.division.global/
caviar|https://caviar.tv/london/
reset|https://www.resetcontent.com/
directorsbureau|https://www.thedirectorsbureau.com/
riffraff|https://www.riffrafffilms.tv/uk
knucklehead|https://www.knucklehead.tv/us/directors/maceo-frost
partizan|https://www.partizan.com/
stink|https://stinkfilms.com/united-kingdom/
bullion|https://www.bullionproductions.com/
```

Réserve si une capture échoue : `greatguns|https://www.greatguns.com/usa/`, `somesuch|https://somesuch.co/directors/`, `landia|https://www.landia.com/us/`, `dvein|https://www.dvein.com/`.
