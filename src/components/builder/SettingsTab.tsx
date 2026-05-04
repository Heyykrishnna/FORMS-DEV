import { useState } from 'react';
import { FormData, FormTheme, THEME_LABELS, RESPONSE_THEME_LABELS } from '@/types/form';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Palette, 
  Lock, 
  Send, 
  Search, 
  Layout, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Type,
  MousePointer2,
  BarChart3,
  Share2,
  Users,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Globe,
  FileCheck,
  RefreshCw,
  Calendar,
  History,
  Unlock,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import AgentAvatar from '@/components/ui/smoothui/agent-avatar';
import { toast } from 'sonner';

interface Props {
  form: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

const THEME_PREVIEWS: Record<FormTheme, { bg: string; fg: string; accent: string }> = {
  brutalist_dark: { bg: 'bg-[#000]', fg: 'text-[#fff]', accent: 'bg-[#FF4500]' },
  clean_light: { bg: 'bg-[#fafafa]', fg: 'text-[#111]', accent: 'bg-[#111]' },
  neon_industrial: { bg: 'bg-[#0a0f1a]', fg: 'text-[#00ff41]', accent: 'bg-[#00ff41]' },
  monochrome: { bg: 'bg-[#f0f0f0]', fg: 'text-[#333]', accent: 'bg-[#333]' },
  warm_terminal: { bg: 'bg-[#1a1208]', fg: 'text-[#e6a030]', accent: 'bg-[#e6a030]' },
  cyber_toxic: { bg: 'bg-[#ffff00]', fg: 'text-[#000]', accent: 'bg-[#ff00ff]' },
  retro_paper: { bg: 'bg-[#f4f1ea]', fg: 'text-[#2c2c2c]', accent: 'bg-[#8b4513]' },
  midnight_vampire: { bg: 'bg-[#0a0000]', fg: 'text-[#ff0000]', accent: 'bg-[#ffd700]' },
  deep_ocean: { bg: 'bg-[#001f3f]', fg: 'text-[#7fdbff]', accent: 'bg-[#39cccc]' },
  royal_gold: { bg: 'bg-black', fg: 'text-[#d4af37]', accent: 'bg-[#d4af37]' },
  toxic_mint: { bg: 'bg-[#000]', fg: 'text-[#00ff88]', accent: 'bg-[#00ff88]' },
  cyberpunk_pink: { bg: 'bg-[#1a001a]', fg: 'text-[#ff00ff]', accent: 'bg-[#ff00ff]' },
  glassmorphism: { bg: 'bg-[#1a1a1a]', fg: 'text-[#fff]', accent: 'bg-white' },
  desert_oasis: { bg: 'bg-[#faf9f6]', fg: 'text-[#8b4513]', accent: 'bg-[#d2b48c]' },
  forest_night: { bg: 'bg-[#1b3022]', fg: 'text-[#f0f7f4]', accent: 'bg-[#4f7942]' },
  electric_violet: { bg: 'bg-[#1a0033]', fg: 'text-[#cc99ff]', accent: 'bg-[#cc99ff]' },
  solar_flare: { bg: 'bg-[#330000]', fg: 'text-[#ffcc00]', accent: 'bg-[#ff3300]' },
  frost_byte: { bg: 'bg-[#e6f7ff]', fg: 'text-[#006699]', accent: 'bg-[#006699]' },
  nordic_pine: { bg: 'bg-[#0d1a1a]', fg: 'text-[#d9e6e6]', accent: 'bg-[#4d8080]' },
  sunset_mirage: { bg: 'bg-[#ff512f]', fg: 'text-white', accent: 'bg-white' },
  onyx_stealth: { bg: 'bg-[#121212]', fg: 'text-[#e0e0e0]', accent: 'bg-red-600' },
  lavender_mist: { bg: 'bg-[#f3f0ff]', fg: 'text-[#5b21b6]', accent: 'bg-[#5b21b6]' },
  emerald_matrix: { bg: 'bg-[#001a0a]', fg: 'text-[#00ff66]', accent: 'bg-[#00ff66]' },
  crimson_tide: { bg: 'bg-[#4a0404]', fg: 'text-[#ffd1d1]', accent: 'bg-[#ffd1d1]' },
  golden_hour: { bg: 'bg-[#fffbeb]', fg: 'text-[#92400e]', accent: 'bg-[#f59e0b]' },
};

type TabId = 'general' | 'appearance' | 'access' | 'submission' | 'analysis' | 'seo' | 'team';

const SettingsTab = ({ form, onUpdate }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [appearanceSection, setAppearanceSection] = useState<'colors' | 'typography' | 'images' | null>(null);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'access', label: 'Access', icon: Lock },
    { id: 'submission', label: 'Submission', icon: Send },
    { id: 'analysis', label: 'Intelligence', icon: BarChart3 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'team', label: 'Team & Security', icon: Users },
  ] as const;

  const calculateSecurityStrength = () => {
    let strength = 0;
    if (form.collaborationPassword) strength += 30;
    if (form.linkExpirationDate) strength += 20;
    if (form.restrictedDomain) strength += 20;
    if ((form.collaborators || []).length > 0) strength += 10;
    if (form.linkRotationSalt) strength += 20;
    return strength;
  };

  const addSecurityLog = (action: string) => {
    const newLog = {
      action,
      timestamp: new Date().toISOString(),
    };
    onUpdate({ securityLogs: [newLog, ...(form.securityLogs || []).slice(0, 19)] });
  };

  const securityStrength = calculateSecurityStrength();

  return (
    <div className="min-h-full font-sans bg-background text-foreground pb-20">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-4">Settings</h2>
          <p className="text-muted-foreground text-sm max-w-2xl font-light">
            Manage your form's configuration, appearance, security protocols, and discovery optimization from one centralized control center.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-16">
          
          <div className="w-full lg:w-48 flex-shrink-0 sticky top-40">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-2 py-1.5 text-sm font-medium transition-all group relative ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full hidden lg:block" />
                    )}
                    <tab.icon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-transparent min-h-[600px]">

            {activeTab === 'general' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Identity</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Define how your form is identified and presented to your audience.</p>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Form Title</label>
                      <input
                        value={form.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="w-full bg-background/50 text-sm px-0 py-2 border-b border-border rounded-none outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
                        placeholder="e.g. Q1 Customer Feedback"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="w-full bg-background/50 text-sm px-0 py-2 border-b border-border rounded-none outline-none resize-none min-h-[40px] focus:border-primary transition-all placeholder:text-muted-foreground/30"
                        placeholder="Briefly explain the purpose of this form..."
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Form Type</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Choose whether this form collects responses only or grades answers as a quiz.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: 'normal',
                          title: 'Normal Form',
                          description: 'Collect responses without scoring or correct answers.',
                          icon: FileCheck,
                        },
                        {
                          id: 'quiz',
                          title: 'Quiz Based',
                          description: 'Add marks and correct answers to every scored question.',
                          icon: Trophy,
                        },
                      ].map((mode) => {
                        const isSelected = mode.id === 'quiz' ? form.isQuiz : !form.isQuiz;
                        const Icon = mode.icon;

                        return (
                          <button
                            key={mode.id}
                            onClick={() => onUpdate({
                              isQuiz: mode.id === 'quiz',
                              showQuizResultsToUsers: mode.id === 'quiz' ? form.showQuizResultsToUsers : false,
                            })}
                            className={`flex items-start gap-4 p-5 rounded-none border transition-all ${
                              isSelected
                                ? 'bg-primary/5 border-primary shadow-[0_0_20px_-10px_rgba(49,91,232,0.3)]'
                                : 'border-border bg-background/50 hover:border-border/80'
                            }`}
                          >
                            <div className={`mt-0.5 w-9 h-9 border flex items-center justify-center ${
                              isSelected ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div className="text-left">
                              <span className={`text-sm font-bold block mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {mode.title}
                              </span>
                              <span className="text-[11px] text-muted-foreground leading-snug">
                                {mode.description}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {form.isQuiz && (
                      <div className="flex items-center justify-between py-5 px-5 border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <p className="text-sm font-bold text-primary">Show Quiz Results</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Let respondents see score, points, and answer breakdown after submission</p>
                        </div>
                        <Switch
                          checked={form.showQuizResultsToUsers || false}
                          onCheckedChange={(v) => onUpdate({ showQuizResultsToUsers: v })}
                        />
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Structure</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Configure the physical layout and navigation experience of the form.</p>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Navigation Flow</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['single_page', 'notebook'] as const).map((layout) => (
                          <button
                            key={layout}
                            onClick={() => onUpdate({ layout })}
                            className={`flex items-start gap-4 p-5 rounded-none border transition-all ${
                              form.layout === layout 
                                ? 'bg-primary/5 border-primary shadow-[0_0_20px_-10px_rgba(49,91,232,0.3)]' 
                                : 'border-border bg-background/50 hover:border-border/80'
                            }`}
                          >
                            <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.layout === layout ? 'border-primary' : 'border-muted-foreground/30'}`}>
                              {form.layout === layout && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </div>
                            <div className="text-left">
                              <span className={`text-sm font-bold block mb-1 ${form.layout === layout ? 'text-primary' : 'text-foreground'}`}>
                                {layout === 'single_page' ? 'Standard Scroll' : 'Focused Flow'}
                              </span>
                              <span className="text-[11px] text-muted-foreground leading-snug">
                                {layout === 'single_page' ? 'All questions on a single scrollable page' : 'One question at a time for maximum focus'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-6 border-y border-border/50">
                      <div>
                        <p className="text-sm font-bold">Progress Indicator</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Show respondents how far they are in the process</p>
                      </div>
                      <Switch 
                        checked={form.showProgressBar} 
                        onCheckedChange={(v) => onUpdate({ showProgressBar: v })} 
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-10 animate-in fade-in duration-500">

                <div className="pt-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Customize</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(['colors', 'typography', 'images'] as const).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setAppearanceSection(appearanceSection === sec ? null : sec)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                          appearanceSection === sec
                            ? 'bg-primary text-white border-primary shadow-[0_0_12px_-2px_rgba(49,91,232,0.4)]'
                            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {sec === 'colors' ? 'Colors' : sec === 'typography' ? 'Typography' : 'Images'}
                      </button>
                    ))}
                  </div>


                  {appearanceSection === 'colors' && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-8 p-6 rounded-xl border border-border/60 bg-secondary/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Accent / Brand</label>
                          <div className="flex items-center gap-3">
                            <label
                              className="w-11 h-11 rounded-lg border-2 border-border shadow cursor-pointer shrink-0 hover:scale-105 transition-transform"
                              style={{ backgroundColor: form.style.customAccentColor || '#315be8' }}
                            >
                              <input type="color" value={form.style.customAccentColor || '#315be8'}
                                onChange={(e) => onUpdate({ style: { ...form.style, customAccentColor: e.target.value } })}
                                className="sr-only" />
                            </label>
                            <div>
                              <p className="text-xs font-semibold">{form.style.customAccentColor || '#315be8'}</p>
                              <p className="text-[10px] text-muted-foreground">Buttons & highlights</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Background</label>
                          <div className="flex items-center gap-3">
                            <label
                              className="w-11 h-11 rounded-lg border-2 border-border shadow cursor-pointer shrink-0 hover:scale-105 transition-transform"
                              style={{ backgroundColor: form.style.backgroundColor || '#ffffff' }}
                            >
                              <input type="color" value={form.style.backgroundColor || '#ffffff'}
                                onChange={(e) => onUpdate({ style: { ...form.style, backgroundColor: e.target.value } })}
                                className="sr-only" />
                            </label>
                            <div>
                              <p className="text-xs font-semibold">{form.style.backgroundColor || '#ffffff'}</p>
                              <p className="text-[10px] text-muted-foreground">Page background fill</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Font Color</label>
                          <div className="flex items-center gap-3">
                            <label
                              className="w-11 h-11 rounded-lg border-2 border-border shadow cursor-pointer shrink-0 hover:scale-105 transition-transform"
                              style={{ backgroundColor: (form.style as any).fontColor || '#111111' }}
                            >
                              <input type="color" value={(form.style as any).fontColor || '#111111'}
                                onChange={(e) => onUpdate({ style: { ...form.style, fontColor: e.target.value } as any })}
                                className="sr-only" />
                            </label>
                            <div>
                              <p className="text-xs font-semibold">{(form.style as any).fontColor || '#111111'}</p>
                              <p className="text-[10px] text-muted-foreground">Primary text color</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Edge Roundness</label>
                            <span className="text-xs font-mono font-bold">{form.style.borderRadius || 0}px</span>
                          </div>
                          <Slider value={[form.style.borderRadius || 0]} max={40} step={1}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, borderRadius: v } })} />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Surface Opacity</label>
                            <span className="text-xs font-mono font-bold">{form.style.cardOpacity || 100}%</span>
                          </div>
                          <Slider value={[form.style.cardOpacity || 100]} max={100} step={5}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, cardOpacity: v } })} />
                        </div>
                      </div>
                    </div>
                  )}


                  {appearanceSection === 'typography' && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-8 p-6 rounded-xl border border-border/60 bg-secondary/20">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground block mb-4">Font Family</label>
                        <div className="grid grid-cols-3 gap-3">
                          {([['mono', 'Monospace', 'Code-like precision'], ['sans', 'Sans-Serif', 'Clean and modern'], ['serif', 'Serif', 'Classic and editorial']] as const).map(([font, label, desc]) => (
                            <button key={font}
                              onClick={() => onUpdate({ style: { ...form.style, fontFamily: font } })}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                form.style.fontFamily === font
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border/50 bg-background hover:border-border'
                              }`}>
                              <p className={`text-lg font-bold mb-1 ${
                                font === 'mono' ? 'font-mono' : font === 'serif' ? 'font-serif' : 'font-sans'
                              } ${form.style.fontFamily === font ? 'text-primary' : ''}`}>Aa</p>
                              <p className="text-xs font-semibold">{label}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border/40">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground block mb-4">Font Size</label>
                        <div className="flex gap-3">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button key={size}
                              onClick={() => onUpdate({ style: { ...form.style, fontSize: size } })}
                              className={`flex-1 py-2.5 rounded-lg border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                                form.style.fontSize === size
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-border text-muted-foreground hover:border-border/80'
                              }`}>{size}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}


                  {appearanceSection === 'images' && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                        <div className="space-y-6 p-6 rounded-xl border border-border/60 bg-secondary/20">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Banner Image URL</label>
                            <input
                              type="url"
                              value={form.style.bannerImageUrl || ''}
                              onChange={(e) => onUpdate({ style: { ...form.style, bannerImageUrl: e.target.value } })}
                              placeholder="https://..."
                              className="w-full bg-background px-3 py-2.5 border border-border rounded-lg outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono text-xs"
                            />
                            <p className="text-[10px] text-muted-foreground">Displayed at the top of the form as a hero banner.</p>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Background Image URL</label>
                            <input
                              type="url"
                              value={form.style.backgroundImageUrl || ''}
                              onChange={(e) => onUpdate({ style: { ...form.style, backgroundImageUrl: e.target.value } })}
                              placeholder="https://..."
                              className="w-full bg-background px-3 py-2.5 border border-border rounded-lg outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono text-xs"
                            />
                            <p className="text-[10px] text-muted-foreground">Full-page background image behind the form.</p>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Logo URL</label>
                            <input
                              type="url"
                              value={form.style.logoUrl || ''}
                              onChange={(e) => onUpdate({ style: { ...form.style, logoUrl: e.target.value } })}
                              placeholder="https://..."
                              className="w-full bg-background px-3 py-2.5 border border-border rounded-lg outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono text-xs"
                            />
                            <p className="text-[10px] text-muted-foreground">Brand logo shown above the form title.</p>
                          </div>
                          <div className="pt-4 border-t border-border/40 space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Background Pattern</label>
                            <div className="flex gap-2">
                              {(['none', 'grid', 'dots'] as const).map((p) => (
                                <button key={p}
                                  onClick={() => onUpdate({ style: { ...form.style, bgPattern: p } })}
                                  className={`flex-1 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                                    (form.style.bgPattern || 'none') === p
                                      ? 'bg-primary text-white border-primary'
                                      : 'border-border text-muted-foreground hover:border-border/70'
                                  }`}>{p}</button>
                              ))}
                            </div>
                          </div>
                        </div>


                        <div className="rounded-xl border border-border/60 overflow-hidden">
                          <div className="px-4 py-3 border-b border-border/40 bg-secondary/30 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[10px] font-mono text-muted-foreground ml-2">preview.form</span>
                          </div>
                          <div
                            className="relative min-h-[320px] overflow-hidden"
                            style={{
                              backgroundColor: form.style.backgroundColor || '#f9fafb',
                              backgroundImage: form.style.backgroundImageUrl
                                ? `url(${form.style.backgroundImageUrl})`
                                : form.style.bgPattern === 'dots'
                                  ? 'radial-gradient(circle, #00000018 1px, transparent 1px)'
                                  : form.style.bgPattern === 'grid'
                                    ? 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)'
                                    : 'none',
                              backgroundSize: form.style.backgroundImageUrl ? 'cover' : form.style.bgPattern === 'dots' ? '18px 18px' : '24px 24px',
                              backgroundPosition: 'center',
                            }}
                          >
                            {form.style.bannerImageUrl && (
                              <div className="w-full h-20 overflow-hidden">
                                <img src={form.style.bannerImageUrl} alt="banner" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="p-5">
                              {form.style.logoUrl && (
                                <img src={form.style.logoUrl} alt="logo" className="h-8 mb-3 object-contain" />
                              )}
                              <div
                                className="rounded-lg p-4 shadow-sm"
                                style={{
                                  backgroundColor: `rgba(255,255,255,${(form.style.cardOpacity ?? 100) / 100})`,
                                  borderRadius: `${form.style.borderRadius || 8}px`,
                                  color: (form.style as any).fontColor || '#111111',
                                  fontFamily: form.style.fontFamily === 'mono' ? 'monospace' : form.style.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                                }}
                              >
                                <p className="text-xs font-bold mb-1" style={{ color: form.style.customAccentColor || '#315be8' }}>Question 1</p>
                                <p className="text-sm font-semibold mb-3">{form.title || 'Untitled Form'}</p>
                                <div className="h-1.5 rounded-full mb-2" style={{ backgroundColor: `${form.style.customAccentColor || '#315be8'}30`, width: '100%' }}>
                                  <div className="h-full rounded-full w-1/3" style={{ backgroundColor: form.style.customAccentColor || '#315be8' }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Type your answer here...</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-10 border-t border-border/50">
                  <h3 className="text-xl font-semibold tracking-tight">Design System</h3>
                  <p className="text-sm text-muted-foreground mt-1.5">Apply a curated visual theme or fine-tune individual design tokens.</p>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {(Object.keys(THEME_LABELS) as FormTheme[]).map((theme) => {
                    const preview = THEME_PREVIEWS[theme];
                    const isSelected = form.theme === theme;
                    return (
                      <button
                        key={theme}
                        onClick={() => onUpdate({ theme })}
                        className={`group relative flex flex-col p-2.5 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary shadow-[0_0_18px_-4px_rgba(49,91,232,0.35)]'
                            : 'border-transparent bg-secondary/30 hover:border-border'
                        }`}
                      >
                        <div className={`aspect-[4/3] rounded-md mb-2.5 overflow-hidden border border-white/10 flex flex-col ${preview.bg}`}>
                          <div className="flex-1 p-2.5">
                            <div className={`text-[11px] font-black ${preview.fg}`}>Aa</div>
                            <div className={`h-1 w-10 rounded-full mt-1.5 ${preview.accent}`} />
                            <div className={`h-1 w-6 rounded-full mt-1 opacity-30 ${preview.accent}`} />
                          </div>
                          <div className={`h-4 ${preview.accent} opacity-20`} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest truncate text-left ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}>{THEME_LABELS[theme]}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <section>
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold tracking-tight">Access & Security</h3>
                    <p className="text-sm text-muted-foreground mt-2">Manage how users enter and interact with your workspace protocol.</p>
                  </div>

                  <div className="space-y-12">
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Entry Protocols</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-px bg-border/30 border border-border/50">
                        <div className="flex items-center justify-between p-6 bg-background">
                          <div className="space-y-1">
                            <p className="text-sm font-bold">Anonymous Submission</p>
                            <p className="text-[11px] text-muted-foreground">Allow data entry without identity verification</p>
                          </div>
                          <Switch 
                            checked={form.isAnonymous} 
                            onCheckedChange={(v) => onUpdate({ isAnonymous: v })} 
                          />
                        </div>

                        {!form.isAnonymous && (
                          <div className="flex items-center justify-between p-6 bg-background border-t border-border/10">
                            <div className="space-y-1">
                              <p className="text-sm font-bold">Identity Verification</p>
                              <p className="text-[11px] text-muted-foreground">Require validated name and email via protocol</p>
                            </div>
                            <Switch 
                              checked={form.requireRespondentData || false} 
                              onCheckedChange={(v) => onUpdate({ requireRespondentData: v })} 
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between p-6 bg-background border-t border-border/10">
                          <div className="space-y-1">
                            <p className="text-sm font-bold">Access Passphrase</p>
                            <p className="text-[11px] text-muted-foreground">Gate the entire form with a global password</p>
                          </div>
                          <div className="w-64">
                            <input
                              type="password"
                              value={form.password || ''}
                              onChange={(e) => onUpdate({ password: e.target.value })}
                              placeholder="••••••••"
                              className="w-full bg-transparent text-xs px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Organizational Control</h4>
                      </div>
                      
                      <div className="p-6 bg-background border border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-bold">Domain Restriction</p>
                            <p className="text-[11px] text-muted-foreground">Limit submission access to specific organizational domains</p>
                          </div>
                          <div className="w-64">
                            <input
                              type="text"
                              value={form.restrictedDomain || ''}
                              onChange={(e) => onUpdate({ restrictedDomain: e.target.value })}
                              placeholder="e.g. aqora.ai, google.com"
                              className="w-full bg-transparent text-xs px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Submission Governance</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-px bg-border/30 border border-border/50">
                        <div className="flex items-center justify-between p-6 bg-background">
                          <div className="space-y-1">
                            <p className="text-sm font-bold">Anti-Spam Protocol</p>
                            <p className="text-[11px] text-muted-foreground">Limit submissions to one per unique identifier</p>
                          </div>
                          <Switch 
                            checked={form.limitOneResponse || false} 
                            onCheckedChange={(v) => onUpdate({ limitOneResponse: v })} 
                          />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-background border-t border-border/10">
                          <div className="space-y-1">
                            <p className="text-sm font-bold">Collection Status</p>
                            <p className="text-[11px] text-muted-foreground">Toggle availability of the submission interface</p>
                          </div>
                          <Switch 
                            checked={form.acceptingResponses} 
                            onCheckedChange={(v) => onUpdate({ acceptingResponses: v })} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Hard Constraints</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/30 border border-border/50">
                        <div className="p-6 bg-background">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Total Submission Cap</label>
                          <div className="mt-4">
                            <input
                              type="number"
                              value={form.submissionLimit || ''}
                              onChange={(e) => onUpdate({ submissionLimit: parseInt(e.target.value) || undefined })}
                              placeholder="Unlimited"
                              className="w-full bg-transparent text-sm px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 italic">Automated closure upon reaching quota</p>
                          </div>
                        </div>
                        <div className="p-6 bg-background md:border-l md:border-border/10">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Protocol Expiration</label>
                          <div className="mt-4">
                            <input
                              type="date"
                              value={form.closeDate || ''}
                              onChange={(e) => onUpdate({ closeDate: e.target.value })}
                              className="w-full bg-transparent text-sm px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 italic">Form will be locked at midnight on this date</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'submission' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Post-Submission Protocol</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Define what happens after a successful data capture event.</p>
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Confirmation Terminal</label>
                      <textarea
                        value={form.confirmationMessage}
                        onChange={(e) => onUpdate({ confirmationMessage: e.target.value })}
                        className="w-full bg-background/50 text-sm px-0 py-2 border-b border-border rounded-none outline-none resize-none min-h-[60px] focus:border-primary transition-all placeholder:text-muted-foreground/30"
                        placeholder="e.g. Protocol complete. Data transmitted successfully."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Redirect Handover</label>
                        <input
                          value={form.redirectUrl || ''}
                          onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
                          placeholder="https:"
                          className="w-full bg-background/50 text-sm px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Submit Action Label</label>
                        <input
                          value={form.submitButtonText || 'Submit'}
                          onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
                          className="w-full bg-background/50 text-sm px-0 py-2 border-b border-border rounded-none outline-none font-bold focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Intelligence Engine</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Configure how the platform processes and visualizes your captured data.</p>
                  </div>
                  <div className="space-y-4">
                    {([
                      { 
                        id: 'normal', 
                        label: 'Standard Analytics', 
                        desc: 'Baseline charts and response matrices',
                        features: ['Dynamic Bar/Pie Charts', 'Response Density Heatmaps', 'Excel/CSV Matrix Exports', 'Basic Data Filtering']
                      },
                      { 
                        id: 'survey', 
                        label: 'Sentiment & Trends', 
                        desc: 'Emotional analysis and consensus detection',
                        features: ['NLP Sentiment Scoring', 'Word Cloud Visualization', 'Agreement Consensus Mapping', 'Topic Clustering']
                      },
                      { 
                        id: 'research', 
                        label: 'Statistical Core', 
                        desc: 'Standard deviation and distribution mapping',
                        features: ['Gaussian Distribution (Bell Curve)', 'Standard Deviation Analysis', 'Z-Score Normalization', 'Significance Testing']
                      },
                      { 
                        id: 'data_work', 
                        label: 'Raw Intelligence', 
                        desc: 'Structured JSON outputs and audit metrics',
                        features: ['Strict Schema Validation', 'Data Integrity Audit Logs', 'Real-time JSON/API Feeds', 'Quality Control Metrics']
                      }
                    ] as const).map((theme) => {
                      const isActive = form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal');
                      return (
                        <div key={theme.id} className="space-y-px">
                          <button
                            onClick={() => onUpdate({ responseTheme: theme.id })}
                            className={`w-full flex items-center justify-between p-6 border transition-all ${
                              isActive
                                ? 'border-primary bg-primary/[0.03] shadow-[0_0_20px_-5px_rgba(49,91,232,0.15)]'
                                : 'border-border bg-background/50 hover:border-border/80'
                            }`}
                          >
                            <div className="text-left">
                              <span className={`text-sm font-bold block mb-1 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {theme.label}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {theme.desc}
                              </span>
                            </div>
                            <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-primary scale-125' : 'bg-border'}`} />
                          </button>
                          
                          {isActive && (
                            <div className="p-8 border-x border-b border-primary/20 bg-primary/[0.01] animate-in slide-in-from-top-2 fade-in duration-500">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {theme.features.map((feature, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="w-1 h-1 bg-primary/40 rounded-full" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">{feature}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground font-medium italic">Active Protocol: {theme.label}</p>
                                <span className="text-[9px] font-mono text-primary/60 px-2 py-1 bg-primary/5">INTELLIGENCE_LAYER_V1</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">SEO & Indexing</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Optimize how your form workspace is discovered by search engines.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between py-4 border-b border-border/50">
                        <div>
                          <p className="text-sm font-bold">Public Indexing</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Allow search protocols to crawl this form</p>
                        </div>
                        <Switch 
                          checked={form.seoIndexable !== false} 
                          onCheckedChange={(v) => onUpdate({ seoIndexable: v })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Metadata Title</label>
                          <span className={`text-[10px] font-mono ${(form.seoTitle?.length || 0) > 60 ? 'text-red-500' : 'text-primary'}`}>
                            {form.seoTitle?.length || 0}/60
                          </span>
                        </div>
                        <input
                          value={form.seoTitle || ''}
                          onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                          placeholder={form.title}
                          className="w-full bg-transparent text-sm px-0 py-2 border-b border-border rounded-none outline-none focus:border-primary transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Description Meta</label>
                          <span className={`text-[10px] font-mono ${(form.seoDescription?.length || 0) > 160 ? 'text-red-500' : 'text-primary'}`}>
                            {form.seoDescription?.length || 0}/160
                          </span>
                        </div>
                        <textarea
                          value={form.seoDescription || ''}
                          onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                          placeholder={form.description}
                          className="w-full bg-transparent text-sm px-0 py-2 border-b border-border rounded-none outline-none resize-none min-h-[40px] focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Search Terminal Preview</label>
                        <div className="p-6 border border-border/50 bg-background/50 space-y-2">
                          <div className="text-[16px] text-[#1a0dab] font-medium truncate">
                            {form.seoTitle || form.title || 'Untitled Form'}
                          </div>
                          <div className="text-[13px] text-[#006621] truncate opacity-60">
                            {window.location.origin}/f/{form.id}
                          </div>
                          <div className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {form.seoDescription || form.description || 'Access the official data gathering portal on Aqora.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                
                <section>
                  <div className="flex items-end justify-between mb-10 pb-6 border-b border-border/50">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">Team & Governance</h3>
                      <p className="text-sm text-muted-foreground mt-2">Manage collaborator protocols and monitor security audit logs.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Seats</p>
                        <p className="text-xl font-mono">{(form.collaborators || []).length + 1}/10</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Security Tier</p>
                        <p className="text-xl font-mono text-primary">ELITE</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    <div className="lg:col-span-7 space-y-12">
                      
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Access Management</label>
                          <div className="flex gap-3">
                            <div className="flex-1 relative">
                              <input
                                id="collaborator-email"
                                type="email"
                                placeholder="colleague@aqora.ai"
                                className="w-full bg-transparent text-sm pl-0 pr-24 py-3 border-b border-border rounded-none outline-none focus:border-primary transition-all font-mono"
                              />
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <select className="bg-transparent text-[10px] font-bold uppercase border-none outline-none text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                                  <option>Editor</option>
                                  <option>Viewer</option>
                                </select>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const input = document.getElementById('collaborator-email') as HTMLInputElement;
                                const email = input?.value.trim();
                                if (email && email.includes('@')) {
                                  const current = form.collaborators || [];
                                  onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                  addSecurityLog(`Access granted: ${email}`);
                                  input.value = '';
                                  toast.success("Identity authorized");
                                }
                              }}
                              className="px-6 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                            >
                              Authorize
                            </button>
                          </div>
                        </div>

                        <div className="space-y-px border border-border/50 divide-y divide-border/30 bg-background/50">
                          <div className="flex items-center justify-between p-4 bg-secondary/10">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center overflow-hidden">
                                <AgentAvatar seed="admin" size={32} />
                              </div>
                              <div>
                                <p className="text-xs font-bold">Workspace Owner (You)</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Full Protocol Access</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-primary/60 bg-primary/5 px-2 py-1">ROOT_ACCESS</span>
                          </div>

                          {(form.collaborators || []).map((collab, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-background group hover:bg-secondary/5 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center overflow-hidden">
                                  <AgentAvatar seed={collab.email} size={32} />
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{collab.email}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{collab.role || 'Editor'}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const newCollabs = (form.collaborators || []).filter((_, i) => i !== index);
                                  onUpdate({ collaborators: newCollabs });
                                  addSecurityLog(`Access revoked: ${collab.email}`);
                                }}
                                className="text-[10px] font-bold uppercase text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:underline underline-offset-4"
                              >
                                Revoke Access
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Secure Access Protocol</label>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="p-8 border border-border/50 bg-background/50 space-y-6">
                            <div className="space-y-2">
                              <p className="text-[11px] font-bold uppercase tracking-wider">Dynamic Collaboration Link</p>
                              <p className="text-[11px] text-muted-foreground">This link grants high-level access based on the current rotation salt.</p>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1 p-4 bg-secondary/20 border border-border/50 font-mono text-[10px] break-all text-muted-foreground leading-relaxed">
                                {`${window.location.origin}/collab/${btoa(JSON.stringify({ 
                                  id: form.id, 
                                  s: form.linkRotationSalt || 'v1',
                                  e: form.linkExpirationDate || '0',
                                  p: form.collaborationPassword ? '1' : '0' 
                                }))}`}
                              </div>
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/collab/${btoa(JSON.stringify({ 
                                    id: form.id, 
                                    s: form.linkRotationSalt || 'v1', 
                                    e: form.linkExpirationDate || '0',
                                    p: form.collaborationPassword ? '1' : '0' 
                                  }))}`;
                                  navigator.clipboard.writeText(url);
                                  toast.success("Protocol link cached");
                                }}
                                className="p-4 border border-border/50 bg-background hover:bg-secondary/10 transition-all text-primary"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-border/20">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => {
                                    const newSalt = Math.random().toString(36).substring(2, 15);
                                    onUpdate({ linkRotationSalt: newSalt });
                                    addSecurityLog("Link rotation salt updated");
                                    toast.success("Access tokens rotated");
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:underline"
                                >
                                  <RefreshCw size={12} />
                                  Rotate Access Tokens
                                </button>
                                <div className="h-4 w-px bg-border/50" />
                                <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                  Configure TTL
                                </button>
                              </div>
                              <span className="text-[9px] font-mono text-muted-foreground/40">SALT: {form.linkRotationSalt || 'v1'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="space-y-8 h-full flex flex-col">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Security Ledger</label>
                        <div className="flex-1 p-8 border border-border/50 bg-secondary/[0.02] relative overflow-hidden">
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                          
                          <div className="relative space-y-8 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
                            {(form.securityLogs || []).length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <History className="w-8 h-8 text-muted-foreground/20" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">No records found</p>
                              </div>
                            ) : (
                              (form.securityLogs || []).slice().reverse().map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 shadow-[0_0_8px_rgba(49,91,232,0.3)] group-hover:scale-125 transition-transform" />
                                    <div className="w-px flex-1 bg-border/50" />
                                  </div>
                                  <div className="pb-8 space-y-1">
                                    <p className="text-[11px] font-bold text-foreground/90">{log.action}</p>
                                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-tight">{new Date(log.timestamp).toLocaleString()}</p>
                                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-[8px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">SHA_256_VERIFIED</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
