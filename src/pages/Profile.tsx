import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { X, AlertTriangle, Box, Link as LinkIcon, CheckCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AgentAvatar from '@/components/ui/smoothui/agent-avatar';
import React from 'react';
import { cn } from '@/lib/utils';

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

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/40 mb-1">{children}</p>
);

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ formsCount: 0, totalResponses: 0 });

  const loadProfile = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      const { data: recentForms, error: activityError } = await supabase
        .from('forms')
        .select('id, title, updated_at, created_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (activityError) console.error('Error loading activity:', activityError);

      const activity: Activity[] = recentForms?.map(form => ({
        action: form.created_at === form.updated_at ? 'CREATED' : 'UPDATED',
        target: form.title,
        timestamp: form.updated_at,
      })) || [];

      setProfile({ ...data, recent_activity: activity });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadStats = React.useCallback(async () => {
    try {
      const { count: formsCount, error: formsError } = await supabase
        .from('forms')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      if (formsError) throw formsError;

      const { data: forms } = await supabase.from('forms').select('id').eq('user_id', user?.id);
      let totalResponses = 0;

      if (forms && forms.length > 0) {
        const { count } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .in('form_id', forms.map(f => f.id));
        totalResponses = count || 0;
      }

      setStats({ formsCount: formsCount || 0, totalResponses });
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
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditing]);

  useEffect(() => {
    if (profile) {
      setEditForm({ username: profile.username || '', avatar_url: profile.avatar_url || '' });
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => (prev ? { ...prev, ...editForm } : null));
      setIsEditing(false);
      toast.success('Profile updated.');
    } catch {
      toast.error('Update failed.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Loading profile...</p>
        </div>
      </div>
    );
  }

  const memberSince = user?.created_at ? new Date(user.created_at) : null;
  const daysActive = memberSince
    ? Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const badges = [
    {
      id: 'first_form',
      label: 'FIRST FORM',
      desc: 'Deployed 1st form',
      unlocked: stats.formsCount > 0,
    },
    {
      id: 'influencer',
      label: 'INFLUENCER',
      desc: '100+ responses',
      unlocked: stats.totalResponses >= 100,
    },
    {
      id: 'architect',
      label: 'ARCHITECT',
      desc: 'Created 5+ forms',
      unlocked: stats.formsCount >= 5,
    },
    {
      id: 'veteran',
      label: 'VETERAN',
      desc: 'Member 30+ days',
      unlocked: daysActive >= 30,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#F0F0F0] text-foreground font-mono overflow-x-hidden">

      <VerticalScale className="fixed inset-y-0 left-0 z-20 pointer-events-none" />
      <VerticalScale className="fixed inset-y-0 right-0 z-20 pointer-events-none" />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <nav className="border-b border-foreground sticky top-0 bg-[#F0F0F0] z-50">
        <div className="mx-auto flex items-center justify-between px-16 py-4">
          <Link to="/" className="text-[24px] font-sans font-medium tracking-tight hover:text-accent transition-colors">
            aqora
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border border-transparent hover:border-foreground px-3 py-2"
            >
              Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="text-[10px] font-bold uppercase tracking-widest border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <HorizontalScale />

      <main className="px-16 py-12 max-w-[1400px] mx-auto relative z-10">

        <div className="flex items-end justify-between mb-10 pb-6 border-b border-black/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Account</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-sans leading-none">
              Profile<span className="text-accent">.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Member since</p>
            <p className="text-sm font-bold font-mono">
              {memberSince ? memberSince.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1 space-y-4">

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Identity</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-bold uppercase tracking-widest border border-background/30 px-2 py-1 hover:bg-background hover:text-foreground transition-all"
                >
                  Edit
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-foreground overflow-hidden bg-black flex items-center justify-center shrink-0 cursor-pointer group relative"
                    onClick={() => setIsEditing(true)}
                  >
                    {profile?.avatar_url && AVATARS[profile.avatar_url as keyof typeof AVATARS] ? (
                      <div className="scale-150">{AVATARS[profile.avatar_url as keyof typeof AVATARS]}</div>
                    ) : profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + profile.username;
                        }}
                      />
                    ) : (
                      <AgentAvatar seed={profile?.username || user?.email || 'aqora'} size={64} />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold uppercase tracking-widest">Edit</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold font-sans leading-tight">
                      {profile?.username || 'Unknown'}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Level 1 Operative</p>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 space-y-4">
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <p className="text-sm font-bold break-all">{user?.email}</p>
                  </div>
                  <div>
                    <FieldLabel>User ID</FieldLabel>
                    <p className="text-[11px] font-mono opacity-50 truncate">{user?.id}</p>
                  </div>
                  <div>
                    <FieldLabel>Days active</FieldLabel>
                    <p className="text-sm font-bold">{daysActive} days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3">
                <span className="text-[10px] font-bold uppercase tracking-widest">Account Actions</span>
              </div>
              <div className="p-5 space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-sm font-bold uppercase tracking-wide border border-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-all"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => toast.error("Access denied. You're stuck with us.")}
                  className="w-full text-left text-sm font-bold uppercase tracking-wide border border-red-400 text-red-500 px-4 py-3 hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">

            <HorizontalScale />

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Medals & Honors</span>
                <span className="text-[10px] opacity-50">{badges.filter(b => b.unlocked).length}/{badges.length} unlocked</span>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={cn(
                      'border rounded-xl p-4 flex flex-col items-center text-center transition-all',
                      badge.unlocked
                        ? 'border-foreground bg-white'
                        : 'border-black/10 opacity-30'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full border-2 mb-3 flex items-center justify-center text-[10px] font-black',
                        badge.unlocked ? 'border-accent bg-accent/10 text-accent' : 'border-black/20'
                      )}
                    >
                      {badge.unlocked ? '✓' : '○'}
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-wide mb-0.5">{badge.label}</p>
                    <p className="text-[9px] uppercase opacity-50 font-bold">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <HorizontalScale />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Forms', value: stats.formsCount },
                { label: 'Total Responses', value: stats.totalResponses },
                { label: 'Days Active', value: daysActive },
              ].map(item => (
                <div key={item.label} className="bg-background border border-foreground rounded-xl p-6 shadow-sm">
                  <p className="text-4xl font-bold font-sans mb-1">{item.value}</p>
                  <FieldLabel>{item.label}</FieldLabel>
                </div>
              ))}
            </div>

            <div className="bg-background border border-foreground rounded-xl overflow-hidden shadow-sm">
              <div className="bg-foreground text-background px-5 py-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Operations Log</span>
                <span className="text-[10px] opacity-50">Last 5 actions</span>
              </div>
              <div className="divide-y divide-black/5">
                {profile?.recent_activity && profile.recent_activity.length > 0 ? (
                  profile.recent_activity.map((activity: Activity, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] transition-colors group"
                    >
                      <div className="w-6 h-6 border border-foreground flex items-center justify-center shrink-0 text-[10px] font-black group-hover:bg-foreground group-hover:text-background transition-all">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide truncate">
                          {activity.action}{' '}
                          <span className="text-accent">"{activity.target}"</span>
                        </p>
                        <p className="text-[10px] opacity-40 font-mono mt-0.5">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-30">No recent activity.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-12">
          <HorizontalScale />
        </div>

        <div className="mt-6 flex items-center justify-between opacity-30">
          <p className="text-[10px] font-mono uppercase tracking-widest">aqora · profile</p>
          <p className="text-[10px] font-mono uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
        </div>

      </main>

      {isEditing && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4">
          <div className="bg-background border border-foreground w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-150 relative overflow-hidden">

            <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest">Edit Profile</span>
              <button onClick={() => setIsEditing(false)} className="hover:opacity-70 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <FieldLabel>Username</FieldLabel>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-foreground px-3 py-2.5 font-bold text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <FieldLabel>Avatar</FieldLabel>

                <div className="flex items-center gap-3 p-3 border border-foreground mb-3 bg-[#F5F5F5]">
                  <div className="w-12 h-12 rounded-full border border-foreground overflow-hidden bg-black flex items-center justify-center shrink-0">
                    {editForm.avatar_url && AVATARS[editForm.avatar_url as keyof typeof AVATARS] ? (
                      <div className="scale-150">{AVATARS[editForm.avatar_url as keyof typeof AVATARS]}</div>
                    ) : editForm.avatar_url ? (
                      <img src={editForm.avatar_url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <AgentAvatar seed={editForm.username || user?.email || 'aqora'} size={48} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase">Preview</p>
                    <p className="text-[10px] opacity-40 font-bold uppercase">
                      {editForm.avatar_url && AVATARS[editForm.avatar_url as keyof typeof AVATARS]
                        ? 'Preset'
                        : editForm.avatar_url
                        ? 'Custom URL'
                        : 'Auto-generated'}
                    </p>
                  </div>
                </div>

                <div className="flex border border-foreground mb-3">
                  {(['preset', 'custom'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setAvatarMode(mode);
                        if (mode === 'preset' && !AVATARS[editForm.avatar_url as keyof typeof AVATARS]) {
                          setEditForm({ ...editForm, avatar_url: 'user' });
                        }
                        if (mode === 'custom' && AVATARS[editForm.avatar_url as keyof typeof AVATARS]) {
                          setEditForm({ ...editForm, avatar_url: '' });
                        }
                      }}
                      className={cn(
                        'flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5',
                        avatarMode === mode ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-black/5'
                      )}
                    >
                      {mode === 'preset' ? <Box className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="border border-foreground p-4 bg-white min-h-[140px]">
                  {avatarMode === 'preset' ? (
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries(AVATARS).map(([key, icon]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, avatar_url: key })}
                          className={cn(
                            'aspect-square p-2 border-2 transition-all rounded-full relative',
                            editForm.avatar_url === key
                              ? 'border-foreground bg-foreground/10 scale-95'
                              : 'border-black/10 hover:border-foreground'
                          )}
                          title={key}
                        >
                          <div className="w-full h-full flex items-center justify-center">{icon}</div>
                          {editForm.avatar_url === key && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border border-foreground flex items-center justify-center rounded-full">
                              <CheckCheck className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={editForm.avatar_url}
                        onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-foreground px-3 py-2.5 font-bold text-sm outline-none focus:border-accent transition-colors"
                        placeholder="https://..."
                      />
                      <div className="text-[9px] font-bold uppercase opacity-50 space-y-0.5">
                        <p className="flex items-center gap-1"><Info className="w-2.5 h-2.5" /> Use direct image URLs (.jpg, .png, .webp)</p>
                        <p>Recommended: 256×256 px square</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-foreground font-bold uppercase text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-foreground text-background hover:bg-accent font-bold uppercase text-xs border border-foreground transition-colors"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
