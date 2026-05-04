import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/* ---------- SCALE COMPONENTS ---------- */
const HorizontalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "h-10 w-full bg-[repeating-linear-gradient(315deg,_#e5e5e5_0px,_#e5e5e5_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]",
      className
    )}
  />
);

const VerticalScale = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "w-10 h-full bg-[repeating-linear-gradient(315deg,_#e5e5e5_0px,_#e5e5e5_1px,_transparent_1px,_transparent_10px)] bg-[length:14px_14px]",
      className
    )}
  />
);

/* ---------- HEX BACKGROUND LAYER ---------- */
const HexBackground = () => (
  <>
    {/* GRID */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(#e5e5e5 1px, transparent 1px),
          linear-gradient(90deg, #e5e5e5 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        opacity: 0.4,
      }}
    />

    {/* NOISE */}
    <div
      className="absolute inset-0 mix-blend-multiply"
      style={{
        opacity: 0.03,
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence baseFrequency=\"0.8\" numOctaves=\"3\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
      }}
    />

    {/* GRADIENT LIGHT */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05), transparent 40%)",
      }}
    />
  </>
);

/* ---------- PAGE ---------- */
const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-[#fafaf9] text-foreground overflow-hidden">

      {/* SIDE SCALES */}
      <VerticalScale className="absolute left-0 top-0" />
      <VerticalScale className="absolute right-0 top-0" />

      {/* HEADER */}
      <nav className="border-b border-black/10 sticky top-0 bg-[#fafaf9]/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-sm opacity-70 hover:opacity-100">
            ← Home
          </Link>
          <div className="font-semibold">About Aqora</div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">

        {/* HERO */}
        <section className="py-28 border-b border-black/10 relative overflow-hidden">
          <HorizontalScale className="absolute top-0 left-0" />
          <HexBackground />

          <div className="relative">
            <h1 className="text-[56px] md:text-[72px] leading-[1.05] tracking-[-0.04em] font-semibold max-w-3xl">
              Built for teams <br />
              who think in systems.
            </h1>

            <p className="mt-8 text-lg max-w-2xl text-muted-foreground">
              Aqora isn’t just a form builder. It’s a structured way to collect,
              understand, and act on information — without noise, without friction.
            </p>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="py-24 border-b border-black/10">
          <h2 className="text-3xl font-semibold mb-16">
            Core principles
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Clarity over clutter",
                desc: "Every input, flow, and output is intentional.",
              },
              {
                title: "Data, not decoration",
                desc: "Forms should produce insight, not just visuals.",
              },
              {
                title: "Ownership by default",
                desc: "Your data stays yours — always.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-xs uppercase opacity-40 mb-3">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM */}
        <section className="py-24 border-b border-black/10">
          <h2 className="text-3xl font-semibold mb-16">
            The system
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              ["Input Layer", "Structured form creation with logic."],
              ["Processing Layer", "Organized and filtered responses."],
              ["Intelligence Layer", "AI extracts patterns and insights."],
              ["Output Layer", "Dashboards and reports ready to act."],
            ].map(([title, desc], i) => (
              <div key={i} className="p-6 border border-black/10 rounded-xl bg-white">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HEX STYLE FEATURE SECTION */}
        <section className="relative py-32 border-b border-black/10 overflow-hidden">
          <HorizontalScale className="absolute top-0 left-0" />
          <HexBackground />

          <div className="relative max-w-4xl">
            <h2 className="text-[48px] font-semibold tracking-[-0.03em]">
              From input to insight — instantly.
            </h2>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Aqora transforms raw responses into structured intelligence.
              What used to take hours now happens automatically.
            </p>
          </div>
        </section>

        {/* EVOLUTION */}
        <section className="py-24 border-b border-black/10">
          <h2 className="text-3xl font-semibold mb-16">
            Evolution
          </h2>

          <div className="space-y-8">
            {[
              ["2025", "Foundation — rethink forms."],
              ["Early 2026", "Builder + workflows launched."],
              ["2026", "AI insights and analytics added."],
            ].map(([year, text], i) => (
              <div key={i} className="flex gap-6">
                <div className="w-24 opacity-50">{year}</div>
                <div>{text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        {/* <section className="py-24 border-b border-black/10">
          <h2 className="text-3xl font-semibold mb-16">
            Team
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              ["Yatharth Khandelwal", "Frontend & UI/UX"],
              ["Khanak Jain", "Frontend Developer"],
              ["Sayed Al Amaan", "Backend Developer"],
              ["Mansha Agarwal", "AI & Intelligence"],
            ].map(([name, role], i) => (
              <div key={i} className="p-6 border border-black/10 rounded-xl bg-white">
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* DIFFERENT */}
        <section className="py-24 border-b border-black/10">
          <h2 className="text-3xl font-semibold mb-10">
            What makes Aqora different
          </h2>

          <ul className="space-y-3 text-muted-foreground">
            <li>Built for product teams</li>
            <li>Insight-first, not form-first</li>
            <li>System-driven architecture</li>
            <li>AI-native from day one</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Talk to the team.
          </h2>

          <p className="text-muted-foreground mb-8">
            We’d love to hear what you’re building.
          </p>

          <a
            href="mailto:hello@aqora.build"
            className="px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            hello@aqora.build
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;