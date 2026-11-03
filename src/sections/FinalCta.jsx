/* Final CTA — sunrise over the water. */
import { Link } from 'react-router-dom';
import { BUSINESS, hasPhone, quoteLabel } from '../data/business.js';
import { ArrowRight, PhoneIcon } from '../components/Icons.jsx';

export default function FinalCta() {
  return (
    <section className="cta">
      <div className="cta__sky" aria-hidden="true"><span className="cta__rays" /><span className="cta__sun" /></div>
      <div className="container cta__inner" data-rise>
        <p className="eyebrow eyebrow--light">Ready when you are</p>
        <h2 className="cta__title">Your roofline, <span className="grad-text">lit by Everwave.</span></h2>
        <p className="cta__sub">
          {hasPhone()
            ? 'Pick a window online in a couple of minutes, or call and we’ll plan it with you.'
            : 'Pick a window online in a couple of minutes, or ask for a quote first.'}
        </p>
        <div className="cta__btns">
          <Link to="/book" className="btn btn--sun btn--lg">Book Online <ArrowRight size={18} /></Link>
          {hasPhone()
            ? <a href={BUSINESS.phoneHref} className="btn btn--ghost-light btn--lg"><PhoneIcon size={18} /> {BUSINESS.phoneDisplay}</a>
            : <Link to="/quote" className="btn btn--ghost-light btn--lg">{quoteLabel()}</Link>}
        </div>
      </div>
    </section>
  );
}
