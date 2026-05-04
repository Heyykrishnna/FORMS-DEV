
// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Eye, EyeOff, ArrowRight, Skull, Fingerprint, Ghost, Bot, Pizza, Zap, Crown, User, AlertTriangle, Box, Link as LinkIcon, CheckCheck, Info } from 'lucide-react';

// const FUNNY_LOADING_MESSAGES = [
//   "Hacking the mainframe...",
//   "Stealing your cookies...",
//   "Consulting the oracle...",
//   "Generating fake credentials...",
//   "Deleting system32...",
//   "Mining crypto on your GPU...",
//   "Ping 999ms...",
//   "Breaching firewalls...",
//   "Downloading RAM...",
//   "Establishing neural handshake..."
// ];

// const AVATARS = [
//   { id: 'user', icon: <User className="w-6 h-6" />, label: 'USER' },
//   { id: 'ghost', icon: <Ghost className="w-6 h-6" />, label: 'GHOST' },
//   { id: 'bot', icon: <Bot className="w-6 h-6" />, label: 'BOT' },
//   { id: 'skull', icon: <Skull className="w-6 h-6" />, label: 'SKULL' },
//   { id: 'pizza', icon: <Pizza className="w-6 h-6" />, label: 'PIZZA' },
//   { id: 'zap', icon: <Zap className="w-6 h-6" />, label: 'ZAP' },
//   { id: 'crown', icon: <Crown className="w-6 h-6" />, label: 'KING' },
// ];

// import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

// const Auth = () => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [avatar, setAvatar] = useState(AVATARS[0].id);
//   const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');
//   const [mode, setMode] = useState<'login' | 'signup'>('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
//   const [loadingMsg, setLoadingMsg] = useState(FUNNY_LOADING_MESSAGES[0]);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const navigate = useNavigate();
//   const { session, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && session) {
//       navigate('/dashboard');
//     }
//   }, [session, authLoading, navigate]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (loading) {
//       interval = setInterval(() => {
//         setLoadingMsg(FUNNY_LOADING_MESSAGES[Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)]);
//       }, 800);
//     }
//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const { clientX, clientY } = e;
//     setMousePos({ x: clientX, y: clientY });
//   };

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === 'signup') {
//         if (!username.trim()) {
//             throw new Error("WE NEED A NAME, AGENT.");
//         }
        
//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               username,
//               avatar_url: avatar,
//             }
//           }
//         });
//         if (error) throw error;

//         // Manually update profile to ensure data consistency
//         if (data.user) {
//             await supabase.from('profiles').upsert({
//                 id: data.user.id,
//                 email: email,
//                 username: username,
//                 avatar_url: avatar,
//                 updated_at: new Date().toISOString(),
//             });
//         }

//         toast.success('Mission accomplished. Check your email & spam folder to confirm extraction.', {
//           icon: <Skull className="h-4 w-4" />,
//           className: "font-black uppercase border-4 border-black"
//         });
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;
//         toast.success('Access granted. Welcome to the void.', {
//           className: "font-black uppercase border-4 border-black"
//         });
//         navigate('/dashboard');
//       }
//     } catch (error: any) {
//       if (error.message?.includes('rate limit') || error.status === 429) {
//           toast.error("SYSTEM OVERLOAD.", {
//               description: "You're spamming the mainframe. Chill out for a minute.",
//               className: "font-black uppercase border-4 border-[#FF4500] text-[#FF4500]",
//               icon: <AlertTriangle className="w-5 h-5" />
//           });
//       } else {
//           toast.error(error.message || 'System rejection.', {
//             className: "font-black uppercase border-4 border-red-500 text-red-500"
//           });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen bg-background flex font-mono overflow-hidden" 
//       onMouseMove={handleMouseMove}
//     >
//       {/* LEFT SIDE - VISUAL CHAOS */}
//       <div className="hidden lg:flex w-1/2 relative bg-black text-white flex-col justify-between p-12 overflow-hidden border-r-8 border-foreground">
        
//         {/* Animated Background Grid */}
//         <div 
//           className="absolute inset-0 pointer-events-none opacity-20" 
//           style={{ 
//             backgroundImage: `
//               linear-gradient(to right, #333 1px, transparent 1px),
//               linear-gradient(to bottom, #333 1px, transparent 1px)
//             `,
//             backgroundSize: '40px 40px',
//             transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
//           }} 
//         />
        
//         {/* Dots at intersections */}
//         <div 
//             className="absolute inset-0 pointer-events-none opacity-40"
//             style={{
//                 backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
//                 backgroundSize: '40px 40px',
//                 backgroundPosition: '20px 20px',
//                 transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
//             }}
//         />

//         <div className="relative z-10">
//           <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
//             DATA<br />
//             IS THE<br />
//             <span className="text-[#FF4500]">NEW OIL</span>.
//           </h1>
//           <div className="mt-8 border-l-4 border-[#FF4500] pl-6 py-2">
//             <p className="text-xl font-bold uppercase tracking-widest opacity-80">
//               "WE ARE THE DRILL."
//             </p>
//           </div>
//         </div>

//         <div className="relative z-10 space-y-4">
//           <div className="flex items-center gap-4 text-[#FF4500]">
//             <span className="font-bold uppercase tracking-[0.2em] text-sm typing-effect">
//               SECURE CONNECTION: UNVERIFIED
//             </span>
//           </div>
//           <div className="p-6 border-4 border-white/20 bg-white/5 backdrop-blur-sm transform transition-transform duration-300">
//             <p className="text-xs font-bold uppercase leading-relaxed opacity-60">
//               WARNING: UNAUTHORIZED ACCESS WILL BE MET WITH EXTREME PREJUDICE. 
//               YOUR IP ADDRESS HAS BEEN LOGGED, PRINTED, AND FAXED TO THE FBI. 
//               (NOT REALLY, BUT BEHAVE).
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE - THE FORM */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F0F0F0] relative overflow-y-auto">
//         {/* Mobile Background Elements */}
//         <div className="lg:hidden absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

