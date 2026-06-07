import { useState } from 'react';
import { 
  Award, Star, Clock, Activity, MessageSquare, Sparkles, CheckCircle2, 
  RotateCcw, Sliders, ChevronLeft, ChevronRight, UserCheck 
} from 'lucide-react';

export default function PerformanceDashboard() {
  const [activeSegment, setActiveSegment] = useState<'overall' | 'spe' | 'com'>('overall');
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<'all' | 'high'>('all');

  // Dynamic values corresponding to selected metrics segment
  const performanceKPIs = {
    overall: {
      totalConsultations: 184,
      avgResponseMinutes: "2.4 min",
      avgConsultDuration: "14.5 min",
      satisfactionScore: "4.9",
      onTimeStartRate: "99.4%",
      triageAdherenceValue: "98.7%",
      satisfactionBreakdown: [
        { name: "Diagnostic Clarity", score: 98, color: "#6366f1" },
        { name: "Empathy & Attentiveness", score: 99, color: "#10b981" },
        { name: "Treatment Explanation", score: 96, color: "#f59e0b" },
        { name: "Prescription Delivery Speed", score: 97, color: "#ef4444" }
      ]
    },
    spe: {
      totalConsultations: 92,
      avgResponseMinutes: "1.8 min",
      avgConsultDuration: "11.2 min",
      satisfactionScore: "5.0",
      onTimeStartRate: "100%",
      triageAdherenceValue: "99.2%",
      satisfactionBreakdown: [
        { name: "Diagnostic Clarity", score: 99, color: "#6366f1" },
        { name: "Empathy & Attentiveness", score: 100, color: "#10b981" },
        { name: "Treatment Explanation", score: 98, color: "#f59e0b" },
        { name: "Prescription Delivery Speed", score: 99, color: "#ef4444" }
      ]
    },
    com: {
      totalConsultations: 92,
      avgResponseMinutes: "3.2 min",
      avgConsultDuration: "17.8 min",
      satisfactionScore: "4.7",
      onTimeStartRate: "98.8%",
      triageAdherenceValue: "98.1%",
      satisfactionBreakdown: [
        { name: "Diagnostic Clarity", score: 96, color: "#6366f1" },
        { name: "Empathy & Attentiveness", score: 97, color: "#10b981" },
        { name: "Treatment Explanation", score: 95, color: "#f59e0b" },
        { name: "Prescription Delivery Speed", score: 94, color: "#ef4444" }
      ]
    }
  };

  const activeKPIs = performanceKPIs[activeSegment];

  const patientReviews = [
    {
      id: "rev-1",
      patientName: "Sarah Jenkins",
      rating: 5,
      date: "May 22, 2026",
      comment: "Dr. Chen was incredibly thorough and attentive during my asthma management consult. He took ample time to walk through my air volume spirometry metrics.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "rev-2",
      patientName: "Alex Carter",
      rating: 5,
      date: "June 02, 2026",
      comment: "Excellent video stream resolution and rapid diagnostic responses. Metformin generic adjustments made the symptoms stabilize immediately.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "rev-3",
      patientName: "Emma Watson",
      rating: 4,
      date: "April 18, 2026",
      comment: "Great response time! Triage notes were filed and signed digitally under 3 minutes, securely submitting my prescriptions directly to the pharma gateway.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const filteredReviews = ratingFilter === 'all' 
    ? patientReviews 
    : patientReviews.filter(r => r.rating === 5);

  const handleNextReview = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrevReview = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  return (
    <div className="bg-white dark:bg-slate-905 border border-slate-205 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-5" id="doctor-performance-root">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Award className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider font-display text-slate-900 dark:text-white leading-none">Practitioner Performance Radar</h3>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Live Consultation KPIs &bull; Response Metrics &bull; Patient Commendations</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSegment('overall')}
            className={`px-3 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition ${
              activeSegment === 'overall' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cumulative
          </button>
          <button
            onClick={() => setActiveSegment('spe')}
            className={`px-3 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition ${
              activeSegment === 'spe' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Video Streams
          </button>
          <button
            onClick={() => setActiveSegment('com')}
            className={`px-3 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition ${
              activeSegment === 'com' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            In-Office Consults
          </button>
        </div>
      </div>

      {/* Primary KPI Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        {/* Box A: Consultation quantities */}
        <div className="bg-slate-50/50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Consults Conducted</span>
          <span className="text-2xl font-black text-slate-950 dark:text-white block font-display leading-none">{activeKPIs.totalConsultations}</span>
          <span className="text-[9px] text-emerald-500 font-semibold block leading-none">+12.4% vs last quarter</span>
        </div>

        {/* Box B: Response speeds */}
        <div className="bg-slate-50/50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Intake Response Time</span>
          <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400 block font-display leading-none">{activeKPIs.avgResponseMinutes}</span>
          <span className="text-[9px] text-emerald-500 font-semibold block leading-none">Ranked Upper 2.5%</span>
        </div>

        {/* Box C: Average visit duration */}
        <div className="bg-slate-50/50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Average Consult Duration</span>
          <span className="text-2xl font-black text-slate-950 dark:text-white block font-display leading-none">{activeKPIs.avgConsultDuration}</span>
          <span className="text-[9px] text-slate-400 block leading-none">Optimal EMR interaction</span>
        </div>

        {/* Box D: On-time rate */}
        <div className="bg-slate-50/50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-indigo-500 font-bold block font-display">Triage SLA Accuracy</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-display leading-none">{activeKPIs.onTimeStartRate}</span>
          <span className="text-[9px] text-slate-400 block leading-none">Adheres strictly to protocols</span>
        </div>
      </div>

      {/* Breakdown sliders vs Testimony Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Diagnostic parameters rating benchmarks (Col-span-7) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-450 dark:text-slate-550 block font-black">Quality Indicators</span>
            <h4 className="font-extrabold text-slate-900 dark:text-white font-display text-xs">Satisfaction Analysis Breakdown</h4>
          </div>

          <div className="space-y-2.5 my-auto">
            {activeKPIs.satisfactionBreakdown.map((item, id) => (
              <div key={id} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-350 font-bold">
                  <span>{item.name}</span>
                  <span className="font-mono text-slate-905 dark:text-white">{item.score}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[10.5px] text-slate-500 flex items-center gap-1.5 leading-snug">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>Completed credentials verification. Quality metric algorithms comply with standard clinical peer standards.</span>
          </div>
        </div>

        {/* Carousel Patient Reviews column (Col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/60 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Verified Patient Testimony</h4>
            
            <select 
              value={ratingFilter} 
              onChange={(e) => {
                setRatingFilter(e.target.value as 'all' | 'high');
                setCurrentReviewIdx(0);
              }}
              className="bg-transparent border-none text-[10px] font-mono text-indigo-600 focus:outline-none cursor-pointer font-bold"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">All Reviews</option>
              <option value="high" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">5 ★ Only</option>
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="text-center text-xs text-slate-450 italic py-6">No matching patient comments found.</p>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-center text-xs">
              
              {/* Stars Row */}
              <div className="flex gap-0.5 items-center justify-center">
                {Array.from({ length: filteredReviews[currentReviewIdx].rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Real-time speech comment */}
              <p className="text-slate-650 dark:text-slate-350 italic text-center text-xs leading-relaxed px-2">
                &ldquo;{filteredReviews[currentReviewIdx].comment}&rdquo;
              </p>

              {/* Author profile */}
              <div className="flex items-center gap-3 justify-center">
                <img 
                  src={filteredReviews[currentReviewIdx].avatar} 
                  alt={filteredReviews[currentReviewIdx].patientName} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-slate-220 dark:border-slate-700 object-cover" 
                />
                <div className="text-left leading-normal">
                  <span className="font-bold text-slate-900 dark:text-white block">{filteredReviews[currentReviewIdx].patientName}</span>
                  <span className="text-[10px] text-slate-450 font-mono tracking-tight block">{filteredReviews[currentReviewIdx].date}</span>
                </div>
              </div>

              {/* Slide buttons */}
              {filteredReviews.length > 1 && (
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button 
                    onClick={handlePrevReview} 
                    className="p-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                    title="Previous testimony"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[9.5px] font-mono text-slate-500 font-bold">
                    {currentReviewIdx + 1} / {filteredReviews.length}
                  </span>
                  <button 
                    onClick={handleNextReview} 
                    className="p-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-905 rounded-lg hover:bg-slate-50 cursor-pointer active:scale-95 transition"
                    title="Next testimony"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
