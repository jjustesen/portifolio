import { Link, useParams } from 'react-router';
import { Ink } from '../components/Ink';
import { projects } from '../content/portfolio';

/** Page for one Selected work project: /work/:slug. */
export function ProjectPage() {
  const { slug } = useParams();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index < 0) {
    return (
      <section className="section project-page">
        <Ink className="label">404</Ink>
        <Ink as="h1" className="project-title">This page drifted away.</Ink>
        <Link className="button" to="/">
          ← BACK TO INDEX
        </Link>
      </section>
    );
  }

  const project = projects[index];
  const { page } = project;
  const next = projects[(index + 1) % projects.length];
  // Section labels are numbered in order, since the gallery is optional.
  let n = 1;
  const label = (title: string) => `${String(++n).padStart(2, '0')} / ${title}`;

  return (
    <>
      <section className="section project-page project-hero">
        {/* Back to where the page was opened from: this project in Selected work. */}
        <Link className="back-link" to={`/#${project.slug}`}>
          ← INDEX
        </Link>
        <Ink className="label">{`${project.index} / ${project.category}`}</Ink>
        <Ink as="h1" className="project-title">{project.name}</Ink>
        <Ink className="lead">{page.intro}</Ink>
        {page.link && (
          <div className="actions">
            <a className="button" href={page.link.href} target="_blank" rel="noopener noreferrer">
              {page.link.label.toUpperCase()}
            </a>
          </div>
        )}
      </section>

      <section className="section project-page">
        <Ink className="label">{label('Context')}</Ink>
        <Ink>{page.context}</Ink>
      </section>

      {page.media && page.media.length > 0 && (
        <section className="section project-page project-gallery">
          <Ink className="label">{label('The product')}</Ink>
          {page.media.map((item) => (
            <figure key={item.src} className="project-figure">
              {item.kind === 'demo' ? (
                // Live animated recreation; it plays on its own and takes no input, so the page's
                // pointer effects keep working over it.
                <div className="project-demo">
                  <iframe src={item.src} title={item.alt} loading="lazy" tabIndex={-1} />
                </div>
              ) : (
                <img src={item.src} alt={item.alt} loading="lazy" />
              )}
              <Ink as="figcaption" className="small">{item.caption}</Ink>
              {item.kind === 'demo' && (
                // On small screens the 16:9 demo is tiny; this opens it on its own, full screen.
                <a className="demo-open" href={item.src} target="_blank" rel="noopener noreferrer">
                  OPEN FULL SCREEN ↗
                </a>
              )}
            </figure>
          ))}
        </section>
      )}

      <section className="section project-page">
        <Ink className="label">{label('What I did')}</Ink>
        <ul className="list">
          {page.contributions.map((item) => (
            <Ink key={item} as="li">{item}</Ink>
          ))}
        </ul>
      </section>

      <section className="section project-page">
        <Ink className="label">{label('Outcome')}</Ink>
        <Ink as="h2">{page.outcome}</Ink>
        <Ink className="label">Stack</Ink>
        <Ink className="small">{page.stack}</Ink>
      </section>

      <section className="section project-page">
        <Ink className="label">{label('Next project')}</Ink>
        <Link className="next-project" to={`/work/${next.slug}`}>
          <Ink as="h2">{`${next.name} →`}</Ink>
          <Ink className="small">{next.summary}</Ink>
        </Link>
      </section>
    </>
  );
}
