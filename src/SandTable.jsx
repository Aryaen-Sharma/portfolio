import { useEffect, useRef } from "react";
import { wordPath } from "./hershey.js";

const WORDS = ["Aryaen", "Sharma"];

// Sand is simulated as a heightmap on an N x N grid. The ball carves a trough
// and pushes sand up into lumpy ridges on either side; the surface is then lit
// from the top-left. Units are grid cells.
const N = 400;
const R1 = 6.4;
const R2 = 12.5;
const DEPTH = 1;
const RIDGE = 0.6;
const RELIEF = 1.4;
const STEP = 0.6;
const ANGLE = (-33 * Math.PI) / 180;
const STRETCH = 1.55;
const MARGIN = 10;

const L = (() => {
  const v = [-0.5, -0.68, 0.62];
  const m = Math.hypot(...v);
  return v.map((c) => c / m);
})();

function resample(pts) {
  const out = [pts[0]];
  let [px, py] = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    let d = Math.hypot(x - px, y - py);
    while (d >= STEP) {
      px += ((x - px) / d) * STEP;
      py += ((y - py) / d) * STEP;
      out.push([px, py]);
      d = Math.hypot(x - px, y - py);
    }
  }
  return out;
}

function quad(a, c, b, n = 40) {
  const pts = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return pts;
}

function blur(src, passes) {
  let a = src;
  for (let p = 0; p < passes; p++) {
    const b = new Float32Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let s = 0;
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= N) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= N) continue;
            s += a[yy * N + xx];
            c++;
          }
        }
        b[y * N + x] = s / c;
      }
    }
    a = b;
  }
  return a;
}

function makeFields() {
  const white = new Float32Array(N * N).map(() => Math.random());
  const soft = blur(white, 1);
  const clump = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    clump[i] = Math.max(0.15, 1 + (soft[i] - 0.5) * 5 + (Math.random() - 0.5) * 0.9);
  }

  const base = new Float32Array(N * N);
  const col = new Float32Array(N);
  let walk = 0;
  for (let x = 0; x < N; x++) {
    walk = walk * 0.82 + (Math.random() - 0.5) * 0.05;
    col[x] = walk;
  }
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) base[y * N + x] = col[x] + (Math.random() - 0.5) * 0.025;
  }
  for (let k = 0; k < 45; k++) {
    const x = Math.floor(Math.random() * N);
    const y0 = Math.floor(Math.random() * N);
    const len = 8 + Math.random() * 50;
    for (let y = y0; y < Math.min(N, y0 + len); y++) base[y * N + x] -= 0.1;
  }

  const grain = new Float32Array(N * N).map(() => (Math.random() - 0.5) * 9);
  return { clump, base, grain };
}

