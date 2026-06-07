import { useState, FormEvent } from 'react';
import { 
  Activity, ArrowRight, ShieldCheck, Heart, Users, Sparkles, Check, 
  Mail, MessageSquare, Phone, MapPin, Building, Globe, Zap, Database, Smartphone 
} from 'lucide-react';

interface LandingPageProps {
  onLaunchPortal: () => void;
}

export default function LandingPage({ onLaunchPortal }: LandingPageProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1200);
  };

  const testimonials = [
    {
      id: 1,
      quote: "MediCore AI has transformed our practice operations. By automating patient triaging and medical reports, we saw a 42% reduction in administrative times in just 3 months.",
      author: "Dr. Sarah Lindahl, MD",
      role: "SVP, Lindahl Medical Consortium (24 Clinics)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: 2,
      quote: "Enterprise-grade safety paired with a fluid, modern interface. Our physicians love the integrated prescription engine and real-time medical timeline views.",
      author: "Marcus Rivera",
      role: "Chief Nursing Officer, MetroHealth Hospital Systems",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const features = [
    {
      icon: <Activity className="h-5 w-5 text-indigo-500" />,
      title: "Real-time AI Diagnostics",
      desc: "Advanced triaging engine and LLM scan analysis using clinical parameters to support quick treatment selections."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-indigo-500" />,
      title: "Stateful EMR Security",
      desc: "HIPAA-compliant data pipes with End-to-End Encryption safeguarding patient charts, scans, and telehealth data."
    },
    {
      icon: <Zap className="h-5 w-5 text-indigo-500" />,
      title: "Instant Smart Prescriptions",
      desc: "Automated generation, checking for clinical contradictions, and secure digital signatures linked directly to pharmacies."
    },
    {
      icon: <Database className="h-5 w-5 text-indigo-500" />,
      title: "Consolidated Medical Timelines",
      desc: "Unify external blood work, past laboratory results, and visual reports into one chronological, filterable workspace."
    },
    {
      icon: <Smartphone className="h-5 w-5 text-indigo-500" />,
      title: "Unified Virtual Stream Rooms",
      desc: "High-resolution virtual consultations complete with integrated real-time text logs, vitals check sidebar, and status tools."
    },
    {
      icon: <Globe className="h-5 w-5 text-indigo-500" />,
      title: "Automated Notifications",
      desc: "SMS scheduling alerts, predictive health bulletins, and SMTP notifications synchronized with live databases."
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-indigo-550 selection:text-white">
      {/* Super Header Banner */}
      <div className="bg-indigo-650/40 border-b border-indigo-500/20 text-center py-1.8 text-[11px] font-mono tracking-widest uppercase text-indigo-200">
        ⚡ ANNOUNCING MEDICORE AI ENTERPRISE 3.0 &bull; CLINIC SUITE ARCHITECTURE FOR MULTI-LOCATION PROVIDERS
      </div>

      {/* Hero Menu */}
      <nav className="border-b border-slate-850 bg-slate-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl text-white font-black flex items-center justify-center">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1 opacity-100 select-all">
                MediCore AI <span className="bg-indigo-500 text-white text-[9px] font-mono px-1 py-0.2 rounded font-black uppercase">SaaS</span>
              </span>
              <span className="text-[9px] text-[#f8fafc] font-mono tracking-wider block font-black leading-none opacity-100 select-all">Enterprise Healthcare Intelligence Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-200 font-bold">
            <a href="#overview" className="hover:text-indigo-400 transition">Product Overview</a>
            <a href="#features" className="hover:text-indigo-400 transition">Core Features</a>
            <a href="#testimonials" className="hover:text-indigo-400 transition">Clinical Success</a>
            <a href="#pricing" className="hover:text-indigo-400 transition">Pricing Plans</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Request Platform Briefing</a>
          </div>

          <div>
            <button
              onClick={onLaunchPortal}
              className="bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md shadow-indigo-600/10 active:scale-95"
            >
              <span>Launch Live System Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative pt-12 md:pt-24 pb-16 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800">
        {/* Glow ambient effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-950 border border-indigo-805 px-3 py-1 rounded-full text-[10px] font-mono text-indigo-400 font-semibold shadow-xs">
            <Sparkles className="h-3 w-3 text-indigo-400 animate-spin" />
            <span>VENTURE-BACKED MEDICAL INTELLIGENCE SUITE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Enterprise Telehealth Platform <br/>
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Powering Modern Systems</span>
          </h1>

          <p className="text-xs md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Consolidate clinical analytics, HIPAA-compliant patient communication channels, dynamic prescription signing, and AI-assisted predictive diagnostics in one secure, unified SaaS application.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onLaunchPortal}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-550 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <span>Explore Interactive Platform Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#contact"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs md:text-sm font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-1"
            >
              <span>Schedule Enterprise Tour</span>
            </a>
          </div>

          {/* Core Telemetry Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 text-left">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden">
              <span className="text-2xl font-extrabold text-white block">98.4%</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">Triage Accuracy</span>
              <span className="text-[9px] text-slate-400 block mt-1">Validated across clinical trials</span>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden">
              <span className="text-2xl font-extrabold text-white block">42 min</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">Daily Time Saved</span>
              <span className="text-[9px] text-slate-400 block mt-1">Per clinical physician logged</span>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden">
              <span className="text-2xl font-extrabold text-indigo-400 block">E2EE</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">HIPAA & SOC-2</span>
              <span className="text-[9px] text-slate-400 block mt-1">Enterprise-grade guardrails</span>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden">
              <span className="text-2xl font-extrabold text-white block">99.98%</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">SLA Platform Uptime</span>
              <span className="text-[9px] text-slate-400 block mt-1">Zero-downtime micro-clusters</span>
            </div>
          </div>
        </div>

        {/* Visual Mockup Showcase Container */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-2xl relative">
            <div className="absolute top-6 left-6 flex items-center gap-1.5 z-10 bg-indigo-950/80 border border-indigo-900 px-2.5 py-1 rounded-full text-[9px] font-mono text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE SAAS WORKSPACE MODEL PREVIEW</span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 bg-slate-900 flex items-center justify-center p-8 group cursor-pointer" onClick={onLaunchPortal}>
              {/* Fake dashboard visuals inside landing */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200')] opacity-15 mix-blend-overlay transition group-hover:scale-105 duration-700"></div>
              
              {/* Mock Dashboard Widgets Grid Overlay */}
              <div className="w-full h-full relative z-10 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs">
                  <div className="w-24 h-4 bg-slate-800 rounded-md"></div>
                  <div className="flex gap-2">
                    <span className="w-12 h-4 bg-indigo-650 font-bold text-[8px] flex items-center justify-center text-white rounded">ADMIN SUITE</span>
                    <span className="w-12 h-4 bg-slate-800 rounded"></span>
                  </div>
                </div>

                <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-4 bg-indigo-600/90 text-white rounded-full shadow-lg group-hover:scale-110 transition duration-300">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <h3 className="text-white font-extrabold text-sm md:text-xl">Launch Live Portal Systems</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 max-w-sm">Experience the patient diaries, doctor console, executive analytics metrics, and AI predictions in real-time.</p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>SSL SECURED PIPES</span>
                  <span>SYSTEM PORT: 3000 CONSOLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800 relative">
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-black">HIGH RESOLUTION TECHNOLOGY</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Consolidated Features for Modern Care</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Everything required to run clean, efficient clinical workflows and expand care access across regions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, id) => (
              <div key={id} className="p-5 bg-slate-950 border border-slate-805 rounded-2xl space-y-3 shadow-xs hover:border-slate-700 transition duration-300">
                <div className="p-2.5 bg-indigo-950/60 rounded-xl text-indigo-400 inline-block">
                  {feat.icon}
                </div>
                <h3 className="font-extrabold text-white text-xs md:text-sm">{feat.title}</h3>
                <p className="text-[10.5px] md:text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">TRUSTED BY CLINICAL PRACTITIONERS</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Validated by Healthcare Leaders</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
              Read how clinics and hospitals leverage MediCore AI to unify triage workflows and telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="p-6 bg-slate-900 border border-slate-800/80 rounded-2xl space-y-4 shadow-sm relative">
                {/* Visual quote mark */}
                <span className="text-6xl text-indigo-500/10 font-bold font-serif absolute top-2 right-4 pointer-events-none">&ldquo;</span>
                <p className="text-xs md:text-sm text-slate-350 italic leading-relaxed relative z-10 font-medium">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img src={t.avatar} alt={t.author} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">{t.author}</span>
                    <span className="text-[10px] text-slate-400 block">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-black">SAAS BILLING MATRIX</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Predictable Enterprise Pricing Plans</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
              Select the optimal Tier with full EMR security, patient dashboards, and high API allowances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-4xl mx-auto">
            {/* Starter Option */}
            <div className="p-6 bg-slate-950 border border-slate-805 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold inline-block mb-1">Starter Clinic</span>
                  <h3 className="text-white text-base font-extrabold">Professional Standard</h3>
                  <p className="text-[10px] text-slate-500">Perfect for private practices with up to 3 doctors.</p>
                </div>
                <div className="border-y border-slate-800/60 py-3.5">
                  <span className="text-3xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-slate-500"> / clinic / month</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-400">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Unified Patient Portal</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Dynamic Prescription Builder</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Integrated Video consultation</li>
                  <li className="flex items-center gap-1.5 text-slate-600"><Check className="h-3.5 w-3.5 text-slate-600 shrink-0" /> Predictive AI Triage Analytics</li>
                </ul>
              </div>
              <button onClick={onLaunchPortal} className="w-full bg-slate-800 text-white font-bold hover:bg-slate-755 text-xs py-2 rounded-xl transition cursor-pointer">
                Launch Portal Standard
              </button>
            </div>

            {/* Growth Option - Highlighted */}
            <div className="p-6 bg-slate-950 border-2 border-indigo-650 rounded-2xl relative flex flex-col justify-between space-y-6 shadow-xl">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-550 border border-indigo-500/40 text-white font-mono font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-mono bg-indigo-950/80 border border-indigo-900 px-2 py-0.5 rounded text-indigo-400 font-bold inline-block mb-1">Clinic Growth</span>
                  <h3 className="text-white text-base font-extrabold">Advanced Multi-Clinic</h3>
                  <p className="text-[10px] text-slate-500">Optimized for groups with up to 15 doctors.</p>
                </div>
                <div className="border-y border-slate-800/60 py-3.5">
                  <span className="text-3xl font-extrabold text-indigo-400">$299</span>
                  <span className="text-xs text-slate-450"> / clinic / month</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-350">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Everything inside Standard Plan</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Predictive AI Diagnostics Triage</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Consolidated Medical History Logs</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> SMS & Call Notifications Gateways</li>
                </ul>
              </div>
              <button onClick={onLaunchPortal} className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/10">
                Launch Portal Advanced
              </button>
            </div>

            {/* Enterprise Option */}
            <div className="p-6 bg-slate-950 border border-slate-805 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold inline-block mb-1">Hospital Enterprise</span>
                  <h3 className="text-white text-base font-extrabold">Executive System</h3>
                  <p className="text-[10px] text-slate-500">For multi-location hospital nodes with custom needs.</p>
                </div>
                <div className="border-y border-slate-800/60 py-3.5 text-white font-bold text-xl">
                  <span>Custom Quote</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-400">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Unlimited Practitioners</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Customized HL7 Integration APIs</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Dedicated SLA Account Manager</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Multi-region Backup Databases</li>
                </ul>
              </div>
              <a href="#contact" className="w-full text-center bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold text-xs py-2 rounded-xl transition block">
                Contact Executive Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions FAQ inside landing */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Our answers to typical security and integration questions.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is MediCore AI HIPAA-compliant?",
                a: "Absolutely. MediCore AI executes direct cryptographic encryption across all active pipes. All patient medical summaries, prescription databases, and chat messages run on validated secure channels conforming seamlessly to HIPAA and SOC2 regulations."
              },
              {
                q: "Can the predictive AI triage engine replace a clinical doctor?",
                a: "No. The predictive AI triage indexes of MediCore AI are constructed as clinical decision-support guides only. All calculated alerts and diagnoses must always be evaluated and signed of by a certified clinical practitioner."
              },
              {
                q: "How does the custom database synchronization process work?",
                a: "The portal uses synchronized polling to query high-performance enterprise healthcare databases via clean full-stack REST routes, enabling fluid micro-updates on scheduled visits, medical logs, and laboratory summaries."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs md:text-sm font-bold text-white hover:bg-slate-800/50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-indigo-400 font-extrabold">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 block uppercase font-bold">REACH OUT TO OUR SALES TEAM</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Let's Upgrade Your System</h2>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Connect with a medical integration specialist to custom configure MediCore AI for your clinics, customize telemetry feeds, or set up secure databases.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-800 bg-slate-950 rounded-lg text-indigo-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">General Inquiries</span>
                    <span className="text-white">integrations@medicore.ai</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-800 bg-slate-950 rounded-lg text-indigo-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Sales Hot-line</span>
                    <span className="text-white">+1 (800) 843-2569</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-800 bg-slate-950 rounded-lg text-indigo-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Global HQ</span>
                    <span className="text-white">402 Pine Street, Suite 500, Seattle, WA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-805 shadow-xl">
              {contactSubmitted ? (
                <div className="text-center p-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-white font-extrabold text-base">Request Submitted Successfully!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Thank you. A MediCore AI Integration Advisor has received your parameters and will notify you via email in under 3 hours to schedule an interactive tour.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="text-indigo-450 hover:underline text-xs block mx-auto pt-2"
                  >
                    Send another parameters request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <h3 className="text-white font-extrabold text-base border-b border-slate-800 pb-2">Request Custom System Briefing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Full Representative Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Dr. Jameson, MD"
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Clinical Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. jameson@seattlecardio.com"
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-desc" className="block text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">Your Medical Centers & Requirements</label>
                    <textarea
                      id="contact-desc"
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="e.g., We manage 4 pulmonary clinic branches and are seeking a HIPAA-compliant virtual room platform integrated with lab timelines."
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-indigo-600 text-white font-bold hover:bg-indigo-550 py-3 rounded-lg transition mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {contactLoading ? (
                      <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Submit System Request</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Simple landing footer */}
      <footer className="border-t border-slate-850 py-10 bg-slate-950 text-slate-500 text-center text-xs">
        <p className="font-bold text-slate-400">MediCore AI Technologies, Inc. © 2026</p>
        <p className="text-[9px] text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
          MediCore AI is a registered HIPAA-compliant workflow optimizer. All predictions are generated based on clinical heuristics in real-time. Use only under guidance of licensed physicians. Privacy Policy &bull; Terms of Services &bull; SOC-2 Report v3
        </p>
      </footer>
    </div>
  );
}
