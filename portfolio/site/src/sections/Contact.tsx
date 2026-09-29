import { Ink } from '../components/Ink';
import { contact } from '../content/portfolio';

export function Contact() {
  return (
    <section data-magnet="08" data-magnet-title="Contact" data-notes="contact" className="section" id="contact">
      <Ink className="label">08 / Contact</Ink>
      <Ink as="h2">{contact.title}</Ink>
      <Ink>{contact.body}</Ink>
      <a className="contact-email" href={`mailto:${contact.email}`}>
        {contact.email}
      </a>
      <div className="actions">
        {contact.links.map((link) => (
          <a key={link.label} className="button" href={link.href}>
            {link.label.toUpperCase()}
          </a>
        ))}
      </div>
    </section>
  );
}
