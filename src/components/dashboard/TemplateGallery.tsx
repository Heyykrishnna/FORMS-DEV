import { useState, useMemo, useEffect } from 'react';
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

const CATEGORIES = [
  'All',
  'Data Clustering',
  'Data Modeling',
  'Data Science',
  'Data Visualization',
  'Exploratory Analysis',
  'Feature Selection',
  'KPI Dashboards',
  'Natural Language Processing',
  'Parameterized Queries',
  'Reporting',
  'Sentiment Analysis',
  'Snowpark',
  'Time Series'
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: FormTemplate) => void;
}

const TemplateGallery = ({ isOpen, onClose, onSelect }: Props) => {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') return FORM_TEMPLATES;
    
    return FORM_TEMPLATES.filter(template => {
      if (activeCategory === 'Data Clustering') return ['survey', 'feedback'].includes(template.id);
      if (activeCategory === 'Data Modeling') return ['registration', 'order'].includes(template.id);
      if (activeCategory === 'Data Science') return ['survey', 'job', 'feedback'].includes(template.id);
      if (activeCategory === 'Data Visualization') return ['survey', 'order', 'feedback'].includes(template.id);
      if (activeCategory === 'Exploratory Analysis') return ['survey', 'complaint'].includes(template.id);
      if (activeCategory === 'Feature Selection') return ['survey', 'registration'].includes(template.id);
      if (activeCategory === 'KPI Dashboards') return ['order', 'payment', 'feedback'].includes(template.id);
      if (activeCategory === 'Natural Language Processing') return ['complaint', 'support', 'feedback'].includes(template.id);
      if (activeCategory === 'Parameterized Queries') return ['login', 'signup'].includes(template.id);
      if (activeCategory === 'Reporting') return ['contact', 'support', 'feedback'].includes(template.id);
      if (activeCategory === 'Sentiment Analysis') return ['feedback', 'complaint'].includes(template.id);
      if (activeCategory === 'Snowpark') return ['order', 'survey'].includes(template.id);
      if (activeCategory === 'Time Series') return ['rsvp', 'booking', 'leave'].includes(template.id);
      
      return false;
    });
  }, [activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1400px] h-full max-h-[90vh] bg-[#0c0d0f] border border-white/10 rounded-xl overflow-hidden flex flex-row shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Background Grid & Lines */}
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Dots/Grid pattern */}
           <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
           {/* Horizontal Line below header */}
           <div className="absolute top-[160px] left-0 right-0 h-px bg-white/5" />
        </div>

        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-white/30 hover:text-white z-50 transition-colors bg-white/5 rounded-md hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar */}
        <div className="w-[280px] flex-shrink-0 border-r border-white/5 flex flex-col h-full overflow-y-auto relative z-10 py-10 px-4">
          <div className="flex flex-col space-y-1">
            {CATEGORIES.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-left px-4 py-2.5 text-sm transition-colors rounded-md font-sans",
                    activeCategory === cat 
                      ? "bg-white/[0.04] text-white font-medium" 
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                  )}
               >
                 {cat}
               </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative z-10 p-10 md:p-16">
          <div className="max-w-5xl">
            {/* Header Content */}
            <div className="mb-14">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4 font-sans">Templates</h4>
              <h2 className="text-4xl md:text-5xl font-medium font-sans text-white tracking-tight mb-5">{activeCategory}</h2>
              <p className="text-white/40 text-lg max-w-2xl leading-relaxed font-light font-sans">
                Unleash the power of {activeCategory.toLowerCase()}—an unsupervised machine learning technique that uncovers patterns and groups similar data together without the need for labeled data.
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
              
              {/* AI Magic Card */}
              {(activeCategory === 'All' || activeCategory === 'Data Science' || activeCategory === 'Natural Language Processing') && (
              <div 
                onClick={() => onSelect({ id: 'ai-magic', name: 'AI Generation', description: 'Describe your objective and let our models generate the perfect starting point.', data: {}, icon: '' } as any)}
                className="relative border border-white/5 bg-[#121316]/50 p-4 flex flex-col group hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 transition-colors group-hover:border-[#315be8]" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 transition-colors group-hover:border-[#315be8]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 transition-colors group-hover:border-[#315be8]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 transition-colors group-hover:border-[#315be8]" />
                
                <div className="aspect-[16/9] bg-[#0a0a0c] mb-6 relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
                   <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(49,91,232,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <Sparkles className="w-8 h-8 text-[#315be8] mb-3 opacity-80" />
                   <span className="text-[#315be8]/80 text-xs font-sans font-medium tracking-wide uppercase">Ask Aqora AI</span>
                </div>
                <h3 className="text-white font-sans text-xl font-medium mb-1 tracking-tight group-hover:text-[#315be8] transition-colors">AI Magic Create</h3>
                <p className="text-xs font-sans text-white/30 mb-3 uppercase tracking-wider">Aqora Systems</p>
                <p className="text-sm font-sans text-white/40 leading-relaxed font-light">
                  Describe your objective, and watch as the system architects a production-ready protocol in seconds.
                </p>
              </div>
              )}

              {/* Blank Template Card */}
              {(activeCategory === 'All' || activeCategory === 'Exploratory Analysis' || activeCategory === 'Data Modeling') && (
              <div 
                onClick={() => onSelect({ id: 'blank', name: 'Blank Template', description: 'Start from absolute zero. No rules. No limits.', data: {}, icon: 'Ghost' } as any)}
                className="relative border border-white/5 bg-[#121316]/50 p-4 flex flex-col group hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/40" />
                
                <div className="aspect-[16/9] bg-[#0a0a0c] mb-6 relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
                   <Ghost className="w-8 h-8 text-white/20 mb-3" />
                   <span className="text-white/30 font-sans text-xs font-medium tracking-wide uppercase">Empty Canvas</span>
                </div>
                <h3 className="text-white font-sans text-xl font-medium mb-1 tracking-tight transition-colors group-hover:text-white/90">Build from Scratch</h3>
                <p className="text-xs font-sans text-white/30 mb-3 uppercase tracking-wider">System Default</p>
                <p className="text-sm font-sans text-white/40 leading-relaxed font-light">
                  Start from absolute zero. No rules. No limits. Pure creativity.
                </p>
              </div>
              )}

              {/* Mapped Templates */}
              {filteredTemplates.map((template) => {
                const Icon = ICON_MAP[template.icon] || Sparkles;
                return (
                  <div 
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className="relative border border-white/5 bg-[#121316]/50 p-4 flex flex-col group hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                  >
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/40 transition-colors" />
                    
                    <div className="aspect-[16/9] bg-[#0a0a0c] mb-6 relative overflow-hidden flex items-center justify-center border border-white/5 p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />
                        
                        {/* Abstract UI Mockup Inside Card */}
                        <div className="w-full h-full border border-white/5 bg-[#121316] rounded flex flex-col p-3 relative z-10 shadow-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:-translate-y-1 transform">
                          <div className="flex items-center gap-2 mb-3">
                             <Icon className="w-3.5 h-3.5 text-white/40" />
                             <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                          </div>
                          <div className="flex-1 flex gap-3">
                             <div className="w-1/4 h-full bg-white/5 rounded" />
                             <div className="flex-1 flex flex-col gap-2.5 pt-1">
                                <div className="h-2 w-full bg-white/5 rounded-full" />
                                <div className="h-2 w-4/5 bg-white/5 rounded-full" />
                                <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                             </div>
                          </div>
                        </div>
                    </div>
                    <h3 className="text-white font-sans text-xl font-medium mb-1 tracking-tight transition-colors group-hover:text-white/90">
                      {template.name.split('_').join(' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    <p className="text-xs font-sans text-white/30 mb-3 uppercase tracking-wider">Aqora Community</p>
                    <p className="text-sm font-sans text-white/40 leading-relaxed font-light line-clamp-2">
                      {template.description.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
