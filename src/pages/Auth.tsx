
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Skull, Fingerprint, Ghost, Bot, Pizza, Zap, Crown, User, AlertTriangle, Box, Link as LinkIcon, CheckCheck, Info } from 'lucide-react';

const FUNNY_LOADING_MESSAGES = [
  "Hacking the mainframe...",
  "Stealing your cookies...",
  "Consulting the oracle...",
  "Generating fake credentials...",
  "Deleting system32...",
  "Mining crypto on your GPU...",
  "Ping 999ms...",
  "Breaching firewalls...",
  "Downloading RAM...",
  "Establishing neural handshake..."
];

const AVATARS = [
  { id: 'user', icon: <User className="w-6 h-6" />, label: 'USER' },
  { id: 'ghost', icon: <Ghost className="w-6 h-6" />, label: 'GHOST' },
  { id: 'bot', icon: <Bot className="w-6 h-6" />, label: 'BOT' },
  { id: 'skull', icon: <Skull className="w-6 h-6" />, label: 'SKULL' },
  { id: 'pizza', icon: <Pizza className="w-6 h-6" />, label: 'PIZZA' },
  { id: 'zap', icon: <Zap className="w-6 h-6" />, label: 'ZAP' },
  { id: 'crown', icon: <Crown className="w-6 h-6" />, label: 'KING' },
];

