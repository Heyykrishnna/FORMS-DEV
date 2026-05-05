// // import React, { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabase";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { ArrowRight, Eye, EyeOff } from "lucide-react";
// // import { toast } from "sonner";

// // const Auth = () => {
// //   const [mode, setMode] = useState<"login" | "signup">("login");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [username, setUsername] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const navigate = useNavigate();
// //   const { session } = useAuth();

// //   useEffect(() => {
// //     if (session) navigate("/dashboard");
// //   }, [session]);

// //   const handleAuth = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       if (mode === "signup") {
// //         const { error } = await supabase.auth.signUp({
// //           email,
// //           password,
// //           options: { data: { username } },
// //         });
// //         if (error) throw error;
// //         toast.success("Account created");
// //       } else {
// //         const { error } = await supabase.auth.signInWithPassword({
// //           email,
// //           password,
// //         });
// //         if (error) throw error;
// //         navigate("/dashboard");
// //       }
// //     } catch (err: any) {
// //       toast.error(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex bg-[#f7f6f2] text-black">

// //       {/* SHARED BACKGROUND (applies to whole screen) */}
// //       <div
// //         className="fixed inset-0 opacity-[0.4] pointer-events-none"
// //         style={{
// //           backgroundImage: `
// //             linear-gradient(#d4d4d4 1px, transparent 1px),
// //             linear-gradient(90deg, #d4d4d4 1px, transparent 1px)
// //           `,
// //           backgroundSize: '48px 48px'
// //         }}
// //       />

// //       <div
// //         className="fixed inset-0 opacity-[0.25] pointer-events-none"
// //         style={{
// //           backgroundImage: 'radial-gradient(#a3a3a3 1px, transparent 1px)',
// //           backgroundSize: '18px 18px'
// //         }}
// //       />

// //       <div
// //         className="fixed inset-0 opacity-[0.2] pointer-events-none"
// //         style={{
// //           backgroundImage:
// //             'repeating-linear-gradient(315deg, #d4d4d4 0px, #d4d4d4 1px, transparent 1px, transparent 12px)',
// //           backgroundSize: '14px 14px'
// //         }}
// //       />

// //       <div className="fixed inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.03]" />

// //       {/* LEFT PANEL */}
// //       <div className="hidden lg:flex w-1/2 relative z-10 p-20 flex-col justify-between">

// //         <div>
// //           <p className="text-[11px] tracking-[0.2em] opacity-40 mb-6">
// //             FIG. AUTH
// //           </p>

// //           <h1 className="text-[64px] leading-[1.05] font-semibold tracking-[-0.04em]">
// //             FORMS,{" "}
// //             <span className="italic font-serif text-indigo-500">
// //               THOUGHTFULLY
// //             </span>
// //             <br />
// //             BUILT FOR TEAMS.
// //           </h1>

// //           <p className="mt-6 text-[15px] opacity-60 max-w-md leading-relaxed">
// //             AI-powered forms with real-time analytics, branching logic,
// //             and team collaboration.
// //           </p>
// //         </div>

// //         <div className="space-y-3 text-sm opacity-60">
// //           <p>01 — AI Forge — describe and generate</p>
// //           <p>02 — Real-time response analytics</p>
// //           <p>03 — Branching logic & quiz mode</p>
// //           <p>04 — Domain-locked sharing & embeds</p>
// //         </div>

// //         <div className="text-xs opacity-40">
// //           AQORA SYSTEMS • 2026
// //         </div>
// //       </div>

// //       {/* RIGHT PANEL */}
// //       <div className="w-full lg:w-1/2 flex items-center justify-center px-8 relative z-10">

// //         {/* CLEAN FORM AREA (no grid interference) */}
// //         <div className="w-full max-w-md bg-[#f7f6f2] px-6 py-10">

// //           {/* header */}
// //           <h2 className="text-[34px] font-semibold tracking-[-0.03em] leading-tight">
// //             {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
// //             <span className="text-indigo-500">.</span>
// //           </h2>

// //           <p className="text-[14px] text-neutral-600 mt-3 mb-8 leading-relaxed">
// //             {mode === "login"
// //               ? "Sign in to continue to your dashboard."
// //               : "Start building forms for your team."}
// //           </p>

// //           {/* form */}
// //           <form onSubmit={handleAuth} className="space-y-6">

