import { CalendarIcon, CanvasIcon, GeminiIcon, MessagesIcon, NotifyIcon, RemindersIcon, SiriIcon, SwiftIcon } from "../brand-icons";
import { Words } from "../Motion";

const ITEMS = [
  { name: "Canvas", what: "Due dates sync in", Icon: CanvasIcon },
  { name: "Notifications", what: "Reply by voice", Icon: NotifyIcon },
  { name: "Calendar", what: "Events land here", Icon: CalendarIcon },
  { name: "Siri", what: "“Tell Nowline…”", Icon: SiriIcon },
  { name: "Messages", what: "Drafts you approve", Icon: MessagesIcon },
  { name: "Reminders", what: "Set for you", Icon: RemindersIcon },
  { name: "Gemini", what: "Handles the hard asks", Icon: GeminiIcon },
  { name: "SwiftUI", what: "Native to iPhone", Icon: SwiftIcon },
];

export function WorksWith() {
  return (
    <section className="ww" id="works">
      <div className="ww__head" data-reveal>
        <p className="eyebrow">Works with</p>
        <h2 className="h3 chroma"><Words text="Plays well with the apps" /><br /><Words text="you already live in." start={5} /></h2>
      </div>
      <div className="ww__rail gl" data-reveal>
        <div className="ww__view">
          <ul className="ww__track">
            {[0, 1].map((k) =>
              ITEMS.map(({ name, what, Icon }) => (
                <li key={`${k}-${name}`} className="ww__it" aria-hidden={k === 1}>
                  <span className="ww__ic"><Icon size={30} /></span>
                  <span className="ww__txt"><b>{name}</b><span>{what}</span></span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <p className="ww__note" data-reveal>Names and marks belong to their owners. Nowline isn&apos;t affiliated with them.</p>
    </section>
  );
}
