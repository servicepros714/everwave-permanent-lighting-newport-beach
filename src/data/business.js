/* ─────────────────────────────────────────────────────────────
   Everwave Permanent Lighting Newport Beach — all editable content.
   Prices: `null` shows "Online quoting". Never add invented reviews,
   ratings, licenses or stats here.
   ───────────────────────────────────────────────────────────── */

export const BUSINESS = {
  name: 'Everwave Permanent Lighting',
  shortName: 'Everwave',
  city: 'Newport Beach',
  region: 'CA',
  // TODO: placeholder — the number provided (555-555-555) has only 9 digits. Replace display + tel: link.
  phoneDisplay: '(555) 555-5555',
  phoneHref: 'tel:+15555555555',
  // TODO: add the Google Business Profile review link once the profile is live.
  googleReviewUrl: '',
};

/* Plumbing — must stay unique per site (see the layout registry). */
export const SOURCE_TAG = 'everwave-newportbeach';
export const BOOKING_PREFIX = 'EW-';
export const DRAFT_PREFIX = 'EWR-';

/* Reservation deposit (USD). Applied to the final invoice. Must match DEPOSIT_CENTS in worker/worker.js. */
export const DEPOSIT = 149;

/* Install season (Pacific time, inclusive), Mon–Sun. */
export const SEASON = { start: { month: 10, day: 20 }, end: { month: 12, day: 20 } };
export const LEAD_HOURS = 48;

/* `id` is the exact value stored in the D1 `time` column (en dash). `start` = 24h start hour, Pacific. */
export const TIME_WINDOWS = [
  { id: '8AM–12PM', label: '8 AM – 12 PM', part: 'Morning', start: 8 },
  { id: '12PM–4PM', label: '12 PM – 4 PM', part: 'Afternoon', start: 12 },
];

export const LIGHTING_TYPES = [
  {
    id: 'Permanent',
    name: 'Permanent lighting',
    tag: 'Installed once · stays up',
    blurb: 'Low-profile LED lighting mounted along your roofline once and left in place, ready for every holiday.',
  },
  {
    id: 'Seasonal',
    name: 'Seasonal Christmas lights',
    tag: 'Leased · installed · taken down',
    blurb: 'Commercial-grade LED holiday lights we design, hang, maintain and take down after the holidays.',
  },
];

/* Package prices: `null` = "Online quoting". Seasonal and permanent can differ. */
export const PACKAGES = [
  {
    id: 'front',
    name: 'Front Only',
    code: 'FRT',
    price: { Seasonal: null, Permanent: null },
    coverage: 'Front of the home',
    features: [
      'Professional design for the front of the home',
      'Commercial-grade LED lights (leased, no purchase needed)',
      'Roofline & gutter-line installation',
      'Timer setup',
      'In-season maintenance & bulb replacement',
      'Takedown after the holidays',
    ],
  },
  {
    id: 'front-sides',
    name: 'Front & Sides',
    code: 'F+S',
    price: { Seasonal: null, Permanent: null },
    coverage: 'Front + side rooflines',
    features: [
      'Everything in Front Only',
      'Side rooflines & gutters',
      'Expanded custom design',
    ],
  },
];

/* What changes when the customer picks Permanent. */
export const PERMANENT_NOTES = [
  'Lights stay mounted all year — no yearly install or takedown',
  'Exact price is confirmed in your online quote',
];

/* Add-ons (booking step 3). `price: null` = "Online quoting". `pct` = percent of package price. */
export const STORY_OPTIONS = [
  { id: '1-Story', name: '1-story home', note: 'Single-level roofline' },
  { id: '2-Story', name: '2-story home', note: '+50% of package price', pct: 50 },
];

export const ADDONS = [
  { id: 'trees', name: 'Tree & bush wrapping', short: 'Trees', price: null },
  { id: 'wreaths', name: 'Wreaths / garland', short: 'Wreaths', price: null },
  { id: 'pathway', name: 'Pathway / stake lights', short: 'Pathway', price: null },
  { id: 'own', name: 'Install customer-owned lights', short: 'Own lights', price: null, flat: true },
  { id: 'storage', name: 'Off-season storage', short: 'Storage', price: null, seasonalOnly: true },
];

