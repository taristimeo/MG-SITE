# Per-lens agent prompt templates

Adapt these when launching the parallel agents (step 2). Write them in the
**user's language** so the returned reports match. Fill the `{{...}}` slots with
the target's stack, repo path, and live URL. Every prompt is read-only and ends
by telling the agent its report *is* the deliverable.

Launch all chosen lenses in a **single turn** (concurrent Agent calls),
`general-purpose` type.

---

## SEO lens

```
Tu audites le SEO d'un site {{stack, ex: Next.js 16 App Router}} pour "{{nom}}",
{{description courte + localisation}}. Repo : {{path}}. Prod : {{url}}.

OBJECTIF : vérifier l'implémentation SEO actuelle ET identifier les
optimisations restantes. NE MODIFIE AUCUN FICHIER — analyse seulement.

À examiner (lis les fichiers, cite file:line) :
- Métadonnées : layout + chaque page (titres, descriptions, canonical, Open
  Graph, Twitter, metadataBase).
- Données structurées JSON-LD : LocalBusiness/Organization, VideoObject,
  BreadcrumbList — complétude, validité, champs manquants.
- Sitemap et robots.
- Hiérarchie des titres (un seul H1/page ? H2 cohérents ?).
- Images : <img> brut vs next/image, alt, lazy-loading, dimensions/CLS.
- Core Web Vitals : polices, risques LCP, JS tiers.
- SEO local : mots-clés pertinents dans le contenu visible.
- Contenu : profondeur, pages manquantes (services, FAQ), maillage interne.
- Vérifie que le build passe (`npm run build`).

LIVRABLE (structuré, {{langue}}) :
1. "DÉJÀ EN PLACE" : liste concise du correctement implémenté.
2. "À OPTIMISER" : pour chaque point → {zone, état actuel, problème/opportunité,
   reco concrète (snippet si utile), priorité HAUTE/MOYENNE/BASSE, effort}.
3. "HORS-CODE" : leviers off-site (fiche Google Business, Search Console,
   citations, backlinks) en bref.
Ton rapport final EST le livrable — renvoie le contenu brut.
```

---

## Bugs & robustness lens

```
Tu chasses les bugs dans un site {{stack}}. Repo : {{path}}. NE CORRIGE RIEN —
rapport seulement.

Passe en revue le code applicatif pour :
- Bugs de correction / logique / cas limites.
- Erreurs runtime, pièges React (useEffect, deps, keys, hydration, "use client").
- Formulaires : validation, gestion réseau/retry, états succès/échec, payload.
- Modales / overlays : portail, verrou de scroll, focus/a11y (role, focus trap),
  fermeture clavier.
- Animations / IntersectionObserver : fuites, cas jamais déclenché,
  prefers-reduced-motion.
- Accessibilité : labels, aria, contrastes, navigation clavier, alt.
- Responsive / débordements.
- TypeScript : types douteux, any implicites.
Lance `npm run build` et rapporte erreurs/warnings de compilation ou de lint.

LIVRABLE (structuré, {{langue}}) :
1. "BUGS" par gravité (CRITIQUE/MAJEUR/MINEUR) : {fichier:ligne, description,
   scénario d'échec concret (entrées → comportement), gravité, correctif}.
2. "ROBUSTE" : ce qui est bien fait / défensif.
Vérifie tes affirmations en lisant le code. Ton rapport final EST le livrable —
renvoie le contenu brut.
```

---

## Inspiration / design lens

```
Tu es directeur artistique web senior. Propose des améliorations concrètes pour
le site de "{{nom}}" ({{secteur}}), en t'inspirant des meilleurs sites du
domaine.

CONTEXTE DU SITE (lis {{fichiers de contenu/composants}} au repo {{path}} pour
comprendre les sections) : {{résumé des sections actuelles}}.
IDENTITÉ À PRÉSERVER : {{palette, typo, motion, ton}} — ne propose QUE ce qui
élève le site SANS trahir son identité.

MÉTHODE : utilise WebSearch/WebFetch pour étudier 5-8 excellents sites du domaine
(primés Awwwards, références reconnues). Identifie des patterns concrets
(hero/traitement clé, présentation du contenu, micro-interactions, storytelling,
conversion, réassurance, transitions).

LIVRABLE (structuré, {{langue}}) : liste priorisée. Pour chaque idée → {idée,
pourquoi ça marche / qui le fait bien (cite site + URL), comment l'adapter
précisément à l'identité, impact HAUT/MOYEN/BAS, effort}. Regroupe par thème.
Termine par un TOP 3 à plus fort impact. NE MODIFIE AUCUN FICHIER. Ton rapport
final EST le livrable — renvoie le contenu brut.
```

---

## Notes

- **Egress limits**: research agents may hit a proxy that blocks some hosts.
  Instruct them not to bypass it and to ground claims in whatever search results
  they can reach — a partial but honest report beats a blocked one.
- **Keep lenses disjoint**: if two lenses would both flag e.g. image
  performance, assign it to one (SEO) so findings don't duplicate.
- **Severity vs priority**: bugs use CRITIQUE/MAJEUR/MINEUR; SEO and design use
  HAUTE/MOYENNE/BASSE (priority) or HAUT/MOYEN/BAS (impact). Preserve each
  agent's own scale in the report — map them onto the same badge colours in the
  HTML.
