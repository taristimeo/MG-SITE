// Les trois brouillons en concurrence. Source unique : la page de garde, le
// sélecteur et le plan du site lisent tous cette liste.

export type Draft = {
  num: string;
  href: string;
  name: string;
  geste: string;
  resume: string;
  gagne: string;
  coute: string;
  /** Image de couverture sur la page de garde. */
  still: string;
  /** Le brouillon tient-il sur un seul écran (pas de pages internes) ? */
  onePage: boolean;
};

export const DRAFTS: Draft[] = [
  {
    num: "01",
    href: "/banc",
    name: "Le banc de montage",
    geste: "On fait glisser la pellicule",
    resume:
      "Un site qui se lit de haut en bas, mais dont l'écran-titre est une table de montage : on promène le curseur sur la pellicule des six films et on monte. La lumière s'éteint pour les projections, se rallume pour l'atelier.",
    gagne:
      "Le seul des trois qui garde des pages séparées — réalisations, studio, contact — donc le plus complet et le plus simple à faire référencer.",
    coute:
      "C'est aussi le plus proche d'un site classique : le geste est dans l'écran-titre, moins dans la circulation générale.",
    still: "/projects/the-sound-of-discovery/1.jpg",
    onePage: false,
  },
  {
    num: "02",
    href: "/viseur",
    name: "Le viseur",
    geste: "On tourne la bague",
    resume:
      "Plus de pages, seulement des prises. Une image plein écran en permanence, les repères d'un viseur de caméra, et une bague graduée en bas de l'écran qui fait passer d'un film à l'autre.",
    gagne:
      "L'image occupe la totalité de l'écran en permanence : le plus radicalement « studio vidéo » des trois. Et le geste, inhabituel, se retient.",
    coute:
      "Un seul film à la fois, donc aucune vue d'ensemble — d'où l'index dépliable prévu en secours.",
    still: "/projects/the-shape-of-vastness/1.jpg",
    onePage: true,
  },
  {
    num: "03",
    href: "/pellicule",
    name: "La pellicule",
    geste: "On défile vers la droite",
    resume:
      "Le site ne descend pas, il passe. Tout le contenu — titre, manifeste, films, métiers, contact — est posé sur une bande unique qui défile latéralement, perforations comprises.",
    gagne:
      "La métaphore est immédiate, sans avoir à l'expliquer. Et la progression devient physique : la bobine se dévide, on sait toujours où on en est.",
    coute:
      "Le défilement horizontal s'apprend, et ne se transpose pas sur téléphone — la bande y bascule en vertical.",
    still: "/projects/silhouette/1.jpg",
    onePage: true,
  },
];
