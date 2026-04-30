import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';
import {
  GeoGlyph,
  FormBuilderMock,
  ResponseFeedMock,
  AnalyticsMock,
  AIPromptMock,
} from '@/components/landing/RevoxMockups';

const LOGOS = ['MERCOR', 'algolia', 'LINEAR', 'RAMP', 'VERCEL', 'SUPABASE', 'CURSOR', 'NOTION'];

const Index = () => {

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.from('forms').select('*', { count: 'exact', head: true });
        if (error) {
          console.log(error);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="hex-theme hex-paper min-h-screen">
      <nav className="sticky top-0 z-50 border-b hex-line-soft backdrop-blur-md" style={{ borderBottomWidth: 1, background: 'rgba(245,243,238,0.85)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[18px] font-semibold tracking-tight">revox</Link>
            <div className="hidden md:flex items-center gap-6 text-[13px]" style={{ color: 'var(--hex-ink-soft)' }}>
              <Link to="/learn-more" className="hover:text-foreground">Platform</Link>
              <Link to="/learn-more" className="hover:text-foreground">Solutions</Link>
              <Link to="/learn-more" className="hover:text-foreground">Enterprise</Link>
              <Link to="/about" className="hover:text-foreground">Resources</Link>
              <Link to="/about" className="hover:text-foreground">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-[13px]" style={{ color: 'var(--hex-ink-soft)' }}>Log in</Link>
            <Link to="/auth" className="hex-btn-primary text-[13px]" style={{ padding: '0.45rem 0.95rem' }}>Get started</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hex-grid pointer-events-none opacity-70" />
        <div className="hex-corner top-6 left-6" style={{ borderRight: 0, borderBottom: 0 }} />
        <div className="hex-corner top-6 right-6" style={{ borderLeft: 0, borderBottom: 0 }} />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-start">
            <div className="max-w-2xl">
              <h1 className="text-[64px] md:text-[84px] font-semibold leading-[0.96] tracking-[-0.04em]">
                Forms, <em className="italic font-normal" style={{ fontFamily: "'Poppins', serif" }}>thoughtfully</em><br />
                built for teams<br />
                that ship.
              </h1>
              <p className="mt-7 text-[17px] max-w-xl leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>
                Revox is the calm form builder for product teams. Capture feedback, run research,
                qualify leads — without the bloat, without the chaos, without leaving your flow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/auth" className="hex-btn-primary">Start building →</Link>
                <Link to="/learn-more" className="hex-btn-ghost">Take the tour</Link>
              </div>
            </div>

            <div className="hidden lg:block pt-4">
              <GeoGlyph />
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 hex-grid-fine opacity-40 pointer-events-none -m-8" />
            <div className="relative grid lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-5"><AIPromptMock /></div>
              <div className="lg:col-span-7 lg:-mt-12"><FormBuilderMock /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y hex-line-soft py-10" style={{ borderTopWidth: 1, borderBottomWidth: 1, background: 'var(--hex-bg-alt)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center hex-mono text-[11px] uppercase tracking-[0.25em] mb-6" style={{ color: 'var(--hex-ink-muted)' }}>
            Trusted by builders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {LOGOS.map((l) => (
              <span key={l} className="text-[15px] font-semibold tracking-wide" style={{ color: 'var(--hex-ink-soft)', opacity: 0.7 }}>{l}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b hex-line-soft" style={{ borderBottomWidth: 1 }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          <div className="p-12 md:p-16 md:border-r hex-line-soft" style={{ borderRightWidth: 1 }}>
            <div className="text-[15px] font-semibold tracking-wide mb-8">MERCOR</div>
            <p className="text-[22px] leading-[1.4] tracking-[-0.01em]">
              &ldquo;If we didn&rsquo;t have Revox, <strong>we&rsquo;d still be wiring up Typeform exports to Slack at 2am</strong>, and shipping research half-blind.&rdquo;
            </p>
            <div className="mt-10 text-center">
              <div className="text-[14px] font-medium">Dhaval P.</div>
              <div className="hex-mono text-[11px] mt-1" style={{ color: 'var(--hex-ink-muted)' }}>Account Lead</div>
            </div>
          </div>
          <div className="p-12 md:p-16">
            <div className="text-[15px] font-semibold tracking-wide mb-8">algolia</div>
            <p className="text-[22px] leading-[1.4] tracking-[-0.01em]">
              &ldquo;Revox is the only form tool we use to ship product surveys. <strong>It makes our research loop 10x faster</strong> and the data is clean by default.&rdquo;
            </p>
            <div className="mt-10 text-center">
              <div className="text-[14px] font-medium">Tom C.</div>
              <div className="hex-mono text-[11px] mt-1" style={{ color: 'var(--hex-ink-muted)' }}>Principal Engineer</div>
            </div>
          </div>
        </div>
      </section>

      <FeatureBlock
        glyph="01"
        chip="Agent observability"
        title={<>AI Forge, for forms <br />you can actually trust.</>}
        body="Describe what you want to learn — Revox builds the questions, picks the right blocks, adds branching, and writes the follow-ups. You stay in the driver's seat; the AI just removes the boring parts."
        cta="Explore AI Forge"
        mock={<AIPromptMock />}
        reverse={false}
      />

      <section className="border-b hex-line-soft py-24 relative overflow-hidden hex-vignette" style={{ borderBottomWidth: 1, background: 'var(--hex-bg-alt)' }}>
        <div className="absolute inset-0 hex-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-5">
                <GeoGlyph />
                <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>FIG.02</span>
              </div>
              <h2 className="text-[40px] font-semibold tracking-[-0.035em] leading-[1.05]">
                Beautiful dashboards, <em className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>for when you want to click around.</em>
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>
                Filter by segment, source, or quarter. Hover any line. Compare any question.
                Your responses become a real dashboard the second they land — no exports, no spreadsheets.
              </p>
              <Link to="/learn-more" className="hex-btn-ghost mt-7">Explore analytics →</Link>
            </div>
            <div><AnalyticsMock /></div>
          </div>
        </div>
      </section>


      <FeatureBlock
        glyph="03"
        chip="The builder"
        title={<>A canvas that <br />stays out of the way.</>}
        body="Sane defaults. No fifty-tab settings panels. Drag a block, write a question, pick a theme — your form is already publishable, accessible, and fast on mobile."
        cta="Open the builder"
        mock={<FormBuilderMock />}
        reverse={false}
      />

      <FeatureBlock
        glyph="04"
        chip="Response stream"
        title={<>Every answer, in <br />one quiet place.</>}
        body="Filter, search, tag, and export. One-response-per-email, domain locks, and password gates are one toggle away — so the data you collect is the data you can trust."
        cta="See response stream"
        mock={<ResponseFeedMock />}
        reverse={true}
      />

      <section className="border-y hex-line-soft py-24 relative" style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
        <div className="absolute inset-0 hex-grid opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-2xl mb-16">
            <h2 className="text-[44px] font-semibold tracking-[-0.035em] leading-[1.05]">
              Three steps. <em className="italic font-normal" style={{ fontFamily: "'Poppins', serif" }}>No ceremony.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'var(--hex-line-strong)' }}>
            {[
              { n: '01', t: 'Describe or build', d: 'Type a prompt or drop blocks on the canvas. You get a working form in under a minute.' },
              { n: '02', t: 'Share anywhere', d: 'A clean link, an embed, a QR code — or scope it to a domain or email allowlist.' },
              { n: '03', t: 'Read the signal', d: 'Live charts, response stream, and CSV export. Loop back to product the same day.' },
            ].map((s) => (
              <div key={s.n} className="p-10" style={{ background: 'var(--hex-bg)' }}>
                <div className="hex-mono text-[11px] tracking-wider mb-6" style={{ color: 'var(--hex-ink-muted)' }}>STEP / {s.n}</div>
                <h3 className="text-[22px] font-semibold mb-3">{s.t}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b hex-line-soft py-28 relative hex-vignette" style={{ borderBottomWidth: 1 }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[360px_1fr] gap-16">
          <div>
            <div className="hex-chip hex-chip-accent mb-5">FAQ</div>
            <h2 className="text-[42px] font-semibold tracking-[-0.035em] leading-[1.05]">
              Questions, <em className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>answered.</em>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>
              The short version of what teams ask us most. Want the long one?
            </p>
            <Link to="/about" className="hex-link mt-5 text-[14px] inline-flex">Talk to the team →</Link>
          </div>
          <div className="border-t hex-line-soft" style={{ borderTopWidth: 1 }}>
            {[
              {
                q: 'How is Revox different from Typeform or Google Forms?',
                a: 'Revox is built for product teams, not marketing teams. You get AI-generated forms, a real response stream, live analytics, branching, quiz mode, and domain-locked sharing — without the agency-level pricing or the survey-tool bloat.',
              },
              {
                q: 'Do my respondents need an account?',
                a: 'No. Forms are public by default. You can optionally require email collection, lock to a domain, set a password, or enable one-response-per-email — each is a single toggle.',
              },
              {
                q: 'How does AI Forge actually work?',
                a: 'Describe what you want to learn in plain English. Revox picks the right blocks, drafts the questions, adds branching where it makes sense, and hands you a working draft you can edit before publishing. You stay in control.',
              },
              {
                q: 'Where is my data stored, and is it secure?',
                a: 'All responses live in an encrypted Postgres database with row-level security. Access is RBAC-controlled, traffic is TLS-only, and we never sell or share your data. SOC 2 ready.',
              },
              {
                q: 'Can I export responses?',
                a: 'Yes — CSV export from any form, plus print-ready response reports. The full API is on the roadmap for teams that want to pipe responses straight into Slack, Notion, or their warehouse.',
              },
              {
                q: 'Is there a free plan?',
                a: 'Yes. Building, sharing, collecting responses, and basic analytics are free. Paid plans unlock higher limits, advanced quiz scoring, team collaboration, and priority support.',
              },
            ].map((f, i) => (
              <details key={i} className="hex-faq-row border-b hex-line-soft px-1" style={{ borderBottomWidth: 1 }}>
                <summary>
                  <span className="flex items-baseline gap-4">
                    <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>0{i + 1}</span>
                    <span className="text-[18px] font-medium leading-snug">{f.q}</span>
                  </span>
                  <span className="hex-faq-icon">+</span>
                </summary>
                <div className="hex-faq-body" style={{ paddingLeft: 'calc(11px + 1rem)' }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureBlock = ({ glyph, title, body, cta, mock, reverse }: {
  glyph: string; chip: string; title: React.ReactNode; body: string; cta: string; mock: React.ReactNode; reverse?: boolean;
}) => (
  <section className="border-b hex-line-soft py-24 relative overflow-hidden" style={{ borderBottomWidth: 1 }}>
    <div className="max-w-7xl mx-auto px-6">
      <div className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-5">
            <GeoGlyph />
            <span className="hex-mono text-[11px] tracking-wider" style={{ color: 'var(--hex-ink-muted)' }}>FIG.{glyph}</span>
          </div>
          <h2 className="text-[40px] font-semibold tracking-[-0.035em] leading-[1.05]">{title}</h2>
          <p className="mt-6 text-[16px] leading-relaxed" style={{ color: 'var(--hex-ink-soft)' }}>{body}</p>
          <Link to="/learn-more" className="hex-btn-ghost mt-7">{cta} →</Link>
        </div>
        <div className="flex justify-center">{mock}</div>
      </div>
    </div>
  </section>
);

export default Index;