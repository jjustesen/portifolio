import { Ink } from '../components/Ink';
import { experience } from '../content/portfolio';

export function Experience() {
  return (
    <section data-magnet="06" data-magnet-title="Experience" data-notes="experience" className="section" id="experience">
      <Ink className="label">06 / Experience</Ink>
      <div className="experience-list">
        {experience.map((role) => (
          <div key={role.period} className="experience-row">
            <Ink className="label">{role.period}</Ink>
            <Ink as="h3">{role.title}</Ink>
            <Ink className="small">{role.scope}</Ink>
          </div>
        ))}
      </div>
    </section>
  );
}
