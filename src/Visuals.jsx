import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

const W = 520;
const H = 260;
const PAD = { l: 44, r: 16, t: 20, b: 34 };
const T_END = 6;

const x = (t) => PAD.l + (t / T_END) * (W - PAD.l - PAD.r);
const y = (v) => PAD.t + (1 - v / 1.4) * (H - PAD.t - PAD.b);

function curve(fn) {
  let d = "";
  for (let i = 0; i <= 300; i++) {
    const t = (T_END * i) / 300;
    d += `${i ? "L" : "M"}${x(t).toFixed(1)},${y(fn(t)).toFixed(1)}`;
  }
  return d;
}

const untuned = (t) => 1 - Math.cos(4.2 * t) * (0.25 + 0.75 * Math.exp(-1.1 * t));
const tuned = (t) => 1 - Math.exp(-2.4 * t) * (1 + 2.4 * t);

export function PidPlot({ compact = false }) {
  const [ref, seen] = useInView();
  return (
    <figure className={`pid${seen ? " is-on" : ""}${compact ? " pid--compact" : ""}`} ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Step response: untuned gains oscillate, tuned gains settle without overshoot">
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="pid__grid" />
            <text x={PAD.l - 10} y={y(v) + 4} className="pid__tick" textAnchor="end">
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(1)} y2={y(1)} className="pid__target" />
        <path d={curve(untuned)} className="pid__line pid__line--bad" pathLength="1" />
        <path d={curve(tuned)} className="pid__line pid__line--good" pathLength="1" />
        <text x={W - PAD.r} y={H - 10} className="pid__tick" textAnchor="end">
          time →
        </text>
        <text x={PAD.l} y={H - 10} className="pid__tick">
          wheel velocity / target
        </text>
      </svg>
      <figcaption>
        <span>
          <i className="sw sw--bad" /> kp 1.0: saturates the effort clamp and rings
        </span>
        <span>
          <i className="sw sw--good" /> kp 0.15 · ki 0.3: settles without overshoot
        </span>
      </figcaption>
    </figure>
  );
}

const BASE = import.meta.env.BASE_URL;

const SEASONS = [
  { year: "19–20", game: "Tower Takeover" },
  { year: "20–21", game: "Change Up" },
  { year: "21–22", game: "Tipping Point" },
  { year: "22–23", game: "Spin Up", note: "Worlds" },
  { year: "23–24", game: "Over Under", note: "Excellence" },
];

export function VexSeasons() {
  const [ref, seen] = useInView();
  return (
    <div className={`vex${seen ? " is-on" : ""}`} ref={ref}>
      <div className="vex__stage">
        <figure className="vex__shot vex__shot--lead">
          <img src={`${BASE}media/vex/ou-hero.jpg`} alt="1104D Over Under robot" loading="lazy" />
          <figcaption>1104D · Over Under</figcaption>
        </figure>
        <div className="vex__side">
          <figure className="vex__shot">
            <img src={`${BASE}media/vex/su-1104x.jpg`} alt="1104X Spin Up robot" loading="lazy" />
            <figcaption>1104X · Worlds</figcaption>
          </figure>
          <figure className="vex__shot vex__shot--clip">
            <img src={`${BASE}media/vex/ou-run.webp`} alt="Full-field practice run: intaking across the field and popping pneumatic wings to score" loading="lazy" />
          </figure>
        </div>
      </div>
      <div className="vex__head">
        <div className="vex__big">
          <strong>7</strong>
          <span>awards across 5 seasons</span>
        </div>
        <span className="vex__sub">Worlds 2023 · Excellence 2024</span>
      </div>
      <ol className="vex__track">
        {SEASONS.map((s, i) => (
          <li key={s.year} style={{ "--i": i }} className={s.note ? "is-key" : ""}>
            <span className="vex__yr">{s.year}</span>
            <span className="vex__game">{s.game}</span>
            {s.note && <span className="vex__note">{s.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
