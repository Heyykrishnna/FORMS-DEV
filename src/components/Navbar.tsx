import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  to?: string;
  children?: React.ReactNode;
  dropdownAlign?: 'left' | 'center' | 'right';
}

const NavItem = ({ label, to, children, dropdownAlign = 'left' }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const alignClass = 
    dropdownAlign === 'left' ? 'left-0' :
    dropdownAlign === 'right' ? 'right-0' :
    'left-1/2 -translate-x-1/2';

  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {to ? (
        <Link 
          to={to} 
          className="flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-foreground"
          style={{ color: isOpen ? 'var(--foreground)' : 'var(--hex-ink-soft)' }}
        >
          {label}
        </Link>
      ) : (
        <button 
          className="flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-foreground"
          style={{ color: isOpen ? 'var(--foreground)' : 'var(--hex-ink-soft)' }}
        >
          {label}
          {children && (
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300 opacity-60", isOpen && "rotate-180")} />
          )}
        </button>
      )}

      {children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn("absolute top-[calc(100%-12px)] pt-4 cursor-default", alignClass)}
            >
              <div className="bg-[#fdfcfb] border hex-line-soft rounded-xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const MegaMenuItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="group cursor-pointer">
    <div className="text-[14px] font-medium text-foreground mb-1 group-hover:text-foreground transition-colors">{title}</div>
    <div className="text-[13px] leading-[1.4]" style={{ color: 'var(--hex-ink-soft)' }}>{desc}</div>
  </div>
);

const SimpleDropdown = ({ items }: { items: {title: string, desc: string}[] }) => (
  <div className="flex flex-col p-3 w-[280px]">
    {items.map((item, i) => (
      <div key={i} className="group cursor-pointer p-3 rounded-lg hover:bg-[#f5f3ee] transition-colors">
        <div className="text-[14px] font-medium text-foreground mb-0.5 transition-colors">{item.title}</div>
        <div className="text-[13px] leading-snug" style={{ color: 'var(--hex-ink-soft)' }}>{item.desc}</div>
      </div>
    ))}
  </div>
);

const PlatformMegaMenu = () => (
  <div className="flex flex-col w-[700px] p-8 gap-8">
    <div className="grid grid-cols-2 gap-x-16 gap-y-8">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 hex-mono" style={{ color: 'var(--hex-ink-muted)' }}>Products</div>
        <div className="flex flex-col gap-6">
          <MegaMenuItem 
            title="Agentic notebooks"
            desc="Powerful, deep-dive analysis without the silos"
          />
          <MegaMenuItem 
            title="Conversational self-serve"
            desc="The best BI tool isn't just a BI tool"
          />
          <MegaMenuItem 
            title="Context Studio"
            desc="Build trust in data with semantic models and AI governance"
          />
          <MegaMenuItem 
            title="Aqora CLI"
            desc="Control your analytics from the terminal"
          />
        </div>
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 hex-mono" style={{ color: 'var(--hex-ink-muted)' }}>Capabilities</div>
        <div className="flex flex-col gap-6">
          <MegaMenuItem 
            title="Exploratory analysis"
            desc="Go from quick question to deep analysis to data app in one place"
          />
          <MegaMenuItem 
            title="Embedded analytics"
            desc="Ship secure, customer-facing data experiences"
          />
          <MegaMenuItem 
            title="Data apps"
            desc="Build and share interactive dashboards and reporting"
          />
          <MegaMenuItem 
            title="Integrations"
            desc="Out-of-the-box connections and flexible APIs"
          />
        </div>
      </div>
    </div>
    
    <div className="mt-2 rounded-xl border hex-line-soft bg-[#f5f3ee]/60 p-5 relative overflow-hidden group cursor-pointer hover:bg-[#f5f3ee] transition-colors">
       {/* Topographic/noise background effect */}
       <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
       <div className="relative z-10 flex items-center gap-3">
         <div>
           <div className="text-[14px] font-semibold text-foreground mb-0.5">AI & agents</div>
           <div className="text-[13px]" style={{ color: 'var(--hex-ink-soft)' }}>Agentic workflows to empower your entire team</div>
         </div>
       </div>
    </div>
  </div>
);

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="relative w-full h-[64px]" style={{ background: '#e8e6df' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between relative z-10">
          
          {/* Left Navigation */}
          <div className="flex items-center gap-8 h-full flex-1">
            <NavItem label="Platform" dropdownAlign="left">
              <PlatformMegaMenu />
            </NavItem>
            
            <NavItem label="Solutions" dropdownAlign="left">
              <SimpleDropdown items={[
                { title: "For Product Teams", desc: "User research & feedback loops" },
                { title: "For Marketing", desc: "Lead generation & qualification" },
                { title: "For Customer Success", desc: "NPS and user satisfaction tracking" }
              ]} />
            </NavItem>

            <Link to="/enterprise" className="text-[14px] font-medium transition-colors hover:text-foreground" style={{ color: 'var(--hex-ink-soft)' }}>
              Enterprise
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <Link to="/" className="text-[24px] font-bold tracking-tight text-foreground flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.04em' }}>
              aqora
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-8 h-full flex-1 justify-end">
            <NavItem label="Resources" dropdownAlign="right">
               <SimpleDropdown items={[
                { title: "Documentation", desc: "Learn how to integrate and build" },
                { title: "Blog", desc: "Product updates and stories" },
                { title: "Community", desc: "Join thousands of builders" }
              ]} />
            </NavItem>

            <Link to="/pricing" className="text-[14px] font-medium transition-colors hover:text-foreground" style={{ color: 'var(--hex-ink-soft)' }}>
              Pricing
            </Link>

            <div className="flex items-center gap-4 pl-2">
              <Link to="/auth" className="text-[14px] font-medium transition-colors hover:text-foreground" style={{ color: 'var(--hex-ink-soft)' }}>
                Log In
              </Link>
              <Link 
                to="/auth" 
                className="text-[13px] font-medium border hex-line-strong text-foreground bg-white px-4 py-2 rounded-md hover:bg-[#faf9f6] transition-all shadow-sm"
              >
                Get started
              </Link>
            </div>
          </div>

        </div>
        
        {/* Wave bottom decoration */}
        <div 
          className="absolute top-[calc(100%-1px)] left-0 right-0 h-[10px] w-full pointer-events-none"
          style={{
            backgroundSize: '20px 10px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 10'%3E%3Cpath d='M0,0 C5,10 15,10 20,0 Z' fill='%23e8e6df'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
          }}
          aria-hidden="true"
        />
      </nav>
    </div>
  );
};

export default Navbar;
