import { Ink } from '../components/Ink';
import { capabilities } from '../content/portfolio';

export function Capabilities() {
  return (
    <section data-magnet="05" data-magnet-title="Capabilities" data-notes="capabilities" className="section">
      <Ink className="label">05 / Capabilities</Ink>
      {capabilities.map((capability) => (
        <div key={capability.title} className="detail">
          <Ink as="h3">{capability.title}</Ink>
          <Ink className="small">{capability.items}</Ink>
        </div>
      ))}
    </section>
  );
}
