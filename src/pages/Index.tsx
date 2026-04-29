import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Zap, Sparkles, LayoutTemplate, Share2, CheckCircle2 } from 'lucide-react';
import { SterlingGateKineticNavigation } from '@/components/ui/sterling-gate-kinetic-navigation';
import Footer from '@/components/Footer';

const features = [
  { 
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    title: 'AI-Powered Generation', 
    desc: 'Describe your objective and let our neural engine generate complete forms in seconds.'
  },
  { 
    icon: <LayoutTemplate className="w-5 h-5 text-indigo-500" />,
    title: 'Beautiful Themes', 
    desc: 'Choose from minimal, aesthetic themes that make your surveys a joy to complete.'
  },
  { 
    icon: <Shield className="w-5 h-5 text-emerald-500" />,
    title: 'Enterprise Security', 
    desc: 'End-to-end encryption and domain-level access controls keep your data safe.'
  },
  { 
    icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
    title: 'Real-time Analytics', 
    desc: 'Watch responses arrive instantly and analyze them with beautiful, interactive graphs.'
  },
  { 
    icon: <Share2 className="w-5 h-5 text-rose-500" />,
    title: 'Smart Distribution', 
    desc: 'Share your forms across multiple channels with optimized metadata and previews.'
  },
  { 
    icon: <Zap className="w-5 h-5 text-cyan-500" />,
    title: 'Advanced Logic', 
    desc: 'Create complex, branching pathways based on user responses with zero code.'
  },
];

export default function Index() {
  const [statsData, setStatsData] = useState({ forms: 12000, responses: 1400000 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [forms, responses] = await Promise.all([
          supabase.from('forms').select('*', { count: 'exact', head: true }),
          supabase.from('responses').select('*', { count: 'exact', head: true }),
        ]);
        setStatsData({
          forms: forms.count || 12000,
          responses: responses.count || 1400000,
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();

    const channel = supabase
      .channel('homepage-stats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forms' }, () => fetchStats())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses' }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <SterlingGateKineticNavigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Repeating Scale Lines & Grid Patterns */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Main Scale Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          {/* Major Scale Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              Revox 2.0 is now live
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-zinc-400" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-zinc-900 dark:text-white leading-[1.05]">
              Forms made <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                effortlessly beautiful.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Design minimal, high-converting forms and surveys. Gather insights with real-time analytics, advanced logic, and an interface your users will love.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto h-12 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium shadow-lg shadow-zinc-900/10 hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Start building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/learn-more"
                className="w-full sm:w-auto h-12 px-8 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center"
              >
                View examples
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard/Illustration Preview */}
        <div className="container mx-auto px-4 md:px-6 mt-24 relative z-10">
          <div className="max-w-5xl mx-auto relative">
            {/* Decoration blobs behind the image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur-2xl opacity-20 dark:opacity-30"></div>
            
            <div className="rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-2xl p-2 md:p-4">
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                {/* Browser Chrome */}
                <div className="h-12 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center px-4 gap-4 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 flex items-center gap-2 shadow-sm font-medium w-64 justify-center">
                      <Shield className="w-3 h-3" /> forms.revox.io
                    </div>
                  </div>
                </div>
                {/* Mock UI Body */}
                <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 bg-white dark:bg-zinc-950">
                  <div className="flex-1 space-y-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight mb-2">Product Feedback</h3>
                      <p className="text-zinc-500 text-lg">Help us improve by sharing your thoughts.</p>
                    </div>
                    
                    <div className="space-y-6 pt-4">
                      {/* Rating Component */}
                      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                        <p className="text-base font-medium mb-4">How satisfied are you with our service?</p>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-sm">
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Active Input Component */}
                      <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-50/30 dark:bg-blue-500/5 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] relative">
                        <div className="absolute -top-3 right-4 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">Active</div>
                        <p className="text-base font-medium mb-4 text-zinc-900 dark:text-zinc-100">What features should we build next?</p>
                        <div className="w-full h-28 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-inner">
                          <div className="w-1/2 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3"></div>
                          <div className="w-1/3 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3"></div>
                          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mt-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Analytics Sidebar - The Graph */}
                  <div className="w-full lg:w-80 space-y-6">
                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <p className="text-sm text-zinc-500 font-medium mb-2">Total Responses</p>
                      <h4 className="text-4xl font-bold tracking-tight">12,482</h4>
                      <div className="mt-8 flex items-end gap-2 h-24">
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-t-md relative group overflow-hidden">
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-blue-500 dark:bg-blue-500 rounded-t-md transition-all duration-1000 ease-out" 
                              style={{ height: `${h}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                        <span>Mon</span>
                        <span>Sun</span>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
                       <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
                      <p className="text-sm text-zinc-500 font-medium mb-6">Completion Rate</p>
                      <div className="relative w-36 h-36 mx-auto">
                        <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                          <path
                            className="text-zinc-100 dark:text-zinc-900"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-500"
                            strokeWidth="3.5"
                            strokeDasharray="84, 100"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">84%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/20 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for scale. Designed for speed.</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Powerful features hidden behind a minimal, intuitive interface.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 overflow-hidden relative border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Trusted by modern teams.</h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                From simple contact forms to complex multi-step surveys, Revox scales with your needs while maintaining a premium aesthetic.
              </p>
              <ul className="space-y-5">
                {[
                  'Zero-code visual builder with real-time preview',
                  'Custom domains and brand identity controls',
                  'Webhooks, API access, and native integrations',
                  'Collaborative workspaces for entire teams'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-lg text-zinc-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
              {/* Decorative grid behind stats */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -m-6 z-0"></div>
              
              <div className="relative z-10 p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center shadow-xl shadow-zinc-200/20 dark:shadow-none">
                <h4 className="text-5xl font-bold tracking-tighter text-blue-600 dark:text-blue-400 mb-3">{(statsData.forms / 1000).toFixed(0)}k+</h4>
                <p className="text-base font-medium text-zinc-500">Forms Created</p>
              </div>
              <div className="relative z-10 p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center shadow-xl shadow-zinc-200/20 dark:shadow-none translate-y-12">
                <h4 className="text-5xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400 mb-3">{(statsData.responses / 1000000).toFixed(1)}M+</h4>
                <p className="text-base font-medium text-zinc-500">Responses Collected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-950"></div>
        {/* Subtle grid on dark bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">Ready to build better forms?</h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of users who have upgraded their data collection experience.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center h-14 px-10 bg-white text-zinc-900 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Get started for free
            </Link>
            <p className="mt-6 text-sm text-zinc-500 font-medium">No credit card required. Free forever plan available.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}