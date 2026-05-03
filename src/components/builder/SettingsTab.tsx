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
  AlertTriangle
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
};

type TabId = 'general' | 'appearance' | 'access' | 'submission' | 'analysis' | 'seo' | 'team';

const SettingsTab = ({ form, onUpdate }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');

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
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-48 flex-shrink-0 sticky top-10">
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

          {/* Content Area */}
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
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Design System</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Apply a curated visual language or customize individual design tokens.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
                    {(Object.keys(THEME_LABELS) as FormTheme[]).map((theme) => {
                      const preview = THEME_PREVIEWS[theme];
                      const isSelected = form.theme === theme;
                      return (
                        <button
                          key={theme}
                          onClick={() => onUpdate({ theme })}
                          className={`group relative flex flex-col p-3 rounded-none border transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/[0.02] shadow-[0_0_15px_-5px_rgba(49,91,232,0.2)]' 
                              : 'border-border bg-background/50 hover:border-border/80'
                          }`}
                        >
                          <div className={`aspect-[4/3] rounded-none mb-3 overflow-hidden border border-border/50 flex flex-col ${preview.bg}`}>
                            <div className="flex-1 p-3">
                              <div className={`text-[10px] font-bold ${preview.fg}`}>Aa</div>
                              <div className={`h-1 w-1/2 rounded-none mt-1.5 ${preview.accent}`} />
                              <div className={`h-1 w-1/3 rounded-none mt-1 opacity-20 ${preview.accent}`} />
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                            {THEME_LABELS[theme]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Brand Color</label>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-none border border-border shadow-sm shrink-0" 
                            style={{ backgroundColor: form.style.customAccentColor || '#315be8' }}
                          />
                          <div className="flex-1">
                             <input
                              type="color"
                              value={form.style.customAccentColor || '#315be8'}
                              onChange={(e) => onUpdate({ style: { ...form.style, customAccentColor: e.target.value } })}
                              className="w-full h-8 bg-transparent cursor-pointer"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">{form.style.customAccentColor || '#315be8'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Typography</label>
                        <div className="flex gap-2">
                          {(['mono', 'sans', 'serif'] as const).map((font) => (
                            <button
                              key={font}
                              onClick={() => onUpdate({ style: { ...form.style, fontFamily: font } })}
                              className={`flex-1 py-2 border text-[11px] font-bold uppercase tracking-wider transition-all ${
                                form.style.fontFamily === font 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border bg-background text-muted-foreground hover:border-border/80'
                              }`}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Edge Roundness</label>
                            <span className="text-xs font-mono font-bold">{form.style.borderRadius || 0}px</span>
                          </div>
                          <Slider
                            value={[form.style.borderRadius || 0]}
                            max={40}
                            step={1}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, borderRadius: v } })}
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Surface Opacity</label>
                            <span className="text-xs font-mono font-bold">{form.style.cardOpacity || 100}%</span>
                          </div>
                          <Slider
                            value={[form.style.cardOpacity || 100]}
                            max={100}
                            step={5}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, cardOpacity: v } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
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
                    {/* Entry Protocols */}
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

                    {/* Organizational Control */}
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
                              placeholder="e.g. revox.ai, google.com"
                              className="w-full bg-transparent text-xs px-0 py-2 border-b border-border rounded-none outline-none font-mono focus:border-primary transition-all text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submission Governance */}
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

                    {/* Hard Constraints */}
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
                          placeholder="https://..."
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([
                      { id: 'normal', label: 'Standard Analytics', desc: 'Baseline charts and response matrices' },
                      { id: 'survey', label: 'Sentiment & Trends', desc: 'Emotional analysis and consensus detection' },
                      { id: 'research', label: 'Statistical Core', desc: 'Standard deviation and distribution mapping' },
                      { id: 'data_work', label: 'Raw Intelligence', desc: 'Structured JSON outputs and audit metrics' }
                    ] as const).map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => onUpdate({ responseTheme: theme.id })}
                        className={`flex flex-col text-left p-5 border transition-all ${
                          form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal')
                            ? 'border-primary bg-primary/[0.03] shadow-[0_0_15px_-5px_rgba(49,91,232,0.2)]'
                            : 'border-border bg-background/50 hover:border-border/80'
                        }`}
                      >
                        <span className={`text-sm font-bold mb-1 ${
                          form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal')
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}>{theme.label}</span>
                        <span className="text-[11px] text-muted-foreground leading-snug">
                          {theme.desc}
                        </span>
                      </button>
                    ))}
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
                            {form.seoDescription || form.description || 'Access the official data gathering portal on RevoX.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold tracking-tight">Team & Governance</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">Manage collaborator permissions and monitor security audit logs.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-12">
                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Add Collaborator</label>
                        <div className="flex gap-2">
                          <input
                            id="collaborator-email"
                            type="email"
                            placeholder="colleague@revox.ai"
                            className="flex-1 bg-transparent text-sm px-0 py-2 border-b border-border rounded-none outline-none focus:border-primary transition-all"
                          />
                          <button 
                            onClick={() => {
                              const input = document.getElementById('collaborator-email') as HTMLInputElement;
                              const email = input?.value.trim();
                              if (email && email.includes('@')) {
                                const current = form.collaborators || [];
                                onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                addSecurityLog(`Access granted: ${email}`);
                                input.value = '';
                                toast.success("Access granted");
                              }
                            }}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 hover:bg-primary/5 transition-all"
                          >
                            Grant
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(form.collaborators || []).map((collab, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-border/30 group">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-none bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {collab.email[0].toUpperCase()}
                              </div>
                              <span className="text-xs font-medium">{collab.email}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const newCollabs = (form.collaborators || []).filter((_, i) => i !== index);
                                onUpdate({ collaborators: newCollabs });
                                addSecurityLog(`Access revoked: ${collab.email}`);
                              }}
                              className="text-[10px] font-bold uppercase text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-8 space-y-6">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Protocol Security</label>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Secure Collaboration Link</p>
                            <div className="p-4 bg-secondary/20 border border-border/50 font-mono text-[10px] break-all text-muted-foreground leading-relaxed select-all">
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
                                toast.success("Secure link copied");
                              }}
                              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                            >
                              Copy Link
                            </button>
                          </div>

                          <div className="p-6 border border-red-500/10 bg-red-500/[0.02] space-y-4">
                            <div className="flex items-center gap-2 text-red-500">
                              <RefreshCw size={14} />
                              <h4 className="text-[10px] font-bold uppercase tracking-wider">Emergency Token Rotation</h4>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Invalidate all active team links instantly. This action cannot be undone.
                            </p>
                            <button 
                              onClick={() => {
                                const newSalt = Math.random().toString(36).substring(2, 15);
                                onUpdate({ linkRotationSalt: newSalt });
                                addSecurityLog("Security token rotated");
                                toast.success("Protocol tokens rotated");
                              }}
                              className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all"
                            >
                              Rotate Tokens
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                       <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.1em]">Audit Ledger</label>
                        <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar pr-4">
                          {(form.securityLogs || []).map((log, i) => (
                            <div key={i} className="text-[10px] font-mono leading-relaxed text-muted-foreground/80 flex items-start gap-4 border-l border-border/50 pl-4 relative">
                              <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-primary/40" />
                              <div className="flex-1">
                                <p className="text-foreground/90 font-sans font-medium">{log.action}</p>
                                <p className="text-[9px] opacity-40 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
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