import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { FormData, FormResponse, FormTheme, Question } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Star, Check, FormInput, Send, CheckCircle2, AlertCircle, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner';

const THEME_STYLES: Record<FormTheme, { wrapper: string; card: string; accent: string; selected: string; input: string; button: string; label: string }> = {
  brutalist_dark: {
    wrapper: 'bg-[#000] text-[#fff] min-h-screen',
    card: 'border-2 border-[#fff] p-6',
    accent: 'text-[#FF4500]',
    selected: 'bg-[#FF4500] text-[#fff] border-[#FF4500]',
    input: 'bg-transparent border-2 border-[#fff] text-[#fff] p-2.5 w-full outline-none focus:border-[#FF4500] placeholder:text-[#666]',
    button: 'bg-[#FF4500] text-[#fff] border-2 border-[#fff] px-8 py-3 font-bold uppercase shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all',
    label: 'text-xs font-bold uppercase tracking-wider text-[#999]',
  },
  clean_light: {
    wrapper: 'bg-[#fafafa] text-[#111] min-h-screen',
    card: 'border-2 border-[#111] p-6 bg-[#fff]',
    accent: 'text-[#111]',
    selected: 'bg-[#111] text-[#fff] border-[#111]',
    input: 'bg-[#fff] border-2 border-[#ddd] text-[#111] p-2.5 w-full outline-none focus:border-[#111] placeholder:text-[#aaa]',
    button: 'bg-[#111] text-[#fff] border-2 border-[#111] px-8 py-3 font-bold uppercase hover:bg-[#333] transition-colors',
    label: 'text-xs font-bold uppercase tracking-wider text-[#888]',
  },
  neon_industrial: {
    wrapper: 'bg-[#0a0f1a] text-[#00ff41] min-h-screen',
    card: 'border-2 border-[#00ff41] p-6',
    accent: 'text-[#00ff41]',
    selected: 'bg-[#00ff41] text-[#0a0f1a] border-[#00ff41]',
    input: 'bg-transparent border-2 border-[#00ff41]/50 text-[#00ff41] p-2.5 w-full outline-none focus:border-[#00ff41] placeholder:text-[#00ff41]/30',
    button: 'bg-[#00ff41] text-[#0a0f1a] border-2 border-[#00ff41] px-8 py-3 font-bold uppercase hover:bg-[#00cc33] transition-colors',
    label: 'text-xs font-bold uppercase tracking-wider text-[#00ff41]/60',
  },
  monochrome: {
    wrapper: 'bg-[#f0f0f0] text-[#333] min-h-screen',
    card: 'border-2 border-[#333] p-6 bg-[#fff]',
    accent: 'text-[#333]',
    selected: 'bg-[#333] text-[#fff] border-[#333]',
    input: 'bg-[#f5f5f5] border-2 border-[#ccc] text-[#333] p-2.5 w-full outline-none focus:border-[#333] placeholder:text-[#999]',
    button: 'bg-[#333] text-[#fff] border-2 border-[#333] px-8 py-3 font-bold uppercase hover:bg-[#555] transition-colors',
    label: 'text-xs font-bold uppercase tracking-wider text-[#999]',
  },
  warm_terminal: {
    wrapper: 'bg-[#1a1208] text-[#e6a030] min-h-screen',
    card: 'border-2 border-[#e6a030]/50 p-6',
    accent: 'text-[#e6a030]',
    selected: 'bg-[#e6a030] text-[#1a1208] border-[#e6a030]',
    input: 'bg-transparent border-2 border-[#e6a030]/30 text-[#e6a030] p-2.5 w-full outline-none focus:border-[#e6a030] placeholder:text-[#e6a030]/30',
    button: 'bg-[#e6a030] text-[#1a1208] border-2 border-[#e6a030] px-8 py-3 font-bold uppercase hover:bg-[#cc8a20] transition-colors',
    label: 'text-xs font-bold uppercase tracking-wider text-[#e6a030]/60',
  },
  cyber_toxic: {
    wrapper: 'bg-[#ffff00] text-[#000] min-h-screen',
    card: 'border-4 border-[#000] p-6 bg-[#ffff00]',
    accent: 'text-[#ff00ff]',
    selected: 'bg-[#ff00ff] text-[#fff] border-[#000]',
    input: 'bg-[#fff] border-4 border-[#000] text-[#000] p-2.5 w-full outline-none focus:bg-[#ff00ff] focus:text-[#fff] placeholder:text-[#000]/30',
    button: 'bg-[#000] text-[#ffff00] border-4 border-[#000] px-8 py-3 font-bold uppercase shadow-[6px_6px_0px_#ff00ff] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all',
    label: 'text-xs font-black uppercase tracking-tighter text-[#000]',
  },
  retro_paper: {
    wrapper: 'bg-[#f4f1ea] text-[#2c2c2c] min-h-screen',
    card: 'border-2 border-[#2c2c2c] p-8 shadow-sm bg-[#fcfaf5]',
    accent: 'text-[#8b4513]',
    selected: 'bg-[#8b4513] text-[#fff] border-[#2c2c2c]',
    input: 'bg-transparent border-b-2 border-[#2c2c2c] text-[#2c2c2c] p-2 w-full outline-none focus:border-[#8b4513] placeholder:text-[#ccc]',
    button: 'bg-[#2c2c2c] text-[#f4f1ea] px-8 py-3 hover:text-white font-bold uppercase tracking-widest hover:bg-[#444] transition-colors',
    label: 'text-xs font-serif italic text-[#666]',
  },
  midnight_vampire: {
    wrapper: 'bg-[#0a0000] text-[#ff0000] min-h-screen',
    card: 'border-2 border-[#ff0000] p-6 bg-[#1a0000]',
    accent: 'text-[#ffd700]',
    selected: 'bg-[#ff0000] text-[#000] border-[#ffd700]',
    input: 'bg-[#000] border-2 border-[#ff0000]/50 text-[#ff0000] p-3 w-full outline-none focus:border-[#ffd700] placeholder:text-[#ff0000]/20',
    button: 'bg-[#ff0000] text-[#000] border-2 border-[#ffd700] px-8 py-3 font-bold uppercase hover:bg-[#cc0000] transition-colors',
    label: 'text-xs font-bold uppercase tracking-[0.2em] text-[#ff0000]/60',
  },
  deep_ocean: {
    wrapper: 'bg-[#001f3f] text-[#7fdbff] min-h-screen',
    card: 'border-2 border-[#7fdbff] p-6 bg-[#001f3f]/50 backdrop-blur-sm',
    accent: 'text-[#39cccc]',
    selected: 'bg-[#7fdbff] text-[#001f3f] border-[#39cccc]',
    input: 'bg-[#001f3f] border-2 border-[#7fdbff]/30 text-[#7fdbff] p-2.5 w-full outline-none focus:border-[#7fdbff] placeholder:text-[#7fdbff]/20',
    button: 'bg-[#39cccc] text-[#001f3f] border-2 border-[#7fdbff] px-8 py-3 font-bold uppercase hover:bg-[#2eadad] transition-all',
    label: 'text-xs font-bold uppercase text-[#7fdbff]/50',
  },
  royal_gold: {
    wrapper: 'bg-black text-[#d4af37] min-h-screen',
    card: 'border-[3px] border-[#d4af37] p-8 bg-black shadow-[0_0_20px_rgba(212,175,55,0.1)]',
    accent: 'text-white',
    selected: 'bg-[#d4af37] text-black border-white',
    input: 'bg-transparent border-2 border-[#d4af37]/40 text-[#d4af37] p-3 w-full outline-none focus:border-[#d4af37] placeholder:text-[#d4af37]/30',
    button: 'bg-[#d4af37] text-black border-2 border-white px-8 py-3 font-bold uppercase hover:opacity-90 transition-opacity font-serif',
    label: 'text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/40',
  },
  toxic_mint: {
    wrapper: 'bg-[#000] text-[#00ff88] min-h-screen font-mono',
    card: 'border-4 border-[#00ff88] p-8 bg-[#000] shadow-[8px_8px_0px_#00ff88]',
    accent: 'text-[#fff]',
    selected: 'bg-[#00ff88] text-[#000] border-[#fff]',
    input: 'bg-[#000] border-4 border-[#00ff88]/50 text-[#00ff88] p-3 w-full outline-none focus:border-[#fff] placeholder:text-[#00ff88]/20',
    button: 'bg-[#00ff88] text-[#000] border-4 border-[#00ff88] px-8 py-3 font-black uppercase shadow-[6px_6px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all',
    label: 'text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff88]/50',
  },
  cyberpunk_pink: {
    wrapper: 'bg-[#1a001a] text-[#ff00ff] min-h-screen font-mono',
    card: 'border-4 border-[#00ffff] p-8 bg-[#1a001a] shadow-[10px_10px_0px_#ff00ff]',
    accent: 'text-[#00ffff]',
    selected: 'bg-[#ff00ff] text-[#fff] border-[#00ffff]',
    input: 'bg-[#1a001a] border-2 border-[#ff00ff]/50 text-[#ff00ff] p-3 w-full outline-none focus:border-[#00ffff] placeholder:text-[#ff00ff]/20',
    button: 'bg-[#ff00ff] text-[#fff] border-4 border-[#00ffff] px-8 py-3 font-black uppercase hover:bg-[#ff00ff]/80 transition-all shadow-[0_0_15px_rgba(255,0,255,0.5)]',
    label: 'text-xs font-black uppercase tracking-[0.2em] text-[#ff00ff]/60',
  },
  glassmorphism: {
    wrapper: 'bg-gradient-to-br from-[#121212] via-[#2a2a2a] to-[#1a1a1a] text-[#fff] min-h-screen',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl rounded-3xl',
    accent: 'text-blue-400',
    selected: 'bg-white/30 text-white border-white/50 backdrop-blur-md',
    input: 'bg-white/5 border border-white/20 text-white p-3 w-full rounded-xl outline-none focus:bg-white/10 transition-all placeholder:text-white/20',
    button: 'bg-white text-black px-10 py-4 font-black uppercase rounded-full hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    label: 'text-[10px] font-black uppercase tracking-[0.2em] text-white/40',
  },
  desert_oasis: {
    wrapper: 'bg-[#faf9f6] text-[#8b4513] min-h-screen',
    card: 'border-4 border-[#d2b48c] p-8 bg-white shadow-[12px_12px_0px_#8b4513]',
    accent: 'text-[#cd5c5c]',
    selected: 'bg-[#8b4513] text-white border-[#8b4513]',
    input: 'bg-[#faf9f6] border-2 border-[#d2b48c] text-[#8b4513] p-3 w-full outline-none focus:border-[#8b4513] placeholder:text-[#d2b48c]',
    button: 'bg-[#8b4513] text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-[#a0522d] transition-colors',
    label: 'text-xs font-serif italic text-[#8b4513]/60',
  },
  forest_night: {
    wrapper: 'bg-[#1b3022] text-[#f0f7f4] min-h-screen',
    card: 'border-2 border-[#4f7942] p-8 bg-[#1b3022]/80 backdrop-blur-sm shadow-[8px_8px_0px_#4f7942]',
    accent: 'text-[#90ee90]',
    selected: 'bg-[#4f7942] text-[#f0f7f4] border-[#90ee90]',
    input: 'bg-transparent border-2 border-[#4f7942] text-[#f0f7f4] p-3 w-full outline-none focus:border-[#90ee90] placeholder:text-[#4f7942]',
    button: 'bg-[#4f7942] text-[#f0f7f4] border-2 border-[#f0f7f4] px-8 py-3 font-bold uppercase hover:bg-[#3d5c33] transition-colors',
    label: 'text-[10px] font-black uppercase tracking-[0.4em] text-[#4f7942]',
  },
};

