import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Link } from 'react-router-dom';
import {
  FileText, MessageSquare, AlertTriangle, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

/* ---------------- TYPES ---------------- */

interface Complaint {
  id: string;
  user_email?: string;
  type: 'bug' | 'feedback' | 'complaint' | 'feature_request';
  subject: string;
  message?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  admin_notes?: string;
}

/* ---------------- HEX GRAPH WRAPPER ---------------- */

const HexGraphCard = ({ title, children }: any) => (
  <div className="hex-card p-6 relative overflow-hidden">
    <div className="absolute inset-0 hex-grid-fine opacity-[0.05]" />
    <div className="flex justify-between mb-4">
      <span className="hex-mono text-[10px] opacity-50 uppercase">{title}</span>
      <span className="text-[10px] text-accent animate-pulse">● LIVE</span>
    </div>
    {children}
  </div>
);

/* ---------------- MICRO SPARKLINE ---------------- */

const Spark = ({ data }: any) => (
  <div className="absolute right-2 top-2 w-20 h-10 opacity-40">
    <ResponsiveContainer>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke="currentColor" strokeWidth={1} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/* ---------------- MAIN DASHBOARD ---------------- */

export default function AdminDashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<any>({
    totalForms: 0,
    totalResponses: 0,
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });

  const [activityData, setActivityData] = useState<any[]>([]);
  const [liveSignal, setLiveSignal] = useState<any[]>([]);

  // ✅ added missing states (used later)
  const [statusFilter] = useState<string>('all');
  const [typeFilter] = useState<string>('all');
  const [editingNotes] = useState<Record<string, string>>({});

  /* ---------------- DATA LOAD ---------------- */

  useEffect(() => {
    loadAll();
    generateActivity();

    const interval = setInterval(generateLiveSignal, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = apiClient
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forms' }, () => loadStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'responses' }, () => loadStats())
      .subscribe();

    return () => { apiClient.removeChannel(channel); };
  }, [user]);

  // ✅ added missing function
  const loadAll = async () => {
    await Promise.all([loadStats(), loadComplaints()]);
  };

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const [formsRes, responsesRes, complaintsRes, formsTodayRes, responsesTodayRes] = await Promise.all([
        apiClient.from('forms').select('*', { count: 'exact', head: true }),
        apiClient.from('responses').select('*', { count: 'exact', head: true }),
        apiClient.from('complaints').select('*', { count: 'exact', head: true }),
        apiClient.from('forms').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        apiClient.from('responses').select('*', { count: 'exact', head: true }).gte('submitted_at', todayISO),
      ]);

      const { count: openCount } = await apiClient
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      const { count: resolvedCount } = await apiClient
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved');

      setStats({
        totalForms: formsRes.count || 0,
        totalResponses: responsesRes.count || 0,
        totalComplaints: complaintsRes.count || 0,
        openComplaints: openCount || 0,
        resolvedComplaints: resolvedCount || 0,
        formsToday: formsTodayRes.count || 0,
        responsesToday: responsesTodayRes.count || 0,
      });
    } catch (err) {
      console.error('Stats load error:', err);
    }
  };

  const loadComplaints = async () => {
    try {
      const { data, error } = await apiClient
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (err) {
      console.error('Complaints load error:', err);
    }
  };

  /* ---------------- MOCK GRAPH DATA ---------------- */

  const generateActivity = () => {
    const arr = Array.from({ length: 7 }).map((_, i) => ({
      day: `D${i}`,
      responses: Math.floor(Math.random() * 100),
      complaints: Math.floor(Math.random() * 40),
    }));
    setActivityData(arr);
  };

  const generateLiveSignal = () => {
    setLiveSignal(prev => [
      ...prev.slice(-20),
      { v: Math.random() * 100 }
    ]);
  };

  /* ---------------- DERIVED ---------------- */

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }, [complaints, statusFilter, typeFilter]);

  const complaintsByType = useMemo(() => {
    const c = { bug: 0, feedback: 0, complaint: 0, feature_request: 0 };
    complaints.forEach(x => c[x.type]++);
    return Object.entries(c).map(([k, v]) => ({ type: k.toUpperCase(), value: v }));
  }, [complaints]);

  /* ---------------- UI ---------------- */

  return (
    <div className="hex-theme min-h-screen relative">

      <div className="absolute inset-0 hex-grid opacity-40" />

      <nav className="border-b hex-line-soft bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="text-2xl">AQORA<span className="text-accent">.</span></Link>
          <div className="hex-mono text-[11px]">ADMIN PANEL</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'FORMS', value: stats.totalForms },
            { label: 'RESPONSES', value: stats.totalResponses },
            { label: 'OPEN', value: stats.openComplaints },
            { label: 'RESOLUTION', value: `${Math.round((stats.resolvedComplaints / (stats.totalComplaints || 1)) * 100)}%` },
          ].map((s, i) => (
            <div key={i} className="hex-card p-6 relative">
              <Spark data={liveSignal}/>
              <p className="hex-mono text-[10px] opacity-50">{s.label}</p>
              <p className="text-3xl">{s.value}</p>
            </div>
          ))}
        </div>

        {/* GRAPH */}
        <HexGraphCard title="SYSTEM ACTIVITY">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="responses" stroke="#000" />
              <Line dataKey="complaints" stroke="#888" />
            </LineChart>
          </ResponsiveContainer>
        </HexGraphCard>

        {/* COMPLAINT STREAM */}
        <div className="border hex-line-soft mt-10">
          <div className="px-6 py-3 text-xs hex-mono opacity-50">SYSTEM LOG</div>
          {filteredComplaints.map(c => (
            <div key={c.id} className="px-6 py-3 border-t text-sm">
              {c.subject}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}