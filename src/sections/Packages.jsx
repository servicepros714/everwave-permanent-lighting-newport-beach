/* Packages as boarding-pass tickets (perforated stub with Seasonal / Permanent price rows),
   add-ons as a dotted-leader price menu, and one Book Now button. */
import { Link } from 'react-router-dom';
import { ADDONS, PACKAGES, PERMANENT_NOTES, SERVICES, STORY_OPTIONS } from '../data/business.js';
import { addonLabel, priceLabel } from '../lib/pricing.js';
import { riseDelay } from '../lib/useReveal.js';
import { ArrowRight, CheckIcon, SunMark } from '../components/Icons.jsx';

export function CoverageIcon({ sides }) {
  const lit = '#FDC302';
  const off = 'rgba(0,36,94,.28)';
  return (
    <svg className="cov" viewBox="0 0 120 70" aria-hidden="true" focusable="false">
      <path d="M10 38H34V64H10ZM86 38H110V64H86Z" fill="#E3EEF7" />
      <path d="M34 64V34L60 14L86 34V64Z" fill="#fff" stroke="#00245E" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 40L34 32M114 40L86 32" stroke={sides ? lit : off} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 37L60 12L90 37" fill="none" stroke={lit} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="44" width="12" height="20" rx="1.5" fill="#00245E" />
      {sides && <path d="M6 40V64M114 40V64" stroke={lit} strokeWidth="2.5" strokeDasharray="2 3" />}
    </svg>
  );
}

export default function Packages() {
  const story2 = STORY_OPTIONS.find((s) => s.pct);
  return (
    <section id="packages" className="section pk">
      <div className="container">
        <div className="sec-head" data-rise>
          <p className="eyebrow">Packages</p>
          <h2 className="h2">Pick your pass. <span className="grad-text">We handle the rest.</span></h2>
          <p className="sec-head__lead">Every package comes as a seasonal lease or a permanent install. Prices are “starting at” — your final price is confirmed at the on-site visit.</p>
        </div>

        <div className="tickets">
          {PACKAGES.map((p, i) => (
            <article key={p.id} className="ticket" data-rise style={riseDelay(i)}>
              <div className="ticket__main">
                <div className="ticket__top">
                  <span className="ticket__code">{p.code}</span>
                  <span className="ticket__route">
                    <span>Book</span><i aria-hidden="true" /><span>Install</span><i aria-hidden="true" /><span>Glow</span>
                  </span>
                </div>
                <h3 className="ticket__name">{p.name}</h3>
                <p className="ticket__cov">{p.coverage}</p>
                <ul className="ticket__list">
                  {p.features.map((f) => <li key={f}><CheckIcon size={16} />{f}</li>)}
                </ul>
              </div>
              <div className="ticket__perf" aria-hidden="true" />
              <div className="ticket__stub">
                <CoverageIcon sides={p.id !== 'front'} />
                <dl className="ticket__prices">
                  <div><dt>Seasonal</dt><dd>{priceLabel(p.price.Seasonal)}</dd></div>
                  <div><dt>Permanent</dt><dd>{priceLabel(p.price.Permanent)}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="pk__perm" data-rise>
          <SunMark size={26} />
          <p><b>Going permanent?</b> {PERMANENT_NOTES.join('. ')}.</p>
        </div>

        <div className="menu" data-rise>
          <h3 className="menu__title">Add-ons <span>— chosen in booking</span></h3>
          <ul className="menu__list">
            <li><span className="menu__name">{story2.name}</span><span className="menu__dots" aria-hidden="true" /><span className="menu__price">{story2.note}</span></li>
            {ADDONS.map((a) => (
              <li key={a.id}>
                <span className="menu__name">{a.name}{a.seasonalOnly && <em> (seasonal only)</em>}</span>
                <span className="menu__dots" aria-hidden="true" />
                <span className="menu__price">{addonLabel(a)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pk__cta" data-rise>
          <Link to="/book" className="btn btn--sun btn--lg">Book Now <ArrowRight size={18} /></Link>
        </div>
        <p className="pk__links" data-rise>
          Learn more: {SERVICES.map((s, i) => <span key={s.slug}>{i > 0 && ' · '}<Link to={`/services/${s.slug}`}>{s.name}</Link></span>)}
        </p>
      </div>
    </section>
  );
}