//         <div className="w-full max-w-md bg-white p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 my-auto">
//           <div className="mb-10 text-center relative">
//             <div className="w-24 h-24 bg-black mx-auto mb-6 flex items-center justify-center rotate-3 transition-transform duration-500 border-4 border-black overflow-hidden relative group">
//               {/* LIVE PREVIEW */}
//               {mode === 'signup' ? (
//                 avatar && avatarMode === 'preset' ? (
//                   <div className="scale-150 text-white">
//                      {AVATARS.find(a => a.id === avatar)?.icon}
//                   </div>
//                 ) : avatar && avatarMode === 'custom' ? (
//                    <img 
//                       src={avatar} 
//                       alt="Avatar Preview" 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + username;
//                       }}
//                    />
//                 ) : (
//                    <User className="text-white w-12 h-12" />
//                 )
//               ) : (
//                  <Fingerprint className="text-white w-10 h-10" />
//               )}
              
//               {mode === 'signup' && (
//                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                     <span className="text-[8px] font-black uppercase text-white tracking-widest text-center px-1">
//                         YOUR<br/>FACE
//                     </span>
//                 </div>
//               )}
//             </div>
//             <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
//               {mode === 'login' ? 'IDENTIFY' : 'INITIATE'}
//             </h2>
//             <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
//               {mode === 'login' ? 'NO BOTS ALLOWED' : 'JOIN THE RESISTANCE'}
//             </p>
//           </div>

//           <form onSubmit={handleAuth} className="space-y-6">
            
//             {mode === 'signup' && (
//               <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
//                 <div className="space-y-2 group">
//                   <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#FF4500] transition-colors">
//                     CODENAME <span className="text-xs opacity-50 lowercase">(unique identifier)</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required={mode === 'signup'}
//                     className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all placeholder:opacity-20 placeholder:uppercase"
//                     placeholder="NEO_1337"
//                   />
//                 </div>

//                 {/* AVATAR SELECTION */}
//                 <div className="space-y-4 bg-gray-50 p-6 border-4 border-dashed border-gray-300">
//                   <label className="text-xs font-black uppercase tracking-widest block mb-4">SELECT AVATAR</label>
                  