// //             {mode === "signup" && (
// //               <div>
// //                 <label className="text-[11px] tracking-[0.15em] text-neutral-500 mb-2 block uppercase">
// //                   Username
// //                 </label>
// //                 <input
// //                   value={username}
// //                   onChange={(e) => setUsername(e.target.value)}
// //                   className="w-full border-b border-neutral-400 px-1 py-2 text-[15px] bg-transparent outline-none focus:border-black transition"
// //                 />
// //               </div>
// //             )}

// //             <div>
// //               <label className="text-[11px] tracking-[0.15em] text-neutral-500 mb-2 block uppercase">
// //                 Email Address
// //               </label>
// //               <input
// //                 type="email"
// //                 required
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="w-full border-b border-neutral-400 px-1 py-2 text-[15px] bg-transparent outline-none focus:border-black transition"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-[11px] tracking-[0.15em] text-neutral-500 mb-2 block uppercase">
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   required
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className="w-full border-b border-neutral-400 px-1 py-2 text-[15px] bg-transparent outline-none focus:border-black transition"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
// //                 >
// //                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
// //                 </button>
// //               </div>
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full mt-6 bg-black text-white py-3 text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition"
// //             >
// //               {mode === "login" ? "Sign in" : "Create account"}
// //               <ArrowRight size={14} />
// //             </button>
// //           </form>

// //           {/* switch */}
// //           <div className="mt-8 text-[14px] text-neutral-600">
// //             {mode === "login" ? (
// //               <>
// //                 Don’t have an account?{" "}
// //                 <button
// //                   onClick={() => setMode("signup")}
// //                   className="text-black underline"
// //                 >
// //                   Sign up
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 Already have an account?{" "}
// //                 <button
// //                   onClick={() => setMode("login")}
// //                   className="text-black underline"
// //                 >
// //                   Sign in
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Auth;


// import React, { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { ArrowRight, Eye, EyeOff } from "lucide-react";
// import { toast } from "sonner";

// const Auth = () => {
//   const [mode, setMode] = useState<"login" | "signup">("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { session } = useAuth();

//   useEffect(() => {
//     if (session) navigate("/dashboard");
//   }, [session]);

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === "signup") {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: { data: { username } },
//         });
//         if (error) throw error;
//         toast.success("Account created");
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;
//         navigate("/dashboard");
//       }
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-white text-black">

//       {/* LEFT PANEL */}
//       <div className="hidden lg:flex w-1/2 relative bg-[#0e0e0e] text-white overflow-hidden">

//         {/* noise */}
//         <div
//           className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
//           style={{
//             backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
//           }}
//         />

//         {/* grid */}
//         <div
//           className="absolute inset-0 opacity-[0.06]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
//             `,
//             backgroundSize: "48px 48px",
//           }}
//         />

//         <div className="relative z-10 p-20 flex flex-col justify-between h-full">

//           <div>
//             <p className="text-[11px] tracking-[0.2em] opacity-40 mb-6">
//               FIG. AUTH
//             </p>

//             <h1 className="text-[64px] leading-[1.05] font-semibold tracking-[-0.02em]">
//               FORMS,{" "}
//               <span className="italic text-indigo-400 font-serif">
//                 THOUGHTFULLY
//               </span>
//               <br />
//               BUILT FOR TEAMS.
//             </h1>

//             <p className="mt-6 text-sm opacity-50 max-w-md">
//               AI-powered forms with real-time analytics, branching logic,
//               and team collaboration.
//             </p>
//           </div>

//           <div className="space-y-3 text-sm opacity-50">
//             <p>01 — AI Forge — describe and generate</p>
//             <p>02 — Real-time response analytics</p>
//             <p>03 — Branching logic & quiz mode</p>
//             <p>04 — Domain-locked sharing & embeds</p>
//           </div>

//           <div className="text-xs opacity-30">
//             AQORA SYSTEMS • 2026
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative">

//         {/* subtle dots */}
//         <div
//           className="absolute inset-0 opacity-[0.03] pointer-events-none"
//           style={{
//             backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
//             backgroundSize: "18px 18px",
//           }}
//         />

//         <div className="w-full max-w-md border border-neutral-300 bg-white p-10 relative z-10">

//           {/* header */}
//           <h2 className="text-[28px] font-semibold tracking-tight">
//             {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
//             <span className="text-blue-500">.</span>
//           </h2>

//           <p className="text-sm text-neutral-500 mt-2 mb-6">
//             {mode === "login"
//               ? "Sign in to continue to your dashboard."
//               : "Start building forms for your team."}
//           </p>

//           {/* google */}
//           {/* <button className="w-full border border-neutral-300 py-3 text-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition">
//             Continue with Google
//           </button>

//           <p className="text-[10px] text-center text-neutral-400 my-4 tracking-wide">
//             OR CONTINUE WITH EMAIL
//           </p> */}

//           {/* form */}
//           <form onSubmit={handleAuth} className="space-y-5">

//             {mode === "signup" && (
//               <div>
//                 <label className="text-[11px] tracking-wide text-neutral-500 mb-1 block uppercase">
//                   Username
//                 </label>
//                 <input
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black transition"
//                 />
//               </div>
//             )}

//             <div>
//               <label className="text-[11px] tracking-wide text-neutral-500 mb-1 block uppercase">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black transition"
//               />
//             </div>

//             <div>
//               <label className="text-[11px] tracking-wide text-neutral-500 mb-1 block uppercase">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black transition"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-black text-white py-3 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
//             >
//               {mode === "login" ? "Sign in" : "Create account"}
//               <ArrowRight size={14} />
//             </button>
//           </form>

//           {/* switch */}
//           <div className="mt-6 text-center text-sm text-neutral-500">
//             {mode === "login" ? (
//               <>
//                 Don’t have an account?{" "}
//                 <button
//                   onClick={() => setMode("signup")}
//                   className="text-black underline"
//                 >
//                   Sign up
//                 </button>
//               </>
//             ) : (
//               <>
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => setMode("login")}
//                   className="text-black underline"
//                 >
//                   Sign in
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;



