/* Booking — 6 steps: Lighting type → Package → Home & add-ons → Date → Time → Your info → /checkout.
   Sunrise-arc progress, clickable selection-chip ribbon, sticky Back/Continue bar on phones. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LIGHTING_TYPES, PACKAGES, STORY_OPTIONS, TIME_WINDOWS, BUSINESS, LEAD_HOURS } from '../data/business.js';
import { useDraft } from '../lib/draft.jsx';
import { useAvailability } from '../lib/useAvailability.js';
import { estimate, priceLabel, addonLabel, visibleAddons } from '../lib/pricing.js';
import {
  dayShort, fmtDate, iso, monthLong, openWindows, parseIso, seasonRange, slotIsBookable, firstOpenSlot, weekday,
} from '../lib/time.js';
import { ArrowLeft, ArrowRight, CheckIcon, ChevronLeft, ChevronRight, ClockIcon, CalendarIcon } from '../components/Icons.jsx';
import { CoverageIcon } from '../sections/Packages.jsx';

const STEPS = [
  { key: 'type', label: 'Lighting', title: 'How would you like your home lit?', sub: 'Permanent lights stay up all year. Seasonal lights are leased and taken down after the holidays.' },
  { key: 'package', label: 'Package', title: 'Which part of the home?', sub: 'Pick the coverage. We fine-tune the design with you at the visit.' },
  { key: 'home', label: 'Your home', title: 'Tell us about your home', sub: 'Choose the home height, then any add-ons you’d like.' },
  { key: 'date', label: 'Date', title: 'Pick your install date', sub: `Installs run Oct 20 – Dec 20, every day. The earliest open day is ${LEAD_HOURS} hours from now.` },
  { key: 'time', label: 'Time', title: 'Choose a time window', sub: 'Our crew arrives within your window (Pacific time).' },
  { key: 'info', label: 'Your info', title: 'Where should we install?', sub: 'We use these details to confirm your install window.' },
];

const fmtPhone = (v) => {
  const d = v.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/* ───────── progress arc ───────── */