//                   {/* Avatar Preview */}
//                   <div className="flex items-center gap-4 p-4 border-4 border-black bg-accent/5">
//                     <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-brutal">
//                       {avatar && avatarMode === 'preset' ? (
//                         <div className="w-8 h-8">{AVATARS.find(a => a.id === avatar)?.icon}</div>
//                       ) : avatar && avatarMode === 'custom' ? (
//                         <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
//                       ) : (
//                         <User className="w-8 h-8" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-xs font-black uppercase mb-1">Current Avatar</p>
//                       <p className="text-[10px] font-bold uppercase text-muted-foreground">
//                         {avatarMode === 'preset' ? 'PRESET ICON' : 'CUSTOM URL'}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Tab Selection */}
//                   <div className="flex border-4 border-black">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setAvatarMode('preset');
//                         setAvatar(AVATARS[0].id);
//                       }}
//                       className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
//                         avatarMode === 'preset'
//                           ? 'bg-black text-white'
//                           : 'bg-white text-black hover:bg-accent/10'
//                       }`}
//                     >
//                       <div className="flex items-center justify-center gap-2">
//                         <Box className="w-4 h-4" />
//                         PRESET ICONS
//                       </div>
//                     </button>
//                     <div className="w-[4px] bg-black"></div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setAvatarMode('custom');
//                         setAvatar('');
//                       }}
//                       className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
//                         avatarMode === 'custom'
//                           ? 'bg-black text-white'
//                           : 'bg-white text-black hover:bg-accent/10'
//                       }`}
//                     >
//                       <div className="flex items-center justify-center gap-2">
//                         <LinkIcon className="w-4 h-4" />
//                         CUSTOM URL
//                       </div>
//                     </button>
//                   </div>

//                   {/* Content Area */}
//                   <div className="border-4 border-black p-6 bg-white min-h-[180px]">
//                     {avatarMode === 'preset' ? (
//                       // PRESET ICONS VIEW
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">CHOOSE FROM {AVATARS.length} PRESET ICONS</h4>
//                         </div>
//                         <div className="grid grid-cols-4 gap-3">
//                           {AVATARS.map((av) => (
//                             <button
//                               key={av.id}
//                               type="button"
//                               onClick={() => setAvatar(av.id)}
//                               className={`aspect-square p-3 border-4 transition-all group relative ${
//                                 avatar === av.id
//                                   ? 'border-black bg-black text-white shadow-brutal scale-95'
//                                   : 'border-gray-300 hover:border-black bg-white text-black hover:shadow-brutal hover:scale-105'
//                               }`}
//                               title={av.label}
//                             >
//                               <div className="w-full h-full flex items-center justify-center">{av.icon}</div>
//                               {avatar === av.id && (
//                                 <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent border-2 border-black flex items-center justify-center">
//                                   <CheckCheck className="w-3 h-3 text-white" />
//                                 </div>
//                               )}
//                             </button>
//                           ))}
//                         </div>
//                         <p className="text-[9px] font-bold uppercase text-muted-foreground mt-4 text-center">
//                           CLICK ANY ICON TO SELECT • ALL ICONS ARE OPTIMIZED
//                         </p>
//                       </div>
//                     ) : (
//                       // CUSTOM URL VIEW
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">ENTER CUSTOM IMAGE URL</h4>
//                         </div>
//                         <div className="space-y-3">
//                           <input
//                             type="url"
//                             value={avatar}
//                             onChange={(e) => setAvatar(e.target.value)}
//                             className="w-full bg-[#F5F5F5] border-4 border-black p-4 font-bold outline-none focus:border-accent text-sm"
//                             placeholder="https://example.com/avatar.jpg"
//                           />
//                           <div className="bg-accent/5 border-2 border-black p-4">
//                             <p className="text-[9px] font-black uppercase mb-2 flex items-center gap-2">
//                               <Info className="w-3 h-3" />
//                               IMPORTANT NOTES:
//                             </p>
//                             <ul className="text-[9px] font-bold space-y-1 ml-5 list-disc">
//                               <li>USE DIRECT IMAGE URLs (ENDING IN .JPG, .PNG, .GIF, .WEBP)</li>
//                               <li>RECOMMENDED SIZE: 256X256 PIXELS OR LARGER</li>
//                               <li>ENSURE THE URL IS PUBLICLY ACCESSIBLE</li>
//                               <li>SQUARE IMAGES WORK BEST</li>
//                             </ul>
//                           </div>
//                           {avatar && (
//                             <div className="border-4 border-black p-4 bg-background">
//                               <p className="text-[9px] font-black uppercase mb-3">PREVIEW:</p>
//                               <div className="flex justify-center">
//                                 <div className="w-24 h-24 border-4 border-black overflow-hidden">
//                                   <img 
//                                     src={avatar} 
//                                     alt="Custom avatar preview" 
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                       e.currentTarget.style.display = 'none';
//                                       e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-black">INVALID URL</div>';
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2 group">
//               <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#FF4500] transition-colors">
//                 YOUR EMAIL <span className="text-xs opacity-50 lowercase">(the real one)</span>
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all placeholder:opacity-20 placeholder:uppercase"
//                 placeholder="human@example.com"
//               />
//             </div>

