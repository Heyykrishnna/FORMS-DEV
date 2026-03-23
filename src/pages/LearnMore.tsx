import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

/* ─── SVG icon atoms (no Lucide) ─────────────────────────────────────── */
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M13 2L4.09 12.97H11L10 22l8.91-10.97H13L13 2z" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
  </svg>
);
const IconPalette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
    <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
  </svg>
);
const IconBranch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <circle cx="6" cy="18" r="2" /><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" />
    <path d="M6 8v8M6 8c4 0 6 2 6 4s2 4 6 4" />
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <rect x="3" y="12" width="4" height="9" /><rect x="10" y="7" width="4" height="14" /><rect x="17" y="3" width="4" height="18" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10">
    <rect x="3" y="11" width="18" height="11" rx="0" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

/* ─── Data ────────────────────────────────────────────────────────────── */
const features = [
  { icon: IconBolt,    title: 'RADICAL SPEED',      desc: 'Build a complete form in under 60 seconds. No bloat. No setup. Just raw creation velocity.' },
  { icon: IconShield,  title: 'TOTAL PRIVACY',       desc: 'AES-256 encryption, zero-knowledge architecture. Your data is yours — we never touch it.' },
  { icon: IconPalette, title: 'BRUTAL THEMES',       desc: '20+ hand-crafted Neo-Brutalist color systems. Each one designed to shock, awe, and convert.' },
  { icon: IconBranch,  title: 'LOGIC BRANCHING',     desc: 'Notebook-style conditional paths. Route respondents based on their answers in real time.' },
  { icon: IconChart,   title: 'QUIZ INTELLIGENCE',   desc: 'Automated scoring, per-question points, live leaderboards, and result visualization.' },
  { icon: IconGlobe,   title: 'SEO PROTOCOL',        desc: 'Real-time Google & social previews with bot-optimized metadata baked in automatically.' },
  { icon: IconCode,    title: 'DEV FRIENDLY',        desc: 'Zero config. Zero friction. REST API + webhooks so your stack stays in control.' },
  { icon: IconLock,    title: 'DOMAIN GUARD',        desc: 'Lock submissions to specific email domains. No rogue responses. Total access control.' },
];

const steps = [
  { num: '01', title: 'BUILD IT',   desc: 'Drag, drop, type. Add questions, sections, and conditional logic in seconds. No menus to memorize.' },
  { num: '02', title: 'BOLD IT',    desc: 'Pick a brutal theme or override every pixel. Typography, borders, colors — all yours to command.' },
  { num: '03', title: 'BLAST IT',   desc: 'One-click share link. Embed anywhere. Watch live responses roll in on your dashboard.' },
  { num: '04', title: 'ANALYZE IT', desc: 'Charts, exports, quiz scores, and raw data — all in one place. No third-party analytics needed.' },
];

const manifesto = [
  'BORDERS ARE NOT A WEAKNESS — THEY ARE STRUCTURE.',
  'MONOSPACE IS NOT RETRO — IT IS HONEST.',
  'HIGH CONTRAST IS NOT AGGRESSIVE — IT IS ACCESSIBLE.',
  'BOLD IS NOT LOUD — IT IS CONFIDENT.',
  'FORMS ARE NOT BORING — YOU JUST HAVEN\'T USED REVOX.',
];

const useCases = [
  { tag: 'RESEARCH',   title: 'ACADEMIC SURVEYS',      desc: 'Multi-section surveys with branching logic, anonymous submissions, and CSV export for analysis.' },
  { tag: 'BUSINESS',   title: 'LEAD CAPTURE FORMS',    desc: 'High-converting landing page forms with domain locking and instant webhook delivery to your CRM.' },
  { tag: 'EDUCATION',  title: 'GRADED QUIZZES',        desc: 'Auto-scored assessments with per-question points, time limits, and instant result pages.' },
  { tag: 'EVENTS',     title: 'RSVP & REGISTRATION',   desc: 'Event sign-ups with conditional fields, capacity limits, and confirmation emails.' },
  { tag: 'PRODUCT',    title: 'USER FEEDBACK',         desc: 'NPS surveys, feature request forms, and bug reports — all feeding into one unified dashboard.' },
  { tag: 'HR',         title: 'JOB APPLICATIONS',      desc: 'Multi-step application forms with file uploads, scoring rubrics, and team review workflows.' },
];

