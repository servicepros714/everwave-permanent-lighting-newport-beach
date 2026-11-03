/* Illustrated night install scenes ("Design preview") — stand-ins until real photos arrive.
   <NightScene house="beach" lights="warm" palms water /> */
import { useId, useMemo } from 'react';

const PALETTES = {
  warm: ['#FFD27A', '#FFC85C'],
  cool: ['#E9F7FF', '#BFE6FF'],
  multi: ['#FF5252', '#3DDC84', '#FFD21F', '#38A8FF', '#FF7AD9'],
  gold: ['#FDC302', '#FDE110'],
  redwhite: ['#FF3B3B', '#FFFFFF'],
  brand: ['#00BBFC', '#FDC302', '#0092FD', '#F89B01'],
};
const GLOW = { warm: '#FFC85C', cool: '#BFE6FF', multi: '#FFE08A', gold: '#FDC302', redwhite: '#FF9A9A', brand: '#7FD8FF' };

const G = 222; // ground line

/* House definitions: shapes (filled) + runs (light strings) + windows + door. */
const HOUSES = {
  cottage: {
    shapes: [
      { d: 'M120 222V150H280V222Z', f: '#0F1C47' },
      { d: 'M104 154L200 92L296 154Z', f: '#081231' },
    ],
    runs: [[[104, 154], [200, 92], [296, 154]], [[104, 154], [296, 154]]],
    windows: [[140, 170, 32, 26], [228, 170, 32, 26]],
    door: [186, 176, 28, 46],
  },
  twostory: {
    shapes: [
      { d: 'M95 222V98H305V222Z', f: '#0F1C47' },
      { d: 'M80 100L135 62H265L320 100Z', f: '#081231' },
      { d: 'M86 156H314V162H86Z', f: '#081231' },
    ],
    runs: [[[80, 100], [135, 62], [265, 62], [320, 100]], [[80, 100], [320, 100]], [[86, 156], [314, 156]]],
    windows: [[115, 114, 30, 26], [185, 114, 30, 26], [255, 114, 30, 26], [115, 176, 30, 26], [255, 176, 30, 26]],
    door: [185, 178, 30, 44],
  },
  modern: {
    shapes: [
      { d: 'M62 222V118H230V222Z', f: '#101E4B' },
      { d: 'M52 110H240V119H52Z', f: '#070F2C' },
      { d: 'M216 222V148H340V222Z', f: '#0D1942' },
      { d: 'M206 140H350V149H206Z', f: '#070F2C' },
    ],
    runs: [[[52, 110], [240, 110]], [[206, 140], [350, 140]], [[52, 110], [52, 119]], [[350, 140], [350, 149]]],
    windows: [[80, 136, 96, 54], [236, 164, 46, 28], [292, 164, 34, 28]],
    door: [188, 168, 26, 54],
  },
  spanish: {
    shapes: [
      { d: 'M100 222V132H300V222Z', f: '#151A46' },
      { d: 'M86 136L200 104L314 136Z', f: '#1A0F2E' },
      { d: 'M236 132V92H282V132Z', f: '#151A46' },
      { d: 'M230 88H288V96H230Z', f: '#1A0F2E' },
    ],
    runs: [[[86, 136], [200, 104], [314, 136]], [[86, 136], [314, 136]], [[230, 88], [288, 88]]],
    windows: [[124, 156, 28, 34, 'arch'], [172, 156, 28, 34, 'arch'], [248, 104, 22, 22, 'arch']],
    door: [232, 168, 34, 54, 'arch'],
  },
  beach: {
    shapes: [
      { d: 'M125 222V98H295V222Z', f: '#0F1D4A' },
      { d: 'M110 102L210 46L310 102Z', f: '#081231' },
      { d: 'M108 156H312V162H108Z', f: '#081231' },
    ],
    runs: [[[110, 102], [210, 46], [310, 102]], [[110, 102], [310, 102]], [[108, 156], [312, 156]]],
    windows: [[148, 112, 40, 30], [232, 112, 40, 30], [196, 66, 28, 22], [148, 174, 40, 28]],
    door: [238, 174, 28, 48],
    rail: [108, 156, 312, 140],
  },
  craftsman: {
    shapes: [
      { d: 'M85 222V136H315V222Z', f: '#0F1C47' },
      { d: 'M68 140L112 100H288L332 140Z', f: '#081231' },
      { d: 'M146 142L200 106L254 142Z', f: '#0B163A' },
      { d: 'M152 142H158V222H152ZM242 142H248V222H242Z', f: '#081231' },
    ],
    runs: [[[68, 140], [112, 100], [288, 100], [332, 140]], [[68, 140], [332, 140]], [[146, 142], [200, 106], [254, 142]]],
    windows: [[100, 162, 34, 26], [266, 162, 34, 26]],
    door: [186, 170, 28, 52],
  },
};

