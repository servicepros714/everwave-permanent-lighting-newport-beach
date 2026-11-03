/* Quote page — explains exactly how pricing works (from the site's own pricing data) and offers
   two honest paths: the online booking flow (estimate as you go, nothing due if you pay at the visit)
   or a quote request by email. "Free" only appears once BUSINESS.freeQuote is confirmed. */
import { Link } from 'react-router-dom';
import { BUSINESS, DEPOSIT, STORY_OPTIONS, hasEmail, hasPhone, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { RequestForm } from '../components/Contact.jsx';
import { ArrowRight, CheckIcon, PhoneIcon } from '../components/Icons.jsx';
import Packages from '../sections/Packages.jsx';
import Faq from '../sections/Faq.jsx';
import { riseDelay } from '../lib/useReveal.js';

const HOW = [
  { title: 'Pick a package', text: 'Front Only or Front & Sides, as permanent lighting or seasonal Christmas lights. Prices are “starting at” or quoted online.' },
  { title: 'Tell us about your home', text: `${STORY_OPTIONS.map((o) => o.name + (o.pct ? ` (${o.note})` : '')).join(' or ')}, plus any add-ons like tree wrapping, wreaths or pathway lights.` },
  { title: 'Confirm at the visit', text: 'We walk your roofline, check your outlets and confirm the design and final price with you before anything is installed.' },
];

export default function Quote() {
  return (
    <Page path="/quote">
      <PageHero
        path="/quote"
        eyebrow={`Quotes · ${BUSINESS.city}`}
        title={<>{quoteLabel().replace(/Quote$/, '')}<span className="grad-text">quote</span></>}
        lead="See how pricing works, build your estimate online in a couple of minutes, or send us your details and we’ll get back to you."
      >
        <Link to="/book" className="btn btn--sun btn--lg">Start online <ArrowRight size={18} /></Link>
      </PageHero>

      <section className="section psec">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">How pricing works</p>
            <h2 className="h2">Three things set <span className="grad-text">your price</span>.</h2>
          </div>
          <ol className="cardgrid">
            {HOW.map((h, i) => (
              <li key={h.title} className="card card--num" data-rise style={riseDelay(i)}>
                <span className="card__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section psec psec--mist">
        <div className={`container quote${hasEmail() ? '' : ' quote--single'}`}>
          <div className="quote__online" data-rise>
            <p className="eyebrow">{hasEmail() ? 'Fastest' : 'Get your quote'}</p>
            <h2 className="h2">Build your estimate <span className="grad-text">online</span>.</h2>
            <ul className="checklist checklist--lg">
              <li><CheckIcon size={16} />Your estimate updates as you choose your package and add-ons</li>
              <li><CheckIcon size={16} />Pick an install date and a morning or afternoon window</li>
              <li><CheckIcon size={16} />Choose “I’ll pay at the visit” and nothing is due today — or reserve with a ${DEPOSIT} deposit applied to your invoice</li>
              <li><CheckIcon size={16} />The final price is confirmed with you at the visit</li>
            </ul>
            <div className="psec__btns">
              <Link to="/book" className="btn btn--sun btn--lg">Start online <ArrowRight size={18} /></Link>
              {hasPhone() && <a href={BUSINESS.phoneHref} className="btn btn--ghost-dark btn--lg"><PhoneIcon size={18} /> {BUSINESS.phoneDisplay}</a>}
            </div>
          </div>
          {/* The email request form only appears once BUSINESS.email is set. */}
          {hasEmail() && (
            <div data-rise style={{ '--rise-delay': '120ms' }}>
              <RequestForm kind="quote" />
            </div>
          )}
        </div>
      </section>

      <Packages />
      <Faq topics={['Pricing']} eyebrow="Pricing questions" moreLink />
    </Page>
  );
}
