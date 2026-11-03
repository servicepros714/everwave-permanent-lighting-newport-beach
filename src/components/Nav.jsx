/* Wave-edge header: logo · pill link track with a gliding sun-dot · phone + Book pill.
   Mobile: left-side drawer with a wave edge and a Call Now / Book Online action bar. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/everwave-logo.png';
import { BUSINESS } from '../data/business.js';
import { CloseIcon, LockIcon, MenuIcon, PhoneIcon, ArrowRight } from './Icons.jsx';

export const NAV_LINKS = [
  { id: 'how', label: 'How it works' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'season', label: 'Season' },
  { id: 'packages', label: 'Packages' },
  { id: 'faq', label: 'FAQ' },
];
const DRAWER_LINKS = [{ id: 'area', label: 'Service area' }, ...NAV_LINKS];

/** Scroll to a home-page section, navigating home first when needed. */
export function useSectionNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  return useCallback((id) => {
    if (pathname !== '/') { nav('/#' + id); return; }
    const el = document.getElementById(id);
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    }
  }, [nav, pathname]);
}

function WaveEdge({ className }) {
  return (
    <svg className={className} viewBox="0 0 1440 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0H1440V10C1320 26 1200 26 1080 14S840 0 720 12 480 28 360 16 120 0 0 12Z" fill="currentColor" />
    </svg>
  );
}

export default function Nav({ focused = false }) {
  const { pathname } = useLocation();
  const go = useSectionNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hover, setHover] = useState('');
  const trackRef = useRef(null);
  const dotRef = useRef(null);
  const closeRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Scroll spy for the active link (home only).
  useEffect(() => {
    if (pathname !== '/' || focused) { setActive(''); return undefined; }
    const ids = NAV_LINKS.map((l) => l.id);
    const on = () => {
      let cur = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = id;
      }
      setActive(cur);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname, focused]);

  // Sun-dot glides under the hovered link, else the active one.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const dot = dotRef.current;
    if (!track || !dot) return;
    const target = hover || active;
    const a = target && track.querySelector(`[data-id="${target}"]`);
    if (!a) { dot.style.opacity = '0'; return; }
    dot.style.opacity = '1';
    dot.style.transform = `translateX(${a.offsetLeft + a.offsetWidth / 2 - 4}px)`;
  }, [hover, active, scrolled]);

  // Drawer: Esc closes, body scroll lock, focus management.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      burgerRef.current && burgerRef.current.focus();
    };
  }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);

  const homeLink = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  if (focused) {
    return (
      <header className="hdr hdr--focused">
        <div className="container hdr__bar hdr__bar--focused">
          <Link to="/" className="hdr__logo" aria-label={`${BUSINESS.name} home`}>
            <img src={logo} alt={BUSINESS.name} width="640" height="314" />
          </Link>
          <span className="hdr__secure"><LockIcon size={16} /> Secure booking</span>
          <a className="hdr__phone" href={BUSINESS.phoneHref} aria-label={`Call ${BUSINESS.phoneDisplay}`}>
            <PhoneIcon size={18} /><span>{BUSINESS.phoneDisplay}</span>
          </a>
        </div>
        <WaveEdge className="hdr__wave" />
      </header>
    );
  }

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container hdr__bar">
        <Link to="/" className="hdr__logo" onClick={homeLink} aria-label={`${BUSINESS.name} home`}>
          <img src={logo} alt={BUSINESS.name} width="640" height="314" />
        </Link>

        <nav className="hdr__nav" aria-label="Main">
          <ul className="track" ref={trackRef} onMouseLeave={() => setHover('')}>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  data-id={l.id}
                  className={active === l.id ? 'is-active' : ''}
                  aria-current={active === l.id ? 'true' : undefined}
                  onMouseEnter={() => setHover(l.id)}
                  onFocus={() => setHover(l.id)}
                  onBlur={() => setHover('')}
                  onClick={(e) => { e.preventDefault(); go(l.id); }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <span className="track__dot" ref={dotRef} aria-hidden="true" />
          </ul>
        </nav>

        <div className="hdr__actions">
          <a className="hdr__call" href={BUSINESS.phoneHref} aria-label={`Call ${BUSINESS.phoneDisplay}`}>
            <PhoneIcon size={18} />
          </a>
          <Link to="/book" className="btn btn--sun hdr__book">Book Online</Link>
          <button
            ref={burgerRef}
            type="button"
            className="hdr__burger"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>
      <WaveEdge className="hdr__wave" />

      <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button type="button" className="drawer__scrim" tabIndex={-1} aria-label="Close menu" onClick={() => setOpen(false)} />
        <aside id="drawer" className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__inner">
          <div className="drawer__top">
            <img src={logo} alt={BUSINESS.name} className="drawer__logo" width="640" height="314" />
            <button ref={closeRef} type="button" className="drawer__close" aria-label="Close menu" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              <CloseIcon size={22} />
            </button>
          </div>
          <ul className="drawer__links">
            {DRAWER_LINKS.map((l, i) => (
              <li key={l.id} style={{ '--i': i }}>
                <a href={`/#${l.id}`} tabIndex={open ? 0 : -1} onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => go(l.id), 60); }}>
                  {l.label}<ArrowRight size={18} />
                </a>
              </li>
            ))}
          </ul>
          <p className="drawer__meta">Serving {BUSINESS.city} &amp; nearby coastal Orange County</p>
          <div className="drawer__actions">
            <a className="btn btn--ghost-dark" href={BUSINESS.phoneHref} tabIndex={open ? 0 : -1}><PhoneIcon size={18} /> Call Now</a>
            <Link className="btn btn--sun" to="/book" tabIndex={open ? 0 : -1}>Book Online</Link>
          </div>
          </div>
          <svg className="drawer__edge" viewBox="0 0 24 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 0H8C20 60 20 120 8 180S-4 300 8 360 20 480 8 540 -4 660 8 720 16 780 12 800H0Z" fill="currentColor" />
          </svg>
        </aside>
      </div>
    </header>
  );
}
