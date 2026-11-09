import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SandTable from "./SandTable.jsx";
import { PidPlot, VexSeasons } from "./Visuals.jsx";
import { profile, software, robotics, experience, highlights, skills, vexSeasons, vexAwards } from "./data.js";

const BASE = import.meta.env.BASE_URL;
const TABS = { software, robotics };

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.74 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.42.37.8 1.1.8 2.22v3.29c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
);
const Right = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const Chevron = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

function parse() {
  const [page, a, b] = window.location.hash.replace(/^#\/?/, "").split("/");
  if (page === "projects") {
    const tab = a in TABS ? a : "software";
    const project = b ? TABS[tab].find((p) => p.slug === b) : null;
    return { page, tab, slug: project ? project.slug : null, target: null };
  }
  if (page === "experience") return { page, target: a || null };
  return { page: "home", target: null };
}

function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    if (!route.target) {
      window.scrollTo(0, 0);
      return;
    }
    const go = () => {
      const el = document.getElementById(route.target);
      if (!el) return;
      el.classList.add("is-in");
      el.scrollIntoView({ block: "start" });
    };
    const a = setTimeout(go, 60);
    const b = setTimeout(go, 520);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [route.page, route.tab, route.slug, route.target]);
  return route;
}

function useReveal() {
  useEffect(() => {
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            seen.add(e.target);
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (seen.has(el)) el.classList.add("is-in");
        else io.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

function Nav({ page }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const link = (key, href, label) => (
    <a href={href} className={page === key ? "is-current" : ""} aria-current={page === key ? "page" : undefined}>
      {label}
    </a>
  );
  return (
    <nav className={`nav${solid ? " is-solid" : ""}`}>
      <a href="#/" className="nav__mark">
        Aryaen<span> Sharma</span>
      </a>
      <div className="nav__links">
        {link("projects", "#/projects/software", "Projects")}
        {link("experience", "#/experience", "Experience")}
        <a className="nav__cta" href={`mailto:${profile.email}`}>
          Email me
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero__text">
        <p className="hero__status">
          <span className="pulse" /> Incoming at {profile.next.company}, {profile.next.term}
        </p>
        <h1>Aryaen Sharma</h1>
        <p className="hero__school">{profile.school}</p>
        <p className="hero__lede">
          Three software co-ops so far, at Enginess and twice at Bell, mostly backend work and test
          automation. Before that, five seasons of competitive VEX robotics, and I still build
          robotics projects on the side.
        </p>
        <div className="hero__cta">
          <a className="btn btn--fill" href="#/projects/software">
            See my projects
          </a>
          <a className="btn" href="#/experience">
            Experience
          </a>
          <a className="btn btn--icon" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a className="btn btn--icon" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
      <div className="hero__art">
        <SandTable />
        <p className="hero__caption">
          A simulation of the <a href="#/projects/robotics/sand-table">sand table I built in high school</a>,
          writing my name the way the real one did.
        </p>
      </div>
    </header>
  );
}

function TestDots() {
  return (
    <div className="dots" aria-hidden="true">
      {Array.from({ length: 150 }, (_, i) => (
        <i key={i} style={{ "--i": i }} />
      ))}
    </div>
  );
}

function Highlight({ h }) {
  return (
    <a className="hl" href={h.href} data-reveal>
      <div className="hl__visual">
        {h.image && <img src={`${BASE}${h.image}`} alt="" loading="lazy" />}
        {h.visual === "pid" && <PidPlot compact />}
        {h.visual === "tests" && <TestDots />}
      </div>
      <div className="hl__body">
        <span className="hl__kind">{h.kind}</span>
        <h3>{h.title}</h3>
        <p>{h.text}</p>
        <span className="hl__go">
          Details <Right />
        </span>
      </div>
    </a>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <section className="block">
        <div className="section-head section-head--row" data-reveal>
          <h2>Selected work</h2>
          <a className="more" href="#/projects/software">
            All projects <Right />
          </a>
        </div>
        <div className="hls">
          {highlights.map((h) => (
            <Highlight key={h.title} h={h} />
          ))}
        </div>
      </section>

      <section className="block">
        <div className="section-head section-head--row" data-reveal>
          <h2>Experience</h2>
          <a className="more" href="#/experience">
            Details <Right />
          </a>
        </div>
        <ul className="roles" data-reveal>
          {experience.map((e) => (
            <li key={e.id} className={e.upcoming ? "is-next" : ""}>
              <a href={`#/experience/${e.id}`}>
                <span className="roles__co">{e.company}</span>
                <span className="roles__role">{e.role}</span>
                <span className="roles__when">{e.period}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Media({ m, name, onOpen }) {
  if (!m) return null;
  if (m.type === "shots")
    return (
      <div className="media media--shots">
        <figure className="shot shot--back">
          <img src={`${BASE}${m.alt}`} alt={`${name} stats page`} loading="lazy" />
        </figure>
        <figure className="shot shot--front">
          <div className="media__bar">
            <i /> <i /> <i />
          </div>
          <img src={`${BASE}${m.main}`} alt={`${name} dashboard`} loading="lazy" />
        </figure>
        <button
          type="button"
          className="shot__play"
          onClick={() => onOpen({ src: m.video, video: true, caption: `${name} — walkthrough demo` })}
        >
          <span>▶</span> Watch the demo
        </button>
      </div>
    );
  if (m.type === "image")
    return (
      <div className="media media--window">
        <figure className="window">
          <div className="media__bar">
            <i /> <i /> <i />
          </div>
          <img src={`${BASE}${m.src}`} alt={m.alt} loading="lazy" />
        </figure>
      </div>
    );
  if (m.type === "pid")
    return (
      <div className="media media--plot">
        <PidPlot />
      </div>
    );
  if (m.type === "vex")
    return (
      <div className="media media--vex">
        <VexSeasons />
      </div>
    );
  if (m.type === "sand")
    return (
      <div className="media media--sand">
        <div className="vex__stage">
          <figure className="vex__shot vex__shot--lead">
            <img src={`${BASE}media/sand-real.jpg`} alt="Finished geometric rosette in the real sand art table" loading="lazy" />
            <figcaption>Real table · G-code rosette</figcaption>
          </figure>
          <div className="vex__side">
            <figure className="vex__shot">
              <img src={`${BASE}media/sand-draw.webp`} alt="Time-lapse of the sand table drawing" loading="lazy" />
              <figcaption>Drawing time-lapse</figcaption>
            </figure>
            <figure className="vex__shot">
              <img src={`${BASE}media/sand-name.jpg`} alt="Continuous-stroke name written in sand" loading="lazy" />
              <figcaption>Continuous-path lettering</figcaption>
            </figure>
          </div>
        </div>
      </div>
    );
  return null;
}

function ProjectCard({ p, tab, onOpen }) {
  const href = `#/projects/${tab}/${p.slug}`;
  return (
    <article className={`card card--${p.size || "std"}`} id={p.slug} data-reveal>
      <a className="card__hit" href={href} aria-label={`${p.name}: read more`} />
      <Media m={p.media} name={p.name} onOpen={onOpen} />
      <div className="card__body">
        <div className="card__meta">
          <span>{p.kind}</span>
          <span>{p.year}</span>
        </div>
        <h3>{p.name}</h3>
        <p className="card__blurb">{p.blurb}</p>
        {p.points && (
          <ul className="card__points">
            {p.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        )}
        <div className="card__foot">
          <ul className="chips">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="card__links">
            {p.links.live && (
              <a href={p.links.live} target="_blank" rel="noreferrer" className="link link--hot">
                Live demo <Arrow />
              </a>
            )}
            {p.links.dorahacks && (
              <a href={p.links.dorahacks} target="_blank" rel="noreferrer" className="link">
                DoraHacks <Arrow />
              </a>
            )}
            {p.links.code && (
              <a href={p.links.code} target="_blank" rel="noreferrer" className="link">
                Source <Arrow />
              </a>
            )}
            <span className="link link--more" aria-hidden="true">
              Read more <Right />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function PageHead({ title, sub, children }) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      {sub && <p className="page-head__sub">{sub}</p>}
      {children}
    </header>
  );
}

const TAB_INFO = {
  software: { label: "Software", sub: "Full-stack apps and computer vision. Team projects are marked." },
  robotics: { label: "Robotics", sub: "Control systems, embedded hardware, and five seasons of competition robots." },
};

function ProjectsPage({ tab }) {
  const other = tab === "software" ? "robotics" : "software";
  const [open, box] = useLightbox();
  return (
    <>
      <PageHead title="Projects" sub={TAB_INFO[tab].sub}>
        <div className="tabs" role="tablist" aria-label="Project area">
          {Object.keys(TABS).map((k) => (
            <a
              key={k}
              role="tab"
              aria-selected={k === tab}
              className={k === tab ? "is-on" : ""}
              href={`#/projects/${k}`}
            >
              {TAB_INFO[k].label}
              <span>{TABS[k].length}</span>
            </a>
          ))}
        </div>
      </PageHead>
      <div className="grid" key={tab} role="tabpanel">
        {TABS[tab].map((p) => (
          <ProjectCard key={p.slug} p={p} tab={tab} onOpen={open} />
        ))}
      </div>
      <a className="next" href={`#/projects/${other}`} data-reveal>
        <span>Also</span>
        <strong>
          {TAB_INFO[other].label} projects <Right />
        </strong>
      </a>
      {box}
    </>
  );
}

function useLightbox() {
  const [shot, setShot] = useState(null);
  useEffect(() => {
    if (!shot) return;
    const on = (e) => e.key === "Escape" && setShot(null);
    document.addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", on);
      document.body.style.overflow = "";
    };
  }, [shot]);
  const box = shot && createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.caption} onClick={() => setShot(null)}>
      <figure onClick={(e) => e.stopPropagation()}>
        {shot.video ? (
          <video src={`${BASE}${shot.fullSrc || shot.src}`} controls autoPlay playsInline />
        ) : (
          <img src={`${BASE}${shot.fullSrc || shot.src}`} alt={shot.caption} />
        )}
        <figcaption>{shot.caption}</figcaption>
      </figure>
      <button className="lightbox__close" onClick={() => setShot(null)} aria-label="Close">
        ✕
      </button>
    </div>,
    document.body
  );
  return [setShot, box];
}

function Shot({ s, onOpen, className = "" }) {
  return (
    <figure className={`shotfig ${className}`}>
      <button className="shotfig__btn" onClick={() => onOpen(s)} aria-label={`Enlarge: ${s.caption}`}>
        <img src={`${BASE}${s.src}`} alt={s.caption} loading="lazy" />
      </button>
      <figcaption>{s.caption}</figcaption>
    </figure>
  );
}

function Gallery({ items, onOpen }) {
  if (!items?.length) return null;
  return (
    <div className={`gallery gallery--${Math.min(items.length, 3)}`} data-reveal>
      {items.map((s, i) => (
        <Shot key={s.src} s={s} onOpen={onOpen} className={i === 0 && items.length > 2 ? "is-lead" : ""} />
      ))}
    </div>
  );
}

function Section({ s, onOpen }) {
  return (
    <section className="dsec" data-reveal>
      <h2>{s.heading}</h2>
      <div className="dsec__body">
        {s.body?.map((para) => (
          <p key={para}>{para}</p>
        ))}
        {s.points && (
          <ul className="dlist">
            {s.points.map((pt) => (
              <li key={pt}>
                <Rich text={pt} />
              </li>
            ))}
          </ul>
        )}
        {s.image && <Shot s={s.image} onOpen={onOpen} className="shotfig--wide" />}
      </div>
    </section>
  );
}

function Seasons({ onOpen }) {
  const [active, setActive] = useState(vexSeasons[vexSeasons.length - 1].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    vexSeasons.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <>
      <div className="awards" data-reveal>
        <h2>Awards</h2>
        <ul>
          {vexAwards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <nav className="seasonbar" aria-label="Seasons">
        {vexSeasons.map((s) => (
          <button key={s.id} className={active === s.id ? "is-on" : ""} onClick={() => jump(s.id)}>
            <span>{s.years}</span>
            {s.game}
          </button>
        ))}
      </nav>
      <ol className="seasons">
        {vexSeasons.map((s, i) => (
          <li className="season" id={s.id} key={s.id} data-reveal>
            <header className="season__head">
              <span className="season__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="season__meta">
                  {s.years} · Team {s.team} · {s.level}
                  {s.highlight && <em>{s.highlight}</em>}
                </p>
                <h2>{s.game}</h2>
                {s.role && <p className="season__role">{s.role}</p>}
              </div>
            </header>
            <p className="season__summary">{s.summary}</p>
            {s.photos && <Gallery items={s.photos} onOpen={onOpen} />}
            <div className={`season__cols${s.robot ? "" : " season__cols--one"}`}>
              {s.robot && (
                <div>
                  <h3>The robot</h3>
                  <ul className="dlist">
                    {s.robot.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {s.challenges && (
                <div>
                  <h3>What went wrong</h3>
                  <ul className="dlist">
                    {s.challenges.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="season__results">
                <h3>Results</h3>
                <ul className="dlist">
                  {s.results.map((r) => (
                    <li key={r}>
                      <Rich text={r} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function ProjectDetail({ tab, slug }) {
  const list = TABS[tab];
  const i = list.findIndex((p) => p.slug === slug);
  const p = list[i];
  const d = p.detail || {};
  const next = list[(i + 1) % list.length];
  const [open, box] = useLightbox();
  const links = [
    p.links.live && { href: p.links.live, label: "Live demo", hot: true },
    p.links.code && { href: p.links.code, label: "Source code" },
    p.links.devpost && { href: p.links.devpost, label: "Devpost" },
    p.links.dorahacks && { href: p.links.dorahacks, label: "DoraHacks" },
    p.links.demo && { href: p.links.demo, label: "Demo video" },
    p.media?.video && {
      onClick: () => open({ src: p.media.video, video: true, caption: `${p.name} — walkthrough demo` }),
      label: "Watch the demo",
    },
  ].filter(Boolean);
  return (
    <article className="detail">
      <a className="back" href={`#/projects/${tab}`}>
        <span aria-hidden="true">←</span> {TAB_INFO[tab].label} projects
      </a>
      <header className="detail__head">
        <p className="detail__meta">
          <span>{p.kind}</span>
          <span>{p.year}</span>
        </p>
        <h1>{p.name}</h1>
        <p className="detail__intro">{d.intro || p.blurb}</p>
        <dl className="detail__facts">
          {d.role && (
            <div>
              <dt>Role</dt>
              <dd>{d.role}</dd>
            </div>
          )}
          <div>
            <dt>Built with</dt>
            <dd>
              <ul className="chips">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        {links.length > 0 && (
          <div className="detail__links">
            {links.map((l) =>
              l.onClick ? (
                <button key={l.label} type="button" onClick={l.onClick} className={`link${l.hot ? " link--hot" : ""}`}>
                  <span>▶</span> {l.label}
                </button>
              ) : (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={`link${l.hot ? " link--hot" : ""}`}>
                  {l.label} <Arrow />
                </a>
              )
            )}
          </div>
        )}
      </header>

      {d.visual === "pid" && (
        <div className="detail__visual" data-reveal>
          <PidPlot />
        </div>
      )}
      {p.slug === "sand-table" && (
        <>
          <div className="detail__pair" data-reveal>
            <Shot s={d.gallery[0]} onOpen={open} />
            <figure className="shotfig">
              <SandTable />
              <figcaption>The simulation on this site</figcaption>
            </figure>
          </div>
          {d.gallery.length > 1 && <Gallery items={d.gallery.slice(1)} onOpen={open} />}
        </>
      )}
      {p.slug !== "sand-table" && <Gallery items={d.gallery} onOpen={open} />}

      {d.sections?.map((s) => (
        <Section key={s.heading} s={s} onOpen={open} />
      ))}
      {d.seasons && <Seasons onOpen={open} />}

      {next && next.slug !== p.slug && (
        <a className="next" href={`#/projects/${tab}/${next.slug}`} data-reveal>
          <span>Next project</span>
          <strong>
            {next.name} <Right />
          </strong>
        </a>
      )}
      {box}
    </article>
  );
}

function Job({ e, open, onToggle }) {
  const hasMore = Boolean(e.points?.length);
  const panel = `job-${e.id}`;
  const head = (
    <>
      <div className="job__side">
        <span className="job__period">{e.period}</span>
        <span className="job__place">{e.place}</span>
      </div>
      <div className="job__head">
        <h3>
          {e.company}
          {e.note && <em>{e.note}</em>}
        </h3>
        <span className="job__role">{e.role}</span>
        <p className="job__summary">{e.summary}</p>
      </div>
    </>
  );
  return (
    <li className={`job${e.upcoming ? " job--next" : ""}${open ? " is-open" : ""}`} id={e.id} data-reveal>
      {hasMore ? (
        <button className="job__toggle" aria-expanded={open} aria-controls={panel} onClick={onToggle}>
          {head}
          <span className="job__chev">
            <Chevron />
          </span>
        </button>
      ) : (
        <div className="job__toggle job__toggle--static">{head}</div>
      )}
      {hasMore && (
        <div className="job__panel" id={panel} role="region" aria-label={`${e.company} details`}>
          <div className="job__inner">
            <ul>
              {e.points.map((pt) => (
                <li key={pt}>
                  <Rich text={pt} />
                </li>
              ))}
            </ul>
            {e.stack && (
              <ul className="chips">
                {e.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function ExperiencePage({ target }) {
  const [open, setOpen] = useState(() => new Set(target ? [target] : []));
  useEffect(() => {
    if (target) setOpen((s) => new Set(s).add(target));
  }, [target]);
  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allOpen = experience.every((e) => !e.points || open.has(e.id));
  return (
    <>
      <PageHead title="Experience" sub="Three co-op terms so far. Click a role for the details.">
        <button
          className="link page-head__toggle"
          onClick={() => setOpen(allOpen ? new Set() : new Set(experience.map((e) => e.id)))}
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </PageHead>
      <ol className="timeline">
        {experience.map((e) => (
          <Job key={e.id} e={e} open={open.has(e.id)} onToggle={() => toggle(e.id)} />
        ))}
      </ol>

      <section className="block">
        <div className="section-head" data-reveal>
          <h2>Tools I use</h2>
        </div>
        <div className="skills" data-reveal>
          {skills.map((s) => (
            <div className="skills__col" key={s.group}>
              <h4>{s.group}</h4>
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Contact() {
  const rows = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, ext: true },
    { label: "GitHub", value: profile.githubHandle, href: profile.github, ext: true },
  ];
  return (
    <footer className="contact" id="contact" data-reveal>
      <p className="contact__lead">
        Get in touch — email is the fastest way to reach me.
      </p>
      <nav className="contact__links" aria-label="Contact">
        {rows.map((r) => (
          <a
            key={r.label}
            href={r.href}
            target={r.ext ? "_blank" : undefined}
            rel={r.ext ? "noreferrer" : undefined}
          >
            {r.value}
            <Arrow />
          </a>
        ))}
      </nav>
      <p className="contact__meta">
        © {new Date().getFullYear()} Aryaen Sharma · Waterloo, ON
      </p>
    </footer>
  );
}

export default function App() {
  const route = useRoute();
  useReveal();
  return (
    <>
      <Nav page={route.page} />
      <main key={route.page + (route.slug || "")} className={`main main--${route.page}${route.slug ? " main--detail" : ""}`}>
        {route.page === "home" && <Home />}
        {route.page === "projects" && !route.slug && <ProjectsPage tab={route.tab} />}
        {route.page === "projects" && route.slug && <ProjectDetail tab={route.tab} slug={route.slug} />}
        {route.page === "experience" && <ExperiencePage target={route.target} />}
        <Contact />
      </main>
    </>
  );
}
