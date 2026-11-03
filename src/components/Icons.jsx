/* Small inline icon set (stroke icons, currentColor). */
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' };
const I = (paths) => function Icon({ size = 20, ...rest }) {
  return <svg {...base} width={size} height={size} {...rest}>{paths}</svg>;
};

export const PhoneIcon = I(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />);
export const ArrowRight = I(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const ArrowLeft = I(<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>);
export const CheckIcon = I(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const CloseIcon = I(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>);
export const MenuIcon = I(<><path d="M4 7h16" /><path d="M4 12h11" /><path d="M4 17h16" /></>);
export const PinIcon = I(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const CalendarIcon = I(<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
export const ClockIcon = I(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const LockIcon = I(<><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>);
export const PlusIcon = I(<><path d="M12 5v14" /><path d="M5 12h14" /></>);
export const ChevronLeft = I(<path d="m15 6-6 6 6 6" />);
export const ChevronRight = I(<path d="m9 6 6 6-6 6" />);

/* Brand sun mark — the logo's rays + arc, simplified for small sizes. */
export function SunMark({ size = 22, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M16 3v4M6.5 7l2.6 3M25.5 7l-2.6 3M2.5 16h4M25.5 16h4" />
        <path d="M8 21a8 8 0 0 1 16 0" />
      </g>
    </svg>
  );
}

/* Small wave glyph used as a separator. */
export function WaveGlyph({ className = '' }) {
  return (
    <svg className={className} width="34" height="10" viewBox="0 0 34 10" aria-hidden="true" focusable="false">
      <path d="M1 5c4-5 8-5 12 0s8 5 12 0 6-4 8-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
