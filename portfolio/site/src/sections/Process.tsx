import { Ink } from '../components/Ink';
import { process } from '../content/portfolio';

export function Process() {
  return (
    <section data-magnet="04" data-magnet-title="Process" data-notes="process" className="section" id="process">
      <Ink className="label">04 / Process</Ink>
      <Ink as="h2">{process.title}</Ink>
      {process.steps.map((step) => (
        <div key={step.index} className="step">
          <Ink as="h3">{`${step.index} — ${step.title}`}</Ink>
          <Ink>{step.body}</Ink>
        </div>
      ))}
    </section>
  );
}
