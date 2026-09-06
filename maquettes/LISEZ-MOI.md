# Cinq pistes de refonte — maquettes

Cinq propositions qui se distinguent par le **maniement** du site, pas seulement
par son habillage. Charte identique dans les cinq (crème chaud, terracotta,
Gloock / JetBrains Mono / Saira), contenu réel du studio.

| Fichier | Piste | Le geste |
| --- | --- | --- |
| `c1.html` | La table lumineuse | On tire le plan — pas de défilement, les films sont des diapositives |
| `c2.html` | Le viseur | On tourne une bague graduée — une image plein écran, jamais de page |
| `c3.html` | La pellicule | On défile vers la droite — le site passe latéralement |
| `c4.html` | Le journal de tournage | On lit, l'image vient — aucune photo au repos |
| `c5.html` | La régie | On choisit dans le conducteur — deux volets figés, liste et moniteur |

**Pour les regarder** : ouvrir n'importe lequel des `.html` dans un navigateur.
Chacun est autonome (styles, script, polices et images embarqués) — aucun
serveur, aucune connexion nécessaire. Le geste fonctionne vraiment : glisser,
molette, survol, clic selon la piste.

Chaque maquette expose `window.mgState(0|1|2)` dans la console : trois états
figés — au repos, le geste en cours, le résultat. C'est ce qui a servi aux
planches du PDF.

**Le dossier de présentation** : `MauvaisGrain-5-pistes.pdf` (13 pages, A4
paysage) — deux planches par piste, avec ce que chacune fait gagner et ce
qu'elle coûte.

Ce sont des maquettes d'écran, pas des pages de production : un seul écran par
piste, pas de parcours complet, pas de référencement, pas de formulaire.

---

# Seconde série — cinq mondes visuels

La première série partageait un même ADN (noir, viseur, instrumentation de
caméra). Celle-ci part dans cinq mondes distincts, même charte, avec des
références nommées et des interdits explicites. Le téléphone y est dessiné,
pas transposé.

| Fichier | Direction | Le monde | Références |
| --- | --- | --- | --- |
| `d1.html` | Manifeste | Un mot géant par écran, grille suisse, images rares | Loewe · Aesop · Studio Feixen |
| `d2.html` | Terracotta | La couleur en aplats pleins, chiffres énormes, rubans | Basement Studio · Pentagram |
| `d3.html` | Plein cadre | Showreel sans chrome, titres qui débordent, rideau | Immersive Garden · Lusion |
| `d4.html` | Index | Tableau brutaliste, survol qui bascule l'écran | Obys · Bureau Borsche |
| `d5.html` | Atelier | Tirages posés de biais, annotations à la main | Kinfolk · Cereal |

Dossier : `MauvaisGrain-5-directions.pdf`.

---

# Troisième série — le site d'un réalisateur

La première série imitait le matériel de caméra ; la seconde faisait de
l'agence. Celle-ci fait du cinéma par sa GRAMMAIRE, jamais par ses
accessoires : ni timecode, ni viseur, ni perforations, ni clap.

| Fichier | Direction | Le site est… |
| --- | --- | --- |
| `e1.html` | Le film | …un court-métrage : noir, carton-titre, coupes franches, letterbox, générique de fin |
| `e2.html` | Le traitement | …la note d'intention qu'un réalisateur envoie à un producteur, qu'on feuillette |
| `e3.html` | Le storyboard | …une planche de storyboard dont chaque case joue son mouvement de caméra |
| `e4.html` | Le générique | …une séquence de titres façon Saul Bass ; les crédits sont la navigation |
| `e5.html` | Le plan-séquence | …un seul plan sans coupe, du jour à la nuit, tenu au steadicam |

Dossier : `MauvaisGrain-5-realisateur.pdf`.

---

# Troisième série — veille et concepts

Quatre agents ont écumé ≈ 150 sites (maisons de production internationales,
réalisateurs et chefs opérateurs, studios parisiens et vidéastes bordelais,
études de cas techniques 2025-2026). Les synthèses sont dans `veille/`, les
captures de référence dans `veille/refs/`. Trois concepts en sont sortis,
chacun construit sur un geste de réalisateur que personne n'a mis en ligne.

| Fichier | Concept | Le geste |
| --- | --- | --- |
| `f1.html` | Montage | Le site est une table de montage : le film se monte au rythme du visiteur, qui reprend la main et envoie son montage avec sa demande |
| `f2.html` | Le point | La bague de mise au point remplace le menu : ce qui est net se lit, le reste attend dans le flou |
| `f3.html` | Découpage | Le site est le découpage technique du réalisateur : lire, c'est naviguer ; maintenir, c'est jouer la séquence |

Chaque maquette expose `window.mgState(0..3)` (bureau) et `mgState(0..2)`
(téléphone). Les notes d'implémentation sont dans `f1-notes.md`, `f2-notes.md`,
`f3-notes.md`.

**Le dossier** : `MauvaisGrain-veille-concepts.pdf` (27 pages, A4 paysage) —
la veille (méthode, quatre planches de références, conventions, gestes rares,
ce que personne ne fait), puis cinq pages par concept (ouverture, l'idée,
architecture et gestes, écrans bureau, téléphone et mise en œuvre), puis la
grille de comparaison et la recommandation. Il se régénère avec
`veille/dossier4.mjs` (contenu dans `veille/dossier4-content.mjs`).

---

# Troisième série, seconde édition — Montage approfondi, deux nouvelles pistes

Montage est retenu ; Le point (`f2`) et Découpage (`f3`) sont écartés mais
conservés ici pour mémoire. Deux nouvelles pistes viennent des meilleurs sites
de la veille.

| Fichier | Concept | Le geste | Vient de |
| --- | --- | --- | --- |
| `f1.html` | Montage (approfondi) | 6 états bureau, 6 états iPhone : rythme, appui long, édition de la timeline, chutier complet, contact avec EDL | — |
| `f4.html` | Plan-séquence | Un film de 90 s est tout le site : on le scrubbe, l'URL porte le timecode, le filtre métier re-coupe le film | KAI, Önnu Jónu Son, Iconoclast, Ian Coad |
| `f5.html` | Repérage | Carte de la Gironde à l'encre, lieux tournés épinglés, molette de lumière qui ré-étalonne le site (heure réelle par défaut) | Bloom, Ligthelm |

Chaque maquette déclare `window.mgStates = { d, m }` et expose
`window.mgState(n)`. Les lieux de tournage utilisés dans `f5` sont une
hypothèse à confirmer.

**Le dossier** : `MauvaisGrain-veille-montage.pdf` (31 pages, A4 paysage) —
la veille, puis Montage sur neuf pages (dont trois pour l'iPhone : les six
états, l'anatomie annotée et les gestes, Safari et performance), puis cinq
pages par nouvelle piste, puis la grille de comparaison. Il se régénère avec
`veille/dossier5.mjs` (contenu dans `veille/dossier5-content.mjs`).
