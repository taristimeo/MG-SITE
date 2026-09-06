# Synthèse — veille « expérimental » (Codrops / Awwwards / FWA 2023-2026)

Source : `raw-experimental.md` (207 k car., ~60 fetchs/recherches) + 5 fetchs complémentaires (Partizan, Michael Gatt, RISK, Datamosh Codrops 09/2026, case study Igloo). Tout ce qui est marqué **[observé]** est cité du brut ; les extrapolations sont signalées **[extrapolation]**.

Contexte cible : site d'un réalisateur / studio de production vidéo (corporate, événementiel, immobilier, tourisme, clip) à Bordeaux. La matière première est de la vidéo tournée, étalonnée, montée — pas de la 3D.

---

## Mécaniques

### 1. Vidéo comme texture WebGL + grain/LED en shader
**Vu chez** Stefan Vitasović Portfolio 2025 — https://stefanvitasovic.dev/ (case study https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
**Ce que ça fait** Chaque vidéo est un plan WebGL ; un fragment shader ajoute « un overlay LED accompagné du grain de bruit sur chaque vidéo » — cohérence visuelle *et* « compression vidéo supérieure » (le grain masque les artefacts). Les transitions déplacent les vertices selon un motif de bruit. Vidéos 60 fps sur Cloudflare R2.
**Techno** Next.js + R3F/three.js, fragment shader, vidéo H.264 en `VideoTexture`.
**Coût** Moyen. Mobile : OK si une seule vidéo texturée à la fois (autoplay muet + playsinline).
**Transposable ?** Oui, directement : c'est LA façon d'afficher des rushes compressés fort sans que ça se voie — le grain devient signature.

