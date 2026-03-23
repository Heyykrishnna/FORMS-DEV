import { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { FileText, Share2, BarChart3, Shield, Zap, Palette, Plus, Search, Terminal, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SterlingGateKineticNavigation } from '@/components/ui/sterling-gate-kinetic-navigation';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';
import BrutalAccordion from '@/components/ui/BrutalAccordion';
import { Marquee } from '@/components/ui/marquee';
import { CheckCheckIcon } from '@/components/CheckCheckIcon';
import { BlendIcon } from '@/components/BlendIcon';
import { CopyIcon } from '@/components/CopyIcon';
import { ShieldUserIcon } from '@/components/ShieldUserIcon';
import { ShareIcon } from '@/components/ShareIcon';
import { ChartBarIcon } from '@/components/ChartBarIcon';
import { ZapIcon } from '@/components/ZapIcon';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import Footer from '@/components/Footer';

const Dithering = lazy(() => 
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

const features = [
  { id: 'ai-forge', title: 'AI FORGE', desc: 'DEPLOY INTELLIGENT FORMS BY SIMPLY DESCRIBING YOUR OBJECTIVE. OUR LLM NEURAL ENGINE GENERATES COMPLETE PROTOCOLS IN SECONDS.', tag: 'AI POWERED', color: '#FF4D00' },
  { id: 'response-themes', title: 'RESPONSE THEMES', desc: 'Specialized Survey, Research, and Data Work modes for deep intelligence.', tag: 'VISUAL', color: '#3ECF8E' },
  { id: 'seo-protocol', title: 'SEO PROTOCOL', desc: 'Real-time Google & Social previews with automated bot-optimized metadata.', tag: 'MARKETING', color: '#0070F3' },
  { id: 'domain-guard', title: 'DOMAIN GUARD', desc: 'Lock submissions to specific domains with secure protocol enforcement.', tag: 'SECURITY', color: '#FF0080' },
  { id: 'smart-sharing', title: 'SMART SHARING', desc: 'One-click protocol links for high-performance social distribution.', tag: 'DISTRIBUTION', color: '#7928CA' },
  { id: 'quiz-intelligence', title: 'QUIZ INTELLIGENCE', desc: 'Automated scoring, per-question points, and live result visualization.', tag: 'ANALYSIS', color: '#F5A623' },
  { id: 'logic-branching', title: 'LOGIC BRANCHING', desc: 'Advanced notebook-style conditional navigation for nonlinear paths.', tag: 'LOGIC', color: '#00DFD8' },
  { id: 'data-aggression', title: 'DATA AGGRESSION', desc: 'REAL-TIME ANALYTICS WITH NO LATENCY. MONITOR RESPONSES AS THEY SLAM INTO OUR SECURE DATABASE.', tag: 'PERFORMANCE', color: '#FF4D00' },
  { id: 'krypton-security', title: 'KRYPTON SECURITY', desc: "END-TO-END ENCRYPTION ISN'T AN OPTION, IT'S THE DEFAULT. YOUR DATA IS SEALED BEHIND OUR NEURAL FIREWALLS.", tag: 'ENCRYPTED', color: '#3ECF8E' },
  { id: 'ultra-logic', title: 'ULTRA LOGIC', desc: 'BUILD COMPLEX BRANCHING PATHS WITH ZERO CODE. OUR VISUAL LOGIC ENGINE HANDLES THE CHAOS.', tag: 'NON-LINEAR', color: '#7928CA' },
];

const faq = [
  { q: "CAN THE NSA READ MY FORMS?", a: "PROBABLY. BUT JOKES ON THEM—WE USE END-TO-END ENCRYPTION SO POWERFUL, EVEN WE CAN'T READ YOUR DATA. WE'RE BASICALLY THE FORT KNOX OF FORMS, EXCEPT COOLER AND WITH MORE NEON." },
  { q: "IS MY DATA ENCRYPTED OR JUST SCRAMBLED LIKE MY BRAIN?", a: "YOUR DATA GETS AES-256 ENCRYPTION, WHICH IS MILITARY-GRADE. YOUR BRAIN? THAT'S ON YOU. WE HASH, SALT, AND LOCK EVERYTHING TIGHTER THAN YOUR GRANDMA'S SECRET COOKIE RECIPE." },
  { q: "WHAT IF HACKERS TRY TO STEAL MY SURVEY ANSWERS?", a: "GOOD LUCK TO THEM. WE'VE GOT MORE LAYERS OF SECURITY THAN AN ONION WRAPPED IN TINFOIL WEARING A HAZMAT SUIT. PLUS, OUR SERVERS RUN ON PURE PARANOIA AND CAFFEINE." },
  { q: "DO YOU SELL MY DATA TO EVIL CORPORATIONS?", a: "NO. WE'RE NOT EVIL—WE'RE CHAOTIC NEUTRAL. YOUR DATA STAYS ENCRYPTED AND PRIVATE. WE DON'T EVEN WANT IT. WE'RE TOO BUSY MAKING FAT BORDERS." },
  { q: "WHAT HAPPENS IF I ACCIDENTALLY DELETE EVERYTHING?", a: "PANIC FIRST, THEN CHECK YOUR BACKUPS. WE AUTO-SAVE LIKE IT'S 3026. ENCRYPTED BACKUPS IN MULTIPLE LOCATIONS. YOUR DATA HAS MORE HOMES THAN A DIGITAL NOMAD." },
  { q: "IS THIS MORE SECURE THAN MY BANK?", a: "YOUR BANK STILL USES SECURITY QUESTIONS LIKE 'MOTHER'S MAIDEN NAME.' WE USE ZERO-KNOWLEDGE ARCHITECTURE, ENCRYPTED TUNNELS, AND BLOCKCHAIN VERIFICATION. YOU DO THE MATH." },
];

const steps = [
  { number: '01', title: 'BUILD IT', desc: 'Add questions, sections, and logic in seconds. No complex menus.' },
  { number: '02', title: 'BOLD IT', desc: 'Choose a theme or override every single detail. Make it yours.' },
  { number: '03', title: 'BLAST IT', desc: 'One click to share. Collect responses and watch the data roll in.' },
];

const FeatureCard = ({ title, desc, index }: { title: string, desc: string, index: number }) => {
  const iconRef = useRef<any>(null);
  
  return (
    <ScrollReveal direction="up" delay={index * 100}>
      <div
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
        className="p-10 hover:bg-accent hover:text-accent-foreground transition-all group border-r-2 border-b-2 border-foreground h-full"
      >
        <h3 className="text-xl font-black uppercase mb-3">{title}</h3>
        <p className="text-sm font-bold opacity-70 group-hover:opacity-100 uppercase italic">
          {desc}
        </p>
      </div>
    </ScrollReveal>
  );
};

const Index = () => {
  const [statsData, setStatsData] = useState({ forms: 12000, responses: 1400000 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // FEATURE TRACKING FOR STICKY SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveFeature(index);
          }
        });
      },
      { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
    );

    document.querySelectorAll('.feature-trigger').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [forms, responses] = await Promise.all([
          supabase.from('forms').select('*', { count: 'exact', head: true }),
          supabase.from('responses').select('*', { count: 'exact', head: true }),
        ]);
        setStatsData({
          forms: forms.count || 12000,
          responses: responses.count || 1400000,
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();

    const channel = supabase
      .channel('homepage-stats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forms' }, () => fetchStats())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses' }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-accent selection:text-accent-foreground">
        <SterlingGateKineticNavigation />

        <section 
          className="pt-32 pb-32 border-b-2 border-foreground relative overflow-hidden bg-black"
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen">
              <Dithering
                colorBack="#00000000" 
                colorFront="#FF4500" 
                shape="warp"
                type="4x4"
                speed={isHeroHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>
          <div className="container mx-auto px-4 relative" style={{ zIndex: 2 }}>
            <div className="max-w-5xl">
              <ScrollReveal direction="up">
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-white text-white leading-[0.85] tracking-tighter uppercase mb-8">
                  BUILD BOLD<span className="text-accent italic">.</span><br />
                  DATA AGGRESSION<span className="text-accent italic">!</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={200}>
                <p className="text-xl md:text-2xl text-orange-200 font-bold max-w-2xl leading-tight mb-10 border-l-4 border-accent pl-6 uppercase">
                  REVOX is for those tired of pristine, boring interfaces. Build forms that demand attention.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={400}>
                <div className="flex flex-wrap gap-6">
                  <Link
                    to="/dashboard"
                    className="group relative border-brutal-4 bg-accent px-10 py-5 text-sm md:text-xl font-black uppercase text-accent-foreground shadow-brutal-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                  >
                    START BUILDING THE FUTURE →
                  </Link>
                  <Link
                    to="/learn-more"
                    className="border-brutal-4 bg-secondary px-10 py-5 text-sm md:text-xl font-black uppercase text-foreground shadow-brutal-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                  >
                    LEARN MORE
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        <div className="border-b-2 border-foreground bg-foreground py-6 overflow-hidden select-none relative">
          <div className="flex animate-marquee whitespace-nowrap w-max">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {['ZERO GUESSWORK', 'BOLD INSIGHTS', 'RAW TRUTH', 'BRUTAL CLARITY', 'FAST BUILDS', 'SMART QUESTIONS', 'REAL RESPONSES', 'NO FLUFF', 'PURE DATA', 'SHARP DECISIONS', 'FORM. DONE RIGHT.', 'BUILT TO THINK', 'DESIGNED TO DOMINATE', 'CLICKS WITH PURPOSE', 'INSIGHT OVER NOISE', 'DATA WITH ATTITUDE', 'MINUTES TO CREATE', 'RESULTS THAT MATTER', 'NO CHAOS. JUST CLARITY.', 'REVOX. REDEFINED.'].map((text, index) => (
                  <div key={index} className="flex items-center mx-10">
                    <span className="text-2xl font-black uppercase text-background tracking-tight italic">
                      {text}
                    </span>
                    <div className="ml-10 h-3 w-3 bg-accent rotate-45" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="border-b-2 border-foreground py-24 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="left">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 tracking-tighter">
                HOW IT WORKS<span className="text-accent text-[2rem]">.</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-foreground">
              {steps.map((s, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 150}>
                  <div className="group p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground last:border-r-0 hover:bg-foreground hover:text-background transition-all h-full">
                    <span className="text-6xl font-black opacity-10 group-hover:opacity-100 transition-opacity block mb-6">{s.number}</span>
                    <h3 className="text-2xl font-black uppercase mb-4">{s.title}</h3>
                    <p className="font-bold text-foreground/60 group-hover:text-background/60 leading-relaxed uppercase italic">
                      {s.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        <section className="relative bg-[#0a0a0a] text-white min-h-screen border-y-4 border-white/10 font-mono overflow-clip">
          {/* Deep scanline overlay */}
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
          {/* Circuit grid */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF4D00_1px,transparent_1px),linear-gradient(to_bottom,#FF4D00_1px,transparent_1px)] [background-size:80px_80px]" />
          </div>
          {/* Ambient glow blobs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] bg-accent/10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] bg-purple-600/10 translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 pt-32 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 border-b border-white/10 pb-4 relative">
              <div className="relative">
                <h2 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none text-white relative z-10">
                  CORE<span className="text-accent italic" style={{ textShadow: '0 0 40px rgba(255,77,0,0.6), 0 0 80px rgba(255,77,0,0.3)' }}>SYS</span>
                </h2>
                {/* Ghost glitch layer */}
                <h2 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none absolute top-0 left-0 text-accent/20 select-none pointer-events-none" style={{ clipPath: 'inset(40% 0 50% 0)', transform: 'translate(-3px, 0)' }} aria-hidden="true">
                  CORE<span className="italic">SYS</span>
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs font-black tracking-[0.5em] text-white/30 uppercase">[ PROTOCOL_UPGRADE_10X ]</div>
                <div className="text-[9px] font-black tracking-[0.3em] text-accent/50 uppercase animate-pulse">► NEURAL_ENGINE_ACTIVE</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-20">
              {/* STICKY PREVIEW PANEL */}
              <div className="hidden lg:block lg:w-1/2 sticky top-32 h-fit pb-32">
                {/* Glow halo behind panel */}
                <div
                  className="absolute -inset-4 rounded-none blur-3xl opacity-20 transition-all duration-1000 pointer-events-none"
                  style={{ backgroundColor: features[activeFeature].color }}
                />
                <div
                  className="relative overflow-hidden aspect-[4/3] border border-white/20 bg-black group"
                  style={{ boxShadow: `0 0 60px ${features[activeFeature].color}33, inset 0 0 30px rgba(0,0,0,0.8)` }}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 z-20" style={{ borderColor: features[activeFeature].color }} />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 z-20" style={{ borderColor: features[activeFeature].color }} />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 z-20" style={{ borderColor: features[activeFeature].color }} />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 z-20" style={{ borderColor: features[activeFeature].color }} />

                  {/* Scanline on card */}
                  <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_3px]" />
                  {/* Scan sweep line */}
                  <div className="absolute left-0 right-0 h-[2px] z-10 animate-scan-sweep pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${features[activeFeature].color}80, transparent)` }}
                  />

                  {/* Color tint bg */}
                  <div
                    className="absolute inset-0 transition-all duration-1000 opacity-10"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${features[activeFeature].color}, transparent 70%)` }}
                  />

                  {/* Background gigantic text watermark */}
                  <span className="text-[8rem] md:text-[12rem] font-black opacity-[0.04] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none tracking-tighter whitespace-nowrap transition-all duration-1000 uppercase">
                    {features[activeFeature].id}
                  </span>

                  {/* Main content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 text-center">
                    <div key={activeFeature} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                      {/* Feature title with glow */}
                      <div
                        className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none glitch-text"
                        style={{ color: features[activeFeature].color, textShadow: `0 0 30px ${features[activeFeature].color}80` }}
                      >
                        {features[activeFeature].title}
                      </div>
                      {/* Tag pill */}
                      <div
                        className="inline-block text-[9px] font-black tracking-[0.4em] uppercase px-3 py-1 text-black"
                        style={{ backgroundColor: features[activeFeature].color }}
                      >
                        {features[activeFeature].tag} / MODULE v2.0
                      </div>
                    </div>
                  </div>

                  {/* Status bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 border-t z-20" style={{ borderColor: features[activeFeature].color + '40', background: 'rgba(0,0,0,0.8)' }}>
                    <span className="text-[8px] font-black tracking-widest" style={{ color: features[activeFeature].color }}>● LIVE</span>
                    <span className="text-[8px] font-black text-white/40 tracking-widest">NODE_{String(activeFeature + 1).padStart(2, '0')}_ONLINE</span>
                  </div>
                </div>

                {/* Node indicators */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1.5">
                      {features.map((feat, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-2 transition-all duration-500",
                            activeFeature === i ? "w-8" : "w-2 opacity-30"
                          )}
                          style={{ backgroundColor: activeFeature === i ? feat.color : 'white' }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-white/40 tracking-widest">ACTIVE_NODE: 0x{String(activeFeature + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[9px] font-black text-white/20 tracking-widest text-right">
                    <div>SYS.LOAD: 100%</div>
                    <div style={{ color: features[activeFeature].color + 'aa' }}>FREQ: {(activeFeature * 137 + 440).toString(16).toUpperCase()}Hz</div>
                  </div>
                </div>

                {/* Data stream decoration */}
                <div className="mt-6 border border-white/10 p-3 bg-black/60 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: features[activeFeature].color }} />
                  <div className="pl-3">
                    <div className="text-[8px] text-white/30 font-black tracking-widest mb-1">// SYSTEM MANIFEST</div>
                    {['ENCRYPTION: AES-256', 'LATENCY: <2ms', 'UPTIME: 99.99%', `PROTOCOL: ${features[activeFeature].tag}`].map((line, li) => (
                      <div key={li} className="text-[8px] font-black tracking-wider" style={{ color: li === 3 ? features[activeFeature].color : 'rgba(255,255,255,0.5)' }}>
                        {`> ${line}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SCROLLABLE FEATURES */}
              <div className="lg:w-1/2 space-y-32 lg:space-y-64 py-12 lg:py-32">
                {features.map((f, i) => (
                  <div
                    key={f.id}
                    data-index={i}
                    className="feature-trigger relative group pl-8 md:pl-14 py-8 md:py-12 transition-all duration-700"
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 w-[3px] h-full transition-all duration-700"
                      style={{ backgroundColor: activeFeature === i ? f.color : 'rgba(255,255,255,0.08)' }}
                    />
                    {/* Animated live accent bar overlay */}
                    <div
                      className="absolute left-0 top-0 w-[3px] h-0 group-hover:h-full transition-all duration-700"
                      style={{ backgroundColor: f.color, opacity: activeFeature === i ? 0 : 0.4 }}
                    />
                    {/* Ambient side glow only on active */}
                    {activeFeature === i && (
                      <div
                        className="absolute -left-2 top-0 w-[20px] h-full blur-lg opacity-30 pointer-events-none transition-all duration-700"
                        style={{ backgroundColor: f.color }}
                      />
                    )}

                    {/* Mobile preview card */}
                    <div className="lg:hidden mb-12 aspect-[16/9] border border-white/20 bg-black/80 flex items-center justify-center relative overflow-hidden transition-all duration-700">
                      <span className="text-8xl font-black opacity-[0.04] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none tracking-tighter uppercase">{f.id}</span>
                      <div className="relative z-10 text-center px-6">
                        <div className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none" style={{ color: f.color }}>{f.title}</div>
                        <div className="text-[8px] font-black tracking-widest uppercase px-2 py-1 inline-block text-black" style={{ backgroundColor: f.color }}>{f.tag}</div>
                      </div>
                    </div>

                    {/* Tag + index */}
                    <div className="flex items-center gap-4 mb-5 md:mb-7">
                      <span
                        className="text-[9px] font-black px-3 py-1 uppercase tracking-widest transition-all duration-500"
                        style={{ backgroundColor: activeFeature === i ? f.color : 'rgba(255,255,255,0.08)', color: activeFeature === i ? 'black' : 'rgba(255,255,255,0.4)' }}
                      >
                        {f.tag}
                      </span>
                      <span className="text-[9px] font-black opacity-20 tracking-[0.4em]">[ 0x{String(i + 1).padStart(2, '0')} ]</span>
                    </div>

                    {/* Feature title */}
                    <h3
                      className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-none transition-all duration-500 relative"
                      style={{
                        color: activeFeature === i ? f.color : 'rgba(255,255,255,0.85)',
                        textShadow: activeFeature === i ? `0 0 40px ${f.color}50` : 'none'
                      }}
                    >
                      {f.title}
                      {activeFeature === i && (
                        <span
                          className="absolute top-0 left-0 select-none pointer-events-none"
                          style={{ color: f.color, opacity: 0.15, clipPath: 'inset(45% 0 50% 0)', transform: 'translate(-2px)', filter: 'blur(1px)' }}
                          aria-hidden="true"
                        >
                          {f.title}
                        </span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-base md:text-xl font-bold uppercase leading-relaxed italic text-white/40 group-hover:text-white/80 transition-all duration-500 max-w-lg">
                      {f.desc}
                    </p>

                    {/* Footer sync line */}
                    <div className="mt-8 md:mt-14 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${f.color}60, transparent)` }} />
                      <div className="text-[9px] font-black tracking-[0.4em] text-white/30">SYSTEM_MODULE_SYNCED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scan-sweep {
              0%   { top: -4px; opacity: 0; }
              10%  { opacity: 1; }
              90%  { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
            .animate-scan-sweep { animation: scan-sweep 3s linear infinite; position: absolute; }

            .glitch-text {
              position: relative;
            }
            .glitch-text:hover {
              animation: glitch-shake 0.4s cubic-bezier(.25,.46,.45,.94) both infinite;
            }
            @keyframes glitch-shake {
              0%   { transform: translate(0); }
              20%  { transform: translate(-2px, 1px); filter: hue-rotate(10deg); }
              40%  { transform: translate(-1px, -1px); }
              60%  { transform: translate(2px, 1px); filter: hue-rotate(-10deg); }
              80%  { transform: translate(1px, -1px); }
              100% { transform: translate(0); filter: none; }
            }
          `}} />
        </section>

        <ComparisonSection />

        <section className="border-y-2 border-foreground bg-background py-24 overflow-hidden relative group selection:bg-accent selection:text-accent-foreground">
          <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.08)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:60px_60px]" />
          
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#3ECF8E]/10 rounded-full blur-[150px] -ml-64 -mt-64 animate-slow-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -mr-64 -mb-64 animate-slow-pulse delay-700" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-16 pb-6 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-[#3ECF8E] animate-pulse" />
                <span className="text-[9px] font-mono text-foreground/40 font-black uppercase tracking-[0.5em]">SYSTEM_ALLIANCE_PROTOCOL</span>
              </div>
              <span className="text-[8px] font-mono text-accent/60">0xCAFE_2026</span>
            </div>
            
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center justify-center mb-20 relative">
                <span className="text-xs font-black tracking-[0.4em] mb-8 text-foreground/40 uppercase">CORE INFRASTRUCTURE</span>
                
                <div className="relative group/title mb-4">
                  <div className="flex items-center gap-4 text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    <span className="text-foreground relative">
                      POWERED BY
                      <span className="absolute top-0 left-0 text-accent opacity-0 transition-all duration-75">POWERED BY</span>
                      <span className="absolute top-0 left-0 text-blue-500 opacity-0 transition-all duration-75 delay-75">POWERED BY</span>
                    </span>
                    <span className="text-[#3ECF8E] flex items-center gap-2 relative">
                      <Zap className="w-8 h-8 md:w-12 md:h-12 fill-current drop-shadow-[0_0_20px_rgba(62,207,142,0.6)]" />
                      <span className="relative">
                        SUPABASE
                        <span className="absolute top-0 left-0 text-accent opacity-0 transition-all duration-75">SUPABASE</span>
                      </span>
                    </span>
                  </div>
                </div>
                
                <p className="text-xs font-bold text-foreground/50 mt-4 uppercase italic tracking-wide">
                  BECAUSE WE'RE NOT STORING YOUR DATA ON A POTATO
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="flex flex-col items-center relative">
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
                    <span className="text-xs font-black tracking-[0.4em] text-foreground/40 uppercase relative">
                      TRUSTED BY PEOPLE WHO TRUST PEOPLE
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-accent/20" />
                    </span>
                    <div className="h-px w-20 bg-gradient-to-r from-accent via-transparent to-transparent" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
                  {[
                    { 
                      name: 'SEQUOIA', 
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Sequoia_Capital_logo.svg/3840px-Sequoia_Capital_logo.svg.png',
                      tagline: 'THEY FUNDED APPLE. WE MADE FORMS COOL.',
                      stat: '$85B',
                      statLabel: 'PORTFOLIO VALUE',
                      verified: true,
                      color: 'emerald'
                    },
                    { 
                      name: 'FIGMA', 
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
                      tagline: 'IF DESIGN IS YOUR PASSION, THIS IS YOUR TOOL.',
                      stat: '4M+',
                      statLabel: 'DESIGNERS',
                      verified: true,
                      color: 'purple'
                    },
                    { 
                      name: 'CANVA', 
                      logo: 'https://1000logos.net/wp-content/uploads/2021/10/Canva-logo.jpg',
                      tagline: 'MAKING EVERYONE A DESIGNER (EVEN YOUR MOM).',
                      stat: '170M',
                      statLabel: 'MONTHLY USERS',
                      verified: true,
                      color: 'cyan'
                    },
                    { 
                      name: 'VERCEL', 
                      logo: 'https://1000logos.net/wp-content/uploads/2024/08/Vercel-Logo-1536x864.png',
                      tagline: 'DEPLOY IN SECONDS. IMPRESS IN MINUTES.',
                      stat: '<100ms',
                      statLabel: 'EDGE LATENCY',
                      verified: true,
                      color: 'slate'
                    },
                    { 
                      name: 'STRIPE', 
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png',
                      tagline: 'WE MAKE GETTING PAID NOT SUCK.',
                      stat: '$1T+',
                      statLabel: 'PROCESSED',
                      verified: true,
                      color: 'violet'
                    },
                    { 
                      name: 'SUPABASE', 
                      logo: 'https://wp.logos-download.com/wp-content/uploads/2023/02/Supabase_Logo.png?dl',
                      tagline: 'POSTGRESQL FOR PEOPLE WHO HATE COMPLEXITY.',
                      stat: '99.99%',
                      statLabel: 'UPTIME SLA',
                      verified: true,
                      color: 'green'
                    }
                  ].map((partner, i) => (
                    <div key={i} className="group/card relative">
                      <div className={cn(
                        "absolute inset-0 blur-xl opacity-0 group-hover/card:opacity-30 transition-opacity duration-500",
                        partner.color === 'emerald' && "bg-emerald-500/50",
                        partner.color === 'purple' && "bg-purple-500/50",
                        partner.color === 'cyan' && "bg-cyan-500/50",
                        partner.color === 'slate' && "bg-slate-500/50",
                        partner.color === 'violet' && "bg-violet-500/50",
                        partner.color === 'green' && "bg-[#3ECF8E]/50"
                      )} />
                      
                      <div className="relative border-2 border-foreground/10 bg-background p-8 group-hover/card:border-accent/30 transition-all duration-500 group-hover/card:translate-y-[-4px] shadow-sm group-hover/card:shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            {partner.verified && (
                              <>
                                <div className="h-1.5 w-1.5 bg-[#3ECF8E] rounded-full animate-pulse" />
                                <span className="text-[8px] font-mono text-[#3ECF8E] font-black uppercase tracking-wider">VERIFIED</span>
                              </>
                            )}
                          </div>
                          <span className="text-[7px] font-mono text-foreground/30 uppercase tracking-widest">PARTNER_{i + 1}</span>
                        </div>
                        
                        <div className="flex items-center justify-center mb-6 h-16 transition-all duration-500">
                          <img 
                            src={partner.logo} 
                            alt={partner.name}
                            className="h-12 w-auto object-contain"
                          />
                        </div>
                        
                        <p className="text-xs font-black uppercase text-foreground/70 text-center mb-6 leading-tight italic group-hover/card:text-foreground transition-colors">
                          {partner.tagline}
                        </p>
                        
                        <div className="border-t-2 border-foreground/10 pt-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-accent tracking-tight">{partner.stat}</span>
                            <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-wider">{partner.statLabel}</span>
                          </div>
                          
                          <div className="border border-foreground/10 px-3 py-1 bg-foreground/[0.02]">
                            <span className="text-[7px] font-black text-foreground/50 uppercase tracking-widest">TRUSTED</span>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground/40 uppercase italic mb-2">
                    WE'RE NOT SAYING WE'RE BETTER THAN YOUR BANK'S SECURITY...
                  </p>
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">
                    BUT WE'RE DEFINITELY NOT WORSE.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

        <section className="container mx-auto px-4 py-24 max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-16 tracking-tighter text-center">
              QUESTIONS<span className="text-accent">?</span>ANSWERS<span className="text-accent underline decoration-4 underline-offset-8">!</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <BrutalAccordion items={faq} />
          </ScrollReveal>
        </section>

        <section className="border-y-2 border-foreground py-24 bg-secondary group select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 tracking-tighter text-center">
                LOVED BY BUILDERS<span className="text-accent">.</span>
              </h2>
            </ScrollReveal>
            <StaggerTestimonials />
          </div>
        </section>

        <Footer />
        <SterlingGateKineticNavigation />
      </div>
  );
};

export default Index;