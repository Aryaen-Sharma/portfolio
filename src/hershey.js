// Glyphs from the Hershey "scripts" font (public domain, single-stroke).
// Format: first two chars are left/right bounds, then x/y pairs offset from "R".
// " R" lifts the pen; on a sand table there's no lifting, so strokes are joined.
const RAW = {
  A: String.raw`G[G[IZLWOSSLVFV[UXSUQSNQLQKRKTLVNXQZT[Y[`,
  S: String.raw`H\H[JZLXOTQQSMTJTGSFRFQGPIPKQMSOVQXSYUYWXYWZT[P[MZKXJVJT`,
  a: String.raw`L\UUTSRRPRNSMTLVLXMZO[Q[SZTXVRUWUZV[W[YZZY\V`,
  e: String.raw`NXOYQXRWSUSSRRQROSNUNXOZQ[S[UZVYXV`,
  h: String.raw`M\MVOSRNSLTITGSFQGPIOMNSM[ RM[NXOVQSSRURVSVUUXUZV[W[YZZY\V`,
  m: String.raw`E^EVGSIRJSJTIXH[ RIXJVLSNRPRQSQTPXO[ RPXQVSSURWRXSXUWXWZX[Y[[Z\Y^V`,
  n: String.raw`J\JVLSNROSOTNXM[ RNXOVQSSRURVSVUUXUZV[W[YZZY\V`,
  r: String.raw`MZMVOSPQPSSSTTTVSYSZT[U[WZXYZV`,
  y: String.raw`L[LVNRLXLZM[O[QZSXUU RVRPdOfMgLfLdMaP^S\U[XY[V`,
};

const code = (s, i) => s.charCodeAt(i) - 82;

function parse(s) {
  const strokes = [];
  let cur = [];
  for (let i = 2; i < s.length; i += 2) {
    if (s[i] === " " && s[i + 1] === "R") {
      strokes.push(cur);
      cur = [];
    } else {
      cur.push([code(s, i), code(s, i + 1)]);
    }
  }
  strokes.push(cur);
  return { left: code(s, 0), right: code(s, 1), strokes };
}

const GLYPHS = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, parse(v)]));

export function wordPath(word) {
  const pts = [];
  let x = 0;
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (!g) throw new Error(`No sand-table glyph for "${ch}"`);
    const dx = x - g.left;
    g.strokes.forEach((s) => s.forEach(([px, py]) => pts.push([px + dx, py])));
    x += g.right - g.left;
  }
  return pts;
}
