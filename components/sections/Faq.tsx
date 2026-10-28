import { Logo } from "../Logo";
import { Plus } from "../icons";
import { Words } from "../Motion";

const QA = [
  ["When does it launch?", "In the next couple of weeks, on iPhone first. Waitlist members get access before the public launch."],
  ["Is it free?", "Everyone on the waitlist gets their first month free."],
  ["Is there an Android version?", "Not yet. iPhone comes first. Join the waitlist and you'll hear if that changes."],
  ["Do I need Canvas?", "No. Canvas sync is optional. Nowline plans your day just fine without it."],
  ["Does Nowie send messages on its own?", "Never. Nowie can draft a text or set up an event, but nothing goes out until you tap send."],
];

export function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="faq__head" data-reveal>
        <p className="eyebrow">FAQ</p>
        <h2 className="h3 chroma"><Words text="Quick answers." /></h2>
      </div>
      <div className="faq__list gl" data-reveal>
        {QA.map(([q, a]) => (
          <details key={q} className="faq__item">
            <summary>
              <span>{q}</span>
              <span className="faq__ic" aria-hidden="true"><Plus size={16} /></span>
            </summary>
            <div className="faq__a"><p>{a}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot__row">
        <Logo size={30} />
        <nav className="foot__links" aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="mailto:hello@nowline.org">hello@nowline.org</a>
          <a href="#waitlist">Join the waitlist</a>
        </nav>
      </div>
      <div className="foot__row foot__row--small">
        <span>Made by a student at ASU.</span>
        <span>© {new Date().getFullYear()} Nowline</span>
      </div>
      <div className="foot__giant" data-t="Nowline" aria-hidden="true">Nowline</div>
    </footer>
  );
}
