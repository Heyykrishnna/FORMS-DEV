
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Ghost, Bot, Skull, Pizza, Zap, Crown, User, ArrowLeft, BarChart3, FileText, Calendar, Edit2, LogOut, Clock, X, AlertTriangle, Box, Link as LinkIcon, CheckCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AgentAvatar from '@/components/ui/smoothui/agent-avatar';
import { ChartBarIcon, ChartBarIconHandle } from '@/components/ChartBarIcon';
import { RocketIcon, RocketHandle } from '@/components/RocketIcon';
import React from 'react';

const AVATARS = {
  'user': <AgentAvatar seed="user" size={48} />,
  'ghost': <AgentAvatar seed="ghost" size={48} />,
  'bot': <AgentAvatar seed="bot" size={48} />,
  'skull': <AgentAvatar seed="skull" size={48} />,
  'pizza': <AgentAvatar seed="pizza" size={48} />,
  'zap': <AgentAvatar seed="zap" size={48} />,
  'crown': <AgentAvatar seed="crown" size={48} />,
};

interface Activity {
  action: string;
  target: string;
  timestamp: string;
}

interface ProfileData {
  username: string;
  avatar_url: string;
  email: string;
  created_at: string;
  recent_activity?: Activity[];
}

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        formsCount: 0,
        totalResponses: 0,
    });
    
    const rocketRef = useRef<RocketHandle>(null);
    const chartRef = useRef<ChartBarIconHandle>(null);

    const loadProfile = React.useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();
            
            if (error) throw error;
            
            // Fetch recent activity (forms created/updated)
            const { data: recentForms, error: activityError } = await supabase
                .from('forms')
                .select('id, title, updated_at, created_at')
                .eq('user_id', user?.id)
                .order('updated_at', { ascending: false })
                .limit(5);

            if (activityError) console.error('Error loading activity:', activityError);
            
            const activity: Activity[] = recentForms?.map(form => ({
                action: form.created_at === form.updated_at ? 'DEPLOYED FORM' : 'UPDATED PROTOCOL',
                target: form.title,
                timestamp: form.updated_at
            })) || [];

            setProfile({ ...data, recent_activity: activity });
        } catch (error) {
            console.error('Error loading profile:', error);
            // toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const loadStats = React.useCallback(async () => {
        try {
            // Count forms
            const { count: formsCount, error: formsError } = await supabase
                .from('forms')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user?.id);
            
            if (formsError) throw formsError;

            // This is a simplified count. For total responses across all forms, we'd need a join or separate query.
            // For now, let's just get forms. Ideally we would count responses.
            // Let's try to get all forms IDs then count responses
            const { data: forms } = await supabase.from('forms').select('id').eq('user_id', user?.id);
            let totalResponses = 0;
            
            if (forms && forms.length > 0) {
                const { count } = await supabase
                    .from('responses')
                    .select('*', { count: 'exact', head: true })
                    .in('form_id', forms.map(f => f.id));
                totalResponses = count || 0;
            }

            setStats({
                formsCount: formsCount || 0,
                totalResponses,
            });

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            loadProfile();
            loadStats();
        }
    }, [user, loadProfile, loadStats]);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', avatar_url: '' });
    const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');

    useEffect(() => {
        if (profile) {
            setEditForm({ 
                username: profile.username || '', 
                avatar_url: profile.avatar_url || '' 
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    username: editForm.username,
                    avatar_url: editForm.avatar_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user?.id);

            if (error) throw error;
            
            setProfile(prev => prev ? { ...prev, ...editForm } : null);
            setIsEditing(false);
            toast.success("IDENTITY REWRITTEN.");
        } catch (error) {
            toast.error("UPDATE FAILED.");
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono font-bold uppercase animate-pulse">LOADING IDENTITY...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-mono p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO DASHBOARD
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500 rounded-full">
                            <span className="text-[10px] font-bold uppercase text-orange-500 tracking-widest">SYSTEM ONLINE</span>
                        </div>
                        <Button variant="outline" className="border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            DISCONNECT
                        </Button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-black text-white flex items-center justify-center border-4 border-black shrink-0 relative group overflow-hidden rounded-full">
                            <div className="w-full h-full flex items-center justify-center">
                                {profile?.avatar_url && AVATARS[profile.avatar_url as keyof typeof AVATARS] ? (
                                    <div className="scale-150">
                                        {AVATARS[profile.avatar_url as keyof typeof AVATARS]}
                                    </div>
                                ) : profile?.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt={profile.username} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + profile.username;
                                        }}
                                    />
                                ) : (
                                    <AgentAvatar seed={profile?.username || user?.email || 'revox'} size={128} />
                                )}
                            </div>
                            <div 
                                className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">
                                    {profile?.username || 'UNKNOWN AGENT'}
                                </h1>
                                <p className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-[#FF4500]" />
                                    LEVEL 1 OPERATIVE
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-4 border-black/10">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground block">EMAIL ADDR</label>
                                    <p className="font-bold">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground block">JOINED</label>
                                    <p className="font-bold flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(user?.created_at || '').toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        className="bg-[#FF4500] text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer"
                        onMouseEnter={() => rocketRef.current?.startAnimation()}
                        onMouseLeave={() => rocketRef.current?.stopAnimation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <RocketIcon ref={rocketRef} className="w-8 h-8" />
                            <span className="text-6xl font-black opacity-50">01</span>
                        </div>
                        <h3 className="text-4xl font-black mb-1">{stats.formsCount}</h3>
                        <p className="font-bold uppercase tracking-widest text-sm">FORMS DEPLOYED</p>
                    </div>

                    <div 
                        className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer"
                        onMouseEnter={() => chartRef.current?.startAnimation()}
                        onMouseLeave={() => chartRef.current?.stopAnimation()}
                    >
                         <div className="flex items-center justify-between mb-4">
                            <ChartBarIcon ref={chartRef} className="w-8 h-8 text-[#FF4500]" />
                            <span className="text-6xl font-black opacity-20">02</span>
                        </div>
                        <h3 className="text-4xl font-black mb-1">{stats.totalResponses}</h3>
                        <p className="font-bold uppercase tracking-widest text-sm text-[#FF4500]">TOTAL HITS</p>
                    </div>
                </div>
                {/* Badges Section */}
                <div className="bg-black text-white p-6 border-4 border-black relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-[#FF4500]" />
                            MEDALS & HONORS
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: 'first_blood', icon: <Ghost />, label: 'FIRST BLOOD', desc: 'Deployed 1st Form', unlocked: stats.formsCount > 0 },
                                { id: 'influencer', icon: <Crown />, label: 'INFLUENCER', desc: '100+ Responses', unlocked: stats.totalResponses >= 100 },
                                { id: 'architect', icon: <Bot />, label: 'ARCHITECT', desc: 'Created 5+ Forms', unlocked: stats.formsCount >= 5 },
                                { id: 'void_dweller', icon: <Skull />, label: 'VOID DWELLER', desc: 'Member > 1 Month', unlocked: new Date(user?.created_at || '').getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000 }
                            ].map((badge) => (
                                <div key={badge.id} className={`border-2 p-4 flex flex-col items-center text-center transition-all ${badge.unlocked ? 'border-white bg-white/10' : 'border-white/20 opacity-30 grayscale'}`}>
                                    <div className={`mb-2 ${badge.unlocked ? 'text-[#FF4500] animate-pulse' : 'text-white'}`}>
                                        {badge.icon}
                                    </div>
                                    <h3 className="text-xs font-black uppercase mb-1">{badge.label}</h3>
                                    <p className="text-[9px] font-mono uppercase opacity-70">{badge.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Operations Log */}
                <div className="bg-white border-4 border-black p-6 relative">
                    <div className="absolute -top-3 -left-3 bg-[#FF4500] text-white px-3 py-1 text-xs font-black uppercase transform -rotate-2 border-2 border-black">
                        CLASSIFIED
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        OPERATIONS LOG
                    </h2>
                    <div className="space-y-4 font-mono text-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {profile?.recent_activity && profile.recent_activity.length > 0 ? (
                             profile.recent_activity.map((activity: Activity, index: number) => (
                                <div key={index} className="flex items-start gap-4 border-b-2 border-dashed border-black/10 pb-4 last:border-0 last:pb-0 group hover:bg-black/5 p-2 transition-colors">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 border-2 border-black group-hover:bg-[#FF4500] group-hover:border-[#FF4500] transition-colors">
                                        <span className="font-bold text-xs">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold uppercase text-xs mb-1">
                                            {activity.action} <span className="text-[#FF4500]">"{activity.target}"</span>
                                        </p>
                                        <p className="text-[10px] opacity-50 uppercase flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                             ))
                        ) : (
                            <div className="text-center py-8 opacity-50 font-bold uppercase text-xs">
                                <p>NO RECENT ACTIVITY DETECTED.</p>
                                <p className="text-[10px] mt-1">THE SYSTEM IS WAITING...</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Danger Zone */}
                <div className="border-4 border-red-500 p-6 bg-red-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-[10px] font-black uppercase">
                        DANGER ZONE
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        CRITICAL ACTIONS
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold uppercase text-sm">TERMINATE PROTOCOL</h3>
                            <p className="text-xs opacity-60 font-mono">Permanently delete your account and all data.</p>
                        </div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 font-bold uppercase" onClick={() => toast.error("ACCESS DENIED. YOU'RE STUCK WITH US.")}>
                            DELETE ACCOUNT
                        </Button>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="absolute top-4 right-4 hover:bg-black hover:text-white p-1 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">EDIT IDENTITY</h2>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest block">CODENAME</label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="w-full bg-[#F5F5F5] border-2 border-black p-3 font-bold outline-none focus:border-[#FF4500]"
                                    />
                                </div>

                                {/* AVATAR SELECTION */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest block mb-4">SELECT AVATAR</label>
                                    
                                    {/* Avatar Preview */}
                                    <div className="flex items-center gap-4 p-4 border-4 border-black bg-accent/5 rounded-2xl">
                                        <div className="w-16 h-16 border-4 border-black bg-background flex items-center justify-center shrink-0 text-foreground overflow-hidden rounded-full shadow-brutal">
                                            {editForm.avatar_url && AVATARS[editForm.avatar_url as keyof typeof AVATARS] ? (
                                                <div className="w-8 h-8">{AVATARS[editForm.avatar_url as keyof typeof AVATARS]}</div>
                                            ) : editForm.avatar_url ? (
                                                <img src={editForm.avatar_url} className="w-full h-full object-cover" alt="Custom avatar" />
                                            ) : (
                                                <AgentAvatar seed={editForm.username || user?.email || 'revox'} size={64} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase mb-1">Current Avatar</p>
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">
                                                {editForm.avatar_url && AVATARS[editForm.avatar_url as keyof typeof AVATARS] ? 'PRESET ICON' : editForm.avatar_url ? 'CUSTOM URL' : 'NO AVATAR SET'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tab Selection */}
                                    <div className="flex border-4 border-black">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAvatarMode('preset');
                                                // Switch to first preset if on custom
                                                if (!AVATARS[editForm.avatar_url as keyof typeof AVATARS]) {
                                                    setEditForm({ ...editForm, avatar_url: 'user' });
                                                }
                                            }}
                                            className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                                                avatarMode === 'preset'
                                                    ? 'bg-black text-white'
                                                    : 'bg-white text-black hover:bg-accent/10'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Box className="w-4 h-4" />
                                                PRESET ICONS
                                            </div>
                                        </button>
                                        <div className="w-[4px] bg-black"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAvatarMode('custom');
                                                // Clear to allow custom URL entry
                                                if (AVATARS[editForm.avatar_url as keyof typeof AVATARS]) {
                                                    setEditForm({ ...editForm, avatar_url: '' });
                                                }
                                            }}
                                            className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                                                avatarMode === 'custom'
                                                    ? 'bg-black text-white'
                                                    : 'bg-white text-black hover:bg-accent/10'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <LinkIcon className="w-4 h-4" />
                                                CUSTOM URL
                                            </div>
                                        </button>
                                    </div>

                                    {/* Content Area */}
                                    <div className="border-4 border-black p-6 bg-white min-h-[200px]">
                                        {avatarMode === 'preset' ? (
                                            // PRESET ICONS VIEW
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">CHOOSE FROM {Object.keys(AVATARS).length} PRESET ICONS</h4>
                                                </div>
                                                <div className="grid grid-cols-6 gap-3">
                                                    {Object.entries(AVATARS).map(([key, icon]) => (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => setEditForm({ ...editForm, avatar_url: key })}
                                                            className={`aspect-square p-3 border-4 transition-all group relative rounded-full ${
                                                                editForm.avatar_url === key
                                                                    ? 'border-black bg-black text-white shadow-brutal scale-95'
                                                                    : 'border-gray-300 hover:border-black bg-white text-black hover:shadow-brutal hover:scale-105'
                                                            }`}
                                                            title={key.toUpperCase()}
                                                        >
                                                            <div className="w-full h-full flex items-center justify-center">{icon}</div>
                                                            {editForm.avatar_url === key && (
                                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent border-2 border-black flex items-center justify-center">
                                                                    <CheckCheck className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[9px] font-bold uppercase text-muted-foreground mt-4 text-center">
                                                    CLICK ANY ICON TO SELECT • ALL ICONS ARE OPTIMIZED
                                                </p>
                                            </div>
                                        ) : (
                                            // CUSTOM URL VIEW
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">ENTER CUSTOM IMAGE URL</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    <input
                                                        type="url"
                                                        value={editForm.avatar_url}
                                                        onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                                                        className="w-full bg-[#F5F5F5] border-4 border-black p-3 font-bold outline-none focus:border-accent text-sm"
                                                        placeholder="https://ix.imagekit.io/joehukvo..."
                                                    />
                                                    <div className="bg-accent/5 border-2 border-black p-3 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                                                        <p className="text-[9px] font-black uppercase mb-1.5 flex items-center gap-1.5">
                                                            <Info className="w-3 h-3 flex-shrink-0" />
                                                            IMPORTANT NOTES:
                                                        </p>
                                                        <ul className="text-[9px] font-bold space-y-0.5 ml-4 list-disc">
                                                            <li>USE DIRECT IMAGE URLs (ENDING IN .JPG, .PNG, .GIF, .WEBP)</li>
                                                            <li>RECOMMENDED SIZE: 256X256 PIXELS OR LARGER</li>
                                                            <li>ENSURE THE URL IS PUBLICLY ACCESSIBLE</li>
                                                            <li>SQUARE IMAGES WORK BEST</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button type="button" variant="outline" className="flex-1 border-2 border-black font-bold uppercase" onClick={() => setIsEditing(false)}>
                                        CANCEL
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                                        SAVE CHANGES
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
