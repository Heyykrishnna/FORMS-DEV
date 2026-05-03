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
        
        isAnonymous: settings.isAnonymous ?? true,
        acceptingResponses: settings.acceptingResponses ?? true,
        confirmationMessage: settings.confirmationMessage || 'Thank you for your response!',
        confirmationDescription: settings.confirmationDescription || '',
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
        showSocialShare: data.show_social_share ?? settings.showSocialShare ?? true,
        socialLinks: settings.socialLinks || {},
        responseTheme: data.response_theme || settings.responseTheme || 'normal',
        restrictedDomain: data.restricted_domain || settings.restrictedDomain,
        requireRespondentData: data.require_respondent_data ?? settings.requireRespondentData ?? false,
        seoIndexable: data.seo_indexable ?? settings.seoIndexable ?? true,
        seoKeywords: data.seo_keywords || settings.seoKeywords,
        
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
    
    const newForm = { ...form, ...updated };
    setForm(newForm);

    try {
      
      const settings = {
        isAnonymous: newForm.isAnonymous,
        acceptingResponses: newForm.acceptingResponses,
        confirmationMessage: newForm.confirmationMessage,
        confirmationDescription: newForm.confirmationDescription,
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
        showSocialShare: newForm.showSocialShare,
        socialLinks: newForm.socialLinks,
        responseTheme: newForm.responseTheme,
        restrictedDomain: newForm.restrictedDomain,
        requireRespondentData: newForm.requireRespondentData,
        seoIndexable: newForm.seoIndexable,
        seoKeywords: newForm.seoKeywords,
        
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
        updated_at: new Date().toISOString(),
        status: 'published'
      };

      const { error } = await supabase
        .from('forms')
        .update(dbUpdate)
        .eq('id', id);

      if (error) {
        
        if (error.code === 'PGRST204') {
          console.warn('Database schema mismatch detected. Retrying without top-level columns...', error.message);
          
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
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-medium text-muted-foreground text-sm">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="border border-border rounded-xl bg-card p-8 text-center shadow-sm max-w-sm w-full mx-4">
          <p className="font-medium text-lg">Form Not Found</p>
          <Link to="/dashboard" className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden flex-1">
            <Link to="/dashboard" className="text-base font-bold tracking-tight flex-shrink-0 flex items-center gap-2">
              <span className="hidden sm:inline-block font-sans">aqora</span>
            </Link>
            <div className="w-px h-5 bg-border flex-shrink-0" />
            <input
              value={form.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="bg-transparent text-sm sm:text-base font-medium outline-none border-b border-transparent focus:border-primary w-full max-w-[300px] truncate transition-colors"
              placeholder="Form title"
            />
          </div>
          <Link
            to={`/form/${form.id}`}
            target="_blank"
            className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            Preview
          </Link>
        </div>
      </header>

      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="container mx-auto flex px-4 gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`py-3 text-sm font-medium transition-colors border-b-2 capitalize ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

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
