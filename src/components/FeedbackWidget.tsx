import React, { useState } from 'react';
import { MessageSquareWarning, X, Send, Bug, MessageCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ComplaintType = 'bug' | 'feedback' | 'complaint' | 'feature_request';

const typeConfig: Record<ComplaintType, { label: string; icon: React.ReactNode; color: string }> = {
  bug: { label: 'BUG REPORT', icon: <Bug size={14} />, color: 'bg-destructive text-destructive-foreground' },
  feedback: { label: 'FEEDBACK', icon: <MessageCircle size={14} />, color: 'bg-accent text-accent-foreground' },
  complaint: { label: 'COMPLAINT', icon: <AlertTriangle size={14} />, color: 'bg-foreground text-background' },
  feature_request: { label: 'FEATURE REQ', icon: <Lightbulb size={14} />, color: 'bg-accent text-accent-foreground' },
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ComplaintType>('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await apiClient.from('complaints').insert({
        user_id: user?.id || null,
        user_email: user?.email || 'anonymous',
        type,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        priority: type === 'bug' ? 'high' : 'medium',
      });

      if (error) throw error;

      toast.success('Submitted successfully! We\'ll get back to you.');
      setSubject('');
      setMessage('');
      setType('feedback');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 border-4 border-foreground bg-accent text-accent-foreground shadow-brutal flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all",
          isOpen && "hidden"
        )}
        title="Report Issue / Feedback"
        
      >
        <MessageSquareWarning size={24} />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[520px] border-4 border-foreground bg-background shadow-brutal-lg flex flex-col font-mono animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-300"
          
        >
          {/* Header */}
          <div className="bg-foreground text-background p-4 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest">⚡ REPORT / FEEDBACK</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Type Selector */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block">TYPE</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(typeConfig) as [ComplaintType, typeof typeConfig[ComplaintType]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setType(key)}
                    className={cn(
                      "border-2 border-foreground p-2 text-[10px] font-black uppercase flex items-center gap-1.5 transition-all",
                      type === key ? cfg.color : "bg-background hover:bg-secondary"
                    )}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 block">SUBJECT</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title..."
                maxLength={100}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-accent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 block">DETAILS</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or feedback..."
                rows={4}
                maxLength={1000}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold resize-none focus:outline-none focus:border-accent"
              />
              <span className="text-[9px] opacity-40 font-bold">{message.length}/1000</span>
            </div>

            {user && (
              <p className="text-[9px] font-bold opacity-40">
                SUBMITTING AS: {user.email}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="p-4 border-t-4 border-foreground">
            <button
              onClick={handleSubmit}
              disabled={loading || !subject.trim() || !message.trim()}
              className="w-full border-2 border-foreground bg-accent text-accent-foreground py-3 font-black uppercase text-sm flex items-center justify-center gap-2 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="animate-pulse">SENDING...</span>
              ) : (
                <>
                  <Send size={14} /> SUBMIT REPORT
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
