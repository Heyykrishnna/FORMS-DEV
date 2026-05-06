import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateResearchForm, ResearchForm, ResearchSection } from '@/services/groq';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { createBlankForm } from '@/lib/formStore';
import { FormData, Question } from '@/types/form';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical, Users, Target, Sparkles, ChevronRight,
  CheckCircle2, Lightbulb, Plus, BarChart3, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TAG_LABELS: Record<string, string> = {
  demographics: 'DEMOGRAPHICS',
  opinions: 'OPINIONS',
  behavior: 'BEHAVIOR',
  experience: 'EXPERIENCE',
  other: 'OTHER',
};

const VerticalScale = ({ className }: { className?: string }) => (
  <div className={cn("w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-black/10", className)} />
);

const ResearchMode = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [researchGoal, setResearchGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ResearchForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const data = await generateResearchForm(topic, targetAudience, researchGoal);
      setResult(data);
      setExpandedSection(0);
      toast.success("Research form generated!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsForm = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    try {
      const questions: Question[] = [];
      result.sections.forEach(section => {
        questions.push({
          id: crypto.randomUUID(),
          type: 'section_header',
          title: section.name,
          description: `Category: ${section.tag}`,
          required: false,
        });
        section.questions.forEach(q => {
          questions.push({
            id: q.id || crypto.randomUUID(),
            type: q.type,
            title: q.title,
            description: q.description,
            required: q.required,
            options: q.options,
            minScale: q.minScale,
            maxScale: q.maxScale,
            maxRating: q.maxRating,
          });
        });
      });

      const newForm: FormData = {
        ...createBlankForm(),
        id: crypto.randomUUID(),
        title: result.title,
        description: result.description,
        questions,
        theme: 'clean_light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { error } = await apiClient.from('forms').upsert({
        id: newForm.id,
        user_id: user.id,
        title: newForm.title,
        description: newForm.description,
        status: 'draft',
        layout: newForm.layout,
        theme: newForm.theme,
        style: newForm.style,
        questions: newForm.questions,
        showProgressBar: newForm.showProgressBar,
        submitButtonText: newForm.submitButtonText,
        isQuiz: newForm.isQuiz,
        showQuizResultsToUsers: newForm.showQuizResultsToUsers,
        settings: {
          isAnonymous: true,
          acceptingResponses: false,
          confirmationMessage: 'Thank you for participating in our research!',
        },
        updated_at: new Date().toISOString(),
      });

      if (error) throw new Error(error.message);
      toast.success("Research form saved!");
      navigate(`/builder/${newForm.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const totalQuestions = result?.sections.reduce((acc, s) => acc + s.questions.length, 0) ?? 0;

  return (
    <div className="relative min-h-screen bg-[#F0F0F0] font-mono selection:bg-accent selection:text-accent-foreground">
      <VerticalScale className="absolute inset-y-0 left-0" />
      <VerticalScale className="absolute inset-y-0 right-0" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Nav */}
      <nav className="border-b border-foreground bg-background sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-[24px] font-sans font-medium tracking-tight hover:text-accent transition-colors">
            aqora
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 hidden md:block">Research Mode</span>
            <Link to="/dashboard" className="border border-foreground px-4 py-2 text-xs font-bold hover:bg-foreground hover:text-background transition-all">
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">

        {/* Page header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 border border-foreground bg-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-6">
            <FlaskConical className="h-3 w-3" /> Research Mode
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4 font-sans">
            AI RESEARCH<br />GENERATOR<span className="text-accent">.</span>
          </h1>
          <p className="text-base font-medium opacity-60 max-w-xl leading-relaxed">
            Describe your research topic and the AI will generate a structured, section-based form with tagged question categories.
          </p>
        </div>

        {/* Input panel */}
        <div className="border border-foreground bg-background shadow-[6px_6px_0px_#000] p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5 mb-2">
                <Target className="h-3 w-3" /> Topic *
              </label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Remote Work Habits"
                className="w-full border border-foreground bg-[#F0F0F0] px-4 py-3 text-sm font-sans outline-none focus:bg-background transition-colors placeholder:opacity-40"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5 mb-2">
                <Users className="h-3 w-3" /> Target Audience
              </label>
              <input
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g. Software developers"
                className="w-full border border-foreground bg-[#F0F0F0] px-4 py-3 text-sm font-sans outline-none focus:bg-background transition-colors placeholder:opacity-40"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5 mb-2">
                <Lightbulb className="h-3 w-3" /> Research Goal
              </label>
              <input
                value={researchGoal}
                onChange={e => setResearchGoal(e.target.value)}
                placeholder="e.g. Understand productivity"
                className="w-full border border-foreground bg-[#F0F0F0] px-4 py-3 text-sm font-sans outline-none focus:bg-background transition-colors placeholder:opacity-40"
              />
            </div>
          </div>

          {/* Quick examples */}
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">Quick start</p>
            <div className="flex flex-wrap gap-2">
              {['Remote Work Habits', 'Consumer Buying Behavior', 'Mental Health in Tech', 'Product-Market Fit'].map(ex => (
                <button
                  key={ex}
                  onClick={() => setTopic(ex)}
                  className="border border-foreground/30 hover:border-foreground bg-[#F0F0F0] hover:bg-background px-3 py-1.5 text-xs font-medium transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full border border-foreground bg-foreground text-background px-8 py-4 text-sm font-black uppercase tracking-widest hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-background inline-block"
                    />
                  ))}
                </span>
                Generating...
              </>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Research Form</>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Summary */}
              <div className="border border-foreground bg-background shadow-[4px_4px_0px_#000] p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Generated Form</p>
                  <h2 className="text-2xl font-black font-sans tracking-tight mb-1">{result.title}</h2>
                  <p className="text-sm opacity-60 font-sans mb-4">{result.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                    <span>{result.sections.length} sections</span>
                    <span className="w-1 h-1 bg-foreground rounded-full" />
                    <span>{totalQuestions} questions</span>
                    <span className="w-1 h-1 bg-foreground rounded-full" />
                    <span>{result.suggestedAnalytics?.length || 0} analytics</span>
                  </div>
                </div>
                <button
                  onClick={handleSaveAsForm}
                  disabled={isSaving}
                  className="border border-foreground bg-accent text-background px-6 py-3 text-xs font-black uppercase tracking-widest hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  {isSaving ? (
                    <span className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} className="w-1 h-1 bg-background inline-block" />
                      ))}
                    </span>
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {isSaving ? "Saving..." : "Save as Form"}
                </button>
              </div>

              {/* Key Insights */}
              {result.insights?.length > 0 && (
                <div className="border border-foreground bg-background p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-3 w-3" /> Key Insights This Research Will Uncover
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm font-sans">
                        <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                        <span className="opacity-70">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-3">
                {result.sections.map((section: ResearchSection, si: number) => (
                  <div key={si} className="border border-foreground bg-background">
                    {/* Section header */}
                    <button
                      onClick={() => setExpandedSection(expandedSection === si ? null : si)}
                      className="w-full flex items-center justify-between p-5 hover:bg-[#F0F0F0] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black border border-foreground px-2 py-1 uppercase tracking-widest">
                          {TAG_LABELS[section.tag] || section.tag.toUpperCase()}
                        </span>
                        <span className="font-bold font-sans">{section.name}</span>
                        <span className="text-[10px] opacity-40 font-mono">{section.questions.length} questions</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 opacity-40 transition-transform duration-200", expandedSection === si && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {expandedSection === si && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-foreground divide-y divide-foreground/10">
                            {section.questions.map((q, qi) => (
                              <div key={qi} className="px-5 py-4 flex items-start gap-4">
                                <span className="text-[10px] font-black opacity-30 mt-0.5 w-5 shrink-0 font-mono">{qi + 1}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-sans font-medium">{q.title}</p>
                                  {q.description && (
                                    <p className="text-xs opacity-50 mt-0.5 font-sans">{q.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[9px] font-black border border-foreground/20 px-2 py-0.5 uppercase tracking-wider">
                                      {q.type?.replace(/_/g, ' ')}
                                    </span>
                                    {q.required && (
                                      <span className="text-[9px] font-black text-accent uppercase tracking-wider">Required</span>
                                    )}
                                  </div>
                                  {q.options && q.options.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {q.options.map((opt, oi) => (
                                        <span key={oi} className="text-[10px] border border-foreground/20 px-2 py-0.5 font-sans opacity-60">
                                          {opt.label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Suggested Analytics */}
              {result.suggestedAnalytics?.length > 0 && (
                <div className="border border-foreground bg-background p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-3 w-3" /> Suggested Analytics Methods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedAnalytics.map((a, i) => (
                      <span key={i} className="text-xs border border-foreground/30 bg-[#F0F0F0] px-3 py-1.5 font-medium font-sans">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="border border-foreground bg-background p-8 text-center shadow-[6px_6px_0px_#000]">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Ready to deploy?</p>
                <h3 className="text-2xl font-black font-sans tracking-tight mb-6">
                  Save as Form & Open Builder<span className="text-accent">.</span>
                </h3>
                <button
                  onClick={handleSaveAsForm}
                  disabled={isSaving}
                  className="border border-foreground bg-foreground text-background px-10 py-4 text-sm font-black uppercase tracking-widest hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : <><ArrowRight className="h-4 w-4" /> Open in Builder</>}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ResearchMode;
