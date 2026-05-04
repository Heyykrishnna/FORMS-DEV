// import { useState, useEffect, useMemo } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { Link } from 'react-router-dom';
// import {
//   Users, FileText, MessageSquare, Activity, BarChart3,
//   CheckCircle2, Clock, AlertTriangle, XCircle, Filter,
//   RefreshCw, Eye, ChevronDown, ChevronUp, Shield, Bug,
//   MessageCircle, Lightbulb, TrendingUp, Layers, Zap
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// interface Complaint {
//   id: string;
//   user_id: string | null;
//   user_email: string;
//   type: 'bug' | 'feedback' | 'complaint' | 'feature_request';
//   subject: string;
//   message: string;
//   status: 'open' | 'in_progress' | 'resolved' | 'closed';
//   priority: 'low' | 'medium' | 'high' | 'critical';
//   admin_notes: string | null;
//   created_at: string;
//   updated_at: string;
// }

// interface PlatformStats {
//   totalUsers: number;
//   totalForms: number;
//   totalResponses: number;
//   totalComplaints: number;
//   openComplaints: number;
//   resolvedComplaints: number;
//   activeForms: number;
//   formsToday: number;
//   responsesToday: number;
// }

// const statusConfig = {
//   open: { label: 'OPEN', icon: <Clock size={12} />, color: 'bg-accent text-accent-foreground' },
//   in_progress: { label: 'IN PROGRESS', icon: <Activity size={12} />, color: 'bg-foreground text-background' },
//   resolved: { label: 'RESOLVED', icon: <CheckCircle2 size={12} />, color: 'bg-green-500 text-secondary-foreground border-2 border-foreground' },
//   closed: { label: 'CLOSED', icon: <XCircle size={12} />, color: 'bg-black text-white border-2 border-foreground' },
// };

// const typeIcons = {
//   bug: <Bug size={14} />,
//   feedback: <MessageCircle size={14} />,
//   complaint: <AlertTriangle size={14} />,
//   feature_request: <Lightbulb size={14} />,
// };

// const priorityColors = {
//   low: 'opacity-50',
//   medium: '',
//   high: 'text-accent font-black',
//   critical: 'text-destructive font-black animate-pulse',
// };

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [stats, setStats] = useState<PlatformStats>({
//     totalUsers: 0, totalForms: 0, totalResponses: 0, totalComplaints: 0,
//     openComplaints: 0, resolvedComplaints: 0, activeForms: 0, formsToday: 0, responsesToday: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<string>('all');
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

//   useEffect(() => {
//     loadAll();
//   }, [user]);

//   useEffect(() => {
//     if (!user) return;
//     const channel = supabase
//       .channel('admin-realtime')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => loadAll())
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'forms' }, () => loadStats())
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'responses' }, () => loadStats())
//       .subscribe();
//     return () => { supabase.removeChannel(channel); };
//   }, [user]);

//   const loadAll = async () => {
//     await Promise.all([loadStats(), loadComplaints()]);
//     setLoading(false);
//   };

//   const loadStats = async () => {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const todayISO = today.toISOString();

//       const [formsRes, responsesRes, complaintsRes, formsTodayRes, responsesTodayRes] = await Promise.all([
//         supabase.from('forms').select('*', { count: 'exact', head: true }),
//         supabase.from('responses').select('*', { count: 'exact', head: true }),
//         supabase.from('complaints').select('*', { count: 'exact', head: true }),
//         supabase.from('forms').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
//         supabase.from('responses').select('*', { count: 'exact', head: true }).gte('submitted_at', todayISO),
//       ]);

//       const { count: openCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'open');
//       const { count: resolvedCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

//       setStats({
//         totalUsers: 0, // Can't count auth.users from client side
//         totalForms: formsRes.count || 0,
//         totalResponses: responsesRes.count || 0,
//         totalComplaints: complaintsRes.count || 0,
//         openComplaints: openCount || 0,
//         resolvedComplaints: resolvedCount || 0,
//         activeForms: 0,
//         formsToday: formsTodayRes.count || 0,
//         responsesToday: responsesTodayRes.count || 0,
//       });
//     } catch (err) {
//       console.error('Stats load error:', err);
//     }
//   };

//   const loadComplaints = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('complaints')
//         .select('*')
//         .order('created_at', { ascending: false });
//       if (error) throw error;
//       setComplaints(data || []);
//     } catch (err) {
//       console.error('Complaints load error:', err);
//     }
//   };

