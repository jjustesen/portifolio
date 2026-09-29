import { Ink } from '../components/Ink';
import { manifesto } from '../content/portfolio';

export function Manifesto() {
  return (
    <section data-magnet="02" data-magnet-title="Manifesto" data-notes="manifesto" className="section">
      <Ink className="label">02 / Manifesto</Ink>
      <Ink as="h2">{manifesto.statement}</Ink>
      <Ink>{manifesto.support}</Ink>
    </section>
  );
}
