import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export const Marquee = ({
  children,
  direction = 'left',
  speed = 40,
  className,
  pauseOnHover = false,
}: MarqueeProps) => {
  return (
    <div className={cn("overflow-hidden flex w-full group", className)}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: direction === 'left' ? '-100%' : '100%' }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className={cn("flex flex-shrink-0 gap-12 items-center min-w-full pr-12", pauseOnHover && "group-hover:[animation-play-state:paused]")}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: direction === 'left' ? '-100%' : '100%' }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className={cn("flex flex-shrink-0 gap-12 items-center min-w-full pr-12", pauseOnHover && "group-hover:[animation-play-state:paused]")}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
};

