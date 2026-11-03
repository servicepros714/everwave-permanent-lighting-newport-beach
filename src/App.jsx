import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import MobileBar from './components/MobileBar.jsx';
import Home from './pages/Home.jsx';
import Book from './pages/Book.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import { DraftProvider } from './lib/draft.jsx';

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
  useEffect(() => { document.title = 'Page not found · Everwave Permanent Lighting'; }, []);
  return (
    <main id="main" className="nf">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1 className="h2">This page drifted out to sea.</h1>
        <p>Let’s get you back to shore.</p>
        <Link to="/" className="btn btn--navy">Back home</Link>
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!focused && <Footer />}
      <MobileBar />
    </DraftProvider>
  );
}