//             <div className="space-y-2 group">
//               <div className="flex items-center justify-between">
//                 <label className="text-xs font-black uppercase tracking-widest group-focus-within:text-[#FF4500] transition-colors">
//                   SECRET CODE
//                 </label>
//                 {mode === 'login' && (
//                   <button 
//                     type="button" 
//                     onClick={() => setIsForgotModalOpen(true)}
//                     className="text-[10px] font-bold uppercase underline hover:text-black transition-colors"
//                   >
//                     FORGOT? CLICK ME, IDIOT.
//                   </button>
//                 )}
//               </div>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 hover:text-[#FF4500]"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-black text-white relative overflow-hidden group border-2 border-black hover:bg-white hover:text-black transition-all"
//             >
//               <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              
//               <div className="relative z-10 py-5 text-base md:text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 group-hover:text-black text-white transition-colors">
//                 {loading ? (
//                   <div className="flex items-center gap-2">
//                     <span className="animate-pulse">{loadingMsg}</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center gap-4 w-full">
//                     <div className="relative overflow-hidden h-7 flex-1 text-center flex items-center justify-center">
//                       <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full whitespace-nowrap">
//                         {mode === 'login' ? 'ENTER THE VOID' : 'START PROTOCOL'}
//                       </span>
//                       <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 whitespace-nowrap">
//                         {mode === 'login' ? 'LETS GO' : 'JOIN US'}
//                       </span>
//                     </div>

//                     <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
//                   </div>
//                 )}
//               </div>
//             </button>
//           </form>

//           <div className="mt-8 text-center pt-8 border-t-4 border-black/10">
//             <p className="text-xs font-bold uppercase text-muted-foreground mb-4">
//               {mode === 'login' ? 'FRESH MEAT?' : 'ALREADY INFILTRATED?'}
//             </p>
//             <button
//               onClick={() => {
//                 setMode(mode === 'login' ? 'signup' : 'login');
//                 setUsername('');
//               }}
//               className="inline-block border-2 border-black bg-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
//             >
//               {mode === 'login' ? 'CREATE IDENTITY' : 'ACCESS TERMINAL'}
//             </button>
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="absolute bottom-4 text-[10px] font-black uppercase opacity-20">
//           SECURE SECTOR 7G • AQORA SYSTEMS © 2026
//         </div>
//       </div>
//       <ForgotPasswordModal 
//         isOpen={isForgotModalOpen} 
//         onClose={() => setIsForgotModalOpen(false)} 
//         initialEmail={email}
//       />
//     </div>
//   );
// };

// export default Auth;

// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Eye, EyeOff, ArrowRight, User } from 'lucide-react';
// import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
// import Navbar from '@/components/Navbar';

// const AVATARS = [
//   { id: 'user', icon: <User className="w-5 h-5" />, label: 'USER' },
// ];

// const Auth = () => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [avatar, setAvatar] = useState(AVATARS[0].id);
//   const [mode, setMode] = useState<'login' | 'signup'>('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const { session, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && session) {
//       navigate('/dashboard');
//     }
//   }, [session, authLoading, navigate]);

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === 'signup') {
//         if (!username.trim()) {
//           throw new Error("Username required");
//         }

//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: { username, avatar_url: avatar }
//           }
//         });

//         if (error) throw error;

//         if (data.user) {
//           await supabase.from('profiles').upsert({
//             id: data.user.id,
//             email,
//             username,
//             avatar_url: avatar,
//             updated_at: new Date().toISOString(),
//           });
//         }

//         toast.success('Check your email to confirm.');
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) throw error;

//         navigate('/dashboard');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="hex-theme min-h-screen relative">
      
//       {/* GRID BACKGROUND */}
//       <div className="absolute inset-0 hex-grid opacity-40 pointer-events-none" />

//       <Navbar />

//       <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        
//         {/* HEADER */}
//         <div className="mb-16 max-w-xl">
//           <h1 className="text-[56px] font-semibold tracking-[-0.04em] leading-[1.05]">
//             {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
//           </h1>
//           <p className="mt-4 text-[16px] text-muted-foreground">
//             {mode === 'login'
//               ? 'Sign in to continue building with Aqora.'
//               : 'Start building intelligent forms in minutes.'}
//           </p>
//         </div>

//         {/* FORM CARD */}
//         <div className="max-w-xl">
//           <form
//             onSubmit={handleAuth}
//             className="border hex-line-soft rounded-2xl p-8 bg-white/80 backdrop-blur-md space-y-6"
//           >

//             {/* USERNAME */}
//             {mode === 'signup' && (
//               <div>
//                 <label className="text-[12px] font-medium">Username</label>
//                 <input
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full mt-2 px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   placeholder="yourname"
//                 />
//               </div>
//             )}