//   const updateComplaintStatus = async (id: string, newStatus: Complaint['status']) => {
//     try {
//       const { error } = await supabase
//         .from('complaints')
//         .update({ status: newStatus, updated_at: new Date().toISOString() })
//         .eq('id', id);
//       if (error) throw error;
//       setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
//       toast.success(`Status updated to ${newStatus.toUpperCase()}`);
//     } catch (err) {
//       toast.error('Failed to update status');
//     }
//   };

//   const updateAdminNotes = async (id: string) => {
//     const notes = editingNotes[id];
//     if (notes === undefined) return;
//     try {
//       const { error } = await supabase
//         .from('complaints')
//         .update({ admin_notes: notes, updated_at: new Date().toISOString() })
//         .eq('id', id);
//       if (error) throw error;
//       setComplaints(prev => prev.map(c => c.id === id ? { ...c, admin_notes: notes } : c));
//       toast.success('Notes saved');
//     } catch (err) {
//       toast.error('Failed to save notes');
//     }
//   };

//   const filteredComplaints = useMemo(() => {
//     return complaints.filter(c => {
//       if (statusFilter !== 'all' && c.status !== statusFilter) return false;
//       if (typeFilter !== 'all' && c.type !== typeFilter) return false;
//       return true;
//     });
//   }, [complaints, statusFilter, typeFilter]);

//   const complaintsByType = useMemo(() => {
//     const counts = { bug: 0, feedback: 0, complaint: 0, feature_request: 0 };
//     complaints.forEach(c => { counts[c.type]++; });
//     return counts;
//   }, [complaints]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-xl font-black uppercase animate-pulse">LOADING ADMIN TERMINAL...</p>
//       </div>
//     );
//   }

// return (
//   <div className="hex-theme hex-paper min-h-screen relative">

//     {/* GLOBAL HEX BACKGROUND */}
//     <div className="absolute inset-0 hex-grid opacity-40 pointer-events-none" />
//     <div className="absolute inset-0 hex-grid-fine opacity-20 pointer-events-none" />

//     {/* SIDE SCALES (like landing page) */}
//     <div className="pointer-events-none absolute inset-y-0 left-0">
//       <div className="w-10 h-full border-r hex-line-soft bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]" />
//     </div>
//     <div className="pointer-events-none absolute inset-y-0 right-0">
//       <div className="w-10 h-full border-l hex-line-soft bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]" />
//     </div>

//     {/* NAV */}
//     <nav className="border-b hex-line-soft bg-white/80 backdrop-blur-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-semibold tracking-tight">
//           AQORA<span className="text-accent">.</span>
//         </Link>

//         <div className="flex items-center gap-4">
//           <div className="px-3 py-1 border hex-line-soft text-[11px] hex-mono uppercase">
//             ADMIN PANEL
//           </div>

//           <Link
//             to="/dashboard"
//             className="hex-btn-ghost text-[12px]"
//           >
//             ← USER DASHBOARD
//           </Link>
//         </div>
//       </div>
//     </nav>

//     <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">

//       {/* HEADER */}
//       <div className="mb-16">
//         <div className="flex items-center gap-3 mb-4">
//           <span className="hex-mono text-[11px] opacity-50">CONTROL PANEL</span>
//         </div>

//         <h1 className="text-[64px] font-semibold tracking-[-0.04em] leading-none">
//           Admin <br />
//           <span className="italic">Control.</span>
//         </h1>
//       </div>

//       {/* STATS */}
//       <div className="grid md:grid-cols-4 gap-6 mb-16">
//         {[
//           { label: 'TOTAL FORMS', value: stats.totalForms, icon: FileText },
//           { label: 'RESPONSES', value: stats.totalResponses, icon: MessageSquare },
//           { label: 'OPEN TICKETS', value: stats.openComplaints, icon: AlertTriangle },
//           { label: 'RESOLUTION RATE', value: stats.totalComplaints > 0 ? `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%` : '—', icon: BarChart3 },
//         ].map((s, i) => (
//           <div
//             key={i}
//             className="hex-card p-6 relative overflow-hidden"
//           >
//             <div className="absolute inset-0 opacity-[0.05] hex-grid-fine pointer-events-none" />

//             <p className="hex-mono text-[10px] uppercase opacity-50 mb-2">
//               {s.label}
//             </p>

//             <p className="text-3xl font-semibold tracking-tight">
//               {s.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* COMPLAINTS PANEL */}
//       <div className="border hex-line-soft bg-white/70 backdrop-blur-sm">

