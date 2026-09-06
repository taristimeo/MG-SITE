# Veille France — maisons de production parisiennes vs vidéastes bordelais

Source : `raw-france.md` (fetchs + recherches de l'agent précédent, ~60 sections) + 8 fetchs complémentaires (2 réussis : page Bordeaux de Biux, Bloom Paris ; échecs : insurrection.paris DNS, hamlet.tv page vide, controlfilms.tv 503, wanda.fr 503, henry.paris 500, flashbackproduction.fr 520).

Précaution de lecture : les fetchs sont textuels (markdown extrait). Quand le brut dit « aucune vidéo intégrée visible », cela signifie souvent « pas d'élément `<video>` lisible dans le texte extrait », pas forcément une absence réelle. Les mécaniques d'accueil des sites parisiens sont reconstruites à partir du brut + fiches Awwwards, et signalées « (déduit) » quand c'est une inférence.

Sites injoignables pendant toute la veille (aucune fiche possible) : Bandits (525), Hamlet (contenu vide), Henry (500), Insurrection (DNS), Motion Palace (.fr/.tv 503), Standard Films (503), Blackbird (503), Birth (birth.fr = domaine à vendre, vraie URL non trouvée), Première Heure (503), Maxx Hat (503), La Petite Production (503), Elephant at Work (redirigé vers elephant-groupe.com, non suivi), Les Télécréateurs (pixel de tracking seul).

---

## Paris — maisons de production

### Iconoclast — https://iconoclast.tv/fr/
- **Type** : maison de production internationale (Film, TV, Commercial, Music Video, Print), réseau 7 pays, fondée 2012, 79 rue du Faubourg-Poissonnière.
- **Accueil** : quasi aucun texte ; le brut ne voit que « Nike » puis « Arnaud Bresson » (client + réalisateur) et une numérotation « 12345678910 » → carrousel plein écran de 10 films, un par réalisateur, pagination numérique (déduit).
- **Navigation** : Directors, Film + TV, Photographers, Music + sélecteur d'entité (France, U.S., U.K., Germany, Brazil, Mexico, Spain).
- **Rare** : le portfolio est classé par auteur, pas par projet ; la marque cliente est affichée avant le nom du réalisateur.
- **Faible** : « Aucun texte de positionnement marketing détectable » — zéro pédagogie, zéro contact humain visible au-delà d'un lien Contact.

### Solab — https://www.solab.fr/
- **Type** : maison de production pub/clips, roster de 45+ réalisateurs (Alex 2tone, Ali Abbasi, Björn Rühmann…).
- **Accueil** : liste alphabétique de réalisateurs, chaque nom « répété trois fois » dans le DOM (nom / hover / lien) → probablement une liste typographique avec preview vidéo au survol (déduit).
- **Navigation** : Home / Film&TV / News / Contact.
- **Rare** : le site n'est qu'un annuaire de talents, aucun texte, aucune tagline.
- **Faible** : « Absence d'éléments détectables (geste signature, plein écran vidéo, curseur custom) » ; structure HTML simple.

### Frenzy Paris — https://www.frenzyparis.com/
- **Type** : maison de production multi-entités (Frenzy Global / Image / Films).
- **Accueil** : flux de projets titrés « ANGÈLE by Suzie and Leo », « NIKE by Arthur Couvat » ; placeholders SVG transparents → lazy-load de vidéos plein cadre (déduit).
- **Navigation** : Culture, Directors, Awards, About.
- **Rare** : rubrique « Culture » (contenu éditorial) à côté du roster ; convention de titrage « MARQUE by Réalisateur ».
- **Faible** : « Aucun énoncé de mission ou description corporate ».

### BADASS — https://www.badassfilms.tv/ (+ fiche Awwwards SOTD 15/10/2017)
- **Type** : maison de production pub/digital/clips, bureaux Paris + Marseille.
- **Accueil** : Awwwards : « navigation inhabituelle, galerie vidéo avec sélecteur au scroll, animations typographiques », catégorie « navigation fullscreen ». Palette 2 couleurs (#2779a7 bleu, #FF9398 rose). Stack : WordPress + PixiJS (WebGL) + Webpack.
- **Navigation** : Back / Talents / News / Infos. Grille de vignettes par réalisateur (Antoine Bal, Indy Hait, Pedro Pinto, Hannah Lux Davis…).
- **Rare** : refonte signée Ensemble (Honorable Mention 2023) avec images sur Sanity CDN ; le site expose « Executive Producer / Founder », « Production Coordinator » — l'organigramme comme seul texte.
- **Faible** : usabilité notée 6,7/10 sur Awwwards ; « quasi exclusivement visuel ».

### Control Films — http://www.controlfilms.tv/ (fiche Awwwards uniquement, site 503)
- **Type** : « boutique de production spécialisée dans les films commerciaux et clips musicaux ».
- **Accueil** : **split screen** (collection Awwwards « Split screen ») — écran coupé en deux volets, projets en vidéo.
- **Navigation** : non documentée.
- **Rare** : le split screen comme identité (deux films côte à côte).
- **Faible** : aucune note ni date sur Awwwards ; site inaccessible aux robots.

### Wanda — https://www.wanda.fr/ (503) / fiche Awwwards / https://wanda.net/ (entité Wanda+ Belgique)
- **Type** : maison de production pub/clips/séries/photo ; site conçu par **Ensemble** (Honorable Mention 2021).
- **Accueil** : Awwwards : « navigation par défilement horizontal », « lecteur vidéo intégré », « hover image », « mise en page innovante ».
- **Navigation** (wanda.net) : Directors / Likes / Awards / Contact, FR/NL ; roster 40+ (Spike Jonze, Jonathan Glazer, Brady Corbet…) sous label MJZ ; images via Contentful (`ctfassets.net?q=50&w=128`).
- **Rare** : rubrique « Likes » (ce que la maison aime, pas seulement ce qu'elle produit) ; scroll horizontal.
- **Faible** : « Interface minimaliste sans effets visuels marquants détectés » sur wanda.net ; bandeau cookies comme texte le plus long de la page.

### La Pac — https://pac.fr/
- **Type** : maison de production historique (depuis 1972), 40+ réalisateurs (Colin Solal Cardo, Dave Meyers, Nash Edgerton…).
- **Accueil** : galerie d'images créditées photographe (« Sivaroj Kongsakul apparaît 15 fois ») ; système « My Collection / Expand View / Close ».
- **Navigation** : Directors / Special Projects / About ; sous-sections Films/Stills par réalisateur.
- **Rare** : « My Collection » — le visiteur (producteur d'agence) se constitue une sélection de films à partager ; les photos de tournage sont créditées.
- **Faible** : seul texte trouvé = la balise title « La Pac - Société de production audiovisuelle basée à Paris » ; « absence de textes descriptifs, de manifesto ».

### Big Productions — https://www.bigproductions.fr/
- **Type** : maison de production pub (« BEST PRODUCTION COMPANY 2024 - CB NEWS », « PRODUCTION COMPANY OF THE YEAR ») ; site par Ensemble (HM 2022).
- **Accueil** : « scroll vertical dominant (structure en flux) », vignettes 16:9 en SVG placeholder responsive, lien « back » discret.
- **Navigation** : Directors / News / Contact. Portfolio mixte : par réalisateur (Lise & Romane, Dan French, Mischa Rozema…) et par marque (AXA, Lego, Nike, Renault…).
- **Rare** : une fiction (« 12H Le Cri Défendu ») avec générique complet au milieu des pubs.
- **Faible** : « pas de technologie détectable exceptionnelle » ; imagerie « standardisée ».

### Partizan — https://www.partizan.com/
- **Type** : maison de production internationale (US, UK, France, World), Michel Gondry en tête d'affiche.
- **Accueil** : lecteur vidéo intégré « avec contrôles (play, pause, fullscreen, son) », vignettes 480×270 ; « Partizan Classics » (Björk, Daft Punk, White Stripes) à côté du récent (Chanel, Meta x Oakley Super Bowl 2025-2026).
- **Navigation** : Work / Directors / About / Contact + régions.
- **Rare** : section « Classics » = l'archive comme argument ; « mise en avant du nom avant le projet ».
- **Faible** : « Aucun texte descriptif substantiel ».

### Quad Prod — https://prod.quad.fr/
- **Type** : pôle pub/clips du groupe Quad (Intouchables, Ballerina…), bilingue.
- **Accueil** : « typo blanche sur fond sombre », logo blanc vectorisé, lien « watch », mention « part of » (groupe) ; « galerie portfolio sans narratif commercial ».
- **Navigation** : projets / réalisateurs / contact.
- **Rare** : architecture headless (« api.prod.quad.fr » détectée) ; footer « © 2023 QUAD PROD » répété.
- **Faible** : copyright figé à 2023 ; zéro texte.

### Phantasm — https://www.phantasm.tv/
- **Type** : maison de production, sœur d'un studio photo (« phenomena.photos »).
- **Accueil** : « esthétique épurée, quasi-vide » — nom + trois liens.
- **Navigation** : Work / Directors / Contact + Instagram + portfolio photo externe.
- **Rare** : le couplage film + photo (Phantasm / Phenomena) via deux domaines.
- **Faible** : « Les éléments textuels visibles sont limités au nom ».

### Division — https://www.divisionparis.com/ → https://www.division.global/ → http://us.division.global/
- **Type** : maison de production internationale (US, NL, APAC, FR, UK).
- **Accueil** : « grille de vidéos en plein écran cliquables (chaque projet renvoie à sa page dédiée) » ; liste réalisateur → marques (Marius Gonzalez : Nike x PSG ; François Rousselet : MacBook Pro, Coca-Cola x Star Wars ; Torso : Madonna, Charli XCX).
- **Navigation** : Talent / Contact / Awards / Explore + sélecteur de région.
- **Rare** : entrée « Explore » (exploration libre plutôt que catalogue) ; le domaine .paris redirige vers un .global géolocalisé (double redirection 301 puis 307).
- **Faible** : la redirection géographique forcée fait atterrir un visiteur français sur la version US.

### Bloom. — https://www.bloomparis.tv/ (Awwwards SOTD + Developer Award, 7 mai 2025, par Beaucoup.)
- **Type** : *service production* parisienne (exécution de tournages pour productions étrangères : Riot Games Valorant Champions Paris 2025, Lenny Kravitz, Louis Vuitton, Puma × Lewis Hamilton).
- **Accueil** : vidéo plein écran + « animations GIF pour les projets », « scroll révélateur de contenu », compteur « /35 work ». Textes : « Your production partner in France », « Nestled in the heart of Paris, we are a dedicated service production », « Feel at home in Paris / Down South / on the West coast / In the Alps ».
- **Navigation** : Work / Services / About / Contact ; WhatsApp direct ; Google Maps.
- **Rare** : vendre des **lieux** (Paris, Sud, côte Ouest, Alpes) comme argument ; WordPress derrière un SOTD (la techno n'est pas le sujet) ; crédit agence explicite en footer.
- **Faible** : quatre projets seulement mis en avant ; formulaire classique.

### Letter to Memphis — https://www.lettertomemphis.com/ (Lyon + Paris)
- **Type** : agence corporate documentaire (droit, artisanat, arts, patrimoine), fondée 2010 par un ex-avocat.
- **Accueil** : slogan martelé « Nous filmons ceux qui font. Nous racontons ce qui les anime. » ; trois études de cas avec lecteurs vidéo (Renault électrification, portrait de luthier, botterie) ; Webflow.
- **Navigation** : Accueil / L'agence / Guide / Contact.
- **Rare** : « absence de portfolio complet (stratégie intentionnelle ?) » — trois films, pas cinquante ; page « Guide ».
- **Faible** : « Aucun nom de client spécifique, seulement des logos non identifiables ».

### EO Be Creative — https://www.eoprod.com/ (Lyon + Paris)
- **Type** : agence vidéo B2B « premium », studio 400 m², 10 salariés, ~200 productions/an.
- **Accueil** : « Nous structurons l'image des entreprises ambitieuses » ; 8 vidéos Vimeo + études de cas ; carrousel secteurs (12) ; FAQ 10 questions / 900+ mots ; Google Avis + Trustfolio ; WordPress.
- **Navigation** : Vidéo IA / Vidéo d'entreprise / Portfolio / Secteurs / Production audiovisuelle / Contact ; deux numéros directs en entête.
- **Rare** : « Vidéo IA » comme expertise à part entière ; vocabulaire « dispositif, narration, direction artistique ».
- **Faible** : « Demander un devis » ×3, aucun prix.

### Teazit — https://teazit.com/ (Lyon + Paris)
- **Type** : agence vidéo + événementiel hybride, studios clé en main, label RSE Beevent.
- **Accueil** : « Agence vidéo & événementielle qui transforme vos idées en expériences engageantes » ; « 9,9/10 sur 79 avis » ; logos Hermès, Dior, Guerlain, SNCF.
- **Navigation** : 4 « solutions » avec méga-menus, studios, ressources, contact, newsletter.
- **Rare** : Livebooth (studio compact autonome), plateforme live maison ; formules « essentielle / standard / premium » nommées sans prix.
- **Faible** : « Aucune vidéo embarquée visible — images SVG/placeholder uniquement ».

### Autres Paris (documentés mais moins pertinents)
- **Awa Studio** — https://www.awastudio.fr/ : agence corporate 4 villes, « design template Wix classique », « texte dense, parfois verbeux », marque blanche pour agences, guides gratuits ; 659 projets, 15 ans.
- **Master Films** — https://www.masterfilms.fr/ (Toulouse + Paris) : 30 ans, « 3 020+ films », « 1 600+ nuits blanches », 25+ trophées listés, AR/VR/LED ; Vimeo intégré.
- **Pointe Noire** — https://www.pointe-noire.com/ : agence événementiel + vidéo (AXA, Microsoft, Moët Hennessy), lien « Barème d'honoraires » (rare, mais contenu non fourni), « design conventionnel ».
- **Ma Vidéo Corporate** — voir section Bordeaux (Paris & Bordeaux).

---

## Bordeaux et région — vidéastes et agences vidéo

### Lucas Sajot — https://lucassajot.com/ + /videaste-bordeaux-lucas-sajot/
- **Type** : réalisateur indépendant, positionnement haut de gamme (institutions, hôtellerie 5★, vin/gastronomie, événementiel). Le plus proche concurrent de Mauvais Grain.
- **Accueil** : galerie par secteur (Institutions, Hôtellerie, Marques, Événementiel) ; texte « Tout commence par la lumière. Un cadre pensé, une narration construite », « des films qui donnent une autre échelle à vos projets » ; sur la page SEO : « Des films pensés, pas seulement tournés ».
- **Navigation** : À propos / Vidéos / Photos / Contact + page pilier « vidéaste Bordeaux » listant Euratlantique, centre historique, Médoc, Saint-Émilion, Arcachon, Lyon, Paris.
- **Promesses** : « Réponse sous 6 h » sur devis, « production sans intermédiaire », « suivi client en temps réel sur Frame.io », livrables multi-formats, process en 4 étapes. Google 4,9/5 sur 46 avis. Références : Armée de Terre, ONU, WEF, L'Oréal, Red Bull, Tour de France, Accor MGallery, Carlsberg, Eiffage, La Folie Douce.
- **Tarifs** : page d'accueil sans prix ; la page SEO est décrite « tarification transparente » (montants non extraits).
- **Rare** : Frame.io comme argument de vente client ; « la lumière » comme thèse.
- **Faible** : WordPress ; sur l'accueil « absence de vidéos intégrées visibles », galerie d'images statiques ; le ton poétique cohabite avec une page SEO très classique.

### Quentin Berguet — https://quentin-berguet.fr/
- **Type** : vidéaste & réalisateur généraliste B2B/B2C (corporate, immobilier, pub, mariage).
- **Accueil** : trois entrées « Pour les entreprises » (7 services), « Pour les particuliers » (3), « Expertises » (6) ; phrases « productions vidéo à forte valeur ajoutée », « contenus visuels uniques et impactants » ; badges « +200 projets réalisés », « 5/5 avis Google », « Réponse sous 24h ouvrées ».
- **Navigation** : Réalisations par format (vidéo / photo / VFX & 3D), FAQ, process 4 étapes (Kick-off, Pré-prod, Prod, Post-prod).
- **Promesses/tarifs** : « Combien coûte une vidéo ? Le tarif dépend de plusieurs facteurs… » → devis. Références Mars Wrigley, ASPTT x MOOVA, Musée Henri Martin. TrustIndex.
- **Rare** : VFX & 3D affichés comme catégorie de portfolio.
- **Faible** : WordPress + Elementor visible dans les URLs ; mariage et corporate sur le même site.

### Gautier V. Films — https://gautierv.fr/
- **Type** : vidéaste freelance « pour tous » depuis 2009, télépilote drone (ED9942), 300+ clients.
- **Accueil** : « Depuis plus de 15 ans, Gautier V. Films – vidéaste donne vie à tous vos projets audiovisuels » ; sections en impératifs « Déployez-vous ! », « Révélez-vous ! », « Transportez-vous ! » ; galerie de logos anonymes.
- **Navigation** : Institutionnel / Mariage / Arts du Spectacle (Danse, Musique, Théâtre) / Contact / À propos / Blog ; footer avec SIRET, TVA, n° exploitant drone.
- **Promesses/tarifs** : **« dès 450 € HT »** pour une vidéo d'entreprise (seul prix d'entrée public du panel) ; interlocuteur unique, délais, « rapport qualité-prix optimal », SAV, montage express 24h, voix-off FR/EN/DE/IT, sous-titres gratuits, certification DaVinci Resolve, studio fond vert.
- **Rare** : le catalogue de garanties (SAV, 24h, sous-titres offerts) façon artisan.
- **Faible** : « Design template adapté mais pas sur-mesure », portfolio renvoyé vers Vimeo, aucune vidéo sur l'accueil ; positionnement bas de gamme assumé par le prix.

### Kevin Cogan — https://kevincogan.fr/
- **Type** : vidéaste indépendant généraliste (7 ans), 7 services dont mariage, immobilier, « châteaux/restaurants », documentaire.
- **Accueil** : « Je réalise des productions audiovisuelles depuis plus de 7 ans », listes à puces avec emojis (📋✍️🎯) ; 4 avis Google nominatifs.
- **Navigation** : Accueil / Mes services (7) / À propos / Galerie photo / Contact.
- **Promesses/tarifs** : aucun prix, bouton « Obtenir un devis » ; argument matériel (« Canon C50, R5C, tournage 8K RAW »), FAQ.
- **Rare** : une page dédiée « châteaux / restaurants » (cible régionale explicite).
- **Faible** : « images placeholder SVG », « finition semi-professionnelle », « pas d'intégration vidéo visible » ; WordPress template.

### Alexandre Garçon — https://www.alexandregarcon.com/
- **Type** : réalisateur-cadreur-monteur freelance, ton auteur (« film immersif et poétique »).
- **Accueil** : « réalisateur, cadreur et monteur vidéo sur bordeaux, je vous accompagne sur la production complète de votre film avec un seul axe de création : valoriser votre projet grâce à un film immersif et poétique » ; minuscules, italiques ; miniatures statiques.
- **Navigation** : work / about / contact / makers* ; menu burger ; **panier (0 article)** Squarespace resté visible.
- **Promesses** : couverture complète, immersion, poésie. Clients : Saint Dalfour, Respire, CIC Sud-Ouest, MAIF, TBM Keolis, Sepanso.
- **Rare** : « makers* », série documentaire personnelle intégrée au site — le seul du panel avec un projet d'auteur en vitrine.
- **Faible** : Squarespace (`images.squarespace-cdn.com`), panier e-commerce parasite, aucune vidéo sur l'accueil, aucun prix.

### Manza Studio — https://www.manza-studio.com/ (Bordeaux + Paris)
- **Type** : agence photo + vidéo, 7 ans, ~100 clients, 54 avis 5★ ; location studio photo & podcast.
- **Accueil** : « Racontez votre histoire à travers des photos et des vidéos impactantes ! », « Passez votre contenu au niveau supérieur ! », « plus qu'une agence audiovisuelle » ; vignettes avec bouton lecture (Sensus, FFC, ES Camper, Apologie) ; logos BackMarket, L'Oréal, Pullman, Nissan, Tissot.
- **Navigation** : Accueil / L'Agence / Réalisations + verticales Entreprises, Immobilier, Événementiel, Produits, Culinaire + location + blog.
- **Rare** : Webflow « entièrement personnalisé avec animations » — le seul site local décrit comme sur-mesure ; équipe nommée (Louis, Jean-Baptiste).
- **Faible** : ton exclamatif marketing ; aucun prix.

### Grenouilles Productions — https://www.grenouilles-productions.com/
- **Type** : agence multi-sites (Bordeaux, Poitiers, Saint-Émilion, Toulouse, Nantes, Paris, Lima…), studio 150 m² fond vert.
- **Accueil** : liste de prestations « Films d'entreprises - Motion Design 2D/3D - Teasers - Événements - Captations - drone - Studio photo/vidéo - animation » ; CTA « demander un devis » ; 6 réseaux sociaux.
- **Navigation** : Portfolio / Qui sommes-nous (Histoire, Métiers, Valeurs, Équipe) / Documentaires / Agences / Studio / Blog / Boutique / Contact.
- **Rare** : une « Boutique » et une antenne à Saint-Émilion ; crédit « kawa-studio-signature ».
- **Faible** : « Aucune vidéo visible, pas de tarifs, pas de clients nommés, pas d'études de cas » ; message « centré sur l'exécution technique plutôt que sur la narration ».

### Quai des Lunes — https://www.quaideslunes.com/
- **Type** : agence historique (30 ans), spécialiste vin (Univitis, Maison Sichel, Château Angelus, Vignobles Dourthe).
- **Accueil** : « Le dieu de la vidéo, un cyclope sûrement, garde un œil sur nous depuis plus de 30 ans » ; promesse d'« immersion dans l'entreprise ».
- **Navigation** : Productions (Vidéos d'entreprise, Vidéo produit, Films d'animation, Drone et machinerie, Réseaux sociaux) / Réalisations / Contact / Actualités.
- **Rare** : traduction, doublage, sous-titrage listés ; « récompensées lors de festivals vidéo » ; le vin comme cœur de cible assumé.
- **Faible** : « Aucune vidéo intégrée », « template structuré (présentation statique) », aucun prix.

### Fygostudio — https://www.fygostudio.com/ (Bordeaux + Paris)
- **Type** : duo (Marc Churin, Gwendoline Vergnaud), films publicitaires « poétiques », prise de vue + animation ; luxe (Longchamp, Dior, LVMH, Vacheron Constantin) + culture bordelaise (Opéra, Cité du Vin).
- **Accueil** : « Fygostudio, la société de production audiovisuelle qui émerveille », « nous aimons concevoir des univers oniriques, insuffler du charme, du mystère aux projets » ; extraits en GIF animés.
- **Navigation** : Réalisations / À propos / Contact (le plus court du panel local).
- **Rare** : caméra Sony Burano citée ; Club des DA 2025 ; « fantasmagorie » comme mot d'ordre ; finition « remarquable » sur WordPress.
- **Faible** : portfolio en GIF, pas de vidéo lisible ; aucun prix.

### Studio Tonelli (SAVI) — https://savi-photographe-bordeaux.com/videaste-bordeaux/
- **Type** : photographe devenu vidéaste (10+ ans photo), reportage corporate « sans mise en scène artificielle », « exigence documentaire ».
- **Accueil** : page SEO « vidéaste Bordeaux » avec 3 études de cas (maroquinerie, centrale électrique en Mauritanie, vélos électriques), FAQ.
- **Promesses/tarifs** : « une seule journée d'immobilisation pour vos équipes, deux livrables » (photo + vidéo) ; devis détaillé sous 48 h ; budget selon « durée du tournage, nombre de lieux, ampleur du montage » ; livraison « 16:9 pour votre site et YouTube, vertical 9:16 pour les réseaux ».
- **Rare** : argument temps client (« une journée, deux livrables ») ; cas d'étude industriels détaillés.
- **Faible** : URL et marque orientées photo ; pas de vidéo intégrée décrite.

### HDAS Records — https://www.hdasrecords.com/
- **Type** : duo photo + vidéo, mariage d'abord, corporate ensuite ; « 5.0 sur Google (plus de 100 avis) », Awards Mariages.net 2025-2026.
- **Accueil** : « une approche naturelle, exigeante et authentique », « Des rencontres, des projets, et surtout de belles histoires partagées » ; galeries ; témoignages nominatifs.
- **Navigation** : mariage / reportages / professionnels / contact ; FAQ.
- **Rare** : « coffret » physique livré ; « réserver en moyenne 1 an à l'avance » (rareté affichée).
- **Faible** : corporate secondaire ; aucun prix ; pas de fiche technique.

### Libellule Productions — https://libelluleproductions.fr/ (Bordeaux + Paris)
- **Type** : agence dirigée par Émilie Letellier, 49 avis 5★ ; films, motion, photo, podcasts, visites virtuelles, live.
- **Accueil** : « Votre communication prend son envol », « notre équipe livre de beaux projets avec le sourire », « Réalisés dans la bonne humeur » ; 30+ logos (Aéroport Bordeaux, CHU Bordeaux, Mercure, Manpower, APHP) ; palette rose/orange/blanc.
- **Navigation** : accueil / agence / productions / blog / contact ; FAQ 7 questions ; charte RSE 2025 (ISO 26000) téléchargeable ; adresse Loft Coworking rue Fondaudège.
- **Promesses/tarifs** : « Ça dépend ! Et c'est sûrement la question qu'on nous pose le plus souvent » → devis.
- **Rare** : charte RSE en PDF ; finition WordPress « remarquable » (animations CSS, traits graphiques).
- **Faible** : pas de vidéo sur l'accueil ; ton « bonne humeur » interchangeable.

### Peech Studio — https://peechstudio.com/agence-video-bordeaux/
- **Type** : groupe national (Peech Newic, 12 villes) avec page locale Bordeaux ; « depuis 2014 », « plus de 3000 vidéos », 500 clients.
- **Accueil** : menu sticky « Planifier un appel » ; en-tête « On s'appelle 15 min ▶ Showreel » ; « Un studio interne, pas de sous-traitance locale » ; 6 vignettes YouTube ; Crédit Agricole Immobilier, ADEME, Amorino, Action Contre la Faim.
- **Navigation** : Agence / Services / Expertise / Références / Blog ; FAQ délais/coûts ; contacts nommés (Malik, Rodolphe).
- **Promesses/tarifs** : « Le budget d'une production vidéo varie considérablement selon la complexité du projet » — pas de chiffre.
- **Rare** : CTA « appel 15 min » plutôt que « devis » ; personnes nommées avec prénom.
- **Faible** : page SEO dupliquée par ville ; aucun tournage bordelais démontré.

### Biux — https://www.biux.fr/agence-video-bordeaux/
- **Type** : agence B2B « 100 % spécialisée vidéo » (siège hors Bordeaux), page locale très travaillée.
- **Accueil** : H1 « Agence vidéo et production audiovisuelle à Bordeaux » ; H2 « Pourquoi Bordeaux exige une production vidéo… », « Quels types de vidéos Biux réalise-t-il à Bordeaux ? » ; embed Vimeo AWS × Reply ; formulaire multi-étapes ; Calendly.
- **Promesses/tarifs** : **fourchettes publiques** — film corporate 3 000–12 000 € HT, témoignage client 1 500–5 000 € HT, marque employeur 2 500–8 000 € HT, motion design 2D 2 500–6 000 € HT ; « 15 jours sans compromis » après storyboard, devis 24h, déplacement inclus, « Plus de 200 entreprises accompagnées ».
- **SEO local** : secteurs vitivinicole (« 60 000 emplois », « 200 entreprises de négoce »), Aéroparc Mérignac (« 12 700 salariés »), French Tech ; quartiers Bassins à flot, Darwin, Bègles, Saint-Médard.
- **Rare** : grille de prix par format ; page locale qui cite des chiffres économiques de la métropole.
- **Faible** : « Aucun client local spécifique nommé » ; WordPress (thème « biux-2026 ») ; pas de vidéo autoplay.

### Storystellar — https://storystellar.com/ + /agences-video-bordeaux/
- **Type** : agence francilienne (Saint-Germain Boucles de Seine, « pépite du territoire ») qui publie un « Top 10 agences vidéo Bordeaux » où elle se classe n°1 (195 avis).
- **Accueil** : « L'agence vidéo qui vous propulse », « Nous sommes des réalisateurs expérimentés en TV, réseaux sociaux et cinéma… Et avec le sourire. » ; « plus de 1035 vidéos » ; clients Toulouse Métropole, La Poste, Schneider, Bpifrance.
- **Navigation** : Publicité / Studio créatif / RH / Industrie / L'agence / Contact.
- **Rare** : le classement-comparatif comme page d'atterrissage locale (cite Libellule 49 avis, Fygostudio 40, BVideo 2, Manza 54, Rasterpoint 3, DUNE, Authentic).
- **Faible** : « Template WordPress professionnel… sans éléments graphiques particulièrement distinctifs » ; aucun prix.

### BVidéo Studio — https://www.bvideostudio.com/
- **Type** : agence de Clément Bernagaud (sport, nature, drone), L'Occitane, Betclic, Vins de Bordeaux, Université de Bordeaux, ENGIE.
- **Accueil** : « Un simple regard pour tout se dire », « ressentir le moment en capturant l'instant », « Marquez les esprits en partageant votre film » ; Slider Revolution ; feed Instagram.
- **Navigation** : L'agence / Nos vidéos / Entreprise / Événement / Actualités / Contact ; téléphone direct 06….
- **Rare** : récit de reconversion du fondateur ; Instagram personnel comme prolongement.
- **Faible** : WordPress + Slider Revolution ; aucun prix.

### Xaleo — https://xaleo.fr/agence-video-bordeaux/
- **Type** : agence de Léo Meslet, « agence réalisation vidéo à Bordeaux et dans tout le sud-ouest », 16+ communes citées.
- **Accueil** : « Faites appel à notre équipe pour réaliser votre tournage vidéo dans le sud-ouest » ; promesse « stratégie marketing complète » ; 11 services de l'e-learning au clip.
- **Promesses/tarifs** : brief → devis → adaptation budgétaire ; aucun client nommé.
- **Rare** : rien de notable au-delà de la liste géographique.
- **Faible** : « template standard pour agence vidéo », aucune vidéo, aucun client.

### IJICOM — https://ijicom.fr/agence-video/agence-video-bordeaux.html
- **Type** : agence multi-régionale (Bordeaux, Toulouse, Montpellier), « haut de gamme ».
- **Accueil** : « Une agence vidéo ancrée à Bordeaux, pensée pour les marques qui veulent marquer », « IJICOM transforme vos messages en contenus visuels distinctifs et mémorables » ; 6 pôles ; logos BMW, Crédit Agricole, M6, Perrier, RedBull, Tomorrowland.
- **Navigation** : Accueil / Portfolio / Services / Territoire / Contact.
- **Rare** : rubrique « Territoire » ; « pas de boîte aux lettres » (interlocuteur dédié) ; drones DGAC.
- **Faible** : « Aucune vidéo intégrée », portfolio externe, devis gratuit systématique, URL en `.html`.

### JumpStart Studio — https://www.jumpstartstudio.fr/services/agence-production-audiovisuelle-bordeaux
- **Type** : agence lyonnaise avec page Bordeaux ; Webflow ; FFT, LNH, Matmut, Viatris, WorldSkills.
- **Accueil** : « Une agence vidéo à Bordeaux orientée objectifs et diffusion » ; contre les « vidéos génériques » ; process Brief → Storyboard → Montage → Diffusion.
- **Promesses/tarifs** : « Le budget dépend de l'écriture, du nombre de lieux, des intervenants », « fourchettes larges » affinées au cadrage.
- **Rare** : explique honnêtement que la prépa se fait à distance et « concentre la présence sur site où elle apporte de la valeur » ; pense multi-formats dès le tournage (clips LinkedIn, verticaux, sous-titres).
- **Faible** : « fonctionnel mais pas visuellement exceptionnel » ; pas de vidéo démontrée.

### Ma Vidéo Corporate — https://www.mavideocorporate.com/ (Paris & Bordeaux, depuis 2012)
- **Type** : agence corporate nationale, 11 villes, navigation par objectifs (Notoriété, Vente, Marque employeur, Réseaux sociaux) et 15 secteurs.
- **Accueil** : « Votre visibilité et vos ventes vont faire des bonds », « Des vidéos qui font WOuaaaaaah », « C'est le syndrome de la page blanche total ? » ; 9 projets, YouTube ; 6 témoignages photo 5★ ; Webflow, images .avif.
- **Promesses/tarifs** : « Tarifs transparents », « Pas de mauvaise surprise » — mais **« Simulateur de tarif » (Tally) externe, aucun montant sur le site** ; « Devis en 24h » ; ateliers de co-écriture ; accompagnement diffusion.
- **Rare** : simulateur de prix ; navigation par objectif business.
- **Faible** : ton « WOuaaaaaah » ; promesse de transparence non tenue sur la page.

### Autres locaux (mentions)
- **Akili Pictures** — https://www.akilipictures.com/ (Poitiers / N-A) : « Appel stratégique offert », WordPress, Bouygues/Safran, aucune vidéo.
- **Rasterpoint** — https://www.rasterpoint.fr/ : « a cessé son activité en avril 2025 », site conservé en archive (60+ projets Vimeo, showreel).
- **McFly Prod** — https://www.mcflyprod.com/ : thème WordPress « Responsive Theme », aucun client, aucun texte, aucune ville — le plancher.
- **Flashback Production** — https://www.flashbackproduction.fr/ : injoignable (520 ×3) ; d'après les SERP : reportage, événementiel, pub, institutionnel, interview, portrait collaborateur, formation, produit, documentaire, clips, mariage.
- **Annuaire jesuisnumerique.fr** : 16 profils (Mathis Limousin, Histoire Vraie, CAPT'PAU-VIDEO, 24 Images prod, DANA drone…) — majorité de micro-freelances sans site notable.
- **Cités par les SERP sans fetch** : Cliple (article « boîte de production à Bordeaux » daté 24/02/2026), i.Mage Prod, DUNE Vidéo (Landes), Authentic (Paris/Bordeaux).

---

## Conventions

### Paris (maisons de production)
1. **Le roster comme colonne vertébrale** : Iconoclast, Solab, Frenzy, Badass, La Pac, Wanda, Partizan, Division, Phantasm, Big — entrée « Directors/Talents » en premier, portfolio classé par auteur, titrage « MARQUE by Réalisateur ».
2. **Silence textuel** : aucun manifeste, aucune promesse, aucun prix, aucune FAQ ; le seul texte est souvent la balise title, l'organigramme ou le bandeau cookies. Le brut répète « aucun texte de positionnement » sur 8 fiches.
3. **Vidéo en plein cadre dès l'accueil** : grille de vidéos cliquables (Division), carrousel numéroté (Iconoclast), flux vertical 16:9 (Big), scroll horizontal (Wanda), split screen (Control), lecteur avec contrôles (Partizan, Bloom).
4. **Navigation à 3-4 mots** : Work / Directors / About / Contact, plus un sélecteur de pays pour les réseaux internationaux.
5. **Fond sombre, typo blanche, placeholders SVG lazy-load** (Quad, Frenzy, Big, Teazit).
6. **Un studio web signe les meilleurs** : Ensemble (Wanda 2021, Big 2022, Badass 2023, Paramour), Beaucoup. (Bloom 2025), LNR (Badass 2017), KOTA (Wow Tapes), RADCAT (Seventh). Stack derrière : WordPress headless, Sanity, Contentful, PixiJS — la techno n'est jamais le sujet.
7. **Fragilité aux robots** : la moitié des sites parisiens renvoient 5xx/525/DNS aux fetchs (Cloudflare, JS-only). Le corporate lyonnais/parisien (EO, Teazit, Letter to Memphis, Awa, Master Films) suit au contraire les conventions bordelaises : FAQ, logos, avis, process, devis.

### Bordeaux (vidéastes et agences)
1. **WordPress partout** (Sajot, Berguet/Elementor, Gautier, Cogan, Biux, Storystellar, Libellule, Fygo, BVideo/Slider Revolution, Rasterpoint, McFly, Akili) ; Webflow chez Manza, JumpStart, Ma Vidéo Corporate ; Squarespace chez Garçon.
2. **Page pilier SEO « vidéaste Bordeaux / agence vidéo Bordeaux »** avec liste de communes (Mérignac, Pessac, Arcachon, Médoc, Saint-Émilion ; Xaleo : 16 communes ; Biux : Darwin, Bassins à flot, Bègles) et H2 en questions.
3. **Menu par service** (film d'entreprise, événementiel, immobilier, motion, drone, réseaux sociaux, mariage) plutôt que par film ; 7 à 11 entrées.
4. **Preuves chiffrées** : avis Google (Sajot 4,9/46, Berguet 5/5, HDAS 5.0/100+, Manza 54, Storystellar 195, Teazit 9,9/79), compteurs (« +200 projets », « 3000 vidéos », « 1035 vidéos », « 300 clients »), années d'expérience.
5. **Devis comme seul CTA** ; « ça dépend » comme seule réponse tarifaire (Libellule, Berguet, Biux, Tonelli, JumpStart, Peech). Exceptions : Gautier « dès 450 € HT », Biux fourchettes par format.
6. **Process en 4-5 étapes** (Sajot, Berguet, Biux, JumpStart, Cogan) et **FAQ** (Berguet, Biux, Libellule, Peech, Tonelli, HDAS, Cogan).
7. **Logos de grandes marques nationales** en social proof, rarement des clients bordelais nommés (sauf Quai des Lunes : Angelus, Dourthe, Sichel ; Libellule : Aéroport, CHU ; BVideo : Vins de Bordeaux, Université).
8. **Vidéo absente ou déléguée** : « aucune vidéo intégrée visible » sur 12 fiches locales sur 20 ; portfolio renvoyé vers Vimeo/YouTube/Instagram.
9. **Ton** : soit poétique-vague (« Tout commence par la lumière », « univers oniriques », « Un simple regard pour tout se dire »), soit exclamatif-commercial (« Déployez-vous ! », « WOuaaaaaah », « niveau supérieur ! »).
10. **Matériel comme argument** (Canon C50/R5C 8K RAW, Sony Burano, DaVinci certifié, drone DGAC, ATEM).

---

## Gestes rares

1. **« My Collection / Expand View »** — La Pac (pac.fr) : le visiteur compose sa propre sélection de films ; pensé pour le producteur d'agence qui prépare un pitch.
2. **Split screen** — Control Films (fiche Awwwards) : deux films côte à côte dès l'accueil.
3. **Scroll horizontal + hover image** — Wanda (fiche Awwwards, site Ensemble).
4. **Galerie vidéo avec sélecteur au scroll + animations typographiques + palette bichrome bleu/rose** — Badass (Awwwards SOTD 2017, PixiJS).
5. **Vendre des lieux plutôt que des services** — Bloom (« Feel at home in Paris / Down South / on the West coast / In the Alps ») ; compteur « /35 work » ; WhatsApp direct.
6. **Rubrique « Likes »** — Wanda+ (wanda.net) et **« Culture »** — Frenzy : de la curation à côté du portfolio.
7. **« makers\* »** — Alexandre Garçon : une série documentaire personnelle logée dans le site commercial.
8. **Suivi client Frame.io affiché comme promesse** + « réponse sous 6 h » — Lucas Sajot.
9. **Fourchettes de prix par format** (3 000–12 000 € HT film corporate, etc.) sur une page locale — Biux Bordeaux ; « dès 450 € HT » — Gautier V ; « Simulateur de tarif » Tally — Ma Vidéo Corporate ; lien « Barème d'honoraires » — Pointe Noire.
10. **« Une seule journée d'immobilisation pour vos équipes, deux livrables »** — Studio Tonelli : l'argument est le temps du client, pas la caméra.
11. **Trois études de cas seulement, pas de portfolio exhaustif** — Letter to Memphis ; slogan répété jusqu'à la mémorisation.
12. **Charte RSE ISO 26000 téléchargeable** — Libellule ; label Beevent — Teazit ; page « Territoire » — IJICOM.
13. **« Appel stratégique offert » / « On s'appelle 15 min ▶ Showreel »** — Akili, Peech : remplacer « devis » par une conversation.
14. **Fermeture annoncée et site conservé comme archive** — Rasterpoint (« a cessé son activité en avril 2025 ») : 15 ans de projets restent consultables.

---

## Le niveau bordelais

- La concurrence locale est à 80 % du **WordPress à thème** (Elementor, Slider Revolution, « Responsive Theme ») ; trois Webflow (Manza, JumpStart, Ma Vidéo Corporate) et un Squarespace avec panier oublié (Garçon). Aucun site local n'est décrit comme « sur-mesure » hormis Manza ; le brut qualifie Fygo, Libellule, Peech, Biux, IJICOM de finition « remarquable » — c'est-à-dire un WordPress propre.
- **Personne ne montre de film sur l'accueil** : 12 fiches locales sur 20 mentionnent l'absence de vidéo intégrée ; le portfolio est un lien Vimeo/YouTube ou des GIF (Fygo) ou des images statiques (Sajot, Garçon, Quai des Lunes, Grenouilles).
- L'architecture est celle d'un **catalogue de prestations** : 7 à 11 services en menu, mariage et corporate mélangés (Berguet, Gautier, Cogan, HDAS), listes de communes à des fins SEO, H2 en forme de questions.
- L'argumentaire tourne sur cinq briques interchangeables : avis Google, compteur de projets, années d'expérience, process en 4 étapes, FAQ « combien ça coûte → ça dépend ».
- Les **prix** sont tabous sauf aux deux extrêmes : entrée de gamme (Gautier 450 € HT) et agence nationale en conquête (Biux 3 000–12 000 € HT). Le milieu premium local (Sajot, Fygo, Manza, Quai des Lunes) ne dit rien.
- La cible **vin / châteaux / hôtellerie / tourisme** est revendiquée par Sajot, Quai des Lunes, Cogan (« châteaux/restaurants »), IJICOM, Biux (chiffres de la filière) — mais aucun n'a construit son site autour de ce territoire ; c'est une page ou une ligne de menu.
- Le ton oscille entre poésie de brochure et exclamation marketing ; aucun site local ne parle à la première personne d'un point de vue de réalisateur (Garçon s'en approche avec « makers* »).
- Les agences nationales (Peech, Biux, Storystellar, JumpStart, Ma Vidéo Corporate) occupent le SEO « agence vidéo Bordeaux » avec des pages locales dupliquées ; Storystellar va jusqu'à publier le « Top 10 » où elle se classe première. Le premier écran Google local est donc tenu par des gens qui ne tournent pas à Bordeaux.
- Conséquence : à Bordeaux, la barre pour être hors catégorie est basse en design (un vrai site plein écran, vidéo qui joue, typo travaillée, sans menu-catalogue suffirait à sortir du lot) mais haute en **preuve** (les concurrents ont 46 à 195 avis Google et des logos L'Oréal/Red Bull/Dior). Le site doit donc battre les locaux sur la forme parisienne et ne pas céder sur la crédibilité.
- Le meilleur concurrent direct reste Lucas Sajot : même cible (institutions, hôtellerie, vin, événementiel), mêmes promesses de réalisateur seul, Frame.io, 4,9/46, ton « films pensés, pas seulement tournés » — mais un WordPress sans film sur l'accueil.

---

## Trous

1. **Un accueil parisien avec un contenu bordelais** : personne à Bordeaux n'a la mécanique des maisons de production (vidéo plein cadre au chargement, navigation à 3 mots, silence textuel) ; personne à Paris ne l'applique au corporate/tourisme régional. Un réalisateur seul peut faire les deux.
2. **Le film comme unité de navigation** : à Bordeaux tout est classé par prestation (« film d'entreprise », « immobilier ») ; classer par film, avec le client, le lieu (château, quartier, Bassin) et le format livré, n'existe pas localement.
3. **Le territoire comme structure, pas comme mot-clé** : Bloom vend « Down South / West coast / Alps » ; aucun Bordelais ne vend Médoc / Saint-Émilion / Bassin d'Arcachon / Bordeaux Euratlantique comme des décors qu'il connaît, avec films à l'appui. Les listes de communes servent le SEO, jamais le récit.
4. **La transparence de prix côté premium** : Biux publie des fourchettes depuis Paris ; Gautier affiche 450 €. Un réalisateur local haut de gamme qui écrit « un film de domaine, c'est entre X et Y, voilà ce que ça comprend » serait seul sur ce créneau (Ma Vidéo Corporate promet la transparence et ne la tient pas).
5. **La voix du réalisateur** : aucun site local ne dit « je » avec un point de vue sur l'image (Garçon est le seul à effleurer, Sajot théorise « la lumière » en tiers). Les maisons parisiennes mettent l'auteur avant la marque ; personne à Bordeaux ne se présente comme auteur.
6. **Le temps du client comme argument** (Tonelli : « une journée, deux livrables ») est sous-exploité ; un réalisateur seul peut promettre un tournage léger, une seule personne sur site, et le prouver par le making-of.
7. **Les études de cas courtes façon Letter to Memphis** (trois films racontés, pas cinquante vignettes) : aucun site bordelais ne raconte un film (brief → contrainte → choix → résultat) ; tous empilent des logos.
8. **Le suivi en cours de projet montré, pas seulement promis** : Sajot cite Frame.io ; personne ne montre à quoi ressemble la relation (étapes datées, exemple de retour de V1) — Henry de Czar l'électricien (J0, J+2, J+7, J+30) le fait mieux que tous les vidéastes du panel.
9. **Le clip / musique** : les maisons parisiennes mêlent pub et clips pour la légitimité créative (Partizan, Badass, Frenzy) ; à Bordeaux le clip est une ligne de menu chez Xaleo et Flashback, jamais un argument de prestige.
10. **Un site qui répond aux robots** : la moitié des sites parisiens sont invisibles aux crawlers (5xx) ; un site plein écran mais indexable, rapide et accessible aux fetchs IA est un avantage concret en 2026 pour un indépendant.

---

## À capturer

```
division|http://us.division.global/
lapac|https://pac.fr/
badass|https://www.badassfilms.tv/
bloom|https://www.bloomparis.tv/
sajot|https://lucassajot.com/
fygo|https://www.fygostudio.com/
manza|https://www.manza-studio.com/
biux-bordeaux|https://www.biux.fr/agence-video-bordeaux/
```

Remplaçants si une capture échoue : Paris → https://www.partizan.com/, https://prod.quad.fr/, https://www.frenzyparis.com/ ; Bordeaux → https://libelluleproductions.fr/, https://quentin-berguet.fr/, https://www.alexandregarcon.com/.
