/* Privacy Policy — reflects what the site really collects (booking form, Stripe, Cloudflare, Google Fonts,
   session storage; no analytics or advertising trackers). Update it if you add analytics, ads, a CRM or email marketing. */
import { Link } from 'react-router-dom';
import { BUSINESS } from '../../data/business.js';
import LegalLayout, { LegalContact, Section, operator } from './LegalLayout.jsx';

const SECTIONS = [
  'Who we are',
  'Information we collect',
  'How we use your information',
  'How we share your information',
  'Cookies and browser storage',
  'How long we keep information',
  'How we protect information',
  'Your choices and rights',
  'Children’s privacy',
  'Third-party links',
  'Changes to this policy',
  'Contact us',
];

export default function Privacy() {
  return (
    <LegalLayout
      path="/privacy"
      sections={SECTIONS}
      intro={`How ${BUSINESS.name} collects, uses and protects the information you share when you visit this website, book an installation or contact us.`}
    >
      <Section title="Who we are">
        <p>
          This website is operated by {operator()} (“{BUSINESS.shortName}”, “we”, “us”), a lighting installation business based in {BUSINESS.city}, {BUSINESS.regionName}.
          This policy explains what personal information we collect through this website, why, and the choices you have.
        </p>
      </Section>

      <Section title="Information we collect">
        <h3>When you book an installation</h3>
        <p>Our booking form asks for:</p>
        <ul>
          <li>your full name, phone number, email address and the service address;</li>
          <li>the lighting type, package, home height and any add-ons you choose;</li>
          <li>your chosen install date and time window, and a booking reference.</li>
        </ul>
        <h3>When you pay a deposit</h3>
        <p>
          Card and wallet payments are processed by Stripe. Your card details are entered into Stripe’s secure payment form and go
          directly to Stripe — they are never sent to or stored by our website or booking system. Stripe tells us whether the payment
          succeeded, the amount, and a payment reference. Stripe’s use of your information is covered by the{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>.
        </p>
        <h3>When you contact us</h3>
        <p>
          Our contact and quote forms open your own email app with your message filled in; nothing is sent until you press Send. If you email,
          call or text us, we receive the information you choose to share, such as your name, contact details and details about your home.
        </p>
        <h3>Information collected automatically</h3>
        <p>
          Like any website, our hosting provider (Cloudflare) processes technical information needed to deliver and secure the site, such as
          your IP address, browser type and the pages requested. Our fonts are loaded from Google Fonts, which receives your IP address
          when the fonts load. We do not use analytics, advertising or social media tracking tools on this website.
        </p>
      </Section>

      <Section title="How we use your information">
        <ul>
          <li>to schedule, confirm, carry out and follow up on your installation, maintenance and takedown;</li>
          <li>to contact you about your booking, including rescheduling for weather or availability;</li>
          <li>to process your deposit or payment and keep accurate business and tax records;</li>
          <li>to answer your questions and quote requests;</li>
          <li>to keep the website and booking system secure and working properly; and</li>
          <li>to comply with legal obligations and protect our rights.</li>
        </ul>
        <p>We do not use your information to send marketing messages through this website.</p>
      </Section>

      <Section title="How we share your information">
        <p>We share personal information only with service providers that help us run the website and the business, for the purposes above:</p>
        <ul>
          <li><b>Cloudflare</b> — website hosting and the database that stores booking details;</li>
          <li><b>Stripe</b> — payment processing for deposits;</li>
          <li><b>Google</b> — web fonts (receives your IP address); and</li>
          <li>the email and phone providers we use to communicate with you.</li>
        </ul>
        <p>
          We may also disclose information if required by law, to protect our rights or safety or those of others, or as part of a sale or
          transfer of our business. We do not sell your personal information, and we do not share it for cross-context behavioral advertising.
        </p>
      </Section>

      <Section title="Cookies and browser storage">
        <p>
          We use your browser’s session storage to remember your booking progress and show your confirmation. It is cleared when you close
          the browser tab. Stripe and Cloudflare may set cookies needed for payment security and fraud and bot protection. See our{' '}
          <Link to="/cookies">Cookie Policy</Link> for details.
        </p>
      </Section>

      <Section title="How long we keep information">
        <p>
          We keep booking and payment records for as long as needed to provide our services and to meet our business, tax and legal
          record-keeping obligations, and then delete or anonymize them. Booking progress saved in your browser is removed when you close the tab.
        </p>
      </Section>

      <Section title="How we protect information">
        <p>
          The website is served over an encrypted (HTTPS) connection, payment details are handled by Stripe, and access to booking records is
          restricted. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="Your choices and rights">
        <p>
          You can ask us to access, correct or delete the personal information we hold about you by contacting us using the details below.
          We may need to verify your identity, and we may keep certain records where the law requires it.
        </p>
        <p>
          Depending on where you live and whether those laws apply to us, you may have additional rights — for example, California residents
          may have rights under California privacy law. We will not discriminate against you for exercising any privacy rights.
        </p>
      </Section>

      <Section title="Children’s privacy">
        <p>This website is intended for adults arranging services for their homes. We do not knowingly collect personal information from children under 13.</p>
      </Section>

      <Section title="Third-party links">
        <p>
          The website may link to other sites and services, such as Stripe or Google. Their privacy practices are governed by their own
          policies, and we are not responsible for them.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>We may update this policy as the website or our services change. The “Last updated” date shows when it last changed.</p>
      </Section>

      <Section title="Contact us">
        <p>Questions or requests about your information:</p>
        <LegalContact />
      </Section>
    </LegalLayout>
  );
}