//             {/* EMAIL */}
//             <div>
//               <label className="text-[12px] font-medium">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full mt-2 px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 placeholder="you@example.com"
//               />
//             </div>

//             {/* PASSWORD */}
//             <div>
//               <div className="flex justify-between text-[12px]">
//                 <span>Password</span>
//                 {mode === 'login' && (
//                   <button
//                     type="button"
//                     onClick={() => setIsForgotModalOpen(true)}
//                     className="text-indigo-500 hover:underline"
//                   >
//                     Forgot?
//                   </button>
//                 )}
//               </div>

//               <div className="relative mt-2">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3 opacity-60"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* BUTTON */}
//             <button
//               disabled={loading}
//               className="w-full bg-foreground text-background py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
//             >
//               {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
//               <ArrowRight size={16} />
//             </button>

//             {/* SWITCH */}
//             <div className="text-center text-[13px] text-muted-foreground pt-4">
//               {mode === 'login' ? (
//                 <>
//                   New here?{' '}
//                   <button
//                     onClick={() => setMode('signup')}
//                     className="text-foreground font-medium"
//                   >
//                     Create account
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   Already have an account?{' '}
//                   <button
//                     onClick={() => setMode('login')}
//                     className="text-foreground font-medium"
//                   >
//                     Sign in
//                   </button>
//                 </>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       <ForgotPasswordModal
//         isOpen={isForgotModalOpen}
//         onClose={() => setIsForgotModalOpen(false)}
//         initialEmail={email}
//       />
//     </div>
//   );
// };

// export default Auth;


// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Eye, EyeOff, ArrowRight, Skull, Fingerprint, Ghost, Bot, Pizza, Zap, Crown, User, AlertTriangle, Box, Link as LinkIcon, CheckCheck, Info } from 'lucide-react';

// import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

// const FUNNY_LOADING_MESSAGES = [
//   "Hacking the mainframe...",
//   "Stealing your cookies...",
//   "Consulting the oracle...",
//   "Generating fake credentials...",
//   "Deleting system32...",
//   "Mining crypto on your GPU...",
//   "Ping 999ms...",
//   "Breaching firewalls...",
//   "Downloading RAM...",
//   "Establishing neural handshake..."
// ];

// const AVATARS = [
//   { id: 'user', icon: <User className="w-6 h-6" />, label: 'USER' },
//   { id: 'ghost', icon: <Ghost className="w-6 h-6" />, label: 'GHOST' },
//   { id: 'bot', icon: <Bot className="w-6 h-6" />, label: 'BOT' },
//   { id: 'skull', icon: <Skull className="w-6 h-6" />, label: 'SKULL' },
//   { id: 'pizza', icon: <Pizza className="w-6 h-6" />, label: 'PIZZA' },
//   { id: 'zap', icon: <Zap className="w-6 h-6" />, label: 'ZAP' },
//   { id: 'crown', icon: <Crown className="w-6 h-6" />, label: 'KING' },
// ];

// const Auth = () => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [avatar, setAvatar] = useState(AVATARS[0].id);
//   const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');
//   const [mode, setMode] = useState<'login' | 'signup'>('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
//   const [loadingMsg, setLoadingMsg] = useState(FUNNY_LOADING_MESSAGES[0]);

//   const navigate = useNavigate();
//   const { session, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && session) navigate('/dashboard');
//   }, [session, authLoading, navigate]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (loading) {
//       interval = setInterval(() => {
//         setLoadingMsg(FUNNY_LOADING_MESSAGES[Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)]);
//       }, 800);
//     }
//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === 'signup') {
//         if (!username.trim()) throw new Error("WE NEED A NAME, AGENT.");

//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: { username, avatar_url: avatar }
//           }
//         });
//         if (error) throw error;

//         if (data.user) {
//           await supabase.from('profiles').upsert({
//             id: data.user.id,
//             email,
//             username,
//             avatar_url: avatar,
//             updated_at: new Date().toISOString(),
//           });
//         }

//         toast.success('Check your email to confirm.');
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({ email, password });
//         if (error) throw error;
//         toast.success('Welcome back.');
//         navigate('/dashboard');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="hex-theme min-h-screen flex">

//       {/* BACKGROUND */}
//       <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
//       <div className="absolute inset-0 hex-grid-fine opacity-20 pointer-events-none" />

//       {/* LEFT PANEL */}
//       <div className="hidden lg:flex w-1/2 border-r hex-line-soft p-16 flex-col justify-between bg-white/60 backdrop-blur-sm">

