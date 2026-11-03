/* Gallery — main stage with crossfade + thumbnail rail (vertical on desktop, swipe strip on phones). */
import { useRef, useState } from 'react';
import NightScene from '../components/NightScene.jsx';
import { GALLERY } from '../data/business.js';
import { ChevronLeft, ChevronRight } from '../components/Icons.jsx';

export default function Gallery() {
  const [idx, setIdx] = useState(0);
  const railRef = useRef(null);
  const n = GALLERY.length;
  const pick = (i) => {
    const next = (i + n) % n;
    setIdx(next);
    const rail = railRef.current;
    const btn = rail && rail.children[next];
    if (btn && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: btn.offsetLeft - rail.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
    }
  };
  const cur = GALLERY[idx];
  const touch = useRef(null);

  return (
    <section id="gallery" className="section gal">
      <div className="container">
        <div className="gal__head" data-rise>
          <div>
            <p className="eyebrow eyebrow--light">Gallery</p>
            <h2 className="h2 h2--light">After dark, every <span className="grad-text">wave of light</span>.</h2>
          </div>
          <p className="gal__note">Illustrated design previews — real install photos are coming soon.</p>
        </div>

        <div className="gal__wrap" data-rise style={{ '--rise-delay': '120ms' }}>
          <div
            className="stage"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Night lighting gallery — use the arrow keys to browse"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); pick(idx + 1); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); pick(idx - 1); }
            }}
            onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touch.current == null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 40) pick(idx + (dx < 0 ? 1 : -1));
              touch.current = null;
            }}
          >
            {GALLERY.map((g, i) => (
              <div key={g.id} className={`stage__slide${i === idx ? ' is-active' : ''}`} aria-hidden={i !== idx}>
                <NightScene {...g.scene} slice className="stage__img" label={`Design preview: ${g.title}`} />
              </div>
            ))}
            <div className="stage__tags">
              <span className="tag tag--glass">Design preview</span>
              <span className="tag tag--sun">{cur.tag}</span>
            </div>
            <div className="stage__bar">
              <p className="stage__cap" aria-live="polite">{cur.title}</p>
              <div className="stage__ctrl">
                <span className="stage__count">{String(idx + 1).padStart(2, '0')} <i>/</i> {String(n).padStart(2, '0')}</span>
                <button type="button" className="stage__btn" onClick={() => pick(idx - 1)} aria-label="Previous scene"><ChevronLeft size={20} /></button>
                <button type="button" className="stage__btn" onClick={() => pick(idx + 1)} aria-label="Next scene"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>

          <div className="rail" ref={railRef} role="list" aria-label="Choose a scene">
            {GALLERY.map((g, i) => (
              <button
                key={g.id}
                type="button"
                role="listitem"
                className={`rail__item${i === idx ? ' is-active' : ''}`}
                onClick={() => pick(i)}
                aria-label={`Show ${g.title}`}
                aria-current={i === idx ? 'true' : undefined}
              >
                <NightScene {...g.scene} slice className="rail__img" label="" />
                <span className="rail__num">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
