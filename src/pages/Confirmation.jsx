import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS, DEPOSIT, PACKAGES } from '../data/business.js';
import { CONFIRM_KEY } from '../lib/draft.jsx';
import { fmtDate } from '../lib/time.js';
import { CheckIcon, PhoneIcon } from '../components/Icons.jsx';
import { Waves } from '../sections/Hero.jsx';

export default function Confirmation() {
  const [snap] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(CONFIRM_KEY) || 'null'); } catch { return null; }
  });
  useEffect(() => { document.title = 'You’re booked · Everwave Permanent Lighting'; }, []);

  if (!snap) {
    return (
      <main id="main" className="conf">
        <div className="container"><div className="conf__card">
          <h1 className="h2">No recent booking found</h1>
          <p>If you just booked, check your email or call us at <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>.</p>
          <Link to="/book" className="btn btn--sun">Book an install</Link>
        </div></div>
      </main>
    );
  }
  const d = snap.draft;
  const pkg = PACKAGES.find((p) => p.id === d.packageId);
  const paid = snap.paymentStatus === 'Paid';
  return (
    <main id="main" className="conf">
      <div className="conf__sky" aria-hidden="true"><span className="conf__sun" /></div>
      <div className="container"><div className="conf__card">
        <span className="conf__check" aria-hidden="true"><CheckIcon size={30} /></span>
        <p className="eyebrow">Booking {snap.id}</p>
        <h1 className="conf__title">You’re booked, {d.name.split(' ')[0]}!</h1>
        <p className="conf__lead">
          {paid ? `Your $${DEPOSIT} deposit is received and will be applied to your final invoice.` : 'You chose to pay at the visit — nothing is due today.'}
          {snap.conflict && ' Our team will call you to confirm the exact window.'}
        </p>
        <dl className="conf__list">
          <div><dt>Install</dt><dd>{fmtDate(d.date, true)} · {d.windowLabel}</dd></div>
          <div><dt>Lighting</dt><dd>{d.type} · {pkg?.name} · {d.stories}</dd></div>
          <div><dt>Address</dt><dd>{d.address}</dd></div>
          <div><dt>Payment</dt><dd>{paid ? `Deposit paid ($${DEPOSIT})` : 'Pay at the visit'}</dd></div>
        </dl>
        <h2 className="conf__next">What happens next</h2>
        <ol className="conf__steps">
          <li>We confirm your window by phone or text.</li>
          <li>At the visit we walk the roofline and confirm the design and final price.</li>
          <li>Our crew installs, tests and sets up your timer or controller.</li>
        </ol>
        <div className="conf__btns">
          <a href={BUSINESS.phoneHref} className="btn btn--ghost-dark"><PhoneIcon size={18} /> {BUSINESS.phoneDisplay}</a>
          <Link to="/" className="btn btn--sun">Back to home</Link>
        </div>
      </div></div>
      <Waves className="conf__waves" />
    </main>
  );
}
