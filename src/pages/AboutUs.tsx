import { Link } from 'react-router-dom';
import { ArrowLeft, History, Users, Megaphone, Terminal, Signal } from 'lucide-react';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background font-mono selection:bg-accent selection:text-accent-foreground">
        {/* HEADER */}
        <nav className="border-b-4 border-foreground sticky top-0 bg-background z-50">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-widest uppercase hover:text-accent transition-colors">
              <ArrowLeft className="h-6 w-6" /> HOME
            </Link>
            <div className="text-2xl font-black tracking-widest uppercase">
              ABOUT REVOX<span className="text-accent">.</span>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* HERO / MANIFESTO */}
            <section className="mb-32 py-20 border-y-8 border-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[20vw] font-black opacity-[0.03] select-none leading-none -mr-10 -mt-10">
                SOUL
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-12 italic">
                WE BUILD <span className="bg-accent text-accent-foreground px-4">WEAPONS</span><br />
                NOT WIDGETS.
              </h1>
              <div className="space-y-12 max-w-2xl relative z-10">
                <div className="flex gap-8 items-start">
                  <span className="text-6xl font-black text-accent opacity-50">01</span>
                  <div>
                    <h2 className="text-3xl font-black uppercase mb-4 italic">FUNCTION OVER FLUFF</h2>
                    <p className="text-lg font-bold opacity-70">WHILE OTHERS HIDE BEHIND GRADIENTS, WE EXPOSE THE SKELETON. WE BELIEVE IN CLEAR BORDERS AND SHARP DECISIONS. NO SHADOWS, NO DIMENSIONS, JUST RAW DATA.</p>
                  </div>
                </div>
                <div className="flex gap-8 items-start">
                  <span className="text-6xl font-black text-accent opacity-50">02</span>
                  <div>
                    <h2 className="text-3xl font-black uppercase mb-4 italic">RADICAL OWNERSHIP</h2>
                    <p className="text-lg font-bold opacity-70">YOUR DATA BELONGS TO YOU. YOUR STYLE SHOULD BE YOUR OWN. WE PROVIDE THE ENGINE, YOU PROVIDE THE SOUL. REVOX IS THE ANTIDOTE TO CORPORATE BLANDNESS.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* THE CHRONICLES (TIMELINE) */}
            <section className="mb-32">
              <h2 className="text-4xl font-black uppercase mb-16 italic flex items-center gap-4 border-b-4 border-foreground pb-4">
                THE CHRONICLES
              </h2>
              <div className="space-y-16 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-1 before:bg-foreground/10">
                {[
                  { year: '2025 / Q4', title: 'THE SILICON SPARK', desc: 'FRUSTRATED WITH ROUNDED CORNERS AND SOFT INTERFACES, THE FIRST LINE OF REVOX WAS WRITTEN IN A DARK BASEMENT DURING A POWER OUTAGE.' },
                  { year: '2026 / JAN', title: 'THE BRUTAL LAUNCH', desc: 'REVOX V1.0 GOES LIVE. THE DESIGN COMMUNITY IS SHOCKED. THE PURISTS ARE TERRIFIED. 10K+ FORMS BUILT IN THE FIRST 48 HOURS.' },
                  { year: '2026 / FEB', title: 'THE ASCENSION', desc: 'IMPLEMENTED ADVANCED LOGIC, SECURITY SUITE, AND SEO ENGINE. REVOX BECOMES THE DEFAULT FOR THOSE WHO DEMAND SPEED AND STYLE.' },
                ].map((item, i) => (
                  <div key={i} className="relative pl-16 group">
                    <div className="absolute left-0 top-1 w-10 h-10 border-4 border-foreground bg-background flex items-center justify-center z-10 group-hover:bg-accent group-hover:border-accent transition-all">
                      <div className="w-4 h-4 bg-accent group-hover:bg-background" />
                    </div>
                    <span className="text-sm font-black text-accent tracking-[0.3em] uppercase mb-2 block">{item.year}</span>
                    <h3 className="text-4xl font-black uppercase mb-4 italic leading-none">{item.title}</h3>
                    <p className="font-bold opacity-60 uppercase text-lg leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* THE OUTLAWS (TEAM) */}
            <section className="mb-32">
              <h2 className="text-4xl font-black uppercase mb-16 italic flex items-center gap-4 border-b-4 border-foreground pb-4">
                THE OUTLAWS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { name: 'THE CODE-WRAITH', role: 'CORE ARCHITECT', desc: 'A LEGENDARY ARCHITECT WHO SPEAKS ONLY IN BINARY AND COFFEE-FUELED RANTS. BUILT THE CORE ENGINE WHILE SLEEP-WALKING. THINKS ROUNDED CORNERS ARE A SIGN OF WEAKNESS.' },
                  { name: 'THE SYSTEM-OVERLORD', role: 'SYSTEM ENFORCER', desc: 'ENFORCES BORDER-WIDTH PROTOCOLS WITH AN IRON FIST. SPENDS 90% OF HIS TIME DELETING CSS GRADIENTS. RUMORED TO HAVE ONCE WRITTEN A WHOLE APP IN A SINGLE REGEX.' },
                  { name: 'AGENT ZERO', role: 'NEURAL ENGINE', desc: 'A NEURAL ENTITY THAT ACTUALLY DOES ALL THE WORK WHILE THE HUMANS ARGUE ABOUT BORDER RADII. HAS NO PHYSICAL FORM, ONLY EXTREMELY HIGH-CONTRAST THOUGHTS.' },
                  { name: 'THE ANONYMOUS LEGION', role: 'THE INFANTRY', desc: 'THOUSANDS OF REBELLIOUS BUILDERS WHO REFUSE TO USE "DEFAULT BLUE". THEY ARE EVERYWHERE. THEY ARE BRUTAL. THEY PROBABLY HAVEN\'T SLEPT SINCE THE LAUNCH.' },
                ].map((member, i) => (
                  <div key={i} className="border-4 border-foreground p-10 hover:bg-foreground hover:text-background transition-all group relative">
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-[10px] font-black group-hover:bg-background group-hover:text-foreground transition-colors">
                      ID: 00{i+1}
                    </div>
                    <div className="w-24 h-24 border-4 border-accent mb-8 flex items-center justify-center group-hover:border-accent group-hover:text-black transition-colors bg-secondary">
                      <Terminal className="h-12 w-12" />
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-1 tracking-tight">{member.name}</h3>
                    <span className="text-xs font-black text-accent uppercase tracking-[0.4em] mb-6 block group-hover:text-accent font-mono underline decoration-2 underline-offset-4">{member.role}</span>
                    <p className="text-sm font-black uppercase opacity-60 group-hover:opacity-100 italic leading-relaxed">{member.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* THE SIGNAL (CONTACT) */}
            <section className="bg-foreground text-background p-12 md:p-20 text-center border-brutal-4 shadow-brutal-lg">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 italic">SEND A SIGNAL.</h2>
              <p className="text-xl font-bold uppercase mb-12 opacity-70">WANT TO JOIN THE REBELION? HAVE A FEATURE REQUEST THAT'S TOO BOLD FOR THE MAINSTREAM?</p>
              <a 
                href="mailto:signals@revox.build"
                className="inline-block bg-accent text-accent-foreground border-4 border-background px-12 py-5 text-2xl font-black uppercase shadow-[8px_8px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                DEPLOY EMAIL →
              </a>
            </section>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default AboutUs;
