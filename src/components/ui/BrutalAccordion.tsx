import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  question: string;
  answer: string;
  index: number;
}

const AccordionItem = ({ question, answer, index }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-4 border-foreground group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-8 text-left transition-colors relative overflow-hidden",
          isOpen ? "bg-accent text-accent-foreground" : "hover:bg-accent/10"
        )}
      >
        <div className="flex items-center gap-8 relative z-10">
          <span className={cn(
            "text-4xl font-black italic opacity-20 transition-opacity",
            isOpen ? "opacity-40" : "group-hover:opacity-40"
          )}>
            0{index + 1}
          </span>
          <span className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">
            {question}
          </span>
        </div>
        <div className={cn(
          "h-10 w-10 border-4 border-foreground flex items-center justify-center transition-transform duration-500",
          isOpen ? "rotate-45 bg-foreground text-background" : ""
        )}>
          <Plus className="h-6 w-6" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.4
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.1
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.3
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 font-bold uppercase italic border-l-8 border-accent ml-8 my-6 text-lg leading-relaxed max-w-3xl opacity-80">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BrutalAccordionProps {
  items: { q: string; a: string }[];
}

const BrutalAccordion = ({ items }: BrutalAccordionProps) => {
  return (
    <div className="border-t-4 border-foreground shadow-brutal-lg">
      {items.map((item, i) => (
        <AccordionItem 
          key={i} 
          index={i} 
          question={item.q} 
          answer={item.a} 
        />
      ))}
    </div>
  );
};

export default BrutalAccordion;
