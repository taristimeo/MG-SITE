// Contenu éditorial du site Mauvais Grain.
// Toutes les données textuelles vivent ici pour faciliter les mises à jour.

export const site = {
  name: "Mauvais Grain",
  founder: "Timéo Taris",
  city: "Bordeaux",
  founded: "2022",
  tagline: "Créer des images qui donnent vie à vos projets",
  mission: "Transformer une idée en histoire visuelle forte",
  intro:
    "Studio de production vidéo basé à Bordeaux, spécialisé dans la création de films pour les entreprises, les événements et les projets créatifs.",
  email: "timeotaris@mauvaisgrain.com",
  phone: "06 52 06 53 89",
  phoneHref: "+33652065389",
  address: "94 quai des Chartrons, Bordeaux",
  // Liens réseaux — remplacer les href "#" par les vraies URL de Timéo.
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/mauvaisgrain_/" },
    { label: "YouTube", href: "#" },
    { label: "Vimeo", href: "#" },
  ],
} as const;

export type Service = {
  id: string;
  index: string;
  title: string;
  line: string;
};

export const services: Service[] = [
  {
    id: "corporate",
    index: "01",
    title: "Corporate",
    line: "Votre stratégie mérite mieux qu'une vidéo. Elle mérite un film.",
  },
  {
    id: "evenementiel",
    index: "02",
    title: "Événementiel",
    line: "Un événement ne dure qu'un soir. Son film, beaucoup plus longtemps.",
  },
  {
    id: "immobilier",
    index: "03",
    title: "Immobilier",
    line: "Un bien se visite. Un lieu, ça se ressent.",
  },
  {
    id: "tourisme",
    index: "04",
    title: "Tourisme",
    line: "Mettre en lumière vos paysages, vos expériences et l'identité d'un territoire.",
  },
  {
    id: "clip",
    index: "05",
    title: "Clip",
    line: "Donner une image à votre musique.",
  },
];

// Clients qui font confiance au studio — logos dans /public/clients (PNG
// transparents monochromes). Ordre = ordre d'apparition (gauche → droite).
export type Client = { name: string; logo: string };

export const clients: Client[] = [
  { name: "Beauty Success", logo: "/clients/beauty-success.png" },
  { name: "COB", logo: "/clients/cob.png" },
  { name: "CRA", logo: "/clients/cra.png" },
  { name: "DeLaurentis", logo: "/clients/delaurentis.png" },
  { name: "Nebopan", logo: "/clients/nebopan.png" },
  { name: "Oh", logo: "/clients/oh.png" },
  { name: "Partedis", logo: "/clients/partedis.png" },
  { name: "Wimco", logo: "/clients/wimco.png" },
];

export type Value = { title: string; text: string };

export const values: Value[] = [
  {
    title: "Dialogue",
    text: "Avant tout, on échange. On comprend votre univers, vos contraintes, ce que vous voulez vraiment dire — pour partir d'une intention claire, pas d'une supposition.",
  },
  {
    title: "Créativité",
    text: "On traduit cette intention en parti pris : un angle, un rythme, une lumière. Vous validez la direction avant qu'on tourne, jamais après.",
  },
  {
    title: "Exigence",
    text: "On tourne, on monte, on étalonne avec le même soin du début à la fin. Même les détails qu'on ne remarque pas.",
  },
  {
    title: "Fiabilité",
    text: "Un interlocuteur unique, des délais tenus, des points réguliers. Vous savez toujours où en est votre film.",
  },
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  video: string; // lien YouTube de la réalisation
  stills: number; // nombre de stills dans /public/projects/<slug>/ (1.jpg…N.jpg)
  summary: string; // « Le projet »
  approach: string; // « Notre approche »
  result: string; // « Le résultat »
  // Extrait vidéo de prévisualisation (boucle muette ~10 s) servi depuis
  // /public/projects/<slug>/preview.mp4. Si absent, la card affiche le still.
  preview?: boolean;
  // Générique du film. Par défaut : studio solo (Timéo Taris).
  credits?: { role: string; name: string }[];
};

