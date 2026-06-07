import { useState } from 'react';
import { Brain, Activity, Heart, ShieldAlert, ChevronRight, Sparkles, TrendingUp, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

interface MockRiskProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  vitals: { hr: string; bp: string; ox: string; temp: string };
  metrics: {
    respiratoryRisk: number;
    cardiovascularRisk: number;
    diabeticRisk: number;
    neurologicalRisk: number;
  };
  keyRiskFactors: string[];
  preventativeDirectives: string[];
  aiSummary: string;
}

export default function AiRiskDashboard() {
  const profiles: MockRiskProfile[] = [
    {
      id: "sarah",
      name: "Sarah Jenkins",
      age: 37,
      gender: "Female",
      vitals: { hr: "72 BPM", bp: "118/76 mmHg", ox: "98%", temp: "98.6°F" },
      metrics: {
        respiratoryRisk: 68,
        cardiovascularRisk: 42,
        diabeticRisk: 15,
        neurologicalRisk: 18,
      },
      keyRiskFactors: [
        "History of moderate asthma flare-ups under high allergen indexes.",
        "Mild hypertensive readings during acute occupational stress episodes.",
        "Family genetic indicators for cardiovascular stress."
      ],
      preventativeDirectives: [
        "Deploy continuous smart spirometry logging every 48 hours.",
        "Adjust preventative bronchodilator dosages prior to elevated counts.",
        "Schedule bi-monthly tele-cardio reviews to track blood pressure stability index."
      ],
      aiSummary: "Patient exhibits a high-sensitivity allergen responses. Clinical recommendation indicates proactive spirometer monitoring and allergy immunotherapy mapping to alleviate bronchial inflammation risks."
    },
    {
      id: "alex",
      name: "Alex Carter",
      age: 51,
      gender: "Male",
      vitals: { hr: "78 BPM", bp: "135/88 mmHg", ox: "96%", temp: "98.2°F" },
      metrics: {
        respiratoryRisk: 22,
        cardiovascularRisk: 74,
        diabeticRisk: 82,
        neurologicalRisk: 35,
      },
      keyRiskFactors: [
        "Elevated Fasting Plasma Glucose matching Type 2 Diabetes onset.",
        "Borderline Stage-1 Hypertension with left ventricular strain symptoms.",
        "Sedentary lifestyle indices with elevated BMI."
      ],
      preventativeDirectives: [
        "Instate automated continuous glucose monitoring with SMS hazard warning limits.",
        "Begin low-impact clinical exercise routines under active ECG telemetry.",
        "Shift dietary protocol to strict caloric control and glycemic deceleration guidelines."
      ],
      aiSummary: "Patient demonstrates significant risk parameters for Stage-2 hypertensive shift. Predictive mapping strongly advises real-time lipid reviews and Metformin optimization to prevent arterial calcification progression."
    },
    {
      id: "liam",
      name: "Liam Mitchell",
      age: 29,
      gender: "Male",
      vitals: { hr: "64 BPM", bp: "112/70 mmHg", ox: "99%", temp: "98.4°F" },
      metrics: {
        respiratoryRisk: 30,
        cardiovascularRisk: 12,
        diabeticRisk: 8,
        neurologicalRisk: 5,
      },
      keyRiskFactors: [
        "Seasonal respiratory allergies.",
        "Elevated screen time with frequent blue light exposure.",
        "Otherwise normal physiological biomarkers with no hereditary disease patterns."
      ],
      preventativeDirectives: [
        "Maintain routine annual multi-system profiling.",
        "Incorporate daily high-density hydration and blue light shielding intervals.",
        "Standard allergen avoidance during high pollen seasons."
      ],
      aiSummary: "Overall low risk profile. Continuous telemetry exhibits strong cardiac reserves, stable pulmonary capacities, and optimal metabolic processing values."
    }
  ];

  const [selectedProfile, setSelectedProfile] = useState<MockRiskProfile>(profiles[0]);
  const [recomputing, setRecomputing] = useState(false);

  const handleTriggerRecompute = () => {
    setRecomputing(true);
    setTimeout(() => {
      setRecomputing(false);
    }, 1500);
  };

  const getRiskColor = (percent: number) => {
    if (percent >= 70) return 'text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30';
    if (percent >= 40) return 'text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30';
    return 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30';
  };

  const getRiskProgressColor = (percent: number) => {
    if (percent >= 70) return 'from-rose-500 to-rose-400 shadow-rose-500/10';
    if (percent >= 40) return 'from-amber-500 to-amber-400 shadow-amber-500/10';
    return 'from-emerald-500 to-emerald-400 shadow-emerald-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Risk Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-lg text-white">
                <Brain className="h-4.5 w-4.5" />
              </span>
              <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                Predictive Analytics Engine V4.2
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              MediCore AI Risk & Chronic Disease Forecaster
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Clinical decision support tool displaying aggregated machine learning forecasts. Evaluates historical EMR charts, current vital telemetry, and genetic markers to model patient health trajectory risks.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleTriggerRecompute}
              disabled={recomputing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer transition-all duration-200 shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${recomputing ? 'animate-spin' : ''}`} />
              <span>{recomputing ? "Reindexing Models..." : "Trigger AI Forecast"}</span>
            </button>
          </div>
        </div>

        {/* Live Profiles Selectors */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">Select Profile:</span>
            <div className="flex flex-wrap gap-1.5">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-250 border ${
                    selectedProfile.id === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-705 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{p.name} ({p.age}y/o)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vitals HUD */}
          <div className="flex flex-wrap gap-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-750/70 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <div className="px-2 border-r border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">BP Index</span>
              <span>{selectedProfile.vitals.bp}</span>
            </div>
            <div className="px-2 border-r border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">Heart Rate</span>
              <span>{selectedProfile.vitals.hr}</span>
            </div>
            <div className="px-2">
              <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-bold">Oxygen Sat</span>
              <span className="text-emerald-500">{selectedProfile.vitals.ox}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk meter levels */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white pb-2.5 border-b border-rose-100/50 dark:border-slate-800 font-display flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Predictive Clinical Indicators</span>
            </h3>

            <div className="space-y-4 pt-4">
              {/* Respiratory */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Asthma/Respiratory Potential</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded ${getRiskColor(selectedProfile.metrics.respiratoryRisk)}`}>
                    {selectedProfile.metrics.respiratoryRisk}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedProfile.metrics.respiratoryRisk}%` }}
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getRiskProgressColor(selectedProfile.metrics.respiratoryRisk)}`}
                  ></div>
                </div>
              </div>

              {/* Cardiovascular */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Heart / Cardiovascular Strain</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded ${getRiskColor(selectedProfile.metrics.cardiovascularRisk)}`}>
                    {selectedProfile.metrics.cardiovascularRisk}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedProfile.metrics.cardiovascularRisk}%` }}
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getRiskProgressColor(selectedProfile.metrics.cardiovascularRisk)}`}
                  ></div>
                </div>
              </div>

              {/* Diabetic */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Type-2 Diabetes Deceleration Risk</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded ${getRiskColor(selectedProfile.metrics.diabeticRisk)}`}>
                    {selectedProfile.metrics.diabeticRisk}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedProfile.metrics.diabeticRisk}%` }}
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getRiskProgressColor(selectedProfile.metrics.diabeticRisk)}`}
                  ></div>
                </div>
              </div>

              {/* Neurological */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Cerebral Vascular Strain (Stroke)</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded ${getRiskColor(selectedProfile.metrics.neurologicalRisk)}`}>
                    {selectedProfile.metrics.neurologicalRisk}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedProfile.metrics.neurologicalRisk}%` }}
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getRiskProgressColor(selectedProfile.metrics.neurologicalRisk)}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 dark:bg-amber-400/5 p-3 rounded-xl border border-amber-500/10 dark:border-amber-400/10 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mt-4">
            <span className="font-bold flex items-center gap-1 border-b border-amber-100 dark:border-amber-900/40 pb-1 mb-1">
              <Sparkles className="h-3.5 w-3.5" /> MediCore AI Clinical Foreseer
            </span>
            <span>Real-time vitals and historical electronic records are synthesized to predict dynamic disease spikes within 30-day windows. Adjust preventive clinical plans accordingly.</span>
          </div>
        </div>

        {/* Mid: SVG Disease Risk Map Chart & Scatter */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5 font-display">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span>Risk Severity Index Plot vs Biomarkers Age Co-efficient</span>
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-50 border border-indigo-150 rounded text-indigo-600 uppercase dark:bg-slate-800 dark:text-indigo-400 dark:border-slate-700">
              Interactive Scatter Plot
            </span>
          </div>

          <div className="h-64 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4.5 relative flex flex-col justify-between overflow-hidden">
            <span className="text-[9px] font-mono font-bold text-slate-400 absolute top-3 left-4 uppercase">Predictive Risk Index (Y) vs Chronological Patient Age (X)</span>
            
            {/* SVG scatter and line */}
            <svg className="w-full h-44 mt-4" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
              <line x1="0" y1="25" x2="500" y2="25" stroke="#e2e8f0" strokeDasharray="3,3" className="dark:stroke-slate-800" />
              
              {/* Risk Slope curve */}
              <path
                d="M 50 110 C 150 90, 250 82, 350 48 S 450 15, 500 10"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="4,2"
                className="opacity-75"
              />

              {/* Profiles plotted */}
              {/* Liam plot (low risk) */}
              <g className="cursor-pointer group">
                <circle cx="150" cy="98" r="7" fill={selectedProfile.id === 'liam' ? '#10b981' : '#10b98144'} stroke="#ffffff" strokeWidth="2" className="transition-all duration-300" />
                <text x="160" y="101" className="text-[8px] font-mono fill-slate-400 dark:fill-slate-500 font-bold">Liam (29y) - 15% Max</text>
              </g>

              {/* Sarah plot (medium risk) */}
              <g className="cursor-pointer group">
                <circle cx="280" cy="62" r="7" fill={selectedProfile.id === 'sarah' ? '#f59e0b' : '#f59e0b44'} stroke="#ffffff" strokeWidth="2" className="transition-all duration-300" />
                <text x="290" y="65" className="text-[8px] font-mono fill-slate-500 dark:fill-slate-400 font-bold">Sarah (37y) - 68% Max</text>
              </g>

              {/* Alex plot (critical risk) */}
              <g className="cursor-pointer group">
                <circle cx="410" cy="28" r="8" fill={selectedProfile.id === 'alex' ? '#ef4444' : '#ef444444'} stroke="#ffffff" strokeWidth="2" className="transition-all duration-300 animate-pulse" />
                <text x="422" y="31" className="text-[8px] font-mono fill-rose-500 font-bold">Alex (51y) - 82% Max</text>
              </g>
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Age 20y (Optimistic)</span>
              <span>Age 35y (Standard)</span>
              <span>Age 55y+ (Decelerating Index)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-learning text synthesis section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk factors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display border-b border-slate-100 dark:border-slate-800 pb-2">
            Identified Risk Biomarkers
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
            {selectedProfile.keyRiskFactors.map((factor, index) => (
              <li key={index} className="flex gap-2 items-start leading-relaxed">
                <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preventative Directives */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display border-b border-slate-100 dark:border-slate-800 pb-2">
            Suggested Preventative Actions
          </h4>
          <div className="space-y-2.5">
            {selectedProfile.preventativeDirectives.map((directive, index) => (
              <div key={index} className="flex gap-2.5 items-start bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800/80">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-705 dark:text-slate-300 leading-normal">{directive}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesis Summary footer */}
      <div className="bg-indigo-650/5 dark:bg-indigo-400/5 border border-indigo-200/20 dark:border-indigo-800/30 rounded-2xl p-4 flex gap-4 items-start">
        <Sparkles className="h-5 w-5 text-indigo-550 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-slate-900 dark:text-white block font-display">MediCore AI Clinically-Encapsulated Analysis:</span>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed italic">"{selectedProfile.aiSummary}"</p>
        </div>
      </div>
    </div>
  );
}