//         <div className="px-6 py-4 border-b hex-line-soft flex justify-between items-center">
//           <span className="hex-mono text-[11px] uppercase opacity-50">
//             Complaints Stream
//           </span>
//         </div>

//         <div className="divide-y hex-line-soft">
//           {filteredComplaints.map((c) => {
//             const isExpanded = expandedId === c.id;
//             const stCfg = statusConfig[c.status];

//             return (
//               <div key={c.id}>

//                 <div
//                   className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-black/[0.03] transition"
//                   onClick={() => setExpandedId(isExpanded ? null : c.id)}
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm font-medium truncate">
//                       {c.subject}
//                     </p>
//                     <p className="text-[11px] opacity-40">
//                       {c.user_email}
//                     </p>
//                   </div>

//                   <span className="text-[10px] px-3 py-1 border hex-line-soft uppercase">
//                     {stCfg.label}
//                   </span>
//                 </div>

//                 {isExpanded && (
//                   <div className="px-6 pb-6">
//                     <div className="border-l-2 border-accent pl-4 text-sm opacity-80">
//                       {c.message}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* SYSTEM STATUS */}
//       <div className="mt-16 grid md:grid-cols-3 gap-6">
//         {['Database', 'Auth', 'Realtime'].map((s, i) => (
//           <div key={i} className="hex-card p-6">
//             <p className="hex-mono text-[10px] uppercase opacity-50 mb-2">
//               {s}
//             </p>
//             <p className="text-sm font-medium text-accent">
//               ● ONLINE
//             </p>
//           </div>
//         ))}
//       </div>

//     </main>
//   </div>
// );
// };

// export default AdminDashboard;


// import { useState, useEffect, useMemo } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { Link } from 'react-router-dom';
// import {
//   FileText, MessageSquare, AlertTriangle, BarChart3
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// import {
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, BarChart, Bar
// } from 'recharts';

// /* ================= TYPES ================= */

// interface Complaint {
//   id: string;
//   user_email: string;
//   type: 'bug' | 'feedback' | 'complaint' | 'feature_request';
//   subject: string;
//   message: string;
//   status: 'open' | 'in_progress' | 'resolved' | 'closed';
//   created_at: string;
// }

// /* ================= UI WRAPPER ================= */

// const HexCard = ({ title, children }: any) => (
//   <div className="hex-card p-6 relative overflow-hidden">
//     <div className="absolute inset-0 hex-grid-fine opacity-[0.05]" />

//     <div className="flex justify-between mb-4">
//       <span className="hex-mono text-[10px] uppercase opacity-50">
//         {title}
//       </span>
//       <span className="text-[10px] text-accent">● LIVE</span>
//     </div>

//     {children}
//   </div>
// );

// /* ================= CHARTS ================= */

// const HexLineChart = ({ data }: any) => (
//   <ResponsiveContainer width="100%" height={260}>
//     <LineChart data={data}>
//       <XAxis dataKey="date" tick={{ fontSize: 10 }} />
//       <YAxis tick={{ fontSize: 10 }} />
//       <Tooltip contentStyle={{ border: '1px solid black', fontSize: 10 }} />
//       <Line dataKey="value" stroke="black" strokeWidth={2} dot={{ r: 2 }} />
//     </LineChart>
//   </ResponsiveContainer>
// );

// const HexBarChart = ({ data }: any) => (
//   <ResponsiveContainer width="100%" height={240}>
//     <BarChart data={data}>
//       <XAxis dataKey="type" tick={{ fontSize: 10 }} />
//       <Tooltip />
//       <Bar dataKey="value" fill="black" radius={0} />
//     </BarChart>
//   </ResponsiveContainer>
// );

// const HexFunnelGraph = ({ data }: any) => {
//   const max = Math.max(...data.map((d: any) => d.value));

//   return (
//     <div className="space-y-3">
//       {data.map((d: any, i: number) => (
//         <div key={i}>
//           <div className="flex justify-between text-[10px] hex-mono mb-1">
//             <span>{d.label}</span>
//             <span>{d.value}</span>
//           </div>
//           <div className="h-6 border hex-line-soft">
//             <div
//               className="h-full bg-black"
//               style={{ width: `${(d.value / max) * 100}%` }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const HexSignalGraph = () => {
//   const [points, setPoints] = useState<number[]>(Array(30).fill(5));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPoints(p => [...p.slice(1), Math.random() * 10]);
//     }, 800);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <svg width="100%" height="80">
//       <polyline
//         fill="none"
//         stroke="black"
//         strokeWidth="2"
//         points={points.map((p, i) => `${i * 10},${80 - p * 6}`).join(' ')}
//       />
//     </svg>
//   );
// };

