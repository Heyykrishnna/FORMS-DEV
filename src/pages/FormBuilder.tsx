import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { FormData } from '@/types/form';
import EditTab from '@/components/builder/EditTab';
import ResponsesTab from '@/components/builder/ResponsesTab';
import ShareTab from '@/components/builder/ShareTab';
import SettingsTab from '@/components/builder/SettingsTab';
import { toast } from 'sonner';

const TABS = ['edit', 'responses', 'share', 'settings'] as const;
type Tab = typeof TABS[number];

const FormBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get('tab') as Tab) || 'edit'
  );

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Parse JSON fields
      const questions = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions || [];
      const style = typeof data.style === 'string' ? JSON.parse(data.style) : data.style || {};
      const settings = typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings || {};

      const loadedForm: FormData = {
        id: data.id,
        title: data.title,
        description: data.description,
        questions,
        theme: data.theme || 'brutalist_dark',
        layout: data.layout || 'single_page',
        style,
        
        // Map settings back to root properties
        isAnonymous: settings.isAnonymous ?? true,
        acceptingResponses: settings.acceptingResponses ?? true,
        confirmationMessage: settings.confirmationMessage || 'Thank you for your response!',
        password: settings.password,
        submissionLimit: settings.submissionLimit,
        redirectUrl: settings.redirectUrl,
        showProgressBar: settings.showProgressBar,
        submitButtonText: settings.submitButtonText,
        closeDate: settings.closeDate,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        collectEmails: settings.collectEmails || 'do_not_collect',
        allowResponseEditing: settings.allowResponseEditing ?? false,
        limitOneResponse: settings.limitOneResponse ?? false,
        isQuiz: settings.isQuiz ?? false,
        showQuizResultsToUsers: data.show_quiz_results_to_users ?? settings.showQuizResultsToUsers ?? false,
        responseTheme: data.response_theme || settings.responseTheme || 'normal',
        restrictedDomain: data.restricted_domain || settings.restrictedDomain,
        requireRespondentData: data.require_respondent_data ?? settings.requireRespondentData ?? false,
        seoIndexable: data.seo_indexable ?? settings.seoIndexable ?? true,
        seoKeywords: data.seo_keywords || settings.seoKeywords,
        
        // Security & Team Persistence
        collaborators: settings.collaborators || [],
        collaborationPassword: settings.collaborationPassword,
        linkRotationSalt: settings.linkRotationSalt,
        linkExpirationDate: settings.linkExpirationDate,
        securityLogs: settings.securityLogs || [],
        
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        views: data.views || 0,
        researchGenerationsCount: data.research_generations_count || 0,
      };

      setForm(loadedForm);
    } catch (error) {
      console.error('Error loading form:', error);
      toast.error('FAILED TO LOAD PROTOCOL.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updated: Partial<FormData>) => {
    if (!form || !id) return;
    
    // Optimistic update
    const newForm = { ...form, ...updated };
    setForm(newForm);

    try {
      // Prepare settings object for DB
      const settings = {
        isAnonymous: newForm.isAnonymous,
        acceptingResponses: newForm.acceptingResponses,
        confirmationMessage: newForm.confirmationMessage,
        password: newForm.password,
        submissionLimit: newForm.submissionLimit,
        redirectUrl: newForm.redirectUrl,
        showProgressBar: newForm.showProgressBar,
        submitButtonText: newForm.submitButtonText,
        closeDate: newForm.closeDate,
        seoTitle: newForm.seoTitle,
        seoDescription: newForm.seoDescription,
        collectEmails: newForm.collectEmails,
        allowResponseEditing: newForm.allowResponseEditing,
        limitOneResponse: newForm.limitOneResponse,
        isQuiz: newForm.isQuiz,
        showQuizResultsToUsers: newForm.showQuizResultsToUsers,
        responseTheme: newForm.responseTheme,
        restrictedDomain: newForm.restrictedDomain,
        requireRespondentData: newForm.requireRespondentData,
        seoIndexable: newForm.seoIndexable,
        seoKeywords: newForm.seoKeywords,
        
        // Sync security settings
        collaborators: newForm.collaborators,
        collaborationPassword: newForm.collaborationPassword,
        linkRotationSalt: newForm.linkRotationSalt,
        linkExpirationDate: newForm.linkExpirationDate,
        securityLogs: newForm.securityLogs,
      };

      const dbUpdate: any = {
        title: newForm.title,
        description: newForm.description,
        theme: newForm.theme,
        layout: newForm.layout,
        style: newForm.style, 
        questions: newForm.questions,
        settings,
        response_theme: newForm.responseTheme,
        show_quiz_results_to_users: newForm.showQuizResultsToUsers,
        restricted_domain: newForm.restrictedDomain,
        require_respondent_data: newForm.requireRespondentData,
        seo_indexable: newForm.seoIndexable,
        seo_keywords: newForm.seoKeywords,
        updated_at: new Date().toISOString(),
        status: 'published' // Ensure it's reachable
      };

      const { error } = await supabase
        .from('forms')
        .update(dbUpdate)
        .eq('id', id);

      if (error) {
        // Fallback for missing columns (PGRST204)
        if (error.code === 'PGRST204') {
          console.warn('Database schema mismatch detected. Retrying without top-level columns...', error.message);
          
          // Retry with ONLY standard columns + the settings blob (which contains everything)
          const fallbackUpdate = {
            title: newForm.title,
            description: newForm.description,
            theme: newForm.theme,
            layout: newForm.layout,
            style: newForm.style, 
            questions: newForm.questions,
            settings,
            updated_at: new Date().toISOString()
          };
          
          const { error: retryError } = await supabase
            .from('forms')
            .update(fallbackUpdate)
            .eq('id', id);
            
          if (retryError) throw retryError;
          toast.info('SAVED (NOTE: DB SCHEMA SYNC RECOMMENDED)');
          return;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error saving form:', error);
      toast.error(error?.message?.includes('column') ? 'DB SCHEMA MISMATCH. RUN SQL SETUP.' : 'SAVE FAILED.');
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="font-mono font-bold uppercase animate-pulse">LOADING PROTOCOL...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="border-brutal-3 p-8 text-center">
          <p className="font-bold uppercase text-lg">FORM NOT FOUND</p>
          <Link to="/dashboard" className="mt-4 inline-block border-brutal bg-accent px-6 py-2 text-sm font-bold uppercase text-accent-foreground">
            ← BACK TO DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP BAR */}
      <header className="border-b-2 border-foreground sticky top-0 bg-background z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:py-3 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <Link to="/dashboard" className="text-base sm:text-lg font-bold tracking-widest flex-shrink-0">
              AQORA<span className="text-accent">.</span>
            </Link>
            <span className="text-muted-foreground flex-shrink-0">|</span>
            <input
              value={form.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="bg-transparent text-sm sm:text-lg font-bold uppercase outline-none border-b-2 border-transparent focus:border-accent w-full min-w-0 truncate underline decoration-dotted"
              placeholder="FORM TITLE"
            />
          </div>
          <Link
            to={`/form/${form.id}`}
            target="_blank"
            className="border-brutal bg-accent px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase text-accent-foreground hover:shadow-brutal-sm transition-shadow whitespace-nowrap"
          >
            PREVIEW
          </Link>
        </div>
      </header>

      {/* TABS */}
      <div className="border-b-2 border-foreground">
        <div className="container mx-auto flex px-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-6 py-3 text-sm font-bold uppercase border-r border-foreground/20 transition-colors ${
                activeTab === tab
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1">
        {activeTab === 'edit' && <EditTab form={form} onUpdate={handleUpdate} />}
        {activeTab === 'responses' && <ResponsesTab form={form} />}
        {activeTab === 'share' && <ShareTab form={form} />}
        {activeTab === 'settings' && <SettingsTab form={form} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default FormBuilder;
