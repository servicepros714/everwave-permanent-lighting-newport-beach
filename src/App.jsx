import { Suspense, lazy, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import MobileBar from './components/MobileBar.jsx';
import Home from './pages/Home.jsx';
import Book from './pages/Book.jsx';
import Confirmation from './pages/Confirmation.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Process from './pages/Process.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import About from './pages/About.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Quote from './pages/Quote.jsx';
import Privacy from './pages/legal/Privacy.jsx';
import Terms from './pages/legal/Terms.jsx';
import Cookies from './pages/legal/Cookies.jsx';
import Accessibility from './pages/legal/Accessibility.jsx';
import { DraftProvider } from './lib/draft.jsx';
import { usePageMeta } from './lib/seo.js';
import { SERVICES } from './data/business.js';

/* Checkout is loaded on demand so Stripe.js is only fetched on the checkout page. */
const Checkout = lazy(() => import('./pages/Checkout.jsx'));

const FOCUSED = ['/book', '/checkout'];

/* Scroll to top on every route change (hash links scroll to their section instead). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  usePageMeta('/404');
  return (
    <main id="main" className="nf">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1 className="h2">This page drifted out to sea.</h1>
        <p>Let’s get you back to shore.</p>
        <div className="nf__btns">
          <Link to="/" className="btn btn--navy">Back home</Link>
          <Link to="/services" className="btn btn--ghost-dark">Our services</Link>
          <Link to="/contact" className="btn btn--ghost-dark">Contact us</Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const focused = FOCUSED.includes(pathname);
  return (
    <DraftProvider>
      <ScrollToTop />
      <a href="#main" className="skip">Skip to content</a>
      <Nav focused={focused} />
      <Suspense fallback={<main id="main" className="checkout"><p className="checkout__finalizing" role="status">Loading…</p></main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          {SERVICES.map((s) => <Route key={s.slug} path={`/services/${s.slug}`} element={<ServiceDetail key={s.slug} slug={s.slug} />} />)}
          <Route path="/process" element={<Process />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!focused && <Footer />}
      <MobileBar />
    </DraftProvider>
  );
}