// const HexComparisonChart = () => {
//   const data = [
//     { day: 'Mon', forms: 4, responses: 20 },
//     { day: 'Tue', forms: 6, responses: 30 },
//     { day: 'Wed', forms: 3, responses: 15 },
//   ];

//   return (
//     <ResponsiveContainer width="100%" height={240}>
//       <LineChart data={data}>
//         <XAxis dataKey="day" />
//         <YAxis />
//         <Line dataKey="forms" stroke="black" strokeDasharray="4 4" />
//         <Line dataKey="responses" stroke="#444" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// /* ================= MAIN ================= */

// const AdminDashboard = () => {
//   const { user } = useAuth();

//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [stats, setStats] = useState({
//     totalForms: 0,
//     totalResponses: 0,
//     totalComplaints: 0,
//     openComplaints: 0,
//     resolvedComplaints: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadAll();
//   }, [user]);

//   const loadAll = async () => {
//     await Promise.all([loadStats(), loadComplaints()]);
//     setLoading(false);
//   };

//   const loadStats = async () => {
//     const [forms, responses, complaints] = await Promise.all([
//       supabase.from('forms').select('*', { count: 'exact', head: true }),
//       supabase.from('responses').select('*', { count: 'exact', head: true }),
//       supabase.from('complaints').select('*', { count: 'exact', head: true }),
//     ]);

//     const { count: open } = await supabase
//       .from('complaints')
//       .select('*', { count: 'exact', head: true })
//       .eq('status', 'open');

//     const { count: resolved } = await supabase
//       .from('complaints')
//       .select('*', { count: 'exact', head: true })
//       .eq('status', 'resolved');

//     setStats({
//       totalForms: forms.count || 0,
//       totalResponses: responses.count || 0,
//       totalComplaints: complaints.count || 0,
//       openComplaints: open || 0,
//       resolvedComplaints: resolved || 0,
//     });
//   };

//   const loadComplaints = async () => {
//     const { data } = await supabase
//       .from('complaints')
//       .select('*')
//       .order('created_at', { ascending: false });

//     setComplaints(data || []);
//   };

//   /* ================= DERIVED ================= */

//   const complaintsByType = useMemo(() => {
//     const map = { bug: 0, feedback: 0, complaint: 0, feature_request: 0 };
//     complaints.forEach(c => map[c.type]++);
//     return map;
//   }, [complaints]);

//   const responseSeries = useMemo(() => {
//     const map: any = {};

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - (6 - i));
//       return d.toISOString().slice(0, 10);
//     });

//     days.forEach(d => (map[d] = 0));

//     complaints.forEach(c => {
//       const d = c.created_at.slice(0, 10);
//       if (map[d] !== undefined) map[d]++;
//     });

//     return days.map(d => ({
//       date: d.slice(5),
//       value: map[d],
//     }));
//   }, [complaints]);

//   const complaintTypeData = Object.entries(complaintsByType).map(
//     ([k, v]) => ({ type: k.toUpperCase(), value: v })
//   );

//   const funnelData = [
//     { label: 'OPEN', value: stats.openComplaints },
//     { label: 'IN_PROGRESS', value: complaints.filter(c => c.status === 'in_progress').length },
//     { label: 'RESOLVED', value: stats.resolvedComplaints },
//     { label: 'CLOSED', value: complaints.filter(c => c.status === 'closed').length },
//   ];

//   if (loading) {
//     return <div className="p-10">LOADING...</div>;
//   }

//   return (
//     <div className="hex-theme hex-paper min-h-screen relative">

//       <div className="absolute inset-0 hex-grid opacity-40 pointer-events-none" />

//       <nav className="border-b hex-line-soft px-6 py-4 flex justify-between">
//         <Link to="/">AQORA.</Link>
//         <Link to="/dashboard">← USER</Link>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-16 space-y-10">