function along(pts, gap) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.round(len / gap));
    for (let k = i === 0 ? 0 : 1; k <= n; k++) out.push([x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n]);
  }
  return out;
}
function rng(seed) {
  let s = seed % 2147483647 || 7;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const hash = (str) => Array.from(str).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 17);

function Palm({ x, h, lean, lit, colors }) {
  const top = [x + lean, G - h];
  const trunk = `M${x} ${G} Q${x + lean * 0.2} ${G - h * 0.55} ${top[0]} ${top[1]}`;
  const fronds = [-150, -115, -70, -30, 10, 35].map((a, i) => {
    const r = 34 + (i % 2) * 8;
    const rad = (a * Math.PI) / 180;
    const ex = top[0] + Math.cos(rad) * r;
    const ey = top[1] + Math.sin(rad) * r * 0.55 + 16;
    const cx = top[0] + Math.cos(rad) * r * 0.5;
    const cy = top[1] + Math.sin(rad) * r * 0.5 - 8;
    return `M${top[0]} ${top[1]} Q${cx} ${cy} ${ex} ${ey}`;
  });
  const dots = lit ? along([[x, G - 4], [x + lean * 0.4, G - h * 0.5], [top[0], top[1] + 6]], 7) : [];
  return (
    <g>
      <path d={trunk} stroke="#040B22" strokeWidth="5" fill="none" strokeLinecap="round" />
      {fronds.map((d, i) => <path key={i} d={d} stroke="#040B22" strokeWidth="4" fill="none" strokeLinecap="round" />)}
      {dots.map(([px, py], i) => <circle key={i} cx={px + (i % 2 ? 2 : -2)} cy={py} r="1.6" fill={colors[i % colors.length]} />)}
    </g>
  );
}

