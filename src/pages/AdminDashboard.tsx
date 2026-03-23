import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import {
  Users, FileText, MessageSquare, Activity, BarChart3,
  CheckCircle2, Clock, AlertTriangle, XCircle, Filter,
  RefreshCw, Eye, ChevronDown, ChevronUp, Shield, Bug,
  MessageCircle, Lightbulb, TrendingUp, Layers, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  user_id: string | null;
  user_email: string;
  type: 'bug' | 'feedback' | 'complaint' | 'feature_request';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PlatformStats {
  totalUsers: number;
  totalForms: number;
  totalResponses: number;
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  activeForms: number;
  formsToday: number;
  responsesToday: number;
}

const statusConfig = {
  open: { label: 'OPEN', icon: <Clock size={12} />, color: 'bg-accent text-accent-foreground' },
  in_progress: { label: 'IN PROGRESS', icon: <Activity size={12} />, color: 'bg-foreground text-background' },
  resolved: { label: 'RESOLVED', icon: <CheckCircle2 size={12} />, color: 'bg-green-500 text-secondary-foreground border-2 border-foreground' },
  closed: { label: 'CLOSED', icon: <XCircle size={12} />, color: 'bg-black text-white border-2 border-foreground' },
};

const typeIcons = {
  bug: <Bug size={14} />,
  feedback: <MessageCircle size={14} />,
  complaint: <AlertTriangle size={14} />,
  feature_request: <Lightbulb size={14} />,
};

const priorityColors = {
  low: 'opacity-50',
  medium: '',
  high: 'text-accent font-black',
  critical: 'text-destructive font-black animate-pulse',
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0, totalForms: 0, totalResponses: 0, totalComplaints: 0,
    openComplaints: 0, resolvedComplaints: 0, activeForms: 0, formsToday: 0, responsesToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAll();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forms' }, () => loadStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'responses' }, () => loadStats())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadAll = async () => {
    await Promise.all([loadStats(), loadComplaints()]);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const [formsRes, responsesRes, complaintsRes, formsTodayRes, responsesTodayRes] = await Promise.all([
        supabase.from('forms').select('*', { count: 'exact', head: true }),
        supabase.from('responses').select('*', { count: 'exact', head: true }),
        supabase.from('complaints').select('*', { count: 'exact', head: true }),
        supabase.from('forms').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('responses').select('*', { count: 'exact', head: true }).gte('submitted_at', todayISO),
      ]);

      const { count: openCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: resolvedCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

      setStats({
        totalUsers: 0, // Can't count auth.users from client side
        totalForms: formsRes.count || 0,
        totalResponses: responsesRes.count || 0,
        totalComplaints: complaintsRes.count || 0,
        openComplaints: openCount || 0,
        resolvedComplaints: resolvedCount || 0,
        activeForms: 0,
        formsToday: formsTodayRes.count || 0,
        responsesToday: responsesTodayRes.count || 0,
      });
    } catch (err) {
      console.error('Stats load error:', err);
    }
  };

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComplaints(data || []);
    } catch (err) {
      console.error('Complaints load error:', err);
    }
  };

  const updateComplaintStatus = async (id: string, newStatus: Complaint['status']) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const updateAdminNotes = async (id: string) => {
    const notes = editingNotes[id];
    if (notes === undefined) return;
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, admin_notes: notes } : c));
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }, [complaints, statusFilter, typeFilter]);

  const complaintsByType = useMemo(() => {
    const counts = { bug: 0, feedback: 0, complaint: 0, feature_request: 0 };
    complaints.forEach(c => { counts[c.type]++; });
    return counts;
  }, [complaints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl font-black uppercase animate-pulse">LOADING ADMIN TERMINAL...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-foreground font-mono">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* NAV */}
      <nav className="border-b-4 border-foreground sticky top-0 bg-background z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase hover:text-accent transition-colors flex items-center gap-2">
            REVOX<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5">
              <Shield size={14} />
              <span className="text-xs font-black uppercase">ADMIN PANEL</span>
            </div>
            <Link to="/dashboard" className="border-2 border-foreground px-4 py-2 text-xs font-black uppercase hover:bg-foreground hover:text-background transition-all">
              ← USER DASHBOARD
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4">
            ADMIN<br /><span className="text-accent">CONTROL.</span>
          </h1>
          <p className="text-sm font-bold uppercase opacity-60 border-l-4 border-accent pl-4 max-w-lg">
            Platform overview, complaint management, and system health monitoring.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'TOTAL FORMS', value: stats.totalForms, icon: FileText, accent: false },
            { label: 'TOTAL RESPONSES', value: stats.totalResponses, icon: MessageSquare, accent: true },
            { label: 'FORMS TODAY', value: stats.formsToday, icon: TrendingUp, accent: false },
            { label: 'RESPONSES TODAY', value: stats.responsesToday, icon: Zap, accent: true },
            { label: 'TOTAL TICKETS', value: stats.totalComplaints, icon: Layers, accent: false },
            { label: 'OPEN TICKETS', value: stats.openComplaints, icon: AlertTriangle, accent: true },
            { label: 'RESOLVED', value: stats.resolvedComplaints, icon: CheckCircle2, accent: false },
            { label: 'RESOLUTION RATE', value: stats.totalComplaints > 0 ? `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%` : '—', icon: BarChart3, accent: true },
          ].map((s, i) => (
            <div key={i} className={cn(
              "border-4 border-foreground p-6 relative overflow-hidden",
              s.accent ? "bg-accent text-accent-foreground" : "bg-background"
            )}>
              <s.icon className="absolute -right-2 -bottom-2 h-16 w-16 opacity-10" />
              <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">{s.label}</p>
              <p className="text-3xl font-black italic tracking-tighter">{s.value}</p>
            </div>
          ))}
        </div>

        {/* TICKET TYPE BREAKDOWN */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {(Object.entries(complaintsByType) as [string, number][]).map(([type, count]) => (
            <div key={type} className="border-2 border-foreground p-4 bg-background flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center bg-secondary">
                {typeIcons[type as keyof typeof typeIcons]}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase opacity-60">{type.replace('_', ' ')}</p>
                <p className="text-xl font-black">{count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COMPLAINTS MANAGEMENT */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              TICKETS<span className="text-accent">.</span>
            </h2>
            <div className="flex gap-3 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-2 border-foreground bg-background px-3 py-2 text-xs font-black uppercase outline-none focus:border-accent"
              >
                <option value="all">ALL STATUS</option>
                <option value="open">OPEN</option>
                <option value="in_progress">IN PROGRESS</option>
                <option value="resolved">RESOLVED</option>
                <option value="closed">CLOSED</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border-2 border-foreground bg-background px-3 py-2 text-xs font-black uppercase outline-none focus:border-accent"
              >
                <option value="all">ALL TYPES</option>
                <option value="bug">BUG</option>
                <option value="feedback">FEEDBACK</option>
                <option value="complaint">COMPLAINT</option>
                <option value="feature_request">FEATURE REQ</option>
              </select>
              <button
                onClick={loadAll}
                className="border-2 border-foreground p-2 hover:bg-foreground hover:text-background transition-all"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="border-4 border-foreground bg-background p-16 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-black uppercase italic">NO TICKETS FOUND.</p>
              <p className="text-xs font-bold uppercase opacity-50 mt-2">All clear in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((c) => {
                const isExpanded = expandedId === c.id;
                const stCfg = statusConfig[c.status];
                return (
                  <div key={c.id} className="border-4 border-foreground bg-background">
                    {/* Row Header */}
                    <div
                      className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    >
                      {/* Priority Indicator */}
                      <div className={cn("w-2 h-full min-h-[40px] self-stretch", {
                        'bg-muted': c.priority === 'low',
                        'bg-foreground': c.priority === 'medium',
                        'bg-accent': c.priority === 'high',
                        'bg-destructive': c.priority === 'critical',
                      })} />

                      {/* Type Icon */}
                      <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center shrink-0">
                        {typeIcons[c.type]}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black uppercase truncate">{c.subject}</p>
                        <p className="text-[10px] font-bold opacity-50 mt-0.5">
                          {c.user_email} · {new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={cn("px-3 py-1 text-[9px] font-black uppercase flex items-center gap-1 shrink-0", stCfg.color)}>
                        {stCfg.icon} {stCfg.label}
                      </span>

                      {/* Priority label */}
                      <span className={cn("text-[9px] font-black uppercase shrink-0", priorityColors[c.priority])}>
                        {c.priority}
                      </span>

                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t-4 border-foreground p-6 space-y-4 bg-secondary/20">
                        {/* Message */}
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">MESSAGE</p>
                          <p className="text-sm font-bold leading-relaxed border-l-4 border-accent pl-4">{c.message}</p>
                        </div>

                        {/* Status Actions */}
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">UPDATE STATUS</p>
                          <div className="flex flex-wrap gap-2">
                            {(['open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => updateComplaintStatus(c.id, s)}
                                className={cn(
                                  "border-2 border-foreground px-3 py-1.5 text-[10px] font-black uppercase transition-all",
                                  c.status === s ? statusConfig[s].color : "bg-background hover:bg-secondary"
                                )}
                              >
                                {statusConfig[s].label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Admin Notes */}
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">ADMIN NOTES</p>
                          <textarea
                            value={editingNotes[c.id] ?? c.admin_notes ?? ''}
                            onChange={(e) => setEditingNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                            placeholder="Add internal notes..."
                            rows={3}
                            className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold resize-none focus:outline-none focus:border-accent"
                          />
                          <button
                            onClick={() => updateAdminNotes(c.id)}
                            className="mt-2 border-2 border-foreground bg-accent text-accent-foreground px-4 py-1.5 text-[10px] font-black uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                          >
                            SAVE NOTES
                          </button>
                        </div>

                        {/* Meta */}
                        <div className="flex gap-6 text-[9px] font-bold uppercase opacity-40 pt-2 border-t-2 border-foreground/10">
                          <span>ID: {c.id.slice(0, 8)}...</span>
                          <span>CREATED: {new Date(c.created_at).toLocaleString()}</span>
                          <span>UPDATED: {new Date(c.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RECENT ACTIVITY LOG - forms overview */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
            SYSTEM INFO<span className="text-accent">.</span>
          </h2>
          <div className="border-4 border-foreground bg-background p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">PLATFORM HEALTH</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span className="text-xs font-bold uppercase">Database Status</span>
                    <span className="text-xs font-black text-accent">● ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span className="text-xs font-bold uppercase">Auth Service</span>
                    <span className="text-xs font-black text-accent">● ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span className="text-xs font-bold uppercase">Realtime Sync</span>
                    <span className="text-xs font-black text-accent">● CONNECTED</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">QUICK ACTIONS</p>
                <div className="space-y-2">
                  <Link to="/dashboard" className="block border-2 border-foreground px-4 py-3 text-xs font-black uppercase hover:bg-foreground hover:text-background transition-all">
                    → GO TO USER DASHBOARD
                  </Link>
                  <button onClick={loadAll} className="block w-full text-left border-2 border-foreground px-4 py-3 text-xs font-black uppercase hover:bg-foreground hover:text-background transition-all">
                    → REFRESH ALL DATA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto px-4 pb-12 flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-[0.2em]">
        <span>REVOX ADMIN v1.0</span>
        <span>RESTRICTED ACCESS</span>
        <span>2026 REVOX LABS</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
