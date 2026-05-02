import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { MorphSurface } from '@/components/ui/smoothui/ai-input';
import { generateFormFromPrompt } from '@/services/groq';
import { toast } from 'sonner';
import { Sparkles, Brain, Zap, X } from 'lucide-react';
import { FormData } from '@/types/form';
import { motion, AnimatePresence } from 'motion/react';

interface AIFormCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (form: Partial<FormData>) => Promise<void>;
}

const AIFormCreator: React.FC<AIFormCreatorProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    setIsThinking(true);
    setProgress(10);
    
    const toastId = toast.loading("AI is brainstorming your form...", {
      description: "Analyzing objective and designing structure...",
    });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
      }, 800);

      const generatedForm = await generateFormFromPrompt(message);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success("Form Generated!", {
        id: toastId,
        description: `Created "${generatedForm.title}" with ${generatedForm.questions?.length} steps.`,
      });

      await onSuccess(generatedForm);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error("Generation Failed", {
        id: toastId,
        description: error.message || "Something went wrong during generation.",
      });
    } finally {
      setIsThinking(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !isThinking && !v && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-background border-[8px] border-foreground shadow-brutal-lg p-0 overflow-hidden rounded-none gap-0 [&>button:last-child]:hidden">
        
        {/* CUSTOM "CRAZY" CLOSE BUTTON */}
        <motion.button
          onClick={onClose}
          disabled={isThinking}
          whileHover={{ 
            rotate: 0, 
            scale: 1.2,
            backgroundColor: "#ef4444",
            color: "#fff"
          }}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-6 top-6 z-[60] w-12 h-12 border-4 border-foreground bg-white flex items-center justify-center shadow-brutal hover:shadow-none transition-shadow duration-200 group overflow-hidden"
        >
          <motion.div
            animate={isThinking ? { opacity: 0 } : { opacity: 1 }}
          >
            <X className="w-6 h-6 stroke-[3px]" />
          </motion.div>
          
          {/* GLITCH OVERLAY ON HOVER */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_4px)]" />
        </motion.button>

        {/* Progress Bar */}
        <AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 h-1 bg-accent origin-left z-50 transition-all duration-300"
            />
          )}
        </AnimatePresence>

        <div className="p-10" >
          <DialogHeader className="mb-10 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  MAGIC_CREATE<span className="text-accent underline decoration-8 underline-offset-8">.</span>
                </DialogTitle>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
               <span className="text-[9px] font-black bg-foreground text-background px-2 py-0.5 tracking-[0.2em]">NEURAL_ENGINE_ACTIVE</span>
               <span className="text-[9px] font-black border-2 border-foreground px-2 py-0.5 tracking-[0.2em]">v4.2.0_STABLE</span>
            </div>
            <DialogDescription className="text-sm md:text-base font-black uppercase tracking-tight opacity-70 border-l-8 border-accent pl-6 max-w-2xl leading-tight">
              ARCHITECTING PRODUCTION-READY FORMS FROM RAW SEMANTIC DATA. OUR LLM NEURAL ENGINE CONSTRUCTS COMPLETE PROTOCOLS, LOGIC, AND THEMES IN SECONDS.
            </DialogDescription>
          </DialogHeader>

          <div className="relative min-h-[400px] flex flex-col items-center justify-center border-[6px] border-foreground bg-secondary p-12 overflow-hidden shadow-inner group">
            {/* Background Grid Accent */}
            <div className="absolute inset-x-0 top-0 h-full opacity-[0.05] pointer-events-none" 
                 style={{ 
                   backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }} 
            />
            
            {/* Scanning Line Animation */}
            {isThinking && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.div 
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute h-[10%] w-full bg-accent/20 blur-xl"
                />
                <motion.div 
                  initial={{ top: '-5%' }}
                  animate={{ top: '105%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute h-[2px] w-full bg-accent shadow-[0_0_15px_hsl(var(--accent))]"
                />
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {!isThinking ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full relative z-2"
                >
                  <div className="mb-12 text-center relative">
                    <p className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 scale-y-110 relative z-10 leading-none">
                      WHATS THE <span className="text-accent">MISSION?</span>
                    </p>
                    <div className="h-1 w-24 bg-foreground mx-auto mb-6" />
                    <p className="text-[10px] md:text-xs font-black opacity-50 uppercase max-w-md mx-auto leading-relaxed tracking-wider">
                      Eg: "Create a high-conversion checkout form for a limited edition vinyl drop with brutalist aesthetic"
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <MorphSurface 
                      onSubmit={handleSubmit} 
                      isThinking={isThinking}
                      placeholder="Tell the AI what you want to build..."
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="thinking"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full relative z-2"
                >
                  <div className="flex flex-col items-center gap-8">
                    <div className="text-center">
                      <p className="text-4xl font-black uppercase italic tracking-tighter text-accent">
                        ARCHITECTING_CORE<span className="italic">...</span>
                      </p>
                      <div className="flex gap-1 justify-center mt-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                            className="w-4 h-1 bg-accent"
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-6 bg-accent text-accent-foreground px-4 py-1">
                         {progress < 40 ? 'ANALYZING SEMANTICS' : progress < 70 ? 'STRUCTURING SCHEMAS' : 'INJECTING AESTHETICS'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between items-center opacity-30 text-[9px] font-black uppercase tracking-[0.2em]">
            <span>AQORA_ENGINE_v4.2</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIFormCreator;
