import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skull, AlertTriangle, Send, X, Brain, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

const FUNNY_RECOVERY_MESSAGES = [
  "Searching for your lost brain cells...",
  "Consulting the archives of shame...",
  "Sending a rescue helicopter (email)...",
  "Pinging your inner child...",
  "Recrusting data from the void...",
  "Hacking into your memory banks...",
  "Calculating the probability of you forgetting again...",
  "Establishing a neural bridge..."
];

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(FUNNY_RECOVERY_MESSAGES[0]);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
    }
  }, [isOpen, initialEmail]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsg(FUNNY_RECOVERY_MESSAGES[Math.floor(Math.random() * FUNNY_RECOVERY_MESSAGES.length)]);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("I CAN'T READ MINDS. ENTER THE EMAIL.", {
        className: "font-black uppercase border-4 border-black"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Small artificial delay for the funny loading messages to be seen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;

      toast.success("FINE. WE SENT THE EXTRACTION LINK.", {
        description: "Check your spam. It belongs there.",
        className: "font-black uppercase border-4 border-black"
      });
      onClose();
    } catch (error: any) {
      toast.error("EVERYTHING IS BROKEN.", {
        description: error.message || "Even the system gave up on you.",
        className: "font-black uppercase border-4 border-red-600 text-red-600",
        icon: <AlertTriangle className="w-5 h-5" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !loading && !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#F0F0F0] border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-none [&>button:last-child]:hidden">
        
        {/* CUSTOM CLOSE BUTTON */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-6 top-6 z-50 w-10 h-10 border-4 border-black bg-white flex items-center justify-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5 stroke-[3px]" />
        </button>

        <div className="p-8 md:p-12">
          <DialogHeader className="mb-8 text-left">
            <div className="flex items-center gap-4 mb-4">
               <DialogTitle className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                BRAIN_FART<span className="text-[#FF4500]">.</span>
               </DialogTitle>
            </div>
            <DialogDescription className="text-sm font-black uppercase tracking-tight opacity-70 border-l-8 border-[#FF4500] pl-6 py-2 leading-tight">
              ENTITY_ACCESS_DENIED. FORGOT YOUR RECRUSTION CODE? DON'T WORRY, WE'VE ALL BEEN THERE (MOSTLY YOU, THOUGH).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-[#FF4500] transition-colors">
                TARGET EMAIL <span className="text-[10px] opacity-40">(WHERE THE HELICOPTER GOES)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="SOMEONE_IMPORTANT@VOID.COM"
                required
                disabled={loading}
                className="w-full bg-white border-4 border-black p-5 text-lg font-black outline-none focus:bg-[#FF4500]/5 focus:border-[#FF4500] transition-all placeholder:opacity-20 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 px-8 border-4 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 border-4 border-white border-t-transparent animate-spin" />
                   <span className="text-sm">{loadingMsg}</span>
                </div>
              ) : (
                <>
                  INITIATE_RECOVERY
                </>
              )}
            </button>
          </form>

          {/* FUNNY FOOTER */}
          <div className="mt-12 flex items-center justify-between opacity-30 text-[9px] font-black uppercase tracking-[0.2em] border-t-2 border-black/10 pt-4">
             <div>REVOX_SYS_v4.2</div>
          </div>
        </div>

        {/* GLITCH OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_4px)]" />
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
