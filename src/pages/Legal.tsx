import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

const TERMS_POINTS = [
  "Acceptance of Terms: By accessing Aqora, you agree to be bound by these Terms of Service.",
  "Service Description: Aqora provides a platform for building and publishing web forms.",
  "Account Responsibility: You are responsible for maintaining the security of your local storage and form data.",
  "User Conduct: You agree not to use Aqora for any illegal or unauthorized purposes.",
  "Intellectual Property: Aqora owns the platform code, design, and branding.",
  "User Content: You retain ownership of the data collected through your forms.",
  "Data Hosting: Aqora currently operates as a client-side focused application with local storage persistence.",
  "No Warranty: Aqora is provided 'as is' without any express or implied warranties.",
  "Limitation of Liability: Aqora is not liable for data loss or service interruptions.",
  "Service Availability: We do not guarantee 100% uptime or permanent data availability.",
  "Termination: We reserve the right to modify or terminate the service for any reason.",
  "Privacy Integration: Usage of the service implies agreement with our Privacy Policy.",
  "Age Requirement: Users must be at least 13 years of age to use the platform.",
  "Spam Policy: Creation of forms for spam or phishing purposes is strictly prohibited.",
  "Automation: Automated access (bots) to the platform is restricted unless authorized.",
  "API Usage: If applicable, API usage must follow documented rate limits and guidelines.",
  "Third-Party Links: We are not responsible for content on external sites linked via forms.",
  "Governing Law: These terms are governed by the laws of our operating jurisdiction.",
  "Fair Use: High-volume usage may be subject to review or throttling.",
  "Open Source: Some components of Aqora may be subject to open-source licenses.",
  "Logo Usage: Aqora trademarks may not be used without explicit permission.",
  "Feedback: Any feedback provided may be used by Aqora without compensation.",
  "Confidentiality: You must respect the confidentiality of any non-public info shared.",
  "Indemnification: You agree to indemnify Aqora from claims related to your form usage.",
  "No Agency: No partnership or agency relationship is created by using Aqora.",
  "Entire Agreement: These terms constitute the whole agreement between you and Aqora.",
  "Severability: If any point is found invalid, others remain in full force.",
  "Waiver: Failure to enforce a point is not a waiver of future enforcement.",
  "Changes to Terms: We may update these terms at any time via significant site updates.",
  "Force Majeure: Aqora is not liable for failures due to circumstances beyond control.",
  "Export Control: You must comply with all international export and trade laws.",
  "Accessibility: We strive for accessibility but do not guarantee full compliance.",
  "Beta Testing: Beta features are provided for testing only and may be unstable.",
  "Form Retention: Aqora does not currently offer a server-side archival service.",
  "Export Data: Users are encouraged to export their data frequently to CSV.",
  "Anonymous Access: Anonymous modes are subject to additional moderation.",
  "Theme Overrides: Custom CSS must not interfere with core platform functionality.",
  "Encryption: While we use standard practices, absolute security isn't guaranteed.",
  "Sub-processors: We may use third-party services to deliver core functionality.",
  "Public Exposure: Public forms are viewable by anyone with the link.",
  "Reporting Violations: Users should report any malicious forms to Aqora support.",
  "Local Laws: You must comply with your local laws regarding data collection.",
  "Contact: Legal inquiries can be directed to legal@Aqora.com.",
  "Survival: Certain terms (IP, Liability) survive termination of service.",
  "No Personal Advice: Legal info provided here is for informational purposes only.",
  "Experimental Features: Experimental components may change or disappear.",
  "Branding: Aqora branding must remain visible on free-tier forms.",
  "Storage Limits: Client-side storage is limited by your browser's quota.",
  "Browser Compatibility: Optimal performance requires modern evergreen browsers.",
  "Final Agreement: Usage of Aqora constitutes your final acceptance of these points."
];

