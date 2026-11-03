/* Horizon footer: gradient horizon line with the logo badge sitting on it, half-sun glow,
   big phone + Book on the left, link stacks on the right, wave-glyph legal line. */
import { Link } from 'react-router-dom';
import logo from '../assets/everwave-logo.png';
import { BUSINESS, SERVICE_AREA } from '../data/business.js';
import { useSectionNav } from './Nav.jsx';
import { PhoneIcon, WaveGlyph } from './Icons.jsx';

export default function Footer() {
  const go = useSectionNav();
  const cities = [...SERVICE_AREA.coast, ...SERVICE_AREA.inland].map((c) => c.name);
  const year = new Date().getFullYear();
  const jump = (id) => (e) => { e.preventDefault(); go(id); };
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
            <a className="ftr__phone" href={BUSINESS.phoneHref}><PhoneIcon size={26} />{BUSINESS.phoneDisplay}</a>
            <p className="ftr__where">{BUSINESS.city}, {BUSINESS.region} · Install season Oct 20 – Dec 20</p>
            <Link to="/book" className="btn btn--sun">Book Online</Link>
          </div>
          <nav className="ftr__cols" aria-label="Footer">
            <div>
              <h3>Explore</h3>
              <ul>
                <li><a href="/#how" onClick={jump('how')}>How it works</a></li>
                <li><a href="/#gallery" onClick={jump('gallery')}>Gallery</a></li>
                <li><a href="/#packages" onClick={jump('packages')}>Packages</a></li>
                <li><a href="/#faq" onClick={jump('faq')}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3>Book</h3>
              <ul>
                <li><Link to="/book">Book an install</Link></li>
                <li><a href="/#season" onClick={jump('season')}>Open dates</a></li>
                <li><a href={BUSINESS.phoneHref}>Call us</a></li>
              </ul>
            </div>
            <div className="ftr__cities">
              <h3>Service area</h3>
              <p>{cities.join(' · ')}</p>
            </div>
          </nav>
        </div>
        <div className="ftr__legal">
          <span>© {year} {BUSINESS.name}</span>
          <WaveGlyph className="ftr__glyph" />
          <span>Prices are “starting at”; the final price is confirmed at your on-site visit.</span>
        </div>
      </div>
    </footer>
  );
}