function plywood(W, f) {
  const c = document.createElement("canvas");
  c.width = c.height = W;
  const g = c.getContext("2d");
  const boards = [
    { x: 0, y: 0, w: W, h: f, horiz: true },
    { x: 0, y: W - f, w: W, h: f, horiz: true },
    { x: 0, y: f, w: f, h: W - 2 * f, horiz: false },
    { x: W - f, y: f, w: f, h: W - 2 * f, horiz: false },
  ];

  for (const b of boards) {
    g.save();
    g.beginPath();
    g.rect(b.x, b.y, b.w, b.h);
    g.clip();
    const tone = Math.random() * 10 - 5;
    g.fillStyle = `rgb(${226 + tone},${210 + tone},${180 + tone})`;
    g.fillRect(b.x, b.y, b.w, b.h);

    const along = b.horiz ? b.w : b.h;
    const across = b.horiz ? b.h : b.w;
    for (let k = 0; k < 34; k++) {
      const cx = b.x + Math.random() * b.w;
      const cy = b.y + Math.random() * b.h;
      const ra = along * (0.08 + Math.random() * 0.28);
      const rb = across * (0.08 + Math.random() * 0.3);
      const dark = Math.random() > 0.45;
      const col = dark ? "190,154,104" : "245,234,212";
      const a = dark ? 0.16 + Math.random() * 0.2 : 0.3 + Math.random() * 0.3;
      g.save();
      g.translate(cx, cy);
      g.scale(b.horiz ? ra : rb, b.horiz ? rb : ra);
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      rg.addColorStop(0, `rgba(${col},${a})`);
      rg.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = rg;
      g.beginPath();
      g.arc(0, 0, 1, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }

    for (let k = 0; k < 60; k++) {
      const off = Math.random() * across;
      const amp = across * (0.01 + Math.random() * 0.04);
      const freq = (Math.PI * 2 * (0.5 + Math.random() * 2)) / along;
      g.strokeStyle = `rgba(150,112,70,${0.03 + Math.random() * 0.07})`;
      g.lineWidth = 0.6 + Math.random() * 1.2;
      g.beginPath();
      for (let s = 0; s <= along; s += 8) {
        const o = off + Math.sin(s * freq + k) * amp;
        const px = b.horiz ? b.x + s : b.x + o;
        const py = b.horiz ? b.y + o : b.y + s;
        s ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.stroke();
    }
    g.restore();
  }

  g.strokeStyle = "rgba(110,80,45,0.35)";
  g.lineWidth = Math.max(1, W / 600);
  g.beginPath();
  g.moveTo(f, f);
  g.lineTo(f, W - f);
  g.moveTo(W - f, f);
  g.lineTo(W - f, W - f);
  g.moveTo(0, f);
  g.lineTo(W, f);
  g.moveTo(0, W - f);
  g.lineTo(W, W - f);
  g.stroke();

  const lip = Math.max(2, f * 0.05);
  g.fillStyle = "rgba(196,170,128,1)";
  g.fillRect(f - lip, f - lip, W - 2 * f + 2 * lip, lip);
  g.fillStyle = "rgba(120,90,55,0.55)";
  g.fillRect(f - lip, f - lip * 0.35, W - 2 * f + 2 * lip, lip * 0.35);

  for (let k = 0; k < 900; k++) {
    const side = Math.floor(Math.random() * 4);
    const t = Math.random();
    const e = f * Math.pow(Math.random(), 2.4);
    let x;
    let y;
    if (side === 0) [x, y] = [t * W, f - lip - e];
    else if (side === 1) [x, y] = [t * W, W - f + e];
    else if (side === 2) [x, y] = [f - e, t * W];
    else [x, y] = [W - f + e, t * W];
    const r = (0.4 + Math.random() * 1.8) * (W / 700);
    g.fillStyle = `rgba(252,251,248,${0.35 + Math.random() * 0.6})`;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  const edge = g.createLinearGradient(0, 0, W, W);
  edge.addColorStop(0, "rgba(255,255,255,0.08)");
  edge.addColorStop(1, "rgba(60,40,20,0.12)");
  g.fillStyle = edge;
  g.fillRect(0, 0, W, W);
  return c;
}

function sandOverlay(S, dpr) {
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const n = Math.floor(S * S * 0.05);
  for (let k = 0; k < n; k++) {
    const light = Math.random() > 0.5;
    g.fillStyle = light ? "rgba(255,255,255,0.4)" : "rgba(120,105,80,0.13)";
    g.fillRect(Math.random() * S, Math.random() * S, dpr, dpr);
  }
  const w = S * 0.05;
  const top = g.createLinearGradient(0, 0, 0, w);
  top.addColorStop(0, "rgba(90,70,40,0.28)");
  top.addColorStop(1, "rgba(90,70,40,0)");
  g.fillStyle = top;
  g.fillRect(0, 0, S, w);
  const left = g.createLinearGradient(0, 0, w, 0);
  left.addColorStop(0, "rgba(90,70,40,0.22)");
  left.addColorStop(1, "rgba(90,70,40,0)");
  g.fillStyle = left;
  g.fillRect(0, 0, w, S);
  return c;
}

export default function SandTable({ className = "", still = false }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const animate = !still && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    const { clump, base, grain } = makeFields();
    const H = new Float32Array(base);
    const sim = document.createElement("canvas");
    sim.width = sim.height = N;
    const simCtx = sim.getContext("2d");
    const img = simCtx.createImageData(N, N);
    const px = img.data;

    let dirty = null;
    const mark = (x0, y0, x1, y1) => {
      if (!dirty) dirty = [x0, y0, x1, y1];
      else {
        dirty[0] = Math.min(dirty[0], x0);
        dirty[1] = Math.min(dirty[1], y0);
        dirty[2] = Math.max(dirty[2], x1);
        dirty[3] = Math.max(dirty[3], y1);
      }
    };

    function carve(cx, cy) {
      const x0 = Math.max(0, Math.floor(cx - R2));
      const x1 = Math.min(N - 1, Math.ceil(cx + R2));
      const y0 = Math.max(0, Math.floor(cy - R2));
      const y1 = Math.min(N - 1, Math.ceil(cy + R2));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - cx, y - cy);
          if (d >= R2) continue;
          const i = y * N + x;
          if (d < R1) {
            const t = d / R1;
            const target = -DEPTH * (1 - t * t);
            if (H[i] > target) H[i] = target;
          } else {
            const u = (d - R1) / (R2 - R1);
            const bump = RIDGE * clump[i] * Math.exp(-(((u - 0.3) / 0.3) ** 2));
            if (H[i] < bump && H[i] > -0.6) H[i] += (bump - H[i]) * 0.55;
          }
        }
      }
      mark(x0, y0, x1, y1);
    }

    function smooth(cx, cy) {
      const x0 = Math.max(0, Math.floor(cx - R2));
      const x1 = Math.min(N - 1, Math.ceil(cx + R2));
      const y0 = Math.max(0, Math.floor(cy - R2));
      const y1 = Math.min(N - 1, Math.ceil(cy + R2));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - cx, y - cy);
          if (d >= R2) continue;
          const i = y * N + x;
          const furrow = 0.16 * Math.max(0, 1 - (d / (R2 * 0.5)) ** 2);
          H[i] += (base[i] - furrow - H[i]) * 0.5;
        }
      }
      mark(x0, y0, x1, y1);
    }

    function shade(x0, y0, x1, y1) {
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const i = y * N + x;
          const l = x > 0 ? H[i - 1] : H[i];
          const r = x < N - 1 ? H[i + 1] : H[i];
          const u = y > 0 ? H[i - N] : H[i];
          const d = y < N - 1 ? H[i + N] : H[i];
          const nx = (l - r) * RELIEF;
          const ny = (u - d) * RELIEF;
          const lam = (nx * L[0] + ny * L[1] + L[2]) / Math.sqrt(nx * nx + ny * ny + 1);
          let s = 0.32 + 0.68 * (lam / L[2]);
          s = Math.min(1.22, Math.max(0.36, s));
          const h = H[i];
          const v = s * (h < 0 ? 1 + h * 0.14 : 1 + h * 0.04);
          const gn = h < -0.25 ? grain[i] * 0.3 : grain[i];
          const o = i * 4;
          px[o] = 243 * v + gn;
          px[o + 1] = 239 * v + gn;
          px[o + 2] = 230 * v + gn - (v < 0.85 ? (0.85 - v) * 26 : 0);
          px[o + 3] = 255;
        }
      }
      simCtx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    }

    function writePath(word, from) {
      const raw = wordPath(word);
      const c = Math.cos(ANGLE);
      const s = Math.sin(ANGLE);
      const rot = raw.map(([x, y]) => [x * c - y * STRETCH * s, x * s + y * STRETCH * c]);
      const xs = rot.map((p) => p[0]);
      const ys = rot.map((p) => p[1]);
      const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      const scale = (N * 0.84) / Math.max(maxX - minX, maxY - minY);
      const ox = N / 2 - ((minX + maxX) / 2) * scale + N * 0.02;
      const oy = N / 2 - ((minY + maxY) / 2) * scale - N * 0.04;
      const name = rot.map(([x, y]) => [x * scale + ox, y * scale + oy]);

      const first = name[0];
      const bottom = N - MARGIN - 1;
      const lead = [Math.max(MARGIN + 2, first[0] - N * 0.06), bottom];
      const route = from ? [from, [from[0], bottom], lead] : [lead];
      const tail = quad(lead, [lead[0] + N * 0.01, first[1] + (bottom - first[1]) * 0.25], first);
      const travel = from ? resample(route) : [];
      carveFrom = travel.length;
      return [...travel, ...resample([lead, ...tail, ...name])];
    }

    function wipePath(from) {
      const sp = R2 * 1.05;
      const pts = [from];
      let down = from[1] < N / 2;
      for (let x = N - MARGIN; x >= MARGIN; x -= sp) {
        pts.push([x, down ? MARGIN : N - MARGIN], [x, down ? N - MARGIN : MARGIN]);
        down = !down;
      }
      return resample(pts);
    }

    let carveFrom = 0;
    let wordIndex = 0;
    let path = writePath(WORDS[0], null);
    path.forEach(([x, y]) => carve(x, y));
    let ball = path[path.length - 1];
    dirty = null;
    shade(0, 0, N - 1, N - 1);

    let phase = "hold";
    let i = 0;
    let holdUntil = performance.now() + 3200;

    let frame = null;
    let overlay = null;
    let W = 0;
    let f = 0;
    let S = 0;
    let dpr = 1;
    const ctx = canvas.getContext("2d");

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const css = wrap.clientWidth;
      W = Math.round(css * dpr);
      canvas.width = canvas.height = W;
      canvas.style.width = canvas.style.height = `${css}px`;
      f = Math.round(W * 0.1);
      S = W - 2 * f;
      frame = plywood(W, f);
      overlay = sandOverlay(S, dpr);
    }

    function render() {
      ctx.clearRect(0, 0, W, W);
      ctx.drawImage(frame, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sim, f, f, S, S);
      ctx.drawImage(overlay, f, f);
      const k = S / N;
      const bx = f + ball[0] * k;
      const by = f + ball[1] * k;
      const br = R1 * 1.1 * k;
      ctx.fillStyle = "rgba(70,60,45,0.35)";
      ctx.beginPath();
      ctx.ellipse(bx + br * 0.35, by + br * 0.45, br * 1.05, br * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      const g = ctx.createRadialGradient(bx - br * 0.4, by - br * 0.45, br * 0.05, bx, by, br);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.25, "#d9dde1");
      g.addColorStop(0.65, "#7d838a");
      g.addColorStop(1, "#2e3236");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (phase === "hold") {
        if (now < holdUntil) return;
        path = wipePath(ball);
        phase = "wipe";
        i = 0;
      }
      const seconds = phase === "wipe" ? 6.5 : 11;
      const next = Math.min(path.length - 1, i + Math.max(2, Math.ceil(path.length / (seconds * 60))));
      for (let j = i + 1; j <= next; j++) {
        const [x, y] = path[j];
        phase === "wipe" || j < carveFrom ? smooth(x, y) : carve(x, y);
      }
      i = next;
      ball = path[i];
      if (dirty) {
        shade(...dirty);
        dirty = null;
      }
      if (i >= path.length - 1) {
        if (phase === "wipe") {
          wordIndex = (wordIndex + 1) % WORDS.length;
          path = writePath(WORDS[wordIndex], ball);
          phase = "write";
          i = 0;
        } else {
          phase = "hold";
          holdUntil = now + 4500;
        }
      }
      render();
    }

    layout();
    render();
    if (animate) raf = requestAnimationFrame(tick);

    let timer;
    let lastW = wrap.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(wrap.clientWidth - lastW) < 2) return;
      lastW = wrap.clientWidth;
      clearTimeout(timer);
      timer = setTimeout(() => {
        layout();
        render();
      }, 120);
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [still]);

  return (
    <div className={`sand ${className}`} ref={wrapRef}>
      <canvas ref={canvasRef} role="img" aria-label="Animated sand table writing Aryaen Sharma in cursive" />
    </div>
  );
}