const PRIVACY_POINTS = [
  "Data Collection: We collect only the data necessary to provide form building services.",
  "Local Storage: Most form configuration data is stored locally in your browser.",
  "Cookies: We use essential cookies to manage your session and preferences.",
  "Analytics: We may use anonymized analytics to improve platform performance.",
  "No Selling: We do not sell your personal data or form response data to third parties.",
  "Data Usage: Data collected is used solely for the operation of the Aqora platform.",
  "Transparency: We aim to be clear about what data is collected and why.",
  "Respondent Privacy: You are responsible for the privacy of your form respondents.",
  "Anonymous Responses: Anonymous mode strips identifying IP and metadata headers.",
  "Data Retention: Locally stored data remains until cleared by the user.",
  "Third-Party SDKs: We may use icons or fonts from Google or Lucide repositories.",
  "Social Sharing: Social sharing features may involve data cookies from those platforms.",
  "Log Files: Basic server logs may be kept for security and debugging purposes.",
  "PII Protection: We do not intentionally collect sensitive PII unless provided in forms.",
  "GDPR Compliance: We strive to follow GDPR principles of data minimization.",
  "CCPA Rights: California residents have specific rights regarding data access.",
  "User Control: You can delete your forms and data at any time from the dashboard.",
  "Data Security: We implement standard browser-level encryption for all traffic.",
  "Breach Notification: In case of a major data breach, we will notify users on the site.",
  "International Data: Data may be processed in jurisdictions outside your own.",
  "Marketing Emails: We only send marketing info if you explicitly opt-in.",
  "Opt-out: You can opt-out of non-essential analytics and communications.",
  "Child Privacy: We do not knowingly collect data from children under 13.",
  "Encrypted Storage: Form results are stored securely on our cloud infrastructure.",
  "Encryption at Rest: All server-side data is encrypted using industry standards.",
  "HTTPS: All traffic to and from Aqora is forced over secure HTTPS connections.",
  "IP Addresses: We may mask IP addresses in analytics to protect user identity.",
  "Advertising: We do not display third-party advertisements on the platform.",
  "Tracking: We do not use cross-site tracking pixels or intrusive fingerprinting.",
  "Data Portability: High-fidelity CSV export is available for all response data.",
  "Right to Access: You can request an export of any meta-data we hold.",
  "Right to Rectification: Users can update their profile info via the dashboard.",
  "Right to Erasure: Permanent deletion of all account data is supported.",
  "Compliance: We cooperate with legal authorities when required by law.",
  "Internal Access: Access to user data is limited to essential technical staff.",
  "Audits: We perform regular internal reviews of data security practices.",
  "Sub-processors: Our hosting providers (Vercel/Neon) are industry leaders in security.",
  "Form Expiry: Users can set custom expiry dates to automatically stop data flow.",
  "SSL Certificates: We maintain valid SSL certs to ensure trust and security.",
  "Sensitive Scopes: We only request browser permissions necessary for form features.",
  "Offline Mode: Basic editing is supported offline to minimize data transmission.",
  "Policy Updates: Significant changes to privacy will be highlighted on the dashboard.",
  "Contact Privacy: Inquiries regarding privacy can be sent to privacy@Aqora.com.",
  "Aggregated Data: We may use aggregated, non-PII data for industry reports.",
  "Device Info: We collect basic device type and browser info for compatibility.",
  "Session Persistence: Session tokens are stored securely to prevent hijacking.",
  "CSRF Protection: We implement tokens to prevent cross-site request forgery.",
  "Incident Response: We have established protocols for responding to security issues.",
  "Community Standards: Privacy violations in forms will lead to immediate suspension.",
  "Consent: Continued use of the platform constitutes ongoing consent to this policy."
];

