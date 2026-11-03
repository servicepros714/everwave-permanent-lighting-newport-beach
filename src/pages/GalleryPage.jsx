import { Link } from 'react-router-dom';
import { BUSINESS, SERVICES } from '../data/business.js';
import { Page, PageHero } from '../components/PageShell.jsx';
import { ArrowRight } from '../components/Icons.jsx';
import Gallery from '../sections/Gallery.jsx';
import FinalCta from '../sections/FinalCta.jsx';

export default function GalleryPage() {
  return (
    <Page path="/gallery">
      <PageHero
        path="/gallery"
        eyebrow="Gallery"
        title={<>Lighting styles for <span className="grad-text">{BUSINESS.city}</span> homes</>}
        lead="Browse the looks we design — warm white, cool white, multicolor and accent lighting on coastal, modern, Spanish-style and two-story homes."
      />

      <Gallery />

      <section className="section psec">
        <div className="container split split--text">
          <div data-rise>
            <p className="eyebrow">About these images</p>
            <h2 className="h2">Illustrations today. <span className="grad-text">Real photos soon.</span></h2>
          </div>
          <div data-rise style={{ '--rise-delay': '120ms' }}>
            <p className="psec__p">
              Every scene in this gallery is an illustrated design preview, not a photograph of a completed install.
              They show the lighting styles and coverage options we offer. Real night photos of our {BUSINESS.city}-area
              installs will replace them as they become available.
            </p>
            <p className="psec__p">
              Want to see how your own home could look? Your design is confirmed with you at the visit, before anything is installed.
            </p>
            <div className="psec__btns">
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="btn btn--ghost-dark">{s.name} <ArrowRight size={18} /></Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </Page>
  );
}
