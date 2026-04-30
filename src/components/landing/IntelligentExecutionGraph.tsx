import React from 'react';
import { motion } from 'motion/react';

const Badge = ({ text, className }: { text: string; className?: string }) => (
  <div className={`absolute -bottom-6 left-0 px-2 py-0.5 rounded-[4px] text-[10px] font-mono flex items-center gap-1 shadow-sm ${className}`}>
    <span className="opacity-60">↳</span> {text}
  </div>
);

export const IntelligentExecutionGraph = () => {
  return (
    <div className="relative w-full h-[600px]">
      {/* Background/Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ stroke: 'rgba(26,29,41,0.15)', fill: 'none', strokeWidth: 1.5 }}>
        {/* Main central horizontal line */}
        <path d="M -50 450 C 100 450, 150 450, 200 450 C 250 450, 280 430, 300 400 C 330 350, 350 350, 400 350" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
        
        {/* Connections */}
        <path d="M 150 450 C 200 450, 200 380, 250 380" />
        <path d="M 280 380 C 320 380, 320 350, 350 350" />
        <path d="M 380 350 C 450 350, 450 250, 500 250" />
        <path d="M 380 350 C 450 350, 450 450, 500 450" />
        <path d="M 380 350 C 450 350, 480 180, 520 180" />
        
        <path d="M 520 180 C 580 180, 580 120, 620 120" />
        <path d="M 520 180 C 580 180, 580 220, 620 220" />
        
        <path d="M 620 120 C 660 120, 660 60, 700 60" />
        <path d="M 700 60 L 800 60" />
        
        {/* Nodes (Dots) */}
        <circle cx="150" cy="450" r="3" fill="var(--hex-ink)" opacity="0.3" />
        <circle cx="280" cy="380" r="3" fill="var(--hex-ink)" opacity="0.3" />
        <circle cx="380" cy="350" r="3" fill="var(--hex-ink)" opacity="0.3" />
        <circle cx="520" cy="180" r="3" fill="var(--hex-ink)" opacity="0.3" />
        <circle cx="700" cy="60" r="3" fill="var(--hex-ink)" opacity="0.3" />
        <circle cx="800" cy="60" r="3" fill="var(--c-purple)" stroke="none" />
        
        {/* Tiny moving dots along paths */}
        <circle r="2" fill="var(--c-purple)" stroke="none">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 150 450 C 200 450, 200 380, 250 380" />
        </circle>
        <circle r="2" fill="var(--c-purple)" stroke="none">
          <animateMotion dur="6s" repeatCount="indefinite" path="M 380 350 C 450 350, 450 250, 500 250" />
        </circle>
        <circle r="2" fill="var(--c-purple)" stroke="none">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 520 180 C 580 180, 580 120, 620 120" />
        </circle>
        <circle r="2" fill="var(--c-purple)" stroke="none">
          <animateMotion dur="7s" repeatCount="indefinite" path="M 620 120 C 660 120, 660 60, 700 60" />
        </circle>
      </svg>

      {/* Nodes - positioned absolute */}
      
      {/* Pivot Cell */}
      <div className="absolute left-[0px] top-[300px] w-48 bg-white rounded-md shadow-lg border border-slate-200 p-3 z-10 flex flex-col gap-2">
        <div className="text-[10px] text-slate-400 font-medium mb-1">Pivot cell</div>
        <div className="border border-slate-100 rounded grid grid-cols-2 text-[8px] bg-slate-50 overflow-hidden">
          <div className="p-1 border-b border-r border-slate-100 bg-slate-100/50">Rows<br/>ORDER_DATE_YEAR</div>
          <div className="p-1 border-b border-slate-100">
             <div className="h-1 w-full bg-slate-200 rounded mb-1"/>
             <div className="h-1 w-3/4 bg-slate-200 rounded"/>
          </div>
          <div className="p-1 border-b border-r border-slate-100 bg-slate-100/50">Columns<br/>ORDER_STATUS</div>
          <div className="p-1 border-b border-slate-100">
             <div className="h-1 w-full bg-slate-200 rounded mb-1"/>
             <div className="h-1 w-5/6 bg-slate-200 rounded"/>
          </div>
          <div className="p-1 border-r border-slate-100 bg-slate-100/50">Values<br/>ORDER_ID_COUNT</div>
          <div className="p-1">
             <div className="h-1 w-full bg-slate-200 rounded mb-1"/>
             <div className="h-1 w-1/2 bg-slate-200 rounded"/>
          </div>
        </div>
        <Badge text="pivoted_dataframe" className="bg-emerald-50 border border-emerald-100 text-emerald-700" />
      </div>

      {/* Filter Cell */}
      <div className="absolute left-[150px] top-[430px] w-48 bg-white rounded-md shadow-lg border border-slate-200 p-3 z-10">
        <div className="text-[10px] text-slate-400 font-medium mb-2">Filter cell</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-600 bg-slate-50 border border-slate-100 p-1.5 rounded">
            <span>ORDER_STATUS</span> <span className="opacity-50">=</span> <span className="bg-[#e0e7ff] text-[#4f46e5] px-1 rounded">order_status</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-600 bg-slate-50 border border-slate-100 p-1.5 rounded">
            <span className="opacity-50">+</span> <span>ORDER_DATE</span> <span className="text-slate-400">is before</span> <span>Yesterday</span>
          </div>
        </div>
        <Badge text="filtered_dataframe" className="bg-emerald-50 border border-emerald-100 text-emerald-700" />
      </div>

      {/* SQL Cell */}
      <div className="absolute left-[250px] top-[280px] w-56 bg-white rounded-md shadow-lg border border-slate-200 p-3 z-10">
        <div className="text-[10px] text-slate-400 font-medium mb-2">SQL cell</div>
        <div className="text-[9px] font-mono leading-[1.6]">
          <span className="text-[#3b82f6]">select</span> channel, account_age, lifetime_<br/>
          &nbsp;&nbsp;<span className="text-[#3b82f6]">count</span>(<span className="text-[#ec4899]">distinct</span> usage.event_id) <span className="text-[#3b82f6]">as</span><br/>
          <span className="text-[#3b82f6]">from</span> users<br/>
          <span className="text-[#3b82f6]">left join</span> usage_events <span className="text-[#3b82f6]">as</span> usage <span className="text-[#3b82f6]">on</span> users.<br/>
          <span className="text-[#3b82f6]">where</span> usage.event_type = ((<span className="bg-[#e0e7ff] text-[#4f46e5] px-0.5 rounded">event_cf_</span>))<br/>
          <span className="text-[#3b82f6]">group by</span> 1,2,3
        </div>
        <Badge text="dataframe" className="bg-emerald-50 border border-emerald-100 text-emerald-700" />
      </div>

      {/* Input Cell */}
      <div className="absolute left-[400px] top-[320px] w-32 bg-white/95 backdrop-blur-md rounded-md shadow-md border hex-line-soft p-3 z-10">
        <div className="text-[10px] text-slate-400 font-medium mb-2">Input cell</div>
        <div className="flex items-center justify-between bg-slate-50 border hex-line-soft text-slate-900 text-[10px] px-2 py-1.5 rounded">
          Shipped
          <span className="opacity-50 text-[8px]">▼</span>
        </div>
        <Badge text="order_status" className="bg-[#e0e7ff] text-[#4f46e5]" />
      </div>

      {/* Connect to Anything */}
      <div className="absolute left-[380px] top-[100px] w-48 bg-white/95 backdrop-blur-md rounded-md shadow-md border hex-line-soft p-4 z-10">
        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">CONNECT TO ANYTHING</div>
        <div className="flex items-center justify-center gap-3">
          {/* Logos placeholders */}
          <div className="w-5 h-5 rounded-full bg-[#38bdf8] flex items-center justify-center text-white text-[10px] font-bold">S</div>
          <div className="w-5 h-5 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-[10px] font-bold">B</div>
          <div className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center text-white text-[10px] font-bold">A</div>
          <div className="w-5 h-5 rounded-full bg-[#ec4899] flex items-center justify-center text-white text-[10px] font-bold">D</div>
          <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[10px] font-bold">X</div>
        </div>
        <div className="text-[9px] text-slate-400 text-center mt-3">And more...</div>
      </div>

      {/* Other decorative empty nodes from the image */}
      <div className="absolute left-[500px] top-[240px] w-24 h-12 bg-slate-50/80 border hex-line-soft rounded shadow-sm z-0"></div>
      <div className="absolute left-[500px] top-[440px] w-20 h-8 bg-slate-50/80 border hex-line-soft rounded shadow-sm z-0"></div>
      <div className="absolute left-[620px] top-[110px] w-16 h-6 bg-slate-50/80 border hex-line-soft rounded shadow-sm z-0"></div>
      <div className="absolute left-[620px] top-[210px] w-24 h-8 bg-slate-50/80 border hex-line-soft rounded shadow-sm z-0"></div>
      <div className="absolute left-[660px] top-[50px] w-12 h-6 bg-slate-50/80 border hex-line-soft rounded shadow-sm z-0"></div>

    </div>
  );
};