import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(FUNNY_LOADING_MESSAGES[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsg(FUNNY_LOADING_MESSAGES[Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
            throw new Error("WE NEED A NAME, AGENT.");
        }
        
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

        // Manually update profile to ensure data consistency
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                username: username,
                avatar_url: avatar,
                updated_at: new Date().toISOString(),
            });
        }

        toast.success('Mission accomplished. Check your email & spam folder to confirm extraction.', {
          icon: <Skull className="h-4 w-4" />,
          className: "font-black uppercase border-4 border-black"
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Access granted. Welcome to the void.', {
          className: "font-black uppercase border-4 border-black"
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.message?.includes('rate limit') || error.status === 429) {
          toast.error("SYSTEM OVERLOAD.", {
              description: "You're spamming the mainframe. Chill out for a minute.",
              className: "font-black uppercase border-4 border-[#FF4500] text-[#FF4500]",
              icon: <AlertTriangle className="w-5 h-5" />
          });
      } else {
          toast.error(error.message || 'System rejection.', {
            className: "font-black uppercase border-4 border-red-500 text-red-500"
          });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background flex font-mono overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {/* LEFT SIDE - VISUAL CHAOS */}
      <div className="hidden lg:flex w-1/2 relative bg-black text-white flex-col justify-between p-12 overflow-hidden border-r-8 border-foreground">
        
        {/* Animated Background Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
          }} 
        />
        
        {/* Dots at intersections */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '20px 20px',
                transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
            }}
        />

        <div className="relative z-10">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
            DATA<br />
            IS THE<br />
            <span className="text-[#FF4500]">NEW OIL</span>.
          </h1>
          <div className="mt-8 border-l-4 border-[#FF4500] pl-6 py-2">
            <p className="text-xl font-bold uppercase tracking-widest opacity-80">
              "WE ARE THE DRILL."
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 text-[#FF4500]">
            <span className="font-bold uppercase tracking-[0.2em] text-sm typing-effect">
              SECURE CONNECTION: UNVERIFIED
            </span>
          </div>
          <div className="p-6 border-4 border-white/20 bg-white/5 backdrop-blur-sm transform transition-transform duration-300">
            <p className="text-xs font-bold uppercase leading-relaxed opacity-60">
              WARNING: UNAUTHORIZED ACCESS WILL BE MET WITH EXTREME PREJUDICE. 
              YOUR IP ADDRESS HAS BEEN LOGGED, PRINTED, AND FAXED TO THE FBI. 
              (NOT REALLY, BUT BEHAVE).
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - THE FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F0F0F0] relative overflow-y-auto">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="w-full max-w-md bg-white p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 my-auto">
          <div className="mb-10 text-center relative">
            <div className="w-24 h-24 bg-black mx-auto mb-6 flex items-center justify-center rotate-3 transition-transform duration-500 border-4 border-black overflow-hidden relative group">
              {/* LIVE PREVIEW */}
              {mode === 'signup' ? (
                avatar && avatarMode === 'preset' ? (
                  <div className="scale-150 text-white">
                     {AVATARS.find(a => a.id === avatar)?.icon}
                  </div>
                ) : avatar && avatarMode === 'custom' ? (
                   <img 
                      src={avatar} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                         (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + username;
                      }}
                   />
                ) : (
                   <User className="text-white w-12 h-12" />
                )
              ) : (
                 <Fingerprint className="text-white w-10 h-10" />
              )}
              
              {mode === 'signup' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[8px] font-black uppercase text-white tracking-widest text-center px-1">
                        YOUR<br/>FACE
                    </span>
                </div>
              )}
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
              {mode === 'login' ? 'IDENTIFY' : 'INITIATE'}
            </h2>
            <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
              {mode === 'login' ? 'NO BOTS ALLOWED' : 'JOIN THE RESISTANCE'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            
            {mode === 'signup' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#FF4500] transition-colors">
                    CODENAME <span className="text-xs opacity-50 lowercase">(unique identifier)</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all placeholder:opacity-20 placeholder:uppercase"
                    placeholder="NEO_1337"
                  />
                </div>

                {/* AVATAR SELECTION */}
                <div className="space-y-4 bg-gray-50 p-6 border-4 border-dashed border-gray-300">
                  <label className="text-xs font-black uppercase tracking-widest block mb-4">SELECT AVATAR</label>
                  
                  {/* Avatar Preview */}
                  <div className="flex items-center gap-4 p-4 border-4 border-black bg-accent/5">
                    <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-brutal">
                      {avatar && avatarMode === 'preset' ? (
                        <div className="w-8 h-8">{AVATARS.find(a => a.id === avatar)?.icon}</div>
                      ) : avatar && avatarMode === 'custom' ? (
                        <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase mb-1">Current Avatar</p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        {avatarMode === 'preset' ? 'PRESET ICON' : 'CUSTOM URL'}
                      </p>
                    </div>
                  </div>

                  {/* Tab Selection */}
                  <div className="flex border-4 border-black">
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMode('preset');
                        setAvatar(AVATARS[0].id);
                      }}
                      className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                        avatarMode === 'preset'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-accent/10'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Box className="w-4 h-4" />
                        PRESET ICONS
                      </div>
                    </button>
                    <div className="w-[4px] bg-black"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMode('custom');
                        setAvatar('');
                      }}
                      className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                        avatarMode === 'custom'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-accent/10'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        CUSTOM URL
                      </div>
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="border-4 border-black p-6 bg-white min-h-[180px]">
                    {avatarMode === 'preset' ? (
                      // PRESET ICONS VIEW
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">CHOOSE FROM {AVATARS.length} PRESET ICONS</h4>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {AVATARS.map((av) => (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => setAvatar(av.id)}
                              className={`aspect-square p-3 border-4 transition-all group relative ${
                                avatar === av.id
                                  ? 'border-black bg-black text-white shadow-brutal scale-95'
                                  : 'border-gray-300 hover:border-black bg-white text-black hover:shadow-brutal hover:scale-105'
                              }`}
                              title={av.label}
                            >
                              <div className="w-full h-full flex items-center justify-center">{av.icon}</div>
                              {avatar === av.id && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent border-2 border-black flex items-center justify-center">
                                  <CheckCheck className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground mt-4 text-center">
                          CLICK ANY ICON TO SELECT • ALL ICONS ARE OPTIMIZED
                        </p>
                      </div>
                    ) : (
                      // CUSTOM URL VIEW
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">ENTER CUSTOM IMAGE URL</h4>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full bg-[#F5F5F5] border-4 border-black p-4 font-bold outline-none focus:border-accent text-sm"
                            placeholder="https://example.com/avatar.jpg"
                          />
                          <div className="bg-accent/5 border-2 border-black p-4">
                            <p className="text-[9px] font-black uppercase mb-2 flex items-center gap-2">
                              <Info className="w-3 h-3" />
                              IMPORTANT NOTES:
                            </p>
                            <ul className="text-[9px] font-bold space-y-1 ml-5 list-disc">
                              <li>USE DIRECT IMAGE URLs (ENDING IN .JPG, .PNG, .GIF, .WEBP)</li>
                              <li>RECOMMENDED SIZE: 256X256 PIXELS OR LARGER</li>
                              <li>ENSURE THE URL IS PUBLICLY ACCESSIBLE</li>
                              <li>SQUARE IMAGES WORK BEST</li>
                            </ul>
                          </div>
                          {avatar && (
                            <div className="border-4 border-black p-4 bg-background">
                              <p className="text-[9px] font-black uppercase mb-3">PREVIEW:</p>
                              <div className="flex justify-center">
                                <div className="w-24 h-24 border-4 border-black overflow-hidden">
                                  <img 
                                    src={avatar} 
                                    alt="Custom avatar preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-black">INVALID URL</div>';
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#FF4500] transition-colors">
                YOUR EMAIL <span className="text-xs opacity-50 lowercase">(the real one)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all placeholder:opacity-20 placeholder:uppercase"
                placeholder="human@example.com"
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest group-focus-within:text-[#FF4500] transition-colors">
                  SECRET CODE
                </label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[10px] font-bold uppercase underline hover:text-black transition-colors"
                  >
                    FORGOT? CLICK ME, IDIOT.
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#F5F5F5] border-4 border-black p-4 text-lg font-bold outline-none focus:bg-[#FF4500]/10 focus:border-[#FF4500] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 hover:text-[#FF4500]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white relative overflow-hidden group border-2 border-black hover:bg-white hover:text-black transition-all"
            >
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              
              <div className="relative z-10 py-5 text-base md:text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 group-hover:text-black text-white transition-colors">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">{loadingMsg}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 w-full">
                    <div className="relative overflow-hidden h-7 flex-1 text-center flex items-center justify-center">
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full whitespace-nowrap">
                        {mode === 'login' ? 'ENTER THE VOID' : 'START PROTOCOL'}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 whitespace-nowrap">
                        {mode === 'login' ? 'LETS GO' : 'JOIN US'}
                      </span>
                    </div>

                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                  </div>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t-4 border-black/10">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-4">
              {mode === 'login' ? 'FRESH MEAT?' : 'ALREADY INFILTRATED?'}
            </p>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setUsername('');
              }}
              className="inline-block border-2 border-black bg-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              {mode === 'login' ? 'CREATE IDENTITY' : 'ACCESS TERMINAL'}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 text-[10px] font-black uppercase opacity-20">
          SECURE SECTOR 7G • AQORA SYSTEMS © 2026
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
