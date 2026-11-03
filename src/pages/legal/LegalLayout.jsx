/* Shared layout for legal pages: compact page hero, sticky table of contents, readable prose.
   NOTE FOR THE OWNER: these documents describe how this website actually works. They are a
   starting point, not legal advice — have them reviewed by a qualified attorney before relying on them. */
import { Link } from 'react-router-dom';
import { BUSINESS, POLICIES, hasEmail, hasPhone } from '../../data/business.js';
import { routeFor } from '../../data/routes.js';
import { Page, PageHero } from '../../components/PageShell.jsx';

export const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** "Everwave Permanent Lighting" or "Legal Name LLC, doing business as Everwave Permanent Lighting". */
export const operator = () => (BUSINESS.legalName ? `${BUSINESS.legalName}, doing business as ${BUSINESS.name}` : BUSINESS.name);

export function Section({ title, children }) {
  return (
    <section className="prose__sec" aria-labelledby={slug(title)}>
      <h2 id={slug(title)}>{title}</h2>
      {children}
    </section>
  );
}

/** Contact lines for legal pages — only real, configured details. */
export function LegalContact() {
  return (
    <ul>
      <li><b>{operator()}</b>, {BUSINESS.city}, {BUSINESS.regionName}</li>
      {hasEmail() && <li>Email: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>}
      {hasPhone() && <li>Phone: <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></li>}
      <li>Or use the options on our <Link to="/contact">Contact page</Link>.</li>
    </ul>
  );
}

export default function LegalLayout({ path, intro, sections, children }) {
  const r = routeFor(path);
  return (
    <Page path={path} className="legal">
      <PageHero path={path} eyebrow="Legal" title={r.title} lead={intro} compact />
      <div className="container legal__wrap">
        <aside className="legal__toc" aria-label="On this page">
          <p className="legal__updated">Last updated: {POLICIES.lastUpdated}</p>
          <p className="legal__toch">On this page</p>
          <ol>{sections.map((t) => <li key={t}><a href={`#${slug(t)}`}>{t}</a></li>)}</ol>
        </aside>
        <article className="prose">{children}</article>
      </div>
    </Page>
  );
}
