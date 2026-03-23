import { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FormResponse, FormData } from '@/types/form';
import { 
  Download, 
  Eye, 
  BarChart3, 
  Table as TableIcon, 
  Search, 
  Trash2, 
  Filter, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  MoreHorizontal,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Share2,
  Copy,
  Database,
  Printer,
  ChevronDown,
  Info,
  Activity,
  Zap,
  FlaskConical,
  ClipboardList,
  Trophy,
  Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { analyzeResponses } from '@/services/groq';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Line,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  form: FormData;
}

const COLORS = ['#FF4400', '#000000', '#444444', '#888888', '#CCCCCC'];

// HELPER FUNCTIONS FOR STATS
const calculateStats = (numbers: number[]) => {
  if (numbers.length === 0) return null;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const median = [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);
  return { mean, median, stdDev };
};

const getConsensus = (counts: Record<string, number>, total: number) => {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  const [name, count] = sorted[0];
  const percentage = (count / total) * 100;
  return { name, count, percentage, isStrong: percentage > 50 };
};

const getCompletionRate = (answers: any[], totalResponses: number) => {
  const completed = answers.filter(a => a !== undefined && a !== '' && (Array.isArray(a) ? a.length > 0 : true)).length;
  return (completed / totalResponses) * 100;
};

const ResponsesTab = ({ form }: Props) => {
  const [allResponses, setAllResponses] = useState<FormResponse[]>([]);
  const [view, setView] = useState<'table' | 'analytics'>('table');
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [researchPaper, setResearchPaper] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleAIAnalysis = async () => {
    if (allResponses.length === 0) {
      toast.error("NO DATA AVAILABLE FOR ANALYSIS.");
      return;
    }
    
    setIsAnalyzing(true);
    setShowAnalysisModal(true);
    
    try {
      const paper = await analyzeResponses(form, allResponses);
      setResearchPaper(paper);
      
      // Increment generation count atomically
      const { error: rpcError } = await supabase.rpc('increment_research_generations', { form_id: form.id });
      
      if (rpcError) {
        // Fallback if RPC is not yet available, though we recommend running the SQL
        console.warn("RPC increment failed, falling back to manual update:", rpcError);
        const currentCount = form.researchGenerationsCount || 0;
        await supabase
          .from('forms')
          .update({ research_generations_count: currentCount + 1 })
          .eq('id', form.id);
        form.researchGenerationsCount = currentCount + 1;
      } else {
        // Update local state count
        form.researchGenerationsCount = (form.researchGenerationsCount || 0) + 1;
      }

      toast.success("RESEARCH PAPER GENERATED.");
      
    } catch (error: any) {
      console.error("AI Analysis Failed:", error);
      toast.error("ANALYSIS FAILED: " + (error.message || "UNKNOWN ERROR"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!paperRef.current) return;
    
    // Temporarily show PDF-only elements for generation
    const pdfHeaders = document.querySelectorAll('.pdf-header-element');
    const pdfFooters = document.querySelectorAll('.pdf-footer-element');
    pdfHeaders.forEach(el => (el as HTMLElement).style.display = 'block');
    pdfFooters.forEach(el => (el as HTMLElement).style.display = 'block');

    const element = paperRef.current;
    
    // Define a premium styling options with ample spacing
    const opt = {
      margin:       [20, 25, 25, 25] as [number, number, number, number], // top, left, bottom, right in mm
      filename:     `${form.title || 'REVOX_INTEL'}_RESEARCH_PAPER.pdf`,
      image:        { type: 'jpeg' as const, quality: 1.0 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        scrollY: 0,
        logging: false
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: ['css', 'legacy'], avoid: ['.markdown-body h1', '.markdown-body h2', '.markdown-body h3', '.markdown-body p', '.markdown-body li', '.markdown-body blockquote', '.markdown-body table', '.markdown-body img'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Hide PDF-only elements after generation
      pdfHeaders.forEach(el => (el as HTMLElement).style.display = 'none');
      pdfFooters.forEach(el => (el as HTMLElement).style.display = 'none');
    });
  };

  useEffect(() => {
    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('form_id', form.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching responses:', error);
        return;
      }

      const mapped: FormResponse[] = (data || []).map((r) => ({
        id: r.id,
        formId: r.form_id,
        answers: r.answers || {},
        respondentName: r.respondent_data?.name || undefined,
        respondentEmail: r.respondent_data?.email || undefined,
        submittedAt: r.submitted_at,
        timeTaken: r.respondent_data?.time_taken || undefined,
        score: r.score,
        totalPoints: r.total_points,
        scorePercent: r.score_percent,
      }));

      setAllResponses(mapped);
    };

    fetchResponses();

    // Realtime subscription for new responses
    const channel = supabase
      .channel(`responses-${form.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `form_id=eq.${form.id}` }, (payload) => {
        const r = payload.new as any;
        const newResponse: FormResponse = {
          id: r.id,
          formId: r.form_id,
          answers: r.answers || {},
          respondentName: r.respondent_data?.name || undefined,
          respondentEmail: r.respondent_data?.email || undefined,
          submittedAt: r.submitted_at,
          timeTaken: r.respondent_data?.time_taken || undefined,
          score: r.score,
          totalPoints: r.total_points,
          scorePercent: r.score_percent,
        };
        setAllResponses(prev => [newResponse, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [form.id]);

  const filteredResponses = useMemo(() => {
    if (!searchQuery) return allResponses;
    const lowerQuery = searchQuery.toLowerCase();
    return allResponses.filter(r => {
      // Search in meta info
      if (r.respondentName?.toLowerCase().includes(lowerQuery)) return true;
      if (r.respondentEmail?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in answers
      return Object.values(r.answers).some(val => {
        if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(lowerQuery));
        return String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [allResponses, searchQuery]);

  const stats = useMemo(() => {
    const total = allResponses.length;
    const completionRate = total > 0 ? 100 : 0;
    
    // Calculate real average completion time
    const responsesWithTime = allResponses.filter(r => r.timeTaken && r.timeTaken > 0);
    let avgCompletionTime = "—";
    
    if (responsesWithTime.length > 0) {
      const avgSeconds = Math.round(
        responsesWithTime.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / responsesWithTime.length
      );
      
      if (avgSeconds < 60) {
        avgCompletionTime = `${avgSeconds}s`;
      } else {
        const mins = Math.floor(avgSeconds / 60);
        const secs = avgSeconds % 60;
        avgCompletionTime = `${mins}m ${secs}s`;
      }
    }
    
    const avgScore = total > 0 ? allResponses.reduce((acc, r) => acc + (r.scorePercent || 0), 0) / total : 0;
    const topScore = total > 0 ? Math.max(...allResponses.map(r => r.scorePercent || 0)) : 0;
    
    return { total, completionRate, avgCompletionTime, avgScore, topScore };
  }, [allResponses]);

  const exportCSV = (data: FormResponse[]) => {
    if (data.length === 0) return;
    
    // Base headers
    const headers = [
      'SUBMITTED AT', 
      'NAME', 
      'EMAIL', 
      'TIME TAKEN (S)',
    ];

    // Add quiz headers if applicable
    if (form.isQuiz) {
      headers.push('SCORE', 'TOTAL POINTS', 'SCORE %');
    }

    // Add question headers
    const questionHeaders = form.questions
      .filter(q => q.type !== 'section_header' && q.type !== 'description')
      .map(q => (q.title || 'UNTITLED').toUpperCase());
    
    headers.push(...questionHeaders);

    const rows = data.map(r => {
      const row = [
        new Date(r.submittedAt).toLocaleString(),
        r.respondentName || 'Anonymous',
        r.respondentEmail || 'N/A',
        r.timeTaken || 0,
      ];

      if (form.isQuiz) {
        row.push(
          r.score ?? 0,
          r.totalPoints ?? 0,
          `${r.scorePercent ?? 0}%`
        );
      }

      const answers = form.questions
        .filter(q => q.type !== 'section_header' && q.type !== 'description')
        .map(q => {
          const val = r.answers[q.id];
          if (Array.isArray(val)) return val.join(', ');
          return String(val ?? '');
        });

      row.push(...answers);
      return row;
    });

    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title || 'form'}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const answerableQuestions = form.questions.filter(q => q.type !== 'section_header' && q.type !== 'description');

  const timelineData = useMemo(() => {
    const dates: Record<string, number> = {};
    allResponses.forEach(r => {
      const date = new Date(r.submittedAt).toLocaleDateString();
      dates[date] = (dates[date] || 0) + 1;
    });
    return Object.entries(dates).map(([date, count]) => ({ date, count })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allResponses]);

  const radarData = useMemo(() => {
    const ratingQuestions = answerableQuestions.filter(q => q.type === 'rating');
    if (ratingQuestions.length < 3) return null;
    
    return ratingQuestions.map(q => {
      const answers = allResponses.map(r => Number(r.answers[q.id])).filter(n => !isNaN(n));
      const avg = answers.length > 0 ? answers.reduce((a,b) => a+b, 0) / answers.length : 0;
      return {
        subject: q.title || 'UNTITLED',
        value: avg,
        fullMark: 5, // Assuming rating is 1-5
      };
    });
  }, [allResponses, answerableQuestions]);

  const scoreDistributionData = useMemo(() => {
    if (!form.isQuiz) return [];
    const brackets = [
      { name: '0-20%', range: [0, 20], count: 0 },
      { name: '21-40%', range: [21, 40], count: 0 },
      { name: '41-60%', range: [41, 60], count: 0 },
      { name: '61-80%', range: [61, 80], count: 0 },
      { name: '81-100%', range: [81, 100], count: 0 },
    ];
    
    allResponses.forEach(r => {
      const p = r.scorePercent || 0;
      const b = brackets.find(b => p >= b.range[0] && p <= b.range[1]);
      if (b) b.count++;
    });
    
    return brackets;
  }, [allResponses, form.isQuiz]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-mono">
      {/* STATS HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-4 border-foreground p-6 bg-white shadow-brutal flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">TOTAL SUBMISSIONS</p>
            <p className="text-4xl font-black italic">{stats.total}</p>
          </div>
          <TrendingUp className="h-10 w-10 text-accent opacity-20" />
        </div>
        <div className="border-4 border-foreground p-6 bg-accent text-accent-foreground shadow-brutal flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">COMPLETION RATE</p>
            <p className="text-4xl font-black italic">{stats.completionRate}%</p>
          </div>
          <CheckCircle2 className="h-10 w-10 opacity-20" />
        </div>
        <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-brutal flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">AVG. TIME TO COMPLETE</p>
            <p className="text-4xl font-black italic">{stats.avgCompletionTime}</p>
          </div>
          <Clock className="h-10 w-10 opacity-20" />
        </div>
      </div>

      {/* QUIZ QUICK STATS */}
      {form.isQuiz && allResponses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-12">
          <div className="bg-orange-500 text-white p-4 border-4 border-foreground shadow-brutal-sm">
            <p className="text-[10px] font-black uppercase opacity-60">AVG. SCORE</p>
            <p className="text-3xl font-black italic">{Math.round(stats.avgScore)}%</p>
          </div>
          <div className="bg-purple-500 text-white p-4 border-4 border-foreground shadow-brutal-sm">
            <p className="text-[10px] font-black uppercase opacity-60">TOP PERFORMANCE</p>
            <p className="text-3xl font-black italic">{Math.round(stats.topScore)}%</p>
          </div>
        </div>
      )}

      {/* SEARCH AND CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="FILTER RESPONSES BY NAME, EMAIL, OR CONTENT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-4 border-foreground py-4 pl-12 pr-4 shadow-brutal focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-black text-xs uppercase"
          />
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex bg-white p-1 border-4 border-foreground shadow-brutal">
            <button
              onClick={() => setView('table')}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase flex items-center gap-2 transition-all",
                view === 'table' ? "bg-foreground text-background" : "hover:bg-accent/10"
              )}
            >
              <TableIcon className="h-4 w-4" /> DATABASE
            </button>
            <button
              onClick={() => setView('analytics')}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase flex items-center gap-2 transition-all",
                view === 'analytics' ? "bg-foreground text-background" : "hover:bg-accent/10"
              )}
            >
              <BarChart3 className="h-4 w-4" /> ANALYTICS
            </button>
          </div>
          
          <button
            onClick={() => exportCSV(filteredResponses)}
            disabled={filteredResponses.length === 0}
            className="border-brutal bg-accent text-accent-foreground px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:shadow-none translate-x-0 translate-y-0 active:translate-x-1 active:translate-y-1 transition-all shadow-brutal disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> EXPORT CSV
          </button>

          <button
            onClick={() => {
              window.print();
            }}
            disabled={filteredResponses.length === 0}
            className="border-brutal bg-secondary px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:shadow-none translate-x-0 translate-y-0 active:translate-x-1 active:translate-y-1 transition-all shadow-brutal disabled:opacity-50"
          >
            <Printer className="h-4 w-4" /> PRINT
          </button>

          <button
            onClick={async () => {
              if (!confirm('DELETE ALL RESPONSES? THIS CANNOT BE UNDONE.')) return;
              
              try {
                const { error } = await supabase
                  .from('responses')
                  .delete()
                  .eq('form_id', form.id);
                  
                if (error) {
                  console.error('Delete error:', error);
                  toast.error(`FAILED TO DELETE: ${error.message}`);
                } else {
                  setAllResponses([]);
                  toast.success('ALL RESPONSES DELETED.');
                }
              } catch (err) {
                console.error('Delete exception:', err);
                toast.error('FAILED TO DELETE RESPONSES.');
              }
            }}
            disabled={allResponses.length === 0}
            className="border-brutal bg-destructive text-destructive-foreground px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:shadow-none translate-x-0 translate-y-0 active:translate-x-1 active:translate-y-1 transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" /> DELETE ALL
          </button>
          
          <div className="flex items-center gap-2 relative group/info">
            <button
              onClick={handleAIAnalysis}
              disabled={filteredResponses.length < 50 || (form.researchGenerationsCount || 0) >= 2 || isAnalyzing}
              className="border-brutal bg-foreground text-background px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:shadow-none translate-x-0 translate-y-0 active:translate-x-1 active:translate-y-1 transition-all shadow-brutal disabled:opacity-50 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-accent translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                {isAnalyzing ? 'ANALYZING...' : 'AI RESEARCH PAPER'}
              </span>
            </button>
            <div className="h-10 w-10 flex items-center justify-center border-4 border-foreground bg-white shadow-brutal cursor-help">
              <Info className="h-5 w-5" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-4 w-64 bg-foreground text-background p-4 border-4 border-foreground shadow-[8px_8px_0px_#FF4400] opacity-0 pointer-events-none group-hover/info:opacity-100 transition-all z-50 translate-y-2 group-hover/info:translate-y-0">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-accent">SYSTEM REQUIREMENTS</p>
              <ul className="text-xs font-bold space-y-2">
                <li className="flex items-center justify-between">
                  <span>MIN. RESPONSES:</span>
                  <span className={allResponses.length >= 50 ? "text-emerald-400" : "text-destructive"}>{allResponses.length}/50</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>GENERATIONS USED:</span>
                  <span className={(form.researchGenerationsCount || 0) < 2 ? "text-emerald-400" : "text-destructive"}>{form.researchGenerationsCount || 0}/2</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:block print-header mb-8">
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">REVOX INTEL REPORT</h1>
            <p className="text-lg font-black uppercase tracking-widest mb-1 print-accent">{form.title || 'UNTITLED PROTOCOL'}</p>
            <p className="text-xs font-bold italic opacity-60">{form.description || 'No description provided.'}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase opacity-40 mb-1">GENERATED</p>
            <p className="text-xs font-black">{new Date().toLocaleDateString()}</p>
            <p className="text-[10px] font-bold opacity-60">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="print-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4cm' }}>
          <div style={{ border: '1px solid black', padding: '0.3cm' }}>
            <p className="text-[9px] font-black uppercase opacity-40 mb-1">TOTAL RESPONSES</p>
            <p className="text-xl font-black">{allResponses.length}</p>
          </div>
          <div style={{ border: '1px solid black', padding: '0.3cm' }}>
            <p className="text-[9px] font-black uppercase opacity-40 mb-1">QUESTIONS</p>
            <p className="text-xl font-black">{answerableQuestions.length}</p>
          </div>
          <div style={{ border: '1px solid black', padding: '0.3cm' }}>
            <p className="text-[9px] font-black uppercase opacity-40 mb-1">AVG. TIME</p>
            <p className="text-xl font-black">{stats.avgCompletionTime}</p>
          </div>
          {form.isQuiz && (
            <div style={{ border: '1px solid black', padding: '0.3cm' }}>
              <p className="text-[9px] font-black uppercase opacity-40 mb-1">AVG. SCORE</p>
              <p className="text-xl font-black">{Math.round(stats.avgScore)}%</p>
            </div>
          )}
        </div>
      </div>

      {/* PRINT-ONLY: Full response data dump */}
      <div className="hidden print:block print-page-break">
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 border-b-2 border-black pb-2">ALL RESPONSES ({allResponses.length})</h2>
        <div className="print-response-list">
          {allResponses.map((r, i) => (
            <div key={r.id} className="print-no-break" style={{ border: '1px solid black', padding: '0.4cm', marginBottom: '0.4cm', pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-start mb-3 border-b border-black/20 pb-2">
                <div>
                  <p className="text-sm font-black uppercase">#{i + 1} — {r.respondentName || 'ANONYMOUS'}</p>
                  <p className="text-[10px] font-bold opacity-60">{r.respondentEmail || 'No email'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black">{new Date(r.submittedAt).toLocaleDateString()} {new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  {r.timeTaken && <p className="text-[9px] opacity-60">Time: {r.timeTaken}s</p>}
                  {form.isQuiz && r.scorePercent !== undefined && (
                    <p className="text-[10px] font-black">Score: {r.score}/{r.totalPoints} ({r.scorePercent}%)</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.2cm' }}>
                {answerableQuestions.map(q => (
                  <div key={q.id} style={{ padding: '0.15cm' }}>
                    <p className="text-[8px] font-black uppercase opacity-50 mb-0.5">{q.title || 'UNTITLED'}</p>
                    <p className="text-[10px] font-bold">
                      {Array.isArray(r.answers[q.id]) ? r.answers[q.id].join(', ') : String(r.answers[q.id] ?? '—')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredResponses.length === 0 ? (
        <div className="border-4 border-foreground p-32 text-center bg-white shadow-brutal relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <Search className="h-20 w-20 mx-auto mb-8 text-foreground/10" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">THE DATABASE IS EMPTY.</h3>
            <p className="text-sm font-bold uppercase opacity-60">
              {searchQuery ? 'NO MATCHES FOUND FOR YOUR QUERY.' : 'WAITING FOR THE FIRST PRODUCTION DATA...'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-8 text-accent font-black uppercase underline underline-offset-8 decoration-4"
              >
                CLEAR FILTER
              </button>
            )}
          </div>
        </div>
      ) : view === 'table' ? (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">RESPONSE FEED</h3>
            <div className="h-1 flex-1 bg-foreground/10" />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredResponses.map((r, i) => (
              <div 
                key={r.id} 
                className="border-4 border-foreground bg-white p-6 shadow-brutal hover:shadow-brutal-lg transition-all group relative overflow-hidden flex flex-col lg:flex-row lg:items-center gap-8"
              >
                {/* STATUS BAR */}
                <div className="absolute top-0 left-0 h-full w-2 bg-accent/20 group-hover:bg-accent transition-all" />
                
                {/* AGENT INFO */}
                <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                  <div className="h-14 w-14 bg-foreground text-background font-black flex items-center justify-center text-sm shrink-0 border-2 border-foreground">
                    {r.respondentName?.[0] || (i + 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black uppercase text-base truncate leading-none mb-1">{r.respondentName || 'ANONYMOUS AGENT'}</p>
                    <div className="flex items-center gap-2 opacity-40">
                      <Mail className="h-3 w-3" />
                      <p className="text-[10px] font-black truncate tracking-tight lowercase">{r.respondentEmail || 'no_contact_data'}</p>
                    </div>
                  </div>
                </div>

                {/* TIMESTAMP & TIME TAKEN */}
                <div className="flex flex-col gap-2 lg:w-48 flex-shrink-0 lg:border-l-2 lg:border-foreground/10 lg:pl-8">
                  <div className="flex items-center gap-2 opacity-40">
                    <Clock className="h-4 w-4" />
                    <div className="text-[10px] font-black uppercase leading-tight">
                      {new Date(r.submittedAt).toLocaleDateString()}<br/>
                      <span className="opacity-60">{new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {form.isQuiz && r.scorePercent !== undefined && (
                    <div className="mt-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[9px] font-black uppercase text-accent">SCORE</span>
                        <span className="text-[10px] font-black">{r.score}/{r.totalPoints}</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/10 border border-foreground/20">
                        <div 
                          className="h-full bg-accent" 
                          style={{ width: `${r.scorePercent}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* DATA PREVIEW */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:border-l-2 lg:border-foreground/10 lg:pl-8">
                  {answerableQuestions.slice(0, 3).map(q => (
                    <div key={q.id} className="min-w-0">
                      <p className="text-[9px] font-black text-accent uppercase mb-1 truncate tracking-widest leading-none">{q.title || 'UNTITLED'}</p>
                      <p className="text-xs font-bold truncate group-hover:whitespace-normal group-hover:line-clamp-2 transition-all leading-relaxed">
                        {Array.isArray(r.answers[q.id]) ? r.answers[q.id].join(', ') : String(r.answers[q.id] ?? '—')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTON */}
                <div className="lg:w-32 flex justify-end flex-shrink-0">
                  <button 
                    onClick={() => setSelectedResponse(r)} 
                    className="group/btn flex items-center gap-3 px-6 py-4 border-4 border-foreground bg-background hover:bg-accent transition-all shadow-brutal-sm hover:shadow-none translate-x-0 translate-y-0 active:translate-x-1 active:translate-y-1"
                  >
                    <span className="text-[10px] font-black uppercase leading-none hidden sm:block">OPEN INTEL</span>
                    <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : view === 'analytics' ? (
        <div className="flex flex-col gap-12">
          {/* THEME SELECTOR INDICATOR */}
          <div className="flex items-center gap-4 bg-foreground text-background p-4 border-4 border-foreground shadow-brutal-sm">
            <div>
              <h3 className="text-xs font-black uppercase tracking-tighter">
                ACTIVE INTELLIGENCE: {(form.responseTheme || 'NORMAL').replace('_', ' ')}
              </h3>
              <p className="text-[10px] uppercase font-bold opacity-60">
                {form.responseTheme === 'survey' ? 'TREND DETECTION & CONSENSUS ANALYSIS' : 
                 form.responseTheme === 'research' ? 'STATISTICAL DISTRIBUTION & SCIENTIFIC DATA' :
                 form.responseTheme === 'data_work' ? 'OPERATIONAL METRICS & QUALITY CONTROL' :
                 'STANDARD DATA SUMMARIES'}
              </p>
            </div>
          </div>

          {/* PULSE TIMELINE - CRAZY AREA CHART */}
          <div className="border-4 border-foreground p-8 bg-white shadow-brutal mb-4 relative overflow-hidden group">
            <div className="flex items-start justify-between mb-8 border-b-4 border-foreground pb-4">
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">PRODUCTION PULSE</h3>
                <p className="text-xs font-black uppercase text-accent tracking-widest mt-1">REAL-TIME SUBMISSION FREQUENCY</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-40">SYSTEM STATUS</p>
                <p className="text-sm font-black text-emerald-500 animate-pulse">● SIGNAL ACTIVE</p>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4400" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4400" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" fontSize={8} fontWeight={900} axisLine={{ strokeWidth: 2 }} />
                  <YAxis fontSize={8} fontWeight={900} axisLine={{ strokeWidth: 2 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff', borderRadius: '0' }}
                    itemStyle={{ color: '#FF4400', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#FF4400" strokeWidth={4} fillOpacity={1} fill="url(#pulseGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QUIZ SCORE DISTRIBUTION */}
          {form.isQuiz && allResponses.length > 0 && (
            <div className="border-4 border-foreground p-8 bg-white shadow-brutal mb-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <Trophy size={120} className="text-foreground" />
              </div>
              <div className="flex items-start justify-between mb-8 border-b-4 border-foreground pb-4">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">SCORE DISTRIBUTION</h3>
                  <p className="text-xs font-black uppercase text-accent tracking-widest mt-1">PERCENTILE PERFORMANCE BREAKDOWN</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase opacity-40">AVERAGE PROFICIENCY</p>
                  <p className="text-sm font-black text-emerald-500">{Math.round(stats.avgScore)}% ACCURACY</p>
                </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" fontSize={10} fontWeight={900} axisLine={{ strokeWidth: 2 }} />
                    <YAxis fontSize={8} fontWeight={900} axisLine={{ strokeWidth: 2 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff', borderRadius: '0' }}
                      itemStyle={{ color: '#FF4400', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="count" fill="#FF4400" stroke="#000" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* RESEARCH MODE - DATA PROFILE RADAR */}
          {form.responseTheme === 'research' && radarData && (
            <div className="border-4 border-foreground p-8 bg-foreground text-background shadow-brutal mb-4 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 12%, transparent 12%, transparent 50%, #fff 50%, #fff 62%, transparent 62%, transparent 100%)', backgroundSize: '10px 10px' }} />
              <div className="flex items-center justify-between mb-8 border-b-2 border-background/20 pb-4 relative z-10">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">DATA SIGNATURE</h3>
                  <p className="text-xs font-black uppercase text-accent tracking-widest mt-1">MULTIDIMENSIONAL RESPONSE PROFILE</p>
                </div>
                <FlaskConical size={32} className="text-accent" />
              </div>

              <div className="h-[300px] w-full flex items-center justify-center relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#fff" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 8, fontWeight: 900 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                      name="Average"
                      dataKey="value"
                      stroke="#FF4400"
                      strokeWidth={3}
                      fill="#FF4400"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {answerableQuestions.map(q => {
              const answers = filteredResponses.map(r => r.answers[q.id]).filter(a => a !== undefined && a !== '');
              const isChoice = q.type === 'single_choice' || q.type === 'multiple_choice' || q.type === 'dropdown' || q.type === 'yes_no';
              const isNumeric = q.type === 'number' || q.type === 'rating';
              
              // Base stats for all
              const completion = getCompletionRate(answers, filteredResponses.length);

              if (form.responseTheme === 'data_work') {
                return (
                  <div key={q.id} className="border-4 border-foreground p-8 bg-white shadow-brutal flex flex-col min-h-[300px]">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-black uppercase italic truncate max-w-[200px]">{q.title || 'UNTITLED'}</h3>
                        <p className="text-[9px] font-black text-accent uppercase">{q.type.replace('_', ' ')}</p>
                      </div>
                      <Badge className="bg-foreground text-background font-black rounded-none">FIELD QUALITY</Badge>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-foreground p-4 bg-secondary/10">
                          <p className="text-[8px] font-black uppercase opacity-60 mb-1">COMPLETION</p>
                          <p className="text-2xl font-black">{completion.toFixed(1)}%</p>
                        </div>
                        <div className="border-2 border-foreground p-4 bg-secondary/10">
                          <p className="text-[8px] font-black uppercase opacity-60 mb-1">MISSING</p>
                          <p className="text-2xl font-black">{filteredResponses.length - answers.length}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-secondary border-2 border-foreground">
                          <div className="h-full bg-accent" style={{ width: `${completion}%` }} />
                        </div>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">
                          {completion === 100 ? 'DATA INTEGRITY SECURED' : 'DATA GAPS DETECTED'}
                        </p>
                      </div>

                      {isChoice && (
                        <div className="pt-4 border-t-2 border-foreground/5">
                          <p className="text-[9px] font-black uppercase mb-2 text-accent">TOP CATEGORY</p>
                          {(() => {
                            const counts: Record<string, number> = {};
                            answers.forEach(a => {
                              const vals = Array.isArray(a) ? a : [a];
                              vals.forEach((v: string) => { counts[v] = (counts[v] || 0) + 1; });
                            });
                            const con = getConsensus(counts, answers.length);
                            return con ? (
                              <div className="flex items-center justify-between font-black text-xs uppercase">
                                <span>{con.name}</span>
                                <span className="text-accent">{con.count} HITS</span>
                              </div>
                            ) : <p className="text-[10px] opacity-40">NO DATA</p>;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (form.responseTheme === 'research' && isNumeric) {
                const numValues = answers.map(a => Number(a)).filter(n => !isNaN(n));
                const resStats = calculateStats(numValues);
                
                return (
                  <div key={q.id} className="border-4 border-foreground p-8 bg-white shadow-brutal flex flex-col min-h-[400px]">
                    <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-foreground/10">
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter mb-1">{q.title || 'UNTITLED'}</h3>
                        <p className="text-[10px] font-black uppercase text-accent">STATISTICAL DISTRIBUTION</p>
                      </div>
                      <Badge className="rounded-none bg-foreground text-background font-black border-0">{answers.length} SAMPLES</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="border-2 border-foreground p-3 bg-secondary/20">
                        <p className="text-[8px] font-black opacity-40 uppercase">MEAN (μ)</p>
                        <p className="text-xl font-black">{resStats?.mean.toFixed(2) || '—'}</p>
                      </div>
                      <div className="border-2 border-foreground p-3 bg-secondary/20">
                        <p className="text-[8px] font-black opacity-40 uppercase">MEDIAN (M)</p>
                        <p className="text-xl font-black">{resStats?.median ?? '—'}</p>
                      </div>
                      <div className="border-2 border-foreground p-3 bg-secondary/20">
                        <p className="text-[8px] font-black opacity-40 uppercase">STD DEV (σ)</p>
                        <p className="text-xl font-black">{resStats?.stdDev.toFixed(2) || '—'}</p>
                      </div>
                    </div>

                    <div className="flex-1 w-full min-h-[150px]">
                      <ChartContainer config={{ value: { label: "Value" } }} className="w-full h-full">
                        <ResponsiveContainer>
                          <BarChart data={numValues.map((v, i) => ({ id: i, val: v }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="val" fill="#000" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                );
              }

              if (form.responseTheme === 'survey' && isChoice) {
                const counts: Record<string, number> = {};
                answers.forEach(a => {
                  const vals = Array.isArray(a) ? a : [a];
                  vals.forEach((v: string) => { counts[v] = (counts[v] || 0) + 1; });
                });
                const con = getConsensus(counts, answers.length);
                const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));

                return (
                  <div key={q.id} className="border-4 border-foreground p-8 bg-white shadow-brutal flex flex-col min-h-[400px]">
                    <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-foreground/10">
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter mb-1 leading-none">{q.title || 'UNTITLED'}</h3>
                        <p className="text-[10px] font-black uppercase text-accent">TREND ANALYSIS</p>
                      </div>
                    </div>

                    {con && con.isStrong && (
                      <div className="mb-6 p-4 bg-accent text-accent-foreground border-4 border-foreground shadow-brutal-sm animate-pulse-slow">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={14} className="fill-current" />
                          <p className="text-[10px] font-black uppercase tracking-widest leading-none">CONSENSUS DETECTED</p>
                        </div>
                        <p className="text-base font-black uppercase italic leading-tight">
                          "{con.name}" IS THE CLEAR WINNER WITH {con.percentage.toFixed(0)}% OF VOICES.
                        </p>
                      </div>
                    )}

                    <div className="flex-1 w-full flex items-center justify-center">
                      <ChartContainer config={{ value: { label: "Count" } }} className="w-full h-full max-h-[200px]">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#FF4400' : (index === 1 ? '#000' : '#444')} stroke="#000" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t-2 border-foreground/5 pt-4">
                      {chartData.sort((a,b) => b.value - a.value).map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[8px] font-black uppercase rounded-none border-foreground/20">
                            {idx + 1}. {item.name} ({item.value})
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              
              if (!isChoice) {
                return (
                  <div key={q.id} className="border-4 border-foreground p-8 bg-white shadow-brutal flex flex-col h-auto"
                  data-lenis-prevent
                  >
                    <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-foreground/10">
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter mb-1 leading-none">{q.title || 'UNTITLED'}</h3>
                        <p className="text-[10px] font-black uppercase text-accent">{q.type.replace('_', ' ')}</p>
                      </div>
                      <Badge className="rounded-none bg-foreground text-background font-black border-0">{answers.length} ANSWERS</Badge>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto pr-2 scrollbar-thin space-y-3">
                      {answers.map((a, i) => (
                        <div key={i} className="p-4 bg-secondary/20 border-l-8 border-accent text-[11px] font-bold leading-relaxed group hover:bg-secondary/40 transition-colors">
                          <p className="opacity-40 text-[9px] mb-1">ENTRY #{i+1}</p>
                          <span className="italic">"{String(a)}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Default Normal choice analysis
              const counts: Record<string, number> = {};
              answers.forEach(a => {
                const vals = Array.isArray(a) ? a : [a];
                vals.forEach((v: string) => { counts[v] = (counts[v] || 0) + 1; });
              });
              const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
              
              return (
                <div key={q.id} className="border-4 border-foreground p-8 bg-white shadow-brutal flex flex-col min-h-[400px]">
                  <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-foreground/10">
                    <div>
                      <h3 className="text-sm font-black uppercase italic tracking-tighter mb-1 leading-none">{q.title || 'UNTITLED'}</h3>
                      <p className="text-[10px] font-black uppercase text-accent">VISUAL ANALYSIS</p>
                    </div>
                    <Badge className="rounded-none bg-foreground text-background font-black border-0">{answers.length} SUBMISSIONS</Badge>
                  </div>

                  <div className="flex-1 w-full flex items-center justify-center">
                    {chartData.length > 0 ? (
                      <ChartContainer config={{ value: { label: "Count" } }} className="w-full h-full max-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartData.length <= 4 ? (
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {chartData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '0', color: '#fff' }}
                                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                              />
                            </PieChart>
                          ) : (
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                fontSize={8} 
                                fontWeight={900} 
                                textAnchor="end" 
                                height={60} 
                                interval={0} 
                                angle={-45} 
                                axisLine={{ strokeWidth: 2 }}
                              />
                              <YAxis fontSize={8} fontWeight={900} axisLine={{ strokeWidth: 2 }} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="value" fill="#FF4400" stroke="#000" strokeWidth={2} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <BarChart3 className="h-12 w-12" />
                        <p className="text-[10px] font-black uppercase">NO VISUALIZABLE DATA</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Legend/Summary */}
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {chartData.sort((a,b) => b.value - a.value).slice(0, 3).map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-2 w-2" style={{ backgroundColor: chartData.length <= 4 ? COLORS[idx % COLORS.length] : '#FF4400' }} />
                        <span className="text-[9px] font-black uppercase opacity-60">{item.name}</span>
                        <span className="text-[9px] font-black italic">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* DETAIL MODAL - REFINED */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-foreground/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setSelectedResponse(null)}>
          <div 
            className="bg-background border-8 border-foreground max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-brutal-lg animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-foreground text-background p-8 flex items-center justify-between">
              <div>
                <h3 className="font-black uppercase tracking-tighter text-3xl italic leading-none">AGENT DATA-01</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-black uppercase bg-accent text-accent-foreground px-2 py-0.5">VERIFIED RESPONSE</span>
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">ID: {selectedResponse.id.slice(0, 8)}</span>
                </div>
              </div>
              {form.isQuiz && selectedResponse.scorePercent !== undefined && (
                <div className="text-right mr-8">
                  <p className="text-[10px] font-black text-accent-foreground/60 uppercase tracking-widest leading-none mb-2">FINAL SCORE</p>
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-black italic leading-none">{selectedResponse.scorePercent}%</p>
                    <div className="text-[10px] font-black opacity-60 text-right">
                      {selectedResponse.score} / {selectedResponse.totalPoints}<br/>POINTS
                    </div>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setSelectedResponse(null)} 
                className="bg-accent text-accent-foreground p-3 border-4 border-foreground shadow-[4px_4px_0px_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                CLOSE
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-10 bg-white scrollbar-thin"
            data-lenis-prevent
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-8 border-b-4 border-foreground/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 bg-accent text-accent-foreground border-2 border-foreground flex items-center justify-center font-black">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">RESPONDENT</p>
                      <p className="font-black text-sm uppercase">{selectedResponse.respondentName || 'ANONYMOUS AGENT'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 bg-secondary border-2 border-foreground flex items-center justify-center font-black">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">CONTACT EMAIL</p>
                      <p className="text-xs font-bold underline underline-offset-2">{selectedResponse.respondentEmail || 'NOT PROVIDED'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 bg-foreground text-background border-2 border-foreground flex items-center justify-center font-black">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">SUBMITTED ON</p>
                      <p className="font-black text-sm uppercase">{new Date(selectedResponse.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 bg-white border-2 border-foreground flex items-center justify-center font-black">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">LOCAL TIME</p>
                      <p className="font-black text-sm uppercase">{new Date(selectedResponse.submittedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {answerableQuestions.map((q, idx) => (
                    <div key={q.id} className="relative pl-12">
                      <div className="absolute left-0 top-0 text-[10px] font-black text-foreground/10 h-full border-l-4 border-foreground/10 flex flex-col">
                        <span className="pt-2 pl-2">#{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <label className="text-xs font-black text-accent uppercase tracking-tighter block mb-3 italic">
                        {q.title || 'UNTITLED DATA FIELD'}
                        {form.isQuiz && q.correctAnswer !== undefined && (
                          <span className="ml-3 text-[9px] border border-current px-2 py-0.5 opacity-60 not-italic">
                            {q.points || 1} PTS
                          </span>
                        )}
                      </label>
                      <div className={cn(
                        "bg-secondary border-4 border-foreground p-6 shadow-brutal-sm group hover:shadow-brutal transition-all relative",
                        form.isQuiz && q.correctAnswer !== undefined && (
                          (() => {
                            const userAns = selectedResponse.answers[q.id];
                            let correct = false;
                            if (Array.isArray(q.correctAnswer)) {
                              const userArr = Array.isArray(userAns) ? [...userAns].sort() : [];
                              const correctArr = [...q.correctAnswer].sort();
                              correct = JSON.stringify(userArr) === JSON.stringify(correctArr);
                            } else if (typeof q.correctAnswer === 'number') {
                              correct = Number(userAns) === q.correctAnswer;
                            } else {
                              correct = String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                            }
                            return correct ? "border-emerald-500/50" : "border-destructive/50";
                          })()
                        )
                      )}>
                        <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">
                          {Array.isArray(selectedResponse.answers[q.id])
                            ? selectedResponse.answers[q.id].join(', ')
                            : String(selectedResponse.answers[q.id] ?? '—')}
                        </p>
                        
                        {form.isQuiz && q.correctAnswer !== undefined && (
                          <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-wrap gap-4 items-center">
                            {(() => {
                              const userAns = selectedResponse.answers[q.id];
                              let correct = false;
                              if (Array.isArray(q.correctAnswer)) {
                                const userArr = Array.isArray(userAns) ? [...userAns].sort() : [];
                                const correctArr = [...q.correctAnswer].sort();
                                correct = JSON.stringify(userArr) === JSON.stringify(correctArr);
                              } else if (typeof q.correctAnswer === 'number') {
                                correct = Number(userAns) === q.correctAnswer;
                              } else {
                                correct = String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                              }

                              return (
                                <>
                                  <div className={cn(
                                    "flex items-center gap-2 text-[10px] font-black uppercase px-2 py-1 border-2",
                                    correct ? "bg-emerald-500 text-white border-emerald-600" : "bg-destructive text-white border-destructive-foreground/20"
                                  )}>
                                    {correct ? <CheckCircle2 className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                                    {correct ? 'CORRECT' : 'WRONG'}
                                  </div>
                                  {!correct && (
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                      <span className="opacity-40">CORRECT ANSWER:</span>
                                      <span className="text-emerald-600">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : String(q.correctAnswer)}</span>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>

              {/* ACTION AREA */}
              <div className="mt-16 flex gap-4">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast.success("RESPONSE LINK COPIED TO CLIPBOARD");
                  }}
                  className="flex-1 border-4 border-foreground bg-accent text-accent-foreground py-4 text-xs font-black uppercase hover:shadow-brutal transition-all flex items-center justify-center gap-3 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Share2 className="h-5 w-5" /> SHARE ENTRY
                </button>
                <button 
                  onClick={async () => {
                    const data = JSON.stringify(selectedResponse, null, 2);
                    navigator.clipboard.writeText(data);
                    toast.success("RAW DATA COPIED TO CLIPBOARD");
                  }}
                  className="flex-1 border-4 border-foreground bg-white py-4 text-xs font-black uppercase hover:shadow-brutal transition-all flex items-center justify-center gap-3 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Copy className="h-5 w-5" /> COPY RAW DATA
                </button>
                <button 
                  onClick={async () => {
                    if (!confirm('DELETE THIS RESPONSE? THIS ACTION IS PERMANENT.')) return;
                    
                    try {
                      const { error } = await supabase
                        .from('responses')
                        .delete()
                        .eq('id', selectedResponse.id);
                        
                      if (error) {
                        toast.error(`FAILED TO DELETE: ${error.message}`);
                      } else {
                        setAllResponses(prev => prev.filter(r => r.id !== selectedResponse.id));
                        setSelectedResponse(null);
                        toast.success('RESPONSE DELETED.');
                      }
                    } catch (err) {
                      toast.error('FAILED TO DELETE RESPONSE.');
                    }
                  }}
                  className="flex-1 border-4 border-foreground bg-destructive text-destructive-foreground py-4 text-xs font-black uppercase hover:shadow-brutal transition-all flex items-center justify-center gap-3 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Trash2 className="h-5 w-5" /> DELETE ENTRY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI RESEARCH PAPER MODAL */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-foreground/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8" onClick={() => !isAnalyzing && setShowAnalysisModal(false)}>
          <div 
            className="bg-white border-8 border-foreground w-full max-w-4xl h-[90vh] flex flex-col shadow-brutal-lg animate-in fade-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-foreground text-background p-6 flex items-center justify-between shadow-brutal border-b-8 border-foreground shrink-0 z-10">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-2xl italic leading-none">AI RESEARCH PAPER</h3>
                  <p className="text-[10px] font-black text-accent-foreground/60 uppercase tracking-widest leading-none mt-1 flex items-center gap-2">
                    {isAnalyzing ? (
                      <>
                         <span className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                         SCANNING {(allResponses.length * form.questions.length).toLocaleString()} DATA POINTS...
                      </>
                    ) : (
                      <>STATUS: COMPLETE | MODEL: HACKING DEVICES</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {!isAnalyzing && researchPaper && (
                   <button 
                     onClick={handleDownloadPDF}
                     className="bg-accent text-accent-foreground px-4 py-2 border-4 border-foreground text-[10px] font-black uppercase hover:-translate-y-1 hover:shadow-brutal transition-all active:translate-y-1 active:shadow-none flex items-center gap-2"
                   >
                     <Download size={14} /> DOWNLOAD PDF
                   </button>
                )}
                <button 
                  onClick={() => !isAnalyzing && setShowAnalysisModal(false)}
                  disabled={isAnalyzing}
                  className="bg-transparent text-background px-4 py-2 border-4 border-background text-[10px] font-black uppercase hover:-translate-y-1 hover:bg-background hover:text-foreground transition-all active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CLOSE
                </button>
              </div>
            </div>
            
            {/* Content Body */}
            <div className="flex-1 overflow-y-auto bg-white" data-lenis-prevent>
               {isAnalyzing ? (
                 <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                   {/* Scanning background effect */}
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)', backgroundSize: '100% 4px' }} />
                   <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/20 to-transparent animate-scan" style={{ animation: 'scan 2s linear infinite' }} />
                   
                   <h2 className="text-4xl font-black uppercase italic tracking-tighter text-foreground mb-4 relative z-10 leading-none">
                     SYNTHESIZING INTELLIGENCE
                   </h2>
                   <p className="text-sm font-bold opacity-60 uppercase max-w-md relative z-10">
                     The neural network is currently ingesting {allResponses.length} raw responses, identifying patterns, and formatting the final research paper document.
                   </p>
                   
                   <div className="w-64 h-2 bg-foreground/10 border-2 border-foreground mt-8 p-[1px] relative z-10">
                     <div className="h-full bg-accent animate-pulse-fast w-full origin-left shrink-0" style={{ animation: 'load 2s ease-in-out infinite alternate' }} />
                   </div>
                   
                   {/* Inline style for the scanning/loading animations in this modal context */}
                   <style>{`
                     @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
                     @keyframes load { 0% { transform: scaleX(0.1); } 100% { transform: scaleX(1); } }
                     
                     .markdown-body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #111827; }
                     .markdown-body h1 { font-weight: 900; font-size: 2.2rem; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 0.75rem; margin-bottom: 2rem; margin-top: 2rem; color: #000; letter-spacing: -0.025em; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
                     .markdown-body h2 { font-weight: 800; font-size: 1.6rem; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; margin-bottom: 1.5rem; margin-top: 2.5rem; color: #111827; letter-spacing: -0.025em; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
                     .markdown-body h3 { font-weight: 800; font-size: 1.3rem; text-transform: uppercase; margin-bottom: 1.25rem; margin-top: 2rem; color: #000; letter-spacing: -0.01em; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
                     .markdown-body p { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.95rem; line-height: 1.8; margin-bottom: 1.75rem; color: #111827; }
                     .markdown-body ul, .markdown-body ol { margin-bottom: 2rem; padding-left: 1.5rem; }
                     .markdown-body li { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; margin-bottom: 0.75rem; line-height: 1.7; font-size: 0.95rem; color: #111827; }
                     .markdown-body li > p { margin-bottom: 0.5rem; }
                     .markdown-body strong { font-weight: 800; color: #000; }
                     .markdown-body em { font-style: italic; color: #4B5563; }
                     .markdown-body blockquote { border-left: 4px solid #000; padding-left: 1.25rem; font-style: italic; background: #F9FAFB; padding: 1.25rem; margin-bottom: 2rem; color: #111827; border-radius: 0 0.5rem 0.5rem 0; }
                     
                     /* Beautiful Table Styling */
                     .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 2.5rem; border-radius: 0; overflow: hidden; border: 2px solid #000; table-layout: fixed; word-wrap: break-word; }
                     .markdown-body th, .markdown-body td { padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; vertical-align: top; font-size: 0.95rem; line-height: 1.6; }
                     .markdown-body th:last-child, .markdown-body td:last-child { border-right: none; }
                     .markdown-body th { background-color: #F8FAFC; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; color: #000; letter-spacing: 0.05em; border-bottom: 2px solid #000; }
                     .markdown-body tr:last-child td { border-bottom: none; }
                     .markdown-body tr:nth-child(even) td { background-color: #FAFAFA; }

                     /* PDF specific utilities */
                     .pdf-page-break { page-break-before: always; }
                     .pdf-no-break { page-break-inside: avoid; }
                     .markdown-body h1, .markdown-body h2, .markdown-body h3 { page-break-after: avoid; }
                     .markdown-body blockquote, .markdown-body table, .markdown-body img, .markdown-body p, .markdown-body li { page-break-inside: avoid; }
                   `}</style>
                 </div>
               ) : (
                 <div className="p-4 sm:p-8 bg-neutral-100 min-h-full">
                    {/* The printable/downloadable element */}
                    <div ref={paperRef} className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-sm relative" style={{ minHeight: '1056px' }}>
                       
                       {/* Top decorative stripe for PDF */}
                       <div className="pdf-header-element absolute top-0 left-0 w-full h-2 bg-black" style={{ display: 'none' }} />

                       {/* Header for PDF explicitly */}
                       <div className="pdf-header-element mb-10 pb-6 border-b border-gray-200" style={{ display: 'none' }}>
                         <div className="flex justify-between items-end">
                           <div>
                             <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-1">REVOX RESEARCH</h1>
                             <p className="font-semibold text-xs text-gray-500 uppercase tracking-widest">{form.title || 'INTELLIGENCE REPORT'}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-semibold text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">GENERATED ON</p>
                             <p className="font-bold text-xs text-black">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="markdown-body font-sans pt-2">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{researchPaper || ''}</ReactMarkdown>
                       </div>
                       
                       {/* Footer for PDF explicitly */}
                       <div className="pdf-footer-element mt-16 pt-8 border-t border-gray-200" style={{ display: 'none' }}>
                         <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                             <div className="w-4 h-4 bg-black" />
                             <p className="font-black text-[10px] text-black uppercase tracking-widest">REVOX ENGINE</p>
                           </div>
                           <p className="font-medium text-[9px] text-gray-400 uppercase tracking-widest text-right max-w-[200px] leading-tight">
                             CONFIDENTIAL INTERNAL DOCUMENT <br/> POWERED BY GROQ MIXTRAL
                           </p>
                         </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResponsesTab;
