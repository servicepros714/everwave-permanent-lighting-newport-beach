/* FAQ — topic filter pills + accordion. */
import { useState } from 'react';
import { FAQS, FAQ_TOPICS } from '../data/business.js';

export default function Faq() {
  const [topic, setTopic] = useState('All');
  const [open, setOpen] = useState(0);
  const list = FAQS.map((f, i) => ({ ...f, i })).filter((f) => topic === 'All' || f.topic === topic);
  return (
    <section id="faq" className="section faq">
      <div className="container faq__grid">
        <div className="faq__side" data-rise>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2">Questions, <span className="grad-text">answered</span>.</h2>
          <div className="pills" role="group" aria-label="Filter questions by topic">
            {FAQ_TOPICS.map((t) => (
              <button key={t} type="button" className={`pill${topic === t ? ' is-on' : ''}`} aria-pressed={topic === t} onClick={() => { setTopic(t); setOpen(-1); }}>
                {t}
              </button>
            ))}
          </div>
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
