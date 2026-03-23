
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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
  ArrowUpRight,
  ExternalLink,
  Users,
  Clock,
  LayoutGrid,
  List,
  Filter,
  Sparkles,
  FileText,
  Ghost, 
  Bot, 
  Skull, 
  Pizza, 
  Zap, 
  Crown
} from 'lucide-react';
import { createBlankForm, createFormFromTemplate } from '@/lib/formStore';
import { FormData } from '@/types/form';
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
import React from 'react';

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
      const { data } = await supabase
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
      const { data, error } = await supabase
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
      const { data: formIds } = await supabase
        .from('forms')
        .select('id')
        .eq('user_id', user.id);
      if (!formIds || formIds.length === 0) return;
      
      const counts: Record<string, number> = {};
      await Promise.all(
        formIds.map(async (f) => {
          const { count } = await supabase
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
        showProgressBar: form.showProgressBar,
        submissionLimit: form.submissionLimit,
        closeDate: form.closeDate,
        password: form.password,
        confirmationMessage: form.confirmationMessage,
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
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
        ...generatedForm,     // Override with AI generated values
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this form?')) {
      try {
        const { error } = await supabase.from('forms').delete().eq('id', id);
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
         <p className="text-xl font-bold uppercase animate-pulse">LOADING TERMINAL...</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-foreground font-mono selection:bg-accent selection:text-accent-foreground">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* NAV */}
      <nav className="border-b-4 border-foreground sticky top-0 bg-background z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase hover:text-accent transition-colors flex items-center gap-2">
            REVOX<span className="text-accent decoration-4 underline-offset-4">.</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="border-2 border-foreground px-3 py-2 text-[10px] font-black uppercase hover:bg-foreground hover:text-background transition-all hidden md:flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> ADMIN
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 hover:bg-black/5 px-3 py-1 transition-all rounded-sm group">
                <div className="w-8 h-8 flex items-center justify-center border-2 border-black group-hover:border-accent transition-colors overflow-hidden rounded-full">
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
                      <AgentAvatar seed={user?.email || 'revox'} size={32} />
                    )}
                </div>
                <span className="text-xs font-bold uppercase hidden md:inline-block opacity-50 group-hover:opacity-100 transition-opacity">
                  {user?.email}
                </span>
            </Link>
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="relative group border-brutal bg-foreground px-6 py-2 md:text-sm text-[10px] hidden md:flex font-black uppercase text-background shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all items-center gap-2 overflow-hidden"
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">MAGIC CREATE</span>
            </button>
            <button
              onClick={handleCreate}
              className="border-brutal bg-accent px-6 py-2 md:text-sm text-[10px] font-black uppercase text-accent-foreground shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              BUILD NEW
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-4">
              COMMAND<br /><span className="text-accent">CENTER.</span>
            </h1>
            <p className="text-lg font-bold uppercase opacity-60 max-w-md border-l-4 border-accent pl-4">
              Build, manage, and scale your data collection empire with brutal efficiency.
            </p>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  placeholder="SEARCH PRODUCTIONS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 border-4 border-foreground bg-background text-lg font-bold uppercase rounded-none shadow-brutal active:scale-[0.98] transition-all focus-visible:ring-0 focus-visible:border-accent"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="border-4 border-foreground bg-background px-4 py-2 font-black uppercase text-sm outline-none focus:border-accent shadow-brutal-sm cursor-pointer"
              >
                <option value="all">ALL STATUS</option>
                <option value="active">ACTIVE ONLY</option>
                <option value="inactive">OFFLINE ONLY</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'responses')}
                className="border-4 border-foreground bg-background px-4 py-2 font-black uppercase text-sm outline-none focus:border-accent shadow-brutal-sm cursor-pointer"
              >
                <option value="newest">NEWEST</option>
                <option value="oldest">OLDEST</option>
                <option value="responses">POPULAR</option>
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="flex justify-end mt-4 gap-2">
              <button 
                onClick={() => setView('grid')}
                className={cn("p-2 border-2 border-foreground transition-all", view === 'grid' ? "bg-foreground text-background" : "bg-transparent")}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={cn("p-2 border-2 border-foreground transition-all", view === 'list' ? "bg-foreground text-background" : "bg-transparent")}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'TOTAL FORMS', value: stats.totalForms, icon: Layers, color: 'bg-white' },
            { label: 'TOTAL RESPONSES', value: stats.totalResponses, icon: Activity, color: 'bg-accent text-accent-foreground' },
            { label: 'TOTAL VIEWS', value: stats.totalViews, icon: ExternalLink, color: 'bg-foreground text-background' },
          ].map((stat, i) => (
            <div key={i} className={cn("border-4 border-foreground p-8 shadow-brutal relative overflow-hidden", stat.color)}>
              <stat.icon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 rotate-12" />
              <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">{stat.label}</p>
              <p className="text-5xl font-black italic tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* FORMS LIST */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            PRODUCTIONS<span className="text-accent">.</span>
          </h2>
          <div className="text-xs font-bold uppercase opacity-50">
            {filteredForms.length} RESULTS
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="border-4 border-foreground bg-background p-12 md:p-24 text-center shadow-brutal-lg relative overflow-hidden group">
            {/* Animated Background Splatter */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-accent/10 transition-colors" />
            
            <div className="max-w-xl mx-auto relative z-10">
              <div className="flex justify-center mb-8 gap-4">
                <div className="p-4 border-4 border-foreground bg-white shadow-brutal group-hover:rotate-6 transition-transform">
                  <Bot className="h-12 w-12 text-accent" />
                </div>
                <div className="p-4 border-4 border-foreground bg-accent text-accent-foreground shadow-brutal -rotate-6 group-hover:rotate-0 transition-transform">
                  <Sparkles className="h-12 w-12" />
                </div>
              </div>
              
              <p className="text-4xl md:text-6xl font-black uppercase italic mb-6 tracking-tighter leading-none">
                THE VOID IS <span className="text-accent underline decoration-8 underline-offset-8">LOUD.</span>
              </p>
              <p className="text-lg font-bold uppercase mb-12 opacity-60 max-w-md mx-auto leading-tight">
                Your workspace is empty. Let our Neural Engine architect your first production.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex-1 border-brutal-4 bg-foreground px-12 py-5 text-xl font-black uppercase text-background shadow-brutal-lg hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  MAGIC_CREATE
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 border-brutal-4 bg-accent px-12 py-5 text-xl font-black uppercase text-accent-foreground shadow-brutal-lg hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
                >
                  BUILD NEW →
                </button>
              </div>
            </div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="border-4 border-foreground bg-background p-24 text-center">
            <Search className="h-16 w-16 mx-auto mb-6 opacity-20" />
            <p className="text-2xl font-black uppercase italic tracking-tighter">NO MATCHES IN THE CRYPT.</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-accent font-black uppercase underline underline-offset-4">CLEAR SEARCH</button>
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
                    "border-4 border-foreground bg-background flex group hover:shadow-brutal-lg transition-all relative cursor-pointer",
                    view === 'grid' ? "flex-col" : "flex-row items-center"
                  )}
                >
                  {/* Status Indicator */}
                  <div className={cn(
                    "absolute top-0 right-0 h-4 w-4 border-l-4 border-b-4 border-foreground z-10",
                    form.acceptingResponses ? "bg-accent" : "bg-muted-foreground"
                  )} />

                  {/* Icon / Image Placeholder */}
                  <div className={cn(
                    "bg-secondary border-foreground flex items-center justify-center relative overflow-hidden",
                    view === 'grid' ? "h-48 border-b-4" : "w-24 h-full border-r-4 self-stretch"
                  )}>
                     <div className={`absolute inset-0 opacity-10 ${form.theme === 'brutalist_dark' ? 'bg-black' : 'bg-white'}`} style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                     <FileText size={view === 'grid' ? 48 : 24} className="opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  <div className="p-8 flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-black uppercase italic leading-none tracking-tighter group-hover:text-accent transition-colors truncate pr-2">
                        {form.title || 'UNTITLED PRODUCTION'}
                      </h3>
                      
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 border-2 border-foreground hover:bg-muted transition-colors -mt-2 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-background border-4 border-foreground rounded-none shadow-brutal p-2 min-w-[160px] z-[100]">
                            <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}`)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-none">
                              <Pencil className="h-4 w-4 mr-3" /> EDIT
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/f/${form.id}`, '_blank')} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-none">
                              <ExternalLink className="h-4 w-4 mr-3" /> PREVIEW
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}?tab=responses`)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-none">
                              <BarChart3 className="h-4 w-4 mr-3" /> ANALYTICS
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleDuplicate(form.id, e)} className="font-bold flex items-center py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors rounded-none border-t-2 border-foreground/10 pt-4 mt-2">
                              <Copy className="h-4 w-4 mr-3" /> DUPLICATE
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleDelete(form.id, e)} className="font-bold flex items-center py-3 cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors rounded-none mt-2">
                              <Trash2 className="h-4 w-4 mr-3" /> TERMINATE
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-sm font-bold uppercase opacity-60 mb-6 line-clamp-2 h-10 leading-relaxed">
                      {form.description || 'No description provided.'}
                    </p>

                    <div className="flex gap-4">
                       <span className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
                          <Users size={12} /> {responseCount} Responses
                       </span>
                       <span className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
                          <ExternalLink size={12} /> {form.views || 0} Views
                       </span>
                       <span className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
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
      
      {/* Decorative Footer info */}
      <div className="container mx-auto px-4 pb-12 mt-12 flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-[0.2em]">
        <span>REVOX OS v4.2.0</span>
        <span>CONNECTED TO SUPABASE</span>
        <span>2026 REVOX LABS</span>
      </div>

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
    </div>
  );
};

export default Dashboard;
