import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  GeoGlyph,
  FormBuilderMock,
  ContextStudioMock,
  AIStudioMock,
  AIPromptMock,
  CanvasEditorMock,
  AnalyticsMock
} from '@/components/landing/AqoraMockups';
import { IntelligentExecutionGraph } from '@/components/landing/IntelligentExecutionGraph';
import { cn } from '@/lib/utils';

const LOGOS = ['MERCOR', 'algolia', 'LINEAR', 'RAMP', 'VERCEL', 'SUPABASE', 'CURSOR', 'NOTION'];

const HorizontalScale = ({className} : {className?: string}) => {
  return (
  <div
      className={cn("h-10 w-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-y border-[var(--pattern))]", className)}
    />
  )
}

const VerticalScale = ({className} : {className?: string}) => {
  return (
  <div
      className={cn("w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-[var(--pattern))]", className)}
    />
  )
}

const Index = () => {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.from('forms').select('*', { count: 'exact', head: true });
        if (error) {
          console.log(error);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="hex-theme hex-paper relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <VerticalScale className="absolute inset-y-0 left-0 mx-auto" />
        <VerticalScale className="absolute inset-y-0 right-0 mx-auto" />
      </div>
      <Navbar />
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: "url('https://ik.imagekit.io/yatharth/ChatGPT%20Image%20Apr%2030,%202026,%2007_52_59%20PM.png')",
            backgroundSize: 'min(420px, 45vw) auto',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 hex-grid pointer-events-none opacity-70" />
        <div className="hex-corner top-6 left-6" style={{ borderRight: 0, borderBottom: 0 }} />
        <div className="hex-corner top-6 right-6" style={{ borderLeft: 0, borderBottom: 0 }} />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-[64px] md:text-[80px] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
                  Forms, <br />
                  <span className="relative">
                    thoughtfully
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span><br />
                  built for teams.
                </h1>
                <div className="mt-10 relative max-w-[540px] group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                  
                  <div className="relative flex flex-col sm:flex-row items-stretch bg-[#fdfcfb] border hex-line-strong rounded-xl p-1.5 shadow-sm focus-within:shadow-md focus-within:border-indigo-400/50 transition-all z-10">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the form you want to build..."
                      className="w-full sm:flex-1 bg-transparent border-none focus:outline-none text-[15px] placeholder:text-muted-foreground/60 px-4 py-3"
                    />
                    <Link to="/auth" className="w-full sm:w-auto bg-foreground text-background px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-foreground/90 transition-all shadow-sm flex items-center justify-center gap-2">
                      Generate
                    </Link>
                  </div>
                  
                  <div className="mt-5 relative z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-2 hex-mono uppercase tracking-[0.1em] text-[10px] font-bold opacity-50">Try:</span>
                      {['Customer feedback', 'Event registration', 'Lead qualification'].map((s) => (
                        <button 
                          key={s}
                          onClick={() => setPrompt(s)}
                          className="text-[12px] font-medium border border-black/5 hover:border-black/10 bg-black/[0.02] hover:bg-black/[0.04] px-3 py-1.5 rounded-full transition-all text-foreground/80 hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative group">
                <div className="absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                <img
                  src="https://ik.imagekit.io/yatharth/image%20(10).png"
                  alt="Aqora Premium Interface"
                  className="relative rounded-2xl w-full h-full transform transition-transform duration-500 select-none pointer-events-none"
                />
              </div>
            </motion.div>
          </div>


          <div className="pt-20 relative">
            <div className="absolute inset-0 hex-grid-fine opacity-40 pointer-events-none -m-8" />
            <div className="relative grid lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-5"><AIPromptMock /></div>
              <div className="lg:col-span-7 lg:-mt-12"><FormBuilderMock /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b hex-line-soft" style={{ borderBottomWidth: 1, borderTopWidth: 1 }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          <div className="p-12 md:p-16 md:border-r hex-line-soft" style={{ borderRightWidth: 1 }}>
            <HorizontalScale className="absolute top-0 left-0 w-full h-10" />
            <div className="text-[15px] font-semibold tracking-wide mb-8">MERCOR</div>
            <p className="text-[22px] leading-[1.4] tracking-[-0.01em]">
              &ldquo;If we didn&rsquo;t have Aqora, <strong>we&rsquo;d still be wiring up Typeform exports to Slack at 2am</strong>, and shipping research half-blind.&rdquo;
            </p>
            <div className="mt-10 text-center">
              <div className="text-[14px] font-medium">Dhaval P.</div>
              <div className="hex-mono text-[11px] mt-1" style={{ color: 'var(--hex-ink-muted)' }}>Account Lead</div>
            </div>
          </div>
          <div className="p-12 md:p-16">
            <div className="text-[15px] font-semibold tracking-wide mb-8">algolia</div>
            <p className="text-[22px] leading-[1.4] tracking-[-0.01em]">
              &ldquo;Aqora is the only form tool we use to ship product surveys. <strong>It makes our research loop 10x faster</strong> and the data is clean by default.&rdquo;
            </p>
            <div className="mt-10 text-center">
              <div className="text-[14px] font-medium">Tom C.</div>
              <div className="hex-mono text-[11px] mt-1" style={{ color: 'var(--hex-ink-muted)' }}>Principal Engineer</div>
            </div>
          </div>
        </div>
      </section>

      <FeatureBlock
        glyph="01"
        chip="AI Orchestration"
        title={<>AI Forge: The engine <br />behind the form.</>}
        body="Describe your research goals in plain English. Aqora handles the logical mapping, prompt chains, and validation steps. You get a production-ready agent workflow in seconds, not weeks."
        cta="Build with AI Forge"
        mock={<AIStudioMock />}
        reverse={false}
        noHover={true}
      />
        
      <section className="border-b hex-line-soft py-32 relative overflow-hidden hex-vignette" style={{ borderBottomWidth: 1, background: 'var(--hex-bg-alt)' }}>
        <HorizontalScale className="absolute top-0 left-0 w-full h-10" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: "url('https://ik.imagekit.io/yatharth/ChatGPT%20Image%20Apr%2030,%202026,%2007_52_59%20PM.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 hex-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-[1fr_2.5fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-3 mb-6">
                <GeoGlyph />
                <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>FIG.02</span>
              </div>
              <h2 className="text-[40px] font-semibold tracking-[-0.035em] leading-[1.05]">
                Beautiful dashboards, <em className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>for when you want to click around.</em>
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>
                Filter by segment, source, or quarter. Hover any line. Compare any question.
                Your responses become a real dashboard the second they land — no exports, no spreadsheets.
              </p>
              <Link to="/learn-more" className="hex-btn-ghost mt-7">Explore analytics →</Link>
            </div>
            <div><AnalyticsMock /></div>
          </div>
        </div>
        <HorizontalScale className="absolute bottom-0 left-0 w-full h-10" />
      </section>

      <FeatureBlock
        glyph="03"
        chip="Visual Editor"
        title={<>A canvas that <br />stays out of the way.</>}
        body="Sane defaults. No fifty-tab settings panels. Drag a block, write a question, pick a theme — your form is already publishable, accessible, and fast on mobile."
        cta="Open the builder"
        mock={<CanvasEditorMock />}
        reverse={true}
        noHover={true}
      />

      <section className="border-b hex-line-soft relative overflow-hidden" style={{ borderBottomWidth: 1 }}>
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-[1.2fr_2fr] gap-0 items-center">
            <div className="z-10 relative pr-12 lg:pl-16">
              <div className="flex items-center gap-3 mb-6">
                 <GeoGlyph />
                 <span className="hex-mono text-[11px] tracking-wider text-slate-500">FIG.04</span>
              </div>
              <h2 className="text-[48px] font-semibold tracking-[-0.035em] leading-[1.05]">
                Intelligent execution
              </h2>
              <p className="mt-6 text-[18px] leading-relaxed max-w-md" style={{ color: 'var(--hex-ink-soft)' }}>
                Hex's graph-based execution model makes projects more reproducible, explainable, and performant than traditional data science notebooks.
              </p>
              <button className="mt-8 hex-btn-ghost text-[14px]">
                Learn more →
              </button>
            </div>
            <div className="relative -mr-32">
               <IntelligentExecutionGraph />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y hex-line-soft py-32 relative overflow-hidden" style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-2xl mb-20">
            <h2 className="text-[48px] font-semibold tracking-[-0.035em] leading-[1.05]">
              Three steps. <em className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>No ceremony.</em>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureStepCard 
              n="01" 
              t="Describe or build" 
              d="Type a prompt or drop blocks on the canvas. You get a working form in under a minute."
              illustration={<BuildIllustration />}
            />
            <FeatureStepCard 
              n="02" 
              t="Share anywhere" 
              d="A clean link, an embed, a QR code — or scope it to a domain or email allowlist."
              illustration={<ShareIllustration />}
            />
            <FeatureStepCard 
              n="03" 
              t="Read the signal" 
              d="Live charts, response stream, and CSV export. Loop back to product the same day."
              illustration={<SignalIllustration />}
            />
          </div>
        </div>
      </section>

      <section className="border-b hex-line-soft py-28 relative hex-vignette" style={{ borderBottomWidth: 1 }}>
        <HorizontalScale className="absolute top-0 left-0 w-full h-10" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[360px_1fr] gap-16">
          <div>
            <h2 className="text-[42px] font-semibold tracking-[-0.035em] leading-[1.05]">
              Questions, <em className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>answered.</em>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>
              The short version of what teams ask us most. Want the long one?
            </p>
            <Link to="/about" className="hex-link mt-5 text-[14px] inline-flex">Talk to the team →</Link>
          </div>
          <div className="border-t hex-line-soft" style={{ borderTopWidth: 1 }}>
            {[
              {
                q: 'How is Aqora different from Typeform or Google Forms?',
                a: 'Aqora is built for product teams, not marketing teams. You get AI-generated forms, a real response stream, live analytics, branching, quiz mode, and domain-locked sharing — without the agency-level pricing or the survey-tool bloat.',
              },
              {
                q: 'Do my respondents need an account?',
                a: 'No. Forms are public by default. You can optionally require email collection, lock to a domain, set a password, or enable one-response-per-email — each is a single toggle.',
              },
              {
                q: 'How does AI Forge actually work?',
                a: 'Describe what you want to learn in plain English. Aqora picks the right blocks, drafts the questions, adds branching where it makes sense, and hands you a working draft you can edit before publishing. You stay in control.',
              },
              {
                q: 'Where is my data stored, and is it secure?',
                a: 'All responses live in an encrypted Postgres database with row-level security. Access is RBAC-controlled, traffic is TLS-only, and we never sell or share your data. SOC 2 ready.',
              },
              {
                q: 'Can I export responses?',
                a: 'Yes — CSV export from any form, plus print-ready response reports. The full API is on the roadmap for teams that want to pipe responses straight into Slack, Notion, or their warehouse.',
              },
              {
                q: 'Is there a free plan?',
                a: 'Yes. Building, sharing, collecting responses, and basic analytics are free. Paid plans unlock higher limits, advanced quiz scoring, team collaboration, and priority support.',
              },
            ].map((f, i) => (
              <details key={i} className="hex-faq-row border-b hex-line-soft px-1" style={{ borderBottomWidth: 1 }}>
                <summary>
                  <span className="flex items-baseline gap-4">
                    <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>0{i + 1}</span>
                    <span className="text-[18px] font-medium leading-snug">{f.q}</span>
                  </span>
                  <span className="hex-faq-icon">+</span>
                </summary>
                <div className="hex-faq-body" style={{ paddingLeft: 'calc(11px + 1rem)' }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureStepCard = ({ n, t, d, illustration }: { n: string; t: string; d: string; illustration: React.ReactNode }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative flex flex-col hex-card overflow-hidden transition-all duration-500 hover:bg-[#eae8e2] hover:shadow-[0_32px_64px_-16px_rgba(26,29,41,0.2)]"
  >
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-500 mix-blend-multiply" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    
    <div className="h-64 flex items-center justify-center bg-[#fdfdfb] border-b hex-line-soft group-hover:bg-transparent transition-colors duration-500 relative">
      <div className="absolute inset-0 opacity-[0.03] hex-grid-fine pointer-events-none" />
      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-700 ease-out">
        {illustration}
      </div>
    </div>

    <div className="p-10 flex-grow flex flex-col relative z-20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-1 rounded-full bg-foreground opacity-20" />
        <div className="hex-mono text-[10px] tracking-[0.25em] opacity-40 uppercase font-bold">Step / {n}</div>
      </div>
      <h3 className="text-[26px] font-semibold mb-4 tracking-tight leading-tight">{t}</h3>
      <p className="text-[16px] leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-500">{d}</p>
      
      <div className="mt-auto pt-10 flex items-center justify-between group-hover:translate-x-1 transition-transform duration-500">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">Learn More</span>
        <div className="w-10 h-10 rounded-full border hex-line-soft flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </motion.div>
);

const BuildIllustration = () => (
  <div className="relative w-56 h-40 flex items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <div className="w-full h-full border hex-line-soft" style={{ background: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
    </div>
    <div className="relative w-44 h-12 border hex-line-strong bg-white rounded shadow-lg p-2 flex items-center gap-2 overflow-hidden">
      <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500" />
      <span className="hex-mono text-[10px] font-bold opacity-30">›</span>
      <div className="flex flex-col gap-1.5 flex-grow">
        <div className="w-28 h-1.5 bg-slate-100 rounded" />
        <div className="w-16 h-1.5 bg-slate-50 rounded" />
      </div>
      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
    <div className="absolute top-6 right-4 w-10 h-10 border border-indigo-100 rounded-lg rotate-12 flex items-center justify-center">
      <div className="w-4 h-4 border border-indigo-200 rounded-sm" />
    </div>
    <div className="absolute bottom-4 left-6 w-8 h-8 border border-amber-100 rounded-full -rotate-12 flex items-center justify-center">
      <div className="w-3 h-3 bg-amber-50 rounded-full" />
    </div>
  </div>
);

const ShareIllustration = () => (
  <div className="relative w-56 h-40 flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 200 150">
      <path d="M0 100 L200 100 M0 120 L200 120 M0 140 L200 140" stroke="currentColor" strokeWidth="1" />
      <path d="M20 150 L80 80 M60 150 L100 80 M100 150 L120 80 M140 150 L140 80 M180 150 L160 80" stroke="currentColor" strokeWidth="1" />
    </svg>
    <div className="relative z-10 w-36 h-24 border hex-line-strong bg-white rounded-lg shadow-xl p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b hex-line-soft pb-2">
        <div className="w-16 h-2 bg-slate-100 rounded" />
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>
      <div className="space-y-2">
        <div className="w-full h-1.5 bg-slate-50 rounded" />
        <div className="w-3/4 h-1.5 bg-slate-50 rounded" />
      </div>
      <div className="mt-auto flex gap-2">
        <div className="px-2 py-1 bg-slate-900 rounded-[4px] text-[8px] text-white font-bold hex-mono">COPY LINK</div>
        <div className="w-8 h-4 bg-slate-100 rounded-[4px]" />
      </div>
    </div>
    <div className="absolute top-8 right-10 w-3 h-3 rounded-full bg-indigo-100 border border-indigo-200" />
    <div className="absolute bottom-10 left-12 w-2 h-2 rounded-full bg-slate-200" />
  </div>
);

const SignalIllustration = () => (
  <div className="relative w-56 h-40 flex items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center opacity-5">
      <div className="w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 20px)' }} />
    </div>
    <div className="relative w-40 h-28 border hex-line-soft bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-inner overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2d5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 45 Q 15 40, 25 30 T 50 25 T 75 15 T 100 5 L 100 60 L 0 60 Z" fill="url(#waveGrad)" />
        <path d="M0 45 Q 15 40, 25 30 T 50 25 T 75 15 T 100 5" fill="none" stroke="#2d5cf6" strokeWidth="2" strokeLinecap="round" className="hex-line-path" />
        <circle cx="20" cy="35" r="1.5" fill="#10b981" />
        <circle cx="45" cy="28" r="1.5" fill="#f59e0b" />
        <circle cx="70" cy="18" r="1.5" fill="#ef4444" />
        <circle cx="90" cy="8" r="1.5" fill="#6366f1" />
      </svg>
    </div>
    <div className="absolute -top-2 right-12 px-1.5 py-0.5 bg-white border hex-line-soft rounded text-[8px] hex-mono font-bold shadow-sm">REALTIME</div>
    <div className="absolute bottom-6 left-8 px-1.5 py-0.5 bg-white border hex-line-soft rounded text-[8px] hex-mono font-bold shadow-sm">98.2%</div>
  </div>
);

const FeatureBlock = ({ glyph, title, body, cta, mock, reverse, noHover }: {
  glyph: string; chip: string; title: React.ReactNode; body: string; cta: string; mock: React.ReactNode; reverse?: boolean; noHover?: boolean;
}) => (
  <section className="border-b hex-line-soft py-20 relative overflow-hidden" style={{ borderBottomWidth: 1 }}>
    {reverse && <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />}
    {!reverse && <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />}
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div
        className={cn(
          'grid gap-20 items-center lg:items-start',
          reverse
            ? 'lg:grid-cols-[1.8fr_1fr] lg:[&>*:first-child]:order-2'
            : 'lg:grid-cols-[1fr_1.8fr]',
        )}
      >
        <div className="max-w-lg lg:pt-4">
          <div className="flex items-center gap-3 mb-6">
            <GeoGlyph />
            <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>FIG.{glyph}</span>
          </div>
          <h2 className="text-[48px] font-semibold tracking-[-0.035em] leading-[1.02]">{title}</h2>
          <p className="mt-8 text-[18px] leading-relaxed opacity-70" style={{ color: 'var(--hex-ink-soft)' }}>{body}</p>
          <div className="mt-12 flex items-center gap-6">
            <Link to="/auth" className="hex-btn-primary text-[14px] px-8 py-3">{cta} →</Link>
          </div>
        </div>
        <div className="flex justify-center relative group min-w-0 w-full">
          {!noHover && <div className="absolute -inset-10 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />}
          <div
            className={cn(
              'relative transition-all duration-700 ease-out w-full max-w-full min-w-0',
              !noHover && 'transform group-hover:scale-[1.03] group-hover:-rotate-1',
            )}
          >
            {mock}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Index;