// Réalisations — du plus récent au plus ancien.
// NB : textes (résumé / approche / résultat) rédigés en brouillon, à relire.
export const projects: Project[] = [
  {
    slug: "the-sound-of-discovery",
    title: "The Sound of Discovery",
    client: "Autoproduit",
    category: "Tourisme",
    year: "2026",
    video: "https://www.youtube.com/watch?v=VPxP8jyvCUQ",
    stills: 8,
    summary:
      "Un voyage sensoriel autoproduit, à la recherche du son et de la lumière d'un territoire.",
    approach:
      "Caméra à l'épaule et écoute du lieu : laisser le paysage et ses sons dicter le rythme du film.",
    result:
      "Un film de territoire immersif, entre documentaire et carte postale sensible.",
  },
  {
    slug: "silhouette",
    title: "Silhouette",
    client: "Autoproduit",
    category: "Clip",
    year: "2026",
    video: "https://www.youtube.com/watch?v=s9nfZNalshY",
    stills: 6,
    summary:
      "Un clip autoproduit où le corps et l'ombre deviennent matière, entre lumière et contre-jour.",
    approach:
      "Travail du contre-jour et de la silhouette pour une écriture graphique, au plus près du mouvement.",
    result:
      "Un clip à la signature visuelle forte, pensé pour l'écran comme pour les réseaux.",
  },
  {
    slug: "the-shape-of-vastness",
    title: "The Shape of Vastness",
    client: "Autoproduit",
    category: "Tourisme",
    year: "2025",
    video: "https://www.youtube.com/watch?v=MQfl1xV6ku0",
    stills: 8,
    summary:
      "Un film d'exploration autoproduit, face à l'immensité du paysage et à l'échelle de l'humain.",
    approach:
      "Plans larges, lenteur et lumière naturelle pour donner à ressentir la grandeur du lieu.",
    result:
      "Un film contemplatif qui affirme le langage visuel du studio.",
  },
  {
    slug: "delaurentis-gone-colors",
    title: "Gone Colors",
    client: "DeLaurentis",
    category: "Clip",
    year: "2024",
    video: "https://www.youtube.com/watch?v=bILWfeK3tM0",
    stills: 6,
    preview: true,
    summary:
      "Captation live et clip pour DeLaurentis (Summer Live Session), où la couleur et le grain prolongent le morceau.",
    approach:
      "Une grammaire visuelle construite avec l'artiste, au service de l'énergie de la session live.",
    result:
      "Un clip à l'identité forte qui accompagne la sortie du morceau.",
  },
  {
    slug: "graduation",
    title: "Graduation",
    client: "COB",
    category: "Événementiel",
    year: "2024",
    video: "https://www.youtube.com/watch?v=oiF81gEEtbg",
    stills: 6,
    preview: true,
    summary:
      "L'aftermovie d'une soirée de gala : l'énergie d'un événement condensée en quelques minutes.",
    approach:
      "Captation au plus près de l'action, montage rythmé sur l'énergie de la soirée.",
    result:
      "Un aftermovie qui restitue l'ampleur de l'événement et donne envie d'y être.",
  },
  {
    slug: "la-medocaine",
    title: "La Médocaine",
    client: "La Médocaine",
    category: "Événementiel",
    year: "2024",
    video: "https://www.youtube.com/watch?v=Bl0xfF3aY0g",
    stills: 6,
    preview: true,
    summary:
      "L'after de La Médocaine : foule, rythme et émotion captés au cœur de la fête.",
    approach:
      "Au plus près de la foule et de la nuit, un montage nerveux porté par la musique.",
    result:
      "Un aftermovie qui fait revivre l'intensité de l'événement.",
  },
];

// Générique par défaut (studio solo). Surchargé par project.credits si présent.
export function projectCredits(p: Project): { role: string; name: string }[] {
  return (
    p.credits ?? [
      { role: "Réalisateur", name: "Timéo Taris" },
      { role: "Client", name: p.client },
      { role: "Année", name: p.year },
    ]
  );
}

// Suggestions « Autres réalisations » : on privilégie les projets de la même
// catégorie (tourisme → tourisme…), puis on complète avec les plus récents.
export function projectSuggestions(current: Project, count = 2): Project[] {
  const pool = projects.filter((p) => p.slug !== current.slug);
  const sameCategory = pool.filter((p) => p.category === current.category);
  const others = pool.filter((p) => p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export const navLinks = [
  { label: "Réalisations", href: "/realisations" },
  { label: "Studio", href: "/studio" },
];

// --- Médias des réalisations ---------------------------------------------
// Stills réels servis depuis /public/projects/<slug>/1.jpg … N.jpg
export function projectStills(p: Project): string[] {
  return Array.from({ length: p.stills }, (_, i) => `/projects/${p.slug}/${i + 1}.jpg`);
}

export function projectThumb(p: Project): string {
  return `/projects/${p.slug}/1.jpg`;
}

// Extrait vidéo de prévisualisation (boucle muette) si le projet en a un.
export function projectPreview(p: Project): string | undefined {
  return p.preview ? `/projects/${p.slug}/preview.mp4` : undefined;
}

// Extrait l'ID d'une URL YouTube (watch?v=…, youtu.be/…, embed/…).
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
