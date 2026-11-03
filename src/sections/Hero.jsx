/* Editorial type hero: oversized headline with scene capsules set inside the words,
   live "next open install" chip, drifting wave layers at the bottom edge. */
import { Link } from 'react-router-dom';
import NightScene from '../components/NightScene.jsx';
import { BUSINESS, DEPOSIT } from '../data/business.js';
import { useAvailability } from '../lib/useAvailability.js';
import { firstOpenSlot, fmtDate } from '../lib/time.js';
import { useSectionNav } from '../components/Nav.jsx';
import { ArrowRight, CalendarIcon } from '../components/Icons.jsx';

function Capsule({ scene, label, className = '' }) {
  return (
    <span className={`cap ${className}`} aria-hidden="true">
      <NightScene {...scene} slice label={label} className="cap__img" />
    </span>
  );
}

export function Waves({ className = '' }) {
  return (
    <div className={`waves ${className}`} aria-hidden="true">
      <svg className="waves__l waves__l1" viewBox="0 0 2880 120" preserveAspectRatio="none">
        <path d="M0 62C240 32 480 32 720 62S1200 92 1440 62S1920 32 2160 62S2640 92 2880 62V120H0Z" />
      </svg>
      <svg className="waves__l waves__l2" viewBox="0 0 2880 120" preserveAspectRatio="none">
        <path d="M0 76C120 54 240 54 360 76S600 98 720 76S960 54 1080 76S1320 98 1440 76S1680 54 1800 76S2040 98 2160 76S2400 54 2520 76S2760 98 2880 76V120H0Z" />
      </svg>
      <svg className="waves__l waves__l3" viewBox="0 0 2880 120" preserveAspectRatio="none">
        <path d="M0 92C240 78 480 78 720 92S1200 106 1440 92S1920 78 2160 92S2640 106 2880 92V120H0Z" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const { booked, status } = useAvailability();
  const next = status === 'loading' ? null : firstOpenSlot(booked);
  const go = useSectionNav();

  return (
    <section id="hero" className="hero">
      <div className="hero__sky" aria-hidden="true">
        <span className="hero__rays" />
        <span className="hero__sun" />
      </div>
      <div className="container hero__inner">
        <p className="eyebrow eyebrow--light hero__eyebrow" data-rise style={{ '--rise-delay': '40ms' }}>
          {BUSINESS.city} · Permanent &amp; Christmas lighting
        </p>
        <h1 className="hero__title">
          <span className="hero__line" data-rise style={{ '--rise-delay': '120ms' }}>
            Light it once
            <Capsule className="cap--a" scene={{ house: 'beach', lights: 'warm', palms: true, water: true }} />
          </span>
          <span className="hero__line" data-rise style={{ '--rise-delay': '230ms' }}>
            <Capsule className="cap--b" scene={{ house: 'modern', lights: 'brand', palms: true }} />
            let it <span className="grad-text">glow</span>
          </span>
          <span className="hero__line" data-rise style={{ '--rise-delay': '320ms' }}>
            every season
            <Capsule className="cap--c" scene={{ house: 'spanish', lights: 'multi', bushes: true }} />
          </span>
        </h1>
        <p className="hero__sub" data-rise style={{ '--rise-delay': '420ms' }}>
          Permanent LED roofline lighting and done-for-you holiday installs for {BUSINESS.city} homes.
          We design it, hang it, keep it shining, and take seasonal lights down after the holidays.
        </p>
        <div className="hero__ctas" data-rise style={{ '--rise-delay': '500ms' }}>
          <Link to="/book" className="btn btn--sun btn--lg">Book Online <ArrowRight size={18} /></Link>
          <a href="/#packages" className="btn btn--ghost-light btn--lg" onClick={(e) => { e.preventDefault(); go('packages'); }}>See packages</a>
        </div>
        <div className="hero__chip" data-rise style={{ '--rise-delay': '580ms' }} aria-live="polite">
          <span className={`hero__dot${status === 'live' ? ' is-live' : ''}`} aria-hidden="true" />
          <CalendarIcon size={17} />
          {status === 'loading' && <span>Checking open install days…</span>}
          {status !== 'loading' && next && (
            <span>{status === 'live' ? 'Next open install' : 'Earliest install date'}: <b>{fmtDate(next.date)}</b> · {next.window.part}</span>
          )}
          {status !== 'loading' && !next && <span>This season is full — call us for next year.</span>}
        </div>
        <ul className="hero__facts" data-rise style={{ '--rise-delay': '640ms' }}>
          <li>Permanent or seasonal</li>
          <li>${DEPOSIT} deposit applied to your invoice</li>
          <li>Installs Oct 20 – Dec 20</li>
        </ul>
      </div>
      <Waves className="hero__waves" />
    </section>
  );
}
