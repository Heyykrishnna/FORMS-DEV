import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { FormData, Question } from '@/types/form';
import { Check, X, Trophy, AlertCircle, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

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
      const { data: responseData, error: responseError } = await supabase
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

      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', responseData.form_id)
        .single();

      if (formError || !formData) {
        setError('Form not found');
        setLoading(false);
        return;
      }

      // Parse form data
      const parsedForm: FormData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        questions: formData.questions,
        theme: formData.theme,
        layout: formData.layout,
        style: formData.style,
        isAnonymous: formData.settings?.isAnonymous ?? true,
        acceptingResponses: formData.settings?.acceptingResponses ?? true,
        confirmationMessage: formData.settings?.confirmationMessage || 'Thank you!',
        password: formData.settings?.password,
        submissionLimit: formData.settings?.submissionLimit,
        redirectUrl: formData.settings?.redirectUrl,
        showProgressBar: formData.settings?.showProgressBar,
        submitButtonText: formData.settings?.submitButtonText,
        closeDate: formData.settings?.closeDate,
        seoTitle: formData.settings?.seoTitle,
        seoDescription: formData.settings?.seoDescription,
        collectEmails: formData.settings?.collectEmails || 'do_not_collect',
        allowResponseEditing: formData.settings?.allowResponseEditing ?? false,
        limitOneResponse: formData.settings?.limitOneResponse ?? false,
        isQuiz: formData.settings?.isQuiz ?? false,
        showQuizResultsToUsers: formData.show_quiz_results_to_users ?? formData.settings?.showQuizResultsToUsers ?? false,
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
    
    const answerableQs = form.questions.filter(q => q.type !== 'section_header' && q.type !== 'description');
    // Include questions in quiz results by default unless explicitly opted out
    const quizQuestions = answerableQs.filter(q => q.includeInQuiz !== false);
    const answers = response.answers;
    
    return quizQuestions.map((q: Question) => {
      const pts = q.points ?? 1;
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

      return {
        question: q,
        userAnswer: userAns,
        isCorrect: correct,
        points: pts,
        earned: correct ? pts : 0,
      };
    });
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-foreground mx-auto mb-4"></div>
          <p className="text-sm font-black uppercase tracking-widest">LOADING RESULTS...</p>
        </div>
      </div>
    );
  }

  if (error || !form || !response) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="w-20 h-20 mx-auto mb-6 text-destructive" />
          <h1 className="text-3xl font-black uppercase mb-4">{error || 'ERROR'}</h1>
          <p className="text-sm font-bold uppercase mb-8 opacity-60">
            {error === 'Results viewing is disabled for this form' 
              ? 'THE FORM OWNER HAS DISABLED RESULTS VIEWING' 
              : 'WE COULDN\'T FIND YOUR RESULTS'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-foreground text-background px-8 py-3 font-black uppercase border-4 border-foreground shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            GO HOME
          </button>
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-black uppercase mb-6 opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={16} /> BACK
          </button>
          <div className="border-4 border-foreground p-8 bg-accent/5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-4xl font-black uppercase italic">QUIZ RESULTS</h1>
            </div>
            <p className="text-sm font-bold uppercase opacity-60">{form.title}</p>
          </div>
        </div>

        {/* Score Card */}
        <div className="mb-10">
          <div className="border-4 border-foreground p-8 bg-background shadow-brutal">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2 text-center">YOUR SCORE</p>
            <p className="text-6xl md:text-8xl font-black italic mb-2 text-center">{scorePercent}%</p>
            <p className="text-sm font-black uppercase opacity-60 text-center mb-6">{score} / {totalPoints} POINTS</p>
            
            {/* Score Bar */}
            <div className="h-6 bg-foreground/10 w-full overflow-hidden mb-6">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${scorePercent}%`, 
                  backgroundColor: scorePercent >= 70 ? '#22c55e' : scorePercent >= 40 ? '#eab308' : '#ef4444',
                }} 
              />
            </div>

            {/*Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center border-2 border-foreground/20 p-4">
                <p className="text-3xl font-black" style={{ color: '#22c55e' }}>{correctCount}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">CORRECT</p>
              </div>
              <div className="text-center border-2 border-foreground/20 p-4">
                <p className="text-3xl font-black" style={{ color: '#ef4444' }}>{wrongCount}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">WRONG</p>
              </div>
              <div className="text-center border-2 border-foreground/20 p-4">
                <p className="text-3xl font-black">{questionResults.length}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">TOTAL</p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="mt-6 w-full bg-accent text-accent-foreground px-6 py-3 font-black uppercase border-4 border-foreground shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={16} /> SHARE YOUR SCORE
            </button>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-6">DETAILED BREAKDOWN</h3>
          {questionResults.map((result, idx) => (
            <div 
              key={result.question.id} 
              className="border-4 border-foreground p-6 flex flex-col gap-4 border-l-8"
              style={{ 
                borderLeftColor: result.isCorrect ? '#22c55e' : '#ef4444',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Q{idx + 1}</p>
                  <p className="text-lg font-black uppercase">{result.question.title || 'UNTITLED'}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {result.isCorrect ? (
                    <Check className="w-6 h-6" style={{ color: '#22c55e' }} />
                  ) : (
                    <X className="w-6 h-6" style={{ color: '#ef4444' }} />
                  )}
                  <span className="text-xs font-black uppercase px-3 py-1.5 border-2 border-foreground" style={{ 
                    backgroundColor: result.isCorrect ? '#22c55e' : '#ef4444',
                    color: '#fff'
                  }}>
                    {result.isCorrect ? 'CORRECT' : 'WRONG'}
                  </span>
                  <span className="text-xs font-black opacity-40">{result.earned}/{result.points} PTS</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-foreground/5 p-4 border-2 border-foreground/10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">YOUR ANSWER</p>
                  <p className="font-bold">{Array.isArray(result.userAnswer) ? result.userAnswer.join(', ') : String(result.userAnswer ?? '—')}</p>
                </div>
                {result.question.correctAnswer !== undefined && result.question.correctAnswer !== '' && (
                  <div className="bg-foreground/5 p-4 border-2 border-foreground/10">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">CORRECT ANSWER</p>
                    <p className="font-bold" style={{ color: '#22c55e' }}>
                      {Array.isArray(result.question.correctAnswer) ? result.question.correctAnswer.join(', ') : String(result.question.correctAnswer)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-xs opacity-40 font-black uppercase tracking-[0.5em]">AQORA.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
