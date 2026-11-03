/* Horizon footer: gradient horizon line with the logo badge sitting on it, half-sun glow,
   phone (or contact link) + Book on the left, link stacks on the right, legal links + wave-glyph line.
   Contact details only appear once they are filled in (src/data/business.js). */
import { Link } from 'react-router-dom';
import logo from '../assets/everwave-logo.png';
import { BUSINESS, SERVICES, SERVICE_AREA, hasEmail, hasPhone, quoteLabel } from '../data/business.js';
import { useSectionNav } from './Nav.jsx';
import { MailIcon } from './Contact.jsx';
import { PhoneIcon, WaveGlyph } from './Icons.jsx';

const LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/cookies', label: 'Cookie Policy' },
  { to: '/accessibility', label: 'Accessibility' },
];

export default function Footer() {
  const go = useSectionNav();
  const cities = [...SERVICE_AREA.coast, ...SERVICE_AREA.inland].map((c) => c.name);
  const year = new Date().getFullYear();
  return (
    <footer className="ftr">
      <div className="ftr__horizon" aria-hidden="true"><span className="ftr__sun" /></div>
      <div className="container">
        <div className="ftr__badge">
          <img src={logo} alt={BUSINESS.name} width="640" height="314" loading="lazy" />
        </div>
        <div className="ftr__main">
          <div className="ftr__call">
            <p className="eyebrow eyebrow--light">Talk to our team</p>
            {hasPhone()
              ? <a className="ftr__phone" href={BUSINESS.phoneHref}><PhoneIcon size={26} />{BUSINESS.phoneDisplay}</a>
              : <Link className="ftr__phone ftr__phone--text" to="/contact">Get in touch</Link>}
            {hasEmail() && <a className="ftr__email" href={`mailto:${BUSINESS.email}`}><MailIcon size={18} />{BUSINESS.email}</a>}
            <p className="ftr__where">{BUSINESS.name} · {BUSINESS.city}, {BUSINESS.region}</p>
            {BUSINESS.hours.length > 0 && <p className="ftr__where">Hours: {BUSINESS.hours.map((h) => `${h.days}, ${h.hours}`).join(' · ')}</p>}
            <p className="ftr__where">Install season Oct 20 – Dec 20</p>
            <div className="ftr__btns">
              <Link to="/book" className="btn btn--sun">Book Online</Link>
              <Link to="/quote" className="btn btn--ghost-light">{quoteLabel()}</Link>
            </div>
          </div>
          <nav className="ftr__cols" aria-label="Footer">
            <div>
              <h2 className="ftr__h">Services</h2>
              <ul>
                <li><Link to="/services">All services</Link></li>
                {SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.short}</Link></li>)}
                <li><a href="/#packages" onClick={(e) => { e.preventDefault(); go('packages'); }}>Packages</a></li>
                <li><Link to="/quote">{quoteLabel()}</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="ftr__h">Company</h2>
              <ul>
                <li><Link to="/about">About us</Link></li>
                <li><Link to="/process">Our process</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="ftr__cities">
              <h2 className="ftr__h">Service area</h2>
              <p>{cities.join(' · ')}</p>
            </div>
          </nav>
        </div>
        <nav className="ftr__legalnav" aria-label="Legal">
          <ul>{LEGAL.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
        </nav>
        <div className="ftr__legal">
          <span>© {year} {BUSINESS.legalName || BUSINESS.name}</span>
          <WaveGlyph className="ftr__glyph" />
          <span>Prices are “starting at”; the final price is confirmed at your on-site visit.</span>
        </div>
      </div>
    </footer>
  );
}