//         <div>
//           <h1 className="text-6xl font-semibold leading-tight tracking-tight">
//             Data is the <br />
//             <span className="italic text-accent">interface.</span>
//           </h1>

//           <p className="mt-6 text-sm text-muted-foreground max-w-sm">
//             Authenticate to access AQORA systems and manage your operational workflows.
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="text-xs hex-mono opacity-50">
//             SYSTEM STATUS
//           </div>

//           <div className="border hex-line-soft p-4 bg-white/70">
//             <p className="text-sm text-accent">● Secure connection active</p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

//         <div className="w-full max-w-md hex-card p-10 relative overflow-hidden">

//           <div className="absolute inset-0 hex-grid-fine opacity-[0.05]" />

//           {/* HEADER */}
//           <div className="text-center mb-10">
//             <div className="w-20 h-20 mx-auto mb-4 border hex-line-soft flex items-center justify-center bg-white">
//               {mode === 'signup' ? (
//                 AVATARS.find(a => a.id === avatar)?.icon
//               ) : (
//                 <Fingerprint className="w-8 h-8" />
//               )}
//             </div>

//             <h2 className="text-3xl font-semibold">
//               {mode === 'login' ? 'Sign in' : 'Create account'}
//             </h2>

//             <p className="text-sm text-muted-foreground mt-2">
//               {mode === 'login' ? 'Access your dashboard' : 'Start using AQORA'}
//             </p>
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleAuth} className="space-y-5">

//             {mode === 'signup' && (
//               <input
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Username"
//                 className="w-full border hex-line-soft p-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             )}

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               className="w-full border hex-line-soft p-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 className="w-full border hex-line-soft p-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* BUTTON */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full border hex-line-soft py-3 bg-accent text-white hover:bg-black transition"
//             >
//               {loading ? loadingMsg : mode === 'login' ? 'Sign in' : 'Create account'}
//             </button>

//           </form>

//           {/* SWITCH */}
//           <div className="text-center mt-6 text-sm">
//             {mode === 'login' ? (
//               <button onClick={() => setMode('signup')} className="text-accent">
//                 Create account
//               </button>
//             ) : (
//               <button onClick={() => setMode('login')} className="text-accent">
//                 Already have an account?
//               </button>
//             )}
//           </div>

//         </div>
//       </div>

//       <ForgotPasswordModal
//         isOpen={isForgotModalOpen}
//         onClose={() => setIsForgotModalOpen(false)}
//         initialEmail={email}
//       />
//     </div>
//   );
// };

// export default Auth;



// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   Eye, EyeOff, ArrowRight, Skull, Fingerprint, Ghost, Bot,
//   Pizza, Zap, Crown, User, AlertTriangle, Box,
//   Link as LinkIcon, CheckCheck, Info
// } from 'lucide-react';

// import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

// const FUNNY_LOADING_MESSAGES = [
//   "Hacking the mainframe...",
//   "Stealing your cookies...",
//   "Consulting the oracle...",
//   "Generating fake credentials...",
//   "Deleting system32...",
//   "Mining crypto on your GPU...",
//   "Ping 999ms...",
//   "Breaching firewalls...",
//   "Downloading RAM...",
//   "Establishing neural handshake..."
// ];

// const AVATARS = [
//   { id: 'user', icon: <User className="w-6 h-6" />, label: 'USER' },
//   { id: 'ghost', icon: <Ghost className="w-6 h-6" />, label: 'GHOST' },
//   { id: 'bot', icon: <Bot className="w-6 h-6" />, label: 'BOT' },
//   { id: 'skull', icon: <Skull className="w-6 h-6" />, label: 'SKULL' },
//   { id: 'pizza', icon: <Pizza className="w-6 h-6" />, label: 'PIZZA' },
//   { id: 'zap', icon: <Zap className="w-6 h-6" />, label: 'ZAP' },
//   { id: 'crown', icon: <Crown className="w-6 h-6" />, label: 'KING' },
// ];

// const Auth = () => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [avatar, setAvatar] = useState(AVATARS[0].id);
//   const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');
//   const [mode, setMode] = useState<'login' | 'signup'>('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
//   const [loadingMsg, setLoadingMsg] = useState(FUNNY_LOADING_MESSAGES[0]);

//   const navigate = useNavigate();
//   const { session, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && session) navigate('/dashboard');
//   }, [session, authLoading, navigate]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (loading) {
//       interval = setInterval(() => {
//         setLoadingMsg(
//           FUNNY_LOADING_MESSAGES[
//             Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)
//           ]
//         );
//       }, 800);
//     }
//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === 'signup') {
//         if (!username.trim()) throw new Error("WE NEED A NAME, AGENT.");

