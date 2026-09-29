import { useState } from 'react';
import { Link } from 'react-router';
import { FlagPreview } from '../components/FlagPreview';
import { Ink } from '../components/Ink';
import { projects, type Project } from '../content/portfolio';
import { useMotion } from '../motion/context';

const DETAILS: { key: keyof Pick<Project, 'role' | 'stack' | 'owned' | 'outcome'>; label: string }[] = [
  { key: 'role', label: 'Role' },
  { key: 'stack', label: 'Stack' },
  { key: 'owned', label: 'What I owned' },
  { key: 'outcome', label: 'Outcome' },
];

export function SelectedWork() {
  const { calm } = useMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="section" id="work">
      <Ink className="label">03 / Selected work</Ink>
      {/* Each project opens its page; hovering shows its preview as a flag following the cursor. */}
      {projects.map((project) => (
        <Link
          key={project.key}
          to={`/work/${project.slug}`}
          id={project.slug}
          className="project"
          data-magnet="03"
          data-magnet-title="Selected work"
          data-notes={project.key}
          onPointerEnter={() => setHovered(project.preview)}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered(project.preview)}
          onBlur={() => setHovered(null)}
        >
          <Ink className="label">{`${project.index} / ${project.category}`}</Ink>
          <Ink as="h2">{project.name}</Ink>
          <Ink>{project.summary}</Ink>
          {DETAILS.map(({ key, label }) =>
            project[key] ? (
              <div key={key} className="detail">
                <Ink className="label">{label}</Ink>
                <Ink className="small">{project[key]}</Ink>
              </div>
            ) : null,
          )}
          {project.metrics?.map((metric) => (
            <Ink key={metric} className="small metric">{metric}</Ink>
          ))}
        </Link>
      ))}
      <FlagPreview image={hovered} calm={calm} />
    </section>
  );
}
