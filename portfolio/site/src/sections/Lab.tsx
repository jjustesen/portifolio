import { Ink } from '../components/Ink';
import { lab } from '../content/portfolio';

export function Lab() {
  return (
    <section data-magnet="07" data-magnet-title="Lab" data-notes="lab" className="section" id="lab">
      <Ink className="label">07 / Lab</Ink>
      <Ink as="h2">Lab</Ink>
      <Ink>{lab.intro}</Ink>
      <ul className="list">
        {lab.items.map((item) => (
          <Ink key={item} as="li" className="small">{item}</Ink>
        ))}
      </ul>
    </section>
  );
}
