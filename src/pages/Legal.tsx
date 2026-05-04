import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, FileText, Database } from "lucide-react";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/* -----------------------------
   RAW DATA (UNCHANGED)
------------------------------ */

const TERMS_POINTS = [ "Acceptance of Terms: By accessing Aqora, you agree to be bound by these Terms of Service.", 
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
  "Final Agreement: Usage of Aqora constitutes your final acceptance of these points." ];

const PRIVACY_POINTS = ["Data Collection: We collect only the data necessary to provide form building services.", 
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

/* -----------------------------
   HELPERS (NO DATA LOSS)
------------------------------ */

const parsePoints = (points: string[]) =>
  points.map((p) => {
    const [title, ...rest] = p.split(":");
    return {
      title: title.trim(),
      desc: rest.join(":").trim(),
    };
  });

/* -----------------------------
   GROUPING (LOGICAL, NOT MODIFYING CONTENT)
------------------------------ */

const TERMS_SECTIONS = [
  {
    id: "account",
    title: "Account & Usage",
    filter: [
      "Acceptance of Terms",
      "Service Description",
      "Account Responsibility",
      "User Conduct",
      "Age Requirement",
      "Automation",
      "API Usage",
      "Spam Policy",
    ],
  },
  {
    id: "data",
    title: "Data & Ownership",
    filter: [
      "User Content",
      "Data Hosting",
      "Public Exposure",
      "Form Retention",
      "Export Data",
    ],
  },
  {
    id: "limits",
    title: "Limitations",
    filter: [
      "No Warranty",
      "Limitation of Liability",
      "Service Availability",
      "Storage Limits",
      "Browser Compatibility",
    ],
  },
  {
    id: "legal",
    title: "Legal Conditions",
    filter: [
      "Termination",
      "Governing Law",
      "Changes to Terms",
      "Severability",
      "Waiver",
      "Entire Agreement",
      "Indemnification",
      "No Agency",
      "Force Majeure",
      "Export Control",
    ],
  },
];

const PRIVACY_SECTIONS = [
  {
    id: "collection",
    title: "Data Collection",
    filter: [
      "Data Collection",
      "Local Storage",
      "Cookies",
      "Analytics",
      "Device Info",
    ],
  },
  {
    id: "usage",
    title: "Usage & Transparency",
    filter: [
      "No Selling",
      "Data Usage",
      "Transparency",
      "Aggregated Data",
      "Advertising",
      "Tracking",
    ],
  },
  {
    id: "rights",
    title: "User Rights",
    filter: [
      "User Control",
      "Right to Access",
      "Right to Rectification",
      "Right to Erasure",
      "Data Portability",
    ],
  },
  {
    id: "security",
    title: "Security & Compliance",
    filter: [
      "Data Security",
      "Encryption at Rest",
      "HTTPS",
      "CSRF Protection",
      "Audits",
      "Compliance",
    ],
  },
];

/* -----------------------------
   COMPONENTS
------------------------------ */

const Card = ({ title, desc, icon: Icon }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 rounded-2xl border border-border/60 bg-white/60 backdrop-blur hover:shadow-md transition"
  >
    {Icon && <Icon className="h-5 w-5 mb-3 text-muted-foreground" />}
    <h3 className="font-medium text-base mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </motion.div>
);

const Section = ({ id, title, children }: any) => (
  <section id={id} className="scroll-mt-32 space-y-6">
    <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
    <div className="grid md:grid-cols-2 gap-6">{children}</div>
  </section>
);

const Sidebar = ({ sections, active }: any) => (
  <div className="sticky top-32 space-y-2">
    {sections.map((s: any) => (
      <a
        key={s.id}
        href={`#${s.id}`}
        className={cn(
          "block px-3 py-2 text-sm rounded-lg transition",
          active === s.id
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {s.title}
      </a>
    ))}
  </div>
);

/* -----------------------------
   MAIN
------------------------------ */

export default function Legal() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState("terms");
  const [activeSection, setActiveSection] = useState("");

  const parsedTerms = parsePoints(TERMS_POINTS);
  const parsedPrivacy = parsePoints(PRIVACY_POINTS);

  const currentSections =
    tab === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  /* URL sync */
  useEffect(() => {
    const path = location.pathname.replace("/", "");
    if (["terms", "privacy", "security"].includes(path)) {
      setTab(path);
    }
  }, [location]);

  /* scroll spy */
  useEffect(() => {
    const handler = () => {
      let current = "";
      currentSections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = s.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [currentSections]);

  /* render helper */
  const renderSection = (section: any, data: any[]) => {
    const filtered = data.filter((item) =>
      section.filter.includes(item.title)
    );

    return (
      <Section key={section.id} id={section.id} title={section.title}>
        {filtered.map((item: any, i: number) => (
          <Card key={i} {...item} />
        ))}
      </Section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <nav className="sticky top-0 border-b backdrop-blur z-50">
        <div className="container flex justify-between py-4">
          <Link to="/" className="text-xl font-semibold">
            aqora.
          </Link>

          <div className="flex gap-6 text-sm">
            {["terms", "privacy", "security"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  navigate(`/${t}`);
                }}
                className={cn(
                  tab === t ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="container text-center pt-24 pb-16 max-w-3xl">
        <h1 className="text-5xl font-semibold mb-6">
          Legal, thoughtfully structured.
        </h1>
        <p className="text-muted-foreground">
          Clear policies for how Aqora works, protects, and handles your data.
        </p>
      </section>

      {/* CONTENT */}
      <main className="container grid md:grid-cols-4 gap-12 pb-24">
        {/* SIDEBAR */}
        <div className="hidden md:block">
          <Sidebar sections={currentSections} active={activeSection} />
        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-16">
          <AnimatePresence mode="wait">
            {tab === "terms" && (
              <motion.div key="terms" className="space-y-16">
                {TERMS_SECTIONS.map((s) =>
                  renderSection(s, parsedTerms)
                )}
              </motion.div>
            )}

            {tab === "privacy" && (
              <motion.div key="privacy" className="space-y-16">
                {PRIVACY_SECTIONS.map((s) =>
                  renderSection(s, parsedPrivacy)
                )}
              </motion.div>
            )}

            {tab === "security" && (
              <motion.div key="security" className="space-y-12">
                <div className="p-10 rounded-3xl bg-muted/40 border">
                  <h2 className="text-2xl font-semibold mb-3">
                    The Security Promise
                  </h2>
                  <p className="text-muted-foreground">
                    Aqora is built with a security-first mindset — from
                    infrastructure to everyday decisions.
                  </p>
                </div>

                <Section id="infra" title="Infrastructure">
                  <Card
                    title="Secure Hosting"
                    desc="Built on modern infrastructure providers."
                    icon={Database}
                  />
                </Section>

                <Section id="encryption" title="Encryption">
                  <Card
                    title="HTTPS Everywhere"
                    desc="All traffic is encrypted."
                    icon={Lock}
                  />
                </Section>

                <Section id="access" title="Access Control">
                  <Card
                    title="Restricted Access"
                    desc="Limited internal access."
                    icon={Shield}
                  />
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}