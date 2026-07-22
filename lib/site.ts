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
  // Adresse postale décomposée (utile pour les données structurées / SEO local).
  address: "94 quai des Chartrons, Bordeaux",
  street: "94 quai des Chartrons",
  postalCode: "33000",
  region: "Nouvelle-Aquitaine",
  country: "FR",
  geo: { lat: 44.8546, lng: -0.5698 }, // approx. quai des Chartrons, Bordeaux
  // Domaine de production — source unique pour metadataBase, sitemap, canoniques
  // et données structurées. À adapter si le domaine change.
  url: "https://mauvaisgrain.com",
  // Liens réseaux du studio.
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/mauvaisgrain_/" },
    { label: "YouTube", href: "https://www.youtube.com/@MauvaisGrain" },
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

// Manifeste — la phrase signature du brand book, révélée mot à mot au scroll
// sur l'accueil (les mots « accents » passent en terracotta).
export const manifesto = {
  kicker: "Le regard",
  text: "Nous ne filmons pas ce qu'il se passe. Nous filmons ce que l'on ressent lorsqu'on y est.",
  accents: ["ressent"],
} as const;

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

// Avis clients (Google) — affichés en preuve sociale sur la page Studio.
// Noms réduits au prénom + initiale, mentions studio normalisées.
export type Testimonial = { quote: string; name: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ma femme et moi avons eu la chance de collaborer avec Mauvais Grain pour l'ouverture de notre boutique. Il nous a produit une qualité de travail que nous n'avons jamais trouvée ailleurs. Nous vous le recommandons à 1000%. Merci Timéo.",
    name: "Samuel C.",
  },
  {
    quote:
      "J'ai eu la chance de travailler avec Mauvais Grain pour plusieurs projets vidéos et c'est excellent ! Un travail remarquable, de qualité, en peu de temps. Si vous cherchez un vidéaste, je recommande vivement.",
    name: "Pandhi M.",
  },
  {
    quote:
      "Super expérience avec Timéo : professionnalisme, fiabilité, compétence. Un vrai plaisir de travailler avec lui, avec un résultat au top.",
    name: "Emmanuelle B.",
  },
];

// Étapes du process de fabrication d'un film — de l'écoute à la livraison.
// Affichées en frise sur la page Studio.
export type ProcessStep = { label: string; text: string };

export const processSteps: ProcessStep[] = [
  {
    label: "Écoute",
    text: "On part de vous : intention, contraintes, public. Une base claire avant toute image.",
  },
  {
    label: "Écriture",
    text: "On traduit l'intention en parti pris — angle, rythme, lumière. La direction se valide ici.",
  },
  {
    label: "Tournage",
    text: "On capte sur le terrain, au bon moment, avec le soin d'un plan pensé, jamais subi.",
  },
  {
    label: "Montage",
    text: "On assemble le récit, on choisit ce qui reste, on donne son souffle au film.",
  },
  {
    label: "Étalonnage",
    text: "On travaille la couleur image par image, jusqu'à la texture juste, celle qu'on garde.",
  },
  {
    label: "Livraison",
    text: "On livre aux bons formats, prêt à diffuser, avec un interlocuteur unique jusqu'au bout.",
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
export const projects: Project[] = [
  {
    slug: "the-sound-of-discovery",
    title: "The Sound of Discovery",
    client: "Autoproduit",
    category: "Tourisme",
    year: "2026",
    video: "https://www.youtube.com/watch?v=VPxP8jyvCUQ",
    stills: 8,
    preview: true,
    summary:
      "Proposer une façon différente de découvrir l'Égypte. Plutôt que de se concentrer sur les sites emblématiques, l'objectif était de raconter le pays à travers ses habitants, leurs regards et les instants du quotidien qui donnent vie au territoire.",
    approach:
      "Observer sans intervenir. Laisser les rencontres, les ambiances et la lumière naturelle guider le récit afin de construire un voyage plus humain, où chaque scène invite à s'immerger dans la culture locale.",
    result:
      "Un film qui invite à visiter l'Égypte autrement, en mettant autant en valeur les émotions et les scènes de vie que les lieux traversés.",
  },
  {
    slug: "silhouette",
    title: "Silhouette",
    client: "Autoproduit",
    category: "Clip",
    year: "2026",
    video: "https://www.youtube.com/watch?v=s9nfZNalshY",
    stills: 6,
    preview: true,
    summary:
      "Créer un film à contre-courant d'un monde où tout est en mouvement. Revenir à une mise en scène plus calme, centrée sur le cadre, l'architecture et la composition.",
    approach:
      "Construire le film principalement autour de plans fixes. Le mouvement naît uniquement de la danseuse, créant un contraste entre l'immobilité de l'espace et la fluidité du corps.",
    result:
      "Un film minimaliste où chaque plan est pensé comme une composition graphique, laissant le mouvement révéler toute la force de l'image.",
  },
  {
    slug: "the-shape-of-vastness",
    title: "The Shape of Vastness",
    client: "Autoproduit",
    category: "Tourisme",
    year: "2025",
    video: "https://www.youtube.com/watch?v=MQfl1xV6ku0",
    stills: 8,
    preview: true,
    summary:
      "Explorer ce qui rend les paysages des Canaries si singuliers. À travers leurs reliefs volcaniques, leurs textures et leurs lumières, l'objectif était de révéler l'identité unique de ce territoire.",
    approach:
      "Prendre le temps d'observer. Construire un film contemplatif où chaque plan laisse respirer le paysage, en laissant la lumière, les formes et l'immensité guider naturellement le regard.",
    result:
      "Un voyage visuel qui met en valeur le caractère unique des Canaries et invite à découvrir le territoire à travers les sensations qu'il procure.",
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
      "Réaliser une live session sur une plage au coucher du soleil, en utilisant exclusivement la lumière naturelle pour créer une atmosphère en accord avec l'univers musical de l'artiste.",
    approach:
      "Tourner durant les dernières minutes du jour afin de profiter d'une lumière douce et chaleureuse. Le paysage devient un élément essentiel de la mise en scène et accompagne naturellement la performance.",
    result:
      "Une performance intimiste où la musique, la lumière et l'environnement se complètent pour créer une esthétique simple, authentique et cinématographique.",
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
      "Capturer une cérémonie de remise de diplôme sans se limiter au protocole. L'objectif était de raconter les émotions, les retrouvailles et les moments qui rendent cette journée inoubliable.",
    approach:
      "Adopter une approche immersive et sensorielle, en restant au plus près des étudiants et de leurs proches pour saisir les instants spontanés sans interrompre leur vécu.",
    result:
      "Un film vivant et sincère qui retranscrit autant l'émotion de la cérémonie que l'atmosphère de cette journée si particulière.",
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
      "Capturer le point culminant de La Médocaine, lorsque la compétition laisse place à la fête. L'objectif était de retranscrire l'énergie de la soirée et l'atmosphère unique qui rassemble les participants.",
    approach:
      "Se mêler au public pour filmer les concerts, le DJ, les jeux de lumière et le feu d'artifice. Alterner plans d'ensemble et instants spontanés afin de faire ressentir toute l'intensité de la soirée.",
    result:
      "Un film rythmé et immersif qui fait revivre l'ambiance festive de La Médocaine, en mettant en avant l'énergie collective, les émotions et les temps forts de la soirée.",
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
