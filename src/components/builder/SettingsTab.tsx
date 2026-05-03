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

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg whitespace-nowrap ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <tab.icon size={18} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[600px]">

            {activeTab === 'general' && (
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Identity</h3>
                    <p className="text-xs text-muted-foreground mt-1">Define how your form is identified across the platform.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Form Title</label>
                      <input
                        value={form.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Untitled Form"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none resize-none min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Tell respondents what this form is about..."
                      />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Structure</h3>
                    <p className="text-xs text-muted-foreground mt-1">Configure the physical layout and navigation experience.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Form Layout</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['single_page', 'notebook'] as const).map((layout) => (
                          <button
                            key={layout}
                            onClick={() => onUpdate({ layout })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                              form.layout === layout 
                                ? 'bg-primary/5 border-primary shadow-sm' 
                                : 'border-border bg-background hover:border-border/80'
                            }`}
                          >
                            <span className={`text-xs font-semibold mb-1 ${form.layout === layout ? 'text-primary' : 'text-foreground'}`}>
                              {layout === 'single_page' ? 'Standard Form' : 'Notebook Mode'}
                            </span>
                            <span className="text-[10px] text-muted-foreground text-center">
                              {layout === 'single_page' ? 'Scrollable list of questions' : 'One question at a time'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">Progress Indicator</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Display completion status to respondents</p>
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
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Theme & Style</h3>
                    <p className="text-xs text-muted-foreground mt-1">Select a preset theme or customize the design tokens manually.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                    {(Object.keys(THEME_LABELS) as FormTheme[]).map((theme) => {
                      const preview = THEME_PREVIEWS[theme];
                      const isSelected = form.theme === theme;
                      return (
                        <button
                          key={theme}
                          onClick={() => onUpdate({ theme })}
                          className={`group relative flex flex-col p-3 rounded-xl border transition-all ${
                            isSelected 
                              ? 'border-primary ring-1 ring-primary bg-primary/[0.02] shadow-sm' 
                              : 'border-border bg-background hover:border-border/80'
                          }`}
                        >
                          <div className={`aspect-[4/3] rounded-lg mb-3 overflow-hidden border border-border/50 shadow-inner flex flex-col ${preview.bg}`}>
                            <div className="flex-1 p-3">
                              <div className={`text-[10px] font-bold ${preview.fg}`}>ABC</div>
                              <div className={`h-1.5 w-1/2 rounded-full mt-1.5 ${preview.accent}`} />
                              <div className={`h-1 w-1/3 rounded-full mt-1 opacity-20 ${preview.accent}`} />
                            </div>
                            <div className="h-4 bg-black/5 flex items-center px-2 gap-1">
                               <div className="w-1 h-1 rounded-full bg-black/10" />
                               <div className="w-4 h-0.5 rounded-full bg-black/10" />
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide truncate ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                            {THEME_LABELS[theme]}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-8 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Background Color</label>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg border border-border shadow-sm shrink-0" 
                            style={{ backgroundColor: form.style.backgroundColor || '#ffffff' }}
                          />
                          <input
                            type="color"
                            value={form.style.backgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate({ style: { ...form.style, backgroundColor: e.target.value } })}
                            className="flex-1 h-10 bg-background border border-border rounded-lg px-2 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Accent Color</label>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg border border-border shadow-sm shrink-0" 
                            style={{ backgroundColor: form.style.customAccentColor || '#315be8' }}
                          />
                          <input
                            type="color"
                            value={form.style.customAccentColor || '#315be8'}
                            onChange={(e) => onUpdate({ style: { ...form.style, customAccentColor: e.target.value } })}
                            className="flex-1 h-10 bg-background border border-border rounded-lg px-2 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Font Family</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['mono', 'sans', 'serif'] as const).map((font) => (
                            <button
                              key={font}
                              onClick={() => onUpdate({ style: { ...form.style, fontFamily: font } })}
                              className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                                form.style.fontFamily === font 
                                  ? 'bg-foreground text-background border-foreground shadow-sm' 
                                  : 'border-border bg-background text-muted-foreground hover:border-border/80'
                              }`}
                            >
                              {font.charAt(0).toUpperCase() + font.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Border Radius</label>
                            <span className="text-[11px] font-mono font-bold text-primary">{form.style.borderRadius || 0}px</span>
                          </div>
                          <Slider
                            value={[form.style.borderRadius || 0]}
                            max={40}
                            step={1}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, borderRadius: v } })}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Interface Opacity</label>
                            <span className="text-[11px] font-mono font-bold text-primary">{form.style.cardOpacity || 100}%</span>
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
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Security & Permissions</h3>
                    <p className="text-xs text-muted-foreground mt-1">Control who can access and submit your form.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">Anonymous Responses</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Allow submissions without identifying the user</p>
                      </div>
                      <Switch 
                        checked={form.isAnonymous} 
                        onCheckedChange={(v) => onUpdate({ isAnonymous: v })} 
                      />
                    </div>

                    {!form.isAnonymous && (
                      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10 ml-6">
                        <div>
                          <p className="text-xs font-semibold text-primary">Mandatory Identity</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Require name and email for submission</p>
                        </div>
                        <Switch 
                          checked={form.requireRespondentData || false} 
                          onCheckedChange={(v) => onUpdate({ requireRespondentData: v })} 
                        />
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Domain Restriction</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                        <input
                          type="text"
                          value={form.restrictedDomain || ''}
                          onChange={(e) => onUpdate({ restrictedDomain: e.target.value })}
                          placeholder="e.g. gmail.com, company.co"
                          className="w-full bg-background text-sm pl-10 pr-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium italic">Leave empty to allow all domains.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">One Response Per User</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Restrict submissions to one per email address</p>
                      </div>
                      <Switch 
                        checked={form.limitOneResponse || false} 
                        onCheckedChange={(v) => onUpdate({ limitOneResponse: v })} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">Accepting Responses</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Allow or block new form submissions</p>
                      </div>
                      <Switch 
                        checked={form.acceptingResponses} 
                        onCheckedChange={(v) => onUpdate({ acceptingResponses: v })} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">Enable Quiz Mode</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Assign points, set answers, and provide feedback</p>
                      </div>
                      <Switch 
                        checked={form.isQuiz || false} 
                        onCheckedChange={(v) => onUpdate({ isQuiz: v })} 
                      />
                    </div>
                    {form.isQuiz && (
                      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10 ml-6">
                        <div>
                          <p className="text-xs font-semibold text-primary">Post-Submission Results</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Allow respondents to see their scores and correct answers</p>
                        </div>
                        <Switch 
                          checked={form.showQuizResultsToUsers || false} 
                          onCheckedChange={(v) => onUpdate({ showQuizResultsToUsers: v })} 
                        />
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Access Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                        <input
                          type="password"
                          value={form.password || ''}
                          onChange={(e) => onUpdate({ password: e.target.value })}
                          placeholder="Set a password to lock this form"
                          className="w-full bg-background text-sm pl-10 pr-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Limits & Collection</h3>
                    <p className="text-xs text-muted-foreground mt-1">Fine-tune submission quotas and timeline restrictions.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
                      <div>
                        <p className="text-xs font-semibold">Email Collection Strategy</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Define how identity is verified</p>
                      </div>
                      <select
                        value={form.collectEmails || 'do_not_collect'}
                        onChange={(e) => onUpdate({ collectEmails: e.target.value as any })}
                        className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[160px]"
                      >
                        <option value="do_not_collect">Do Not Collect</option>
                        <option value="verified">Verified Emails</option>
                        <option value="responder_input">Responder Input</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Submission Quota</label>
                        <input
                          type="number"
                          value={form.submissionLimit || ''}
                          onChange={(e) => onUpdate({ submissionLimit: parseInt(e.target.value) || undefined })}
                          placeholder="Unlimited"
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Auto-Close Date</label>
                        <input
                          type="date"
                          value={form.closeDate || ''}
                          onChange={(e) => onUpdate({ closeDate: e.target.value })}
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}


            {activeTab === 'submission' && (
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Success Page</h3>
                    <p className="text-xs text-muted-foreground mt-1">Customize the experience after a successful submission.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Confirmation Message</label>
                      <textarea
                        value={form.confirmationMessage}
                        onChange={(e) => onUpdate({ confirmationMessage: e.target.value })}
                        className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none resize-none min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Thank you for your response!"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Redirect URL</label>
                      <div className="relative">
                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                        <input
                          value={form.redirectUrl || ''}
                          onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
                          placeholder="https://yourwebsite.com/thanks"
                          className="w-full bg-background text-sm pl-10 pr-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">Users will be automatically redirected after submission.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Submit Button Text</label>
                      <input
                        value={form.submitButtonText || 'Submit'}
                        onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
                        className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}


            {activeTab === 'analysis' && (
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Response Intelligence</h3>
                    <p className="text-xs text-muted-foreground mt-1">Configure how your data is analyzed and visualized in the dashboard.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { id: 'normal', label: 'Standard', desc: 'Summary charts and response tables' },
                        { id: 'survey', label: 'Survey Insights', desc: 'Trend analysis and consensus detection' },
                        { id: 'research', label: 'Academic Research', desc: 'Statistical distributions and standard deviation' },
                        { id: 'data_work', label: 'Data Science', desc: 'Structured outputs and quality control metrics' }
                      ] as const).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => onUpdate({ responseTheme: theme.id })}
                          className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all group ${
                            form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal')
                              ? 'border-primary bg-primary/[0.03] shadow-sm'
                              : 'border-border bg-background hover:border-border/80'
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
                  </div>
                </section>
              </div>
            )}


            {activeTab === 'seo' && (
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">SEO & Discovery</h3>
                    <p className="text-xs text-muted-foreground mt-1">Optimize how your form appears in search results and social shares.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                        <div>
                          <p className="text-xs font-semibold">Search Engine Indexing</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Allow Google and Bing to crawl this form</p>
                        </div>
                        <Switch 
                          checked={form.seoIndexable !== false} 
                          onCheckedChange={(v) => onUpdate({ seoIndexable: v })} 
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">SEO Title</label>
                          <span className={`text-[10px] font-bold ${(form.seoTitle?.length || 0) > 60 ? 'text-red-500' : 'text-primary'}`}>
                            {form.seoTitle?.length || 0}/60
                          </span>
                        </div>
                        <input
                          value={form.seoTitle || ''}
                          onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                          placeholder={form.title}
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">SEO Description</label>
                          <span className={`text-[10px] font-bold ${(form.seoDescription?.length || 0) > 160 ? 'text-red-500' : 'text-primary'}`}>
                            {form.seoDescription?.length || 0}/160
                          </span>
                        </div>
                        <textarea
                          value={form.seoDescription || ''}
                          onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                          placeholder={form.description}
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none resize-none min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Keywords</label>
                        <input
                          value={form.seoKeywords || ''}
                          onChange={(e) => onUpdate({ seoKeywords: e.target.value })}
                          placeholder="survey, feedback, research"
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Search Preview */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Search size={12} /> Google Search Preview
                        </label>
                        <div className="bg-white p-5 rounded-xl border border-border shadow-sm text-left font-sans">
                          <div className="text-[16px] text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 truncate">
                            {form.seoTitle || form.title || 'Untitled Form'}
                          </div>
                          <div className="text-[13px] text-[#006621] mb-1 truncate opacity-80">
                            {window.location.origin}/form/{form.id}
                          </div>
                          <div className="text-[13px] text-[#4d5156] line-clamp-2 leading-relaxed">
                            {form.seoDescription || form.description || 'Fill out this form created on Aqora — the intelligent workspace for data gathering.'}
                          </div>
                        </div>
                      </div>

                      {/* Social Preview */}
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Share2 size={12} /> Social Media Card
                        </label>
                        <div className="bg-[#f8f9fa] border border-border rounded-xl overflow-hidden shadow-sm">
                          <div className="aspect-[1.91/1] bg-primary/5 flex items-center justify-center border-b border-border relative">
                            {form.style?.bannerImageUrl ? (
                              <img src={form.style.bannerImageUrl} className="w-full h-full object-cover" alt="Banner" />
                            ) : (
                              <div className="flex flex-col items-center opacity-20">
                                <span className="text-2xl font-bold tracking-tighter">Aqora</span>
                                <span className="text-[8px] font-black uppercase tracking-widest mt-1">Protocol Workspace</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-white">
                            <p className="text-[14px] font-bold text-foreground line-clamp-1 mb-1">
                              {form.seoTitle || form.title || 'Untitled Form'}
                            </p>
                            <p className="text-[12px] text-muted-foreground line-clamp-2 leading-snug">
                              {form.seoDescription || form.description || 'Participate in this official data intelligence gathering.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Security Overview Card */}
                <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
                  <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Security Score</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Overall protection level for this form</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="flex-1 sm:w-48 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${securityStrength}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {securityStrength}%
                        <span className="text-[10px] font-bold text-primary ml-1.5 px-1.5 py-0.5 bg-primary/10 rounded-md">
                          {securityStrength < 30 ? 'Low' : securityStrength < 60 ? 'Medium' : 'High'}
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-border">
                    {[
                      { label: 'Password', active: !!form.password, icon: Lock },
                      { label: 'Expiration', active: !!form.linkExpirationDate, icon: Calendar },
                      { label: 'Domain Lock', active: !!form.restrictedDomain, icon: ShieldAlert },
                      { label: 'Team', active: (form.collaborators || []).length > 0, icon: Users },
                    ].map(({ label, active, icon: Icon }) => (
                      <div key={label} className="px-5 py-4 flex flex-col gap-1 border-r last:border-r-0 border-border">
                        <div className="flex items-center gap-2">
                           <Icon size={12} className={active ? 'text-primary' : 'text-muted-foreground/40'} />
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                        </div>
                        <span className={`text-[11px] font-bold ${active ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                          {active ? 'Configured' : 'Disabled'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <section>
                      <div className="mb-6">
                        <h3 className="text-base font-semibold">Team Access</h3>
                        <p className="text-xs text-muted-foreground mt-1">Add colleagues to collaborate on form design and results.</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex gap-2">
                          <input
                            id="collaborator-email"
                            type="email"
                            placeholder="colleague@company.com"
                            className="flex-1 bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                const email = input.value.trim();
                                if (email && email.includes('@')) {
                                  const current = form.collaborators || [];
                                  if (current.find(c => c.email === email)) {
                                    toast.error("User already has access");
                                  } else {
                                    onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                    addSecurityLog(`Access granted: ${email}`);
                                    input.value = '';
                                    toast.success("Collaborator added");
                                  }
                                }
                              }
                            }}
                          />
                          <button 
                            onClick={() => {
                              const input = document.getElementById('collaborator-email') as HTMLInputElement;
                              const email = input?.value.trim();
                              if (email && email.includes('@')) {
                                const current = form.collaborators || [];
                                if (current.find(c => c.email === email)) {
                                  toast.error("User already has access");
                                } else {
                                  onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                  addSecurityLog(`Access granted: ${email}`);
                                  input.value = '';
                                  toast.success("Collaborator added");
                                }
                              } else {
                                toast.error("Enter a valid email");
                              }
                            }}
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm hover:opacity-90"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {/* Collaborators List */}
                      <div className="space-y-3">
                        {(form.collaborators || []).length === 0 ? (
                          <div className="border border-dashed border-border p-8 rounded-xl text-center bg-secondary/10">
                            <Users size={24} className="mx-auto mb-3 text-muted-foreground/20" />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No team members</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">Invite others to help manage this form.</p>
                          </div>
                        ) : (
                          (form.collaborators || []).map((collab, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group shadow-sm">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
                                  <AgentAvatar seed={collab.email} size={32} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold truncate">{collab.email}</p>
                                  <span className={`text-[9px] font-bold uppercase tracking-tight ${collab.role === 'editor' ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {collab.role === 'editor' ? 'Editor' : 'Viewer'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <select
                                  value={collab.role}
                                  onChange={(e) => {
                                    const newCollabs = [...(form.collaborators || [])];
                                    newCollabs[index] = { ...collab, role: e.target.value as any };
                                    onUpdate({ collaborators: newCollabs });
                                    addSecurityLog(`Role changed: ${collab.email} to ${e.target.value}`);
                                  }}
                                  className="bg-transparent border border-border rounded-lg px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-primary transition-all"
                                >
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const newCollabs = (form.collaborators || []).filter((_, i) => i !== index);
                                    onUpdate({ collaborators: newCollabs });
                                    addSecurityLog(`Access revoked: ${collab.email}`);
                                    toast.info("Collaborator removed");
                                  }}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {(form.collaborators || []).length > 0 && (
                        <p className="text-[10px] text-muted-foreground font-medium mt-4 italic">
                          {(form.collaborators || []).length} team member{(form.collaborators || []).length !== 1 ? 's' : ''} currently have access.
                        </p>
                      )}
                    </section>

                    {/* Audit Log */}
                    <section className="rounded-2xl border border-border overflow-hidden bg-secondary/5">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background">
                        <History size={14} className="text-primary" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">Security Activity</h4>
                        <span className="ml-auto text-[9px] font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md uppercase">{(form.securityLogs || []).length} Logs</span>
                      </div>
                      <div className="p-2 space-y-1 max-h-48 overflow-y-auto font-mono text-[10px]">
                        {(form.securityLogs || []).length === 0 ? (
                          <p className="text-muted-foreground/30 italic text-center py-6 uppercase tracking-widest">No activity</p>
                        ) : (
                          (form.securityLogs || []).map((log, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border/50">
                              <Check size={10} className="text-primary mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-foreground/80 leading-none block truncate font-medium">{log.action}</span>
                                <span className="text-[9px] text-muted-foreground/50">{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>

                  {/* === RIGHT COLUMN: SECURITY === */}
                  <div className="space-y-6">
                    <section className="space-y-6">
                      {/* Collaboration Password */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                             <Lock size={12} /> Team Password
                          </label>
                          {form.collaborationPassword && (
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">Encrypted</span>
                          )}
                        </div>
                        <input
                          type="password"
                          value={form.collaborationPassword || ''}
                          onChange={(e) => {
                            onUpdate({ collaborationPassword: e.target.value });
                            if (e.target.value && !form.collaborationPassword) addSecurityLog("Team password enabled");
                          }}
                          placeholder="Set a dedicated team password"
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      {/* Expiration Date */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                             <Calendar size={12} /> Expiration
                          </label>
                          {form.linkExpirationDate && (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              new Date(form.linkExpirationDate) < new Date() ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                            }`}>
                              {new Date(form.linkExpirationDate) < new Date() ? 'Expired' : 'Set'}
                            </span>
                          )}
                        </div>
                        <input
                          type="date"
                          value={form.linkExpirationDate || ''}
                          onChange={(e) => {
                            onUpdate({ linkExpirationDate: e.target.value });
                            addSecurityLog(`Expiration set to ${e.target.value}`);
                          }}
                          className="w-full bg-background text-sm px-4 py-2.5 border border-border rounded-lg outline-none font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      {/* Salt Rotation */}
                      <div className="p-5 rounded-2xl border border-border bg-secondary/10 space-y-4">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={14} className="text-muted-foreground" />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Token Rotation</h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-medium">
                          Invalidate all active team links instantly. Use this if security is compromised.
                        </p>
                        <button 
                          onClick={() => {
                            const newSalt = Math.random().toString(36).substring(2, 15);
                            onUpdate({ linkRotationSalt: newSalt });
                            addSecurityLog("Token rotated — access revoked for all old links");
                            toast.success("Security token rotated");
                          }}
                          className="w-full bg-foreground text-background text-xs font-bold uppercase py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <RefreshCw size={14} />
                          Rotate Security Token
                        </button>
                      </div>
                    </section>

                    {/* Collaboration Link Export */}
                    <section className="p-5 rounded-2xl border border-primary/20 bg-primary/[0.02] space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Share2 size={14} />
                        <label className="text-xs font-bold uppercase tracking-wider">Collaboration Link</label>
                      </div>
                      <div className="bg-background border border-border p-3 rounded-lg font-mono text-[10px] break-all text-muted-foreground/80 leading-relaxed select-all">
                        {`${window.location.origin}/collab/${btoa(JSON.stringify({ 
                          id: form.id, 
                          s: form.linkRotationSalt || 'v1',
                          e: form.linkExpirationDate || '0',
                          p: form.collaborationPassword ? '1' : '0' 
                        }))}`}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/collab/${btoa(JSON.stringify({ 
                              id: form.id, 
                              s: form.linkRotationSalt || 'v1', 
                              e: form.linkExpirationDate || '0',
                              p: form.collaborationPassword ? '1' : '0' 
                            }))}`;
                            navigator.clipboard.writeText(url);
                            toast.success("Link copied to clipboard");
                            addSecurityLog("Collab link exported");
                          }}
                          className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <Copy size={14} />
                          Copy Secure Link
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
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