const Legal = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'security'>('terms');

  useEffect(() => {
    const path = location.pathname.substring(1);
    if (['privacy', 'terms', 'security'].includes(path)) {
      setActiveTab(path as any);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
        {/* NAV */}
        <nav className="border-b-2 border-foreground fixed top-0 w-full bg-background z-50">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link to="/" className="text-2xl font-black tracking-widest uppercase flex items-center gap-2">
              <ChevronLeft className="h-6 w-6" /> Aqora<span className="text-accent">.</span>
            </Link>
            <div className="hidden md:flex gap-8">
              {(['terms', 'privacy', 'security'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-foreground/40 hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="pt-32 pb-24 container mx-auto px-4 max-w-5xl">
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">
              {activeTab === 'terms' && 'TERMS OF SERVICE'}
              {activeTab === 'privacy' && 'PRIVACY POLICY'}
              {activeTab === 'security' && 'SECURITY INFO'}
              <span className="text-accent">.</span>
            </h1>
            <p className="text-xl font-bold text-foreground/60 uppercase max-w-2xl leading-tight border-l-4 border-foreground pl-6">
              Last Updated: February 2026. These documents outline the bold rules and raw security standards that power Aqora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Sidebar nav for mobile */}
            <div className="md:col-span-1 border-2 border-foreground p-6 bg-accent/5 h-fit sticky top-32">
              <span className="text-[10px] font-black uppercase text-accent tracking-widest block mb-6">NAVIGATION</span>
              <div className="flex flex-col gap-4">
                {(['terms', 'privacy', 'security'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-between group p-3 border-2 transition-all ${
                      activeTab === tab 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'border-transparent hover:border-foreground/20'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{tab}</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${activeTab === tab ? 'translate-x-1' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="md:col-span-3">
              {activeTab === 'terms' && (
                <div className="space-y-4">
                  {TERMS_POINTS.map((point, i) => (
                    <div key={i} className="flex gap-6 p-6 border-brutal hover:bg-accent/5 transition-colors group">
                      <span className="text-base font-black opacity-20 group-hover:opacity-100 transition-opacity">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="font-bold text-sm leading-relaxed uppercase tracking-tight">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  {PRIVACY_POINTS.map((point, i) => (
                    <div key={i} className="flex gap-6 p-6 border-brutal hover:bg-accent/5 transition-colors group">
                      <span className="text-base font-black opacity-20 group-hover:opacity-100 transition-opacity">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="font-bold text-sm leading-relaxed uppercase tracking-tight">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-12">
                  <div className="p-10 border-brutal-4 bg-accent text-accent-foreground shadow-brutal-lg">
                    <Shield className="h-12 w-12 mb-6" />
                    <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">DATA PROTECTION</h2>
                    <p className="font-bold text-lg leading-tight uppercase italic opacity-90">
                      Standard industry encryption meets brutalist simplicity. We protect your data as if it were our own.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: Lock, title: "HTTPS EVERYWHERE", desc: "All traffic is wrapped in 256-bit TLS encryption. No exceptions." },
                      { icon: FileText, title: "DATA ISOLATION", desc: "Your forms and results are logically isolated at the database level." },
                      { icon: Shield, title: "REGULAR AUDITS", desc: "We perform weekly security sweeps throughout our infrastructure." },
                      { icon: Lock, title: "SECURE LOCALSTORAGE", desc: "Local keys are entropy-hardened to prevent easy extraction." },
                    ].map((item, i) => (
                      <div key={i} className="p-8 border-brutal hover:translate-x-1 hover:translate-y-1 transition-all">
                        <item.icon className="h-8 w-8 mb-4 text-accent" />
                        <h3 className="text-lg font-black uppercase mb-2 leading-none">{item.title}</h3>
                        <p className="text-xs font-bold opacity-60 uppercase italic">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-foreground text-background p-10 border-brutal">
                    <h3 className="text-xl font-black uppercase mb-6 tracking-widest italic">THE SECURITY PROMISE</h3>
                    <div className="space-y-6">
                      <p className="text-sm font-bold uppercase leading-relaxed">
                        Aqora is built on a foundation of transparency. We don't hide behind complex legalese. Our security infrastructure is built using the same principles as our design: bold, raw, and highly effective.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-6">
                        {["SOC2 READY", "GDPR COMPLIANT", "PII PROTECTED", "SCALABLE ARCH"].map(badge => (
                          <div key={badge} className="px-4 py-2 border-2 border-background text-[10px] font-black tracking-widest">
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default Legal;
