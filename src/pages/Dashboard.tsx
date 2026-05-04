
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import { 
 Plus, 
 Pencil, 
 Copy, 
 Trash2, 
 MoreVertical, 
 Search, 
 BarChart3, 
 Layers, 
 Activity,
 ExternalLink,
 Users,
 Clock,
 Sparkles, 
 Bot, 
 CornerDownLeft,
 Settings2,
 ArrowUpRight,
 MessageSquare,
} from 'lucide-react';
import { createBlankForm, createFormFromTemplate } from '@/lib/formStore';
import { FormData, Question } from '@/types/form';
import TemplateGallery from '@/components/dashboard/TemplateGallery';
import { FormTemplate } from '@/lib/templates';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AgentAvatar from '@/components/ui/smoothui/agent-avatar';
import AIFormCreator from '@/components/dashboard/AIFormCreator';
import { MorphSurface } from '@/components/ui/smoothui/ai-input';
import React from 'react';
import Footer from '@/components/Footer';
import { generateFormFromPrompt } from '@/services/groq';

const FormPreviewVisual = ({ form, view }: { form: FormData, view: 'grid' | 'list' }) => {
  const isDark = form.theme === 'brutalist_dark' || form.theme === 'cyber_toxic' || form.theme === 'midnight_vampire' || form.theme === 'deep_ocean' || form.theme === 'monochrome';
  const accentColor = form.style?.customAccentColor || (isDark ? '#ffffff' : '#000000');

  // fallback empty state if no questions
  const questions = form.questions?.length ? form.questions : [
    { type: 'short_text' },
    { type: 'long_text' },
    { type: 'multiple_choice' }
  ];

  return (
    <div className={cn(
      "absolute inset-0 flex items-start justify-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.05]",
      view === 'list' && "scale-[0.5] origin-top mt-2"
    )}>
      {/* The Paper/Card */}
      <div className={cn(
        "w-[65%] mt-8 rounded-t-lg shadow-2xl flex flex-col p-4 gap-4 border-x border-t transition-all duration-700 ease-out group-hover:-translate-y-4",
        isDark ? "bg-[#111111] border-white/10 shadow-black/50" : "bg-white border-black/10 shadow-black/5",
        view === 'list' ? "h-[200px]" : "h-[120%]"
      )}>
        {/* Banner area if form has banner (mocked) */}
        <div className={cn("h-8 w-full rounded-md opacity-50", isDark ? "bg-white/5" : "bg-black/5")} style={{ backgroundColor: accentColor + '20' }} />

        {/* Title Area */}
        <div className="space-y-2 mb-2">
          <div className={cn("h-4 w-3/4 rounded-sm", isDark ? "bg-white/80" : "bg-black/80")} />
          <div className={cn("h-2 w-1/2 rounded-sm", isDark ? "bg-white/30" : "bg-black/30")} />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {questions.slice(0, 3).map((q: Question, i: number) => (
            <div key={i} className="space-y-2">
              <div className={cn("h-2 w-1/3 rounded-sm", isDark ? "bg-white/50" : "bg-black/50")} />
              {q.type === 'long_text' ? (
                <div className={cn("h-12 w-full rounded-md border", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5")} />
              ) : q.type === 'multiple_choice' || q.type === 'single_choice' ? (
                <div className="space-y-2 pl-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(q.type === 'single_choice' ? "h-3 w-3 rounded-full" : "h-3 w-3 rounded-sm", isDark ? "border border-white/20" : "border border-black/20")} />
                    <div className={cn("h-2 w-1/4 rounded-sm", isDark ? "bg-white/30" : "bg-black/30")} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(q.type === 'single_choice' ? "h-3 w-3 rounded-full" : "h-3 w-3 rounded-sm", isDark ? "border border-white/20" : "border border-black/20")} />
                    <div className={cn("h-2 w-1/5 rounded-sm", isDark ? "bg-white/30" : "bg-black/30")} />
                  </div>
                </div>
              ) : (
                <div className={cn("h-7 w-full rounded-md border", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5")} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const VerticalScale = ({className} : {className?: string}) => {
  return (
  <div
      className={cn("w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-[var(--pattern)]", className)}
    />
  )
}

const Dashboard = () => {
 const [forms, setForms] = useState<FormData[]>([]);
 const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
 const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'responses'>('newest');
 const [isGalleryOpen, setIsGalleryOpen] = useState(false);
 const [view, setView] = useState<'grid' | 'list'>('grid');
 const [isAIModalOpen, setIsAIModalOpen] = useState(false);
 const [aiPrompt, setAiPrompt] = useState('');
 const [isGenerating, setIsGenerating] = useState(false);
 
 const navigate = useNavigate();
 const { user, isAdmin } = useAuth();
 interface UserProfile {
  username: string;
  avatar_url: string;
 }
 const [profile, setProfile] = useState<UserProfile | null>(null);

 const AVATARS = {
  'user': <AgentAvatar seed="user" size={24} />,
  'ghost': <AgentAvatar seed="ghost" size={24} />,
  'bot': <AgentAvatar seed="bot" size={24} />,
  'skull': <AgentAvatar seed="skull" size={24} />,
  'pizza': <AgentAvatar seed="pizza" size={24} />,
  'zap': <AgentAvatar seed="zap" size={24} />,
  'crown': <AgentAvatar seed="crown" size={24} />,
 };

 const loadProfile = React.useCallback(async () => {
  try {
   const { data } = await apiClient
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user?.id)
    .single();
   setProfile(data);
  } catch (e) {
   console.error('Error loading profile:', e);
  }
 }, [user?.id]);

 const loadForms = React.useCallback(async () => {
  try {
   if (!user) return;
   const { data, error } = await apiClient
    .from('forms')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
   
   if (error) throw error;
   
   const mappedForms: FormData[] = data?.map(f => {
    const settings = typeof f.settings === 'string' ? JSON.parse(f.settings) : f.settings || {};
    return {
     id: f.id,
     user_id: f.user_id,
     title: f.title,
     description: f.description,
     questions: typeof f.questions === 'string' ? JSON.parse(f.questions) : f.questions || [],
     theme: f.theme || 'brutalist_dark',
     layout: f.layout || 'single_page',
     createdAt: f.created_at,
     updatedAt: f.updated_at,
     style: typeof f.style === 'string' ? JSON.parse(f.style) : f.style || {},
     
     isAnonymous: settings.isAnonymous ?? true,
     acceptingResponses: settings.acceptingResponses ?? true,
     confirmationMessage: settings.confirmationMessage || 'Thank you!',
     password: settings.password,
     submissionLimit: settings.submissionLimit,
     redirectUrl: settings.redirectUrl,
     showProgressBar: settings.showProgressBar ?? false,
     submitButtonText: settings.submitButtonText,
     closeDate: settings.closeDate,
     seoTitle: settings.seoTitle,
     seoDescription: settings.seoDescription,
     collectEmails: settings.collectEmails || 'do_not_collect',
     allowResponseEditing: settings.allowResponseEditing ?? false,
     limitOneResponse: settings.limitOneResponse ?? false,
     isQuiz: settings.isQuiz ?? false,
     showQuizResultsToUsers: settings.showQuizResultsToUsers ?? false,
     responseTheme: settings.responseTheme || 'normal',
     restrictedDomain: settings.restrictedDomain,
     requireRespondentData: settings.requireRespondentData ?? false,
     seoIndexable: settings.seoIndexable ?? true,
     seoKeywords: settings.seoKeywords,
     views: f.views || 0,
     researchGenerationsCount: f.research_generations_count || 0,
    };
   }) || [];
   
   setForms(mappedForms);
  } catch (error) {
   console.error('Error loading forms:', error);
  } finally {
   setLoading(false);
  }
 }, [user]);

 const loadResponseCounts = React.useCallback(async () => {
  try {
   if (!user) return;
   // Fetch response counts for all user's forms
   const { data: formIds } = await apiClient
    .from('forms')
    .select('id')
    .eq('user_id', user.id);
   if (!formIds || formIds.length === 0) return;
   
   const counts: Record<string, number> = {};
   await Promise.all(
    formIds.map(async (f) => {
     const { count } = await apiClient
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', f.id);
     counts[f.id] = count || 0;
    })
   );
   setResponseCounts(counts);
  } catch (e) {
   console.error('Error loading response counts:', e);
  }
 }, [user]);

 useEffect(() => {
  if (user) {
   loadForms();
   loadResponseCounts();
   loadProfile();
  }
 }, [user, loadForms, loadResponseCounts, loadProfile]);

 const saveFormToSupabase = async (form: FormData) => {
  if (!user) return;
  
  // Map Frontend FormData back to DB Schema
  // DB columns: title, description, status, layout, theme, style (json), settings (json), questions (json)
  const dbForm = {
   id: form.id,
   user_id: user.id,
   title: form.title,
   description: form.description,
   status: form.acceptingResponses ? 'published' : 'draft', // Simplification
   layout: form.layout,
   theme: form.theme,
   style: form.style,
   questions: form.questions,
   settings: {
    isAnonymous: form.isAnonymous,
    acceptingResponses: form.acceptingResponses,
    isQuiz: form.isQuiz,
    showQuizResultsToUsers: form.showQuizResultsToUsers,
    showProgressBar: form.showProgressBar,
    submissionLimit: form.submissionLimit,
    closeDate: form.closeDate,
    password: form.password,
    confirmationMessage: form.confirmationMessage,
   },
   updated_at: new Date().toISOString()
  };

  const { error } = await apiClient
   .from('forms')
   .upsert(dbForm);
   
  if (error) throw error;
 };

 const handleCreate = () => {
  setIsGalleryOpen(true);
 };
 const handleTemplateSelect = async (template: FormTemplate) => {
  if (template.id === 'ai-magic') {
   setIsGalleryOpen(false);
   setIsAIModalOpen(true);
   return;
  }
  
  try {
   if (!user) return;
   
   const rawForm = template.id === 'blank' ? createBlankForm() : createFormFromTemplate(template);
   
   const newForm: FormData = {
    ...rawForm,
   };

   await saveFormToSupabase(newForm);
   navigate(`/builder/${newForm.id}`);
   
  } catch (error) {
   console.error(error);
   toast.error('Failed to create form');
  }
  setIsGalleryOpen(false);
 };

 const handleAISuccess = async (generatedForm: Partial<FormData>) => {
  try {
   if (!user) return;
   
   const newForm: FormData = {
    ...createBlankForm(), // Start with default values
    ...generatedForm,   // Override with AI generated values
    id: crypto.randomUUID(), // Always new ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
   } as FormData;

   await saveFormToSupabase(newForm);
   navigate(`/builder/${newForm.id}`);
  } catch (error) {
   console.error(error);
   toast.error('Failed to save AI generated form');
  }
 };

 const handleGenerateFromPrompt = async (promptText: string) => {
   if (!promptText.trim() || isGenerating) return;
   
   setIsGenerating(true);
   const toastId = toast.loading("AI is brainstorming your form...", {
     description: "Analyzing objective and designing structure...",
   });
   
   try {
     const generatedForm = await generateFormFromPrompt(promptText);
     toast.success("Form Generated!", {
       id: toastId,
       description: `Created "${generatedForm.title}" with ${generatedForm.questions?.length} steps.`,
     });
     await handleAISuccess(generatedForm);
     setAiPrompt('');
   } catch (error: any) {
     console.error(error);
     toast.error("Generation Failed", {
       id: toastId,
       description: error.message || "Something went wrong during generation.",
     });
   } finally {
     setIsGenerating(false);
   }
 };

 const handleDelete = async (id: string, e: React.MouseEvent) => {
  e.stopPropagation();
  if (confirm('Are you sure you want to delete this form?')) {
   try {
    const { error } = await apiClient.from('forms').delete().eq('id', id);
    if (error) throw error;
    setForms(prev => prev.filter(f => f.id !== id));
    toast.success('Form deleted');
   } catch (error) {
    toast.error('Failed to delete form');
   }
  }
 };

 const handleDuplicate = async (id: string, e: React.MouseEvent) => {
  e.stopPropagation();
  try {
   const form = forms.find(f => f.id === id);
   if (!form || !user) return;
   
   const newId = crypto.randomUUID();
   const newForm = {
    ...form,
    id: newId,
    title: `${form.title} (Copy)`,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
   };
   
   await saveFormToSupabase(newForm);
   setForms(prev => [newForm, ...prev]);
   toast.success('Form duplicated');
  } catch (error) {
   toast.error('Failed to duplicate form');
  }
 };

 const filteredForms = useMemo(() => {
  return forms
   .filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               f.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
               (statusFilter === 'active' && f.acceptingResponses) ||
               (statusFilter === 'inactive' && !f.acceptingResponses);
    return matchesSearch && matchesStatus;
   })
   .sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime();
    if (sortBy === 'oldest') return new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime();
    // if (sortBy === 'responses') return getResponses(b.id).length - getResponses(a.id).length; // Fetch count later
    return 0;
   });
 }, [forms, searchQuery, statusFilter, sortBy]);

 const stats = useMemo(() => {
  const totalForms = forms.length;
  const totalResponses = Object.values(responseCounts).reduce((acc: number, c: number) => acc + c, 0);
  const activeForms = forms.filter(f => f.acceptingResponses).length;
  const totalViews = forms.reduce((acc, f) => acc + (f.views || 0), 0);
  return { totalForms, totalResponses, activeForms, totalViews };
 }, [forms, responseCounts]);

 if (loading) {
   return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
     <p className="text-xl font-bold animate-pulse">Loading...</p>
    </div>
   );
 }

 return (
  <div className="relative min-h-screen bg-[#F0F0F0] text-foreground font-mono selection:bg-accent selection:text-accent-foreground">
   {/* Background Pattern */}
    <VerticalScale className="absolute inset-y-0 left-0 mx-auto" />
    <VerticalScale className="absolute inset-y-0 right-0 mx-auto" />
   <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

   {/* NAV */}
   <nav className="border-b border-foreground sticky top-0 bg-background z-50">
    <div className="container mx-auto flex items-center justify-between px-4 py-4">
     <Link to="/" className="text-[24px] font-sans font-medium tracking-tight hover:text-accent transition-colors flex items-center gap-2">
      aqora
     </Link>
     <div className="flex items-center gap-4">
      {isAdmin && (
       <Link to="/admin" className="border border-foreground px-3 py-2 text-[10px] font-medium hover:bg-foreground hover:text-background transition-all hidden md:flex items-center gap-1.5">
        <Activity className="w-3 h-3" /> ADMIN
       </Link>
      )}
      <Link to="/profile" className="flex items-center gap-2 hover:bg-black/5 px-3 py-1 transition-all rounded-xl group">
        <div className="w-8 h-8 flex items-center justify-center border border-black group-hover:border-accent transition-colors overflow-hidden rounded-full">
          {profile?.avatar_url && AVATARS[profile.avatar_url as keyof typeof AVATARS] ? (
           <div className="w-full h-full bg-black text-white flex items-center justify-center">
            {AVATARS[profile.avatar_url as keyof typeof AVATARS]}
           </div>
          ) : profile?.avatar_url ? (
           <img 
            src={profile.avatar_url} 
            alt="Avatar" 
            className="w-full h-full object-cover"
            onError={(e) => {
             (e.target as HTMLImageElement).style.display = 'none';
            }}
           />
          ) : (
           <AgentAvatar seed={user?.email || 'aqora'} size={32} />
          )}
        </div>
        <span className="text-xs font-bold hidden md:inline-block opacity-50 group-hover:opacity-100 transition-opacity">
         {user?.email}
        </span>
      </Link>
      <div className="relative w-[130px] h-10 hidden md:block">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[100]">
          <MorphSurface />
        </div>
      </div>
      <button
       onClick={handleCreate}
       className="h-10 border rounded-xl bg-accent px-6 md:text-sm text-[10px] font-medium text-accent-foreground shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
      >
       <Plus className="h-5 w-5" />
       New Form
      </button>
     </div>
    </div>
   </nav>

   <main className="container mx-auto px-4 py-24 relative z-10">
    {/* HEADER SECTION */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
     <div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-sans leading-none mb-4">
       ARCHITECT<span className="text-accent">.</span>
      </h1>
      <p className="text-lg font-light opacity-60 max-w-md">
       Design, deploy, and decode your information workflows.
      </p>
     </div>

     <div className="flex-1 max-w-2xl">
      <div className="flex flex-col md:flex-row gap-4">
       <div className="relative group flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Input
         placeholder="Search forms..."
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         className="pl-12 py-6 border border-foreground font-sans bg-background text-lg font-bold rounded-xl shadow-sm active:scale-[0.98] transition-all focus-visible:ring-0 focus-visible:border-accent"
        />
       </div>
       <select 
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
        className="border border-foreground font-sans bg-background px-4 py-2 font-medium text-sm outline-none focus:border-accent shadow-sm cursor-pointer rounded-xl"
       >
        <option value="all">ALL STATUS</option>
        <option value="active">ACTIVE ONLY</option>
        <option value="inactive">OFFLINE ONLY</option>
       </select>
       <select 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'responses')}
        className="border border-foreground font-sans bg-background px-4 py-2 font-medium text-sm outline-none focus:border-accent shadow-sm cursor-pointer rounded-xl"
       >
        <option value="newest">NEWEST</option>
        <option value="oldest">OLDEST</option>
        <option value="responses">POPULAR</option>
       </select>
      </div>
     </div>
    </div>

    {/* AI CHAT MODULE */}
    <div className="mb-16 relative py-12">
      {/* Decorative masked dotted background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div 
          className="absolute inset-0 opacity-[0.3]" 
          style={{ 
            backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', 
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
          }} 
        />
      </div>

      <div className="bg-[#15161c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative font-sans flex flex-col max-w-5xl mx-auto w-full z-10">
        {/* Inner dotted/line subtle pattern matching the theme */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="p-5 md:p-6 relative z-10 flex flex-col">
          <div className="flex items-start gap-4">
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask a question and chat in a thread or build a new form..."
              className="w-full bg-transparent text-[#e2e8f0] placeholder-[#64748b] text-[15px] md:text-[16px] font-sans resize-none outline-none min-h-[50px] mt-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (aiPrompt.trim()) {
                    handleGenerateFromPrompt(aiPrompt);
                  }
                }
              }}
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <div className="flex bg-[#1f2029] rounded-lg border border-white/10 p-1">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2c3a] text-[#e2e8f0] text-xs font-medium rounded-md shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5" /> Ask
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (aiPrompt.trim()) {
                  handleGenerateFromPrompt(aiPrompt);
                }
              }}
              disabled={isGenerating}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748b] hover:text-[#e2e8f0] transition-colors"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Context Footer */}
        <div className="border-t border-white/10 bg-[#121319] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-4 relative z-10">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Settings2 className="w-4 h-4" />
            Guide the Aqora agent to generate forms accurately.
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#64748b] hidden md:inline-block mr-1">Suggestions:</span>
            <button onClick={() => setAiPrompt("Event Registration")} className="px-3 py-1.5 rounded-md bg-[#1f2029] hover:bg-[#2a2c3a] text-[#94a3b8] border border-white/5 transition-colors">
              Event Registration
            </button>
            <button onClick={() => setAiPrompt("User Feedback")} className="px-3 py-1.5 rounded-md bg-[#1f2029] hover:bg-[#2a2c3a] text-[#94a3b8] border border-white/5 transition-colors">
              User Feedback
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* FORMS LIST */}
    <div className="mb-8 flex items-center justify-between">
     <h2 className="text-2xl font-bold font-sans tracking-tight">
      Forms<span className="text-accent">.</span>
     </h2>
     <div className="text-xs font-bold opacity-50">
      {filteredForms.length} RESULTS
     </div>
    </div>

    {forms.length === 0 ? (
     <div className="border border-foreground bg-background p-12 md:p-24 text-center shadow-md relative overflow-hidden group rounded-xl">
      {/* Animated Background Splatter */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-accent/10 transition-colors" />
      
      <div className="max-w-xl mx-auto relative z-10">
       <div className="flex justify-center mb-8 gap-4">
        <div className="p-4 border border-foreground bg-white shadow-sm group-hover:rotate-6 transition-transform">
         <Bot className="h-12 w-12 text-accent" />
        </div>
        <div className="p-4 border border-foreground bg-accent text-accent-foreground shadow-sm -rotate-6 group-hover:rotate-0 transition-transform">
         <Sparkles className="h-12 w-12" />
        </div>
       </div>
       
       <p className="text-4xl md:text-6xl font-medium mb-6 tracking-tight leading-none">
        No forms yet.
       </p>
       <p className="text-lg font-bold mb-12 opacity-60 max-w-md mx-auto leading-tight">
        Your workspace is empty. Create your first form.
       </p>
       
       <div className="flex flex-col sm:flex-row gap-6">
        <button
         onClick={() => setIsAIModalOpen(true)}
         className="flex-1 border rounded-xl bg-foreground px-12 py-5 text-xl font-medium text-background shadow-md hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-3"
        >
         Ask Aqora AI
        </button>
        <button
         onClick={handleCreate}
         className="flex-1 border rounded-xl bg-accent px-12 py-5 text-xl font-medium text-accent-foreground shadow-md hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
        >
         New Form →
        </button>
       </div>
      </div>
     </div>
    ) : filteredForms.length === 0 ? (
     <div className="border border-foreground bg-background p-24 text-center rounded-xl">
      <Search className="h-16 w-16 mx-auto mb-6 opacity-20" />
      <p className="text-2xl font-medium tracking-tight">No forms found.</p>
      <button onClick={() => setSearchQuery('')} className="mt-4 text-accent font-medium underline underline-offset-4">CLEAR SEARCH</button>
     </div>
    ) : (
     <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
      {filteredForms.map((form) => {
       // const responses = getResponses(form.id); 
       const responseCount = responseCounts[form.id] || 0;
       return (
        <div 
         key={form.id} 
         onClick={() => navigate(`/builder/${form.id}`)}
         className={cn(
          "border border-foreground bg-background flex group hover:shadow-md transition-all relative cursor-pointer rounded-xl overflow-hidden",
          view === 'grid' ? "flex-col" : "flex-row items-center"
         )}
        >
         {/* Status Indicator */}
         <div className={cn(
          "absolute top-0 right-0 h-4 w-4 border-l-2 border-b border-foreground z-10",
          form.acceptingResponses ? "bg-accent" : "bg-muted-foreground"
         )} />

         <div className={cn(
          "bg-secondary border-foreground flex items-center justify-center relative overflow-hidden",
          view === 'grid' ? "h-48 border-b" : "w-24 h-full border-r self-stretch shrink-0"
         )}>
           <div className={`absolute inset-0 opacity-10 ${form.theme === 'brutalist_dark' ? 'bg-black' : 'bg-white'}`} style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
           <FormPreviewVisual form={form} view={view} />
         </div>

         <div className="p-8 flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
           <h3 className="text-xl font-bold font-sans leading-none tracking-tight group-hover:text-accent transition-colors truncate pr-2">
            {form.title || 'UNTITLED PRODUCTION'}
           </h3>
           
           <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
             <DropdownMenuTrigger asChild>
              <button className="p-2 border border-foreground hover:bg-muted transition-colors -mt-2 -mr-2 relative z-20 rounded-xl">
               <MoreVertical className="h-4 w-4" />
              </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="bg-background border border-foreground rounded-xl shadow-sm p-2 min-w-[160px] z-[100]">
              <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}`)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-xl">
               <Pencil className="h-4 w-4 mr-3" /> EDIT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/f/${form.id}`, '_blank')} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-xl">
               <ExternalLink className="h-4 w-4 mr-3" /> PREVIEW
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}?tab=responses`)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-xl">
               <BarChart3 className="h-4 w-4 mr-3" /> ANALYTICS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleDuplicate(form.id, e)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-xl border-t-2 border-foreground/10 pt-4 mt-2">
               <Copy className="h-4 w-4 mr-3" /> DUPLICATE
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleDelete(form.id, e)} className="font-bold flex items-center py-3 cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors rounded-xl mt-2">
               <Trash2 className="h-4 w-4 mr-3" /> TERMINATE
              </DropdownMenuItem>
             </DropdownMenuContent>
            </DropdownMenu>
           </div>
          </div>

          <p className="text-sm font-light font-sans opacity-60 mb-6 line-clamp-2 h-10 leading-relaxed">
           {form.description || 'No description provided.'}
          </p>

          <div className="flex gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-medium opacity-60">
             <Users size={12} /> {responseCount} Responses
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium opacity-60">
             <ExternalLink size={12} /> {form.views || 0} Views
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium opacity-60">
             <Clock size={12} /> {new Date(form.updatedAt).toLocaleDateString()}
            </span>
          </div>
         </div>
        </div>
       );
      })}
     </div>
    )}
   </main>

   <TemplateGallery 
    isOpen={isGalleryOpen} 
    onClose={() => setIsGalleryOpen(false)} 
    onSelect={handleTemplateSelect} 
   />

   <AIFormCreator 
    isOpen={isAIModalOpen}
    onClose={() => setIsAIModalOpen(false)}
    onSuccess={handleAISuccess}
   />

   <Footer />
  </div>
 );
};

export default Dashboard;