### 2. Scrub vidéo au drag souris (encodage keyframes + fallback WebCodecs)
**Vu chez** KAI Design Dept. (mount inc.) — https://www.kai-group.com/global/design/ (case study https://tympanus.net/codrops/2025/11/20/behind-the-kai-design-dept-experience-webgl-line-blur-video-scrubbing-and-3d-animation/)
**Ce que ça fait** On glisse la souris, la vidéo avance/recule image par image (`video.currentTime = sec`). Pour que ce soit fluide : réencodage ffmpeg avec `-g 12` (un I-frame toutes les 12 images ; `-g 1` « n'était pas praticable » en poids), `-tune fastdecode`, `-movflags +faststart`. Sur Firefox, la lib **mediabunny** décode les frames via WebCodecs vers un canvas → texture three.js.
**Techno** HTML video + ffmpeg + WebCodecs/mediabunny + three.js.
**Coût** Moyen (pipeline d'encodage à maîtriser). Mobile : le seek fréquent est coûteux, prévoir une version courte (2-3 s) ou un sprite-sheet.
**Transposable ?** Oui — c'est le geste de monteur (jog/shuttle) transposé au visiteur.

### 3. Scroll-driven video scrubbing (« scroll to scrub »)
**Vu chez** Awwwards Maker « Scroll-based Video Scrubbing » — https://www.awwwards.com/inspiration/scroll-based-video-scrubbing-maker ; Kubeez scroll-world-video (« scroll doesn't move a page here — it drives a camera, with each scene mapped to a video's current time position ») — https://github.com/KubeezMedia/kubeez-scroll-world-video ; Kaito Note — https://www.awwwards.com/inspiration/scroll-scrub-animation-kaito-note-portfolio
**Ce que ça fait** La position de scroll pilote `currentTime` d'un plan pré-rendu : un plan-séquence devient la structure de la page, chaque section correspond à un timecode.
**Techno** GSAP ScrollTrigger scrub + vidéo à GOP court, ou séquence d'images.
**Coût** Facile à moyen. Mobile : seek saccadé sur iOS ; prévoir séquence JPEG/WebP ou canvas.
**Transposable ?** Oui : un plan-séquence drone (immobilier/tourisme) scrubbé au scroll, avec les infos du projet qui apparaissent aux timecodes.

### 4. Depth-of-field sur lignes (DoF 2 passes FBO)
**Vu chez** KAI Design Dept. (même case study)
**Ce que ça fait** Rendu net → rendu élargi encodant le flou dans les canaux RGB (G = zone floue, R = intensité) → blur gaussien planaire vertical/horizontal, avec gestion avant/arrière des intersections. Évite « le cœur net sous des couches de flou empilées » typique du DoF web.
**Techno** three.js, FBO multi-passes, GLSL.
**Coût** Lourd (post-process plein écran). Mobile : à désactiver ou basse résolution.
**Transposable ?** Partiellement : la technique de flou par profondeur sert le « rack focus » (voir section 2).

### 5. Depth map → parallaxe UV + balayage (« scanning effect »)
**Vu chez** WebGPU Scanning Effect with Depth Maps (deadrabbbbit) — démo https://tympanus.net/Development/ScanEffect, code https://github.com/d3adrabbit/ScanningEffectWithDepthMap, article https://tympanus.net/codrops/2025/03/31/webgpu-scanning-effect-with-depth-maps/
**Ce que ça fait** Une image + sa depth map : « la profondeur introduit une légère distorsion dans les coordonnées UV, créant un effet de parallaxe ». Un `uProgress` animé compare la profondeur → `flow = 1 - smoothstep(0, 0.02, |depth - uProgress|)` : une tranche de profondeur s'allume et balaye l'image d'avant en arrière. Pointeur transmis au shader en continu.
**Techno** three.js WebGPURenderer + TSL, R3F, GSAP.
**Coût** Moyen (shader simple ; WebGPU : Safari 26+, Chrome, Firefox desktop selon le brut). Mobile : fallback WebGL nécessaire.
**Transposable ?** Oui : depth map d'une photo de plateau ou d'un frame clé → le visiteur « pointe » dans la profondeur du plan.

### 6. Portrait 2D + depth map → nuage de particules 3D
**Vu chez** Phantom.land — https://phantom.land/ (case study https://tympanus.net/codrops/2025/06/30/invisible-forces-the-making-of-phantom-lands-interactive-grid-and-3d-face-particle-system/)
**Ce que ça fait** Visage scanné (RealityScan iPhone), rendu C4D en « position pass » (depth) + « color pass », exporté en WebP 256×256 < 15 KB. Grille 280×280 ≈ 78 400 particules ; Z lu dans la depth map, taille des particules proportionnelle à la luminosité/couleur (« yeux, lèvres, joues éclairées → particules plus grosses »). Curl noise pour les transitions.
**Techno** R3F, GLSL, GSAP, points instanciés.
**Coût** Moyen (assets minuscules, GPU-bound raisonnable). Mobile : réduire la grille (140×140).
**Transposable ?** Oui — portrait du réalisateur, ou frames d'un film avec depth map IA. Le brut lui-même note que pour la *vidéo* il faudrait « des depth maps synchronisées image par image ».

### 7. Grille draggable avec inertie, dézoom au drag, distorsion barrel + vignette
**Vu chez** Phantom.land (même case study)
**Ce que ça fait** Offset ambiant inversé sous le curseur (espace UV normalisé) ; « quand la grille est draggée, un zoom-out se produit et la caméra semble s'éloigner » (GSAP ease custom) ; inertie après relâchement (lerp 0.1) ; post-process barrel distortion qui s'intensifie pendant les transitions + vignettage.
**Techno** R3F + shader post-process.
**Coût** Moyen. Mobile : drag tactile OK, désactiver la distorsion.
**Transposable ?** Oui : la grille de projets comme table de montage qu'on pousse du doigt.

### 8. Pixel-to-voxel video drop (vidéo → cubes → physique)
**Vu chez** Codrops, Junichi Kasahara — https://tympanus.net/codrops/2026/01/05/how-to-create-a-pixel-to-voxel-video-drop-effect-with-three-js-and-rapier/
**Ce que ça fait** Chaque pixel vidéo = un `BoxGeometry` aplati (profondeur 0,05) ; un ripple (mode « organic » bruité ou « smooth » sinusoïdal) extrude les tuiles en cubes ; quand un cube est complet « le corps rigide correspondant se réveille » (Rapier), reçoit une vélocité aléatoire et tombe. On peut saisir les voxels (Raycaster) ; « BACK TO PLANE » ré-interpole.
**Techno** three.js instancing + Rapier (physique CPU).
**Coût** Lourd : « très gourmand en CPU », « limité à quelques milliers de cubes ». Mobile : non.
**Transposable ?** Oui mais en moment unique (fin de showreel, 404), pas en navigation.

### 9. Projection vidéo sur grille de cubes avec masques
**Vu chez** Codrops, Victor Work — https://tympanus.net/codrops/2025/08/28/interactive-video-projection-mapping-with-three-js/
**Ce que ça fait** « Map video textures onto 3D grids of cubes with masks, motion, and interactivity » : la vidéo est projetée sur un relief de cubes qui bougent, des masques révèlent/cachent des zones, la souris perturbe la grille.
**Techno** three.js, VideoTexture, instancing.
**Coût** Moyen. Mobile : OK à grille réduite.
**Transposable ?** Oui : hero où le showreel est projeté sur un relief (mur LED, façade) qui réagit au curseur.

### 10. Datamosh temps réel comme transition
**Vu chez** Codrops, Niccolò Fanton — démo https://tympanus.net/Tutorials/Datamosh/, code https://github.com/niccolofanton/data-mosh/, article https://tympanus.net/codrops/2026/09/02/breaking-the-frame-building-a-real-time-datamosh-effect-with-three-js/
**Ce que ça fait** Simule un décodeur vidéo qui perd son I-frame : « new frame = warp(previous frame, motion vectors) + residual ». Passe de vélocité écran, feedback buffer ping-pong qui garde « la dernière sortie reconstruite du décodeur, pas la sortie courante du moteur », changement de scène *après* le render pour créer le mismatch. Blockiness via 1 vecteur par tuile 8×8, quantification, skip threshold, masque de « secteurs perdus ». Déclenché au pointeur/espace/touch, récupération ~370 ms.
**Techno** three.js, EffectComposer, GLSL.
**Coût** Lourd pendant l'interaction (« deux rendus géométriques + quatre passes plein écran »), léger au repos. Mobile : risqué.
**Transposable ?** Oui — et c'est le seul effet « glitch » qui parle vraiment le langage du codec vidéo ; parfait entre deux films.

### 11. Rendus ASCII / dithering / halftone temps réel
**Vu chez** Efecto — https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/ ; Shape-aware ASCII — https://tympanus.net/codrops/2026/09/04/beyond-the-luminance-ramp-a-shape-aware-ascii-renderer-in-three-js/ ; Dithering Shader (N. Fanton) — https://tympanus.net/Development/DitheringShader/ ; 160 000 cubes dithering — https://tympanus.net/codrops/2026/04/01/animating-160000-cubes-in-three-js-to-visualize-dithering/
**Ce que ça fait** Un fragment shader convertit n'importe quelle texture (donc une vidéo) en glyphes ASCII (recherche de glyphe par forme sur GPU), en tramage 1-bit ou en points halftone.
**Techno** three.js + GLSL, une passe.
**Coût** Facile à moyen. Mobile : OK (une passe).
**Transposable ?** Oui : état de chargement / mode « basse bande passante » du showreel, ou hover sur vignettes.

### 12. Distorsion radiale + flou + RGB shift, « focus mode » vidéo à `playbackRate 0.6`
**Vu chez** 4WIDE (Tomoya Okada) — https://4wide.jp/ (case study https://tympanus.net/codrops/2026/04/23/building-4wide-turning-distortion-blur-and-motion-into-a-coherent-experience/)
**Ce que ça fait** UV recalculées avec `1.0 + u_strength * r * r` (émergence courbe des images, page About). Sur la showcase : parallaxe large `uv.y -= u_imageOffsetY` scrubbée au scroll ; la vidéo principale passe en « focus mode » avec distorsion accrue et lecture ralentie à 0,6. Blur post-process + RGB shift pour « profondeur ».
**Techno** Astro + Swup + three.js + GSAP, WordPress headless.
**Coût** Moyen. Mobile : le flou est « désactivé sur mobile », c'est « l'ajustement le plus efficace ».
**Transposable ?** Oui : le ralenti-au-focus est un geste très « réalisateur » (on entre dans le plan).

### 13. Long press révèle une vidéo (le lieu derrière l'œuvre)
**Vu chez** David Whyte Experience (Immersive Garden) — https://www.awwwards.com/case-study-david-whyte-experience-by-immersive-garden.html
**Ce que ça fait** « Long press on any painting reveals a video showing the actual location that inspired it. » En plus : simulation de fluide sous le curseur qui « active des animations d'aquarelle » (une simulation par feuille visible, atlas + stencil), révélation générative « gouttes d'eau » par bruit.
**Techno** Nuxt + three.js + shaders custom, Lenis, GSAP.
**Coût** Long press = facile ; fluid sim = lourd. Mobile : long press natif, fluid sim à couper.
**Transposable ?** Oui — le long press sur une image fixe qui révèle le rush / le making-of est exactement le rapport photogramme → film.

### 14. Infinite canvas + lecteur vidéo
**Vu chez** Skyline Films (Artistsweb) — https://www.awwwards.com/inspiration/infinite-canvas-navigation-skyline-films (site d'origine **mort** : skylinefilms.tv redirige en 301 vers tvsport24.net)
**Ce que ça fait** Les films sont posés sur une toile 2D infinie (canvas/WebGL) qu'on pan dans toutes les directions ; un clic ouvre le lecteur plein écran.
**Techno** Canvas/WebGL, drag.
**Coût** Moyen. Mobile : pan tactile OK mais découvrabilité faible.
**Transposable ?** Oui, avec prudence : bien pour 30+ films, moins pour 12.

### 15. Sélecteur de galerie vidéo au scroll (typographie = navigation)
**Vu chez** BADASS films (LNR) — https://badassfilms.tv/ (https://www.awwwards.com/inspiration/scroll-video-gallery-selector) ; we3studio « interactive header displaying showreel » — https://we3studio.pl/en/home
**Ce que ça fait** Le scroll fait défiler une liste typographique de titres ; la vidéo de fond change avec l'élément actif. (Détails techniques absents du brut ; tags « scroll, typography, unusual navigation, video ».)
**Techno** DOM + vidéos préchargées, éventuellement WebGL pour le fondu.
**Coût** Facile. Mobile : OK.
**Transposable ?** Oui — c'est la mécanique la plus économique pour un catalogue de 10-20 films.

### 16. Layout horizontal + infinite scroll + player, 404 en vidéo
**Vu chez** RISK (FLOT NOIR) — https://www.risk.film (SOTD 15/07/2026, tags « Horizontal Layout, Infinite Scroll, Transitions, Filters and Effects, WebGL, Webflow ») ; Wanda (Ensemble) — https://wanda.net (« horizontal scroll », player, hover)
**Ce que ça fait** Héro slider vidéo, section Works en bande horizontale infinie, filtres/effets WebGL sur les vignettes, page 404 elle-même vidéo.
**Techno** Webflow + WebGL léger.
**Coût** Facile à moyen. Mobile : horizontal → vertical automatiquement.
**Transposable ?** Oui, c'est le standard « société de prod » 2026 ; note : usabilité notée 6,82/10 par le jury.

### 17. Slider vertical plein écran infini dans les deux sens + loader cinématique + player Vimeo custom
**Vu chez** Bisous (Beaucoup) — https://bisous-production.com/ (case study https://tympanus.net/codrops/2026/06/29/inside-bisous-designing-an-editorial-experience-for-cinematic-cgi/)
**Ce que ça fait** Séquence de chargement avec « visuels soigneusement sélectionnés », slider vertical fullscreen « infini dans les deux directions », transitions continues entre projets, texte qui apparaît « lettre par lettre par opacités randomisées », structure en « quatre colonnes » comme dorsale. **Sans WebGL.**
**Techno** WordPress + GSAP + lecteur Vimeo custom.
**Coût** Facile. Mobile : excellent.
**Transposable ?** Oui — preuve qu'un site de prod « cinématique » tient sans WebGL.

### 18. Archive à grille flexible + transitions « invisibles » (Swup) + player Vimeo intégré
**Vu chez** Chems.Studio — https://www.chems.studio/ (case study https://tympanus.net/codrops/2026/08/08/designing-a-flexible-digital-archive-for-chems-studios-creative-practice/)
**Ce que ça fait** « Rather than designing a portfolio, I wanted to design an archive » : grille 3 colonnes qui bascule verticale/collection/horizontale sans changer de système ; films « fully integrated into the experience rather than treated as an external piece of content » ; « Nothing loops simply for decoration » ; typographie monospace.
**Techno** Webflow + Swup.js + Vimeo API.
**Coût** Facile. Mobile : excellent.
**Transposable ?** Oui — position « archive de réalisateur » plutôt que vitrine.

### 19. Scrubber à vignettes de scènes + UI invisible jusqu'au mouvement + palette qui change par film
**Vu chez** Önnu Jónu Son (Robbin Cenijn + Aristide Benoist, Ueno) — https://onnujonuson.com/ (https://www.dutchdigital.design/cases/onnu-jonu-son ; SOTD https://www.awwwards.com/sites/onnu-jonu-son)
**Ce que ça fait** « Un scrubber visuel non conventionnel affiche des vignettes de scènes plutôt qu'une barre standard » ; « l'UI demeure invisible jusqu'à un mouvement de souris (tactile sur mobile) » ; timeline horizontale des sorties mensuelles ; « les palettes de couleurs s'adaptent selon la vidéo musicale ». Fullscreen paysage *et* portrait.
**Techno** Vanilla WebGL/JS (Benoist), vidéo native.
**Coût** Moyen. Mobile : conçu pour (« parité desktop/mobile »).
**Transposable ?** Oui, fortement : le player devient chapitrage de plans, et le site prend la couleur de l'étalonnage du film en cours.

### 20. Vitesse de scroll → son ; une seule scène active ; desktop only
**Vu chez** The Spark (The Digital Panda) — https://spark.thedigitalpanda.com (case study https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/)
**Ce que ça fait** Le scroll pilote la caméra, mais c'est « la vitesse de défilement plutôt que sa position » qui déclenche les réactions sonores ; couches audio par altitude, bruits de train panoramiqués, pas amplifiés « selon l'agressivité du scroll ». Textures détaillées projetées sur géométrie simple + filtre CRT interlacé. UI qui s'humanise (panneaux rigides → arrondis) avec le récit.
**Techno** cables.gl + Webflow + GSAP, Web Audio.
**Coût** Lourd. « Volontairement limité aux écrans larges. »
**Transposable ?** Le principe son-par-vitesse : oui, facile et très cinéma (voir section 2).

### 21. Le scroll comme « prise de caméra unique » (GSAP Observer) + transitions tesseract / ink bleed
**Vu chez** Joseph Santamaria — https://joseph-san.com/ (https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/) ; Codrops « scroll-driven 3D gallery using a Blender camera path » — https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/
**Ce que ça fait** GSAP Observer unifie souris/tactile/trackpad ; la progression = mouvement de caméra le long d'un chemin exporté de Blender ; « une prise de caméra unique plutôt qu'une série de scrolls déconnectés ». Ouvrir un projet = « un tesseract qui se déplie ». Menu contact = shader « ink bleed » (papier brûlé). Passes atmosphériques rendues à basse résolution sur mobile.
**Techno** three.js, GSAP, KTX2/Basis, Draco, instancing, frustum culling.
**Coût** Lourd. Mobile : géré par render targets réduits.
**Transposable ?** Le vocabulaire « plan-séquence = page » oui ; la 3D lourde non nécessaire.

### 22. Transitions entre scènes par rendu différé (profondeur + normales) et 4 matériaux de transition
**Vu chez** The Monolith Project (Zajno) — https://themonolithproject.net/ (https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/)
**Ce que ça fait** « On dessine la scène A en différé avec profondeur et normales, puis la scène B », puis un matériau mélange : Mix (balayage/masque), Zoom (flou zoom), RadialPosition, Raymarched (sphère). Textures de mélange générées au runtime. Post : détection de contours, aberration chromatique, correction couleur. Particules « ping-pong ».
**Techno** R3F, three.js, G-buffer custom.
**Coût** Lourd. Mobile : non tel quel.
**Transposable ?** L'idée « transition guidée par la profondeur » oui, avec des depth maps vidéo au lieu d'un G-buffer 3D [extrapolation].

### 23. Flux vidéo live en texture 3D + échantillonnage des couleurs pour éclairer le monde
**Vu chez** Active Theory × Mux (Secret Sky) — https://www.mux.com/case-studies/active-theory
**Ce que ça fait** « Mux gives us the raw HLS stream that we can pipe in and actually access the video element » (pas d'iframe) ; ils « sample the colors out of the stream and light up the entire world with the colors from the performance » ; le stream est projeté « directement dans l'auditorium virtuel ».
**Techno** HLS.js + VideoTexture + readPixels/downsample pour la couleur.
**Coût** Moyen. Mobile : HLS natif iOS OK, texture vidéo OK.
**Transposable ?** Oui — sans le live : le film en cours teinte l'UI (voir section 2).

### 24. UI rendue en WebGL (texte SDF « scramble », glitchs), scènes reliées par aberration chromatique + « frost dissolve »
**Vu chez** Igloo Inc (abeto + Bureaux) — https://www.igloo.inc/ (https://www.awwwards.com/igloo-inc-case-study.html ; SOTY 2024)
**Ce que ça fait** Cristaux de glace procéduraux ; « chaque projet du portfolio dans son bloc de glace » ; la caméra dérive entre scènes avec « chromatic aberration, tech displacement and frost effect » ; le texte est rendu en WebGL pour faire des scrambles « en ajustant les offsets de texture SDF » sans reflow. KTX2, `prefers-reduced-motion`, LCP ≈ 1 s.
**Techno** three.js + three-mesh-bvh + Svelte + GSAP, Houdini/Blender.
**Coût** Lourd (mais optimisé). Accessibilité notée 6,60 et sémantique 6,40 par le jury.
**Transposable ?** Le « frost dissolve » entre deux films : oui [extrapolation vidéo]. L'UI 100 % WebGL : non pour un site de prod (SEO, a11y).

### 25. Curseur lampe torche / spotlight qui révèle
**Vu chez** Moooi Paper Play — https://www.awwwards.com/inspiration/moooi-paper-play-webgl-cursor-interaction ; Basis Agency ; « Mouse pointer spotlight » — https://www.awwwards.com/inspiration/mouse-pointer-spotlight
**Ce que ça fait** L'écran est assombri ; un disque suit le curseur et « illumine » la texture (ou révèle un contenu caché).
**Techno** CSS mask/radial-gradient ou shader avec `uPointer`.
**Coût** Facile. Mobile : le doigt remplace le curseur, mais cache ce qu'il révèle.
**Transposable ?** Oui, en particulier pour comparer deux versions d'une même image (voir section 2, before/after).

### 26. Listing réalisateurs à interaction souris, bascule Grid/List, loader et contact en shader
**Vu chez** Partizan (Beaucoup) — https://partizan.com/ (SOTD 26/07/2026 ; éléments Awwwards « Transition », « Loader – Shader », « Directors listing – Mouse Interaction », « View Grid – List », « Contact page – Shader »)
**Ce que ça fait** Le roster de réalisateurs réagit au survol (vignette/vidéo suit la souris), la galerie bascule entre grille et liste, le loader et la page contact sont des shaders plein écran. Monochrome noir/blanc.
**Techno** WebGL/three.js + GSAP.
**Coût** Moyen. Mobile : OK (listing → tap).
**Transposable ?** Oui — référence directe « société de production » 2026, la plus proche du cas Mauvais Grain.

### 27. Player-equalizer + about page « scroll-based storytelling »
**Vu chez** Michael Gatt (Synchronized Studio / Zhenya Rynzhuk) — https://michaelgatt.com (SOTD 18/08/2026)
**Ce que ça fait** Lecteur audio avec égaliseur visuel intégré aux projets, loader interactif, page About narrée au scroll.
**Techno** Nuxt + WebGL.
**Coût** Facile à moyen. Mobile : OK.
**Transposable ?** Oui : le player-equalizer = la piste son des films rendue visible.

### 28. Navigation « Turn the page » sur vidéo, mur d'images 3D, menu infini
**Vu chez** Edoardo Smerilli – Film Director (Niccolò Miranda, Clément Roche) — http://edoardosmerilli.com (SOTD 2020)
**Ce que ça fait** On tourne les pages comme un livre pour passer d'un film à l'autre ; images affichées sur un mur 3D WebGL ; menu à défilement infini. Layout horizontal.
**Techno** Nuxt + three.js + GSAP.
**Coût** Moyen. Mobile : swipe.
**Transposable ?** Oui — c'est un site de réalisateur, ancien mais toujours cité.

### 29. Géométrie audio-réactive pilotée par Web Audio + morphing au scroll
**Vu chez** Run Rob Run — https://tympanus.net/codrops/2026/08/20/run-rob-run-building-a-music-reactive-goo-with-three-js-and-webgpu/ ; Emmit Fenn (Active Theory) — https://prologue.emmitfenn.com/ (« 8 visuels WebGL, un par piste »)
**Ce que ça fait** Analyse FFT du son → déformation d'une « goo », damping, morphing au scroll. Emmit Fenn : un visuel interactif par morceau.
**Techno** Web Audio API + three.js/WebGPU.
**Coût** Moyen. Mobile : autoplay audio impossible sans geste.
**Transposable ?** Oui pour les clips : la bande-son fait bouger l'interface.

### 30. Techniques atmosphériques « légères » : transitions tourbillon, brouillard animé, contours de mesh
**Vu chez** The Sleepers (Thibaut Foussard) — https://tympanus.net/codrops/2026/07/10/the-sleepers-creating-an-atmospheric-webgl-experience-with-lightweight-techniques/ ; Iventions — iventions.com (« WebGL used for atmosphere instead of spectacle »)
**Ce que ça fait** « Obtenir l'impact visuel le plus fort avec les solutions les plus simples » : fog animé, outlines, monde infini, sans post-process lourd.
**Techno** three.js.
**Coût** Facile à moyen. Mobile : OK.
**Transposable ?** Oui — philosophie à retenir plus que technique.

### 31. Hover WebGL sur images/vidéos : réfraction, déplacement, chromatique
**Vu chez** Dorian Lods Portfolio 2025 — https://www.awwwards.com/inspiration/webgl-refraction-hover-effect-dorian-lods-portfolio-2025 ; Duynguyencreative ; curtains.js (« convertit images, vidéos et canvas en plans WebGL texturés ») — https://www.curtainsjs.com/ ; Unseen (« reveal au hover avec subtle scaling »)
**Ce que ça fait** Au survol d'une vignette, un shader déforme/réfracte/décale les couches RGB ; sur vidéo, le hover lance la lecture.
**Techno** curtains.js ou three.js plan par élément DOM.
**Coût** Facile. Mobile : pas de hover — remplacer par autoplay en viewport.
**Transposable ?** Oui, c'est la base d'une grille de films.

### 32. Drag / click-and-hold comme récit (« storytelling drag interactive film »)
**Vu chez** Five Minutes — http://www.fiveminutes.gs/ ; Nomadic Tribe (makemepulse : « birds fly faster as you hold the cursor down ») ; Anagram (« distortion on drag ») — liste https://www.awwwards.com/click-and-hold-drag-and-gesture-interactions-in-web-design.html
**Ce que ça fait** Maintenir le clic ou glisser fait avancer le film / accélère l'action ; relâcher arrête.
**Techno** pointer events + vidéo/GSAP.
**Coût** Facile. Mobile : natif.
**Transposable ?** Oui : « maintenir pour regarder » comme geste d'engagement dans un showreel.

### 33. Gaussian splatting en navigateur (Spark, SuperSplat)
**Vu chez** Recherche seulement : Spark (World Labs), mkkellogg three.js renderer ; Zillow SkyTours ; Utsubo Hokusai Expo 2025 — https://www.utsubo.com/blog/gaussian-splatting-guide
**Ce que ça fait** Une scène capturée (vidéo tournée en tournant autour d'un lieu) devient un volume navigable ; « > 200 FPS sur GPU moderne » selon le brut.
**Techno** three.js + Spark.
**Coût** Lourd en capture/entraînement, moyen en rendu. Mobile : possible à basse densité.
**Transposable ?** Oui pour l'immobilier/tourisme : un plan drone devient un lieu qu'on visite. Aucun site primé observé encore.

---

## Ce que la vidéo permet de neuf

Idées où la matière du réalisateur (rushes, timecode, profondeur, étalonnage, son) *est* l'interface. Chaque idée s'appuie sur des mécaniques observées ci-dessus ; la combinaison est **[extrapolation]** faisable en 2026.

### A. Le showreel est le site (scrub = navigation, timecode = URL)
Un seul plan-séquence de 60-90 s monté à partir des meilleurs plans, encodé `-g 12` (méc. 2) et scrubbé au drag horizontal et au scroll (méc. 3). Chaque projet correspond à une plage de timecode ; l'URL porte `#tc=00:42:12` et la page projet s'ouvre depuis le plan qu'on tient. Le scrubber affiche des vignettes de scènes comme Önnu Jónu Son (méc. 19). Le visiteur fait un geste de monteur : jog, shuttle, pause, sans jamais quitter le film. Mobile : version 20 s + séquence d'images.

### B. Rack focus comme menu
Chaque frame clé est livrée avec une depth map (générée par IA type Depth Anything à partir du rush, ou LiDAR iPhone sur le plateau). Le menu est posé à différentes profondeurs dans l'image ; déplacer le curseur / le doigt tire le point (méc. 4 pour le flou par profondeur, méc. 5 pour la parallaxe UV). Ce qui est net est cliquable. C'est la mise au point de l'opérateur transformée en navigation. Fallback : parallaxe seule sur mobile.

### C. Before / after d'étalonnage au curseur-torche
Deux encodages synchronisés du même plan (log brut / étalonné) montés sur un seul plan WebGL ; le disque-spotlight (méc. 25) révèle le brut sous l'étalonnage, ou l'inverse. Variante : la palette du site est échantillonnée en direct dans la vidéo (méc. 23) — l'UI se ré-étalonne à chaque film comme chez Önnu Jónu Son (méc. 19). Coût faible, différenciant, pédagogique pour les clients corporate.

### D. Le son coupé revient avec la vitesse de scroll
Les rushes ont du son direct qu'on jette au montage (ambiances de chantier, de vignes, de salle événementielle). Il devient une couche audio dont le gain est piloté par la *vitesse* de scroll (méc. 20) : scroll lent = ambiance, scroll nerveux = coupes sèches. Un player-equalizer (méc. 27) rend la piste visible. Nécessite un premier geste utilisateur pour l'audio.

### E. Table de montage : la grille de projets qu'on pousse et qu'on assemble
La grille draggable à inertie de Phantom (méc. 7) mais faite de clips ; le visiteur en aligne trois dans un « rail » et le site joue sa séquence, transitions par datamosh (méc. 10) entre les clips. On ne demande pas au visiteur de monter un film ; on lui fait sentir qu'il touche des rushes. Le brut n'a trouvé aucun site primé de « remix par le visiteur » — territoire libre.

### F. Photogramme → film au long press
Le site est d'abord un site d'images fixes (photogrammes exportés en 4K, très rapides). Un long press (méc. 13) fait « démarrer » le photogramme : la vidéo se substitue exactement en place (même cadre, même timecode). Relâcher fige à nouveau. Léger, mobile-first, et raconte le passage photo → cinéma.

### G. Le plan devient volume (depth video, voxels, splats)
Pour immobilier/tourisme : un rush de drone traité en depth par frame → nuage de particules qu'on fait pivoter (méc. 6 en vidéo, contrainte perf notée dans le brut) ou, plus robuste, un Gaussian splat du lieu capturé au tournage (méc. 33) dans lequel on navigue avant de lancer le film monté. À réserver à 1-2 projets vitrines.

### H. Le codec comme langage de transition
Toutes les transitions de pages sont des artefacts de vidéo : datamosh (méc. 10) entre deux films, « frost dissolve » et aberration chromatique (méc. 24) vers la page contact, grain/LED (méc. 1) comme état par défaut, dithering (méc. 11) comme état de chargement — le film s'affiche d'abord en tramage 1-bit de 30 KB avant que le H.264 arrive. Cohérent, jamais décoratif.

### I. Ralenti d'entrée
Au hover/tap d'un film, la vidéo passe en « focus mode » à `playbackRate 0.6` avec une légère distorsion (méc. 12) ; au clic, elle repasse à 1.0 et s'ouvre plein cadre. Le ralenti signale « on entre dans le plan » — geste minuscule, très cinéma, coût quasi nul.

### J. Projection mapping du showreel sur un relief réactif
Hero : le showreel projeté sur une grille de cubes (méc. 9) qui figure une façade, un mur LED ou un décor d'événement ; le curseur creuse le relief. Mobile : grille 20×12. Pour la partie événementiel/scénographie.

---

## Pièges

1. **Les sites expérimentaux meurent** : skylinefilms.tv (référence Awwwards « infinite canvas video player ») redirige aujourd'hui en 301 vers tvsport24.net ; la page Awwwards `michael-gatt-folio` renvoie 404. Une prouesse non maintenue devient un lien mort — prévoir la maintenance dans le devis.
2. **Desktop only assumé** : The Spark est « volontairement limité aux écrans larges » (https://tympanus.net/codrops/2026/01/09/…). Pour un studio de prod dont les clients regardent sur téléphone, inacceptable sans version mobile équivalente.
3. **Créativité haute, usabilité basse** : jury Awwwards — RISK usabilité 6,82 vs créativité 7,43 ; Michael Gatt 7,13 vs 7,73 ; Igloo accessibilité 6,60 et sémantique 6,40 (https://www.awwwards.com/sites/igloo-inc). L'UI 100 % WebGL d'Igloo (texte SDF) coûte le SEO et les lecteurs d'écran.
4. **Le post-process plein écran ne passe pas mobile** : 4WIDE désactive le flou sur mobile (« l'ajustement le plus efficace ») ; le datamosh coûte « deux rendus géométriques + quatre passes plein écran » ; joseph-san.com doit rendre les passes atmosphériques à basse résolution. Tout effet doit avoir un état « off » propre.
5. **La physique CPU ne scale pas** : pixel-to-voxel « très gourmand en CPU », « limité à quelques milliers de cubes » (https://tympanus.net/codrops/2026/01/05/…). Un effet = un moment, pas une navigation.
6. **Scrubber vidéo = pipeline d'encodage** : `video.currentTime` n'est fluide qu'avec GOP court (`-g 12`), `faststart`, et un fallback WebCodecs (mediabunny) pour Firefox (KAI). Sans ça, saccades et poids ×3.
7. **Depth pour la vidéo n'est pas gratuit** : le brut note pour Phantom qu'il faudrait « des depth maps synchronisées image par image » et que « gérer des centaines d'images animées » demande une optimisation lourde. Rester sur des frames clés, pas sur 24 fps.
8. **Scroll-jacking par nécessité** : Lusion dit avoir utilisé le scroll-jacking « principalement pour des raisons de performance et de glitchs sur appareils lents » (https://www.awwwards.com/case-study-for-lusion-by-lusion-…). Quand la mécanique impose le hijack, le site devient fragile aux trackpads/tactiles.
9. **Le procédural coûte du temps** : abeto, Igloo — « Procedural approaches need to be chosen carefully, since setting them up can take significant time ». Pour un studio de prod, la vidéo existante est l'asset ; ne pas rebâtir en 3D ce qu'on a filmé.
10. **Gadget sans sens** : le contre-modèle explicite est Chems.Studio « Nothing loops simply for decoration » et Iventions « WebGL used for atmosphere instead of spectacle » ; Bisous prouve qu'un site de prod « cinématique » tient sans WebGL. Beaucoup de fiches Awwwards du brut (BADASS, we3studio, Light Factory) ne décrivent aucune mécanique réelle : ne pas s'y référer comme preuve.

---

## À capturer

```
kai|https://www.kai-group.com/global/design/
phantom|https://phantom.land/
onnu|https://onnujonuson.com/
partizan|https://partizan.com/
4wide|https://4wide.jp/
bisous|https://bisous-production.com/
chems|https://www.chems.studio/
risk|https://www.risk.film
datamosh|https://tympanus.net/Tutorials/Datamosh/
scan|https://tympanus.net/Development/ScanEffect
```

Réserve (si budget de capture) : `spark|https://spark.thedigitalpanda.com` (desktop only), `monolith|https://themonolithproject.net/`, `igloo|https://www.igloo.inc/`, `josephsan|https://joseph-san.com/`, `smerilli|http://edoardosmerilli.com`.