//         {/* STATS */}
//         <div className="grid md:grid-cols-4 gap-6">
//           {[
//             { label: 'FORMS', value: stats.totalForms },
//             { label: 'RESPONSES', value: stats.totalResponses },
//             { label: 'OPEN', value: stats.openComplaints },
//             { label: 'RESOLUTION', value: `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) || 0}%` },
//           ].map((s, i) => (
//             <div key={i} className="hex-card p-6">
//               <p className="hex-mono text-[10px] opacity-50">{s.label}</p>
//               <p className="text-3xl">{s.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* 📈 LINE */}
//         <HexCard title="RESPONSE ACTIVITY">
//           <HexLineChart data={responseSeries} />
//         </HexCard>

//         {/* 📊 */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <HexCard title="COMPLAINT TYPES">
//             <HexBarChart data={complaintTypeData} />
//           </HexCard>

//           <HexCard title="RESOLUTION PIPELINE">
//             <HexFunnelGraph data={funnelData} />
//           </HexCard>
//         </div>

//         {/* ⚡ */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <HexCard title="LIVE SIGNAL">
//             <HexSignalGraph />
//           </HexCard>

//           <HexCard title="FORMS vs RESPONSES">
//             <HexComparisonChart />
//           </HexCard>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;



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

  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalForms: 0,
    totalResponses: 0,
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });

  const [activityData, setActivityData] = useState<any[]>([]);
  const [liveSignal, setLiveSignal] = useState<any[]>([]);

  /* ---------------- DATA LOAD ---------------- */

  useEffect(() => {
    load();
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

    setComplaints(complaintsData || []);

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

      const { count: openCount } = await apiClient.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: resolvedCount } = await apiClient.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

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

  const updateComplaintStatus = async (id: string, newStatus: Complaint['status']) => {
    try {
      const { error } = await apiClient
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
      const { error } = await apiClient
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

    generateActivity();
    generateLiveSignal();
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

  const complaintsByType = useMemo(() => {
    const c = { bug: 0, feedback: 0, complaint: 0, feature_request: 0 };
    complaints.forEach(x => c[x.type]++);
    return Object.entries(c).map(([k, v]) => ({ type: k.toUpperCase(), value: v }));
  }, [complaints]);

  /* ---------------- UI ---------------- */

  return (
    <div className="hex-theme min-h-screen relative">

      <div className="absolute inset-0 hex-grid opacity-40" />

      {/* NAV */}
      <nav className="border-b hex-line-soft bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="text-2xl">AQORA<span className="text-accent">.</span></Link>
          <div className="hex-mono text-[11px]">ADMIN PANEL</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="hex-mono text-[11px] opacity-50">CONTROL PANEL</span>
            <span className="text-[11px] text-accent animate-pulse">● SYSTEM ACTIVE</span>
          </div>

          <h1 className="text-[64px] leading-none">
            Admin <br />
            <span className="italic">Control.</span>
          </h1>
        </div>

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

        {/* HERO GRAPH */}
        <div className="mb-16">
          <HexGraphCard title="SYSTEM ACTIVITY">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="responses" stroke="#000" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="complaints" stroke="#888" strokeWidth={1} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </HexGraphCard>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          <HexGraphCard title="COMPLAINT DISTRIBUTION">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complaintsByType}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#000" />
              </BarChart>
            </ResponsiveContainer>
          </HexGraphCard>

          <HexGraphCard title="RESOLUTION PIPELINE">
            <div className="space-y-2">
              {['OPEN','IN_PROGRESS','RESOLVED','CLOSED'].map((s,i)=>(
                <div key={i} className="border px-3 py-2 text-xs">{s}</div>
              ))}
            </div>
          </HexGraphCard>

          <HexGraphCard title="FORMS vs RESPONSES">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip/>
                <Area dataKey="responses" stroke="#000" fillOpacity={0.1}/>
              </AreaChart>
            </ResponsiveContainer>
          </HexGraphCard>

          <HexGraphCard title="LIVE SIGNAL">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={liveSignal}>
                <Line dataKey="v" stroke="#000" dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </HexGraphCard>

        </div>

        {/* COMPLAINT STREAM */}
        <div className="border hex-line-soft">
          <div className="px-6 py-3 text-xs hex-mono opacity-50">SYSTEM LOG</div>
          {complaints.map(c => (
            <div key={c.id} className="px-6 py-3 border-t text-sm">
              {c.subject}
            </div>
          ))}
        </div>

        {/* SYSTEM STATUS */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {['Database','Auth','Realtime'].map((s,i)=>(
            <div key={i} className="hex-card p-6">
              <p className="hex-mono text-[10px] opacity-50">{s}</p>
              <p className="text-accent animate-pulse">● ONLINE</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}