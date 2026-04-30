import { useState } from 'react';

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
      {/* lines */}
      {SERIES.map((s) => {
        const d = s.pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${yFor(v)}`).join(' ');
        const dim = hover && hover !== s.name;
        return (
          <g key={s.name}
             onMouseEnter={() => setHover(s.name)}
             onMouseLeave={() => setHover(null)}
             style={{ transition: 'opacity .2s', opacity: dim ? 0.18 : 1, cursor: 'pointer' }}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className="hex-line-path" style={{ ['--len' as any]: 600 }} />
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
          <span className="text-[12px] font-medium">Revox · Onboarding Survey</span>
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
    <div className="hex-card overflow-hidden w-full max-w-[560px]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e5746a' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e8c547' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#79c879' }} />
          <span className="hex-mono text-[11px] ml-3" style={{ color: 'var(--hex-ink-muted)' }}>revox.app/builder</span>
        </div>
        <span className="hex-mono text-[10px]" style={{ color: 'var(--hex-ink-muted)' }}>autosaved · 2s ago</span>
      </div>
      <div className="grid grid-cols-[150px_1fr]">
        <aside className="border-r hex-line-soft p-3 text-[11px] space-y-1" style={{ borderRightWidth: 1, color: 'var(--hex-ink-soft)', background: '#fafaf7' }}>
          <div className="text-[9px] uppercase tracking-wider opacity-60 mb-1.5 hex-mono">Blocks</div>
          {['Short text','Long text','Multiple choice','Rating','NPS','Email','Date','File upload'].map((b,i)=>(
            <div key={i} onMouseEnter={() => setActive(i)}
                 className="px-2 py-1.5 rounded flex items-center gap-2 hex-row-hover cursor-pointer"
                 style={{ background: active === i ? 'rgba(26,29,41,0.06)' : 'transparent' }}>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />{b}
            </div>
          ))}
        </aside>
        <div className="p-5 space-y-4" style={{ background: '#fcfbf7' }}>
          <div>
            <div className="text-[10px] hex-mono opacity-50 mb-1">Q1 · Short text</div>
            <div className="text-[15px] font-medium leading-tight">What's the biggest pain in your workflow?</div>
            <div className="border hex-line-soft rounded px-3 py-2 mt-2 text-[12px]" style={{ borderWidth: 1, color: 'var(--hex-ink-muted)', background: '#fff' }}>Type your answer…</div>
          </div>
          <div className="hex-divider opacity-50" />
          <div>
            <div className="text-[10px] hex-mono opacity-50 mb-1">Q2 · Multiple choice</div>
            <div className="text-[15px] font-medium leading-tight">How often does it slow you down?</div>
            <div className="space-y-1.5 mt-2">
              {['Daily','A few times a week','Rarely'].map((opt,i)=>(
                <div key={i} className="flex items-center gap-2 border hex-line-soft rounded px-3 py-1.5 text-[12px]" style={{ borderWidth: 1, background: i===0?'#f0f4ff':'#fff' }}>
                  <span className="w-3 h-3 rounded-full border" style={{ borderWidth: 1, borderColor: 'var(--hex-line-strong)', background: i===0?'var(--c-blue)':'transparent' }} />
                  {opt}
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
            <span className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: 'var(--c-teal)' }}>✓</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-1 text-[12px] py-2 rounded font-medium" style={{ background:'var(--hex-ink)', color:'#fff' }}>Open in builder →</button>
    </div>
  </div>
);

export const AnalyticsMock = DashboardMock;