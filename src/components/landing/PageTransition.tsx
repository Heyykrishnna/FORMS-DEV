import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
