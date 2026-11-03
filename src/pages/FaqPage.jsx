import { Link } from 'react-router-dom';
import { BUSINESS, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { ArrowRight } from '../components/Icons.jsx';
import Faq from '../sections/Faq.jsx';
import FinalCta from '../sections/FinalCta.jsx';

export default function FaqPage() {
  return (
    <Page path="/faq">
      <PageHero
        path="/faq"
        eyebrow="FAQ"
        title={<>Frequently asked <span className="grad-text">questions</span></>}
        lead={`Pricing, deposits, outdoor outlets, timers, takedown, weather and where we work — everything ${BUSINESS.city} homeowners ask us most.`}
      />
      <Faq eyebrow="All questions" />
      <section className="section psec">
        <div className="container">
          <div className="crosslink crosslink--static" data-rise>
            <span className="crosslink__k">Still have a question?</span>
            <span className="crosslink__t">We’re happy to help.</span>
            <span className="crosslink__s">Ask us about your home, your outlets or whether your street is on our route.</span>
            <span className="psec__btns">
              <Link to="/contact" className="btn btn--navy">Contact us <ArrowRight size={18} /></Link>
              <Link to="/quote" className="btn btn--ghost-dark">{quoteLabel()}</Link>
            </span>
          </div>
        </div>
      </section>
      <FinalCta />
    </Page>
  );
}
