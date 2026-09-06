// Le studio n'a pas de page « à propos » : ses partis pris sont des notes
// posées sur la timeline (voir Table), et ce panneau tient à côté de la
// visionneuse, où le portrait du fondateur remplace le plan courant.
import { founder, manifesto, site } from "@/lib/site";

export function Studio() {
  const parts = manifesto.text.split(manifesto.accents[0]);
  return (
    <aside className="studio-p" aria-label="Studio">
      <div>
        <div className="cond" style={{ color: "var(--bone-faint)", marginBottom: 10 }}>Studio · {site.city} · depuis {site.founded}</div>
        <h2 className="wide">{founder.name}, réalisateur.</h2>
      </div>
      <p className="wide mani">{parts[0]}<em>{manifesto.accents[0]}</em>{parts[1]}</p>
      <p>Fondé en {site.founded} par {founder.name}, Mauvais Grain est un studio de production vidéo à {site.city}. L&apos;image au service de votre histoire — trois partis pris, posés comme des notes sur la timeline : touchez un marqueur pour l&apos;ouvrir.</p>
      <ol>
        {founder.lines.map((l, i) => (
          <li key={l}><span className="cond">0{i + 1}</span><span>{l}</span></li>
        ))}
      </ol>
      <p className="cond coord">
        {site.street}, {site.postalCode} {site.city}<br />
        <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phoneHref}`}>{site.phone}</a><br />
        {site.socials.map((s, i) => (
          <span key={s.label}>{i ? " · " : ""}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></span>
        ))}
      </p>
    </aside>
  );
}
