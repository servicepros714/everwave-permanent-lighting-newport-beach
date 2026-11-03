/* Individual service page (/services/permanent-lighting, /services/christmas-lights). */
import { Link } from 'react-router-dom';
import { BUSINESS, DEPOSIT, PACKAGES, PERMANENT_NOTES, SERVICES, STORY_OPTIONS, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import NightScene from '../components/NightScene.jsx';
import { ArrowRight, CheckIcon, SunMark } from '../components/Icons.jsx';
import { addonLabel, priceLabel, visibleAddons } from '../lib/pricing.js';
import HowItWorks from '../sections/HowItWorks.jsx';
import Faq from '../sections/Faq.jsx';
import FinalCta from '../sections/FinalCta.jsx';
import { SCENES } from './Services.jsx';

export default function ServiceDetail({ slug }) {
  const s = SERVICES.find((x) => x.slug === slug);
  const other = SERVICES.find((x) => x.slug !== slug);
  const path = `/services/${s.slug}`;
  const story2 = STORY_OPTIONS.find((o) => o.pct);
  const permanent = s.type === 'Permanent';

  return (
    <Page path={path}>
      <PageHero
        path={path}
        eyebrow={`${s.short} · ${BUSINESS.city}, ${BUSINESS.region}`}
        title={<>{s.name} in <span className="grad-text">{BUSINESS.city}</span></>}
        lead={s.summary}
      >
        <Link to={`/book?type=${s.type}`} className="btn btn--sun btn--lg">Book {s.short.toLowerCase()} <ArrowRight size={18} /></Link>
        <Link to="/quote" className="btn btn--ghost-light btn--lg">{quoteLabel()}</Link>
      </PageHero>

      <section className="section psec">
        <div className="container split">
          <div data-rise>
            <p className="eyebrow">What’s included</p>
            <h2 className="h2">{s.tagline}</h2>
            <ul className="checklist checklist--lg">
              {s.points.map((p) => <li key={p}><CheckIcon size={16} />{p}</li>)}
            </ul>
            {permanent ? (
              <div className="note">
                <SunMark size={24} />
                <p><b>Going permanent?</b> {PERMANENT_NOTES.join('. ')}.</p>
              </div>
            ) : (
              <div className="note">
                <SunMark size={24} />
                <p><b>Install season:</b> October 20 – December 20, every day, in morning or afternoon windows. Seasonal lights come down after the holidays — we contact you to schedule takedown.</p>
              </div>
            )}
          </div>
          <figure className="split__media" data-rise style={{ '--rise-delay': '120ms' }}>
            <NightScene {...SCENES[s.type]} slice className="split__img" label={`Illustrated design preview: ${s.name}`} />
            <figcaption>Illustrated design preview — not a photo of a completed install.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section psec psec--mist">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">Pricing</p>
            <h2 className="h2">How {s.short.toLowerCase()} is <span className="grad-text">priced</span>.</h2>
            <p className="sec-head__lead">
              Prices are “starting at”. The booking form shows your estimate as you choose, and the final price is confirmed with you at the visit.
              Reserve with a ${DEPOSIT} deposit (applied to your invoice) or pay at the visit.
            </p>
          </div>
          <div className="pricegrid" data-rise>
            <div className="pricecard">
              <h3>Packages</h3>
              <ul className="pricelist">
                {PACKAGES.map((p) => <li key={p.id}><span>{p.name}<em>{p.coverage}</em></span><b>{priceLabel(p.price[s.type])}</b></li>)}
                <li><span>{story2.name}</span><b>{story2.note}</b></li>
              </ul>
            </div>
            <div className="pricecard">
              <h3>Add-ons</h3>
              <ul className="pricelist">
                {visibleAddons(s.type).map((a) => <li key={a.id}><span>{a.name}</span><b>{addonLabel(a)}</b></li>)}
              </ul>
            </div>
          </div>
          <p className="psec__more" data-rise><Link to="/quote">How quotes work</Link> · <Link to="/services">Compare both services</Link></p>
        </div>
      </section>

      <HowItWorks more />
      <Faq topics={s.faqTopics} moreLink />

      <section className="section psec">
        <div className="container">
          <Link to={`/services/${other.slug}`} className="crosslink" data-rise>
            <span className="crosslink__k">Also from Everwave</span>
            <span className="crosslink__t">{other.name}</span>
            <span className="crosslink__s">{other.summary}</span>
            <span className="crosslink__go">Learn more <ArrowRight size={18} /></span>
          </Link>
        </div>
      </section>

      <FinalCta />
    </Page>
  );
}
