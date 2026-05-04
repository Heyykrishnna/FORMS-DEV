import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';

const CollabAccess = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [formId, setFormId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const decoded = JSON.parse(atob(token!));
      const { id, s, e, p } = decoded;
      setFormId(id);

      // 1. Check expiration
      if (e !== '0' && new Date(e) < new Date()) {
        toast.error('PROTOCOL EXPIRED: ACCESS DENIED');
        setLoading(false);
        return;
      }

      // 2. Fetch form to verify salt and password
      const { data, error } = await apiClient
        .from('forms')
        .select('settings')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('PROTOCOL NOT FOUND');
        setLoading(false);
        return;
      }

      const settings = typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings || {};

      // 3. Verify Salt
      if (settings.linkRotationSalt && settings.linkRotationSalt !== s) {
        toast.error('ACCESS REVOKED: TOKEN ROTATED');
        setLoading(false);
        return;
      }

      // 4. Check if password is required
      if (p === '1' || settings.collaborationPassword) {
        setPasswordRequired(true);
        setLoading(false);
      } else {
        grantAccess(id);
      }
    } catch (err) {
      console.error('Token validation error:', err);
      toast.error('INVALID ACCESS PROTOCOL');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) return;

    try {
      const { data, error } = await apiClient
        .from('forms')
        .select('settings')
        .eq('id', formId)
        .single();
      
      if (error) throw error;
      const settings = typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings || {};

      if (settings.collaborationPassword === password) {
        grantAccess(formId);
      } else {
        toast.error('AUTHENTICATION FAILED: INVALID KEY');
      }
    } catch (err) {
      toast.error('AUTH ERROR');
    }
  };

  const grantAccess = (id: string) => {
    sessionStorage.setItem(`collab_auth_${id}`, 'true');
    toast.success('ACCESS GRANTED: INITIALIZING BUILDER');
    navigate(`/builder/${id}?collab=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-foreground border-t-accent animate-spin mb-4" />
        <p className="font-black uppercase tracking-[0.2em] animate-pulse">Verifying Access Protocol...</p>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full border-4 border-foreground p-8 bg-secondary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-1 w-foreground bg-foreground mb-1" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">SECURED_STREAM</h1>
            <p className="text-[10px] font-bold opacity-60 tracking-[0.3em] uppercase mt-2">Authentication Required</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Encryption Key</label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border-2 border-foreground p-4 outline-none font-mono focus:bg-accent focus:text-accent-foreground transition-all"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-foreground text-background font-black uppercase py-4 hover:bg-accent hover:text-accent-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] active:translate-x-0 active:translate-y-0"
            >
              Authorize Access
            </button>
          </form>

          <p className="text-[8px] font-bold text-center mt-8 text-muted-foreground uppercase leading-relaxed">
            This stream is protected by end-to-end encryption.<br />
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full border-4 border-foreground p-8 bg-red-500/10 text-center">
        <h1 className="text-2xl font-black uppercase text-red-500 mb-4">ACCESS_DENIED</h1>
        <p className="text-xs font-bold uppercase mb-8">The collaboration protocol could not be established.</p>
        <button 
          onClick={() => navigate('/')}
          className="border-2 border-foreground bg-foreground text-background px-6 py-2 text-[10px] font-black uppercase"
        >
          Return to Base
        </button>
      </div>
    </div>
  );
};

export default CollabAccess;
