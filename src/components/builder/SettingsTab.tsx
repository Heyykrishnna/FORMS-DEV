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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation - Horizontally scrollable on mobile */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-1 overflow-x-auto overflow-y-hidden no-scrollbar">
          <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter hidden lg:block">
            SETTINGS<span className="text-accent">.</span>
          </h2>
          <div className="flex lg:flex-col gap-1 pb-2 lg:pb-0 min-w-max lg:min-w-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-[10px] lg:text-xs font-bold uppercase transition-all border-2 ${
                    isActive 
                      ? 'bg-foreground text-background border-foreground lg:translate-x-1 shadow-brutal-sm' 
                      : 'border-transparent hover:border-foreground/20 text-muted-foreground hover:text-foreground bg-secondary/30 lg:bg-transparent'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-background border-brutal p-4 sm:p-6 md:p-8 min-h-[500px] lg:min-h-[600px]">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Identity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">FORM TITLE</label>
                      <input
                        value={form.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none font-bold uppercase focus:shadow-brutal-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">DESCRIPTION</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none resize-none min-h-[100px] focus:shadow-brutal-sm transition-all"
                        placeholder="Tell respondents what this form is about..."
                      />
                    </div>
                  </div>
                </section>

                <div className="border-t-2 border-foreground/10" />

                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Structure
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-3 tracking-widest">FORM LAYOUT</label>
                      <div className="flex gap-2">
                        {(['single_page', 'notebook'] as const).map((layout) => (
                          <button
                            key={layout}
                            onClick={() => onUpdate({ layout })}
                            className={`flex-1 py-4 text-[10px] font-black uppercase border-2 transition-all ${
                              form.layout === layout 
                                ? 'bg-accent text-accent-foreground border-foreground shadow-brutal-sm' 
                                : 'border-foreground/10 hover:border-foreground/30'
                            }`}
                          >
                            {layout === 'single_page' ? 'Normal Form' : 'Notebook Mode'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">Progress Bar</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Show how many questions are left</p>
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Theme & Style
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {(Object.keys(THEME_LABELS) as FormTheme[]).map((theme) => {
                      const preview = THEME_PREVIEWS[theme];
                      const isSelected = form.theme === theme;
                      return (
                        <button
                          key={theme}
                          onClick={() => onUpdate({ theme })}
                          className={`group border-2 p-3 text-left transition-all ${
                            isSelected 
                              ? 'border-foreground bg-secondary shadow-brutal-sm' 
                              : 'border-foreground/10 hover:border-foreground/30'
                          }`}
                        >
                          <div className={`${preview.bg} ${preview.fg} p-3 mb-2 text-[10px] font-mono border-2 border-current/10 group-hover:border-current/30 transition-all`}>
                            <div className="font-bold">ABC</div>
                            <div className={`${preview.accent} h-1 w-8 mt-1`} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter truncate block">{THEME_LABELS[theme]}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2 tracking-widest">BACKGROUND</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={form.style.backgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate({ style: { ...form.style, backgroundColor: e.target.value } })}
                            className="h-12 w-full border-2 border-foreground cursor-pointer bg-secondary p-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2 tracking-widest">ACCENT</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={form.style.customAccentColor || '#FF4500'}
                            onChange={(e) => onUpdate({ style: { ...form.style, customAccentColor: e.target.value } })}
                            className="h-12 w-full border-2 border-foreground cursor-pointer bg-secondary p-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2 tracking-widest">FONT FAMILY</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['mono', 'sans', 'serif'] as const).map((font) => (
                            <button
                              key={font}
                              onClick={() => onUpdate({ style: { ...form.style, fontFamily: font } })}
                              className={`py-2 border-2 text-[10px] font-black uppercase transition-all ${
                                form.style.fontFamily === font ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 hover:border-foreground/30'
                              }`}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest">ROUNDNESS</label>
                            <span className="text-[10px] font-mono">{form.style.borderRadius || 0}px</span>
                          </div>
                          <Slider
                            value={[form.style.borderRadius || 0]}
                            max={40}
                            step={1}
                            onValueChange={([v]) => onUpdate({ style: { ...form.style, borderRadius: v } })}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest">TRANSPARENCY</label>
                            <span className="text-[10px] font-mono">{form.style.cardOpacity || 100}%</span>
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Security & Permissions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">Anonymous Responses</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Allow submissions without login</p>
                      </div>
                      <Switch 
                        checked={form.isAnonymous} 
                        onCheckedChange={(v) => onUpdate({ isAnonymous: v })} 
                      />
                    </div>

                    {!form.isAnonymous && (
                      <div className="flex items-center justify-between p-4 bg-accent/10 border-2 border-accent/20 ml-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-accent">Mandatory Identity</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Require name and email for submission</p>
                        </div>
                        <Switch 
                          checked={form.requireRespondentData || false} 
                          onCheckedChange={(v) => onUpdate({ requireRespondentData: v })} 
                        />
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block tracking-widest">DOMAIN RESTRICTION (OPTIONAL)</label>
                      <div className="relative">
                        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                          type="text"
                          value={form.restrictedDomain || ''}
                          onChange={(e) => onUpdate({ restrictedDomain: e.target.value })}
                          placeholder="e.g. gmail.com, company.co"
                          className="w-full bg-secondary text-sm p-3 pl-10 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                        />
                      </div>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">ONLY USERS WITH THIS EMAIL DOMAIN CAN SUBMIT.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">One Response Per Email</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Restrict to one submission per email address</p>
                      </div>
                      <Switch 
                        checked={form.limitOneResponse || false} 
                        onCheckedChange={(v) => onUpdate({ limitOneResponse: v })} 
                      />
                    </div>
                    {form.limitOneResponse && (
                      <div className="p-3 bg-accent/10 border-2 border-accent/20 ml-4">
                        <p className="text-[8px] font-black uppercase text-accent">⚠ REQUIRES EMAIL COLLECTION — ANONYMOUS MODE MUST BE OFF AND RESPONDENT IDENTITY REQUIRED.</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">Accepting Responses</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Turn off to close the form</p>
                      </div>
                      <Switch 
                        checked={form.acceptingResponses} 
                        onCheckedChange={(v) => onUpdate({ acceptingResponses: v })} 
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">Make This A Quiz</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Assign point values, set answers, and provide feedback</p>
                      </div>
                      <Switch 
                        checked={form.isQuiz || false} 
                        onCheckedChange={(v) => onUpdate({ isQuiz: v })} 
                      />
                    </div>
                    {form.isQuiz && (
                      <div className="flex items-center justify-between p-4 bg-accent/10 border-2 border-accent/20 ml-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-accent">Show Results to Users</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Allow users to view their scores and answers after submission</p>
                        </div>
                        <Switch 
                          checked={form.showQuizResultsToUsers || false} 
                          onCheckedChange={(v) => onUpdate({ showQuizResultsToUsers: v })} 
                        />
                      </div>
                    )}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block tracking-widest">FORM PASSWORD (OPTIONAL)</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                          type="password"
                          value={form.password || ''}
                          onChange={(e) => onUpdate({ password: e.target.value })}
                          placeholder="Leave empty for no password"
                          className="w-full bg-secondary text-sm p-3 pl-10 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="border-t-2 border-foreground/10" />

                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Limits & Collection
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                      <div>
                        <p className="text-[10px] font-black uppercase">Collect Emails</p>
                        <p className="text-[10px] text-muted-foreground uppercase">How to identify respondents</p>
                      </div>
                      <select
                        value={form.collectEmails || 'do_not_collect'}
                        onChange={(e) => onUpdate({ collectEmails: e.target.value as any })}
                        className="bg-secondary border-2 border-foreground/20 px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-foreground transition-all min-w-[140px]"
                      >
                        <option value="do_not_collect">Do Not Collect</option>
                        <option value="verified">Verified</option>
                        <option value="responder_input">Responder Input</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">SUBMISSION LIMIT</label>
                        <input
                          type="number"
                          value={form.submissionLimit || ''}
                          onChange={(e) => onUpdate({ submissionLimit: parseInt(e.target.value) || undefined })}
                          placeholder="Unlimited"
                          className="w-full bg-secondary text-sm p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">CLOSE DATE</label>
                        <input
                          type="date"
                          value={form.closeDate || ''}
                          onChange={(e) => onUpdate({ closeDate: e.target.value })}
                          className="w-full bg-secondary text-sm p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'submission' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Success Page
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">CONFIRMATION MESSAGE</label>
                      <textarea
                        value={form.confirmationMessage}
                        onChange={(e) => onUpdate({ confirmationMessage: e.target.value })}
                        className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none resize-none min-h-[100px] focus:shadow-brutal-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">REDIRECT URL</label>
                      <input
                        value={form.redirectUrl || ''}
                        onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-secondary text-sm p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">BUTTON TEXT</label>
                      <input
                        value={form.submitButtonText || 'Submit'}
                        onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
                        className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none font-bold uppercase focus:shadow-brutal-sm transition-all"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    Response Intelligence
                  </h3>
                  <div className="space-y-6">
                    <p className="text-xs text-muted-foreground uppercase leading-relaxed tracking-wider">
                      CHOOSE HOW WE ANALYZE YOUR DATA. DIFFERENT THEMES PROVIDE UNIQUE CALCULATIONS AND VISUALIZATIONS.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { id: 'normal', label: 'NORMAL', desc: 'Standard summaries and tabular responses' },
                        { id: 'survey', label: 'SURVEY', desc: 'Trends, consensus detection, and favorite options' },
                        { id: 'research', label: 'RESEARCH', desc: 'Statistical distributions, standard deviation, and scientific graphs' },
                        { id: 'data_work', label: 'DATA WORK', desc: 'Structured data focus, quality control, and export-optimized views' }
                      ] as const).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => onUpdate({ responseTheme: theme.id })}
                          className={`flex flex-col text-left p-5 border-2 transition-all group ${
                            form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal')
                              ? 'border-foreground bg-foreground text-background shadow-brutal-sm'
                              : 'border-foreground/10 hover:border-foreground/40 bg-secondary'
                          }`}
                        >
                          <span className="text-xs font-black mb-1">{theme.label}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-tight ${
                            form.responseTheme === theme.id || (!form.responseTheme && theme.id === 'normal')
                              ? 'text-accent'
                              : 'text-muted-foreground'
                          }`}>
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
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                    SEO & Discovery
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* CONTROLS */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-secondary border-2 border-foreground/10">
                        <div>
                          <p className="text-[10px] font-black uppercase">Direct Indexing</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Allow search engines to find this form</p>
                        </div>
                        <Switch 
                          checked={form.seoIndexable !== false} 
                          onCheckedChange={(v) => onUpdate({ seoIndexable: v })} 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground block tracking-widest">SEO TITLE</label>
                          <span className={`text-[9px] font-black ${(form.seoTitle?.length || 0) > 60 ? 'text-red-500' : 'text-accent'}`}>
                            {form.seoTitle?.length || 0}/60 { (form.seoTitle?.length || 0) <= 60 && ' (OPTIMAL)' }
                          </span>
                        </div>
                        <input
                          value={form.seoTitle || ''}
                          onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                          placeholder={form.title}
                          className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none font-bold uppercase focus:shadow-brutal-sm transition-all"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground block tracking-widest">SEO DESCRIPTION</label>
                          <span className={`text-[9px] font-black ${(form.seoDescription?.length || 0) > 160 ? 'text-red-500' : 'text-accent'}`}>
                            {form.seoDescription?.length || 0}/160
                          </span>
                        </div>
                        <textarea
                          value={form.seoDescription || ''}
                          onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                          placeholder={form.description}
                          className="w-full bg-secondary text-sm p-3 border-2 border-foreground outline-none resize-none min-h-[100px] focus:shadow-brutal-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1 tracking-widest">METADATA KEYWORDS</label>
                        <input
                          value={form.seoKeywords || ''}
                          onChange={(e) => onUpdate({ seoKeywords: e.target.value })}
                          placeholder="survey, feedback, research, data"
                          className="w-full bg-secondary text-sm p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                        />
                        <p className="text-[8px] mt-1 text-muted-foreground uppercase font-bold">COMMA SEPARATED LIST OF FOCUS TERMS.</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* GOOGLE PREVIEW */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Google Search Live Preview
                          </label>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`);
                              toast.success("LINK COPIED TO CLIPBOARD");
                            }}
                            className="text-[9px] font-black uppercase flex items-center gap-1 hover:text-accent transition-colors"
                          >
                            <Share2 size={12} />
                            Copy Link
                          </button>
                        </div>
                        <div className="bg-white p-6 border-2 border-foreground shadow-brutal-sm text-left font-sans group relative overflow-hidden">
                          <div className="text-[14px] text-[#1a0dab] group-hover:underline cursor-pointer font-normal mb-1 truncate">
                            {form.seoTitle || form.title || 'Untitled Form'} | Aqora
                          </div>
                          <div className="text-[12px] text-[#006621] mb-1 truncate">
                            {window.location.origin}/form/{form.id}
                          </div>
                          <div className="text-[13px] text-[#545454] line-clamp-2 leading-relaxed">
                            {form.seoDescription || form.description || 'Fill out this form created on Aqora - the high-performance form builder for data intelligence.'}
                          </div>
                        </div>
                      </div>

                      {/* SOCIAL PREVIEW */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Social Media Card Preview
                          </label>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Twitter / X / Meta</span>
                        </div>
                        <div className="bg-[#15202b] border-2 border-foreground rounded-xl overflow-hidden text-white font-sans w-full max-w-[400px] mx-auto sm:mx-0 shadow-brutal-sm">
                          <div className="aspect-video bg-accent/20 flex items-center justify-center border-b-2 border-foreground group relative">
                            {form.style?.bannerImageUrl ? (
                              <img src={form.style.bannerImageUrl} className="w-full h-full object-cover" alt="Banner" />
                            ) : (
                              <div className="text-center p-8">
                                <span className="text-4xl font-black block mb-2 opacity-20">Aqora</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 italic font-mono">FORM PROTOCOL ACTIVATED</span>
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-[10px] font-black uppercase italic tracking-tighter backdrop-blur-sm">
                              AqoraFORMS.VERCEL.APP
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <p className="text-[14px] font-bold leading-tight line-clamp-1">
                              {form.seoTitle || form.title || 'Untitled Form'}
                            </p>
                            <p className="text-[13px] text-gray-400 line-clamp-2 leading-snug">
                              {form.seoDescription || form.description || 'Participate in this official data intelligence gathering.'}
                            </p>
                            <div className="pt-3 flex items-center justify-between border-t border-white/10 mt-2">
                              <div className="flex items-center gap-2 opacity-40">
                                <Search size={10} />
                                <span className="text-[8px] font-black uppercase tracking-tight">SECURE_TUNNEL // V1.2</span>
                              </div>
                              <Share2 size={12} className="opacity-40 animate-pulse text-accent" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`);
                              toast.success("SOCIAL METADATA LINK COPIED");
                            }}
                            className="w-full bg-foreground text-background py-3 font-black uppercase text-xs shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                          >
                            <Share2 size={14} />
                            COPY SHARABLE PROTOCOL LINK
                          </button>
                          <p className="text-[8px] text-muted-foreground uppercase font-black text-center">
                            AUTO-GENERATED FROM YOUR CURRENT CONFIGURATION.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {activeTab === 'team' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* Security Score Header */}
                <div className="border-2 border-foreground">
                  <div className="bg-foreground text-background px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} />
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Security Overview</h3>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Form protection status</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex-1 sm:w-48 h-2 bg-background/20 overflow-hidden border border-background/20">
                        <div 
                          className="h-full bg-accent transition-all duration-700 ease-out" 
                          style={{ width: `${securityStrength}%` }}
                        />
                      </div>
                      <span className="text-sm font-black tabular-nums whitespace-nowrap">
                        {securityStrength}%
                        <span className="text-[10px] font-bold opacity-60 ml-1">
                          {securityStrength < 30 ? 'LOW' : securityStrength < 60 ? 'MED' : 'HIGH'}
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* Security checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x-2 divide-foreground/10 border-t-2 border-foreground/10">
                    {[
                      { label: 'Password', active: !!form.collaborationPassword, icon: Lock },
                      { label: 'Expiry Date', active: !!form.linkExpirationDate, icon: Calendar },
                      { label: 'Domain Lock', active: !!form.restrictedDomain, icon: ShieldAlert },
                      { label: 'Team Added', active: (form.collaborators || []).length > 0, icon: Users },
                    ].map(({ label, active, icon: Icon }) => (
                      <div key={label} className={`px-4 py-3 flex items-center gap-2 ${active ? 'bg-accent/5' : 'bg-secondary/30'}`}>
                        <Icon size={12} className={active ? 'text-accent' : 'text-muted-foreground'} />
                        <div>
                          <p className={`text-[9px] font-black uppercase ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                          <p className={`text-[8px] font-bold uppercase ${active ? 'text-accent' : 'text-muted-foreground/50'}`}>{active ? 'ACTIVE' : 'NOT SET'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* === LEFT COLUMN: TEAM === */}
                  <div className="space-y-6">
                    {/* Team Access */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Users size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Team Access</h3>
                      </div>

                      {/* Add Collaborator Input */}
                      <div className="space-y-2 mb-4">
                        <label className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Add collaborator by email</label>
                        <div className="flex gap-2">
                          <input
                            id="collaborator-email"
                            type="email"
                            placeholder="colleague@company.com"
                            className="flex-1 bg-secondary text-xs p-3 border-2 border-foreground/20 outline-none font-mono focus:border-foreground transition-all placeholder:normal-case placeholder:font-normal"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                const email = input.value.trim();
                                if (email && email.includes('@')) {
                                  const current = form.collaborators || [];
                                  if (current.find(c => c.email === email)) {
                                    toast.error("USER ALREADY HAS ACCESS");
                                  } else {
                                    onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                    addSecurityLog(`ACCESS GRANTED: ${email}`);
                                    input.value = '';
                                    toast.success("COLLABORATOR ADDED");
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
                                  toast.error("USER ALREADY HAS ACCESS");
                                } else {
                                  onUpdate({ collaborators: [...current, { email, role: 'editor' }] });
                                  addSecurityLog(`ACCESS GRANTED: ${email}`);
                                  input.value = '';
                                  toast.success("COLLABORATOR ADDED");
                                }
                              } else {
                                toast.error("ENTER A VALID EMAIL ADDRESS");
                              }
                            }}
                            className="bg-accent text-accent-foreground border-2 border-foreground px-5 py-3 text-[10px] font-black uppercase hover:shadow-brutal-sm transition-all whitespace-nowrap"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">PRESS ENTER OR CLICK ADD. COLLABORATORS SEE RESPONSES AND CAN EDIT.</p>
                      </div>

                      {/* Collaborators List */}
                      <div className="space-y-2">
                        {(form.collaborators || []).length === 0 ? (
                          <div className="border-2 border-dashed border-foreground/10 p-6 text-center bg-secondary/20">
                            <Users size={20} className="mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">No team members yet</p>
                            <p className="text-[8px] text-muted-foreground/50 uppercase mt-1">Add emails above to invite collaborators</p>
                          </div>
                        ) : (
                          (form.collaborators || []).map((collab, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border-2 border-foreground/10 hover:border-foreground/30 bg-secondary/20 transition-all group">
                              <div className="flex items-center gap-3 min-w-0">
                                <AgentAvatar seed={collab.email} size={28} className="border-2 border-foreground/10" />
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold truncate">{collab.email}</p>
                                  <span className={`text-[8px] font-black uppercase tracking-tight ${collab.role === 'editor' ? 'text-accent' : 'text-muted-foreground'}`}>
                                    {collab.role === 'editor' ? '✦ Editor' : '◎ Viewer'}
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
                                    addSecurityLog(`ROLE CHANGED: ${collab.email} → ${e.target.value}`);
                                  }}
                                  className="bg-secondary border-2 border-foreground/10 px-2 py-1 text-[9px] font-black uppercase outline-none focus:border-foreground transition-all"
                                >
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const newCollabs = (form.collaborators || []).filter((_, i) => i !== index);
                                    onUpdate({ collaborators: newCollabs });
                                    addSecurityLog(`ACCESS REVOKED: ${collab.email}`);
                                    toast.info("COLLABORATOR REMOVED");
                                  }}
                                  className="border-2 border-foreground/10 hover:border-red-500 hover:text-red-500 px-2 py-1 text-[9px] font-black uppercase transition-all"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {(form.collaborators || []).length > 0 && (
                        <p className="text-[8px] text-muted-foreground uppercase font-bold mt-2 tracking-wider">
                          {(form.collaborators || []).length} COLLABORATOR{(form.collaborators || []).length !== 1 ? 'S' : ''} HAVE ACCESS TO THIS FORM.
                        </p>
                      )}
                    </section>

                    {/* Audit Log */}
                    <section className="border-2 border-foreground/10 bg-secondary/10">
                      <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-foreground/10 bg-secondary/30">
                        <History size={12} className="text-accent" />
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Activity Log</h4>
                        <span className="ml-auto text-[8px] font-bold text-muted-foreground uppercase">{(form.securityLogs || []).length} EVENTS</span>
                      </div>
                      <div className="p-4 space-y-2 max-h-48 overflow-y-auto font-mono text-[9px] uppercase">
                        {(form.securityLogs || []).length === 0 ? (
                          <p className="text-muted-foreground/40 italic text-center py-4">No activity recorded yet</p>
                        ) : (
                          (form.securityLogs || []).map((log, i) => (
                            <div key={i} className="flex items-start gap-3 border-l-2 border-foreground/10 pl-3 py-1">
                              <Check size={8} className="text-accent mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-foreground/80 leading-none block truncate">{log.action}</span>
                                <span className="text-muted-foreground/40 text-[7px]">{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>

                  {/* === RIGHT COLUMN: SECURITY === */}
                  <div className="space-y-6">
                    <section>

                      <div className="space-y-4">
                        {/* Collaboration Password */}
                        <div className="border-2 border-foreground/10 p-4 bg-secondary/20 space-y-3">
                          <div className="flex items-center gap-2">
                            <Lock size={11} className="text-muted-foreground" />
                            <label className="text-[9px] font-black uppercase tracking-widest">Collaboration Password</label>
                            {form.collaborationPassword && <span className="ml-auto text-[8px] font-black text-accent uppercase bg-accent/10 px-2 py-0.5 border border-accent/20">SET</span>}
                          </div>
                          <input
                            type="password"
                            value={form.collaborationPassword || ''}
                            onChange={(e) => {
                              onUpdate({ collaborationPassword: e.target.value });
                              if (e.target.value && !form.collaborationPassword) addSecurityLog("COLLABORATION PASSWORD SET");
                            }}
                            placeholder="Leave empty for no password"
                            className="w-full bg-background text-xs p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                          />
                          <p className="text-[8px] text-muted-foreground uppercase font-bold">REQUIRED FROM ANYONE ACCESSING THE COLLABORATION LINK.</p>
                        </div>

                        {/* Expiration Date */}
                        <div className="border-2 border-foreground/10 p-4 bg-secondary/20 space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={11} className="text-muted-foreground" />
                            <label className="text-[9px] font-black uppercase tracking-widest">Link Expiration Date</label>
                            {form.linkExpirationDate && new Date(form.linkExpirationDate) < new Date() && (
                              <span className="ml-auto text-[8px] font-black text-red-500 uppercase bg-red-500/10 px-2 py-0.5 border border-red-500/20">EXPIRED</span>
                            )}
                            {form.linkExpirationDate && new Date(form.linkExpirationDate) >= new Date() && (
                              <span className="ml-auto text-[8px] font-black text-accent uppercase bg-accent/10 px-2 py-0.5 border border-accent/20">ACTIVE</span>
                            )}
                          </div>
                          <input
                            type="date"
                            value={form.linkExpirationDate || ''}
                            onChange={(e) => {
                              onUpdate({ linkExpirationDate: e.target.value });
                              addSecurityLog(`EXPIRATION DATE SET: ${e.target.value}`);
                            }}
                            className="w-full bg-background text-xs p-3 border-2 border-foreground/10 outline-none font-mono focus:border-foreground transition-all"
                          />
                          <p className="text-[8px] text-muted-foreground uppercase font-bold">ACCESS LINK STOPS WORKING AFTER THIS DATE.</p>
                        </div>

                        {/* Salt Rotation */}
                        <div className="border-2 border-foreground/10 p-4 bg-secondary/20 space-y-3">
                          <div className="flex items-center gap-2">
                            <RefreshCw size={11} className="text-muted-foreground" />
                            <label className="text-[9px] font-black uppercase tracking-widest">Token Rotation</label>
                            {form.linkRotationSalt && <span className="ml-auto text-[8px] font-black text-accent uppercase bg-accent/10 px-2 py-0.5 border border-accent/20">ACTIVE</span>}
                          </div>
                          <p className="text-[9px] text-muted-foreground uppercase leading-relaxed">
                            Rotating the token instantly invalidates all previously shared collaboration links. Use this if access has been compromised.
                          </p>
                          <button 
                            onClick={() => {
                              const newSalt = Math.random().toString(36).substring(2, 15);
                              onUpdate({ linkRotationSalt: newSalt });
                              addSecurityLog("TOKEN ROTATED — ALL OLD LINKS INVALIDATED");
                              toast.success("TOKEN ROTATED. OLD LINKS ARE NOW INVALID.");
                            }}
                            className="w-full border-2 border-foreground bg-foreground text-background text-[10px] font-black uppercase py-3 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={12} />
                            ROTATE ACCESS TOKEN
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Collaboration Link Export */}
                    <section className="border-2 border-foreground/10 p-4 bg-secondary/10 space-y-4">
                      <div className="flex items-center gap-2">
                        <Share2 size={11} className="text-accent" />
                        <label className="text-[9px] font-black uppercase tracking-widest text-accent">Collaboration Link</label>
                      </div>
                      <div className="bg-background border-2 border-foreground/10 p-3 font-mono text-[9px] break-all text-muted-foreground leading-relaxed select-all">
                        {`${window.location.origin}/collab/${btoa(JSON.stringify({ 
                          id: form.id, 
                          s: form.linkRotationSalt || 'v1',
                          e: form.linkExpirationDate || '0',
                          p: form.collaborationPassword ? '1' : '0' 
                        }))}`}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/collab/${btoa(JSON.stringify({ 
                              id: form.id, 
                              s: form.linkRotationSalt || 'v1', 
                              e: form.linkExpirationDate || '0',
                              p: form.collaborationPassword ? '1' : '0' 
                            }))}`;
                            navigator.clipboard.writeText(url);
                            toast.success("LINK COPIED TO CLIPBOARD");
                            addSecurityLog("COLLABORATION LINK EXPORTED");
                          }}
                          className="bg-foreground text-background py-3 text-[9px] font-black uppercase hover:bg-accent hover:text-accent-foreground transition-all border-2 border-foreground flex items-center justify-center gap-2"
                        >
                          <Copy size={11} />
                          COPY LINK
                        </button>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/collab/${btoa(JSON.stringify({ 
                              id: form.id, 
                              s: form.linkRotationSalt || 'v1', 
                              e: form.linkExpirationDate || '0',
                              p: form.collaborationPassword ? '1' : '0' 
                            }))}`;
                            window.open(url, '_blank');
                          }}
                          className="bg-secondary border-2 border-foreground/20 py-3 text-[9px] font-black uppercase hover:border-foreground transition-all flex items-center justify-center gap-2"
                        >
                          <Unlock size={11} />
                          OPEN LINK
                        </button>
                      </div>
                      {form.linkExpirationDate && new Date(form.linkExpirationDate) < new Date() && (
                        <div className="border-2 border-red-500/30 bg-red-500/5 p-3 flex items-center gap-2">
                          <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
                          <p className="text-[9px] font-black uppercase text-red-500">
                            This link has expired. Update the expiration date to restore access.
                          </p>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;