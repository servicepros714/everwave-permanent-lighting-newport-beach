/* Mobile action bar — slides in after the hero (or page hero); hidden on /book, /checkout, /confirmation.
   Left button: Call Now when a phone number is set, otherwise the quote page. */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS, hasPhone, quoteLabel } from '../data/business.js';
import { PhoneIcon } from './Icons.jsx';

const HIDDEN = ['/book', '/checkout', '/confirmation'];

export default function MobileBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const hidden = HIDDEN.includes(pathname);

  useEffect(() => {
    if (hidden) { setShow(false); return undefined; }
    const hero = document.getElementById('hero') || document.querySelector('.phero');
    if (hero && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
      io.observe(hero);
      return () => io.disconnect();
    }
    const on = () => setShow(window.scrollY > 320);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [hidden, pathname]);

  if (hidden) return null;
  return (
    <div className={`mbar${show ? ' is-shown' : ''}`} aria-hidden={!show}>
      {hasPhone()
        ? <a className="btn btn--ghost-light" href={BUSINESS.phoneHref} tabIndex={show ? 0 : -1}><PhoneIcon size={18} /> Call Now</a>
        : <Link className="btn btn--ghost-light" to="/quote" tabIndex={show ? 0 : -1}>{quoteLabel()}</Link>}
      <Link className="btn btn--sun" to="/book" tabIndex={show ? 0 : -1}>Book Online</Link>
    </div>
  );
}
