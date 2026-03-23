import { FORM_TEMPLATES, FormTemplate } from '@/lib/templates';
import { 
  X, ArrowRight, Zap, Ghost, Eye, Mail, UserPlus, LogIn, 
  Calendar, Activity, Search, Briefcase, ShoppingCart, 
  Clock, HelpCircle, CreditCard, LogOut, MessageSquare,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
  Mail, UserPlus, LogIn, Calendar, Activity, Search, 
  Briefcase, ShoppingCart, Clock, HelpCircle, 
  CreditCard, LogOut, MessageSquare, Ghost
};

const GET_SHADOW_COLOR = (id: string, theme?: string) => {
  if (theme === 'neon_industrial' || theme === 'cyber_toxic') return '#00FF41';
  if (theme === 'midnight_vampire') return '#FF0000';
  if (theme === 'royal_gold') return '#FFD700';
  if (theme === 'deep_ocean') return '#0077BE';
  if (theme === 'warm_terminal') return '#FFD580';
  if (theme === 'toxic_mint') return '#00ff88';
  if (theme === 'cyberpunk_pink') return '#ff00ff';
  if (theme === 'glassmorphism') return 'rgba(255,255,255,0.5)';
  if (theme === 'desert_oasis') return '#d2b48c';
  if (theme === 'forest_night') return '#4f7942';
  return '#000';
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: FormTemplate) => void;
}

