import { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, DollarSign, Activity, Calendar, ShieldAlert, 
  ArrowUpRight, Filter, RotateCcw, AlertTriangle, Building, Brain, Info,
  Percent, HeartPulse, Clock, Sparkles, CheckCircle2, Award, ChevronRight, Laptop
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

export default function ExecutiveAnalytics({ initialTab = 'overview' }: { initialTab?: 'overview' | 'revenue' | 'users' | 'operations' | 'ai-intelligence' }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'users' | 'operations' | 'ai-intelligence'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  // 1. REVENUE DATASETS
  const dailyRevenueData = [
    { name: 'Mon', revenue: 2900, expenses: 1400, growth: 10 },
    { name: 'Tue', revenue: 3100, expenses: 1450, growth: 12 },
    { name: 'Wed', revenue: 2850, expenses: 1300, growth: 11 },
    { name: 'Thu', revenue: 3400, expenses: 1500, growth: 15 },
    { name: 'Fri', revenue: 3950, expenses: 1680, growth: 22 },
    { name: 'Sat', revenue: 2100, expenses: 1200, growth: 8 },
    { name: 'Sun', revenue: 1980, expenses: 1100, growth: 5 }
  ];

  const weeklyRevenueData = [
    { name: 'Week 1', revenue: 18200, expenses: 8400, growth: 20 },
    { name: 'Week 2', revenue: 19500, expenses: 8800, growth: 22 },
    { name: 'Week 3', revenue: 21500, expenses: 9100, growth: 25 },
    { name: 'Week 4', revenue: 22470, expenses: 9400, growth: 28 }
  ];

  const monthlyRevenueData = [
    { name: 'Jan', revenue: 42000, expenses: 24000, growth: 38 },
    { name: 'Feb', revenue: 45050, expenses: 24500, growth: 42 },
    { name: 'Mar', revenue: 48500, expenses: 25000, growth: 45 },
    { name: 'Apr', revenue: 52100, expenses: 26000, growth: 48 },
    { name: 'May', revenue: 56830, expenses: 26800, growth: 52 },
    { name: 'Jun (Proj)', revenue: 64200, expenses: 28000, growth: 58 }
  ];

  const yearlyRevenueData = [
    { name: '2022', revenue: 380000, expenses: 195000, growth: 12 },
    { name: '2023', revenue: 490000, expenses: 230000, growth: 18 },
    { name: '2024', revenue: 580000, expenses: 290000, growth: 25 },
    { name: '2025 (Ref)', revenue: 720000, expenses: 310500, growth: 30 },
    { name: '2026 (Est)', revenue: 846800, expenses: 340000, growth: 35 }
  ];

  const departmentRevenueData = [
    { name: 'Cardiology', revenue: 245000, percentage: 35 },
    { name: 'Neurology', revenue: 175000, percentage: 25 },
    { name: 'General Med', revenue: 140000, percentage: 20 },
    { name: 'Telemedicine', revenue: 105000, percentage: 15 },
    { name: 'Diagnostic Labs', revenue: 81800, percentage: 5 }
  ];

  // 2. USER ANALYTICS DATASETS
  const loginsOverTimeData = [
    { name: 'Mon', logins: 380, activeUsers: 290, sessions: 210 },
    { name: 'Tue', logins: 410, activeUsers: 310, sessions: 245 },
    { name: 'Wed', logins: 395, activeUsers: 305, sessions: 220 },
    { name: 'Thu', logins: 425, activeUsers: 340, sessions: 260 },
    { name: 'Fri', logins: 485, activeUsers: 395, sessions: 310 },
    { name: 'Sat', logins: 280, activeUsers: 190, sessions: 145 },
    { name: 'Sun', logins: 240, activeUsers: 160, sessions: 110 }
  ];

  const userGROWTHData = [
    { name: 'Jan', activePatients: 1400, activeDoctors: 24, activeHospitals: 4 },
    { name: 'Feb', activePatients: 1850, activeDoctors: 28, activeHospitals: 6 },
    { name: 'Mar', activePatients: 2200, activeDoctors: 34, activeHospitals: 8 },
    { name: 'Apr', activePatients: 2750, activeDoctors: 38, activeHospitals: 9 },
    { name: 'May', activePatients: 3150, activeDoctors: 42, activeHospitals: 11 },
    { name: 'Jun', activePatients: 3650, activeDoctors: 48, activeHospitals: 12 }
  ];

  // 3. HOSPITAL OPERATIONS & DOCTOR PERFORMANCE LISTSETS
  const bedOccupancyData = [
    { name: 'Critical ICU Ward', occupied: 82, capacity: 18, rate: 82 },
    { name: 'Emergency Hold Labs', occupied: 90, capacity: 10, rate: 90 },
    { name: 'General Medicine Suite', occupied: 65, capacity: 35, rate: 65 },
    { name: 'Pulmonology Airward', occupied: 78, capacity: 22, rate: 78 },
    { name: 'Post-Op Care Suite', occupied: 45, capacity: 55, rate: 45 }
  ];

  const clinicianPerformanceData = [
    { name: 'Dr. Elizabeth Vance', specialty: 'Cardiology', consultations: 147, rating: 4.9, success: 98.4, responseTime: '4.2 min' },
    { name: 'Dr. Robert Chen', specialty: 'General Medicine', consultations: 195, rating: 4.7, success: 97.2, responseTime: '4.9 min' },
    { name: 'Dr. Marcus Brody', specialty: 'Neurology', consultations: 102, rating: 4.8, success: 96.8, responseTime: '5.1 min' }
  ];

  // 4. AI DEMOGRAPHICS COHORTS & ACCURACY
  const aiTriageRiskCohort = [
    { name: 'Low Risk Cohort', value: 2373, color: '#10b981' },
    { name: 'Moderate Risk Cohort', value: 912, color: '#eab308' },
    { name: 'High Risk Cohort', value: 365, color: '#ef4444' }
  ];

  const accuracyTrendData = [
    { month: 'Jan', accuracy: 97.2, validationRuns: 820 },
    { month: 'Feb', accuracy: 97.5, validationRuns: 1140 },
    { month: 'Mar', accuracy: 98.1, validationRuns: 1430 },
    { month: 'Apr', accuracy: 98.4, validationRuns: 1980 },
    { month: 'May', accuracy: 98.6, validationRuns: 2420 },
    { month: 'Jun', accuracy: 98.6, validationRuns: 2910 }
  ];

  const fetchAiAnalytics = async () => {
    setIsLoadingInsights(true);
    try {
      const token = localStorage.getItem('medicore_token');
      const res = await fetch('/api/ai/population-health', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsights(data.insights);
      }
    } catch (err) {
      console.warn("AI population call failed, retaining presets:", err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchAiAnalytics();
  }, [triggerCount]);

  const COLORS = ['#06b6d4', '#6366f1', '#3b82f6', '#a855f7', '#10b981'];

  return (
    <div className="space-y-6" id="executive-analytics-section">
      
      {/* 1. Header Protocol bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#0ea5e9] dark:text-[#06b6d4] bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/35 px-2 py-0.5 rounded-md">
              COMMAND CENTER v3.8
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 heartbeat-led"></div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Operational Integrity Optimal</span>
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
            <Building className="h-5 w-5 text-cyan-600 dark:text-[#06b6d4]" />
            <span>MediCore AI – Executive Healthcare Intelligence Command</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed max-w-3xl">
            SaaS operational matrix and real-time calculation caches representing hospital billing flows, ward densities, clinician KPIs, and population ML cohorts.
          </p>
        </div>

        <button
          onClick={() => setTriggerCount(p => p + 1)}
          className="px-4 py-2 bg-cyan-50 hover:bg-cyan-100 dark:bg-[#06b6d4]/10 dark:hover:bg-[#06b6d4]/20 border border-cyan-200 dark:border-[#06b6d4]/30 text-cyan-700 dark:text-[#06b6d4] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Refresh Analytics System</span>
        </button>
      </div>

      {/* 2. EXECUTIVE KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Revenue KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full blur-xl group-hover:bg-cyan-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Yield</span>
            <DollarSign className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">$846,800</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">+14.2%</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium">vs Prev Year</span>
            </div>
          </div>
        </div>

        {/* Patients KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-blue-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full blur-xl group-hover:bg-blue-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Patients</span>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">3,650</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">+24%</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium">MoM Intake</span>
            </div>
          </div>
        </div>

        {/* Doctors KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full blur-xl group-hover:bg-indigo-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Clinicians</span>
            <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">48 MDs</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">+12%</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium font-mono">SLA Verified</span>
            </div>
          </div>
        </div>

        {/* Hospitals KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full blur-xl group-hover:bg-emerald-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Partner Hubs</span>
            <Building className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">12 Hubs</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-bold">+2 New</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium font-mono">Connected</span>
            </div>
          </div>
        </div>

        {/* Uptime KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-purple-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full blur-xl group-hover:bg-purple-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Gateway Uptime</span>
            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">99.98%</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-mono font-bold">Excellent</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium">SLA Standard</span>
            </div>
          </div>
        </div>

        {/* AI Accuracy KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-400 dark:hover:border-cyan-500/20 transition duration-300 relative overflow-hidden group shadow-xs">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full blur-xl group-hover:bg-amber-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Accuracy</span>
            <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">98.6%</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">validated</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-medium">Population ML</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. PORTAL TABS CONTROLLERS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'overview', label: 'Overview Signals', icon: HeartPulse, desc: 'Live telemetries' },
          { id: 'revenue', label: 'Revenue System', icon: DollarSign, desc: 'ARR / Billings / Periodic' },
          { id: 'users', label: 'Users & Platform Load', icon: Users, desc: 'MAU & pipeline sessions' },
          { id: 'operations', label: 'Hospital & Staff SLA', icon: Building, desc: 'Wards & clinician rates' },
          { id: 'ai-intelligence', label: 'AI Diagnostics Engine', icon: Brain, desc: 'Risks & validation trends' }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-xl border text-left transition cursor-pointer flex-1 min-w-[140px] ${
                isSelected 
                  ? 'bg-cyan-50/70 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-500/60 text-cyan-900 dark:text-white shadow-xs font-semibold' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <IconComp className={`h-4 w-4 ${isSelected ? 'text-cyan-600 dark:text-[#06b6d4]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-xs font-bold block">{tab.label}</span>
              </div>
              <span className="text-[9px] text-slate-500 dark:text-slate-500 font-mono block leading-none">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB WORKSPACE DISPLAY PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN PANEL CONTENT (Col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          
          {/* TAB A: OVERVIEW SIGNALS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Live Monitoring Dashboard</h3>
                <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-455 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 px-2 py-0.5 rounded">
                  System: ACTIVE (420 Hz)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Live Pipeline Vitals</span>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">142</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Online Users</span>
                  </div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    12 tele-consultations concurrent, average load latency 34ms.
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Weekly Active Sessions</span>
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">1,345</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Completed</span>
                  </div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    SLA adherence rating at 98.4% with stable safe-stream telecasts.
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Clinical Handshakes</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">15,820</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">AI Inferences</span>
                  </div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Zero mis-authenticated pipelines on diagnostic API indexes.
                  </div>
                </div>
              </div>

              {/* Live Medical monitor feed simulation */}
              <div className="bg-slate-50 dark:bg-[#030712] border border-cyan-200 dark:border-cyan-900/30 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Active Heartbeat ECG Gateway Feed</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-500">REFRESHING AT GATEWAY LATENCY</span>
                </div>
                <div className="h-28 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
                    <path 
                      id="smallEcgLine"
                      d="M 0,50 L 80,50 L 90,45 L 100,55 L 110,50 L 130,50 L 138,20 L 145,80 L 152,48 L 158,55 L 165,50 L 250,50 L 320,50 L 330,45 L 340,55 L 350,50 L 370,50 L 378,10 L 385,85 L 392,45 L 398,55 L 405,50 L 510,50 L 590,50 L 600,45 L 610,55 L 620,50 L 640,50 L 648,15 L 655,82 L 662,47 L 668,55 L 675,50 L 800,50" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="2" 
                      className="ecg-line"
                    />
                  </svg>
                  <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 shadow-xs">
                    BPM: <strong className="text-cyan-600 dark:text-cyan-400">72 stable</strong>
                  </div>
                </div>
              </div>

              {/* Live activity log list */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest font-mono">Live System Audit Signals</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-850/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-700 dark:text-slate-300">Prescription sealed: Albuterol inhaler signed by Dr. Robert Chen</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">12 mins ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-850/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      <span className="text-slate-700 dark:text-slate-300">AI Differential Diagnosis generated for Sarah Jenkins (High Accuracy)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">24 mins ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-850/50">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span className="text-slate-700 dark:text-slate-300">Telehealth UHD safechannel session established successfully</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">45 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: REVENUE SYSTEM */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/60">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Financial Yield & SaaS Billing Performance</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Total operational earnings categorized by custom period parameters.</p>
                </div>
                <div className="flex gap-1.5">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setRevenuePeriod(period)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase font-mono tracking-wider rounded-lg transition border cursor-pointer ${
                        revenuePeriod === period 
                          ? 'bg-cyan-600 border-cyan-500 text-white shadow-xs' 
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive chart plotting */}
              <div className="h-64 mt-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={
                    revenuePeriod === 'daily' ? dailyRevenueData :
                    revenuePeriod === 'weekly' ? weeklyRevenueData :
                    revenuePeriod === 'monthly' ? monthlyRevenueData : yearlyRevenueData
                  }>
                    <defs>
                      <linearGradient id="yieldGlowArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expensesGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1', color: '#0f172a' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#yieldGlowArea)" name="Total Revenue ($)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={1} fillOpacity={1} fill="url(#expensesGlow)" name="Expenses ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Financial growth subcharts or distribution metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase block">Revenue growth curve</span>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenuePeriod === "daily" ? dailyRevenueData : monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1' }} />
                        <Bar dataKey="growth" name="Sequential growth rate (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase block">Earnings by clinical Specialty</span>
                  <div className="space-y-2 mt-2">
                    {departmentRevenueData.map((dept) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-350">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</span>
                          <span className="font-mono text-[11px] text-slate-900 dark:text-white">${dept.revenue.toLocaleString()} ({dept.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 dark:bg-indigo-505 bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: USERS & PLATFORM LOAD */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Daily log trends & active sessions</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Operational pipeline session volume of active clinics and hospitals.</p>
                </div>
              </div>

              {/* Dynamic responsive logs chart */}
              <div className="h-60 mt-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loginsOverTimeData}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Area type="monotone" dataKey="logins" name="Daily login volume" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" />
                    <Line type="monotone" dataKey="activeUsers" name="Concurrent Active (Users)" stroke="#0ea5e9" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="sessions" name="Telemedicine streams" stroke="#a855f7" strokeWidth={1} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Core analytics blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase block">User Demographics growth</span>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userGROWTHData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1' }} />
                        <Legend wrapperStyle={{ fontSize: 9 }} />
                        <Bar dataKey="activePatients" name="Active Patients" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="activeDoctors" name="Active Clinicians" fill="#a855f7" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase block">Active Infrastructure Load</span>
                  
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                        <span>Online sessions processed</span>
                        <strong className="text-slate-900 dark:text-white">142 sessions (peak load)</strong>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0ea5e9] h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                        <span>AI API Requests processed</span>
                        <strong className="text-slate-900 dark:text-white">15,820 calls</strong>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                        <span>Average Tele-education Duration</span>
                        <strong className="text-slate-900 dark:text-white">18.4 minutes</strong>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-650 dark:bg-purple-550 dark:bg-purple-500 h-full rounded-full" style={{ width: '74%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: HOSPITAL & STAFF SLA */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Bed occupancy & staff diagnostics</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Interactive statistics representing clinical room occupancies and active ratings.</p>
                </div>
              </div>

              {/* Occupancy metrics */}
              <div className="h-60 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bedOccupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="occupied" name="Occupied capacity (%)" fill="#eb5a3c" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Available Buffer (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Clinicians staff metrics list */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest font-mono">Specialist Doctor Performance Roster</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {clinicianPerformanceData.map((doc, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-250 border-slate-200 dark:border-slate-850 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">{doc.name}</h5>
                          <span className="text-[9px] font-mono text-[#0ea5e9] dark:text-indigo-400 uppercase font-semibold">{doc.specialty}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 px-1.5 py-0.2 rounded">
                          ★ {doc.rating}
                        </span>
                      </div>
                      <div className="space-y-1 pt-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900 leading-relaxed font-mono">
                        <div className="flex justify-between">
                          <span>Consultations:</span>
                          <span className="text-slate-800 dark:text-slate-300 font-semibold">{doc.consultations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Response:</span>
                          <span className="text-slate-800 dark:text-slate-300 font-semibold">{doc.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SLA Adherence:</span>
                          <span className="text-slate-800 dark:text-slate-300 font-semibold">{doc.success}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB E: AI DIAGNOSTICS ENGINE */}
          {activeTab === 'ai-intelligence' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">AI Clinical Accuracy & Risks demographics</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Evaluation trends of population machine learning algorithms.</p>
                </div>
              </div>

              <div className="h-56 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-slate-850">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis domain={[95, 100]} stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #cbd5e1' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="accuracy" name="AI Accuracy rating (%)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="validationRuns" name="Diagnostic validations run" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Demographic segments cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center justify-between gap-4">
                  <div className="w-1/2 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={aiTriageRiskCohort}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {aiTriageRiskCohort.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-1/2 space-y-2 text-[11px] leading-loose">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-700 dark:text-[#06b6d4] uppercase block">Population Risks</span>
                    <div className="space-y-1 text-slate-700 dark:text-slate-350">
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-850">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Low Risk:</span>
                        <span className="font-bold text-slate-800 dark:text-white">65% (2,373)</span>
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-850">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">Moderate:</span>
                        <span className="font-bold text-slate-800 dark:text-white">25% (912)</span>
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-850">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">High Risk:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-300">10% (365)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">AI Inference Seal</span>
                    <h5 className="text-[11px] font-extrabold text-slate-900 dark:text-white uppercase mt-1">Validated machine learning</h5>
                    <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                      All calculations are logged behind cryptographically mapped differential tokens. Inferences run through active Gemini systems and are validated by certified physicians.
                    </p>
                  </div>
                  <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/30 rounded text-[10px] text-cyan-800 dark:text-cyan-450 leading-normal flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>Calculations automatically synchronized across all active hospital clusters.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR PARAMETERS PANEL (Col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-sm">
          
          <div className="space-y-4">
            <div className="inline-flex p-2.5 bg-gradient-to-tr from-cyan-50 to-indigo-50 dark:from-cyan-955 dark:to-indigo-950 border border-cyan-155 dark:border-[#06b6d4]/30 rounded-xl text-cyan-600 dark:text-[#06b6d4]">
              <Brain className="h-5.5 w-5.5 text-cyan-700 dark:text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-600 dark:text-[#06b6d4] uppercase">Population Medicine Triage</span>
              <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider mt-0.5">Gemini Clinical Forecasts</h3>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-72 pr-1 select-none">
            {isLoadingInsights ? (
              <div className="h-36 flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-450">Retrieving diagnostic vectors...</span>
              </div>
            ) : aiInsights ? (
              <div className="space-y-3.5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-350">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/25 border border-cyan-200 dark:border-cyan-900/20 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-bold text-cyan-705 dark:text-cyan-400 block">COHORT TRENDS</span>
                  <p className="italic">"{aiInsights.admissionsCohortPredictiveTrend}"</p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/10 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-500 block">SHORTAGE ALERTS</span>
                  <p className="text-amber-600 dark:text-amber-500 italic">"{aiInsights.criticalShortageWarnings}"</p>
                </div>

                <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl">
                  <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block">STRATEGIC COUNTER-MEASURES</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {aiInsights.reAdmissionsStrategicMeasures?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2.5 text-xs text-slate-600 dark:text-slate-450 text-center leading-loose">
                <p>Telemetry metrics cache validated.</p>
                <button
                  onClick={() => setTriggerCount(p => p + 1)}
                  className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-[#06b6d4]/10 dark:hover:bg-[#06b6d4]/20 border border-cyan-200 dark:border-[#06b6d4]/20 text-xs font-bold text-cyan-700 dark:text-[#06b6d4] rounded"
                >
                  Reload AI Models
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#030712] rounded-xl border border-slate-200 dark:border-slate-850 flex items-start gap-2.5 text-[10px]">
            <Info className="h-4.5 w-4.5 text-cyan-600 dark:text-[#06b6d4] shrink-0 mt-0.5" />
            <p className="text-slate-500 dark:text-slate-450 leading-normal">
              Differential insights processed securely on isolated server-side endpoints. Fully HIPAA and SOC2 clinical credential certified.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
