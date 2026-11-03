/* Season as a weekly tide chart of open install windows (live from the Worker). */
import { Link } from 'react-router-dom';
import { useAvailability } from '../lib/useAvailability.js';
import { addDays, firstOpenSlot, fmtDate, monthShort, openWindows, parseIso, seasonDays, todayIso, weekday } from '../lib/time.js';
import { TIME_WINDOWS } from '../data/business.js';
import { riseDelay } from '../lib/useReveal.js';
import { ArrowRight, SunMark } from '../components/Icons.jsx';

function weeks(booked) {
  const days = seasonDays();
  const today = todayIso();
  const out = [];
  for (const d of days) {
    const wd = weekday(d);
    const monday = addDays(d, wd === 0 ? -6 : 1 - wd);
    let w = out[out.length - 1];
    if (!w || w.monday !== monday) { w = { monday, total: 0, open: 0, past: true, current: false }; out.push(w); }
    w.total += TIME_WINDOWS.length;
    w.open += openWindows(d, booked).length;
    if (d >= today) w.past = false;
    if (d === today || (today >= monday && today <= addDays(monday, 6))) w.current = true;
  }
  return out;
}

export default function Season() {
  const { booked, status } = useAvailability();
  const ready = status !== 'loading';
  const data = weeks(ready ? booked : {});
  const next = ready ? firstOpenSlot(booked) : null;
  const open = data.reduce((a, w) => a + w.open, 0);

  return (
    <section id="season" className="section season">
      <div className="container season__grid">
        <div className="season__copy" data-rise>
          <p className="eyebrow">Install season · Oct 20 – Dec 20</p>
          <h2 className="h2">The tide is coming in. <span className="grad-text">Book early.</span></h2>
          <p className="season__lead">
            We install every day of the week, two windows a day. Each bar shows how many windows are
            still open that week — December weeks go first.
          </p>
          <div className="season__badge">
            <SunMark size={30} className="season__sun" />
            <div>
              <span className="season__label">{status === 'live' ? 'Next open install' : 'Earliest install date'}</span>
              <span className="season__date">{!ready ? 'Checking…' : next ? `${fmtDate(next.date, true)} · ${next.window.part}` : 'Season full — call us'}</span>
            </div>
          </div>
          <Link to="/book" className="btn btn--navy">Pick your date <ArrowRight size={18} /></Link>
          {status === 'offline' && (
            <p className="season__warn">Live openings couldn’t load right now — the booking calendar shows exact times.</p>
          )}
        </div>

        <figure className="tidechart" data-rise style={riseDelay(1)}>
          <figcaption className="sr-only">Open install windows per week this season{ready ? `: ${open} open in total` : ''}.</figcaption>
          <ol className="tidechart__bars">
            {data.map((w, i) => {
              const [, m, d] = parseIso(w.monday);
              const pct = w.total ? Math.round((w.open / w.total) * 100) : 0;
              const state = w.past ? 'past' : w.open === 0 ? 'full' : pct < 35 ? 'low' : 'open';
              return (
                <li key={w.monday} className={`tidechart__col is-${state}${w.current ? ' is-now' : ''}`} style={{ '--h': `${Math.max(pct, 4)}%`, ...riseDelay(i) }}>
                  <span className="tidechart__val">{w.past ? '—' : ready ? w.open : ''}</span>
                  <span className="tidechart__track"><span className="tidechart__fill" /></span>
                  <span className="tidechart__wk">{monthShort(m)} {d}</span>
                  {w.current && <span className="tidechart__now">This week</span>}
                  <span className="sr-only">{w.past ? 'passed' : `${w.open} of ${w.total} windows open`}</span>
                </li>
              );
            })}
          </ol>
          <div className="tidechart__legend" aria-hidden="true">
            <span><i className="lg lg--open" />Open</span>
            <span><i className="lg lg--low" />Filling up</span>
            <span><i className="lg lg--past" />Passed / full</span>
          </div>
        </figure>
      </div>
    </section>
  );
}
