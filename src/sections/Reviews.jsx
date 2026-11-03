/* Reviews — no real reviews yet, so an honest empty state.
   TODO: add real Google reviews here (name, date, text) once they exist. Never invent reviews or ratings. */
import { BUSINESS } from '../data/business.js';

export default function Reviews() {
  return (
    <section id="reviews" className="section rev">
      <div className="container">
        <div className="rev__panel" data-rise>
          <svg className="rev__mark" viewBox="0 0 64 52" aria-hidden="true" focusable="false">
            <defs><linearGradient id="rev-q" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FDE110" /><stop offset="1" stopColor="#F89B01" /></linearGradient></defs>
            <path fill="url(#rev-q)" d="M0 52V30C0 13 9 3 26 0l3 7C19 10 14 16 13.5 24H26v28H0Zm38 0V30C38 13 47 3 64 0l-.1 7C55 10 50 16 49.5 24H64v28H38Z" />
          </svg>
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="h2">Real reviews are on their way.</h2>
            <p className="rev__text">
              We’re new to {BUSINESS.city}, so you won’t find made-up ratings here. As this season’s installs
              wrap up, real customer reviews will appear in this spot.
            </p>
            {BUSINESS.googleReviewUrl && (
              <a className="btn btn--navy" href={BUSINESS.googleReviewUrl} target="_blank" rel="noreferrer">Read our Google reviews</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
