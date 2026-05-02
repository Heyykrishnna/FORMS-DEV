"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { Sparkles } from "lucide-react";
import { useClickOutside } from "./use-click-outside";

const SPEED = 1;
const SUCCESS_DURATION = 1500;
const DOCK_HEIGHT = 40;
const FEEDBACK_BORDER_RADIUS = 12;
const DOCK_BORDER_RADIUS = 12;
const SPRING_STIFFNESS = 550;
const SPRING_DAMPING = 45;
const SPRING_MASS = 0.7;
const CLOSE_DELAY = 0.08;
const FEEDBACK_WIDTH = 360;
const FEEDBACK_HEIGHT = 200;

interface FooterContext {
  showFeedback: boolean;
  success: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
  isThinking?: boolean;
}

const FooterContext = React.createContext({} as FooterContext);
const useFooter = () => React.useContext(FooterContext);

export function MorphSurface({
  onSubmit,
  isThinking = false,
  placeholder = "Ask AI to build a form...",
  className,
}: {
  onSubmit?: (message: string) => void;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const feedbackRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeFeedback = React.useCallback(() => {
    setShowFeedback(false);
    feedbackRef.current?.blur();
  }, []);

  const openFeedback = React.useCallback(() => {
    setShowFeedback(true);
    setTimeout(() => {
      feedbackRef.current?.focus();
    });
  }, []);

  const onFeedbackSuccess = React.useCallback(() => {
    closeFeedback();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_DURATION);
  }, [closeFeedback]);

  useClickOutside(rootRef, closeFeedback);

  const context = React.useMemo(
    () => ({
      showFeedback,
      success,
      openFeedback,
      closeFeedback,
      isThinking,
    }),
    [showFeedback, success, openFeedback, closeFeedback, isThinking]
  );

  return (
    <div
      className={cn("flex items-start justify-center pointer-events-none", className)}
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
      }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                width: showFeedback ? FEEDBACK_WIDTH : "auto",
                height: showFeedback ? FEEDBACK_HEIGHT : DOCK_HEIGHT,
                borderRadius: showFeedback
                  ? FEEDBACK_BORDER_RADIUS
                  : DOCK_BORDER_RADIUS,
              }
        }
        className={cn(
          "relative z-[100] flex flex-col items-center overflow-hidden border border-foreground bg-background transition-shadow pointer-events-auto",
          showFeedback ? "shadow-md" : "shadow-sm hover:translate-y-[1px] hover:translate-x-[1px]"
        )}
        data-footer
        initial={false}
        ref={rootRef}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: SPRING_STIFFNESS / SPEED,
                damping: SPRING_DAMPING,
                mass: SPRING_MASS,
                delay: showFeedback ? 0 : CLOSE_DELAY,
                duration: 0.25,
              }
        }
      >
        <FooterContext.Provider value={context}>
          <Dock />
          <Feedback
            onSuccess={onFeedbackSuccess}
            ref={feedbackRef}
            onSubmitOverride={onSubmit}
            placeholder={placeholder}
          />
        </FooterContext.Provider>
      </motion.div>
    </div>
  );
}

function Dock() {
  const { openFeedback } = useFooter();
  return (
    <button 
      type="button"
      className="flex h-10 w-full select-none items-center justify-center whitespace-nowrap cursor-pointer px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      onClick={openFeedback}
      aria-label="Open Ask Aqora AI"
    >
      <span className="font-medium md:text-sm text-[10px]">Ask Aqora AI</span>
    </button>
  );
}

function Feedback({
  ref,
  onSuccess,
  onSubmitOverride,
  placeholder,
}: {
  ref: React.Ref<HTMLTextAreaElement>;
  onSuccess: () => void;
  onSubmitOverride?: (message: string) => void;
  placeholder?: string;
}) {
  const { closeFeedback, showFeedback, isThinking } = useFooter();
  const shouldReduceMotion = useReducedMotion();
  const submitRef = React.useRef<HTMLButtonElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    if (onSubmitOverride) {
      onSubmitOverride(message);
    } else {
      onSuccess();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      closeFeedback();
    }
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      submitRef.current?.click();
    }
  }

  return (
    <form
      className="absolute bottom-0"
      onSubmit={onSubmit}
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
        pointerEvents: showFeedback ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            className="flex h-full flex-col p-1"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0 }
            }
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: SPRING_STIFFNESS / SPEED,
                    damping: SPRING_DAMPING,
                    mass: SPRING_MASS,
                    duration: 0.25,
                  }
            }
          >
            <div className="flex justify-between items-center py-3 px-4 border-b border-foreground/10 bg-background/80 backdrop-blur-md relative z-10">
              <p className="flex select-none items-center gap-[6px] text-sm font-medium text-foreground">
                Aqora AI
              </p>
              <button
                className="right-4 mt-1 flex -translate-y-[3px] cursor-pointer select-none items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center text-foreground"
                ref={submitRef}
                type="submit"
              >
                <Kbd className="w-fit">⌘ Enter</Kbd>
              </button>
            </div>
            <textarea
              className="h-full w-full resize-none scroll-py-2 rounded-md bg-transparent p-4 outline-0 text-foreground placeholder:text-muted-foreground"
              name="message"
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              ref={ref}
              required
              spellCheck={false}
              disabled={isThinking}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Kbd({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "flex h-6 w-fit items-center justify-center rounded-md border border-foreground/20 bg-muted px-2 font-sans text-[10px] font-medium text-muted-foreground shadow-sm",
        className
      )}
    >
      {children}
    </kbd>
  );
}
