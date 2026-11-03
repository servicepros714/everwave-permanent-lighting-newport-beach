/* FAQ — topic filter pills + accordion. `topics` limits the questions (e.g. on service pages). */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS, FAQ_TOPICS } from '../data/business.js';

export default function Faq({ topics = null, eyebrow = 'FAQ', moreLink = false }) {
  const pool = FAQS.map((f, i) => ({ ...f, i })).filter((f) => !topics || topics.includes(f.topic));
  const tabs = ['All', ...FAQ_TOPICS.filter((t) => t !== 'All' && pool.some((f) => f.topic === t))];
  const [topic, setTopic] = useState('All');
  const [open, setOpen] = useState(pool.length ? pool[0].i : -1);
  const list = pool.filter((f) => topic === 'All' || f.topic === topic);
  return (
    <section id="faq" className="section faq">
      <div className="container faq__grid">
        <div className="faq__side" data-rise>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">Questions, <span className="grad-text">answered</span>.</h2>
          {tabs.length > 2 && (
            <div className="pills" role="group" aria-label="Filter questions by topic">
              {tabs.map((t) => (
                <button key={t} type="button" className={`pill${topic === t ? ' is-on' : ''}`} aria-pressed={topic === t} onClick={() => { setTopic(t); setOpen(-1); }}>
                  {t}
                </button>
              ))}
            </div>
          )}
          {moreLink && <p className="faq__more"><Link to="/faq">See all questions</Link> · <Link to="/contact">Ask us something else</Link></p>}
        </div>
        <ul className="acc" data-rise style={{ '--rise-delay': '120ms' }}>
          {list.map((f) => {
            const isOpen = open === f.i;
            return (
              <li key={f.i} className={`acc__item${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button type="button" className="acc__q" aria-expanded={isOpen} aria-controls={`faq-${f.i}`} id={`faq-q-${f.i}`} onClick={() => setOpen(isOpen ? -1 : f.i)}>
                    <span className="acc__topic">{f.topic}</span>
                    <span className="acc__text">{f.q}</span>
                    <span className="acc__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="acc__a" id={`faq-${f.i}`} role="region" aria-labelledby={`faq-q-${f.i}`} hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
