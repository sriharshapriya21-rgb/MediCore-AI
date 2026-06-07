import { useState, FormEvent } from 'react';
import { UploadCloud, FileText, CheckCircle, Brain, AlertTriangle, Loader2 } from 'lucide-react';

interface ParResult {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  hazardIndicators: string;
}

export default function ReportAnalyzer() {
  const [docTitle, setDocTitle] = useState('Spirometry Lab Lung Capacity Report');
  const [rawText, setRawText] = useState('FEV1 VALUE: 2.15L (68% of baseline). FVC VALUE: 3.40L (74% of baseline). FEV1/FVC Index: 63%. Patient displays chronic obstructive airway patterns with acute bronchodilator recruitment index of 14% elevation.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reportPresets = [
    {
      title: "Spirometry Pulmonary Function Scan",
      text: "FEV1 VALUE: 2.15L (68% of baseline prediction). FVC VALUE: 3.40L (74% of baseline). FEV1/FVC Index: 63%. Patient displays chronic obstructive airway patterns with acute bronchodilator recruitment index of 14% elevation post Ventolin."
    },
    {
      title: "Comprehensive Serum Chemistry Panel",
      text: "GLUCOSE SERUM: 124 mg/dL (HIGH, reference range 70-99). CREATININE: 1.12 mg/dL (Normal). HbA1c: 6.4% (Impaired Glucose tolerance, pre-diabetic metric). CHOLESTEROL TOTAL: 245 mg/dL (HIGH, reference <200)."
    },
    {
      title: "Electrocardiography Cardiac Diagnostics",
      text: "ECG shows sinus bradycardia. Ventricular rate is 54 bpm. PR interval is prolonged (210 ms - First Degree AV Block). Normal left axis deviation. No acute ST-elevation markers mapped."
    }
  ];

  const handleApplyPreset = (preset: typeof reportPresets[0]) => {
    setDocTitle(preset.title);
    setRawText(preset.text);
    setError(null);
  };

  const handleParseReport = async (e: FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError("Please input or paste active medical log texts to summarize.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/ai/parse-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          textContent: rawText
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process server-side Gemini parsing analysis.");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="report-analysis-module" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-205 gap-4">
        <div>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold uppercase font-mono tracking-wider">
            Clinical NLP Analyzer
          </span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">Smart Medical Scan & Report Summarizer</h2>
          <p className="text-xs text-slate-505">
            Convert lab data sheets, serum chemistry panels, and ECG records into high-fidelity understandable insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Upload/Paste Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs space-y-3">
          <label className="block text-[9px] font-bold uppercase tracking-wider text-indigo-705 font-mono">
            Step 1: Choose Chemistry Preset Report
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {reportPresets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-lg text-slate-705 transition duration-150 group cursor-pointer"
              >
                <span className="font-bold text-slate-800 group-hover:text-indigo-700 block mb-0.5 text-[11px]">{preset.title}</span>
                <span className="text-slate-500 text-[9.5px] block line-clamp-1">{preset.text}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleParseReport} className="space-y-3.5 pt-1.5">
            <div>
              <label htmlFor="doc-title-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Report Title
              </label>
              <input
                id="doc-title-input"
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-white border border-slate-205 focus:border-indigo-505 rounded-lg p-2 text-xs text-slate-800 focus:outline-none transition font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="raw-text-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                Paste Lab / Clinical Raw Text
              </label>
              <textarea
                id="raw-text-input"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste serum chemistry data, ECG text diagnostic lines, or pulmonary function numbers..."
                className="w-full bg-white border border-slate-205 focus:border-indigo-555 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none min-h-[110px] leading-relaxed transition"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-850 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="submit-nlp-parse-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-slate-905 hover:bg-slate-850 disabled:bg-slate-500/40 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Parsing Medical Syntax...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 text-indigo-400" />
                  <span>Translate Clinical Text</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Structured translation layout */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 h-[380px] shadow-xs">
              <div className="p-4 bg-indigo-50 rounded-full animate-bounce">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Gemini Clinical Translation Core Active</p>
                <p className="text-xs text-slate-500 max-w-[320px] leading-relaxed">
                  Unraveling complex chemistry ratios, evaluating diagnostic markers, and sorting recommendations...
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs space-y-4.5 animate-fade-in h-[382px] overflow-y-auto ScrollBar">
              
              {/* Summary Introduction */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[8.5px] font-bold font-mono tracking-widest text-indigo-700 uppercase block mb-1">COMPREHENSIVE TRANSLATION REPORT</span>
                <p className="text-[11.5px] text-slate-800 leading-relaxed font-semibold">
                  {result.summary}
                </p>
              </div>

              {/* Key Observations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider block font-mono">Key Observations</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 leading-tight">
                    {result.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider block font-mono font-bold text-indigo-705">Clinical Interventions</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 leading-tight">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FileText className="h-3.5 w-3.5 text-indigo-650 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Health risk level card */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Triage Bio-Signature Warning Indicators</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {result.hazardIndicators}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3 h-[382px] shadow-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
                <UploadCloud className="h-5 w-5 animate-pulse text-indigo-500" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-800 text-xs font-semibold">No active file record selected</p>
                <p className="text-slate-500 text-[11px] max-w-[280px]">
                  Select one of our lab presets or copy-paste text inside the chest form to get an immediate clinical summarizer visualization.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
