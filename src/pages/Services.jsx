import { Link } from 'react-router-dom';
import { BUSINESS, SERVICES, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import NightScene from '../components/NightScene.jsx';
import { ArrowRight, CheckIcon } from '../components/Icons.jsx';
import Packages from '../sections/Packages.jsx';
import ServiceArea from '../sections/ServiceArea.jsx';
import FinalCta from '../sections/FinalCta.jsx';
import { riseDelay } from '../lib/useReveal.js';

export const SCENES = {
  Permanent: { house: 'modern', lights: 'brand', palms: true },
  Seasonal: { house: 'beach', lights: 'warm', palms: true, water: true },
};

export function ServiceCards() {
  return (
    <div className="svc">
      {SERVICES.map((s, i) => (
        <article key={s.slug} className="svc__card" data-rise style={riseDelay(i)}>
          <div className="svc__media">
            <NightScene {...SCENES[s.type]} slice className="svc__img" label={`Illustrated design preview: ${s.short}`} />
            <span className="tag tag--glass svc__tag">Illustration</span>
          </div>
          <div className="svc__body">
            <p className="svc__kicker">{s.tagline}</p>
            <h3 className="svc__name"><Link to={`/services/${s.slug}`}>{s.name}</Link></h3>
            <p className="svc__sum">{s.summary}</p>
            <ul className="checklist">
              {s.points.slice(0, 3).map((p) => <li key={p}><CheckIcon size={16} />{p}</li>)}
            </ul>
            <Link to={`/services/${s.slug}`} className="btn btn--navy svc__btn" aria-label={`Learn more about ${s.name}`}>
              Learn more <ArrowRight size={18} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Services() {
  return (
    <Page path="/services">
      <PageHero
        path="/services"
        eyebrow={`Services · ${BUSINESS.city}`}
        title={<>Permanent &amp; Christmas lighting for <span className="grad-text">{BUSINESS.city}</span> homes</>}
        lead="Two ways to light your home: permanent LED roofline lighting that stays up all year, or seasonal Christmas lights we install, maintain and take down for you."
      >
        <Link to="/book" className="btn btn--sun btn--lg">Book Online <ArrowRight size={18} /></Link>
        <Link to="/quote" className="btn btn--ghost-light btn--lg">{quoteLabel()}</Link>
      </PageHero>

      <section className="section psec">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">What we do</p>
            <h2 className="h2">Choose how you <span className="grad-text">light up</span>.</h2>
            <p className="sec-head__lead">Both services cover the front of the home, or the front and sides, on 1-story and 2-story homes. Every design is confirmed with you at the visit.</p>
          </div>
          <ServiceCards />
        </div>
      </section>

      <Packages />
      <ServiceArea />
      <FinalCta />
    </Page>
  );
}