/* TODO: confirm the cities your crew covers. Positions (x, y in %) place pins on the coastline map. */
export const SERVICE_AREA = {
  home: 'Newport Beach',
  coast: [
    { name: 'Huntington Beach', x: 15, y: 50 },
    { name: 'Newport Beach', x: 45, y: 63, home: true },
    { name: 'Balboa Island', x: 51, y: 73 },
    { name: 'Corona del Mar', x: 60, y: 70, pos: 't' },
    { name: 'Newport Coast', x: 70, y: 74 },
    { name: 'Laguna Beach', x: 86, y: 81 },
  ],
  inland: [
    { name: 'Fountain Valley', x: 20, y: 28 },
    { name: 'Costa Mesa', x: 36, y: 40 },
    { name: 'Santa Ana', x: 33, y: 13 },
    { name: 'Tustin', x: 49, y: 15 },
    { name: 'Irvine', x: 60, y: 33 },
  ],
};

export const STEPS = [
  { id: 'book', title: 'Book online', text: 'Pick Permanent or Seasonal, your package and an install window. Reserve with a deposit or pay at the visit.' },
  { id: 'design', title: 'We design it', text: 'At the visit we walk your roofline, check outlets and confirm the design and final price with you.' },
  { id: 'install', title: 'We install', text: 'Our crew hangs and tests every run, sets your timer and leaves the yard clean.' },
  { id: 'takedown', title: 'Takedown', text: 'Seasonal lights come down after the holidays. Permanent lights simply stay up for next year.' },
];

/* Gallery — illustrated previews until real install photos arrive.
   TODO: replace with real night install photos (keep the alt text accurate). */
export const GALLERY = [
  { id: 'g1', scene: { house: 'beach', lights: 'warm', palms: true, water: true }, title: 'Warm white on a bay-front home', tag: 'Seasonal' },
  { id: 'g2', scene: { house: 'modern', lights: 'brand', palms: true }, title: 'Blue & gold permanent roofline', tag: 'Permanent' },
  { id: 'g3', scene: { house: 'spanish', lights: 'multi', palms: true, bushes: true }, title: 'Multicolor on a Spanish-style home', tag: 'Seasonal' },
  { id: 'g4', scene: { house: 'twostory', lights: 'cool', bushes: true, path: true }, title: 'Cool white two-story with pathway', tag: 'Seasonal' },
  { id: 'g5', scene: { house: 'craftsman', lights: 'redwhite', bushes: true, wreath: true }, title: 'Red & white with wreaths', tag: 'Seasonal' },
  { id: 'g6', scene: { house: 'cottage', lights: 'gold', bushes: true, path: true }, title: 'Gold permanent accent lighting', tag: 'Permanent' },
];

export const FAQ_TOPICS = ['All', 'Power', 'Lights', 'Schedule', 'Weather'];

export const FAQS = [
  {
    topic: 'Power',
    q: 'Do I need outdoor outlets?',
    a: 'Your lights run from an existing exterior outlet. At the design visit we check where your outlets are and how many runs they can support. If an outlet is missing or too far away, we will tell you before anything is installed.',
  },
  {
    topic: 'Power',
    q: 'How are the lights turned on and off?',
    a: 'Seasonal installs include timer setup, so the lights come on in the evening and shut off on their own. Permanent systems run from a controller, and we show you how to use it on install day.',
  },
  {
    topic: 'Lights',
    q: 'Should I lease seasonal lights or go permanent?',
    a: 'Seasonal lights are leased: we install, maintain and take them down each year, so there is nothing to buy or store. Permanent lighting is mounted once and stays up year-round. Both are quoted online and confirmed at the visit.',
  },
  {
    topic: 'Lights',
    q: 'Can you hang lights I already own?',
    a: 'Yes. Choose "Install customer-owned lights" as an add-on when you book. We check your strands at the visit before hanging them.',
  },
  {
    topic: 'Schedule',
    q: 'When does takedown happen?',
    // TODO: confirm takedown timing with the crew.
    a: 'Seasonal lights come down after the holidays. We contact you to schedule a takedown day. Permanent lights stay up.',
  },
  {
    topic: 'Schedule',
    q: 'How early should I book?',
    a: 'Install days run from October 20 to December 20, and the earliest open slot is 48 hours from now. Windows fill as December gets closer, so booking early gets you more choice.',
  },
  {
    topic: 'Schedule',
    q: 'What is the $149 deposit?',
    a: 'It reserves your install window and is applied to your final invoice. You can also skip it at checkout and pay at the visit.',
  },
  {
    topic: 'Weather',
    q: 'What if it rains on install day?',
    a: 'If rain or wind makes roof work unsafe, we call you to move your window to the next open day. Our lights and connections are made for outdoor use.',
  },
];
