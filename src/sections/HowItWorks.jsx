/* How it works — four steps with tide-fill badges that fill up as they enter the viewport. */
import { Link } from 'react-router-dom';
import { STEPS } from '../data/business.js';
import { ArrowRight } from '../components/Icons.jsx';
import { riseDelay } from '../lib/useReveal.js';

export default function HowItWorks({ more = false }) {
  return (
    <section id="how" className="section how">
      <div className="container">
        <div className="sec-head sec-head--center" data-rise>
          <p className="eyebrow">How it works</p>
          <h2 className="h2">Four steps from booking to <span className="grad-text">glow</span>.</h2>
        </div>
        <ol className="how__steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className="how__step" data-rise style={riseDelay(i)}>
              <span className="tide" aria-hidden="true">
                <span className="tide__water" />
                <span className="tide__num">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        {more && <p className="how__more" data-rise><Link to="/process" className="btn btn--ghost-dark">See our full process <ArrowRight size={18} /></Link></p>}
      </div>
    </section>
  );
}