export default function NightScene({
  house = 'cottage', lights = 'warm', palms = false, water = false, bushes = false, path = false, wreath = false,
  className = '', label, slice = false,
}) {
  const raw = useId();
  const uid = 'ns' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const H = HOUSES[house] || HOUSES.cottage;
  const colors = PALETTES[lights] || PALETTES.warm;
  const glow = GLOW[lights] || '#FFD27A';

  const { stars, bulbs } = useMemo(() => {
    const r = rng(hash(house + lights));
    const st = Array.from({ length: 22 }, () => [r() * 400, r() * 80, r() * 0.9 + 0.3]);
    const b = H.runs.flatMap((run) => along(run, 7.5));
    return { stars: st, bulbs: b };
  }, [house, lights, H]);

  const doorX = H.door[0] + H.door[2] / 2;

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'}
      role="img"
      aria-label={label || `Illustrated night preview: ${house} home with ${lights} lights`}
    >
      <defs>
        <linearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#010B3B" />
          <stop offset="0.65" stopColor="#00245E" />
          <stop offset="1" stopColor="#004391" />
        </linearGradient>
        <linearGradient id={`${uid}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#012A6B" />
          <stop offset="1" stopColor="#010B3B" />
        </linearGradient>
        <filter id={`${uid}g`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>
        <filter id={`${uid}b`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>

      <rect width="400" height="260" fill={`url(#${uid}s)`} />
      {stars.map(([x, y, o], i) => <circle key={i} cx={x} cy={y} r={o > 0.9 ? 1.1 : 0.7} fill="#fff" opacity={o * 0.7} />)}
      <circle cx="344" cy="40" r="13" fill="#FFF3C4" opacity="0.92" />
      <circle cx="350" cy="36" r="12" fill={`url(#${uid}s)`} opacity="0.95" />
      <path d="M0 210 Q60 186 120 200 T240 194 T400 202 V222 H0Z" fill="#021034" opacity="0.9" />

      {water ? (
        <>
          <rect y="222" width="400" height="10" fill="#020A26" />
          <rect y="232" width="400" height="28" fill={`url(#${uid}w)`} />
          <g filter={`url(#${uid}b)`} opacity="0.5">
            {bulbs.filter((_, i) => i % 3 === 0).map(([x], i) => (
              <rect key={i} x={x - 1} y={236 + (i % 3) * 3} width="2" height={10 + (i % 4) * 3} fill={colors[i % colors.length]} />
            ))}
          </g>
          <path d="M0 244 Q50 241 100 244 T200 244 T300 244 T400 244" stroke="#7FD8FF" strokeWidth="0.6" fill="none" opacity="0.35" />
        </>
      ) : (
        <rect y="222" width="400" height="38" fill="#020A26" />
      )}

      {H.shapes.map((s, i) => <path key={i} d={s.d} fill={s.f} />)}

      {H.windows.map(([x, y, w, h, kind], i) => (
        kind === 'arch'
          ? <path key={i} d={`M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`} fill="#FFB547" opacity="0.82" />
          : <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#FFB547" opacity="0.8" />
      ))}
      {H.door[4] === 'arch'
        ? <path d={`M${H.door[0]} ${G}V${H.door[1] + H.door[2] / 2}A${H.door[2] / 2} ${H.door[2] / 2} 0 0 1 ${H.door[0] + H.door[2]} ${H.door[1] + H.door[2] / 2}V${G}Z`} fill="#3A1E0E" />
        : <rect x={H.door[0]} y={H.door[1]} width={H.door[2]} height={H.door[3]} rx="2" fill="#3A1E0E" />}
      {H.rail && (
        <g stroke="#081231" strokeWidth="2">
          {Array.from({ length: 12 }, (_, i) => {
            const x = H.rail[0] + ((H.rail[2] - H.rail[0]) * i) / 11;
            return <line key={i} x1={x} y1={H.rail[1]} x2={x} y2={H.rail[3]} />;
          })}
          <line x1={H.rail[0]} y1={H.rail[3]} x2={H.rail[2]} y2={H.rail[3]} />
        </g>
      )}
      {wreath && (
        <g fill="none" strokeWidth="3.4">
          <circle cx={doorX} cy={H.door[1] + 14} r="7" stroke="#0E5A3A" />
          <circle cx={doorX} cy={H.door[1] + 14} r="7" stroke={colors[0]} strokeDasharray="1 4" strokeWidth="2.4" />
        </g>
      )}

      {/* light strings: blurred glow underlay, then bulbs */}
      <g filter={`url(#${uid}g)`} opacity="0.6">
        {H.runs.map((run, i) => (
          <polyline key={i} points={run.map((p) => p.join(',')).join(' ')} fill="none" stroke={glow} strokeWidth="5" strokeLinejoin="round" />
        ))}
      </g>
      <g>
        {H.runs.map((run, i) => (
          <polyline key={i} points={run.map((p) => p.join(',')).join(' ')} fill="none" stroke="#0A1433" strokeWidth="0.8" />
        ))}
        {bulbs.map(([x, y], i) => <circle key={i} cx={x} cy={y + 1.4} r="2" fill={colors[i % colors.length]} />)}
      </g>

      {palms && (
        <>
          <Palm x={46} h={120} lean={-10} lit={bushes} colors={colors} />
          <Palm x={366} h={104} lean={12} lit={false} colors={colors} />
        </>
      )}

      {bushes && [[70, 216], [330, 216], [148, 218]].map(([cx, cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="20" ry="11" fill="#062A26" />
          {Array.from({ length: 9 }, (_, k) => (
            <circle key={k} cx={cx - 14 + ((k * 7) % 28)} cy={cy - 6 + ((k * 5) % 11)} r="1.5" fill={colors[(k + i) % colors.length]} />
          ))}
        </g>
      ))}

      {path && !water && along([[doorX, 226], [doorX + 18, 240], [doorX + 4, 258]], 9).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x - 12} cy={y} r="1.8" fill={colors[0]} />
          <circle cx={x + 12} cy={y} r="1.8" fill={colors[0]} />
        </g>
      ))}
    </svg>
  );
}
