/* Accessibility Statement — lists only measures that exist in the code. It states a goal (WCAG 2.1 AA),
   not a certified conformance claim; no formal audit has been done. */
import { BUSINESS, hasPhone } from '../../data/business.js';
import LegalLayout, { LegalContact, Section } from './LegalLayout.jsx';

const SECTIONS = ['Our commitment', 'What we have done', 'Known limitations', 'Feedback and help', 'Ongoing work'];

export default function Accessibility() {
  return (
    <LegalLayout path="/accessibility" sections={SECTIONS} intro={`Our commitment to making the ${BUSINESS.name} website usable for everyone.`}>
      <Section title="Our commitment">
        <p>
          We want everyone to be able to learn about our services and book an installation, including people who use assistive technology.
          We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. This website has not yet been formally audited
          against those guidelines.
        </p>
      </Section>

      <Section title="What we have done">
        <ul>
          <li>A “Skip to content” link and a consistent page structure with headings and landmarks;</li>
          <li>keyboard access to menus, buttons, the gallery, the FAQ and every booking step, with a visible focus outline;</li>
          <li>a mobile menu that moves focus to its close button when opened and can be closed with the Escape key;</li>
          <li>labels on every form field and clear error messages that name the field to fix;</li>
          <li>text alternatives for illustrations and a text summary of the install-availability chart;</li>
          <li>animations turned off when your device is set to reduce motion; and</li>
          <li>layouts that adapt from small phone screens (320px wide) up to large desktops.</li>
        </ul>
      </Section>

      <Section title="Known limitations">
        <ul>
          <li>The card payment form on the checkout page is provided by Stripe, so its accessibility is managed by Stripe.</li>
          <li>Gallery images are illustrations. They have text descriptions, but real install photos are not yet available.</li>
        </ul>
      </Section>

      <Section title="Feedback and help">
        <p>
          If you have trouble using any part of the website, please let us know which page and what happened, and we will work to fix it.
          {hasPhone() ? ' We can also take your booking by phone.' : ' We will also help you book another way.'}
        </p>
        <LegalContact />
      </Section>

      <Section title="Ongoing work">
        <p>We review accessibility when we add new pages or features, and we will update this statement as we make improvements.</p>
      </Section>
    </LegalLayout>
  );
}
