# f3 — « Découpage » : le site écrit comme un réalisateur écrit

## Légendes des états
- **d0 — Arrivée.** Page 1 du découpage : logotype, SÉQ. 01 — EXT. QUAI DES CHARTRONS — AUBE, trois lignes de plan ; à droite le photogramme du plan 01.1 avec son cartouche et la réglette des durées ; en pied « 1 / 12 » et « Maintenir pour lire ».
- **d1 — Lecture en cours.** SÉQ. 02 — The Sound of Discovery ; le regard est sur le plan 02.3 (numéro terracotta, filet), l'image du plan à droite, la note de marge « Approche — Observer sans intervenir… » déployée dans la marge, le document fait de la place.
- **d2 — « Lecture ».** Appui maintenu : letterbox sombre plein écran, le photogramme en 2.39, la ligne de plan en sous-titre, timecode 25 i/s, barre de progression segmentée par plan.
- **d3 — SÉQ. 10.** Page de scénario à remplir : « VOTRE SÉQUENCE : INT./EXT. ______ — ______ », nom, société, courriel, message, « Envoyer le brief » ; à droite le viseur vide « Plan à tourner ».
- **m0 — Mobile, arrivée.** Le document défile sous un bandeau 16:9 collé en haut, cartouche compact incrusté.
- **m1 — Mobile, ligne tapée.** 03.2 devient active, le bandeau montre son image, la note « Approche » se déploie sous la ligne.
- **m2 — Mobile, SÉQ. 10.** Le contact en page de scénario, champs pleine largeur, cibles ≥ 44 px.

## Notes d'implémentation (Next.js)
1. Le découpage est une donnée structurée, pas du HTML : `Sequence { id, slug, title, meta, note, noteAt, shots[] }` et `Shot { value, movement, duration, description, media }`. Dans le CMS (Sanity/Payload), un film = une séquence, un photogramme = un plan ; l'« approche » est le champ note. Le réalisateur remplit son découpage, le site s'écrit tout seul.
2. Tout est rendu côté serveur (RSC) : chaque ligne de plan est du texte indexable, les titres de séquence sont des `<h2>`, les descriptions des `<p>`. Aucune image de texte, aucun contenu injecté au client. Le JSON-LD `VideoObject` par film reprend titre, client, année, durée totale du découpage.
3. La colonne droite est un composant client léger : `IntersectionObserver` avec `rootMargin` calé sur la ligne de lecture (38 vh), survol/tap qui prend le pas sur le défilement, `prefers-reduced-motion` respecté (fondu → coupe franche).
4. « Lecture » avec de vraies vidéos : un `<video>` par film, `preload="metadata"`, sources MP4/H.265 + WebM, encodées par plan avec des chapitres (WebVTT `chapters`) aux mêmes timecodes que le découpage. L'appui maintenu joue depuis `shot.in` ; les durées écrites deviennent les vrais points de coupe, donc le CMS doit stocker `in/out` par plan.
5. Le geste « appui maintenu » : Pointer Events avec `setPointerCapture`, seuil 260 ms pour ne pas capter un clic, `touch-action: pan-y` sur le document ; Espace au clavier ; un bouton « Lire la séquence » visible pour que le geste ne soit pas la seule voie (a11y, découvrabilité).
6. Accessibilité : les lignes de plan sont des `<button>` dans une liste, `aria-current="true"` sur le plan actif, `aria-live="polite"` sur le cartouche, le mode lecture est un `<dialog>` avec focus piégé et Échap ; contrastes vérifiés (terracotta sur crème réservé aux petits libellés ≥ 500).
7. Impression PDF native : `@media print` supprime la colonne image sticky, réinsère le photogramme en vignette dans chaque ligne, force un `break-before: page` par séquence, imprime les numéros de page réels via `@page { @bottom-center { content: counter(page) " / " counter(pages) } }`. Le site est déjà un document.
8. Formulaire SÉQ. 10 : Server Action + validation Zod, champ « votre séquence » (INT./EXT., lieu, moment) envoyé tel quel dans le mail comme première ligne du brief ; honeypot + rate-limit, pas de captcha.
9. Images : `next/image` avec `sizes` distincts pour le moniteur (42 vw) et le bandeau mobile (100 vw), placeholders `blurDataURL` extraits du photogramme pour que le fondu entre plans ne montre jamais de gris.
10. Mobile : bandeau `position: sticky` 16:9 au-dessus du document, `env(safe-area-inset-*)`, tap = ligne active (pas de hover), la note se déploie sous la ligne ; en lecture, letterbox plein écran et verrou d'orientation non forcé.
11. Numérotation : les pages « 1 / 12 » sont calculées côté serveur depuis les données (une séquence = une page) pour que l'URL puisse cibler `#seq-02` et que le pied reste juste sans JS.
12. Performance : polices en `font-display: block` déjà chargées ; pas de librairie d'animation, seulement des transitions CSS et un `requestAnimationFrame` pour le timecode.
