/* Terms and Conditions. Business policies that have not been confirmed (cancellation, deposit refunds,
   payment terms, warranty) are NOT invented: when the POLICIES fields in business.js are empty, the page
   says those terms are confirmed with the customer before they pay. Fill them in to publish them here. */
import { Link } from 'react-router-dom';
import { BUSINESS, DEPOSIT, POLICIES } from '../../data/business.js';
import LegalLayout, { LegalContact, Section, operator } from './LegalLayout.jsx';

const SECTIONS = [
  'About these terms',
  'Using this website',
  'Our services',
  'Quotes and estimates',
  'Bookings, deposits and payment',
  'Scheduling, cancellations and rescheduling',
  'Your responsibilities and property access',
  'Changes and additional work',
  'Leased seasonal lights',
  'Warranties',
  'Intellectual property',
  'Limitation of liability',
  'Third-party links and services',
  'Privacy',
  'Governing law',
  'Changes to these terms',
  'Contact us',
];

const Pending = ({ children }) => <p>{children}</p>;

export default function Terms() {
  return (
    <LegalLayout
      path="/terms"
      sections={SECTIONS}
      intro={`The terms that apply when you use the ${BUSINESS.name} website, request a quote or book an installation.`}
    >
      <Section title="About these terms">
        <p>
          These terms apply to your use of this website and to quotes and bookings made through it with {operator()} (“{BUSINESS.shortName}”, “we”, “us”).
          By using the website or making a booking, you agree to these terms. Any written quote, invoice or agreement we give you for your
          project also applies, and takes priority if it differs from these terms.
        </p>
      </Section>

      <Section title="Using this website">
        <p>You agree to use the website lawfully and not to:</p>
        <ul>
          <li>submit false, misleading or someone else’s information, or make bookings you do not intend to keep;</li>
          <li>interfere with the website, the booking system or its security, or try to access data that isn’t yours; or</li>
          <li>use automated tools to scrape, overload or misuse the website.</li>
        </ul>
        <p>We may refuse or cancel bookings that appear fraudulent or abusive.</p>
      </Section>

      <Section title="Our services">
        <p>
          We offer permanent LED roofline lighting, which is mounted once and left in place, and seasonal Christmas light installation,
          which includes design, installation, in-season maintenance and takedown after the holidays. Packages cover the front of the home,
          or the front and sides; add-ons are listed on the website.
        </p>
        <p>
          The exact scope of your project — which rooflines, how many runs, and which add-ons — is confirmed with you at the visit.
          Gallery images on this website are illustrated design previews, not photographs of completed work.
        </p>
      </Section>

      <Section title="Quotes and estimates">
        <p>
          Prices on the website are “starting at” prices, and some items are quoted online. Estimates shown in the booking form are based on
          the options you select and are not a final price. Your final price is confirmed with you at the visit, before anything is installed,
          and may differ from the online estimate depending on your home, power access and design.
        </p>
      </Section>

      <Section title="Bookings, deposits and payment">
        <p>
          A booking reserves an install date and time window. You can reserve with a ${DEPOSIT} deposit, which is applied to your final invoice,
          or choose to pay at the visit. Deposits are processed by Stripe. A booking is subject to availability: if a window is taken before
          your booking is saved, you will be asked to choose another — or, if you have already paid a deposit, we will contact you to arrange another time.
        </p>
        {POLICIES.paymentTerms
          ? <p>{POLICIES.paymentTerms}</p>
          : <Pending>When and how the remaining balance is paid is confirmed with you at the visit, before installation begins.</Pending>}
      </Section>

      <Section title="Scheduling, cancellations and rescheduling">
        <p>
          Our crew arrives within your booked window (Pacific time). If rain or wind makes roof work unsafe, we will contact you to move your
          window to the next open day.
        </p>
        {POLICIES.cancellation
          ? <p>{POLICIES.cancellation}</p>
          : <Pending>If you need to cancel or reschedule, please contact us as early as possible.</Pending>}
        {POLICIES.depositRefund
          ? <p>{POLICIES.depositRefund}</p>
          : <Pending>Our deposit refund terms have not yet been published on this website. Please ask us before paying a deposit and we will explain how cancellations and refunds are handled for your booking.</Pending>}
      </Section>

      <Section title="Your responsibilities and property access">
        <p>To help us complete your installation safely, you agree to:</p>
        <ul>
          <li>give accurate contact details and an accurate service address;</li>
          <li>provide safe access to the areas being lit, including gates and side yards, during your window;</li>
          <li>make sure a working exterior outlet is available, or discuss alternatives with us at the visit;</li>
          <li>tell us about known hazards, such as damaged roofing, electrical issues or pets in the yard; and</li>
          <li>confirm you have any permission needed for the installation, for example from a landlord or homeowners’ association.</li>
        </ul>
      </Section>

      <Section title="Changes and additional work">
        <p>
          If you ask for changes to the confirmed design, or for extra lighting or add-ons, the price may change. We will agree any change in
          scope and price with you before doing the additional work.
        </p>
      </Section>

      <Section title="Leased seasonal lights">
        <p>
          Seasonal Christmas lights are leased for the season, not sold, unless we agree otherwise in writing. They are removed at takedown.
          Permanent lighting and any customer-owned lights we install are handled as confirmed in your quote or invoice.
        </p>
      </Section>

      <Section title="Warranties">
        {POLICIES.warranty
          ? <p>{POLICIES.warranty}</p>
          : <p>Any warranty on products or workmanship is limited to what is stated in writing in your quote or invoice.</p>}
        <p>
          The website and its content are provided “as is”. We work to keep information such as prices and availability accurate, but we do
          not guarantee that the website will always be error-free or available.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          The website’s content — including text, illustrations, logos and design — belongs to {BUSINESS.name} or its licensors. You may view it
          for personal use, but you may not copy, reproduce or reuse it for commercial purposes without our written permission.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for indirect, incidental or consequential losses arising from your use of
          the website. Nothing in these terms limits any liability that cannot be limited under applicable law, including your rights as a consumer.
        </p>
      </Section>

      <Section title="Third-party links and services">
        <p>
          The website uses or links to third-party services, such as Stripe for payments and Google for fonts. Those services have their own
          terms and privacy policies, and we are not responsible for their content or practices.
        </p>
      </Section>

      <Section title="Privacy">
        <p>How we handle your personal information is explained in our <Link to="/privacy">Privacy Policy</Link> and <Link to="/cookies">Cookie Policy</Link>.</p>
      </Section>

      <Section title="Governing law">
        <p>These terms are governed by the laws of {POLICIES.governingLaw}, without regard to its conflict-of-law rules.</p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms from time to time. The version that applies to a booking is the one on this page when the booking was made.
          The “Last updated” date shows when the terms last changed.
        </p>
      </Section>

      <Section title="Contact us">
        <LegalContact />
      </Section>
    </LegalLayout>
  );
}
