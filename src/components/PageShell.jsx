/* Inner-page building blocks: a night-sky page hero with visible breadcrumbs, and a page wrapper
   that sets the head tags and runs the wave-rise reveals. Reuses the home page's sky + wave styling. */
import { Link } from 'react-router-dom';
import { crumbs, routeFor } from '../data/routes.js';
import { usePageMeta } from '../lib/seo.js';
import { useReveal } from '../lib/useReveal.js';
import { Waves } from '../sections/Hero.jsx';

export function Page({ path, className = '', children }) {
  usePageMeta(path);
  useReveal(path);
  return <main id="main" className={`page ${className}`}>{children}</main>;
}

export function Breadcrumbs({ path, light = false }) {
  const trail = crumbs(routeFor(path));
  if (!trail.length) return null;
  return (
    <nav className={`crumbtrail${light ? ' crumbtrail--light' : ''}`} aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => (
          <li key={c.path}>
            {i < trail.length - 1 ? <Link to={c.path}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ path, eyebrow, title, lead, children, compact = false }) {
  return (
    <section className={`phero${compact ? ' phero--compact' : ''}`}>
      <div className="phero__sky" aria-hidden="true"><span className="phero__sun" /></div>
      <div className="container phero__inner">
        <Breadcrumbs path={path} light />
        {eyebrow && <p className="eyebrow eyebrow--light">{eyebrow}</p>}
        <h1 className="phero__title">{title}</h1>
        {lead && <p className="phero__lead">{lead}</p>}
        {children && <div className="phero__actions">{children}</div>}
      </div>
      <Waves className="phero__waves" />
    </section>
  );
}