//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               username,
//               avatar_url: avatar,
//             },
//           },
//         });
//         if (error) throw error;

//         if (data.user) {
//           await supabase.from('profiles').upsert({
//             id: data.user.id,
//             email,
//             username,
//             avatar_url: avatar,
//             updated_at: new Date().toISOString(),
//           });
//         }

//         toast.success('Check your email to confirm.');
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;

//         toast.success('Welcome back.');
//         navigate('/dashboard');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="hex-theme min-h-screen flex relative overflow-hidden">

//       {/* BACKGROUND */}
//       <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none z-0" />
//       <div className="absolute inset-0 hex-grid-fine opacity-20 pointer-events-none z-0" />

//       {/* CONTENT WRAPPER */}
//       <div className="relative z-10 flex w-full">

//         {/* LEFT PANEL */}
//         <div className="hidden lg:flex w-1/2 relative border-r hex-line-soft overflow-hidden">

//           <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
//           <div className="absolute inset-0 hex-grid-fine opacity-10 pointer-events-none" />

//           <div
//             className="absolute inset-0 pointer-events-none opacity-20"
//             style={{
//               backgroundImage: `repeating-linear-gradient(
//                 135deg,
//                 rgba(0,0,0,0.05) 0px,
//                 rgba(0,0,0,0.05) 1px,
//                 transparent 1px,
//                 transparent 12px
//               )`,
//             }}
//           />

//           {/* FLOATING CARDS */}
//           <div className="absolute top-20 left-16 border hex-line-soft p-6 bg-white/60 backdrop-blur-sm w-[260px]">
//             <p className="hex-mono text-[10px] opacity-50 mb-2">SYSTEM</p>
//             <p className="text-sm font-medium">AUTH MODULE</p>
//           </div>

//           <div className="absolute bottom-20 right-16 border hex-line-soft p-6 bg-white/60 backdrop-blur-sm w-[240px]">
//             <p className="hex-mono text-[10px] opacity-50 mb-2">STATUS</p>
//             <p className="text-sm text-accent">● ACTIVE</p>
//           </div>

//           {/* MAIN TEXT */}
//           <div className="relative z-10 p-16 flex flex-col justify-between w-full">
//             <div>
//               <h1 className="text-6xl font-semibold leading-tight">
//                 Identity is the <br />
//                 <span className="italic text-accent">entry point.</span>
//               </h1>

//               <p className="mt-6 text-sm text-muted-foreground max-w-sm">
//                 Authenticate to access AQORA systems.
//               </p>
//             </div>

//             {/* SIGNAL BAR */}
//             <div>
//               <p className="hex-mono text-[10px] opacity-50 mb-2">
//                 SYSTEM SIGNAL
//               </p>

//               <div className="h-10 border hex-line-soft flex items-end gap-[2px] px-2">
//                 {[...Array(30)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-[2px] bg-accent animate-pulse"
//                     style={{
//                       height: `${Math.random() * 100}%`,
//                       animationDelay: `${i * 0.05}s`,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

//           <div className="w-full max-w-md hex-card p-10 relative z-10">

//             <div className="absolute inset-0 hex-grid-fine opacity-[0.05]" />

//             {/* HEADER */}
//             <div className="text-center mb-8">
//               <div className="w-20 h-20 mx-auto mb-4 border hex-line-soft flex items-center justify-center">
//                 {mode === 'signup'
//                   ? AVATARS.find(a => a.id === avatar)?.icon
//                   : <Fingerprint className="w-8 h-8" />}
//               </div>

//               <h2 className="text-2xl font-semibold">
//                 {mode === 'login' ? 'Sign in' : 'Create account'}
//               </h2>
//             </div>

//             {/* FORM */}
//             <form onSubmit={handleAuth} className="space-y-4">

//               {mode === 'signup' && (
//                 <input
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Username"
//                   className="w-full border hex-line-soft p-3 bg-white focus:ring-2 focus:ring-accent outline-none"
//                 />
//               )}

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 className="w-full border hex-line-soft p-3 bg-white focus:ring-2 focus:ring-accent outline-none"
//               />

//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                   className="w-full border hex-line-soft p-3 bg-white focus:ring-2 focus:ring-accent outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full border hex-line-soft py-3 bg-accent text-white hover:bg-black transition"
//               >
//                 {loading
//                   ? loadingMsg
//                   : mode === 'login'
//                   ? 'Sign in'
//                   : 'Create account'}
//               </button>