/* ─── Component ───────────────────────────────────────────────────────── */
const LearnMore = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-accent selection:text-accent-foreground">

      {/* ── NAV ── */}
      <nav className="border-b-4 border-foreground sticky top-0 bg-background z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-xl font-black tracking-widest uppercase hover:text-accent transition-colors group">
            <span className="border-2 border-foreground group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all p-1">
              <IconArrowLeft />
            </span>
            BACK
          </Link>
          <div className="text-xl font-black tracking-widest uppercase">
            LEARN MORE<span className="text-accent">.</span>
          </div>
          <Link
            to="/dashboard"
            className="hidden md:block border-2 border-foreground bg-accent text-accent-foreground px-6 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            START FREE →
          </Link>
        </div>
      </nav>

      <main>

        {/* ── HERO ── */}
        <section className="border-b-4 border-foreground py-28 bg-foreground text-background overflow-hidden relative">
          {/* decorative grid */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up">
              <p className="text-xs font-black tracking-[0.5em] text-accent mb-6 uppercase">// MANIFESTO</p>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase mb-10">
                FORMS THAT<br />
                <span className="bg-accent text-accent-foreground px-4 inline-block mt-2">DEMAND</span><br />
                ATTENTION<span className="text-accent">.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={200}>
              <p className="text-xl md:text-2xl font-bold text-background/70 max-w-3xl leading-tight border-l-8 border-accent pl-6 py-2 uppercase">
                REVOX is the antidote to soft, forgettable web forms. Built for creators who refuse to blend in. Powered by Neo-Brutalism. Engineered for results.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── MANIFESTO STRIP ── */}
        <section className="border-b-4 border-foreground py-16 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <p className="text-xs font-black tracking-[0.5em] text-accent mb-10 uppercase">// THE RULES WE LIVE BY</p>
            </ScrollReveal>
            <div className="space-y-0 border-2 border-foreground">
              {manifesto.map((line, i) => (
                <ScrollReveal key={i} direction="left" delay={i * 60}>
                  <div className="flex items-center gap-6 px-8 py-6 border-b-2 border-foreground last:border-b-0 group hover:bg-foreground hover:text-background transition-all">
                    <span className="text-accent text-2xl font-black group-hover:text-background transition-colors select-none">0{i + 1}</span>
                    <p className="text-lg md:text-2xl font-black uppercase tracking-tight">{line}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISION + PHILOSOPHY ── */}
        <section className="border-b-4 border-foreground py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-foreground">
              <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-foreground bg-accent text-accent-foreground">
                <ScrollReveal direction="up">
                  <p className="text-xs font-black tracking-[0.4em] mb-6 opacity-60 uppercase">// VISION</p>
                  <h2 className="text-4xl font-black mb-6 uppercase italic leading-tight">WHY WE BUILT THIS.</h2>
                  <p className="text-lg leading-relaxed font-bold">
                    Most form builders try to disappear into the background. We built REVOX to do the opposite.
                    Every pixel is intentional. Every border is a statement. We believe the tools you use
                    should reflect the ambition of what you're building.
                  </p>
                </ScrollReveal>
              </div>
              <div className="p-12 bg-background">
                <ScrollReveal direction="up" delay={100}>
                  <p className="text-xs font-black tracking-[0.4em] mb-6 text-accent uppercase">// PHILOSOPHY</p>
                  <h2 className="text-4xl font-black mb-6 uppercase italic leading-tight">NEO-BRUTALISM.</h2>
                  <p className="text-lg leading-relaxed font-bold text-foreground/70 mb-6">
                    Neo-Brutalism is not a trend — it's a commitment to honesty in design. Raw structure.
                    High contrast. No decorative lies. Just function, made beautiful through boldness.
                  </p>
                  <ul className="space-y-3">
                    {['ALWAYS 2PX+ BORDERS', 'ZERO BORDER RADIUS', 'HIGH CONTRAST PALETTES', 'MONOSPACED TYPOGRAPHY', 'SHADOW OFFSETS OVER BLUR'].map((rule, i) => (
                      <li key={i} className="flex items-center gap-4 font-black text-sm uppercase">
                        <div className="h-3 w-3 bg-accent flex-shrink-0 rotate-45" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="border-b-4 border-foreground py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                <div>
                  <p className="text-xs font-black tracking-[0.4em] text-accent mb-4 uppercase">// CAPABILITIES</p>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    EVERYTHING<br />YOU NEED<span className="text-accent">.</span>
                  </h2>
                </div>
                <p className="text-xs font-black uppercase text-foreground/50 tracking-widest max-w-xs md:text-right">
                  EIGHT CORE SYSTEMS. ZERO COMPROMISES. BUILT FOR THOSE WHO DEMAND MORE.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-foreground">
              {features.map((f, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 60}>
                  <div className="p-8 border-r-2 border-b-2 border-foreground hover:bg-accent hover:text-accent-foreground transition-all group h-full">
                    <div className="mb-5 text-accent group-hover:text-accent-foreground transition-colors">
                      <f.icon />
                    </div>
                    <h3 className="text-lg font-black uppercase mb-3 tracking-tight">{f.title}</h3>
                    <p className="text-sm font-bold opacity-70 group-hover:opacity-100 leading-relaxed uppercase italic">{f.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="border-b-4 border-foreground py-24 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <p className="text-xs font-black tracking-[0.4em] text-accent mb-4 uppercase">// PROCESS</p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 leading-none">
                HOW IT<br />WORKS<span className="text-accent">.</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-background/20">
              {steps.map((s, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 100}>
                  <div className="p-10 border-r-2 border-b-2 border-background/20 last:border-r-0 group hover:bg-accent hover:text-accent-foreground transition-all h-full">
                    <span className="text-7xl font-black opacity-10 group-hover:opacity-100 transition-opacity block mb-6 leading-none">{s.num}</span>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{s.title}</h3>
                    <p className="font-bold text-background/60 group-hover:text-accent-foreground/80 leading-relaxed uppercase italic text-sm">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="border-b-4 border-foreground py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <p className="text-xs font-black tracking-[0.4em] text-accent mb-4 uppercase">// USE CASES</p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 leading-none">
                BUILT FOR<br />EVERY NEED<span className="text-accent">.</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
              {useCases.map((u, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 80}>
                  <div className="p-10 border-r-2 border-b-2 border-foreground group hover:bg-foreground hover:text-background transition-all h-full">
                    <span className="inline-block border-2 border-accent text-accent group-hover:border-background group-hover:text-background text-[10px] font-black tracking-widest uppercase px-3 py-1 mb-6 transition-colors">
                      {u.tag}
                    </span>
                    <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{u.title}</h3>
                    <p className="font-bold text-foreground/60 group-hover:text-background/60 leading-relaxed uppercase italic text-sm">{u.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-32 bg-foreground text-background border-b-4 border-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up">
              <p className="text-xs font-black tracking-[0.5em] text-accent mb-6 uppercase">// READY?</p>
              <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] mb-10">
                STOP<br />
                <span className="text-accent px-4">BLENDING IN </span><span className="text-accent-foreground">.</span>
              </h2>
              <p className="text-xl font-bold text-background/60 uppercase max-w-xl mx-auto mb-12">
                JOIN THOUSANDS OF BUILDERS WHO CHOSE BOLD OVER BORING. YOUR FIRST FORM IS FREE. FOREVER.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/dashboard"
                  className="border-4 border-accent bg-accent text-accent-foreground px-14 py-6 text-xl font-black uppercase shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                >
                  BUILD FOR FREE →
                </Link>
                <Link
                  to="/"
                  className="border-4 border-background/30 bg-transparent text-background px-14 py-6 text-xl font-black uppercase hover:border-accent hover:text-accent transition-all"
                >
                  ← BACK HOME
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LearnMore;
