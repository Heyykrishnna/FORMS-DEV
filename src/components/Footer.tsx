import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    // If it's a hash link, let it behave normally or handle smoothly
    // For now just scroll to top if it's the home link
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
    if (href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-white text-[#2d5cf6] overflow-hidden flex flex-col font-sans border-t border-[#2d5cf6]">
      <div className="mx-auto w-full max-w-[1600px] border-x border-[#2d5cf6] flex flex-col relative">
        
        {/* Horizontal grid line across the top */}
        {/* <div className="w-full h-[1px] bg-[#2d5cf6] absolute top-0 left-0" /> */}

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 lg:p-12 border-b border-[#2d5cf6]">
          <div className="col-span-2 md:col-span-1">
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="text-2xl font-bold tracking-tighter block mb-4 hover:opacity-80 transition-opacity"
            >
              AQORA
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs opacity-80">
              The brutalist form builder for developers and designers who demand speed and style.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Directory</h4>
            <Link to="/dashboard" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Dashboard</Link>
            <Link to="/learn-more" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Examples</Link>
            <a href="/#features" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Themes</a>
            <Link to="/about" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">About Us</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Protocol</h4>
            <Link to="/privacy" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Privacy Policy</Link>
            <Link to="/terms" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Terms of Service</Link>
            <Link to="/security" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Security</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Social</h4>
            <a href="https://twitter.com/AQORA_build" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Twitter</a>
            <a href="https://github.com/AQORA-build" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">GitHub</a>
            <a href="https://discord.gg/AQORA" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:translate-x-1 transition-transform inline-block w-fit">Discord</a>
          </div>
        </div>

        {/* Top Huge Text */}
        <div className="w-full border-b border-[#2d5cf6] flex items-center justify-center p-4 lg:p-8 overflow-hidden">
          <h1 className="text-[16vw] lg:text-[14vw] leading-[0.8] font-medium tracking-tight whitespace-nowrap">
            Aqora—Forms
          </h1>
        </div>

        {/* Middle Huge Abstract Shapes (Cut off text) */}
        <div className="w-full border-b border-[#2d5cf6] overflow-hidden relative flex items-end justify-center h-[35vw] lg:h-[25vw] bg-white text-[#2d5cf6]">
           {/* Abstract massive text resembling the image layout, using AQORA */}
           <h1 className="text-[55vw] lg:text-[45vw] leading-[0.65] font-black tracking-tighter whitespace-nowrap -mb-[8vw] select-none">
             AQORA
           </h1>
        </div>

        {/* Bottom Footer bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 lg:p-6 gap-4">
          <span className="text-5xl font-black tracking-tighter leading-none">A</span>
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest">
            Created by Aqora-Studio 20—26
          </span>
        </div>

      </div>
      
      {/* Global horizontal line at the very bottom just in case */}
      {/* <div className="w-full h-[1px] bg-[#2d5cf6]" /> */}
    </footer>
  );
};

export default Footer;
