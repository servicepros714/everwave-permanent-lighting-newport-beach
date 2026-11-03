import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero.jsx';
import ServiceArea from '../sections/ServiceArea.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import Gallery from '../sections/Gallery.jsx';
import Season from '../sections/Season.jsx';
import Packages from '../sections/Packages.jsx';
import Reviews from '../sections/Reviews.jsx';
import Faq from '../sections/Faq.jsx';
import FinalCta from '../sections/FinalCta.jsx';
import { useReveal } from '../lib/useReveal.js';

export default function Home() {
  const { hash } = useLocation();
  useReveal('home');
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [hash]);
  return (
    <main id="main">
      <Hero />
      <ServiceArea />
      <HowItWorks />
      <Gallery />
      <Season />
      <Packages />
      <Reviews />
      <Faq />
      <FinalCta />
    </main>
  );
}
