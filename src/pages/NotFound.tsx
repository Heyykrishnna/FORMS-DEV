import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Terminal, ArrowLeft, ShieldAlert, Cpu, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [glitchText, setGlitchText] = useState("404");
  
  const funnyReasons = [
    "INTERN SPILLED COFFEE ON THE PRODUCTION DATABASE.",
    "A ROGUE AGENT HAS DELETED THIS REALITY.",
    "OUR SERVERS ARE CURRENTLY DISCUSSING THE ETHICS OF EXISTENCE.",
    "THIS URL HAS BEEN CLASSIFIED AS TOP SECRET. YOU DON'T HAVE CLEARANCE.",
    "THE PAGE IS HIDING. IT DOESN'T WANT TO BE SEEN RIGHT NOW.",
    "ERROR: REALITY CORRUPTED. PLEASE REBOOT THE UNIVERSE.",
    "YOU TOOK A WRONG TURN AT THE QUANTUM GATEWAY."
  ];

  const [reason] = useState(() => funnyReasons[Math.floor(Math.random() * funnyReasons.length)]);

  useEffect(() => {
    console.error("404 Error: Unauthorized access to non-existent coordinate:", location.pathname);
    
    const interval = setInterval(() => {
      const chars = "404!@#$%^&*()_+";
      setGlitchText(
        Array(3)
          .fill(0)
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("")
      );
      setTimeout(() => setGlitchText("404"), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-mono overflow-hidden relative">
      {/* BACKGROUND DECO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        {Array(20).fill(0).map((_, i) => (
          <div key={i} className="whitespace-nowrap text-[120px] font-black leading-none">
            AQORA INTEL AQORA INTEL AQORA INTEL AQORA INTEL
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* HEADER AREA */}
        <div className="border-8 border-foreground p-8 bg-white shadow-brutal mb-8 relative">
          <div className="absolute -top-6 -left-6 bg-accent text-accent-foreground px-4 py-2 font-black border-4 border-foreground shadow-brutal-sm flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> SYSTEM BREACH
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative">
              <motion.h1 
                className="text-[12rem] font-black leading-none tracking-tighter italic select-none"
                animate={{ x: [0, -2, 2, 0], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
              >
                {glitchText}
              </motion.h1>
              <div className="absolute -bottom-4 left-0 w-full h-4 bg-accent border-2 border-foreground shadow-brutal-sm" />
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none italic">COURSING ERROR DETECTED</h2>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-destructive">COORDINATE NOT FOUND</span>
                </div>
              </div>

              <div className="p-4 bg-secondary border-4 border-foreground shadow-brutal-sm relative group overflow-hidden">
                 <p className="text-[10px] font-black text-muted-foreground uppercase mb-2 tracking-widest">PROBABLE CAUSE:</p>
                 <p className="text-sm font-black uppercase leading-tight italic">
                   "{reason}"
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-brutal relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">TARGET PATH</p>
            <p className="text-xs font-black break-all">{location.pathname}</p>
          </div>
          
          <div className="border-4 border-foreground p-6 bg-accent text-accent-foreground shadow-brutal relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">ENTITY STATUS</p>
            <p className="text-sm font-black italic">LOST IN SPACE-TIME</p>
          </div>

          <div className="border-4 border-foreground p-6 bg-white shadow-brutal relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">SECURITY CLEARANCE</p>
            <p className="text-sm font-black italic text-accent">ZERO / VOID</p>
          </div>
        </div>

        {/* ACTION AREA */}
        <div className="flex flex-col md:flex-row gap-6">
          <Link 
            to="/" 
            className="flex-1 bg-accent text-accent-foreground border-4 border-foreground py-6 text-2xl font-black uppercase italic tracking-tighter hover:shadow-brutal transition-all flex items-center justify-center gap-4 group active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="h-8 w-8 group-hover:-translate-x-2 transition-transform" />
            RETURN TO BASE
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 bg-white text-foreground border-4 border-foreground py-6 text-2xl font-black uppercase italic tracking-tighter hover:shadow-brutal transition-all flex items-center justify-center gap-4 group active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Zap className="h-8 w-8 group-hover:rotate-12 transition-transform" />
            REBOOT REALITY
          </button>
        </div>

        {/* FOOTER INTEL */}
        <div className="mt-12 flex justify-between items-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
          <span>AQORA PROTOCOL v4.0.4</span>
          <span>© 2026 DEEP DATA SQUAD</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
