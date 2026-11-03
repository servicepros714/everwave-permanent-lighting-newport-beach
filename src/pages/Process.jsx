import { Link } from 'react-router-dom';
import { DEPOSIT, LEAD_HOURS, quoteLabel } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { ArrowRight, CheckIcon } from '../components/Icons.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import Season from '../sections/Season.jsx';
import FinalCta from '../sections/FinalCta.jsx';
import { riseDelay } from '../lib/useReveal.js';

/* Step detail — every line restates something already confirmed elsewhere on the site. */
const DETAIL = [
  {
    title: 'Book online',
    items: [
      'Choose permanent lighting or seasonal Christmas lights',
      'Pick Front Only or Front & Sides coverage, your home height and any add-ons',
      `Choose an install date (Oct 20 – Dec 20, from ${LEAD_HOURS} hours out) and a morning or afternoon window`,
      `Reserve with a $${DEPOSIT} deposit applied to your invoice — or choose to pay at the visit`,
    ],
  },
  {
    title: 'We design it with you',
    items: [
      'We walk your roofline with you at the visit',
      'We check where your outdoor outlets are and how many runs they can support',
      'If an outlet is missing or too far away, we tell you before anything is installed',
      'We confirm the design and the final price with you',
    ],
  },
  {
    title: 'We install',
    items: [
      'Our crew hangs and tests every run',
      'Seasonal installs include timer setup; permanent systems run from a controller we show you how to use',
      'We leave the yard clean',
    ],
  },
  {
    title: 'Maintenance & takedown',
    items: [
      'Seasonal installs include in-season maintenance and bulb replacement',
      'Seasonal lights come down after the holidays — we contact you to schedule a takedown day',
      'Permanent lights simply stay up, ready for next year',
    ],
  },
];

export default function Process() {
  return (
    <Page path="/process">
      <PageHero
        path="/process"
        eyebrow="Our process"
        title={<>From booking to <span className="grad-text">glow</span>, step by step</>}
        lead="A clear, predictable process: you book online, we confirm the design and price with you at the visit, and our crew handles the ladders."
      >
        <Link to="/book" className="btn btn--sun btn--lg">Book Online <ArrowRight size={18} /></Link>
        <Link to="/quote" className="btn btn--ghost-light btn--lg">{quoteLabel()}</Link>
      </PageHero>

      <HowItWorks />

      <section className="section psec psec--mist">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">In detail</p>
            <h2 className="h2">What happens <span className="grad-text">at each step</span>.</h2>
          </div>
          <ol className="steplist">
            {DETAIL.map((d, i) => (
              <li key={d.title} className="steplist__item" data-rise style={riseDelay(i)}>
                <span className="steplist__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{d.title}</h3>
                  <ul className="checklist">{d.items.map((x) => <li key={x}><CheckIcon size={16} />{x}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section psec">
        <div className="container">
          <div className="sec-head" data-rise>
            <p className="eyebrow">Before install day</p>
            <h2 className="h2">What we need <span className="grad-text">from you</span>.</h2>
          </div>
          <div className="cardgrid">
            <div className="card" data-rise style={riseDelay(0)}>
              <h3>An outdoor outlet</h3>
              <p>Your lights run from an existing exterior outlet. We check it at the visit and tell you before installing if anything is missing.</p>
            </div>
            <div className="card" data-rise style={riseDelay(1)}>
              <h3>Access to the roofline</h3>
              <p>Clear access to the areas being lit — gates, side yards and the roofline — so our crew can work safely.</p>
            </div>
            <div className="card" data-rise style={riseDelay(2)}>
              <h3>Flexibility on weather</h3>
              <p>If rain or wind makes roof work unsafe, we call you to move your window to the next open day.</p>
            </div>
          </div>
        </div>
      </section>

      <Season />
      <FinalCta />
    </Page>
  );
}
