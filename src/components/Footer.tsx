import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative min-h-[850px] flex flex-col justify-end overflow-hidden border-t-2 border-foreground bg-background">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-bottom opacity-100 transition-opacity duration-1000"
        style={{ backgroundImage: 'url(https://ik.imagekit.io/jbckhvkvo/ChatGPT%20Image%20Feb%2012,%202026,%2006_46_37%20PM.png)' }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
        <h2 className="text-[25vw] font-black text-white px-4 text-center uppercase tracking-tighter leading-none opacity-90">
          AQORA
        </h2>
      </div>

      <div className="relative z-20 bg-background/80 backdrop-blur-xl border-t-2 border-foreground pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <Link 
                to="/" 
                className="text-5xl font-black tracking-widest uppercase block mb-8 group"
                onClick={scrollToTop}
              >
                AQORA<span className="text-accent group-hover:animate-pulse">.</span>
              </Link>
              <p className="text-sm font-bold uppercase text-foreground/60 tracking-[0.2em] leading-relaxed max-w-sm border-l-4 border-accent pl-6">
                THE BRUTALIST FORM BUILDER FOR DEVELOPERS AND DESIGNERS WHO DEMAND SPEED AND STYLE. NO FLUFF, JUST FORMS.
              </p>
            </div>

            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-accent italic">DIRECTORY</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/dashboard" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Dashboard</Link>
                </li>
                <li>
                  <Link to="/learn-more" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Examples</Link>
                </li>
                <li>
                  <Link to="/#features" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Themes</Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">About Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-accent italic">PROTECOL</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/privacy" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/security" className="text-sm font-bold uppercase hover:text-accent transition-all hover:translate-x-1 inline-block">Security</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t-2 border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                © {new Date().getFullYear()} AQORA INC.
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                DESIGNED IN THE VOID / BUILT FOR THE BOLD
              </span>
            </div>
            
            <div className="flex gap-12">
              {[
                { name: 'TWITTER', url: 'https://twitter.com/AQORA_build' },
                { name: 'GITHUB', url: 'https://github.com/AQORA-build' },
                { name: 'DISCORD', url: 'https://discord.gg/AQORA' }
              ].map(platform => (
                <a 
                  key={platform.name} 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent transition-all hover:-translate-y-1 block"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