function SunriseArc({ step }) {
  const n = STEPS.length;
  const pos = (i) => {
    const a = Math.PI - (Math.PI * i) / (n - 1);
    return [100 + 82 * Math.cos(a), 92 - 82 * Math.sin(a)];
  };
  const [sx, sy] = pos(step);
  const frac = step / (n - 1);
  const len = Math.PI * 82;
  return (
    <div className="arc" role="progressbar" aria-valuemin={1} aria-valuemax={n} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of ${n}: ${STEPS[step].label}`}>
      <svg viewBox="0 0 200 100" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0092FD" /><stop offset=".55" stopColor="#86CF95" /><stop offset=".8" stopColor="#FDE110" /><stop offset="1" stopColor="#F89B01" />
          </linearGradient>
          <radialGradient id="arc-sun"><stop offset="0" stopColor="#FDE110" /><stop offset="1" stopColor="#F89B01" /></radialGradient>
        </defs>
        <path d="M18 92A82 82 0 0 1 182 92" fill="none" stroke="#D5E6F3" strokeWidth="5" strokeLinecap="round" />
        <path d="M18 92A82 82 0 0 1 182 92" fill="none" stroke="url(#arc-grad)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - frac)} className="arc__fill" />
        {STEPS.map((s, i) => {
          const [x, y] = pos(i);
          return <circle key={s.key} cx={x} cy={y} r="3.2" className={i <= step ? 'arc__tick is-done' : 'arc__tick'} />;
        })}
        <line x1="6" y1="96" x2="194" y2="96" stroke="#00245E" strokeOpacity=".18" strokeWidth="1.5" />
        <g className="arc__sun" style={{ transform: `translate(${sx}px, ${sy}px)` }}>
          <circle r="12" fill="#FDC302" opacity=".22" />
          <circle r="7.5" fill="url(#arc-sun)" />
        </g>
      </svg>
      <div className="arc__label">
        <span className="arc__step">Step {step + 1} of {n}</span>
        <span className="arc__name">{STEPS[step].label}</span>
      </div>
    </div>
  );
}

/* ───────── choice card (radio / checkbox with always-visible indicator on the LEFT) ───────── */
function Choice({ type = 'radio', name, checked, onChange, title, note, aside, children, disabled, inputRef, id }) {
  return (
    <label className={`choice${checked ? ' is-on' : ''}${disabled ? ' is-disabled' : ''}`} htmlFor={id}>
      <input ref={inputRef} id={id} type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} className="choice__input" />
      <span className={`choice__ind choice__ind--${type}`} aria-hidden="true"><CheckIcon size={14} /></span>
      <span className="choice__body">
        <span className="choice__title">{title}</span>
        {note && <span className="choice__note">{note}</span>}
        {children}
      </span>
      {aside && <span className="choice__aside">{aside}</span>}
    </label>
  );
}

/* ───────── calendar ───────── */
function Calendar({ value, onPick, booked, firstDayRef }) {
  const { year, from, to } = seasonRange();
  const first = firstOpenSlot(booked);
  const startMonth = value ? parseIso(value)[1] : first ? parseIso(first.date)[1] : parseIso(from)[1];
  const [month, setMonth] = useState(startMonth);
  const minM = parseIso(from)[1];
  const maxM = parseIso(to)[1];
  const lead = Math.max(0, weekday(iso(year, month, 1)));
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthDates = Array.from({ length: days }, (_, i) => iso(year, month, i + 1));
  const openCount = (date) => (date >= from && date <= to ? openWindows(date, booked).length : 0);
  const focusDate = value && parseIso(value)[1] === month && openCount(value) ? value : monthDates.find((d) => openCount(d) > 0);

  return (
    <div className="cal">
      <div className="cal__head">
        <button type="button" className="cal__nav" onClick={() => setMonth((m) => m - 1)} disabled={month <= minM} aria-label="Previous month"><ChevronLeft size={18} /></button>
        <p className="cal__month" aria-live="polite">{monthLong(month)} {year}</p>
        <button type="button" className="cal__nav" onClick={() => setMonth((m) => m + 1)} disabled={month >= maxM} aria-label="Next month"><ChevronRight size={18} /></button>
      </div>
      <div className="cal__grid" role="grid" aria-label={`${monthLong(month)} ${year}`}>
        {[0, 1, 2, 3, 4, 5, 6].map((d) => <span key={d} className="cal__dow" role="columnheader">{dayShort(d).slice(0, 2)}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={'b' + i} className="cal__blank" />)}
        {Array.from({ length: days }, (_, i) => {
          const date = monthDates[i];
          const open = openCount(date);
          const disabled = open === 0;
          const sel = value === date;
          return (
            <button
              key={date}
              ref={date === focusDate ? firstDayRef : undefined}
              type="button"
              className={`cal__day${sel ? ' is-sel' : ''}${open === 1 ? ' is-low' : ''}`}
              disabled={disabled}
              aria-pressed={sel}
              aria-label={`${fmtDate(date, true)}${disabled ? ' — unavailable' : ` — ${open} window${open > 1 ? 's' : ''} open`}`}
              onClick={() => onPick(date)}
            >
              <span>{i + 1}</span>
              {!disabled && <i className="cal__dots" aria-hidden="true">{open === 1 ? '•' : '••'}</i>}
            </button>
          );
        })}
      </div>
      <div className="cal__legend" aria-hidden="true">
        <span><i className="lg lg--open" />2 windows open</span>
        <span><i className="lg lg--low" />1 window left</span>
      </div>
    </div>
  );
}

/* ───────── page ───────── */
export default function Book() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { draft, update } = useDraft();
  const [error, setError] = useState(params.get('taken') ? 'That install window was just taken. Please choose another date or time.' : '');
  const [refresh, setRefresh] = useState(params.get('taken') ? 1 : 0);
  const { booked, status } = useAvailability(refresh);
  const step = Math.min(Math.max(draft.step || 0, 0), STEPS.length - 1);
  const firstRef = useRef(null);
  const fieldRefs = { name: useRef(null), phone: useRef(null), email: useRef(null), address: useRef(null) };
  const [fieldErr, setFieldErr] = useState('');

  useEffect(() => { document.title = 'Book your install · Everwave Permanent Lighting'; }, []);
  useEffect(() => {
    if (params.get('taken')) { update({ step: 3, time: '' }); setParams({}, { replace: true }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  // Drop a selected slot that's no longer open (e.g. after availability loads).
  useEffect(() => {
    if (status === 'loading') return;
    if (draft.date && draft.time && !slotIsBookable(draft.date, draft.time, booked)) update({ time: '' });
    if (draft.date && openWindows(draft.date, booked).length === 0) update({ date: '', time: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, booked]);

  const pkg = PACKAGES.find((p) => p.id === draft.packageId);
  const est = estimate(draft);
  const addons = visibleAddons(draft.type);
  const windowsForDate = useMemo(() => (draft.date ? TIME_WINDOWS.map((w) => ({ ...w, open: slotIsBookable(draft.date, w.id, booked) })) : []), [draft.date, booked]);

  const go = (i) => { setError(''); setFieldErr(''); update({ step: i }); };

  const fail = (msg, el, field = '') => {
    setError(msg);
    setFieldErr(field);
    if (el) el.focus({ preventScroll: false });
  };

  const validate = () => {
    switch (STEPS[step].key) {
      case 'type': if (!draft.type) return fail('Please choose a lighting type: Permanent or Seasonal.', firstRef.current); break;
      case 'package': if (!draft.packageId) return fail('Please choose a package: Front Only or Front & Sides.', firstRef.current); break;
      case 'home': if (!draft.stories) return fail('Please choose your home height: 1-story or 2-story.', firstRef.current); break;
      case 'date': if (!draft.date) return fail('Please choose an install date.', firstRef.current); break;
      case 'time': if (!draft.time) return fail('Please choose a time window.', firstRef.current); break;
      case 'info': {
        if (draft.name.trim().length < 2) return fail('Please enter your full name.', fieldRefs.name.current, 'name');
        if (draft.phone.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').length !== 10) return fail('Please enter a 10-digit phone number.', fieldRefs.phone.current, 'phone');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) return fail('Please enter a valid email address.', fieldRefs.email.current, 'email');
        if (draft.address.trim().length < 6) return fail('Please enter the service address.', fieldRefs.address.current, 'address');
        break;
      }
      default: break;
    }
    return true;
  };

  const next = () => {
    if (validate() !== true) return;
    setError(''); setFieldErr('');
    if (step === STEPS.length - 1) { nav('/checkout'); return; }
    update({ step: step + 1 });
  };
  const back = () => (step === 0 ? nav('/') : go(step - 1));

  const chips = [
    draft.type && { step: 0, label: draft.type },
    pkg && { step: 1, label: pkg.name },
    draft.stories && { step: 2, label: draft.stories + (draft.addons.length ? ` · +${draft.addons.length} add-on${draft.addons.length > 1 ? 's' : ''}` : '') },
    draft.date && { step: 3, label: fmtDate(draft.date) },
    draft.time && { step: 4, label: TIME_WINDOWS.find((w) => w.id === draft.time)?.label },
  ].filter(Boolean);

  const S = STEPS[step];

  return (
    <main id="main" className="bk">
      <div className="container bk__wrap">
        <SunriseArc step={step} />

        {chips.length > 0 && (
          <ul className="ribbon" aria-label="Your selections">
            {chips.map((c) => (
              <li key={c.step}>
                <button type="button" className={`ribbon__chip${c.step === step ? ' is-cur' : ''}`} onClick={() => go(c.step)} aria-label={`Change ${STEPS[c.step].label}: ${c.label}`}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <section className="qcard" aria-labelledby="q-title">
          <header className="qcard__head">
            <h1 id="q-title" className="qcard__title">{S.title}</h1>
            <p className="qcard__sub">{S.sub}</p>
          </header>

          {error && <p className="bk__error" role="alert">{error}</p>}

          {S.key === 'type' && (
            <div className="choices choices--2" role="radiogroup" aria-label="Lighting type">
              {LIGHTING_TYPES.map((t, i) => (
                <Choice key={t.id} id={`type-${t.id}`} name="type" checked={draft.type === t.id} inputRef={i === 0 ? firstRef : undefined}
                  onChange={() => { setError(''); update((d) => ({ type: t.id, addons: t.id === 'Permanent' ? d.addons.filter((a) => a !== 'storage') : d.addons })); }}
                  title={t.name} note={t.tag}>
                  <span className="choice__text">{t.blurb}</span>
                </Choice>
              ))}
            </div>
          )}

          {S.key === 'package' && (
            <div className="choices choices--2" role="radiogroup" aria-label="Package">
              {PACKAGES.map((p, i) => (
                <Choice key={p.id} id={`pkg-${p.id}`} name="package" checked={draft.packageId === p.id} inputRef={i === 0 ? firstRef : undefined}
                  onChange={() => { setError(''); update({ packageId: p.id }); }}
                  title={p.name} note={priceLabel(p.price[draft.type || 'Seasonal'])}>
                  <CoverageIcon sides={p.id !== 'front'} />
                  <ul className="choice__list">
                    {p.features.slice(0, 4).filter((f) => !(draft.type === 'Permanent' && /leased|Takedown/.test(f))).map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </Choice>
              ))}
            </div>
          )}

          {S.key === 'home' && (
            <>
              <h2 className="bk__sub">Home height</h2>
              <div className="choices choices--2" role="radiogroup" aria-label="Home height">
                {STORY_OPTIONS.map((s, i) => (
                  <Choice key={s.id} id={`story-${s.id}`} name="stories" checked={draft.stories === s.id} inputRef={i === 0 ? firstRef : undefined}
                    onChange={() => { setError(''); update({ stories: s.id }); }} title={s.name} note={s.note} />
                ))}
              </div>
              <h2 className="bk__sub">Add-ons <span>(optional)</span></h2>
              <div className="choices choices--2">
                {addons.map((a) => {
                  const on = draft.addons.includes(a.id);
                  return (
                    <Choice key={a.id} id={`addon-${a.id}`} type="checkbox" name="addons" checked={on}
                      onChange={() => update((d) => ({ addons: on ? d.addons.filter((x) => x !== a.id) : [...d.addons, a.id] }))}
                      title={a.name} aside={addonLabel(a)} />
                  );
                })}
              </div>
            </>
          )}

          {S.key === 'date' && (
            <>
              {status === 'offline' && <p className="bk__warn">Live availability couldn’t load. You can still pick a date — we’ll confirm it when you book.</p>}
              {status === 'loading'
                ? <p className="bk__loading">Loading open dates…</p>
                : <Calendar value={draft.date} booked={booked} firstDayRef={firstRef}
                    onPick={(d) => { setError(''); update((x) => ({ date: d, time: x.time && slotIsBookable(d, x.time, booked) ? x.time : '' })); }} />}
            </>
          )}

          {S.key === 'time' && (
            <>
              <p className="bk__for"><CalendarIcon size={17} /> {draft.date ? fmtDate(draft.date, true) : 'No date picked yet'}</p>
              <div className="choices choices--2" role="radiogroup" aria-label="Time window">
                {windowsForDate.map((w, i) => (
                  <Choice key={w.id} id={`time-${i}`} name="time" checked={draft.time === w.id} disabled={!w.open}
                    inputRef={w.open && !windowsForDate.slice(0, i).some((x) => x.open) ? firstRef : undefined}
                    onChange={() => { setError(''); update({ time: w.id }); }}
                    title={w.label} note={w.open ? w.part : `${w.part} · unavailable`} aside={<ClockIcon size={20} />} />
                ))}
              </div>
            </>
          )}

          {S.key === 'info' && (
            <div className="form">
              {[
                { k: 'name', label: 'Full Name', type: 'text', auto: 'name', ph: 'Jordan Rivera' },
                { k: 'phone', label: 'Phone', type: 'tel', auto: 'tel', ph: '(949) 555-0123' },
                { k: 'email', label: 'Email', type: 'email', auto: 'email', ph: 'you@example.com' },
                { k: 'address', label: 'Service Address', type: 'text', auto: 'street-address', ph: 'Street, city, ZIP', wide: true },
              ].map((f) => (
                <div key={f.k} className={`field${f.wide ? ' field--wide' : ''}${fieldErr === f.k ? ' has-err' : ''}`}>
                  <label htmlFor={`f-${f.k}`}>{f.label}</label>
                  <input
                    ref={fieldRefs[f.k]}
                    id={`f-${f.k}`}
                    type={f.type}
                    autoComplete={f.auto}
                    inputMode={f.k === 'phone' ? 'tel' : f.k === 'email' ? 'email' : undefined}
                    placeholder={f.ph}
                    value={draft[f.k]}
                    aria-invalid={fieldErr === f.k || undefined}
                    onChange={(e) => { if (fieldErr === f.k) { setFieldErr(''); setError(''); } update({ [f.k]: f.k === 'phone' ? fmtPhone(e.target.value) : e.target.value }); }}
                  />
                </div>
              ))}
            </div>
          )}

          <footer className="qcard__foot">
            <div className="est">
              <span className="est__label">Estimate</span>
              <span className="est__val">{est.label}</span>
            </div>
            <div className="bk__actions">
              <button type="button" className="btn btn--ghost-dark" onClick={back}><ArrowLeft size={18} /> {step === 0 ? 'Home' : 'Back'}</button>
              <button type="button" className="btn btn--sun" onClick={next}>
                {step === STEPS.length - 1 ? 'Continue to checkout' : 'Continue'} <ArrowRight size={18} />
              </button>
            </div>
          </footer>
        </section>

        <p className="bk__help">Questions? Call <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a> · Prices are “starting at” and confirmed at your visit. <Link to="/">Back to site</Link></p>
      </div>
    </main>
  );
}