import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

const HorizontalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'h-10 w-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-y border-[#d4d4d4]',
      className,
    )}
  />
);

const VerticalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-10 h-full bg-[repeating-linear-gradient(315deg,_#d4d4d4_0px,_#d4d4d4_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-[#d4d4d4]',
      className,
    )}
  />
);

const HorizontalScaleDark = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'h-10 w-full bg-[repeating-linear-gradient(315deg,_rgba(255,255,255,0.08)_0px,_rgba(255,255,255,0.08)_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-y border-white/10',
      className,
    )}
  />
);

const VerticalScaleDark = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-10 h-full bg-[repeating-linear-gradient(315deg,_rgba(255,255,255,0.08)_0px,_rgba(255,255,255,0.08)_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px] border-x border-white/10',
      className,
    )}
  />
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/40 mb-1.5">
    {children}
  </p>
);

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && session) navigate('/dashboard');
  }, [session, authLoading, navigate]);

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Google sign-in failed.';
      toast.error(msg, { className: 'font-mono text-xs uppercase' });
      setGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error('Display name is required.');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, avatar_url: 'user' } },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            username,
            avatar_url: 'user',
            updated_at: new Date().toISOString(),
          });
        }
        toast.success('Account created. Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back.');
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      if (err.message?.includes('rate limit') || err.status === 429) {
        toast.error('Too many attempts — please wait a moment.', {
          icon: <AlertTriangle className="w-4 h-4" />,
        });
      } else {
        toast.error(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">

      <div className="hidden lg:flex w-[52%] bg-[#0e0e0e] flex-col relative overflow-hidden">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <VerticalScaleDark className="absolute inset-y-0 left-0 pointer-events-none" />
        <VerticalScaleDark className="absolute inset-y-0 right-0 pointer-events-none" />

        <HorizontalScaleDark />

        <div className="flex-1 flex flex-col px-16 py-14 relative z-10">

          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group mb-auto w-fit"
          >
            <span className="text-white font-semibold text-[15px] tracking-tight group-hover:text-accent transition-colors">
              aqora
            </span>
          </Link>

          <div className="mt-16 mb-12">
            <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-white/30 mb-5">
              FIG.AUTH
            </p>
            <h1 className="text-[52px] font-semibold text-white leading-[1.05] tracking-[-0.03em]">
              Forms,{' '}
              <em
                className="not-italic"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  color: 'hsl(226 80% 70%)',
                }}
              >
                thoughtfully
              </em>
              <br />built for teams.
            </h1>
            <p className="mt-6 text-[15px] text-white/40 leading-relaxed max-w-xs">
              AI-powered forms with real-time analytics, branching logic, and team collaboration.
            </p>
          </div>

          <HorizontalScaleDark className="mb-10" />

          <div className="space-y-0">
            {[
              ['01', 'AI Forge — describe and generate'],
              ['02', 'Real-time response analytics'],
              ['03', 'Branching logic & quiz mode'],
              ['04', 'Domain-locked sharing & embeds'],
            ].map(([n, label]) => (
              <div
                key={n}
                className="flex items-center gap-4 py-3.5 border-b border-white/[0.06]"
              >
                <span className="text-[10px] font-mono text-accent/70 w-5 shrink-0">{n}</span>
                <div className="w-px h-3.5 bg-white/15 shrink-0" />
                <span className="text-[13px] text-white/50 font-sans">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <HorizontalScaleDark />
      </div>

      <div className="hidden lg:block w-px bg-black/10 shrink-0" />

      <div className="flex-1 bg-[#F0F0F0] flex flex-col relative overflow-y-auto min-h-screen">

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <VerticalScale className="fixed inset-y-0 left-[52%] z-0 pointer-events-none hidden lg:block" />

        <HorizontalScale />

        <nav className="relative z-10 border-b border-black/10 bg-[#F0F0F0]">
          <div className="px-10 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white" aria-hidden>
                  <path d="M3 13L8 3l5 10H3z" fill="currentColor" />
                </svg>
              </div>
              <span className="font-semibold text-[14px] tracking-tight">aqora</span>
            </Link>
            <div className="hidden lg:block" />

            <p className="text-[10px] font-mono uppercase tracking-widest text-black/30">
              {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-14">
          <div className="w-full max-w-[500px]">

            <div className="mb-10">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-black/30 mb-4">
                {mode === 'login' ? 'Authentication' : 'Registration'}
              </p>
              <h2 className="text-[44px] font-semibold tracking-[-0.035em] leading-[1.02] text-foreground">
                {mode === 'login' ? (
                  <>Welcome back<span className="text-accent">.</span></>
                ) : (
                  <>Get started<span className="text-accent">.</span></>
                )}
              </h2>
              <p className="mt-3 text-[15px] text-black/40 leading-relaxed">
                {mode === 'login'
                  ? 'Sign in to continue to your dashboard.'
                  : 'Create your account — it only takes a moment.'}
              </p>
            </div>

            {/* <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-black/12 rounded-xl px-5 py-4 text-[15px] font-medium text-foreground hover:bg-black/[0.025] hover:border-black/20 transition-all disabled:opacity-50 shadow-sm mb-6"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button> */}

            {/* <div className="flex items-center gap-4 mb-7">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-black/30">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-black/10" />
            </div> */}

            <form onSubmit={handleAuth} className="space-y-5">

              {mode === 'signup' && (
                <div>
                  <FieldLabel>Display name</FieldLabel>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={mode === 'signup'}
                    placeholder="Your name"
                    className="w-full bg-white border border-black/12 rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-black/25 shadow-sm"
                  />
                </div>
              )}

              <div>
                <FieldLabel>Email address</FieldLabel>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white border border-black/12 rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-black/25 shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>Password</FieldLabel>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] font-mono uppercase tracking-wider text-black/35 hover:text-accent transition-colors underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-black/12 rounded-xl px-4 py-3.5 pr-12 text-[15px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-black/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="mt-2 text-[11px] font-mono text-black/30 uppercase tracking-wider">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-foreground text-background rounded-xl px-5 py-4 text-[15px] font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="my-8 h-px bg-black/8" />

            <div className="flex items-center justify-center gap-2">
              <span className="text-[13px] text-black/40">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-[13px] font-semibold text-foreground hover:text-accent transition-colors underline underline-offset-2"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] text-black/25 leading-relaxed">
              By continuing you agree to our{' '}
              <Link to="/terms" className="underline hover:text-black/50 transition-colors">
                Terms
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline hover:text-black/50 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <HorizontalScale />
          <div className="px-10 py-4 flex items-center justify-between border-t border-black/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/25">
              Secure · Encrypted · Private
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/25">
              Aqora Systems © 2026
            </span>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
};

export default Auth;
