import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';

export const GeoGlyph = ({ className = '' }: { className?: string }) => (
  <div className={`hex-glyph inline-flex items-center gap-2 ${className}`}>
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="2.5" y="2.5" width="39" height="39" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="2" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="22" y1="2" x2="22" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="13" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="26.5" y="26.5" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <polygon points="29,12 34,21 24,21" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="30" cy="14" r="1.6" fill="#10b981" />
    </svg>
  </div>
);

const SERIES = [
  { name: 'Onboarding', color: 'var(--c-orange)', pts: [32, 36, 35, 41, 44, 42, 47] },
  { name: 'Pricing',    color: 'var(--c-yellow)', pts: [28, 32, 30, 36, 39, 41, 40] },
  { name: 'Churn',      color: 'var(--c-teal)',   pts: [26, 28, 31, 30, 33, 35, 34] },
  { name: 'NPS',        color: 'var(--c-blue)',   pts: [22, 24, 27, 26, 28, 27, 30] },
  { name: 'Research',   color: 'var(--c-purple)', pts: [16, 18, 17, 20, 19, 21, 22] },
  { name: 'Beta',       color: 'var(--c-lavender)', pts: [9, 10, 11, 11, 12, 12, 13] },
];

const MultiLineChart = ({ w = 480, h = 220 }: { w?: number; h?: number }) => {
  const padL = 28, padR = 8, padT = 8, padB = 22;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = 50;
  const xs = SERIES[0].pts.map((_, i) => padL + (i * innerW) / (SERIES[0].pts.length - 1));
  const yFor = (v: number) => padT + innerH - (v / max) * innerH;
  const [hover, setHover] = useState<string | null>(null);
  const labels = ['Q1', '', '', 'Q2', '', '', 'Q3'];
  const yTicks = [0, 10, 20, 30, 40, 50];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={yFor(t)} y2={yFor(t)} stroke="rgba(26,29,41,0.06)" />
          <text x={padL - 6} y={yFor(t) + 3} fontSize="9" textAnchor="end" fill="var(--hex-ink-muted)">{t}</text>
        </g>
      ))}
      {SERIES.map((s) => {
        const d = s.pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${yFor(v)}`).join(' ');
        const dim = hover && hover !== s.name;
        return (
          <g key={s.name}
             onMouseEnter={() => setHover(s.name)}
             onMouseLeave={() => setHover(null)}
             style={{ transition: 'opacity .2s', opacity: dim ? 0.18 : 1, cursor: 'pointer' }}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className="hex-line-path" style={{ '--len': 600 } as CSSProperties} />
            {s.pts.map((v, i) => (
              <circle key={i} cx={xs[i]} cy={yFor(v)} r="2" fill={s.color} />
            ))}
          </g>
        );
      })}
      {labels.map((l, i) => l && (
        <text key={i} x={xs[i]} y={h - 6} fontSize="9" textAnchor="middle" fill="var(--hex-ink-muted)">{l}</text>
      ))}
    </svg>
  );
};

const SCATTER_GROUPS = [
  { color: 'var(--c-purple)',   n: 36, cx: 0.18, cy: 0.55, spread: 0.12 },
  { color: 'var(--c-teal)',     n: 42, cx: 0.45, cy: 0.40, spread: 0.16 },
  { color: 'var(--c-yellow)',   n: 40, cx: 0.78, cy: 0.62, spread: 0.14 },
];

const ScatterChart = ({ w = 480, h = 220 }: { w?: number; h?: number }) => {
  const padL = 28, padR = 8, padT = 8, padB = 22;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const yTicks = [0, 5, 10, 15, 20, 25];
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  const dots: { x: number; y: number; c: string; d: number }[] = [];
  let seed = 1;
  SCATTER_GROUPS.forEach((g) => {
    for (let i = 0; i < g.n; i++) {
      const dx = (rng(seed++) - 0.5) * 2 * g.spread;
      const dy = (rng(seed++) - 0.5) * 2 * g.spread;
      dots.push({
        x: padL + (g.cx + dx) * innerW,
        y: padT + (g.cy + dy) * innerH,
        c: g.color,
        d: rng(seed++) * 0.6,
      });
    }
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={padT + innerH - (t / 25) * innerH} y2={padT + innerH - (t / 25) * innerH} stroke="rgba(26,29,41,0.06)" />
          <text x={padL - 6} y={padT + innerH - (t / 25) * innerH + 3} fontSize="9" textAnchor="end" fill="var(--hex-ink-muted)">{t}</text>
        </g>
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.6" fill={d.c} opacity="0.78"
                className="hex-dot" style={{ animationDelay: `${d.d}s` }} />
      ))}
      {[0, 10, 20, 30, 40, 50].map((v, i) => (
        <text key={v} x={padL + (i / 5) * innerW} y={h - 6} fontSize="9" textAnchor="middle" fill="var(--hex-ink-muted)">{v}</text>
      ))}
    </svg>
  );
};

const STACK_ROWS = [
  { label: 'Onboarding flow', parts: [42, 18, 24, 16] },
  { label: 'Pricing page',    parts: [38, 22, 22, 18] },
  { label: 'Churn survey',    parts: [30, 26, 28, 16] },
  { label: 'Dark mode poll',  parts: [22, 28, 30, 20] },
];
const STACK_COLORS = ['var(--c-red)', 'var(--c-yellow)', 'var(--c-teal)', 'var(--c-purple)'];

const StackedBars = () => (
  <div className="space-y-2.5">
    {STACK_ROWS.map((r, ri) => {
      const total = r.parts.reduce((a, b) => a + b, 0);
      return (
        <div key={r.label} className="grid grid-cols-[120px_1fr] gap-3 items-center">
          <div className="text-[11px] text-right truncate" style={{ color: 'var(--hex-ink-soft)' }}>{r.label}</div>
          <div className="flex h-5 rounded-sm overflow-hidden" style={{ border: '1px solid var(--hex-line)' }}>
            {r.parts.map((p, i) => (
              <div key={i} className="hex-bar-x" style={{
                width: `${(p / total) * 100}%`,
                background: STACK_COLORS[i],
                animationDelay: `${ri * 0.08 + i * 0.05}s`,
              }} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export const DashboardMock = () => {
  const [tab, setTab] = useState('Summary');
  const tabs = ['Summary', 'Responses', 'Drop-off', 'Segments'];
  return (
    <div className="hex-card overflow-hidden w-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium">Aqora · Onboarding Survey</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[11px] px-2.5 py-1 border hex-line-soft rounded" style={{ borderWidth: 1 }}>Edit</button>
          <button className="text-[11px] px-2.5 py-1 rounded text-white" style={{ background: 'var(--hex-ink)' }}>Share</button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-[20px] font-semibold tracking-tight">Onboarding Survey · Q3 Overview</h3>
        <p className="text-[12px] mt-1" style={{ color: 'var(--hex-ink-soft)' }}>
          Live breakdown of responses across product areas, segments, and time.
        </p>

        <div className="flex items-center gap-6 mt-4 border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
          {tabs.map((t) => (
            <div key={t} className={`hex-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { v: '1,284', l: 'Total responses', sub: '↑ 9.7% vs last week' },
            { v: '87%',   l: 'Completion rate', sub: '↑ 4.1% vs last week' },
            { v: '2:14',  l: 'Avg. time',       sub: '↓ 0:18 vs last week' },
          ].map((k) => (
            <div key={k.l} className="hex-kpi">
              <div className="text-[20px] font-semibold leading-none">{k.v}</div>
              <div className="text-[11px] mt-1.5" style={{ color: 'var(--hex-ink-soft)' }}>{k.l}</div>
              <div className="text-[9px] hex-mono mt-1" style={{ color: 'var(--c-teal)' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { l: 'Form',     v: 'All' },
            { l: 'Segment',  v: 'All' },
            { l: 'Source',   v: 'All' },
            { l: 'Quarter',  v: 'Q3' },
          ].map((f) => (
            <div key={f.l}>
              <div className="hex-select-label">{f.l}</div>
              <div className="hex-select">
                <span>{f.v}</span>
                <span style={{ color: 'var(--hex-ink-muted)' }}>▾</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 mt-5">
          <div>
            <div className="text-[12px] font-medium mb-1">Responses by form · Q1–Q3</div>
            <MultiLineChart />
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {SERIES.map((s) => (
                <span key={s.name} className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--hex-ink-soft)' }}>
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />{s.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-medium mb-1">Completion vs time-to-finish</div>
            <ScatterChart />
            <div className="flex gap-3 mt-2">
              {['Mobile', 'Desktop', 'Embed'].map((g, i) => (
                <span key={g} className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--hex-ink-soft)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: ['var(--c-purple)', 'var(--c-teal)', 'var(--c-yellow)'][i] }} />{g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[12px] font-medium mb-2">Sentiment by question</div>
          <StackedBars />
          <div className="flex gap-3 mt-2">
            {['Loved it', 'Neutral', 'Friction', 'Confused'].map((g, i) => (
              <span key={g} className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--hex-ink-soft)' }}>
                <span className="w-2 h-2 rounded-sm" style={{ background: STACK_COLORS[i] }} />{g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormBuilderMock = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="hex-card overflow-hidden w-full max-w-[560px] min-h-[480px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b hex-line-soft bg-[#fafaf7]" style={{ borderBottomWidth: 1 }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
          </div>
          <span className="hex-mono text-[11px] opacity-60" style={{ color: 'var(--hex-ink-muted)' }}>aqora.app/builder</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hex-mono text-[10px] opacity-40">Draft</span>
          <span className="hex-mono text-[10px]" style={{ color: 'var(--hex-ink-muted)' }}>autosaved · 2s ago</span>
        </div>
      </div>
      <div className="grid grid-cols-[160px_1fr] flex-grow">
        <aside className="border-r hex-line-soft p-4 text-[11px] space-y-1" style={{ borderRightWidth: 1, color: 'var(--hex-ink-soft)', background: '#fafaf7' }}>
          <div className="text-[9px] uppercase tracking-wider opacity-40 mb-3 hex-mono font-bold">Content Blocks</div>
          {['Short text','Long text','Multiple choice','Rating','NPS','Email','Date','File upload'].map((b,i)=>(
            <div key={i} onMouseEnter={() => setActive(i)}
                 className={`px-2.5 py-2 rounded flex items-center gap-2.5 cursor-pointer transition-all ${active === i ? 'bg-black/5 text-black' : 'opacity-60'}`}>
              <div className="w-4 h-4 border hex-line-strong rounded-sm flex items-center justify-center bg-white">
                <div className="w-1.5 h-1.5 bg-black/10 rounded-full" />
              </div>
              {b}
            </div>
          ))}
          <div className="pt-6">
            <div className="text-[9px] uppercase tracking-wider opacity-40 mb-3 hex-mono font-bold">Logic</div>
            <div className="px-2.5 py-2 rounded flex items-center gap-2.5 opacity-60 italic">Conditional jump</div>
          </div>
        </aside>
        <div className="p-8 space-y-8 flex-grow" style={{ background: '#fcfbf7' }}>
          <div className="group/q relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover/q:opacity-100 transition-opacity" />
            <div className="text-[10px] hex-mono opacity-50 mb-1.5">Q1 · Short text</div>
            <div className="text-[17px] font-semibold leading-tight tracking-tight">What's the biggest pain in your current workflow?</div>
            <div className="border hex-line-soft rounded-md px-4 py-3 mt-3 text-[13px] shadow-sm" style={{ borderWidth: 1, color: 'var(--hex-ink-muted)', background: '#fff' }}>Type your answer…</div>
          </div>
          
          <div className="hex-divider opacity-30" />
          
          <div className="group/q relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover/q:opacity-100 transition-opacity" />
            <div className="text-[10px] hex-mono opacity-50 mb-1.5">Q2 · Multiple choice</div>
            <div className="text-[17px] font-semibold leading-tight tracking-tight">How often does this friction occur?</div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {['Every single day','A few times per week','Only during month-end'].map((opt,i)=>(
                <div key={i} className={`flex items-center gap-3 border hex-line-soft rounded-lg px-4 py-2.5 text-[13px] transition-colors ${i===0?'bg-indigo-50/50 border-indigo-200/50':'bg-white'}`} style={{ borderWidth: 1 }}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i===0?'border-indigo-500 bg-indigo-500':'border-slate-200'}`}>
                    {i===0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={i===0 ? 'font-medium text-indigo-900' : ''}>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResponseFeedMock = () => (
  <div className="hex-card overflow-hidden w-full max-w-[420px]">
    <div className="px-4 py-2.5 border-b hex-line-soft flex items-center justify-between" style={{ borderBottomWidth: 1 }}>
      <div className="text-[12px] font-medium">Live responses</div>
      <div className="flex items-center gap-1.5 text-[10px] hex-mono" style={{ color: 'var(--hex-ink-muted)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> streaming
      </div>
    </div>
    <div className="divide-y hex-line-soft">
      {[
        { name:'Aman R.', ago:'just now', tag:'Daily', c:'var(--c-red)' },
        { name:'Priya M.', ago:'12s ago', tag:'Weekly', c:'var(--c-yellow)' },
        { name:'Jordan K.', ago:'48s ago', tag:'Daily', c:'var(--c-red)' },
        { name:'Sara L.', ago:'1m ago', tag:'Rarely', c:'var(--c-teal)' },
        { name:'Marc T.', ago:'2m ago', tag:'Weekly', c:'var(--c-yellow)' },
      ].map((r,i)=>(
        <div key={i} className="px-4 py-2.5 flex items-center justify-between text-[12px] hex-row-hover">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full text-[10px] font-medium flex items-center justify-center" style={{ background: '#eef0f5', color: 'var(--hex-ink)' }}>
              {r.name[0]}
            </span>
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="hex-mono text-[10px]" style={{ color: 'var(--hex-ink-muted)' }}>{r.ago}</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full hex-mono text-white" style={{ background: r.c }}>{r.tag}</span>
        </div>
      ))}
    </div>
    <div className="px-4 py-2 hex-mono text-[10px] flex justify-between" style={{ color: 'var(--hex-ink-muted)', background:'#fafaf7' }}>
      <span>5 of 1,284</span><span>response_id #f8a2…</span>
    </div>
  </div>
);

export const AIPromptMock = () => (
  <div className="hex-card overflow-hidden w-full max-w-[480px]">
    <div className="px-4 py-2.5 border-b hex-line-soft flex items-center gap-2" style={{ borderBottomWidth: 1 }}>
      <span className="text-[12px] font-medium">AI Forge</span>
      <span className="ml-auto hex-mono text-[10px]" style={{ color: 'var(--hex-ink-muted)' }}>gpt-4o · ready</span>
    </div>
    <div className="p-4 space-y-3">
      <div className="text-[12px] leading-relaxed p-3 rounded border hex-line-soft" style={{ borderWidth: 1, background:'#fafaf7' }}>
        <span className="hex-mono text-[10px] opacity-60">prompt ›</span><br />
        Build a 6-question post-purchase survey for a SaaS product. Include NPS, churn risk, and one open-ended question.
      </div>
      <div className="space-y-1.5">
        {[
          'Generated 6 questions',
          'Added NPS rating block',
          'Added conditional branch · low NPS → churn reason',
          'Set theme: minimal / light',
        ].map((s,i)=>(
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: 'var(--hex-ink)' }}>✓</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-1 text-[12px] py-2 rounded font-medium" style={{ background:'var(--hex-ink)', color:'#fff' }}>Open in builder →</button>
    </div>
  </div>
);

const Sparkline = ({ pts, color, h = 24 }: { pts: number[]; color: string; h?: number }) => {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const w = 80;
  const points = pts.map((v, i) => `${(i * w) / (pts.length - 1)},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ContextStudioMock = () => {
  return (
    <div className="hex-card overflow-hidden w-full max-w-[840px] bg-white relative">
      <div className="flex items-center justify-between px-4 py-2 border-b hex-line-soft bg-[#fafaf7]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="h-4 w-[1px] bg-black/10 mx-1" />
          <div className="flex items-center gap-2 text-[11px] font-medium opacity-80">
            <span className="opacity-40">Aqora /</span>
            <span>Project: Galactic Sales Survey</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded border hex-line-soft text-[10px] hex-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
          </div>
          <button className="bg-black text-white px-3 py-1 rounded text-[11px] font-medium">Publish</button>
        </div>
      </div>

      <div className="flex h-[540px]">
        <aside className="w-14 border-r hex-line-soft flex flex-col items-center py-4 gap-6 bg-[#fafaf7]">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white text-[18px]">R</div>
          <div className="flex flex-col gap-5 opacity-40">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-5 h-5 border-[1.5px] border-current rounded-sm" />
            ))}
          </div>
          <div className="mt-auto opacity-20">
            <div className="w-5 h-5 border-[1.5px] border-current rounded-full" />
          </div>
        </aside>

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b hex-line-soft flex items-center justify-between">
            <div className="flex gap-8 text-[12px] font-medium">
              <span className="text-black relative after:absolute after:-bottom-[13px] after:left-0 after:right-0 after:h-[2px] after:bg-black">Logic Workspace</span>
              <span className="opacity-40">Data Schema</span>
              <span className="opacity-40">Visualizer</span>
            </div>
            <div className="text-[11px] opacity-40 hex-mono">Last edit: 2m ago</div>
          </div>

          <div className="p-6 flex-grow overflow-hidden flex flex-col">
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { l: 'Conversations', v: '1,429', pts: [10, 15, 12, 18, 22, 19, 25], c: 'var(--c-purple)' },
                { l: 'Conversion', v: '12.4%', pts: [30, 28, 35, 32, 40, 38, 42], c: 'var(--c-teal)' },
                { l: 'Drop-off', v: '4.1%', pts: [12, 10, 11, 9, 8, 7, 5], c: 'var(--c-red)' },
              ].map(k => (
                <div key={k.l} className="flex flex-col gap-1">
                  <div className="text-[11px] opacity-40 hex-mono uppercase tracking-wider">{k.l}</div>
                  <div className="flex items-end justify-between">
                    <span className="text-[24px] font-semibold leading-none">{k.v}</span>
                    <Sparkline pts={k.pts} color={k.c} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-grow flex border hex-line-soft rounded-lg overflow-hidden bg-[#fcfcf9] shadow-sm">
              <div className="w-48 border-r hex-line-soft bg-[#fafaf7] p-3">
                <div className="text-[10px] hex-mono opacity-40 mb-3">FILE SYSTEM</div>
                <div className="space-y-1">
                  {['form_logic.yml', 'user_flow.sql', 'theme_config.json', 'api_hooks.js'].map((f, i) => (
                    <div key={f} className={`px-2 py-1.5 rounded text-[11px] flex items-center gap-2 ${i === 0 ? 'bg-black/5 font-medium' : 'opacity-60'}`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? 'var(--c-purple)' : 'var(--hex-line-strong)' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-grow p-4 relative">
                <div className="text-[12px] font-mono leading-relaxed">
                  <div className="text-purple-600">model:</div> <span className="text-slate-900">galactic_sales</span><br/>
                  <div className="text-purple-600 mt-2">source:</div><br/>
                  <div className="pl-4">
                    <span className="text-blue-600">table:</span> <span className="text-slate-600">revenue_stream</span><br/>
                    <span className="text-blue-600">primary_key:</span> <span className="text-slate-600">transaction_id</span>
                  </div>
                  <div className="text-purple-600 mt-2">logic:</div><br/>
                  <div className="pl-4">
                    <span className="text-blue-600">- question:</span> <span className="text-green-600">"How did you find us?"</span><br/>
                    <span className="text-blue-600">  type:</span> <span className="text-slate-600">multiple_choice</span><br/>
                    <span className="text-blue-600">  branch:</span><br/>
                    <span className="pl-4">
                      <span className="text-blue-600">if:</span> <span className="text-slate-600">"Social Media"</span><br/>
                      <span className="text-blue-600">then:</span> <span className="text-slate-600">ask_platform</span>
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 w-48 bg-white border hex-line-strong rounded shadow-xl p-3 animate-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold hex-mono">ACTIVE_BRANCH</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                    <div className="flex justify-between items-center mt-2 pt-2 border-t hex-line-soft">
                      <span className="text-[9px] opacity-40">Success rate</span>
                      <span className="text-[9px] font-bold">98.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIStudioMock = () => {
  return (
    <div className="hex-card overflow-hidden w-full max-w-[840px] bg-white relative">
      <div className="flex items-center justify-between px-4 py-2 border-b hex-line-soft bg-[#fafaf7]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="h-4 w-[1px] bg-black/10 mx-1" />
          <div className="flex items-center gap-2 text-[11px] font-medium opacity-80">
            <span className="opacity-40">Aqora /</span>
            <span>AI Agent: Feedback Analyzer</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-black text-white text-[10px] hex-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> gpt-4o
          </div>
        </div>
      </div>

      <div className="flex h-[540px]">

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b hex-line-soft flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
             <div>
               <h4 className="text-[16px] font-semibold">Agent Workflow: Survey Builder</h4>
               <div className="text-[11px] opacity-40 hex-mono mt-0.5 flex items-center gap-2">
                 <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                 Prompt Engineering & Logical Orchestration
               </div>
             </div>
             <div className="flex gap-2">
               <div className="px-3 py-1 rounded-full border hex-line-soft text-[10px] font-medium bg-[#fcfcf9]">Temperature: 0.7</div>
               <div className="px-3 py-1 rounded-full border hex-line-soft text-[10px] font-medium bg-[#fcfcf9]">Top-p: 1.0</div>
             </div>
          </div>

          <div className="p-6 flex-grow flex gap-6 overflow-hidden">
            <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { s: 'Analyzing objectives', t: 'Identified core KPI: Net Promoter Score (NPS)', d: '14ms' },
                { s: 'Structuring questions', t: 'Synthesized 6-question flow with conditional branching', d: '82ms' },
                { s: 'Validating accessibility', t: 'WCAG 2.1 compliance check passed (AA)', d: '45ms' },
                { s: 'Generating CSS tokens', t: 'Theme: "Aqora Dark" applied via design tokens', d: '22ms' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-indigo-500 bg-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    {i < 3 && <div className="w-[2px] flex-grow bg-slate-100 my-1" />}
                  </div>
                  <div className="flex-grow pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold hex-mono text-indigo-600 uppercase">{step.s}</span>
                      <span className="text-[10px] opacity-30 hex-mono">{step.d}</span>
                    </div>
                    <div className="text-[13px] font-medium text-slate-800">{step.t}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-80 flex flex-col gap-4">
              <div className="flex-grow border hex-line-soft rounded-lg bg-[#fafaf7] p-4 relative overflow-hidden">
                <div className="text-[10px] hex-mono opacity-40 mb-4 uppercase">Chain of Thought Visualizer</div>

                <div className="relative h-40 w-full">
                  <svg className="w-full h-full" viewBox="0 0 200 120">
                    <circle cx="100" cy="60" r="30" fill="none" stroke="var(--c-purple)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" style={{ transformOrigin: 'center' }} />
                    <circle cx="100" cy="60" r="15" fill="var(--c-purple)" opacity="0.1" />
                    <line x1="100" y1="60" x2="40" y2="30" stroke="var(--c-purple)" strokeWidth="1" opacity="0.3" />
                    <line x1="100" y1="60" x2="160" y2="30" stroke="var(--c-purple)" strokeWidth="1" opacity="0.3" />
                    <line x1="100" y1="60" x2="100" y2="100" stroke="var(--c-purple)" strokeWidth="1" opacity="0.3" />
                    <circle cx="40" cy="30" r="4" fill="var(--c-purple)" />
                    <circle cx="160" cy="30" r="4" fill="var(--c-teal)" />
                    <circle cx="100" cy="100" r="4" fill="var(--c-yellow)" />
                  </svg>
                </div>

                <div className="mt-4 p-3 rounded bg-white border hex-line-soft shadow-sm">
                  <div className="text-[11px] font-semibold mb-1 italic">Generated prompt extension:</div>
                  <div className="text-[10px] text-slate-500 leading-snug">"Ensure the NPS scale is presented in a horizontal row to minimize vertical scroll..."</div>
                </div>
              </div>
              
              <div className="h-24 border hex-line-soft rounded-lg bg-black p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between">
                   <div className="text-[9px] text-indigo-400 hex-mono uppercase tracking-widest">Latency Spectrum</div>
                   <div className="text-[10px] text-white hex-mono">1.2s</div>
                </div>
                <div className="flex items-end gap-[2px] h-8">
                  {[4,7,3,9,12,6,8,15,5,10,13,7,4,9,11].map((h, i) => (
                    <div key={i} className="flex-grow bg-indigo-500/40 rounded-t-[1px]" style={{ height: `${h*4}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsMock = DashboardMock;

export const CanvasEditorMock = () => {
  const [tab, setTab] = useState('Build');
  const tabs = ['Build', 'Logic', 'Design', 'Settings'];
  return (
    <div className="hex-card overflow-hidden w-full max-w-[1180px] mx-auto min-w-0 group/canvas shadow-[0_32px_64px_-16px_rgba(26,29,41,0.1)] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(26,29,41,0.2)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium">Aqora · Customer Feedback Form</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[11px] px-2.5 py-1 border hex-line-soft rounded cursor-pointer hover:bg-slate-50 transition-colors" style={{ borderWidth: 1 }}>Preview</button>
          <button className="text-[11px] px-2.5 py-1 rounded text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ background: 'var(--hex-ink)' }}>Publish</button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-[20px] font-semibold tracking-tight">Form Builder · Interactive Canvas</h3>
        <p className="text-[12px] mt-1" style={{ color: 'var(--hex-ink-soft)' }}>
          Drag and drop blocks, configure conditional logic, and set up integrations.
        </p>

        <div className="flex items-center gap-6 mt-4 border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
          {tabs.map((t) => (
            <div key={t} className={`hex-tab cursor-pointer ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { v: '12', l: 'Total Blocks', sub: '3 pages configured' },
            { v: '4',   l: 'Logic Rules', sub: '2 conditional jumps' },
            { v: '2m',  l: 'Est. Time',       sub: 'Average completion' },
          ].map((k) => (
            <div key={k.l} className="hex-kpi">
              <div className="text-[20px] font-semibold leading-none">{k.v}</div>
              <div className="text-[11px] mt-1.5" style={{ color: 'var(--hex-ink-soft)' }}>{k.l}</div>
              <div className="text-[9px] hex-mono mt-1" style={{ color: 'var(--c-purple)' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 border hex-line-soft rounded-lg bg-[#fcfbf7] h-[420px] relative overflow-hidden flex shadow-sm min-h-0">
          <div
            className="absolute inset-0 opacity-[0.03] hex-grid-fine pointer-events-none"
            style={{ backgroundSize: '24px 24px' }}
          />

          <div className="w-14 shrink-0 border-r hex-line-soft flex flex-col items-center py-4 gap-3 bg-[#fafaf7] z-10">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className={`w-8 h-8 rounded border hex-line-soft shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer ${i === 2 ? 'bg-black text-white shadow-lg' : 'bg-white opacity-60 hover:opacity-100'}`}>
                  {i === 1 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>}
                  {i === 2 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>}
                  {i === 3 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
                  {i === 4 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
                  {i === 5 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.5 1.5"/><path d="M14 11l7 7"/></svg>}
               </div>
             ))}
          </div>

          <div className="flex-1 min-w-0 relative flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar px-6 py-6 pt-7">
             <div className="w-full max-w-[560px] mx-auto space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl border hex-line-soft bg-white/90 shadow-sm relative group/block backdrop-blur-sm cursor-pointer hover:border-indigo-200 transition-colors"
                >
                   <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-white text-[9px] font-bold hex-mono shadow-md">
                      01
                   </div>
                   <div className="text-[11px] font-bold opacity-30 hex-mono mb-1.5 uppercase tracking-widest">NPS Selection</div>
                   <div className="text-[13px] font-semibold mb-3 text-slate-800">How likely are you to recommend Aqora?</div>
                   <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="flex-grow h-8 rounded border hex-line-soft flex items-center justify-center text-[10px] font-medium opacity-60 hover:opacity-100 hover:bg-indigo-50 transition-all cursor-pointer">
                          {n}
                        </div>
                      ))}
                   </div>
                </motion.div>

                <div className="h-6 ml-5 w-[1.5px] bg-indigo-500/20 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 rounded-xl border-2 border-indigo-500 bg-white shadow-md relative z-10 cursor-pointer"
                >
                   <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[9px] font-bold hex-mono shadow-md">
                      02
                   </div>
                   <div className="flex justify-between items-start mb-1.5">
                      <div className="text-[11px] font-bold text-indigo-600 hex-mono uppercase tracking-widest">Logic: Branching</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                   </div>
                   <div className="text-[13px] font-semibold mb-3 text-slate-900">What is the primary reason for your score?</div>
                   <div className="h-16 rounded border hex-line-soft bg-slate-50/50 p-2 text-[11px] text-slate-400 font-medium">
                      Type your reason here...
                   </div>
                </motion.div>
             </div>
            </div>
          </div>

          <div className="w-[272px] shrink-0 border-l hex-line-soft bg-white/95 backdrop-blur-sm z-10 flex flex-col min-h-0 min-w-0 transform transition-transform duration-500 shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
             <div className="p-3.5 shrink-0 border-b hex-line-soft bg-[#fafaf7] flex items-center justify-between">
                <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 hex-mono">Properties</div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
             </div>
             <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-5">
                <div className="space-y-1.5">
                   <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 hex-mono">Component ID</div>
                   <div className="h-8 rounded border hex-line-soft flex items-center px-2.5 text-[10px] font-mono bg-white shadow-sm">q_reason_text</div>
                </div>
                
                <div className="space-y-2.5">
                   <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 hex-mono">Conditions</div>
                   <div className="space-y-1.5">
                     {[
                       { q: 'Score < 7', then: 'Show Reason' },
                       { q: 'Score > 8', then: 'Show Success' },
                     ].map((rule, i) => (
                       <div key={i} className="p-2.5 rounded bg-indigo-50/40 border border-indigo-100/50 text-[10px] leading-snug">
                         <span className="opacity-50 font-bold">IF</span> <span className="font-bold text-indigo-900">{rule.q}</span><br/>
                         <span className="opacity-50 font-bold">THEN</span> <span className="font-bold text-indigo-900">{rule.then}</span>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
             <div className="p-4 shrink-0 border-t hex-line-soft bg-[#fafaf7]">
                <button className="w-full py-2 rounded bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-black transition-colors cursor-pointer">
                   Apply Logic
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};