const TemplateGallery = ({ isOpen, onClose, onSelect }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#F0F0F0] border-4 border-foreground shadow-[12px_12px_0px_#000] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b-4 border-foreground flex items-center justify-between bg-white relative z-10">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              SELECT_TEMPLATE<span className="text-accent">.</span>
            </h2>
            <p className="text-[10px] font-bold uppercase opacity-50 mt-1">CHOOSE A PRECONFIGURED BLUEPRINT FOR YOUR PRODUCTION.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border-2 border-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Templates Grid */}
        <div 
          className="flex-1 overflow-y-auto p-6 md:p-8 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] [background-position:0_0]"
          data-lenis-prevent
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            <div 
              onClick={() => {
                onClose();
                // We need a way to trigger AI modal from here, or handle it in parent.
                // For now, let's assume parent might handle a special 'ai' select or we just use it as a visual trigger.
                // Actually, the easiest is to dispatch a custom event or let the user choose it.
                // Let's add 'ai-magic' to onSelect.
                onSelect({ id: 'ai-magic', name: 'AI MAGIC CREATE', description: 'UNLEASH THE NEURAL ENGINE. DESCRIBE YOUR MISSION, WE BUILD THE PROTOCOL.', data: {}, icon: '' } as any);
              }}
              className="group cursor-pointer border-brutal-4 bg-foreground p-8 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--accent)] relative overflow-hidden flex flex-col min-h-[300px]"
            >
              <div className="absolute top-0 right-0 p-4">
                 <div className="text-[10px] font-black text-accent bg-background px-2 py-1 rotate-12 border-2 border-foreground group-hover:rotate-0 transition-transform">
                    ENHANCED_v4.2
                 </div>
              </div>
              
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white leading-none">
                AI MAGIC_CREATE<span className="text-accent underline decoration-4 underline-offset-4 decoration-accent group-hover:no-underline">.</span>
              </h3>
              
              <p className="text-[12px] font-bold uppercase text-white/50 leading-relaxed mb-auto group-hover:text-white/80 transition-colors">
                UNLEASH THE NEURAL ENGINE. TYPE YOUR OBJECTIVE, AND WATCH AS THE SYSTEM ARCHITECTS A PRODUCTION-READY PROTOCOL IN SECONDS.
              </p>
              
              <div className="mt-8 pt-6 border-t-2 border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-accent tracking-widest">NEURAL_INITIALIZATION</span>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                   <div className="h-1 w-1 bg-accent rounded-full animate-pulse delay-75" />
                   <div className="h-1 w-1 bg-accent rounded-full animate-pulse delay-150" />
                </div>
              </div>
              
              {/* Scanline overlay for AI feel */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
            </div>

            {/* Blank Template Option */}
            <div 
              onClick={() => onSelect({ id: 'blank', name: 'BUILD FROM SCRATCH', description: 'START FROM ABSOLUTE ZERO. NO RULES. NO LIMITS.', data: {}, icon: 'Ghost' })}
              className="group cursor-pointer border-4 border-foreground bg-background p-8 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] relative overflow-hidden flex flex-col min-h-[300px]"
            >
              <div className="h-12 w-12 border-4 border-foreground flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-colors">
                <Ghost className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2 underline decoration-transparent group-hover:decoration-foreground transition-all">BUILD FROM SCRATCH</h3>
              <p className="text-xs font-bold uppercase opacity-40 leading-relaxed mb-8 text-left">START FROM ABSOLUTE ZERO. NO RULES. NO LIMITS. PURE CREATIVITY.</p>
              <div className="mt-auto pt-6 border-t-2 border-foreground/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-accent">EMPTY_ARCHIVE</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </div>
            </div>

            {/* Predefined Templates */}
            {FORM_TEMPLATES.map((template) => {
              const Icon = ICON_MAP[template.icon] || Sparkles;
              const shadowColor = GET_SHADOW_COLOR(template.id, template.data.theme);
              
              return (
                <div 
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="group cursor-pointer border-4 border-foreground bg-background p-0 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--shadow-color)] relative flex flex-col overflow-hidden"
                  style={{ '--shadow-color': shadowColor } as any}
                >
                  {/* Preview Thumbnail (Abstract) */}
                  <div className={cn(
                    "h-32 border-b-4 border-foreground relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-500",
                    template.data.theme === 'brutalist_dark' || template.data.theme === 'midnight_vampire' ? 'bg-black text-white' : 
                    template.data.theme === 'neon_industrial' || template.data.theme === 'cyber_toxic' ? 'bg-[#0a0f1a] text-[#00ff41]' : 
                    template.data.theme === 'royal_gold' ? 'bg-[#1a1a1a] text-[#ffd700]' :
                    template.data.theme === 'deep_ocean' ? 'bg-[#001f3f] text-[#0077be]' :
                    template.data.theme === 'warm_terminal' ? 'bg-[#1a1300] text-[#ffd580]' :
                    template.data.theme === 'toxic_mint' ? 'bg-black text-[#00ff88]' :
                    template.data.theme === 'cyberpunk_pink' ? 'bg-[#1a001a] text-[#ff00ff]' :
                    template.data.theme === 'glassmorphism' ? 'bg-gradient-to-br from-gray-800 to-black text-white' :
                    template.data.theme === 'desert_oasis' ? 'bg-[#faf9f6] text-[#8b4513]' :
                    template.data.theme === 'forest_night' ? 'bg-[#1b3022] text-[#90ee90]' :
                    'bg-white text-black'
                  )}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
                    <Icon className="h-12 w-12 opacity-30 group-hover:opacity-100 transition-all group-hover:scale-110" />
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      <div className="w-8 h-1 bg-current opacity-20" />
                      <div className="w-12 h-1 bg-current opacity-20" />
                      <div className="w-4 h-1 bg-current opacity-20" />
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col bg-background">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                        {template.data.theme?.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-3 group-hover:text-accent transition-colors underline decoration-4 underline-offset-4 decoration-transparent group-hover:decoration-accent">
                      {template.name}
                    </h3>
                    <p className="text-[11px] font-bold uppercase opacity-50 leading-relaxed mb-8 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t-2 border-foreground/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold opacity-30 uppercase">LAYOUT</span>
                          <span className="text-[10px] font-black uppercase">{template.data.layout}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold opacity-30 uppercase">STEPS</span>
                          <span className="text-[10px] font-black uppercase">{template.data.questions?.length || 0}</span>
                        </div>
                      </div>
                      <div className="border-2 border-foreground p-2 group-hover:bg-foreground group-hover:text-background transition-all shadow-none group-hover:shadow-[4px_4px_0px_#000]">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-foreground text-background p-4 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] relative z-20">
          <span>SELECT CONTEXT TO INITIALIZE PRODUCTION</span>
          <span className="opacity-50 flex items-center gap-2">
            <Activity className="h-3 w-3" /> ENGINE_v4.2.0_READY
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
