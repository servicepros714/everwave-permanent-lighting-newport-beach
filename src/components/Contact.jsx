/* Contact building blocks.
   • ContactDetails — only shows details that are filled in (src/data/business.js).
   • RequestForm — contact / quote request. There is no form backend, so the form composes an
     email in the visitor's own email app (mailto:) and says so plainly. It is never reported as
     "sent". Without a business email configured, the form is replaced by the other ways to reach us. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS, LIGHTING_TYPES, PACKAGES, SERVICE_AREA, STORY_OPTIONS, hasEmail, hasPhone } from '../data/business.js';
import { ArrowRight, CalendarIcon, ClockIcon, PhoneIcon, PinIcon } from './Icons.jsx';

export const MailIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" />
  </svg>
);

export function ContactDetails() {
  const cities = [...SERVICE_AREA.coast, ...SERVICE_AREA.inland].map((c) => c.name);
  return (
    <ul className="cdetails">
      {hasPhone() && (
        <li>
          <span className="cdetails__icon"><PhoneIcon size={20} /></span>
          <div><span className="cdetails__label">Phone</span><a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></div>
        </li>
      )}
      {hasEmail() && (
        <li>
          <span className="cdetails__icon"><MailIcon size={20} /></span>
          <div><span className="cdetails__label">Email</span><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div>
        </li>
      )}
      <li>
        <span className="cdetails__icon"><PinIcon size={20} /></span>
        <div>
          <span className="cdetails__label">Based in</span>
          {BUSINESS.address && BUSINESS.address.street
            ? <span>{BUSINESS.address.street}, {BUSINESS.address.city} {BUSINESS.address.region} {BUSINESS.address.postalCode}</span>
            : <span>{BUSINESS.city}, {BUSINESS.region} — we come to you</span>}
          <span className="cdetails__sub">Serving {cities.join(', ')}</span>
        </div>
      </li>
      {BUSINESS.hours.length > 0 && (
        <li>
          <span className="cdetails__icon"><ClockIcon size={20} /></span>
          <div>
            <span className="cdetails__label">Hours</span>
            {BUSINESS.hours.map((h) => <span key={h.days} className="cdetails__row">{h.days}: {h.hours}</span>)}
          </div>
        </li>
      )}
      <li>
        <span className="cdetails__icon"><CalendarIcon size={20} /></span>
        <div>
          <span className="cdetails__label">Install season</span>
          <span>October 20 – December 20, every day · 8 AM – 12 PM or 12 PM – 4 PM windows</span>
          <Link to="/book" className="cdetails__link">See open dates <ArrowRight size={16} /></Link>
        </div>
      </li>
    </ul>
  );
}

const fmtPhone = (v) => {
  const d = v.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const NOT_SURE = 'Not sure yet';

export function RequestForm({ kind = 'contact' }) {
  const quote = kind === 'quote';
  const [v, setV] = useState({ name: '', phone: '', email: '', city: '', type: '', pkg: '', stories: '', message: '' });
  const [err, setErr] = useState({ field: '', msg: '' });
  const [opened, setOpened] = useState(false);
  const set = (k) => (e) => {
    if (err.field === k) setErr({ field: '', msg: '' });
    setV((s) => ({ ...s, [k]: k === 'phone' ? fmtPhone(e.target.value) : e.target.value }));
  };

  if (!hasEmail()) {
    return (
      <div className="reqform reqform--off" role="note">
        <h3>{quote ? 'Get your quote online' : 'Reach us online'}</h3>
        <p>
          {quote
            ? 'The fastest way to a quote is our booking form: pick your package and add-ons and you’ll see your estimate as you go. Choose “I’ll pay at the visit” and nothing is due today — the final price is confirmed with you at the visit.'
            : 'Our online message form isn’t connected yet. You can book your install window online — choose “I’ll pay at the visit” and nothing is due today.'}
        </p>
        <div className="reqform__alt">
          <Link to="/book" className="btn btn--sun">Start online <ArrowRight size={18} /></Link>
          {hasPhone() && <a href={BUSINESS.phoneHref} className="btn btn--ghost-dark"><PhoneIcon size={18} /> {BUSINESS.phoneDisplay}</a>}
        </div>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const digits = v.phone.replace(/\D/g, '');
    const fail = (field, msg) => { setErr({ field, msg }); const el = document.getElementById(`rq-${field}`); if (el) el.focus(); };
    if (v.name.trim().length < 2) return fail('name', 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) return fail('email', 'Please enter a valid email address so we can reply.');
    if (digits && digits.length !== 10) return fail('phone', 'Please enter a 10-digit phone number, or leave it blank.');
    if (quote && v.city.trim().length < 2) return fail('city', 'Please tell us your city or street address.');
    if (!quote && v.message.trim().length < 5) return fail('message', 'Please add a short message.');
    const lines = [
      `Name: ${v.name.trim()}`,
      `Email: ${v.email.trim()}`,
      ...(digits ? [`Phone: ${v.phone}`] : []),
      ...(quote ? [`Address / city: ${v.city.trim()}`, `Lighting: ${v.type || NOT_SURE}`, `Package: ${v.pkg || NOT_SURE}`, `Home: ${v.stories || NOT_SURE}`] : []),
      '',
      v.message.trim(),
    ];
    const subject = quote ? `Quote request — ${v.name.trim()}` : `Website message — ${v.name.trim()}`;
    const a = document.createElement('a');
    a.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    a.click();
    setOpened(true);
  };

  const field = (k, label, props = {}, wide = false) => (
    <div className={`field${wide ? ' field--wide' : ''}${err.field === k ? ' has-err' : ''}`}>
      <label htmlFor={`rq-${k}`}>{label}</label>
      <input id={`rq-${k}`} value={v[k]} onChange={set(k)} aria-invalid={err.field === k || undefined} {...props} />
    </div>
  );
  const select = (k, label, options) => (
    <div className="field">
      <label htmlFor={`rq-${k}`}>{label}</label>
      <select id={`rq-${k}`} value={v[k]} onChange={set(k)}>
        <option value="">{NOT_SURE}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <form className="reqform" onSubmit={submit} noValidate>
      <h3>{quote ? 'Request a quote by email' : 'Send us a message'}</h3>
      <p className="reqform__how">
        This form opens your own email app with your details filled in. Nothing is sent until you press <b>Send</b> there.
      </p>
      {err.msg && <p className="bk__error" role="alert">{err.msg}</p>}
      <div className="form">
        {field('name', 'Full name', { type: 'text', autoComplete: 'name', required: true })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', required: true })}
        {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        {quote && field('city', 'Street address or city', { type: 'text', autoComplete: 'street-address', required: true })}
        {quote && select('type', 'Lighting type', LIGHTING_TYPES.map((t) => ({ value: t.name, label: t.name })))}
        {quote && select('pkg', 'Coverage', PACKAGES.map((p) => ({ value: p.name, label: `${p.name} — ${p.coverage}` })))}
        {quote && select('stories', 'Home height', STORY_OPTIONS.map((s) => ({ value: s.name, label: s.name })))}
        <div className={`field field--wide${err.field === 'message' ? ' has-err' : ''}`}>
          <label htmlFor="rq-message">{quote ? 'Anything else we should know? (optional)' : 'Message'}</label>
          <textarea id="rq-message" rows={5} value={v.message} onChange={set('message')} aria-invalid={err.field === 'message' || undefined} />
        </div>
      </div>
      <div className="reqform__foot">
        <button type="submit" className="btn btn--sun">Open in my email app <ArrowRight size={18} /></button>
        <p className="reqform__privacy">We only use your details to reply. See our <Link to="/privacy">Privacy Policy</Link>.</p>
      </div>
      {opened && (
        <p className="reqform__status" role="status">
          Your email app should now be open with your message ready. It isn’t sent until you press Send.
          Nothing opened? Email us directly at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          {hasPhone() && <> or call <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></>}.
        </p>
      )}
    </form>
  );
}
