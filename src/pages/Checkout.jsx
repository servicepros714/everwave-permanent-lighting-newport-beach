/* Checkout — shared "Luna Glow" layout:
   progress crumbs → title → [payment card | order summary] → plain "I'll pay at the visit" link. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BUSINESS, DEPOSIT, PACKAGES, ADDONS, TIME_WINDOWS, contactPhrase, hasPhone } from '../data/business.js';
import { usePageMeta } from '../lib/seo.js';
import { draftComplete, useDraft } from '../lib/draft.jsx';
import { createPaymentIntent } from '../lib/api.js';
import { estimate } from '../lib/pricing.js';
import { finishBooking } from '../lib/finish.js';
import { fmtDate } from '../lib/time.js';
import { CheckIcon, LockIcon, PhoneIcon, CalendarIcon, ClockIcon, PinIcon } from '../components/Icons.jsx';

const PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripeReady = /^pk_(test|live)_[A-Za-z0-9]{10,}$/.test(PK) && !/REPLACE/i.test(PK);
const stripePromise = stripeReady ? loadStripe(PK) : null;

const APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#004391',
    colorText: '#010B3B',
    colorDanger: '#C2410C',
    borderRadius: '12px',
    fontFamily: 'Mulish, system-ui, sans-serif',
    spacingUnit: '4px',
  },
  rules: { '.Input:focus': { borderColor: '#0092FD', boxShadow: '0 0 0 3px rgba(0,146,253,.18)' } },
};
const FONTS = [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700&display=swap' }];

function Crumbs() {
  const items = ['Lighting', 'Package', 'Home', 'Date & time', 'Your info', 'Payment'];
  return (
    <ol className="crumbs" aria-label="Booking progress">
      {items.map((s, i) => (
        <li key={s} className={i < items.length - 1 ? 'is-done' : 'is-current'} aria-current={i === items.length - 1 ? 'step' : undefined}>
          {i < items.length - 1 ? <><CheckIcon size={14} />{s}</> : s}
        </li>
      ))}
    </ol>
  );
}

function PayForm({ draft, onPaid, busy, setBusy, setError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [express, setExpress] = useState(true);
  const returnUrl = `${window.location.origin}/checkout`;

  // fromExpress: wallet sheets (Apple Pay / Google Pay / Link) were already confirmed by the buyer,
  // so the card form isn't validated in that path.
  const confirm = async (fromExpress = false, ev = null) => {
    if (!stripe || !elements || busy) return;
    setBusy(true); setError('');
    if (!fromExpress) {
      const { error: submitError } = await elements.submit();
      if (submitError) { setBusy(false); setError(submitError.message || 'Please check your payment details.'); return; }
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: returnUrl,
        receipt_email: draft.email.trim(),
        payment_method_data: { billing_details: { name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.replace(/\D/g, '') } },
      },
    });
    if (error) {
      if (ev && ev.paymentFailed) ev.paymentFailed({ reason: 'fail' });
      setBusy(false); setError(error.message || 'Your payment did not go through.'); return;
    }
    if (paymentIntent && ['succeeded', 'processing'].includes(paymentIntent.status)) { await onPaid(paymentIntent.id); return; }
    setBusy(false);
    setError('Your payment needs another step. Please try again.');
  };

  return (
    <div className="payform">
      {express && (
        <div className="payform__express">
          {/* Elements is created with the PaymentIntent clientSecret, which ExpressCheckoutElement requires. */}
          <ExpressCheckoutElement
            options={{ buttonHeight: 48 }}
            onReady={({ availablePaymentMethods }) => { if (!availablePaymentMethods) setExpress(false); }}
            onConfirm={(ev) => confirm(true, ev)}
          />
          <p className="payform__or"><span>or pay with card</span></p>
        </div>
      )}
      <PaymentElement options={{ layout: 'tabs' }} onReady={() => setReady(true)} />
      <button type="button" className="btn btn--sun btn--block btn--lg" onClick={() => confirm(false)} disabled={!stripe || !ready || busy}>
        <LockIcon size={18} /> {busy ? 'Processing…' : `Pay $${DEPOSIT} deposit`}
      </button>
    </div>
  );
}

