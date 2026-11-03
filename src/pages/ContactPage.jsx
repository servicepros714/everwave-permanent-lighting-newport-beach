import { Link } from 'react-router-dom';
import { BUSINESS, hasPhone } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { ContactDetails, RequestForm } from '../components/Contact.jsx';
import { ArrowRight, PhoneIcon } from '../components/Icons.jsx';
import ServiceArea from '../sections/ServiceArea.jsx';

export default function ContactPage() {
  return (
    <Page path="/contact">
      <PageHero
        path="/contact"
        eyebrow={`Contact · ${BUSINESS.city}, ${BUSINESS.region}`}
        title={<>Contact <span className="grad-text">{BUSINESS.name}</span></>}
        lead="Questions about permanent lighting, Christmas lights, your outlets or the service area? Get in touch, or book your install window online."
      >
        {hasPhone() && <a href={BUSINESS.phoneHref} className="btn btn--sun btn--lg"><PhoneIcon size={18} /> {BUSINESS.phoneDisplay}</a>}
        <Link to="/book" className={`btn btn--lg ${hasPhone() ? 'btn--ghost-light' : 'btn--sun'}`}>Book Online <ArrowRight size={18} /></Link>
      </PageHero>

      <section className="section psec">
        <div className="container contact">
          <div data-rise>
            <h2 className="contact__h">How to reach us</h2>
            <ContactDetails />
          </div>
          <div data-rise style={{ '--rise-delay': '120ms' }}>
            <RequestForm kind="contact" />
          </div>
        </div>
      </section>

      <ServiceArea />
    </Page>
  );
}
