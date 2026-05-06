import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/* ================= SCALES ================= */

const HorizontalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "h-10 w-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]",
      className
    )}
  />
);

const VerticalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]",
      className
    )}
  />
);

/* ================= PAGE ================= */

const AqoraAI = () => {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  // ✨ AI typing placeholder
  useEffect(() => {
    const text = "Create a customer feedback form for a SaaS product...";
    let i = 0;

    const interval = setInterval(() => {
      setPlaceholder(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hex-theme hex-paper relative min-h-screen text-foreground overflow-hidden">

      {/* SIDE SCALES */}
      <VerticalScale className="absolute left-0 top-0" />
      <VerticalScale className="absolute right-0 top-0" />

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* grid */}
        <div className="absolute inset-0 hex-grid opacity-40" />

        {/* ✨ floating orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px]"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[120px]"
        />

        <div className="max-w-7xl mx-auto px-6 pt-28 pb-32 relative">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-xs tracking-[0.3em] opacity-40 mb-6">
              AQORA AI
            </p>

            <h1 className="text-[76px] leading-[1.02] tracking-[-0.05em] font-semibold">
              Your AI,
              <br />
              <span className="italic font-serif bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                building forms
              </span>
              <br />
              while you think.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Describe what you need. Aqora generates, adapts, and analyzes —
              turning ideas into structured forms instantly.
            </p>
          </motion.div>

          {/* PROMPT */}
          <div className="mt-12 max-w-xl group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

            <div className="relative flex bg-white border rounded-xl p-2 shadow-md">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-sm"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-black text-white px-5 rounded-lg flex items-center gap-2"
              >
                Generate
                <ArrowRight size={14} />
              </motion.button>
            </div>

            {/* suggestions */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {[
                "Customer feedback",
                "Event registration",
                "Lead qualification",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-xs px-3 py-1.5 border rounded-full hover:bg-black/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= SYSTEMS ================= */}
      <section className="relative py-32 border-y hex-line-soft">

        <HorizontalScale className="absolute top-0 left-0" />
        <HorizontalScale className="absolute bottom-0 left-0" />

        <div className="absolute inset-0 hex-grid opacity-20" />

        <div className="max-w-6xl mx-auto px-6 space-y-32">

          <FeatureBlock
            tag="CREATOR AI"
            title="Describe → Generate"
            desc="Turn plain language into structured, production-ready forms in seconds."
          />

          <FeatureBlock
            tag="INTERACTION AI"
            title="Adaptive questioning"
            desc="Every response evolves the conversation. Smarter follow-ups, better data."
          />

          <FeatureBlock
            tag="INSIGHTS AI"
            title="Instant understanding"
            desc="Summaries, patterns, and signals — without spreadsheets."
          />

        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="py-32 relative">

        <div className="absolute inset-0 hex-grid opacity-20" />

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-[44px] font-semibold mb-16 tracking-tight">
            A complete AI system,
            <br />
            not just a generator.
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              "AI Form Builder",
              "AI Import",
              "AI Brand Kit",
              "AI Translation",
              "Content Optimizer",
              "Ask AI",
              "Qualitative Analysis",
              "Quantitative Analysis",
              "Clarify with AI",
            ].map((f) => (
              <motion.div
                key={f}
                whileHover={{ y: -6 }}
                className="group p-6 border hex-line-soft bg-white transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="font-medium text-lg">{f}</h3>
                <p className="text-sm text-muted-foreground mt-2 group-hover:text-foreground/80">
                  Built to remove friction and accelerate decisions.
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 text-center border-t hex-line-soft relative overflow-hidden">

        <div className="absolute inset-0 hex-grid opacity-20" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[52px] font-semibold tracking-tight"
        >
          Start building with AI
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-10 bg-black text-white px-10 py-4 rounded-xl flex items-center gap-2 mx-auto shadow-lg"
        >
          Try Aqora AI
          <ArrowRight size={16} />
        </motion.button>

      </section>

      <Footer />
    </div>
  );
};

/* ================= FEATURE BLOCK ================= */

const FeatureBlock = ({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) => (
  <div className="grid md:grid-cols-2 gap-16 items-center">

    <div>
      <p className="text-xs tracking-[0.3em] opacity-40 mb-4">
        {tag}
      </p>

      <h3 className="text-[38px] font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-4 text-muted-foreground text-lg">
        {desc}
      </p>
    </div>

    {/* ✨ animated mock */}
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-[260px] rounded-xl border hex-line-soft bg-gradient-to-br from-white to-neutral-100 flex items-center justify-center shadow-inner"
    >
      <span className="text-sm opacity-40">
        Live AI preview
      </span>
    </motion.div>

  </div>
);

export default AqoraAI;