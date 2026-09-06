# Synthèse veille — portfolios de réalisateurs et chefs opérateurs

Source : `raw-realisateurs.md` (recherches + fetchs d'un agent précédent) complété par 3 WebFetch et quelques `curl` (HTML brut) sur emilieaubry.com, bradleyandpablo.com, josh-goldsmith.com, chrismacarifilms.com, hiromurai.com, nabil.com.
Remarque de méthode : les fetchs texte ne voient ni les vidéos, ni les hovers, ni les transitions. Les mécaniques d'interaction viennent donc surtout (a) des fiches Awwwards / cssdesignawards / gallereee / tempixel, (b) des classes CSS et attributs `data-*` lus dans le HTML. Quand le brut est vide, c'est dit.

## Sites

### Salomon Ligthelm — https://ligthelm.work
**Profil** : réalisateur pub + clips + courts (NYC, Stink Films), site par Mouthwash Studio + Guillaume Colombel, Awwwards SOTD (7.49).
**Accueil** : loader avec iconographie orthodoxe, puis longue page unique : sections "Selected work / Narrative / Music Videos / Commercials / Format Agnostic / Autobiographic", cartes titre + client avec vidéo au hover ("Video hover archive portfolio"). Certaines cartes portent une métadonnée de lieu avec coordonnées GPS ("Shot in Alabama Hills… 36.6100° N, 118.1000° W", "Shot on Film"). La moitié basse de la home est une suite de citations (Tarkovski, Dostoïevski, Chesterton, C.S. Lewis…) affichées une à la fois.
**Navigation** : header 3 items `[Archive] [S.L.] [Information]`. Archive = liste mono-colonne "titre / client / lieu / année" 2011-2026 avec GIF miniatures, sans filtre ni recherche. Fiche film (`/project/little-simz-flood`) : numéro + titre, année, lieu + coordonnées, pellicule ("35mm KODAK FILM"), texte, accordéons "More info" / "Credits", ~20 photogrammes en grille, prev/next avec GIF de prévisualisation. Information = onglets Biography / Contact (6 représentants par région) / Recognition (palmarès chronologique 2016-2026).
**Rare** : coordonnées GPS + pellicule comme métadonnées de fiche ; citations philosophiques comme "zone de repos" entre les vidéos ; typographie Mach / Neue Montreal / Akkurat Mono ; texte-only pour certains films pour "calmer l'œil".
**Faible** : accessibilité notée 6/10, SEO 6.33 ; archive sans tri ; page longue et lourde.

### Emilie Aubry — https://www.emilieaubry.com
**Profil** : monteuse (Church Edit, ex-Division Paris). Design Studio Size, dev RISE2, WordPress, Awwwards SOTD (7.3). Le portfolio de référence pour "la réduction".
**Accueil** : preloader "LOADING 0 %" (compteur simulé, une seule fois par session via sessionStorage), rideau GSAP qui remonte, le logo du preloader se déplace physiquement jusqu'à sa place dans le header. Puis slider plein écran (Splide) numéroté 01-04 avec contrôles PLAY/PAUSE, MUTE/UNMUTE, CREDITS, "Directed by …", curseur-follower, boutons "pill". Vidéo en HLS via Bunny CDN + fallback Vimeo.
**Navigation** : header WORK / ABOUT + Contact (modal, e-mails en copy-to-clipboard). `/work` = tableau "NO / PROJECT / DIRECTED BY / TYPE" (28 entrées, types Commercial / Film / Music video), toggle **LIST / GRID** (checkbox stylée "toggle-pill"), au hover une vidéo 360p muette suit le curseur (`preview-follower`), sur mobile un "sticky preview" en haut. Chaque ligne ouvre un modal vidéo (`data-video-modal`, m3u8) ou la page projet.
**Rare** : le champ "Directed by" comme colonne principale (logique de monteuse : elle se définit par ses réalisateurs) ; preview vidéo qui suit le curseur dans une liste ; logo qui "atterrit" depuis le loader.
**Faible** : usabilité 6.99 ; pas de filtre par type malgré la colonne ; site 100 % dépendant du JS.

### Josh Goldsmith — https://josh-goldsmith.com
**Profil** : réalisateur + producteur exécutif (Seattle, clients OpenAI, Microsoft, Ford, Jeep, Amazon, Patagonia). Next.js, nominé Awwwards (note communauté 9.40).
**Accueil** : HTML SSR quasi vide ("Josh Goldsmith / Director & Executive Producer — Work — Info") ; tout est rendu côté client. Fiche Awwwards : "A cinematic portfolio directed like a film", éléments mis en avant : **3D Reel Cuboid** (drag & fling), **Index Hover with live preview and background mirroring**, section "Lola Rain", **Elastic Overscroll with pixel wash and snap**. Les classes CSS confirment : `GrainOverlay`, `PixelCursor` (curseur en grille de pixels), `TabNav … bleedVideo` (vidéo qui déborde sous les onglets), filtres SVG `pixelate-a/b`.
**Navigation** : deux onglets Work / Info avec soulignement animé ; fond vidéo "bleed" derrière la nav ; l'index (liste) sert de preview live avec le fond qui se reflète.
**Rare** : le cube 3D de showreel qu'on lance à la main ; l'overscroll élastique qui pixelise ; le grain + curseur pixel comme identité.
**Faible** : rien d'indexable sans JS (SEO nul), aucune fiche film lisible dans le brut, effets lourds.

### Gavin Schneider Productions — https://www.gsproductions.co.za
**Profil** : société de production photo + film (Cape Town), site DashDigital, Next.js + Sanity + AWS, Awwwards SOTD + Dev Award + FWA.
**Accueil** : preloader, puis scroll fluide qui révèle progressivement des cartes projets (vignette, "7 Images", client, crédit photographe). Toggle **List / Grid**.
**Navigation** : Stills / Motion / Culture / Information / Journal. Fiche projet avec lecteur vidéo plein écran et **slider projet à projet**, transitions de page. Codrops : "type-driven, clean, editorial, multiple ways to explore", CMS reconstruit, vidéo adaptative.
**Rare** : section "Culture" et "Journal" sur un site de prod ; compteur d'images par carte ; page projet feuilletable au slider.
**Faible** : accessibilité pointée par le jury ; `/case-studies` en 404 ; pas de manifeste sur la home.

### Chris Macari — https://chrismacarifilms.com
**Profil** : réalisateur clips/pub (Paris, UBBA), site FLOT NOIR + Clément Merouani + Guillaume Colombel, Nuxt + WebGL, Awwwards HM + CSSDA.
**Accueil** : HTML SSR = titre seul. Fiche Awwwards : loader, scène 3D, 404 vidéo. CSS : palette `--black/--white/--red #ef1923/--green`, fonts Druk Wide (titres), N27, Procerus ; **`body.rec-active { background: var(--red) }`** — un mode "REC" qui fait basculer tout le fond en rouge ; Lenis smooth scroll ; `.plane-imgs` (images en plans WebGL) ; `.project-item--cover / --infos`.
**Navigation** : non visible dans le brut. Transitions Vue `fade / slide-x / slide-y / long-fade`.
**Rare** : l'état "REC" (fond rouge) ; 404 vidéo ; typographie Druk Wide très large.
**Faible** : zéro contenu indexable ; le brut ne dit rien de la liste des films.

### Ian Coad — https://iancoad.com
**Profil** : chef opérateur (Echo Park, LA). Site par benyo, Three.js + React + Sanity, Awwwards HM.
**Accueil** : header "selects / reel / info", titre "Ian Coad DP" répété 3 fois. Fiche Awwwards : **"Selected works thumbnail focus"** (la vignette survolée s'isole), **"Reel highlight explorer"**, **"Project navigator"** à la souris, infinite scroll, grands fonds image.
**Navigation** : selects (index), reel, info. `/info` = bio, diplômes (MFA Chapman, Local 600), contact avec téléphone copiable, **liste des réalisateurs avec qui il a travaillé, liste clients, et inventaire matériel** (ALEXA 35, steadicam, Ronin R2…).
**Rare** : l'"explorateur de reel" (naviguer dans les temps forts du showreel) ; l'inventaire matériel sur la page info ; le téléphone copiable.
**Faible** : home vide sans JS ; infinite scroll sans repère.

### Brady Perron — https://bradyperron.com
**Profil** : vidéaste / réalisateur / monteur / photographe (Brooklyn, outdoor/ski). Site Group Dynamics, WebGL + GSAP + Sanity, Awwwards HM.
**Accueil** : intro animée puis une **liste texte continue** des projets (pas de grille), "bradyperron" en titre, nav "list / about". About = tiroir qui se ferme (bio "Rhythm. Range. Poetic. Dynamic.", portrait, Instagram, mail).
**Navigation** : toggle **Grid / List**, filtres, infinite scroll, pages projet type étude de cas ("Harlaut Apparel Winter 24 Campaign"). Fiche Awwwards : **"Idle States"** (animations quand l'utilisateur ne fait rien).
**Rare** : les états d'inactivité ; le "about" comme panneau superposé plutôt que page.
**Faible** : palette blanc/gris neutre ; peu de métadonnées par projet.

### Ian Pons Jewell — https://ianponsjewell.com
**Profil** : réalisateur pub + clips (Nike, Revolut…), site perso sans agence.
**Accueil** : **une seule page chronologique** 2025 → 2003. Chaque entrée = marque/artiste en titre, titre du film, date "DDth MMM YYYY", **trois GIF animés** extraits du film, lien Vimeo/YouTube.
**Navigation** : quasi nulle : un lien "#CONTACT" qui ancre au footer (mails directs + prods USA/UK/France). Catégories COMMERCIAL / MUSIC VIDEO / FASHION FILM / SHORT FILM / STUDENT FILM.
**Rare** : consigne dans le footer : "If sending a commercial brief, it must be sent as a small PDF attachment to email, not a download link." ; les student films assumés ; 3 GIF par film au lieu d'une vignette.
**Faible** : aucune fiche film (renvoi vers Vimeo/YouTube), pas de reel, page très longue.

### Megaforce — https://www.megaforce.fr
**Profil** : collectif de 4 réalisateurs (Iconoclast / Riff Raff), site maison très simple.
**Accueil** : page unique : MUSIC VIDEOS (14 vignettes titre + artiste), COMMERCIALS (36+), ART DIRECTION (5 pochettes), PRESS (4 mentions), About en une phrase, Distinctions, Contacts par pays (FR/UK/US/DE/SE).
**Navigation** : vignettes liées, pas de fiche film décrite ; `/extras` en 404.
**Rare** : rubrique "Art direction" et "Press" au même niveau que les films.
**Faible** : brut = liste plate ; aucune interaction documentée ; sections datées (presse 2010-2012).

### Andrew Thomas Huang — https://andrewthomashuang.com
**Profil** : réalisateur / artiste (Björk, FKA twigs), site type Squarespace/Shopify (panier).
**Accueil** : grille de vignettes titrées (Cellophane, Black Lake, Vulnicura…), certaines cliquables, d'autres statiques.
**Navigation** : Films / Art / About / Linktree externe / panier `[0]`. `/films` : le brut ne montre que la nav. Footer "Follow" + "Representation" (Lit, Object & Animal).
**Rare** : e-commerce (éditions) intégré au portfolio.
**Faible** : vignettes non cliquables mélangées aux cliquables ; page Films non documentée.

### Matt Lambert (Dielamb) — https://www.dielamb.com
**Profil** : réalisateur / artiste queer (Berlin, Gucci, CK), site Cargo avec panier.
**Accueil** : un seul GIF animé lié à une vidéo Vimeo, menu à deux dossiers FILM (commissions / music video / fashion / commercial / live / books / photo) et VITIUM (Sissy Smut / films / press & exhibition), "info", Instagram.
**Navigation** : arborescence en dossiers avec "Back" ; `/heyhun` = page services : bio, roster clients, représentation (Object & Animal, La Pac).
**Rare** : deux identités (commande vs projet artistique) séparées dès le menu ; page "services" nommée "heyhun".
**Faible** : la home montre un seul film ; navigation en dossiers peu lisible.

### Jonas Lindstroem — https://jlindstroem.com
**Profil** : photographe + réalisateur (Iconoclast, Kendrick Lamar "Element").
**Accueil** : nom en gros, mail studio + Instagram, routage des demandes (Photo → WE FOLK ; Film → Iconoclast par pays), puis **la monographie "BELIEVE"** en première position (description physique du livre, "Sold out"), puis œuvres chronologiques avec description, **crédit chef op** et citation de l'artiste.
**Navigation** : page unique, pas de menu décrit. Footer : copyright 1988-2026, RGPD, roster clients.
**Rare** : le livre avant les films ; texte à la première personne par projet ; crédit DP systématique.
**Faible** : page unique sans index ; brut ne dit rien des vidéos.

### Kirill Groshev — https://kirillgroshev.com
**Profil** : chef opérateur (Adidas, Nike), site naau.studio sur Tilda, 2022.
**Accueil** : nom, nav NARRATIVE / PHOTOGRAPHY / ABOUT, contrôles "Left / Right" (carrousel), **indicateur de progression "0 %"**, aucun visuel dans le HTML. Tempixel : orange/rouge sur noir, **JetBrains Mono**, coins arrondis, référence AKIRA dans le logo "hiéroglyphe".
**Navigation** : carrousel horizontal ; `/narrative` = même nav, rien d'autre visible.
**Rare** : identité "rétro-futuriste" cohérente (mono + rouge + logo japonisant) ; pourcentage de progression comme seul repère.
**Faible** : tout est vide sans JS ; pas de fiche.

### Tim Flower — https://timflower.co.nz
**Profil** : chef opérateur (Nouvelle-Zélande).
**Accueil** : grille **numérotée** de 10 projets (numéro, titre, vignette floue basse déf en placeholder). Tempixel : **lignes de grille animées au chargement**, clips vidéo autoplay au hover, préférence pour des extraits courts plutôt que des trailers.
**Navigation** : Work / Information / Contact.
**Rare** : la grille qui se dessine (lignes) au chargement ; la numérotation ; "short clips over trailers".
**Faible** : 10 projets seulement, peu de contexte.

### Neels Castillon — https://neelscastillon.com
**Profil** : réalisateur + artiste (Paris, RSA), Fabrik thème Airdura.
**Accueil** : "film director & artist", grille ~25 cartes titre + sous-titre (ex. "Case Study → Immersive film", "'Ma' → The space between all things").
**Navigation** : films / photographs / specials / books / info ; `/films` paginé ("Next Page"), sans client ni crédits dans la liste ; `/info` en 404 dans le brut. Footer bio "Represented worldwide by Ridley Scott Associates".
**Rare** : le sous-titre en flèche "→" comme mini-pitch ; rubriques "specials" et "books".
**Faible** : pagination au lieu d'un index ; fiche film non documentée.

### Dave Meyers — https://davemeyers.com
**Profil** : réalisateur clips/pub (Kendrick, Harry Styles), RadicalMedia.
**Accueil** : nom + phrase d'intro ("directed hundreds of music videos…"), grille de projets : vignette, artiste, titre, **récompenses sous le titre** (VMA, Grammy, Cannes Lion Gold), et un **compteur numérique** (nombre d'images du projet).
**Navigation** : Music Videos / Commercials / Photography / Film / About / Contact / Instagram ; `/music-videos` en 404 dans le brut.
**Rare** : les awards comme ligne de métadonnée sur chaque carte.
**Faible** : liens de nav cassés ; grille classique.

### Rob Chiu — https://robchiu.com
**Profil** : auteur-réalisateur (Lexus, BMW, Nike), Fabrik thème Airdura.
**Accueil** : "Rob Chiu 趙文偉 — Writer & Director", **trailer du film "Chinaman" en tête**, puis grille ~27 projets titre + client.
**Navigation** : Films / Photography / Archive (→ Vimeo) / Contact. Footer : Instagram, Vimeo, mail, LinkedIn, IMDb.
**Rare** : archive externalisée sur Vimeo ; nom en deux écritures.
**Faible** : rien sur la fiche film ; copyright agressif.

### Bradley & Pablo — https://bradleyandpablo.com
**Profil** : duo réalisateurs clips (Prettybird, Lil Nas X, Rosalía). Site **Cargo 2** (10 projets), 503 pour WebFetch mais lisible en curl.
**Accueil** : liste de titres en mode "-->" ("BALMAIN X CHANNEL 4 -->", "LIL NAS X & NAS -->", "ROSALÍA -->"…) + "View all", autopagination au scroll (`preload_distance 1500`), fade-in des éléments à l'entrée dans le viewport, slideshow auto (2.5 s, fondu).
**Navigation** : "Information" = bio d'une ligne, "Watch our work on Vimeo", **contacts routés par usage** (FILM + TV / MUSIC VIDEOS + COMMERCIALS par pays / EVERYTHING ELSE → mail direct). Fiche projet (`/Nathy-Peluso`) : bloc crédits "Label Sony / Directed by / DOP / Edit / Grade / Production".
**Rare** : le "-->" comme seul ornement ; crédits en 6 lignes fixes.
**Faible** : serveur instable (503), Cargo daté, aucune image dans le HTML.

### SOMA — https://soma.ca/en/
**Profil** : maison de production (Montréal, 15 réalisateurs). Site Gymnase, WordPress + GSAP, Awwwards HM.
**Accueil** : grille de portraits des réalisateurs **chargée dans un ordre aléatoire à chaque visite** ("A site with no main character"), FR/EN, cookie banner.
**Navigation** : Directors / About us / Contact. Fiche Awwwards : "Falling Manifesto" (manifeste qui tombe), grille équipe avec photos au hover, easter eggs codés main.
**Rare** : l'ordre aléatoire anti-hiérarchie ; le manifeste animé ; easter eggs.
**Faible** : la home sans aucun texte ; cookie banner envahissant.

### Artem Shcherbakov — https://artemartemartem.com
**Profil** : réalisateur CGI/VFX (ZHEESHEE), site SALT AND PEPPER + Cedro, Next.js + Three.js + GSAP, Awwwards SOTD.
**Accueil** : "Hey I'm Artem", phrase de positionnement, 6 projets en cartes titre + type ("cgi" / "live action") + lien "33+ cases", paragraphe narratif citant les œuvres, GIF animés, agent avec 2 téléphones.
**Navigation** : works / contact (ancre). Fiche Awwwards : lecteur plein écran + transition, typo animée, pré-loader, 404 custom, **footer reveal**.
**Rare** : le ton "Hey I'm Artem" + bio familiale ; "33+ cases" caché derrière 6 sélectionnés.
**Faible** : accessibilité 6.4.

### Jason Bergh — https://www.jasonbergh.com
**Profil** : réalisateur / DP / producteur documentaire (Netflix, ESPN). Design BL/S + Artycoders.
**Accueil** : nav numérotée "01. Work / 02. reportage / 03. About / 04. Archive / 05. Contact", tagline "Intimate, Raw Human Storytelling", trois blocs TV & FILM / EDITORIAL / COMMERCIAL, carrousel "01/20".
**Navigation** : chaque projet = titre + talent/marque, format (Feature Documentary, Short…), diffuseur, paragraphe, **rôle crédité** ("Director & DP", "Showrunner"), lien vidéo.
**Rare** : le rôle tenu affiché par projet ; rubrique "reportage".
**Faible** : carrousel comme structure principale.

### Mimi Vuong — https://mimivuong.com
**Profil** : réalisatrice / productrice (Spotify Wrapped, Google Gemini). Gallereee : "handles scrolling like an edit".
**Accueil** : grille ~20 cartes titre + **tags de type** (film, commercial, campaign, animation, livestream production, creative direction…).
**Navigation** : Portfolio / About ; footer Instagram + mail.
**Rare** : multi-tags par projet.
**Faible** : pas d'info client ni année dans la liste.

### Danik Bartolini — https://www.danikbartolini.com
**Profil** : réalisateur + chef op (Montréal, The North Face, SAQ). Site Velours Studio.
**Accueil** : phrase "He works as a cinematographer, director, or in a combined role depending on the project", grille vignettes + GIF.
**Navigation** : All Work / Film / Commercial / Music Video / About / Contact (filtres par type), section "Selected Work" clients, footer mail + téléphone + ville.
**Rare** : rien (mais le modèle le plus proche d'un indépendant régional : filtres simples, téléphone, ville).
**Faible** : rien ne distingue la fiche film.

### Mikki Sindhunata — https://mikkisindhunata.com
**Profil** : réalisatrice issue de la danse (Pays-Bas).
**Accueil** : "Director" + 2 phrases de positionnement + "Read more", **carrousel 01-04** avec play/pause, cookie panel bilingue.
**Navigation** : Home / Works / Archive / About / Contact.
**Rare** : rien.
**Faible** : cookie consent qui mange l'écran.

### Scheme Engine — https://www.schemeengine.com
**Profil** : boîte de production "culture-first" (Xavier Dolan, Floria Sigismondi).
**Accueil** : tagline "We create from the culture we live.", manifeste, CTA "PARTNER WITH US", carrousel de projets avec crédit réalisateur, **panneau de contrôle de shader visible** (Time Speed, Pause/Reset, 7 palettes HSL/Alpha — probablement un panneau de debug oublié).
**Navigation** : Directors / Work / Film & TV / Contact.
**Rare** : le panneau shader exposé ; positionnement politique ("BIPOC-OWNED").
**Faible** : c'est une prod, pas un réalisateur.

### Sites vides dans le brut (JS only / bloqués)
- **Hiro Murai — https://hiromurai.com** : page noire "Unpacking…" ; le HTML n'est qu'un bundler (SVG placeholder cercle + play), rien de lisible. Aucune info de navigation.
- **Nabil — https://nabil.com** : SPA Vue (`<div id="app">`), un seul mot "Nabil". Rien.
- **Samuel Regan — https://samuelregan.com** : Framer, nav Projects / About, home vide ; Awwwards parle de **layout horizontal + infinite scroll + fullscreen**.
- **Autumn de Wilde**, **Minimalio**, **Studio Size**, **Behance**, **Commarts**, **DONPROD (CSSDA)** : 403/503/vides.
- **Woodkid** : redirige vers un lnk.to (pas de portfolio).
- **Naked City Films** (Awwwards SOTD, SavoirFaire) : menu avec vidéo, **screensaver**, image trail dans le footer, grille qui se réorganise au scroll, bleu électrique #0004EB.
- **Michael Gatt** (compositeur, Synchronized) : **égaliseur de lecteur** sur les pages projet, about en scroll-storytelling.
- **Ashley Brooke** (studio) : Webflow + GSAP, section "Clients" en vidéo.
- Recherchés sans site perso trouvé : Aube Perrie, Romain Gavras, Daniel Wolfe, Vincent Haycock, Terence Neale, Kahlil Joseph, Xavier Dolan, Bertrand Mandico, Alice Kong, Manu Cossu, Antoine Bardou-Jacquet (tous via les pages de leurs prods : Iconoclast, Partizan, Somesuch, Anorak, RSA, Mynd…).

## Conventions

1. **Noir (ou quasi-noir) + blanc + une seule couleur d'accent.** Ligthelm (#000/#9C9C9C/#fff), Emilie Aubry (#000/#fff), Artem (#0E0E0E/#fff), Michael Gatt (#0F0F0F/#CFCFCF), GSP (#FBFBFB/#000), Chris Macari (noir + rouge #ef1923), Groshev (noir + rouge/orange), SOMA (noir + orange #FF5625), Naked City (bleu #0004EB + gris). Fabrik confirme : "predominantly dark backgrounds… better contrast over video".
2. **Preloader / compteur de chargement** presque systématique sur les sites primés : Ligthelm, Emilie Aubry ("LOADING 0 %"), GSP, Chris Macari, Artem, Michael Gatt, Groshev ("0 %"), Cargo d'Ohunnike, Brady Perron ("intro animation").
3. **Index texte + vidéo au hover** : Ligthelm (archive), Emilie Aubry (liste + follower vidéo), Josh Goldsmith ("index hover live preview"), Tim Flower (clips autoplay au hover), Ian Coad ("thumbnail focus"), Brady Perron (liste continue).
4. **Toggle Liste / Grille** : Emilie Aubry, GSP, Brady Perron. Devenu un standard 2026 sur les portfolios film.
5. **Nav à 2-3 entrées, jamais plus** : Ligthelm (Archive / Information), Ian Coad (selects / reel / info), Josh Goldsmith (Work / Info), Emilie Aubry (Work / About), Brady Perron (list / about), Mimi Vuong (Portfolio / About), Kirill Groshev (3). Les sites à 5-6 entrées (Dave Meyers, Danik Bartolini, Jason Bergh) sont ceux qui n'ont pas de studio de design derrière.
6. **Catégorisation par format** : Commercials / Music Videos / Narrative (+ Fashion, Short) chez Ligthelm, Ian Pons Jewell, Megaforce, Dave Meyers, Danik Bartolini, Matt Lambert. Rarement par client ou par secteur.
7. **Fiche film = vidéo plein écran + crédits repliés + prev/next** : Ligthelm (More info / Credits + prev/next avec GIF), GSP (slider projet), Artem (lecteur plein écran + transition), Emilie Aubry (modal + CREDITS), Bradley & Pablo (bloc crédits fixe Label/Directed/DOP/Edit/Grade/Production).
8. **Contacts routés par territoire et par usage** plutôt qu'un formulaire : Ligthelm (6 régions), Megaforce (5 pays), Bradley & Pablo (FILM+TV / MV+Commercials par pays / "Everything else"), Lindstroem (Photo → agence, Film → Iconoclast), Ian Pons Jewell (USA/UK, France), Matt Lambert (US/UK, France). Aucun formulaire de contact sauf Emilie Aubry (modal) et Scheme Engine.
9. **GIF / vidéo muette comme vignette**, jamais une image fixe seule : Ian Pons Jewell (3 GIF par film), Ligthelm (GIF archive + prev/next), Danik Bartolini, Artem, Matt Lambert, Emilie Aubry (mp4 360p loop muted).
10. **Palmarès et reconnaissance comme contenu de premier plan** : Dave Meyers (awards sous chaque titre), Ligthelm (onglet Recognition 2016-2026), Megaforce (Distinctions), Ian Coad (Local 600, MFA).
11. **Transitions de page + smooth scroll (Lenis / GSAP)** partout sur les sites primés : GSP, Artem, Naked City, Chris Macari (Lenis), Ian Coad ("info page transition"), Michael Gatt.
12. **Crédit du studio de design en footer** : Ligthelm (Mouthwash), Groshev (naau), GSP (Dash Digital), Danik (Velours), Artem (cedro x snp), Jason Bergh (BL/S). Signe que le site est lui-même une pièce de portfolio.

## Gestes rares

- **Cube 3D de showreel qu'on attrape et qu'on lance** ("3D Reel Cuboid drag & fling") — Josh Goldsmith (fiche Awwwards).
- **Overscroll élastique avec "pixel wash" et snap** en bout de page — Josh Goldsmith.
- **Index dont le hover projette la vidéo en fond, en miroir** ("index hover live preview, background mirroring") — Josh Goldsmith.
- **Preview vidéo qui suit le curseur dans une liste** (`preview-follower`) + version mobile en "sticky preview" — Emilie Aubry.
- **Le logo du preloader se déplace physiquement jusqu'au header** (mesure de la position cible, timeline GSAP) — Emilie Aubry.
- **État "REC" qui fait virer tout le site au rouge** (`body.rec-active`) — Chris Macari (lu dans le CSS).
- **Coordonnées GPS + lieu + pellicule comme métadonnées de film** — Ligthelm.
- **Citations philosophiques intercalées comme "resting place"** entre les vidéos — Ligthelm (Mouthwash).
- **Roster chargé dans un ordre aléatoire à chaque visite** ("no main character") + manifeste qui tombe — SOMA.
- **Idle states** : animations déclenchées quand l'utilisateur ne fait rien — Brady Perron (Group Dynamics).
- **Screensaver à l'arrivée + image trail dans le footer** — Naked City Films.
- **"Reel highlight explorer"** : naviguer dans les temps forts du showreel plutôt que le subir — Ian Coad.
- **Égaliseur audio visualisé dans le lecteur** — Michael Gatt.
- **Lignes de grille qui se dessinent au chargement** — Tim Flower.
- **Inventaire matériel + liste des réalisateurs collaborateurs** sur la page info — Ian Coad.
- **Consigne opérationnelle dans le footer** ("brief en PDF léger, pas de lien de téléchargement") — Ian Pons Jewell.
- **Livre / monographie en première position** avant les films — Jonas Lindstroem.
- **Deux dossiers d'identité** (commande vs projet artistique) dès le menu racine — Matt Lambert.
- **Panneau de contrôle de shader laissé visible** (Time speed, palettes HSL) — Scheme Engine (probablement involontaire, mais idée de "réglages" exposés).

## Trous

Ce qu'aucun des portfolios lus ne fait, et qu'un réalisateur seul à Bordeaux (corporate, tourisme, immobilier, événementiel, clip) peut prendre :

1. **Aucun n'est ancré dans un territoire.** Ligthelm affiche des coordonnées GPS pour l'exotisme ; personne n'assume "je tourne ici" : une carte ou un index par lieu (Bassin, vignoble, Bordeaux métropole, Pays basque) avec les films tournés à chaque endroit serait unique et utile aux clients tourisme/immobilier.
2. **Aucun ne trie par usage client.** Tout est classé Commercial / Music Video / Narrative (logique de réalisateur). Un index à double entrée (format × secteur : hôtel, domaine viticole, promoteur, événement, artiste) n'existe nulle part dans le brut.
3. **Aucun ne montre le processus ni le temps.** La recherche "behind the scenes / making of / treatment" n'a rien donné sur des sites personnels. Une fiche film avec "brief → tournage (2 jours, 3 personnes) → livraison (10 jours)" parle directement à un DirCom ou un promoteur.
4. **Aucun n'affiche de prix, de durée ni de formats livrés.** Les sites vus vendent un regard, pas un service. Une ligne "livrables : film 90 s + 3 verticaux + photos" par projet serait immédiatement différenciante sur ce marché.
5. **Aucun ne rend les vidéos lisibles sans JS.** Hiro Murai, Nabil, Josh Goldsmith, Chris Macari, Groshev : zéro contenu indexable. Un réalisateur régional vit du SEO local ("vidéaste Bordeaux", "film immobilier Bordeaux") : un index HTML complet (titre, client, lieu, année, durée) avant toute couche d'interaction est un trou évident.
6. **Aucun ne propose de "reel à la carte".** Ian Coad a un "reel highlight explorer", mais personne ne laisse le visiteur assembler un reel filtré par secteur (ex. "montre-moi 60 s d'immobilier") — faisable avec des clips courts taggés.
7. **Aucun n'expose la voix du client.** Pas un témoignage, pas un résultat (fréquentation, ventes, vues) dans tout le brut ; le seul "social proof" est le palmarès (Dave Meyers, Ligthelm). Un chiffre par projet corporate/tourisme serait une singularité.
8. **Le téléphone est quasi absent** (Danik Bartolini et Ian Coad seulement, Artem via un agent). Aucun n'affiche disponibilité / délai de réponse / zone d'intervention. Pour un indépendant, "disponible à partir du 14 octobre, Nouvelle-Aquitaine" en header est un geste que personne ne fait.
9. **Aucun ne joue la saison ou l'heure.** Sites figés ; un site de réalisateur tourisme/vignoble pourrait changer de film d'ouverture selon la saison ou la lumière du jour à Bordeaux (les idle states de Perron et l'aléatoire de SOMA montrent que la variabilité est acceptée, mais jamais reliée au réel).
10. **Aucun ne pense mobile-first pour le client pressé.** Emilie Aubry est la seule avec un "sticky preview" mobile documenté ; les cubes 3D, overscroll et WebGL sont des expériences desktop. Un site qui se lit en 30 s sur un téléphone en réunion est un vrai trou.

## À capturer

```
ligthelm|https://ligthelm.work/
ligthelm-archive|https://ligthelm.work/archive
emilieaubry-work|https://www.emilieaubry.com/work/
joshgoldsmith|https://josh-goldsmith.com/
gsproductions|https://www.gsproductions.co.za/
iancoad|https://iancoad.com/
bradyperron|https://bradyperron.com/
chrismacari|https://chrismacarifilms.com/
ianponsjewell|https://ianponsjewell.com/
soma|https://soma.ca/en/
timflower|https://timflower.co.nz/
danikbartolini|https://www.danikbartolini.com/
```
