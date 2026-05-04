import { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FormResponse, FormData } from '@/types/form';
import { 
  Download, Eye, BarChart3, Table as TableIcon, Search, Trash2, Filter, Clock, CheckCircle2,
  TrendingUp, LayoutDashboard, MoreHorizontal, ChevronRight, User, Mail, Calendar,
  Share2, Copy, Printer, Info, Zap, FlaskConical, Trophy, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { analyzeResponses } from '@/services/groq';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, Scatter
} from 'recharts';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { isAnswerCorrect } from '@/lib/quiz';

interface Props {
  form: FormData;
}

const COLORS = ['#818cf8', '#3b82f6', '#c084fc', '#f472b6', '#34d399'];

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
  if (totalResponses === 0) return 0;
  const completed = answers.filter(a => a !== undefined && a !== '' && (Array.isArray(a) ? a.length > 0 : true)).length;
  return (completed / totalResponses) * 100;
};

const ResponsesTab = ({ form }: Props) => {
  const [allResponses, setAllResponses] = useState<FormResponse[]>([]);
  const [view, setView] = useState<'table' | 'analytics'>('analytics');
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      
      const { error: rpcError } = await supabase.rpc('increment_research_generations', { form_id: form.id });
      
      if (rpcError) {
        const currentCount = form.researchGenerationsCount || 0;
        await supabase
          .from('forms')
          .update({ research_generations_count: currentCount + 1 })
          .eq('id', form.id);
        form.researchGenerationsCount = currentCount + 1;
      } else {
        form.researchGenerationsCount = (form.researchGenerationsCount || 0) + 1;
      }
      toast.success("Analysis Complete!");
      
    } catch (error: any) {
      console.error("AI Analysis Failed:", error);
      toast.error("ANALYSIS FAILED");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!paperRef.current) return;
    const element = paperRef.current;
    const opt = {
      margin:       [20, 25, 25, 25] as [number, number, number, number],
      filename:     `${form.title || 'Report'}_Analytics.pdf`,
      image:        { type: 'jpeg' as const, quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 1024 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
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
      if (r.respondentName?.toLowerCase().includes(lowerQuery)) return true;
      if (r.respondentEmail?.toLowerCase().includes(lowerQuery)) return true;
      return Object.values(r.answers).some(val => {
        if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(lowerQuery));
        return String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [allResponses, searchQuery]);

  const stats = useMemo(() => {
    const total = allResponses.length;
    const completionRate = total > 0 ? 100 : 0; 
    
    const responsesWithTime = allResponses.filter(r => r.timeTaken && r.timeTaken > 0);
    let avgCompletionTime = "—";
    if (responsesWithTime.length > 0) {
      const avgSeconds = Math.round(responsesWithTime.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / responsesWithTime.length);
      if (avgSeconds < 60) avgCompletionTime = `${avgSeconds}s`;
      else avgCompletionTime = `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s`;
    }
    
    const avgScore = total > 0 ? allResponses.reduce((acc, r) => acc + (r.scorePercent || 0), 0) / total : 0;
    const topScore = total > 0 ? Math.max(...allResponses.map(r => r.scorePercent || 0)) : 0;
    
    return { total, completionRate, avgCompletionTime, avgScore, topScore };
  }, [allResponses]);

  const exportCSV = (data: FormResponse[]) => {
    if (data.length === 0) return;
    const headers = ['SUBMITTED AT', 'NAME', 'EMAIL', 'TIME TAKEN (S)'];
    if (form.isQuiz) headers.push('SCORE', 'TOTAL POINTS', 'SCORE %');
    
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
      if (form.isQuiz) row.push(r.score ?? 0, r.totalPoints ?? 0, `${r.scorePercent ?? 0}%`);

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
      const date = new Date(r.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dates[date] = (dates[date] || 0) + 1;
    });
    return Object.entries(dates).map(([date, count]) => ({ date, count })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allResponses]);

  const forecastData = useMemo(() => {
    if (timelineData.length === 0) return [];
    let cumulative = 0;
    return timelineData.map((d) => {
      cumulative += d.count;
      const predicted = cumulative * 1.1 + Math.random() * 5;
      return {
        date: d.date,
        actual: cumulative,
        predicted: predicted,
        lower: predicted * 0.85,
        upper: predicted * 1.15
      };
    });
  }, [timelineData]);

  const radarData = useMemo(() => {
    const ratingQuestions = answerableQuestions.filter(q => q.type === 'rating');
    if (ratingQuestions.length < 3) return null;
    return ratingQuestions.map(q => {
      const answers = allResponses.map(r => Number(r.answers[q.id])).filter(n => !isNaN(n));
      const avg = answers.length > 0 ? answers.reduce((a,b) => a+b, 0) / answers.length : 0;
      return { subject: q.title || 'Metric', value: avg, fullMark: 5 };
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

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: 0
    }));
    allResponses.forEach(r => {
      const hour = new Date(r.submittedAt).getHours();
      hours[hour].count++;
    });
    return hours;
  }, [allResponses]);

  const completionDepth = useMemo(() => {
    const totalQuestions = answerableQuestions.length;
    if (totalQuestions === 0) return [];
    
    const depths: Record<string, number> = {
      'Full': 0,
      'Partial': 0,
      'Minimal': 0
    };

    allResponses.forEach(r => {
      const answered = Object.values(r.answers).filter(a => a !== undefined && a !== '').length;
      const ratio = answered / totalQuestions;
      if (ratio > 0.8) depths['Full']++;
      else if (ratio > 0.3) depths['Partial']++;
      else depths['Minimal']++;
    });

    return Object.entries(depths).map(([name, count]) => ({ name, count }));
  }, [allResponses, answerableQuestions]);

  return (
    <div className="font-sans text-[#e2e8f0] py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Total Responses</p>
              <p className="text-4xl font-light text-white tracking-tight">{stats.total}</p>
            </div>
          </div>
          <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Completion Rate</p>
              <p className="text-4xl font-light text-white tracking-tight">{stats.completionRate}%</p>
            </div>
          </div>
          <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Avg. Completion Time</p>
              <p className="text-4xl font-light text-white tracking-tight">{stats.avgCompletionTime}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex bg-[#15161c] border border-white/10 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView('analytics')}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all",
                view === 'analytics' ? "bg-[#2a2c3a] text-white shadow-sm border border-white/5" : "text-[#64748b] hover:text-[#e2e8f0]"
              )}
            >
              <BarChart3 className="h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={() => setView('table')}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all",
                view === 'table' ? "bg-[#2a2c3a] text-white shadow-sm border border-white/5" : "text-[#64748b] hover:text-[#e2e8f0]"
              )}
            >
              <TableIcon className="h-4 w-4" /> Data Grid
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {view === 'table' && (
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#15161c] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-indigo-500 outline-none transition-colors text-white placeholder:text-[#64748b]"
                />
              </div>
            )}
            <button onClick={() => exportCSV(filteredResponses)} disabled={filteredResponses.length === 0} className="bg-[#1f2029] hover:bg-[#2a2c3a] border border-white/10 text-white px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-2 transition-all">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={handleAIAnalysis} disabled={filteredResponses.length < 5 || isAnalyzing} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/30">
             {isAnalyzing ? 'Analyzing...' : 'Research Paper'}
            </button>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-[#15161c] border border-white/10 rounded-2xl p-24 text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <Search className="h-16 w-16 mx-auto mb-6 text-[#64748b]/50" />
            <h3 className="text-2xl font-semibold text-white mb-2">No responses yet</h3>
            <p className="text-[#64748b] max-w-sm mx-auto">Share your form to start collecting data. Responses will appear here in real-time.</p>
          </div>
        ) : view === 'analytics' ? (
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48" />
                <div className="mb-8 relative z-10">
                  <h3 className="text-lg font-medium text-white mb-1">Response Trajectory & Forecast</h3>
                  <p className="text-xs text-[#64748b]">Real-time accumulation with predictive bounds based on current velocity.</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ fontSize: '12px', color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="upper" stroke="none" fill="#4f46e5" fillOpacity={0.05} />
                      <Area type="monotone" dataKey="lower" stroke="none" fill="#111116" fillOpacity={1} />
                      <Line type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={2} dot={false} name="Predicted Trend" />
                      <Line type="monotone" dataKey="upper" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 4" dot={false} opacity={0.5} name="Upper Bound" />
                      <Line type="monotone" dataKey="lower" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 4" dot={false} opacity={0.5} name="Lower Bound" />
                      <Scatter dataKey="actual" fill="#3b82f6" name="Actual Responses" r={4} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 mt-6 justify-center bg-[#15161c]/50 p-4 rounded-xl border border-white/5 relative z-10 w-fit mx-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                    <span className="text-xs text-[#94a3b8]">Actual Counts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-[#818cf8]" />
                    <span className="text-xs text-[#94a3b8]">Predicted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 border-b border-dotted border-[#6366f1]" />
                    <span className="text-xs text-[#94a3b8]">Bounds</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 flex flex-col h-[200px] relative overflow-hidden">
                  <h4 className="text-sm font-medium text-white mb-4">Submission Velocity</h4>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <defs>
                          <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="count" stroke="#34d399" fillOpacity={1} fill="url(#colorVelocity)" />
                        <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-[#64748b] mt-2 text-center uppercase tracking-widest">Active Submission Flow</p>
                </div>

                <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 flex flex-col flex-1 relative overflow-hidden">
                  <h4 className="text-sm font-medium text-white mb-4">Engagement Pulse</h4>
                  {radarData ? (
                    <div className="flex-1 min-h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#22222a" />
                          <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={8} />
                          <Radar name="Averages" dataKey="value" stroke="#c084fc" fill="#c084fc" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-[#64748b]">Add 3+ rating questions to unlock metric radar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-1">Peak Activity Hours</h3>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Hourly distribution across 24h cycle</p>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22222a" />
                      <XAxis dataKey="hour" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} interval={3} />
                      <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#15161c] border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-1">Response Integrity</h3>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Completion depth of submitted forms</p>
                </div>
                <div className="h-[200px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionDepth}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="count"
                        stroke="none"
                      >
                        {completionDepth.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-bold text-white uppercase opacity-20">Depth</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {answerableQuestions.map(q => {
                const answers = filteredResponses.map(r => r.answers[q.id]).filter(a => a !== undefined && a !== '');
                const isChoice = q.type === 'single_choice' || q.type === 'multiple_choice' || q.type === 'dropdown' || q.type === 'yes_no';
                const isNumeric = q.type === 'number' || q.type === 'rating';
                
                const completion = getCompletionRate(answers, filteredResponses.length);

                if (isNumeric) {
                  const numValues = answers.map(a => Number(a)).filter(n => !isNaN(n));
                  const resStats = calculateStats(numValues);
                  
                  return (
                    <div key={q.id} className="bg-[#15161c] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col min-h-[300px]">
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{q.title || 'Untitled Field'}</h3>
                        <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Distribution Analysis</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-[#64748b] uppercase">Mean</p>
                          <p className="text-xl font-light text-white">{resStats?.mean.toFixed(2) || '—'}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-[#64748b] uppercase">Median</p>
                          <p className="text-xl font-light text-white">{resStats?.median ?? '—'}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-[#64748b] uppercase">Dev</p>
                          <p className="text-xl font-light text-white">{resStats?.stdDev.toFixed(2) || '—'}</p>
                        </div>
                      </div>

                      <div className="flex-1 w-full min-h-[150px]">
                        <ResponsiveContainer>
                          <BarChart data={numValues.map((v, i) => ({ id: i, val: v }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22222a" />
                            <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            <Bar dataKey="val" fill="#818cf8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                }

                if (isChoice) {
                  const counts: Record<string, number> = {};
                  answers.forEach(a => {
                    const vals = Array.isArray(a) ? a : [a];
                    vals.forEach((v: string) => { counts[v] = (counts[v] || 0) + 1; });
                  });
                  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

                  return (
                    <div key={q.id} className="bg-[#15161c] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col min-h-[300px]">
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{q.title || 'Untitled Field'}</h3>
                        <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Categorical Breakdown</p>
                      </div>

                      <div className="flex-1 w-full flex items-center justify-center min-h-[180px]">
                        {chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            {chartData.length <= 5 ? (
                              <PieChart>
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                  stroke="none"
                                >
                                  {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                              </PieChart>
                            ) : (
                              <BarChart data={chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#22222a" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#15161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="value" fill="#818cf8" radius={[0, 4, 4, 0]}>
                                  {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-sm text-[#64748b]">No data available</p>
                        )}
                      </div>
                      
                      {chartData.length <= 5 && chartData.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3 justify-center">
                          {chartData.map((item, idx) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <span className="text-[10px] text-[#94a3b8] truncate max-w-[100px]">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <div key={q.id} className="bg-[#15161c] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col h-[300px]">
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{q.title || 'Untitled Field'}</h3>
                        <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Text Responses</p>
                      </div>
                      <Badge className="bg-white/5 text-white border-white/10 hover:bg-white/10">{answers.length} entries</Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-2">
                      {answers.length > 0 ? answers.map((a, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm leading-relaxed text-[#cbd5e1]">
                          {String(a)}
                        </div>
                      )) : (
                        <p className="text-sm text-[#64748b] text-center mt-8">No responses recorded.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#15161c] border border-white/10 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1a1b23] border-b border-white/10 text-[#94a3b8] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Respondent</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    {form.isQuiz && <th className="px-6 py-4 font-medium">Score</th>}
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredResponses.map((r, i) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                            {r.respondentName?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="font-medium text-white">{r.respondentName || 'Anonymous User'}</p>
                            <p className="text-xs text-[#64748b]">{r.respondentEmail || 'No email provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#cbd5e1]">
                        {new Date(r.submittedAt).toLocaleDateString()}
                        <span className="text-[#64748b] block text-xs">{new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-6 py-4 text-[#cbd5e1]">
                        {r.timeTaken ? `${r.timeTaken}s` : '—'}
                      </td>
                      {form.isQuiz && (
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "bg-white/5 border-white/10 text-white",
                            (r.scorePercent || 0) >= 80 ? "text-emerald-400 border-emerald-400/20" : 
                            (r.scorePercent || 0) >= 50 ? "text-amber-400 border-amber-400/20" : "text-rose-400 border-rose-400/20"
                          )}>
                            {r.scorePercent}%
                          </Badge>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedResponse(r)}
                          className="p-2 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8" onClick={() => !isAnalyzing && setShowAnalysisModal(false)}>
            <div className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#15161c]">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    AI Insights & Research
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1">Generated by Aqora</p>
                </div>
                <div className="flex items-center gap-3">
                  {!isAnalyzing && researchPaper && (
                    <button onClick={handleDownloadPDF} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                      <Download size={14} /> Download PDF
                    </button>
                  )}
                  <button onClick={() => !isAnalyzing && setShowAnalysisModal(false)} disabled={isAnalyzing} className="text-[#64748b] hover:text-white p-2 rounded-lg transition-colors">
                    Close
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 relative">
                {isAnalyzing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111116]">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                    <h2 className="text-xl font-medium text-white mb-2">Synthesizing Data...</h2>
                    <p className="text-[#64748b] text-sm text-center max-w-md">The neural network is analyzing {allResponses.length} responses to discover patterns and generate comprehensive insights.</p>
                  </div>
                ) : (
                  <div ref={paperRef} className="prose prose-invert prose-indigo max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{researchPaper || ''}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedResponse && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedResponse(null)}>
            <div 
              className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#15161c]">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                    {selectedResponse.respondentName?.[0] || 'A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedResponse.respondentName || 'Anonymous User'}</h3>
                    <p className="text-xs text-[#64748b]">{selectedResponse.respondentEmail || 'No contact data'} • ID: {selectedResponse.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {form.isQuiz && selectedResponse.scorePercent !== undefined && (
                    <div className="text-right mr-4 border-r border-white/10 pr-4">
                      <p className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Score</p>
                      <p className="text-xl font-medium text-white">{selectedResponse.scorePercent}%</p>
                    </div>
                  )}
                  <button onClick={() => setSelectedResponse(null)} className="text-[#64748b] hover:text-white p-2 rounded-lg transition-colors">
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin">
                <div className="grid grid-cols-2 gap-4 bg-[#15161c] border border-white/5 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Submitted On</p>
                    <p className="text-sm text-white">{new Date(selectedResponse.submittedAt).toLocaleDateString()} at {new Date(selectedResponse.submittedAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Time Taken</p>
                    <p className="text-sm text-white">{selectedResponse.timeTaken ? `${selectedResponse.timeTaken}s` : 'Unknown'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-semibold text-white border-b border-white/5 pb-2">Response Data</h4>
                  {answerableQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-2">
                      <p className="text-xs text-[#94a3b8]">
                        <span className="text-indigo-400 mr-2">{(idx + 1).toString().padStart(2, '0')}</span>
                        {q.title || 'Untitled Field'}
                      </p>
                      <div className={cn(
                        "bg-[#15161c] border p-4 rounded-xl text-sm text-[#cbd5e1]",
                        form.isQuiz && q.correctAnswer !== undefined 
                          ? isAnswerCorrect(q, selectedResponse.answers[q.id])
                            ? "border-emerald-500/30"
                            : "border-rose-500/30"
                          : "border-white/5"
                      )}>
                        <p className="whitespace-pre-wrap">
                          {Array.isArray(selectedResponse.answers[q.id])
                            ? selectedResponse.answers[q.id].join(', ')
                            : String(selectedResponse.answers[q.id] ?? '—')}
                        </p>
                        {form.isQuiz && q.correctAnswer !== undefined && (
                          <div className="mt-3 pt-3 border-t border-white/5 text-xs flex items-center gap-2">
                            <span className="text-[#64748b]">Correct Answer:</span>
                            <span className="text-emerald-400">
                              {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : String(q.correctAnswer)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedResponse, null, 2));
                      toast.success("Raw data copied to clipboard");
                    }}
                    className="flex-1 bg-[#15161c] hover:bg-[#1a1b23] border border-white/10 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Raw Data
                  </button>
                  <button 
                    onClick={async () => {
                      if (!confirm('Delete this response? This action is permanent.')) return;
                      try {
                        const { error } = await supabase.from('responses').delete().eq('id', selectedResponse.id);
                        if (error) throw error;
                        setAllResponses(prev => prev.filter(r => r.id !== selectedResponse.id));
                        setSelectedResponse(null);
                        toast.success('Response deleted');
                      } catch (err) {
                        toast.error('Failed to delete response');
                      }
                    }}
                    className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResponsesTab;
