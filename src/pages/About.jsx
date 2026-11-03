/* About — built from confirmed facts only. The owner story, founding year and credentials
   appear automatically once they are added to ABOUT in src/data/business.js. */
import { Link } from 'react-router-dom';
import { ABOUT, BUSINESS, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { ContactDetails } from '../components/Contact.jsx';
import { ArrowRight, CheckIcon } from '../components/Icons.jsx';
import ServiceArea from '../sections/ServiceArea.jsx';
import FinalCta from '../sections/FinalCta.jsx';
import { riseDelay } from '../lib/useReveal.js';

const VALUES = [
  { title: 'Clear pricing', text: 'Packages are listed with “starting at” prices or quoted online, and your final price is confirmed with you at the visit — before anything is installed.' },
  { title: 'No surprises on site', text: 'We check your outdoor outlets at the visit. If one is missing or too far away, we tell you before we install.' },
  { title: 'Done for you', text: 'Design, installation, timer or controller setup, in-season maintenance and — for seasonal lights — takedown after the holidays.' },
  { title: 'Honest reviews only', text: 'You won’t find made-up ratings or testimonials here. Real customer reviews will appear once this season’s installs wrap up.' },
];

export default function About() {
  return (
    <Page path="/about">
      <PageHero
        path="/about"
        eyebrow="About us"
        title={<>About <span className="grad-text">{BUSINESS.name}</span></>}
        lead={`A ${BUSINESS.city}-based lighting company installing permanent roofline lighting and Christmas lights for homes along the coast and in nearby Orange County cities.`}
      />

      <section className="section psec">
        <div className="container split split--text">
          <div data-rise>
            <p className="eyebrow">Who we are</p>
            <h2 className="h2">Lighting the coast, <span className="grad-text">one roofline at a time</span>.</h2>
          </div>
          <div data-rise style={{ '--rise-delay': '120ms' }}>
            <p className="psec__p">
              {BUSINESS.name} designs and installs two kinds of home lighting: permanent LED roofline lighting that is mounted
              once and stays up all year, and seasonal Christmas lights that we lease, install, maintain and take down after the holidays.
            </p>
            <p className="psec__p">
              We are based in {BUSINESS.city}. Our crew installs along the coast — from Huntington Beach to Laguna Beach — and in
              nearby inland cities. You can book your install window online in a few minutes, or <Link to="/contact">get in touch</Link> first.
            </p>
            {ABOUT.story.map((p) => <p key={p.slice(0, 24)} className="psec__p">{p}</p>)}
            {ABOUT.founded && <p className="psec__p"><b>Serving homeowners since {ABOUT.founded}.</b></p>}
            {ABOUT.credentials.length > 0 && (
              <ul className="checklist">{ABOUT.credentials.map((c) => <li key={c}><CheckIcon size={16} />{c}</li>)}</ul>
            )}
            <div className="psec__btns">
              <Link to="/services" className="btn btn--navy">Our services <ArrowRight size={18} /></Link>
              <Link to="/process" className="btn btn--ghost-dark">How we work</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section psec psec--mist">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">How we work</p>
            <h2 className="h2">What you can <span className="grad-text">count on</span>.</h2>
          </div>
          <div className="cardgrid cardgrid--4">
            {VALUES.map((v, i) => (
              <div key={v.title} className="card" data-rise style={riseDelay(i)}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section psec">
        <div className="container split split--text">
          <div data-rise>
            <p className="eyebrow">Business details</p>
            <h2 className="h2">Get in <span className="grad-text">touch</span>.</h2>
            <p className="psec__p">Questions about your home, your outlets or the service area? We’re happy to help.</p>
            <div className="psec__btns">
              <Link to="/contact" className="btn btn--navy">Contact us <ArrowRight size={18} /></Link>
              <Link to="/quote" className="btn btn--ghost-dark">{quoteLabel()}</Link>
            </div>
          </div>
          <div data-rise style={{ '--rise-delay': '120ms' }}><ContactDetails /></div>
        </div>
      </section>

      <ServiceArea />
      <FinalCta />
    </Page>
  );
}
