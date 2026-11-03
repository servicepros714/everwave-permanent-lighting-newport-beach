/* Mobile action bar — slides in after the hero; hidden on /book, /checkout, /confirmation. */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS } from '../data/business.js';
import { PhoneIcon } from './Icons.jsx';

const HIDDEN = ['/book', '/checkout', '/confirmation'];

export default function MobileBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const hidden = HIDDEN.includes(pathname);

  useEffect(() => {
    if (hidden) { setShow(false); return undefined; }
    const hero = document.getElementById('hero');
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
      <a className="btn btn--ghost-light" href={BUSINESS.phoneHref} tabIndex={show ? 0 : -1}><PhoneIcon size={18} /> Call Now</a>
      <Link className="btn btn--sun" to="/book" tabIndex={show ? 0 : -1}>Book Online</Link>
    </div>
  );
}