const PublicForm = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [respondentName, setRespondentName] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedResponseId, setSubmittedResponseId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 for welcome/respondent info
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [loading, setLoading] = useState(true);
  const [responseCount, setResponseCount] = useState(0);
  const startTime = useRef<number>(Date.now());

  // SEO METADATA INJECTION
  useEffect(() => {
    if (!form) return;

    // Title
    const originalTitle = document.title;
    document.title = form.seoTitle || form.title || 'AQORA Form';

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const originalDesc = metaDesc.getAttribute('content');
    metaDesc.setAttribute('content', form.seoDescription || form.description || 'A high-performance form built with AQORA.');

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (form.seoKeywords) {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', form.seoKeywords);
    }

    // Robots (Indexability)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', form.seoIndexable !== false ? 'index, follow' : 'noindex, nofollow');

    // Cleanup
    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
      if (metaKeywords) metaKeywords.remove();
      if (metaRobots) metaRobots.setAttribute('content', 'index, follow');
    };
  }, [form]);
  const loadForm = React.useCallback(async () => {
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
        showProgressBar: settings.showProgressBar ?? false,
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
        views: data.views || 0,
        
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setForm(loadedForm);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadForm();
      
      // Increment views
      supabase.rpc('increment_form_views', { form_id: id }).then(({ error }) => {
        if (error) console.error('Error incrementing views:', error);
      });

      // Load response count
      supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', id)
        .then(({ count }) => {
            if (count !== null) setResponseCount(count);
        });
    }
  }, [id, loadForm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="font-mono font-bold uppercase animate-pulse">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="border-brutal-3 p-8 text-center">
          <p className="font-bold uppercase">FORM NOT FOUND</p>
        </div>
      </div>
    );
  }

  const style = THEME_STYLES[form.theme];

  // Check Close Date
  const isPastCloseDate = form.closeDate && new Date() > new Date(form.closeDate);

  // Check Submission Limit
  const isLimitReached = form.submissionLimit && responseCount >= form.submissionLimit;

  if (!form.acceptingResponses || isPastCloseDate || isLimitReached) {
    return (
      <div className={style.wrapper}>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold uppercase mb-4 italic">{form.title}</h1>
          <p className="text-sm uppercase font-black opacity-60">
            {isLimitReached 
              ? 'THIS FORM HAS REACHED ITS SUBMISSION LIMIT.' 
              : isPastCloseDate 
                ? 'THIS FORM WAS CLOSED ON ' + new Date(form.closeDate!).toLocaleDateString() + '.'
                : 'THIS FORM IS NO LONGER ACCEPTING RESPONSES.'}
          </p>
        </div>
      </div>
    );
  }

  // Password Protection
  if (form.password && !hasAccess) {
    const funnyMessages = [
      'NICE TRY, FBI.',
      'WRONG. EVEN THE AI IS LAUGHING AT YOU.',
      'ACCESS DENIED. PLEASE DEPOSIT 5 COINS.',
      'MY GRANDMA COULD GUESS BETTER THAN THAT.',
      'WRONG PASSWORD. THE SYSTEM IS NOW JUDGING YOU.',
      'DO YOU EVEN KNOW THE OWNER?',
      '403: YOUR BRAIN NOT FOUND.',
      'INCORRECT. DID YOU FORGET YOUR OWN NAME TOO?',
      'STOP GUESSING. IT\'S EMBARRASSING.'
    ];

    const handlePasswordSubmit = () => {
      if (passwordInput === form.password) {
        setHasAccess(true);
        setPwdError('');
      } else {
        const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setPwdError(randomMsg);
      }
    };

    return (
      <div className={style.wrapper}>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold uppercase mb-8 italic">{form.title}</h1>
          <div className={`${style.card} space-y-4`}>
            <label className={style.label}>THIS ARCHIVE IS SEALED</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={style.input}
              placeholder="SECRET KEY"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePasswordSubmit();
              }}
            />
            <button 
              onClick={handlePasswordSubmit}
              className={`${style.button} w-full`}
            >
              BREACH SYSTEM
            </button>
            {errors.auth && (
              <p className="text-xs font-black uppercase text-[#FF4500] italic animate-in fade-in zoom-in duration-300">
                {errors.auth}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const getFilteredQuestions = () => {
    return form.questions.filter(q => q.type !== 'section_header' && q.type !== 'description');
  };

  const validate = (checkQuestions = true): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Check global identifier requirements (Name/Email)
    if (!form.isAnonymous) {
      if (!respondentName?.trim()) {
        newErrors.respondent = 'NAME IS COMPULSORY, SOLDIER.';
      }
      if (!respondentEmail?.trim()) {
        newErrors.respondent = newErrors.respondent ? 'BOTH NAME AND EMAIL ARE REQUIRED.' : 'EMAIL IS MANDATORY FOR INTEL.';
      }
    }

    if (!newErrors.respondent && !form.isAnonymous && respondentEmail && form.restrictedDomain) {
      const allowedDomains = form.restrictedDomain.split(',').map(d => d.trim().toLowerCase());
      const userDomain = respondentEmail.split('@')[1]?.toLowerCase();
      if (userDomain && !allowedDomains.some(d => userDomain === d || userDomain.endsWith('.' + d))) {
        const DOMAIN_ERRORS = [
          "WRONG NEIGHBORHOOD. USE YOUR OFFICIAL DOMAIN.",
          "THAT DOMAIN IS SO 2005. USE THE RIGHT ONE.",
          "ACCESS DENIED. YOUR EMAIL ISN'T INVITED TO THIS PARTY.",
          "WE HAVE STANDARDS HERE. USE THE CORRECT DOMAIN.",
          "DID YOU REALLY THINK THAT WOULD WORK?",
          "403: DOMAIN NOT FOUND IN OUR EXCLUSIVE CLUB.",
          "YOUR EMAIL IS TOO MAINSTREAM. USE THE COMPANY ONE.",
          "STOP TRYING TO BE SNEAKY. USE THE PROPER DOMAIN."
        ];
        newErrors.respondent = DOMAIN_ERRORS[Math.floor(Math.random() * DOMAIN_ERRORS.length)];
      }
    }

    if (checkQuestions) {
      form.questions.forEach(q => {
        if (q.type === 'section_header' || q.type === 'description') return;
        if (q.required) {
          const val = answers[q.id];
          if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
            newErrors[q.id] = 'This field is required';
          }
        }
        if (q.type === 'email' && answers[q.id]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(answers[q.id])) {
            newErrors[q.id] = 'Invalid email address';
          }
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleSubmit = async () => {
    if (!validate()) return;
    
    // Check one-response-per-email restriction — strict, case-insensitive
    if (form.limitOneResponse) {
      // Collect all email sources: explicit respondent email + any email-type question answers
      const emailsToCheck = new Set<string>();
      
      if (respondentEmail?.trim()) {
        emailsToCheck.add(respondentEmail.trim().toLowerCase());
      }
      
      // Also check answers inside email-type questions
      form.questions.forEach(q => {
        if (q.type === 'email' && answers[q.id]?.trim()) {
          emailsToCheck.add(answers[q.id].trim().toLowerCase());
        }
      });

      if (emailsToCheck.size === 0 && form.requireRespondentData) {
        toast.error('AN EMAIL ADDRESS IS REQUIRED TO SUBMIT THIS FORM.');
        return;
      } else if (emailsToCheck.size > 0) {
        // Fetch all existing responses and do strict client-side email matching
        // (avoids JSONB operator inconsistencies across DB versions)
        const { data: allResponses, error: fetchError } = await supabase
          .from('responses')
          .select('respondent_data, answers')
          .eq('form_id', form.id);

        if (fetchError) {
          console.error('Duplicate check error:', fetchError);
          toast.error('COULD NOT VERIFY SUBMISSION. TRY AGAIN.');
          return;
        }

        const isDuplicate = (allResponses || []).some(r => {
          // Check respondent_data.email (case-insensitive)
          const storedEmail = r.respondent_data?.email?.trim().toLowerCase();
          if (storedEmail && emailsToCheck.has(storedEmail)) return true;

          // Also check email-type answers stored in the answers object
          if (r.answers && typeof r.answers === 'object') {
            return Object.values(r.answers).some(
              (val) => typeof val === 'string' && emailsToCheck.has(val.trim().toLowerCase())
            );
          }
          return false;
        });

        if (isDuplicate) {
          toast.error('A RESPONSE FROM THIS EMAIL ALREADY EXISTS. ONLY ONE SUBMISSION IS ALLOWED PER EMAIL.');
          return;
        }
      }
    }

    // Check submission limit again before saving
    if (form.submissionLimit) {
      const { count } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', form.id);
        
      if (count !== null && count >= form.submissionLimit) {
        toast.error('SUBMISSION LIMIT REACHED.');
        return;
      }
    }

    // Calculate time taken in seconds
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);

    // Calculate quiz scores if in quiz mode
    let scoreData = {};
    if (form.isQuiz) {
      const answerableQs = form.questions.filter(q => q.type !== 'section_header' && q.type !== 'description');
      let totalPoints = 0;
      let earnedPoints = 0;

      answerableQs.forEach(q => {
        const pts = q.points ?? 1;
        totalPoints += pts;
        const userAns = answers[q.id];
        let correct = false;

        if (q.correctAnswer !== undefined && q.correctAnswer !== '') {
          if (Array.isArray(q.correctAnswer)) {
            const userArr = Array.isArray(userAns) ? [...userAns].sort() : [];
            const correctArr = [...q.correctAnswer].sort();
            correct = JSON.stringify(userArr) === JSON.stringify(correctArr);
          } else if (typeof q.correctAnswer === 'number') {
            correct = Number(userAns) === q.correctAnswer;
          } else {
            correct = String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
          }
        }

        if (correct) {
          earnedPoints += pts;
        }
      });

      const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      scoreData = {
        score: earnedPoints,
        total_points: totalPoints,
        score_percent: scorePercent,
      };
    }

    const responsePayload = {
      form_id: form.id,
      answers,
      respondent_data: {
        name: form.isAnonymous ? null : respondentName || null,
        email: form.isAnonymous ? null : respondentEmail || null,
        time_taken: timeTaken,
      },
      submitted_at: new Date().toISOString(),
      ...scoreData, // Include quiz scores if applicable
    };

    const { data, error } = await supabase
      .from('responses')
      .insert(responsePayload)
      .select('id')
      .single();

    if (error) {
      console.error('Submission error:', error);
      toast.error('SUBMISSION FAILED.');
      return;
    }
    
    // Store the response ID
    if (data?.id) {
      setSubmittedResponseId(data.id);
    }
    
    setSubmitted(true);
    toast.success('PROTOCOL SUBMITTED.');

    if (form.redirectUrl) {
      setTimeout(() => {
        window.location.href = form.redirectUrl!;
      }, 1500);
    }
  };

  const setAnswer = (qId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    if (errors[qId]) {
      setErrors(prev => { const n = { ...prev }; delete n[qId]; return n; });
    }
  };

  const toggleMulti = (qId: string, val: string) => {
    const current: string[] = answers[qId] || [];
    setAnswer(qId, current.includes(val) ? current.filter((v: string) => v !== val) : [...current, val]);
  };

  const nextStep = () => {
    if (currentIndex === -1) {
      if (!validate(false)) return;
      setErrors({});
      setCurrentIndex(0);
      return;
    }

    const currentQuestion = getFilteredQuestions()[currentIndex];
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setErrors({ [currentQuestion.id]: 'This field is required' });
      return;
    }

    // --- CONDITIONAL LOGIC (BRANCHING) ---
    const answer = answers[currentQuestion.id];
    let jumpTargetId: string | undefined = undefined;

    if (answer && (currentQuestion.type === 'single_choice' || currentQuestion.type === 'dropdown' || currentQuestion.type === 'yes_no' || currentQuestion.type === 'logic_mcq')) {
      const selectedOption = currentQuestion.options?.find(opt => opt.label === answer);
      if (selectedOption?.navigateToSectionId) {
        jumpTargetId = selectedOption.navigateToSectionId;
      }
    }

    setErrors({});
    
    if (jumpTargetId) {
      // Find the first question AFTER the target section header
      const targetSectionIndex = form.questions.findIndex(q => q.id === jumpTargetId);
      if (targetSectionIndex !== -1) {
        // Find the index in the FILTERED questions list that comes after this section header
        const targetQuestionInForm = form.questions.slice(targetSectionIndex + 1).find(q => q.type !== 'section_header' && q.type !== 'description');
        if (targetQuestionInForm) {
          const newFilteredIndex = getFilteredQuestions().findIndex(q => q.id === targetQuestionInForm.id);
          if (newFilteredIndex !== -1) {
            setCurrentIndex(newFilteredIndex);
            return;
          }
        }
      }
    }

    if (currentIndex < getFilteredQuestions().length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentIndex > -1) setCurrentIndex(currentIndex - 1);
  };

  if (submitted) {
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const answerableQs = form.questions.filter(q => q.type !== 'section_header' && q.type !== 'description');
    
    // Quiz scoring
    const isQuizMode = form.isQuiz;
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    let wrongCount = 0;
    const questionResults: { question: Question; userAnswer: unknown; isCorrect: boolean; points: number; earned: number }[] = [];

    if (isQuizMode) {
      // Include questions by default unless explicitly opted out
      const quizQuestions = answerableQs.filter(q => q.includeInQuiz !== false);
      
      quizQuestions.forEach(q => {
        const pts = q.points ?? 1;
        totalPoints += pts;
        const userAns = answers[q.id];
        let correct = false;

        if (q.correctAnswer !== undefined && q.correctAnswer !== '') {
          if (Array.isArray(q.correctAnswer)) {
            // Multiple choice
            const userArr = Array.isArray(userAns) ? [...userAns].sort() : [];
            const correctArr = [...q.correctAnswer].sort();
            correct = JSON.stringify(userArr) === JSON.stringify(correctArr);
          } else if (typeof q.correctAnswer === 'number') {
            correct = Number(userAns) === q.correctAnswer;
          } else {
            correct = String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
          }
        }

        if (correct) {
          earnedPoints += pts;
          correctCount++;
        } else {
          wrongCount++;
        }

        questionResults.push({ question: q, userAnswer: userAns, isCorrect: correct, points: pts, earned: correct ? pts : 0 });
      });
    }

    const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return (
      <div className={`${style.wrapper} flex flex-col items-center justify-center py-12`}>
        <div className="w-full max-w-2xl px-4">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className={`${style.card} inline-block mb-6 p-6`}>
              <Check className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-4xl font-black uppercase mb-3 italic tracking-tighter">
              {isQuizMode ? 'RESULTS' : 'SUBMITTED'}
            </h1>
            <p className="text-sm font-bold uppercase tracking-tight opacity-70">{form.confirmationMessage}</p>
          </div>

          {/* Quiz Score Card - Only show inline if owner has enabled it */}
          {isQuizMode && form.showQuizResultsToUsers && (
            <div className="mb-10">
              <div className={`${style.card} p-8 text-center mb-6`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2`}>YOUR SCORE</p>
                <p className="text-6xl font-black italic mb-2">{scorePercent}%</p>
                <p className="text-sm font-black uppercase opacity-60">{earnedPoints} / {totalPoints} POINTS</p>
                
                {/* Score Bar */}
                <div className="mt-6 h-4 bg-current/10 w-full overflow-hidden" style={{ borderRadius: form.style?.borderRadius }}>
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${scorePercent}%`, 
                      backgroundColor: scorePercent >= 70 ? '#22c55e' : scorePercent >= 40 ? '#eab308' : '#ef4444',
                      borderRadius: form.style?.borderRadius 
                    }} 
                  />
                </div>

                <div className="flex justify-center gap-8 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: '#22c55e' }}>{correctCount}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50">CORRECT</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: '#ef4444' }}>{wrongCount}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50">WRONG</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black">{answerableQs.length}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50">TOTAL</p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest opacity-40">DETAILED BREAKDOWN</h3>
                {questionResults.map((result, idx) => (
                  <div 
                    key={result.question.id} 
                    className={`${style.card} p-5 flex flex-col gap-3 border-l-8`}
                    style={{ 
                      borderLeftColor: result.isCorrect ? '#22c55e' : '#ef4444',
                      borderRadius: form.style?.borderRadius 
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Q{idx + 1}</p>
                        <p className="text-sm font-black uppercase">{result.question.title || 'UNTITLED'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-black uppercase px-2 py-1" style={{ 
                          backgroundColor: result.isCorrect ? '#22c55e' : '#ef4444',
                          color: '#fff'
                        }}>
                          {result.isCorrect ? 'CORRECT' : 'WRONG'}
                        </span>
                        <span className="text-[10px] font-black opacity-40">{result.earned}/{result.points} PTS</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-current/5 p-3">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">YOUR ANSWER</p>
                        <p className="font-bold">{Array.isArray(result.userAnswer) ? result.userAnswer.join(', ') : String(result.userAnswer ?? '—')}</p>
                      </div>
                      {result.question.correctAnswer !== undefined && result.question.correctAnswer !== '' && (
                        <div className="bg-current/5 p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">CORRECT ANSWER</p>
                          <p className="font-bold" style={{ color: '#22c55e' }}>
                            {Array.isArray(result.question.correctAnswer) ? result.question.correctAnswer.join(', ') : String(result.question.correctAnswer)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-quiz: Summary of answers */}
          {!isQuizMode && (
            <div className="mb-10">
              <div className={`${style.card} p-6 mb-4`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">YOUR RESPONSE SUMMARY</h3>
                <div className="space-y-4">
                  {answerableQs.map((q, idx) => (
                    <div key={q.id} className="border-b border-current/10 pb-3 last:border-0">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Q{idx + 1}: {q.title || 'UNTITLED'}</p>
                      <p className="text-sm font-bold">
                        {Array.isArray(answers[q.id]) ? answers[q.id].join(', ') : String(answers[q.id] ?? '—')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View Your Score Button - Only show if enabled */}
          {isQuizMode && form.showQuizResultsToUsers && submittedResponseId && (
            <div className="mb-10">
              <button
                onClick={() => window.location.href = `/quiz-results/${submittedResponseId}`}
                className={`${style.button} w-full md:w-auto mx-auto block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all`}
              >
                VIEW YOUR SCORE & ANSWERS
              </button>
              <p className="text-center text-[10px] font-black uppercase opacity-40 mt-4 tracking-widest">
                CLICK ABOVE TO SEE DETAILED RESULTS
              </p>
            </div>
          )}

        </div>
      </div>
    );
  }

  const fontClass = {
    mono: 'font-mono',
    sans: 'font-sans',
    serif: 'font-serif'
  }[form.style?.fontFamily || 'mono'];

  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[form.style?.fontSize || 'medium'];

  const bgPatternClass = {
    none: '',
    grid: 'bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:24px_24px] [background-position:0_0] bg-fixed',
    dots: 'bg-[radial-gradient(#888_2px,transparent_2px)] [background-size:32px_32px] [background-position:0_0] bg-fixed'
  }[form.style?.bgPattern || 'none'];

  const customCardStyle = {
    borderRadius: form.style?.borderRadius !== undefined ? `${form.style.borderRadius}px` : undefined,
    borderWidth: form.style?.borderWidth !== undefined ? `${form.style.borderWidth}px` : undefined,
    backgroundColor: form.style?.cardOpacity !== undefined ? `rgb(from var(--bg-card) r g b / ${form.style.cardOpacity}%)` : undefined,
    boxShadow: form.style?.shadowDepth ? `${form.style.shadowDepth}px ${form.style.shadowDepth}px 0px currentColor` : undefined,
  };

  const renderQuestion = (q: Question) => {
    if (q.type === 'section_header') {
      return (
        <div className="mt-10 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>§ SECTION</span>
            <div className="flex-1 h-[2px] bg-current opacity-20" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight">{q.title}</h2>
          {q.description && <p className="text-sm opacity-50 font-bold mt-1 whitespace-pre-wrap">{q.description}</p>}
        </div>
      );
    }
    if (q.type === 'description') {
      return <p className="text-sm opacity-70 font-bold whitespace-pre-wrap">{q.title}</p>;
    }

    return (
      <div 
        className={`${style.card} transition-all hover:translate-x-1 hover:translate-y-1`}
        style={customCardStyle}
      >
        <label className={`${style.label} ${fontClass}`}>
          {q.title || 'UNTITLED'} {q.required && <span className={style.accent}>*</span>}
        </label>
        {q.description && <p className="text-[10px] font-bold opacity-50 mt-1 mb-3 whitespace-pre-wrap">{q.description}</p>}
        <div className="mt-3">
          {(q.type === 'short_text' || q.type === 'email' || q.type === 'phone') && (
            <input
              type={q.type === 'email' ? 'email' : q.type === 'phone' ? 'tel' : 'text'}
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              className={`${style.input} ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
              placeholder={q.type === 'email' ? 'you@example.com' : q.type === 'phone' ? '+91 9999999999' : 'Your answer...'}
            />
          )}
          {q.type === 'long_text' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              className={`${style.input} min-h-[120px] resize-none ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
              placeholder="Your answer..."
            />
          )}
          {q.type === 'number' && (
            <input 
              type="number" 
              value={answers[q.id] || ''} 
              onChange={(e) => setAnswer(q.id, e.target.value)} 
              className={`${style.input} ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
            />
          )}
          {q.type === 'date' && (
            <input 
              type="date" 
              value={answers[q.id] || ''} 
              onChange={(e) => setAnswer(q.id, e.target.value)} 
              className={`${style.input} ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
            />
          )}
          {q.type === 'time' && (
            <input 
              type="time" 
              value={answers[q.id] || ''} 
              onChange={(e) => setAnswer(q.id, e.target.value)} 
              className={`${style.input} ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
            />
          )}
          {(q.type === 'single_choice' || q.type === 'logic_mcq') && (
            <div className="space-y-2">
              {(q.options || []).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAnswer(q.id, opt.label)}
                  className={`w-full text-left p-3 border-2 text-sm font-bold uppercase transition-all ${
                    answers[q.id] === opt.label ? `${style.selected} shadow-brutal-sm` : 'border-current hover:border-current/70'
                  }`}
                  style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          {q.type === 'multiple_choice' && (
            <div className="space-y-2">
              {(q.options || []).map(opt => {
                const checked = (answers[q.id] || []).includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleMulti(q.id, opt.label)}
                    className={`w-full text-left p-3 border-2 text-sm font-bold uppercase transition-all flex items-center gap-3 ${
                      checked ? `${style.selected} shadow-brutal-sm` : 'border-current hover:border-current/70'
                    }`}
                    style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
                  >
                    <div className={`w-5 h-5 border-2 border-current flex items-center justify-center text-xs bg-transparent`}>
                      {checked && '✓'}
                    </div>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
          {q.type === 'dropdown' && (
            <select
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              className={`${style.input} cursor-pointer ${fontClass}`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
            >
              <option value="">Select...</option>
              {(q.options || []).map(opt => (
                <option key={opt.id} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          )}
          {q.type === 'yes_no' && (
            <div className="flex gap-4">
              {['Yes', 'No'].map(v => (
                <button
                  key={v}
                  onClick={() => setAnswer(q.id, v)}
                  className={`flex-1 p-4 border-2 font-black uppercase text-base italic transition-all ${
                    answers[q.id] === v ? `${style.selected} shadow-brutal-sm` : 'border-current hover:border-current/70'
                  }`}
                  style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
          {q.type === 'rating' && (
            <div className="flex gap-2">
              {Array.from({ length: q.maxRating || 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAnswer(q.id, i + 1)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star className={`h-8 w-8 ${(answers[q.id] || 0) > i ? 'fill-current' : 'opacity-20'}`} />
                </button>
              ))}
            </div>
          )}
          {q.type === 'linear_scale' && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: (q.maxScale || 5) - (q.minScale || 1) + 1 }).map((_, i) => {
                  const val = (q.minScale || 1) + i;
                  return (
                    <button
                      key={val}
                      onClick={() => setAnswer(q.id, val)}
                      className={`w-12 h-12 border-2 font-black text-sm transition-all ${
                        answers[q.id] === val ? `${style.selected} shadow-brutal-sm scale-110` : 'border-current hover:border-current/60'
                      }`}
                      style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              {(q.minLabel || q.maxLabel) && (
                <div className="flex justify-between text-xs font-bold uppercase italic opacity-50">
                  <span>{q.minLabel}</span>
                  <span>{q.maxLabel}</span>
                </div>
              )}
            </div>
          )}
          {q.type === 'file_upload' && (
            <div 
              className={`${style.input} text-center py-12 cursor-pointer border-dashed border-4 opacity-50`}
              style={{ borderRadius: customCardStyle.borderRadius, borderWidth: customCardStyle.borderWidth }}
            >
              <p className="text-xs font-black uppercase tracking-widest">FILE UPLOAD — COMING SOON</p>
            </div>
          )}
        </div>
        {errors[q.id] && (
          <p className="text-xs mt-3 font-black uppercase text-[#FF4500] italic underline underline-offset-4 decoration-2">
            {errors[q.id]}
          </p>
        )}
      </div>
    );
  };

  const isNotebook = form.layout === 'notebook';
  const filteredQuestions = getFilteredQuestions();

  const wrapperStyle = {
    backgroundColor: form.style?.backgroundColor,
    backgroundImage: form.style?.backgroundImageUrl ? `url(${form.style.backgroundImageUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const accentColorStyle = form.style?.customAccentColor ? {
    color: form.style.customAccentColor,
  } : {};

  const accentBgStyle = form.style?.customAccentColor ? {
    backgroundColor: form.style.customAccentColor,
    borderColor: form.style.customAccentColor,
    color: '#fff' // Ensure text is visible on custom accent
  } : {};

  return (
    <div 
      className={`${style.wrapper} ${fontClass} ${sizeClass} ${bgPatternClass} relative overflow-x-hidden transition-colors duration-700`}
      style={wrapperStyle}
    >
      {/* Background Overlay for better readability on images */}
      {form.style?.backgroundImageUrl && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-0" />
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Banner Image */}
        {form.style?.bannerImageUrl && (
          <div className="mb-8 border-brutal-3 overflow-hidden h-48 md:h-64">
            <img 
              src={form.style.bannerImageUrl} 
              alt="Form Banner" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* PROGRESS BAR for Notebook */}
        {isNotebook && currentIndex >= 0 && (
          <div className="mb-12 border-2 border-current h-4 w-full bg-current/5 overflow-hidden">
            <div 
              className="h-full bg-current transition-all duration-500"
              style={{ 
                width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
                backgroundColor: form.style?.customAccentColor || undefined
              }}
            />
          </div>
        )}

        {/* Header (Intro) */}
        {(form.layout === 'single_page' || currentIndex === -1) && (
          <div className="mb-12">
            {form.style?.logoUrl && (
              <div className="mb-6">
                <img 
                  src={form.style.logoUrl} 
                  alt="Form Logo" 
                  className="max-h-20 object-contain"
                />
              </div>
            )}
            <h1 
              className="text-4xl md:text-6xl font-black uppercase italic leading-none tracking-tighter mb-4 border-l-8 border-current pl-6"
              style={accentColorStyle}
            >
              {form.title}
            </h1>
            {form.description && <p className="mt-4 text-lg font-bold uppercase opacity-80 whitespace-pre-wrap">{form.description}</p>}
          </div>
        )}

        {/* FORM CONTENT */}
        <div className="space-y-8">
          {/* Respondent info */}
          {!form.isAnonymous && (form.layout === 'single_page' || currentIndex === -1) && (
            <div className={`${style.card} border-4 group transition-all ${errors.respondent ? 'border-[#FF4500] animate-shake' : ''}`}>
              <div className="space-y-4">
                <div>
                  <label className={style.label}>
                    YOUR NAME <span className="text-[#FF4500] font-black">*</span>
                  </label>
                  <input
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    className={`${style.input} mt-2 font-bold uppercase`}
                    placeholder="ENTER IDENTITY"
                  />
                </div>
                <div>
                  <label className={style.label}>
                    YOUR EMAIL <span className="text-[#FF4500] font-black">*</span>
                  </label>
                  <input
                    type="email"
                    value={respondentEmail}
                    onChange={(e) => setRespondentEmail(e.target.value)}
                    className={`${style.input} mt-2 font-bold font-mono`}
                    placeholder="ENTER FREQUENCY"
                  />
                </div>
              </div>
              {errors.respondent && (
                <p className="text-xs mt-4 font-black uppercase text-[#FF4500] italic animate-in fade-in slide-in-from-top-1">
                  {errors.respondent}
                </p>
              )}
              {form.restrictedDomain && (
                <p className="text-[9px] mt-2 font-black uppercase opacity-40">
                  ESTABLISHED DOMAINS ONLY: {form.restrictedDomain}
                </p>
              )}
            </div>
          )}

          {/* PAGE QUESTIONS */}
          {form.layout === 'single_page' ? (
            <div className="space-y-6">
              {form.questions.map(q => (
                <div key={q.id}>{renderQuestion(q)}</div>
              ))}
            </div>
          ) : (
            currentIndex >= 0 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                {renderQuestion(filteredQuestions[currentIndex])}
              </div>
            )
          )}
        </div>

        {/* NAVIGATION / SUBMIT */}
        <div className="mt-12 flex gap-4">
          {form.layout === 'single_page' ? (
            <button 
              onClick={handleSubmit} 
              className={`${style.button} w-full`}
              style={accentBgStyle}
            >
              {form.submitButtonText || 'SUBMIT FORM'} →
            </button>
          ) : (
            <>
              {currentIndex > -1 && (
                <button onClick={prevStep} className={`${style.button} bg-transparent text-current shadow-none hover:translate-x-0 hover:translate-y-0`}>
                  BACK
                </button>
              )}
              <button 
                onClick={nextStep} 
                className={`${style.button} flex-1`}
                style={accentBgStyle}
              >
                {currentIndex === -1 ? 'START →' : currentIndex === filteredQuestions.length - 1 ? (form.submitButtonText || 'FINISH') : 'NEXT'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
