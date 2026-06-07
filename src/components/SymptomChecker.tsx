import { useState, FormEvent } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Heart, User, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface SymptomCheckerProps {
  patientHistory: string;
  patientAge: number;
}

export default function SymptomChecker({ patientHistory, patientAge }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState('');
  const [lifestyle, setLifestyle] = useState('Sedentary, high stress, moderate coffee.');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clinicalPresets = [
    {
      label: "Respiratory Distress",
      symptoms: "Dry hacking cough, tight chest wheezing, minor fever of 100.4F, worsening at night.",
      lifestyle: "Non-smoker, moderate daily steps, high allergy seasons exposure."
    },
    {
      label: "Severe Chronic Migraine",
      symptoms: "Intense unilateral throbbing headache, aura shadows in left eye, sensitive to fluorescent lights.",
      lifestyle: "High screen time (9+ hrs), poor sleep latency (5 hrs average)."
    },
    {
      label: "Cardio-Gastric Strain",
      symptoms: "Sudden pressure near upper sternum, acid reflux sensation, radiating dull discomfort to left neck.",
      lifestyle: "Sedentary, high saturated fats diet, family history of coronary issues."
    }
  ];

  const handleApplyPreset = (preset: typeof clinicalPresets[0]) => {
    setSymptoms(preset.symptoms);
    setLifestyle(preset.lifestyle);
    setError(null);
  };

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Please check and accept the clinical assessment consent before proceeding.");
      return;
    }
    if (!symptoms.trim()) {
      setError("Please describe the physical symptoms you are experiencing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          history: patientHistory,
          age: patientAge,
          lifestyle
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process server-side Gemini request.");
      }

      const data = await response.json();
      setResult(data.result);
      setIsSimulated(!!data.simulation);
    } catch (err: any) {
      setError(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-symptom-section" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold tracking-wider uppercase font-mono">
              Gemini 3.5 Engine
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">
              MEDICORE AI PREDICTIVE ENGINE
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">MediCore AI Predictive AI Symptom Checker</h2>
          <p className="text-xs text-slate-500">
            Secure, server-side clinical triage analysis powered by MediCore AI, backed by medical differential assessments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side Input Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl"></div>
          
          <div className="mb-4">
            <label className="block text-[9px] font-bold uppercase tracking-wider text-indigo-650 mb-1.5">
              Step 1: Apply Clinical Preset (Optional)
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {clinicalPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 px-3 py-2 rounded-lg text-slate-700 transition duration-150 group cursor-pointer"
                >
                  <span className="font-bold text-indigo-650 group-hover:text-indigo-750 block mb-0.5">{preset.label}</span>
                  <span className="text-slate-550 text-[10px] block line-clamp-1">{preset.symptoms}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="patient-symptoms-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Step 2: Describe Symptoms in Detail
              </label>
              <textarea
                id="patient-symptoms-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Sharp pain in back of knee, swelling, temperature slightly elevated..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-500/60 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 min-h-[100px] leading-relaxed transition"
              />
            </div>

            <div>
              <label htmlFor="patient-lifestyle-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Patient Lifestyle Context
              </label>
              <input
                id="patient-lifestyle-input"
                type="text"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500/60 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition select-text"
              />
              <span className="text-[9px] text-slate-450 mt-1 block">
                Includes physical routine, caffeine intake, screen stress, and allergens.
              </span>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  id="disclaimer-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-3 w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="disclaimer-consent" className="text-[10px] text-slate-550 leading-normal cursor-pointer select-none">
                  <span className="font-bold text-slate-700">Clinician Support Disclaimer Consent:</span> I understand that this AI system provides educational triage recommendations based on automated guidelines. It does not replace a clinical face-to-face physician analysis.
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="ai-submit-symptoms-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-650/45 text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Deep Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Execute Symptom Check</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side Outputs */}
        <div className="lg:col-span-7 h-full">
          {loading ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 h-[420px]">
              <div className="p-4 bg-indigo-55 bg-indigo-50 rounded-full">
                <Activity className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">Gemini Clinical Agent Evaluating Inputs</p>
                <p className="text-xs text-slate-450 max-w-[320px]">
                  Running language analytics, checking disease vectors database, and predicting health triage parameters...
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs space-y-4 h-full animate-fade-in">
              {/* Triage Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold font-mono tracking-wider text-slate-455 uppercase">Triage Assessment Level</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      result.triageLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-250/20' :
                      result.triageLevel === 'URGENT' ? 'bg-amber-50 text-amber-700 border-amber-250/20' :
                      result.triageLevel === 'STABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-250/20' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {result.triageLevel}
                    </span>
                    <span className="text-slate-550 font-mono text-[10px]">Confidence: {result.confidence}%</span>
                  </div>
                </div>
                {isSimulated && (
                  <span className="px-2 py-0.5 border border-amber-200 bg-amber-50 text-amber-700 rounded text-[9px] font-mono font-bold">
                    Simulation Mode Active
                  </span>
                )}
              </div>

              {/* Primary Diagnoses & Differential Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                    <Activity className="h-4 w-4" />
                    <span>Primary Diagnosis Model</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{result.primaryDiagnosis}</h3>
                  <p className="text-[11px] text-slate-650 bg-white p-2.5 border border-slate-200 rounded leading-relaxed">
                    <span className="font-bold text-slate-800">Triage Action:</span> {result.triageAction}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                    <BookOpen className="h-4 w-4" />
                    <span>Differential Assessment</span>
                  </div>
                  <div className="space-y-3">
                    {result.differentialDiagnoses.map((diff, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{diff.condition}</span>
                          <span className="font-mono text-indigo-600 font-bold">{diff.probValue}% Prob</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ width: `${diff.probValue}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-505 block leading-normal">{diff.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Scorecard & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Score Index Card */}
                <div className="md:col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-mono font-bold">Health Risk Index</span>
                  <div className="relative flex items-center justify-center w-20 h-20">
                    {/* Ring background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="#cbd5e1" strokeWidth="5" fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="currentColor" 
                        className={result.healthRiskIndex >= 70 ? "text-rose-500" : result.healthRiskIndex >= 40 ? "text-amber-500" : "text-indigo-650"} 
                        strokeWidth="5" 
                        fill="transparent" 
                        strokeDasharray={201}
                        strokeDashoffset={201 - (201 * result.healthRiskIndex) / 100}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-bold text-slate-900 font-display leading-none">{result.healthRiskIndex}</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Metrics</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 leading-tight">Predicted specialty: <span className="text-indigo-755 block font-bold mt-0.5">{result.suggestedSpecialty}</span></span>
                </div>

                {/* Recommendations */}
                <div className="md:col-span-8 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                  <span className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block font-mono">Preventative Lifestyle Guidelines</span>
                  <ul className="space-y-1 list-disc pl-4 text-[11px] text-slate-700 leading-snug">
                    {result.lifestyleRecommendations.slice(0, 3).map((rec, id) => (
                      <li key={id} className="leading-snug">{rec}</li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest block font-mono">Active Diagnostic Hazards</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {result.keyRisks.map((risk, index) => (
                        <span key={index} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] border border-rose-250/20 font-medium">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicine Recommendations */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between cursor-default">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block font-mono">
                    Suggested Generic Chemistry Classifications
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>PHARMACEUTICAL COMPLIANCE SAFE</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-455 uppercase text-[9px] tracking-wider font-bold">
                        <th className="pb-1.5 font-bold">Classification</th>
                        <th className="pb-1.5 font-bold">Common Generics</th>
                        <th className="pb-1.5 font-bold">Clinical Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.suggestedGenericMedicines.map((med, index) => (
                        <tr key={index} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                          <td className="py-2.5 text-slate-900 font-bold max-w-[105px] truncate">{med.classification}</td>
                          <td className="py-2.5 text-slate-700 font-bold">
                            {med.commonDrugs.map((d) => (
                              <span key={d} className="inline-block bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9.5px] text-slate-700 font-mono mr-1 mb-1 font-semibold">
                                {d}
                              </span>
                            ))}
                          </td>
                          <td className="py-2.5 text-slate-600 max-w-[280px] break-words">
                            <span className="block text-[11px] leading-snug text-slate-755">{med.purpose}</span>
                            <span className="block text-[9.5px] text-rose-600 font-mono mt-0.5 font-semibold">Warning: {med.warnings}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3 h-[420px]">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
                <Heart className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-905 text-xs font-semibold font-sans">Waiting for Clinical Metrics</p>
                <p className="text-slate-455 text-[11px] max-w-[280px] mx-auto leading-normal">
                  Submit active symptoms or apply a preset to trigger the enterprise Gemini triage evaluation logs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
