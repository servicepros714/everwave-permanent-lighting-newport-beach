/* Service area as a coastline map with pinned cities (Coast / Inland lists on phones). */
import { BUSINESS, SERVICE_AREA } from '../data/business.js';
import { riseDelay } from '../lib/useReveal.js';
import { PinIcon, SunMark } from '../components/Icons.jsx';

function Pin({ c, i }) {
  return (
    <li
      className={`pin pin--${c.pos || 'b'}${c.home ? ' pin--home' : ''}`}
      style={{ left: `${c.x}%`, top: `${c.y}%`, ...riseDelay(i) }}
      data-rise
    >
      <span className="pin__dot" aria-hidden="true">{c.home && <SunMark size={16} />}</span>
      <span className="pin__label">{c.name}{c.home && <em> · home base</em>}</span>
    </li>
  );
}

export default function ServiceArea() {
  const all = [...SERVICE_AREA.coast, ...SERVICE_AREA.inland];
  return (
    <section id="area" className="section area">
      <div className="container">
        <div className="area__head">
          <div data-rise>
            <p className="eyebrow">Service area</p>
            <h2 className="h2">From the harbor to the hills, <span className="grad-text">lit up</span>.</h2>
          </div>
          <p className="area__lead" data-rise style={riseDelay(1)}>
            Based in {BUSINESS.city}, our crew installs along the coast and in the nearby inland cities.
            Don’t see your city? Call us — we’ll tell you if your street is on our route.
          </p>
        </div>

        <div className="coast" data-rise style={riseDelay(2)}>
          <svg className="coast__map" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="coast-sea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0092FD" stopOpacity="0.32" />
                <stop offset="1" stopColor="#004391" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="coast-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0092FD" />
                <stop offset="0.5" stopColor="#86CF95" />
                <stop offset="0.75" stopColor="#FDE110" />
                <stop offset="1" stopColor="#F89B01" />
              </linearGradient>
            </defs>
            <path d="M0 250C120 262 200 268 300 290S420 300 450 312C470 330 500 345 540 342S620 330 660 350 760 368 820 380 920 400 1000 420V460H0Z" fill="url(#coast-sea)" />
            <path d="M0 250C120 262 200 268 300 290S420 300 450 312C470 330 500 345 540 342S620 330 660 350 760 368 820 380 920 400 1000 420" fill="none" stroke="url(#coast-line)" strokeWidth="5" strokeLinecap="round" />
            <path d="M0 300C140 310 260 318 380 340S600 380 760 410" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
            <path d="M120 120 Q 300 90 520 130 T 900 150" fill="none" stroke="#00245E" strokeOpacity="0.12" strokeWidth="1.5" strokeDasharray="6 8" />
          </svg>
          <span className="coast__ocean">Pacific Ocean</span>
          <ul className="coast__pins">
            {all.map((c, i) => <Pin key={c.name} c={c} i={i} />)}
          </ul>
        </div>

        <div className="area__lists">
          <div data-rise>
            <h3>Along the coast</h3>
            <ul>{SERVICE_AREA.coast.map((c) => <li key={c.name} className={c.home ? 'is-home' : ''}><PinIcon size={16} />{c.name}{c.home && <em>home base</em>}</li>)}</ul>
          </div>
          <div data-rise style={riseDelay(1)}>
            <h3>Inland</h3>
            <ul>{SERVICE_AREA.inland.map((c) => <li key={c.name}><PinIcon size={16} />{c.name}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