export default function Checkout() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { draft, reset, update } = useDraft();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);
  const started = useRef(false);

  const redirectSecret = params.get('payment_intent_client_secret');

  usePageMeta('/checkout');

  const done = (snap) => {
    nav('/confirmation', { replace: true, state: { id: snap.id } });
    reset();
  };

  const finish = async (status, piId) => {
    setBusy(true); setError('');
    try {
      const snap = await finishBooking(draft, status, piId);
      done(snap);
    } catch (e) {
      setBusy(false); setFinalizing(false);
      if (e.code === 'SLOT_UNAVAILABLE' || e.status === 409) { setSlotTaken(true); setError(e.message); return; }
      setError(piId
        ? `Your deposit went through, but we couldn’t save the booking (${e.message}). Please ${contactPhrase()} and quote reference ${draft.ref}.`
        : e.message);
    }
  };

  // Returning from a redirect-based payment method.
  useEffect(() => {
    if (!redirectSecret || started.current || !stripePromise) return;
    started.current = true;
    setFinalizing(true);
    stripePromise.then((stripe) => stripe.retrievePaymentIntent(redirectSecret)).then(({ paymentIntent }) => {
      if (paymentIntent && ['succeeded', 'processing'].includes(paymentIntent.status) && draftComplete(draft)) finish('Paid', paymentIntent.id);
      else { setFinalizing(false); setError('Your payment was not completed. Please try again or pay at the visit.'); nav('/checkout', { replace: true }); }
    }).catch(() => { setFinalizing(false); setError(`We could not confirm your payment. Please ${contactPhrase()} and quote reference ${draft.ref}.`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectSecret]);

  // Go back to booking if the draft is incomplete.
  useEffect(() => {
    if (!redirectSecret && !draftComplete(draft)) nav('/book', { replace: true });
  }, [draft, redirectSecret, nav]);

  // Create (or reuse — idempotent per draft ref) the deposit PaymentIntent.
  useEffect(() => {
    if (redirectSecret || !stripeReady || !draftComplete(draft) || clientSecret) return;
    let live = true;
    createPaymentIntent(draft.ref)
      .then((r) => live && setClientSecret(r.clientSecret))
      .catch((e) => live && setError(`Online payment is unavailable right now (${e.message}). You can still reserve and pay at the visit.`));
    return () => { live = false; };
  }, [draft, redirectSecret, clientSecret]);

  const options = useMemo(() => (clientSecret ? { clientSecret, appearance: APPEARANCE, fonts: FONTS } : null), [clientSecret]);

  if (finalizing) return <main id="main" className="checkout"><p className="checkout__finalizing" role="status">Finishing your booking…</p></main>;
  if (!draftComplete(draft)) return null;

  const pkg = PACKAGES.find((p) => p.id === draft.packageId);
  const win = TIME_WINDOWS.find((w) => w.id === draft.time);
  const adds = draft.addons.map((id) => ADDONS.find((a) => a.id === id)).filter(Boolean);

  return (
    <main id="main" className="checkout">
      <div className="container">
        <Crumbs />
        <header className="checkout__head">
          <h1 className="checkout__title">Reserve your install</h1>
          <p className="checkout__sub">A ${DEPOSIT} deposit holds your window and is applied to your final invoice.</p>
        </header>

        {error && (
          <div className="checkout__error" role="alert">
            <p>{error}</p>
            {slotTaken && (
              <button type="button" className="btn btn--navy" onClick={() => { update({ step: 3, time: '' }); nav('/book?taken=1'); }}>Pick another time</button>
            )}
          </div>
        )}

        <div className="checkout__grid">
          <section className="paycard" aria-labelledby="pay-title">
            <div className="paycard__head">
              <h2 id="pay-title">Reservation deposit</h2>
              <span className="paycard__amt">${DEPOSIT}</span>
            </div>
            <p className="paycard__note"><CheckIcon size={16} /> Applied to your final invoice</p>
            {!stripeReady && <p className="paycard__off">Online card payment isn’t set up yet. You can reserve now and pay at the visit.</p>}
            {stripeReady && !options && !error && <div className="paycard__loading" role="status">Loading secure payment…</div>}
            {options && (
              <Elements stripe={stripePromise} options={options} key={clientSecret}>
                <PayForm draft={draft} busy={busy} setBusy={setBusy} setError={setError} onPaid={(id) => finish('Paid', id)} />
              </Elements>
            )}
            <p className="paycard__secure"><LockIcon size={15} /> Payments are processed securely by Stripe.</p>
          </section>

          <aside className="summary" aria-labelledby="sum-title">
            <h2 id="sum-title">Your install</h2>
            <dl className="summary__list">
              <div><dt>Lighting</dt><dd>{draft.type}</dd></div>
              <div><dt>Package</dt><dd>{pkg?.name}</dd></div>
              <div><dt>Home</dt><dd>{draft.stories}</dd></div>
              <div><dt>Add-ons</dt><dd>{adds.length ? adds.map((a) => a.name).join(', ') : 'None'}</dd></div>
            </dl>
            <ul className="summary__when">
              <li><CalendarIcon size={17} />{fmtDate(draft.date, true)}</li>
              <li><ClockIcon size={17} />{win?.label} ({win?.part})</li>
              <li><PinIcon size={17} />{draft.address}</li>
            </ul>
            <div className="summary__totals">
              <div><span>Estimate</span><b>{estimate(draft).label}</b></div>
              <div><span>Due today</span><b>${DEPOSIT}</b></div>
            </div>
            <Link to="/book" className="summary__edit" onClick={() => update({ step: 0 })}>Edit booking</Link>
          </aside>
        </div>

        <p className="checkout__later">
          <button type="button" className="textlink" onClick={() => finish('Pay Later')} disabled={busy}>I’ll pay at the visit</button>
        </p>
        <p className="checkout__help">
          {hasPhone()
            ? <><PhoneIcon size={15} /> Need help? <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></>
            : <>Need help? <Link to="/contact">Contact us</Link></>}
          {' · '}<Link to="/terms">Terms</Link> · <Link to="/privacy">Privacy</Link>
        </p>
      </div>
    </main>
  );
}
