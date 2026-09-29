import { Ink } from '../components/Ink';
import { hero } from '../content/portfolio';

export function Hero() {
  return (
    <section data-magnet="01" data-magnet-title="Intro" data-notes="intro" className="section hero" id="top">
      <Ink className="label">{hero.focus}</Ink>
      <Ink as="h1" className="hero-name">{hero.name}</Ink>
      <Ink className="hero-role">{hero.role}</Ink>
      <Ink className="lead">{hero.tagline}</Ink>
      <Ink className="label">{hero.meta}</Ink>
      <div className="actions">
        {hero.ctas.map((cta) => (
          <a key={cta.label} className="button" href={cta.href}>
            {cta.label.toUpperCase()}
          </a>
        ))}
      </div>
    </section>
  );
}
