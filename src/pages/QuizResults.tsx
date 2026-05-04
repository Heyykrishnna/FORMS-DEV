import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { FormData, Question } from '@/types/form';
import { Check, X, Trophy, AlertCircle, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { calculateQuizScore } from '@/lib/quiz';
import { cn } from '@/lib/utils';

const VerticalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-[#d4d4d4]',
      className
    )}
  />
);

const HorizontalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-full h-10 bg-[repeating-linear-gradient(45deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-y border-[#d4d4d4]',
      className
    )}
  />
);

const QuizResults = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<any>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, [responseId]);

  const loadResults = async () => {
    try {
      const { data: responseData, error: responseError } = await apiClient
        .from('responses')
        .select('*')
        .eq('id', responseId)
        .single();

      if (responseError || !responseData) {
        setError('Results not found');
        setLoading(false);
        return;
      }

      setResponse(responseData);

      const { data: formData, error: formError } = await apiClient
        .from('forms')
        .select('*')
        .eq('id', responseData.form_id)
        .single();

      if (formError || !formData) {
        setError('Form not found');
        setLoading(false);
        return;
      }

      const questions = typeof formData.questions === 'string' ? JSON.parse(formData.questions) : formData.questions || [];
      const style = typeof formData.style === 'string' ? JSON.parse(formData.style) : formData.style || {};
      const settings = typeof formData.settings === 'string' ? JSON.parse(formData.settings) : formData.settings || {};

      const parsedForm: FormData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        questions,
        theme: formData.theme,
        layout: formData.layout,
        style,
        isAnonymous: settings.isAnonymous ?? true,
        acceptingResponses: settings.acceptingResponses ?? true,
        confirmationMessage: settings.confirmationMessage || 'Thank you!',
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
        showQuizResultsToUsers: formData.show_quiz_results_to_users ?? settings.showQuizResultsToUsers ?? false,
        createdAt: formData.created_at,
        updatedAt: formData.updated_at,
        views: formData.views || 0,
      };

      if (!parsedForm.isQuiz || !parsedForm.showQuizResultsToUsers) {
        setError('Results viewing is disabled for this form');
        setLoading(false);
        return;
      }

      setForm(parsedForm);

      if (responseData.score_percent && responseData.score_percent >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load results');
      setLoading(false);
    }
  };

  const calculateQuestionResults = () => {
    if (!form || !response) return [];
    return calculateQuizScore(form.questions, response.answers || {}).results;
  };

  const handleShare = () => {
    const shareText = `I scored ${response.score_percent}% on "${form?.title}"! 🎯`;
    if (navigator.share) {
      navigator.share({ title: 'My Quiz Results', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !form || !response) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] font-mono">
        <VerticalScale className="fixed inset-y-0 left-0 z-20 pointer-events-none" />
        <VerticalScale className="fixed inset-y-0 right-0 z-20 pointer-events-none" />
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="max-w-md text-center space-y-6">
            <AlertCircle className="w-12 h-12 mx-auto text-foreground/30" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Error</p>
              <h1 className="text-2xl font-bold tracking-tight">{error || 'Something went wrong'}</h1>
              <p className="text-sm opacity-50 mt-2">
                {error === 'Results viewing is disabled for this form'
                  ? 'The form owner has disabled results viewing.'
                  : "We couldn't find your results."}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="border border-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionResults = calculateQuestionResults();
  const scorePercent = response.score_percent || 0;
  const score = response.score || 0;
  const totalPoints = response.total_points || 0;
  const correctCount = questionResults.filter(r => r.isCorrect).length;
  const wrongCount = questionResults.length - correctCount;

  const grade =
    scorePercent >= 90 ? 'A+' :
    scorePercent >= 80 ? 'A' :
    scorePercent >= 70 ? 'B' :
    scorePercent >= 60 ? 'C' :
    scorePercent >= 50 ? 'D' : 'F';

  const gradeColor =
    scorePercent >= 70 ? 'text-emerald-600' :
    scorePercent >= 50 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="relative min-h-screen bg-[#F0F0F0] text-foreground font-mono overflow-x-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <VerticalScale className="fixed inset-y-0 left-0 z-20 pointer-events-none" />
      <VerticalScale className="fixed inset-y-0 right-0 z-20 pointer-events-none" />

      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <nav className="border-b border-foreground sticky top-0 bg-[#F0F0F0] z-50">
        <div className="mx-auto flex items-center justify-between px-16 py-4">
          <Link to="/" className="text-[24px] font-sans font-medium tracking-tight hover:text-accent transition-colors">
            aqora
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border border-transparent hover:border-foreground px-3 py-2"
          >
            <ArrowLeft size={12} /> Back
          </button>
        </div>
      </nav>

      <HorizontalScale />

      <main className="px-16 py-12 max-w-[1400px] mx-auto relative z-10">

        <div className="flex items-end justify-between mb-10 pb-6 border-b border-black/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Quiz Results</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-sans leading-none">
              Results<span className="text-accent">.</span>
            </h1>
            <p className="text-sm opacity-50 mt-2 font-sans">{form.title}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Submitted</p>
            <p className="text-sm font-bold">
              {response.created_at ? new Date(response.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

          <div className="space-y-4 lg:sticky lg:top-28">

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-3 h-3" /> Score
                </span>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", gradeColor)}>
                  Grade: {grade}
                </span>
              </div>

              <div className="p-8 text-center space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Your Score</p>
                  <p className="text-7xl font-bold font-sans tracking-tight leading-none">{scorePercent}<span className="text-3xl opacity-40">%</span></p>
                  <p className="text-sm font-bold opacity-50 mt-2">{score} / {totalPoints} points</p>
                </div>

                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${scorePercent}%`,
                      backgroundColor: scorePercent >= 70 ? '#16a34a' : scorePercent >= 50 ? '#ca8a04' : '#ef4444',
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center border border-black/10 rounded-xl p-4">
                    <p className="text-2xl font-bold font-sans text-emerald-600">{correctCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mt-1">Correct</p>
                  </div>
                  <div className="text-center border border-black/10 rounded-xl p-4">
                    <p className="text-2xl font-bold font-sans text-red-500">{wrongCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mt-1">Wrong</p>
                  </div>
                  <div className="text-center border border-black/10 rounded-xl p-4">
                    <p className="text-2xl font-bold font-sans">{questionResults.length}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mt-1">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3">
                <span className="text-[10px] font-bold uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Correct', count: correctCount, total: questionResults.length, color: 'bg-emerald-500' },
                  { label: 'Wrong', count: wrongCount, total: questionResults.length, color: 'bg-red-400' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{item.label}</span>
                      <span className="text-[10px] font-bold font-sans">{item.total > 0 ? Math.round((item.count / item.total) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", item.color)}
                        style={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleShare}
              className="w-full border border-foreground bg-background px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm"
            >
              <Share2 size={12} /> Share Score
            </button>
          </div>

          <div className="space-y-4">
            <HorizontalScale className="rounded-xl" />

            <div className="flex items-center justify-between px-1 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Detailed Breakdown</p>
              <p className="text-[10px] font-bold opacity-40">{questionResults.length} questions</p>
            </div>

            {questionResults.map((result, idx) => (
              <div
                key={result.question.id}
                className={cn(
                  "bg-background border rounded-xl overflow-hidden shadow-sm transition-all",
                  result.isCorrect ? "border-emerald-300" : "border-red-300"
                )}
              >
                <div className={cn(
                  "px-5 py-3 flex items-center justify-between",
                  result.isCorrect ? "bg-emerald-50" : "bg-red-50"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Q{idx + 1}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      result.isCorrect ? "bg-emerald-500" : "bg-red-400"
                    )}>
                      {result.isCorrect
                        ? <Check className="w-3 h-3 text-white" />
                        : <X className="w-3 h-3 text-white" />
                      }
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      result.isCorrect ? "text-emerald-700" : "text-red-600"
                    )}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-sans opacity-50">
                    {result.earned}/{result.points} pts
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-sm font-semibold font-sans leading-snug">{result.question.title || 'Untitled'}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#F5F5F5] border border-black/10 rounded-xl p-4">
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Your Answer</p>
                      <p className="text-sm font-bold font-sans break-words">
                        {Array.isArray(result.userAnswer)
                          ? result.userAnswer.join(', ')
                          : String(result.userAnswer ?? '—')}
                      </p>
                    </div>

                    {result.question.correctAnswer !== undefined && result.question.correctAnswer !== '' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-2 text-emerald-700">Correct Answer</p>
                        <p className="text-sm font-bold font-sans break-words text-emerald-700">
                          {Array.isArray(result.question.correctAnswer)
                            ? result.question.correctAnswer.join(', ')
                            : String(result.question.correctAnswer)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {questionResults.length === 0 && (
              <div className="bg-background border border-foreground/20 rounded-xl p-16 text-center">
                <Circle className="w-8 h-8 mx-auto mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-30">No questions found</p>
              </div>
            )}

            <HorizontalScale className="rounded-xl" />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between opacity-30">
          <p className="text-[10px] font-mono uppercase tracking-widest">aqora · quiz results</p>
          <p className="text-[10px] font-mono uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
        </div>

      </main>
    </div>
  );
};

export default QuizResults;
