/* Cookie Policy — matches the code: no first-party cookies; sessionStorage for the booking flow;
   Stripe.js only loads on /checkout; Cloudflare may set security cookies. Update if analytics or ads are added. */
import { Link } from 'react-router-dom';
import { BUSINESS } from '../../data/business.js';
import LegalLayout, { LegalContact, Section } from './LegalLayout.jsx';

const SECTIONS = ['What cookies are', 'Cookies on this website', 'Browser storage we use', 'Third-party services', 'Managing cookies', 'Changes to this policy', 'Contact us'];

export default function Cookies() {
  return (
    <LegalLayout path="/cookies" sections={SECTIONS} intro={`How the ${BUSINESS.name} website uses cookies and similar browser storage.`}>
      <Section title="What cookies are">
        <p>
          Cookies are small text files a website stores in your browser. Similar technologies, such as session storage, let a website remember
          information while you use it.
        </p>
      </Section>

      <Section title="Cookies on this website">
        <p>
          We do not set our own cookies, and we do not use analytics, advertising or social media tracking cookies. The only cookies you may
          receive come from the third-party services described below, and they are needed for security and payments.
        </p>
      </Section>

      <Section title="Browser storage we use">
        <div className="prose__table" role="region" aria-label="Browser storage used" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Expires</th></tr></thead>
            <tbody>
              <tr><td><code>everwave-draft-v1</code></td><td>Session storage</td><td>Remembers your booking choices as you move through the booking steps and payment.</td><td>When you close the tab</td></tr>
              <tr><td><code>everwave-last-booking</code></td><td>Session storage</td><td>Shows your booking details on the confirmation page.</td><td>When you close the tab</td></tr>
            </tbody>
          </table>
        </div>
        <p>This storage stays in your browser; it is strictly necessary for the booking form to work.</p>
      </Section>

      <Section title="Third-party services">
        <ul>
          <li>
            <b>Stripe</b> (checkout page only) — Stripe’s payment form may set cookies (for example <code>__stripe_mid</code> and <code>__stripe_sid</code>)
            to prevent fraud and keep payments secure. See <a href="https://stripe.com/cookie-settings" target="_blank" rel="noopener noreferrer">Stripe’s cookie information</a>.
          </li>
          <li>
            <b>Cloudflare</b> (hosting) — may set strictly necessary security cookies to protect the website from bots and abuse.
          </li>
          <li>
            <b>Google Fonts</b> — loads the website’s fonts. It does not set cookies, but Google receives your IP address when the fonts load.
          </li>
        </ul>
      </Section>

      <Section title="Managing cookies">
        <p>
          You can block or delete cookies in your browser settings. If you block cookies or storage needed for payments or booking, the booking
          form or checkout may not work — you can still <Link to="/contact">contact us</Link> to arrange your installation.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>If we add new tools that use cookies, we will update this page first. The “Last updated” date shows when it last changed.</p>
      </Section>

      <Section title="Contact us">
        <LegalContact />
        <p>See also our <Link to="/privacy">Privacy Policy</Link>.</p>
      </Section>
    </LegalLayout>
  );
}