//             </form>

//             {/* SWITCH */}
//             <div className="text-center mt-6 text-sm">
//               <button
//                 onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
//                 className="text-accent"
//               >
//                 {mode === 'login'
//                   ? 'Create account'
//                   : 'Already have an account?'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ForgotPasswordModal
//         isOpen={isForgotModalOpen}
//         onClose={() => setIsForgotModalOpen(false)}
//         initialEmail={email}
//       />
//     </div>
//   );
// };

// export default Auth;


import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Eye, EyeOff, ArrowRight, Skull, Fingerprint, Ghost,
  Bot, Pizza, Zap, Crown, User, AlertTriangle,
  Box, Link as LinkIcon, CheckCheck, Info
} from 'lucide-react';

import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

const AVATARS = [
  { id: 'user', icon: <User className="w-6 h-6" />, label: 'USER' },
  { id: 'ghost', icon: <Ghost className="w-6 h-6" />, label: 'GHOST' },
  { id: 'bot', icon: <Bot className="w-6 h-6" />, label: 'BOT' },
  { id: 'skull', icon: <Skull className="w-6 h-6" />, label: 'SKULL' },
  { id: 'pizza', icon: <Pizza className="w-6 h-6" />, label: 'PIZZA' },
  { id: 'zap', icon: <Zap className="w-6 h-6" />, label: 'ZAP' },
  { id: 'crown', icon: <Crown className="w-6 h-6" />, label: 'KING' },
];

const Auth = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!authLoading && session) navigate('/dashboard');
  }, [session, authLoading, navigate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error("Username required");

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              avatar_url: avatar,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            username,
            avatar_url: avatar,
            updated_at: new Date().toISOString(),
          });
        }

        toast.success('Account created. Check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Welcome back');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("AUTH ERROR:", error);
      toast.error(error.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hex-theme min-h-screen flex bg-background relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* GRID BACKGROUND
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 hex-grid-fine opacity-20 pointer-events-none" /> */}
      {/* BACKGROUND SYSTEM */}
<div className="absolute inset-0 pointer-events-none">

  {/* HEX GRID BASE */}
  <div className="absolute inset-0 hex-grid opacity-30" />

  {/* FINE HEX GRID */}
  <div className="absolute inset-0 hex-grid-fine opacity-20" />

  {/* DOTTED MATRIX */}
  <div
    className="absolute inset-0 opacity-[0.08]"
    style={{
      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
      backgroundSize: '18px 18px',
    }}
  />

  {/* DIAGONAL SCAN LINES */}
  <div
    className="absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage: 'repeating-linear-gradient(135deg, #000 0px, #000 1px, transparent 1px, transparent 12px)',
    }}
  />

</div>

      {/* CURSOR GLOW */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.06), transparent 70%)',
          left: mousePos.x - 200,
          top: mousePos.y - 200,
        }}
      />

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative border-r hex-line-soft overflow-hidden">
        <div className="absolute inset-0 hex-grid-fine opacity-40" />

        <div className="relative z-10 flex flex-col justify-center px-32">
          <h1 className="text-8xl font-semibold leading-tight">
            Identity <br />
            <span className="italic text-accent">System</span>
          </h1>

          <p className="mt-6 text-sm opacity-50 max-w-md">
            Secure authentication layer for AQORA platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 relative z-10">

        <div className="w-full max-w-md hex-card p-10 relative">

          <div className="absolute inset-0 hex-grid-fine opacity-[0.05]" />

          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 border hex-line-soft flex items-center justify-center bg-white">
              {mode === 'signup'
                ? <div>{AVATARS.find(a => a.id === avatar)?.icon}</div>
                : <Fingerprint className="w-8 h-8" />}
            </div>

            <h2 className="text-3xl font-semibold">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>

            <p className="text-sm opacity-50 mt-2">
              {mode === 'login' ? 'Access dashboard' : 'Join AQORA'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">

            {mode === 'signup' && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full border hex-line-soft px-4 py-3 bg-white focus:outline-none focus:border-black"
              />
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full border hex-line-soft px-4 py-3 bg-white focus:outline-none focus:border-black"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full border hex-line-soft px-4 py-3 bg-white focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 border hex-line-soft transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black'
              }`}
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </button>

          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setUsername('');
              }}
              className="opacity-50 hover:opacity-100"
            >
              {mode === 'login'
                ? 'Create account'
                : 'Already have an account?'}
            </button>
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
