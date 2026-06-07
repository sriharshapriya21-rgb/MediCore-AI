import { useState, useEffect } from 'react';
import { 
  Heart, Users, Shield, FileText, Activity, Brain, Laptop, 
  Sparkles, Calendar, BookOpen, ChevronRight, UserCheck, Settings, CheckCircle2,
  Moon, Sun, Bell, Volume2, Globe, HeartPulse, Menu, X, ArrowUpRight,
  Video, History, ClipboardList, Building, LogOut, DollarSign, TrendingUp, Award
} from 'lucide-react';
import { Patient, Doctor, Appointment, Prescription, MedicalRecord } from './types';
import SymptomChecker from './components/SymptomChecker';
import PrescriptionGenerator from './components/PrescriptionGenerator';
import ConsultationRoom from './components/ConsultationRoom';
import ReportAnalyzer from './components/ReportAnalyzer';
import InsuranceClaims from './components/InsuranceClaims';
import AiRiskDashboard from './components/AiRiskDashboard';
import { PatientDashboard, DoctorDashboard, AdminDashboard } from './components/Dashboards';

// Enterprise Modular Component Imports
import LandingPage from './components/LandingPage';
import ExecutiveAnalytics from './components/ExecutiveAnalytics';
import InteractiveCalendar from './components/InteractiveCalendar';
import PerformanceDashboard from './components/PerformanceDashboard';
import NotificationCenter from './components/NotificationCenter';
import Authentication from './components/Authentication';

// Portals Custom Modules
import PatientRecords from './components/PatientRecords';
import TelemedicineCalls from './components/TelemedicineCalls';
import PatientHistoryTimeline from './components/PatientHistoryTimeline';
import UserManagement from './components/UserManagement';
import HospitalManagement from './components/HospitalManagement';

export default function App() {
  // Navigation: Show Marketing Landing page first by default
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Authenticate token
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('medicore_token'));

  // Simulator State Stores
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('medicore_user');
    return saved ? JSON.parse(saved) : { id: 'pat-1', name: 'Sarah Jenkins', role: 'patient' };
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  
  // HUD UI navigation control
  const [activeTab, setActiveTab2] = useState(() => {
    const saved = localStorage.getItem('medicore_user');
    const user = saved ? JSON.parse(saved) : { id: 'pat-1', name: 'Sarah Jenkins', role: 'patient' };
    if (user.role === 'admin') return 'executive-analytics';
    if (user.role === 'doctor') return 'clinical-workspace';
    return 'insurance-claims';
  }); // 'insurance-claims' | 'health-reports' | 'medical-timeline' | 'telemedicine-calls' | 'clinical-workspace' | 'patient-records' | 'rx-builder' | 'ai-recommendations' | 'executive-analytics' | 'user-management' | 'hospital-management' | 'notifications-center'
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Theme darkmode state matching enterprise SaaS
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('medicore_theme') !== 'light'; // dark by default
    }
    return true;
  });

  // Navigation mobile slide drawer and Notification Hub controls
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "MediCore AI Predictive Flag",
      message: "Model reports elevated allergy risks due to acute botanical pollen indexes in Seattle.",
      timestamp: "Just now",
      unread: true,
      category: "AI Insights"
    },
    {
      id: 2,
      title: "e-Prescription Filed",
      message: "Albuterol inhaler Rx electronically signed & securely submitted to Walgreens Hub.",
      timestamp: "2 hours ago",
      unread: true,
      category: "Rx Medication"
    },
    {
      id: 3,
      title: "Lab Report Scan Analyzed",
      message: "Advanced Vision OCR successfully completed differential review of Chest Xray scan.",
      timestamp: "Yesterday",
      unread: false,
      category: "Clinical Diagnostics"
    },
    {
      id: 4,
      title: "Cardio Appointment Approved",
      message: "Dr. Elizabeth Vance approved standard follow-up diagnostic consultation slot.",
      timestamp: "2 days ago",
      unread: false,
      category: "Scheduling"
    }
  ]);

  // Sync state data from local Express APIs
  const refreshCoreStores = async () => {
    const fetchJsonSafely = async (url: string) => {
      try {
        const activeToken = localStorage.getItem('medicore_token');
        const res = await fetch(url, {
          headers: {
            'Authorization': activeToken ? `Bearer ${activeToken}` : ''
          }
        });
        if (!res.ok) return null;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`Fetch error for ${url}:`, err);
      }
      return null;
    };

    try {
      const authData = await fetchJsonSafely('/api/auth/me');
      if (authData && authData.user) {
        setCurrentUser(authData.user);
      }

      const patientsData = await fetchJsonSafely('/api/patients');
      if (patientsData) setPatients(patientsData);

      const doctorsData = await fetchJsonSafely('/api/doctors');
      if (doctorsData) setDoctors(doctorsData);

      const appointmentsData = await fetchJsonSafely('/api/appointments');
      if (appointmentsData) setAppointments(appointmentsData);

      const prescriptionsData = await fetchJsonSafely('/api/prescriptions');
      if (prescriptionsData) setPrescriptions(prescriptionsData);

      const recordsData = await fetchJsonSafely('/api/medical-records');
      if (recordsData) setMedicalRecords(recordsData);
    } catch (err) {
      console.error("API synchronize error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshCoreStores();
    }
    // Refresh stores periodically to coordinate chat triggers
    const interval = setInterval(() => {
      if (token) refreshCoreStores();
    }, 6000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medicore_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medicore_theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('medicore_token');
    localStorage.removeItem('medicore_user');
    setToken(null);
    setCurrentUser({ id: '', name: '', role: 'patient' });
    triggerGlobalNotification("Secured identity session ended.");
  };

  const handleLoginSuccess = (newToken: string, user: any) => {
    setToken(newToken);
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab2('executive-analytics');
    } else if (user.role === 'doctor') {
      setActiveTab2('clinical-workspace');
    } else {
      setActiveTab2('insurance-claims');
    }
    triggerGlobalNotification(`Authorized to server as: ${user.name}`);
    setShowLandingPage(false);
  };

  const handleSwitchUserRole = async (targetRole: string, targetId?: string) => {
    // 1. Immediately determine correct mock profile for the target role
    let mockUser: any = { role: targetRole };
    if (targetRole === 'admin') {
      mockUser = { id: 'usr-admin', name: 'Platform Executive Administrator', role: 'admin' };
    } else if (targetRole === 'doctor') {
      const docId = targetId || 'doc-1';
      const docName = docId === 'doc-3' ? 'Dr. Robert Chen' : 'Dr. Elizabeth Vance';
      mockUser = { id: `usr-${docId}`, name: docName, role: 'doctor', profileId: docId };
    } else {
      mockUser = { id: 'usr-pat-1', name: 'Sarah Jenkins', role: 'patient', profileId: 'pat-1' };
    }

    // 2. Clear visual rooms and set correct tab state instantly based on target role
    setActiveAppointment(null);
    if (targetRole === 'admin') {
      setActiveTab2('executive-analytics');
    } else if (targetRole === 'doctor') {
      setActiveTab2('clinical-workspace');
    } else {
      setActiveTab2('insurance-claims');
    }

    // 3. Update the currentUser state and localStorage instantly
    setCurrentUser(mockUser);
    localStorage.setItem('medicore_user', JSON.stringify(mockUser));

    // 4. Trigger instant toast notification
    triggerGlobalNotification(`Role profile successfully changed to: ${targetRole.toUpperCase()}`);

    // 5. Send POST request in background and update session tokens
    try {
      const activeToken = localStorage.getItem('medicore_token');
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': activeToken ? `Bearer ${activeToken}` : ''
        },
        body: JSON.stringify({ role: targetRole, userId: targetId })
      });
      if (res.ok) {
        const data = await res.json();
        // Fully sync states and update localStorage keys
        setCurrentUser(data.user);
        localStorage.setItem('medicore_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('medicore_token', data.token);
          setToken(data.token);
        }
        refreshCoreStores();
      }
    } catch (err) {
      console.warn("Background role switch handshake failed:", err);
    }
  };

  const triggerGlobalNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBookAppointment = async (doctorId: string, date: string, time: string, reason: string) => {
    try {
      const activeToken = localStorage.getItem('medicore_token');
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': activeToken ? `Bearer ${activeToken}` : ''
        },
        body: JSON.stringify({
          patientId: currentUser.id,
          doctorId,
          date,
          time,
          reason
        })
      });

      if (response.ok) {
        triggerGlobalNotification("Telehealth visit booked successfully!");
        refreshCoreStores();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrescriptionIssuance = () => {
    triggerGlobalNotification("New e-prescription signed and filed!");
    refreshCoreStores();
  };

  // Resolve current active profiles
  const activePatientFile = patients.find(p => p.id === currentUser.id) || patients[0];
  const activeDoctorFile = doctors.find(d => d.id === currentUser.id) || doctors[0];

  // Render Authentication screen if no active session
  if (!token) {
    return <Authentication onLoginSuccess={handleLoginSuccess} onBackToHome={() => setShowLandingPage(true)} />;
  }

  if (patients.length === 0 || doctors.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-500">Loading Clinical Handshake...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerGlobalNotification("All notifications marked as read!");
  };

  const handleToggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    triggerGlobalNotification("Notifications log cleared!");
  };

  if (showLandingPage) {
    return <LandingPage onLaunchPortal={() => setShowLandingPage(false)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'dark bg-[#0B1220] text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'} relative overflow-hidden`}>
      
      {/* Global Healthcare Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-30">
        {/* Soft glowing mesh gradient bubbles */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-[450px] h-[450px] bg-indigo-500/5 dark:bg-indigo-650/10 rounded-full blur-3xl"></div>
        <div className="absolute top-12 right-1/4 w-80 h-80 bg-sky-505/5 dark:bg-sky-500/8 rounded-full blur-3xl"></div>

        {/* Floating Healthcare Network Nodes */}
        <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <line x1="8%" y1="18%" x2="22%" y2="28%" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1.2" className="floating-node-1" />
          <line x1="22%" y1="28%" x2="16%" y2="48%" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1.2" className="floating-node-2" />
          <line x1="90%" y1="15%" x2="78%" y2="38%" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1.2" className="floating-node-3" />
          <line x1="78%" y1="38%" x2="88%" y2="55%" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1.0" className="floating-node-1" />
          
          <circle cx="8%" cy="18%" r="4" fill="rgba(6, 182, 212, 0.2)" className="floating-node-1 animate-pulse" />
          <circle cx="22%" cy="28%" r="5.5" fill="rgba(99, 102, 241, 0.2)" className="floating-node-2" />
          <circle cx="16%" cy="48%" r="3" fill="rgba(56, 189, 248, 0.2)" className="floating-node-3" />
          <circle cx="90%" cy="15%" r="4.5" fill="rgba(99, 102, 241, 0.2)" className="floating-node-3 animate-pulse" />
          <circle cx="78%" cy="38%" r="6.5" fill="rgba(6, 182, 212, 0.15)" className="floating-node-1" />
          <circle cx="88%" cy="55%" r="3.5" fill="rgba(56, 189, 248, 0.2)" className="floating-node-2" />
        </svg>

        {/* Clinical Electrocardiogram Wave (ECG) with strictly 5% opacity */}
        <div className="absolute top-1/3 left-0 right-0 h-40 opacity-[0.05] pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <pattern id="ecgGirdPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(14, 165, 233, 0.04)" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ecgGirdPattern)" />
            <path 
              d="M 0,100 L 120,100 L 130,95 L 140,105 L 150,100 L 180,100 L 190,40 L 200,170 L 210,90 L 218,105 L 225,100 L 300,100 L 410,100 L 420,95 L 430,105 L 440,100 L 470,100 L 480,30 L 490,175 L 500,90 L 508,105 L 515,100 L 610,100 L 730,100 L 740,95 L 750,105 L 760,100 L 790,100 L 800,45 L 810,165 L 820,92 L 828,105 L 835,100 L 910,100 L 1050,100 L 1060,95 L 1070,105 L 1080,100 L 1110,100 L 1120,35 L 1130,172 L 1140,91 L 1148,105 L 1155,100 L 1195,100" 
              fill="none" 
              stroke="url(#ecgGradient)" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="ecg-line"
            />
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </svg>
        </div>
      </div>

      {/* Toast alert indicator */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-650 border border-indigo-550 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-bounce font-semibold text-xs">
          <CheckCircle2 className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Clinical Header */}
      <header className="border-b border-slate-250 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-md sticky top-0 z-50 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-indigo-650 to-indigo-500 rounded-xl text-white font-black flex items-center justify-center shadow-md shadow-indigo-600/10">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h1 id="core-brand-title" className="text-sm font-black tracking-tight font-display text-[#0F172A] dark:text-white flex items-center gap-1.5 opacity-100 select-all">
                  MediCore AI
                </h1>
                <span id="core-brand-subtitle" className="text-[9.5px] text-[#0F172A] dark:text-white font-mono tracking-wider uppercase block font-black opacity-100 select-all">Enterprise Healthcare Intelligence Platform</span>
              </div>
            </div>

            {/* Mobile layout drawer toggler */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Controls HUB (Dark Mode, Notification Center, Role Selector) */}
          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
            
            {/* Theme Toggle & Notification Dropdown icons */}
            <div className="flex items-center gap-1.5 relative">
              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  const nu = !isDark;
                  setIsDark(nu);
                  localStorage.setItem('medicore_theme', nu ? 'dark' : 'light');
                  triggerGlobalNotification(`Theme protocol changed to: ${nu ? 'DARK' : 'LIGHT'} Mode`);
                }}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all duration-200"
                title={isDark ? "Switch to Light Protocol" : "Switch to Dark Protocol"}
              >
                {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Notification Center Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                  className={`p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all duration-200 ${showNotificationMenu ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Window */}
                {showNotificationMenu && (
                  <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1">
                        <Bell className="h-3.5 w-3.5 text-indigo-550" /> Live AI Notifications ({unreadCount})
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[9px] font-bold text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer"
                        >
                          Read All
                        </button>
                        <button
                          onClick={handleClearNotifications}
                          className="text-[9px] font-bold text-slate-400 hover:text-slate-505 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto ScrollBar divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-450 italic">
                          No active notifications in gateway.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleToggleRead(notif.id)}
                            className={`p-3 text-left text-xs transition duration-150 cursor-pointer ${notif.unread ? "bg-indigo-50/40 dark:bg-indigo-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-850"}`}
                          >
                            <div className="flex justify-between items-start mb-0.5">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-mono font-bold ${
                                notif.category === 'AI Insights' ? 'bg-indigo-50 text-indigo-650 border border-indigo-105 dark:bg-indigo-955 dark:text-indigo-300 dark:border-indigo-900/30' :
                                notif.category === 'Rx Medication' ? 'bg-emerald-50 text-emerald-650 border border-emerald-100 dark:bg-emerald-955 dark:text-emerald-300' :
                                'bg-slate-50 border border-slate-200 text-slate-500 dark:bg-slate-800'
                              }`}>
                                {notif.category}
                              </span>
                              <span className="text-[9px] tracking-tight font-mono text-slate-400 dark:text-slate-500">{notif.timestamp}</span>
                            </div>
                            <p className={`font-bold text-[11.5px] mb-0.5 leading-snug ${notif.unread ? "text-indigo-900 dark:text-indigo-300" : "text-slate-850 dark:text-slate-200"}`}>
                              {notif.title}
                            </p>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role selection switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-150 dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors">
              <span className="text-[9.5px] uppercase font-mono font-black text-slate-700 dark:text-slate-205 px-2 hidden md:inline">Simulation context:</span>
              
              <button
                id="switch-role-patient"
                onClick={() => handleSwitchUserRole('patient', 'pat-1')}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                  currentUser.role === 'patient' 
                    ? 'bg-indigo-650 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-250 dark:hover:bg-slate-700'
                }`}
              >
                <Users className="h-3 w-3" />
                <span>Patient view</span>
              </button>
 
              <button
                id="switch-role-doctor"
                onClick={() => handleSwitchUserRole('doctor', 'doc-3')}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                  currentUser.role === 'doctor' 
                    ? 'bg-indigo-650 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-250 dark:hover:bg-slate-700'
                }`}
              >
                <UserCheck className="h-3 w-3" />
                <span>Doctor view</span>
              </button>
 
              <button
                id="switch-role-admin"
                onClick={() => handleSwitchUserRole('admin')}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                  currentUser.role === 'admin' 
                    ? 'bg-indigo-650 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-250 dark:hover:bg-slate-700'
                }`}
              >
                <Settings className="h-3 w-3" />
                <span>Platform Admin</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Primary Layout Scaffolding */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* Navigation Rail (Col-span-2) */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex flex-col space-y-1.5 shadow-sm text-slate-800 dark:text-slate-200">
          
          <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2 mb-1 font-mono">Platform Navigation</span>
          
          <button
            id="sidebar-nav-home"
            onClick={() => setShowLandingPage(true)}
            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Go to Home Page</span>
          </button>

          <button
            id="sidebar-nav-dashboard"
            onClick={() => {
              setShowLandingPage(false);
              if (currentUser.role === 'admin') {
                setActiveTab2('executive-analytics');
              } else if (currentUser.role === 'doctor') {
                setActiveTab2('clinical-workspace');
              } else {
                setActiveTab2('insurance-claims');
              }
              setActiveAppointment(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Show Main Dashboard</span>
          </button>

          <button
            id="sidebar-nav-back-home"
            onClick={() => setShowLandingPage(true)}
            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer text-slate-705 dark:text-slate-300 hover:text-rose-600 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-rose-605 dark:text-rose-400" />
            <span>Back to Home Screen</span>
          </button>

          <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-1.5"></div>

          {currentUser.role === 'patient' && (
            <>
              <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2 mb-1.5 font-mono block">Patient Portal</span>
              
              <button
                id="tab-insurance-claims"
                onClick={() => { setActiveTab2('insurance-claims'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'insurance-claims' 
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Insurance & Claims</span>
              </button>

              <button
                id="tab-health-reports"
                onClick={() => { setActiveTab2('health-reports'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'health-reports' 
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Health Reports</span>
              </button>

              <button
                id="tab-medical-history"
                onClick={() => { setActiveTab2('medical-timeline'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'medical-timeline' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <History className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Medical History</span>
              </button>

              <button
                id="tab-telemedicine-calls"
                onClick={() => { setActiveTab2('telemedicine-calls'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'telemedicine-calls' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Video className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Telemedicine</span>
              </button>
            </>
          )}

          {currentUser.role === 'doctor' && (
            <>
              <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2 mb-1.5 font-mono block">Doctor Portal</span>

              <button
                id="tab-clinical-workspace"
                onClick={() => { setActiveTab2('clinical-workspace'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'clinical-workspace' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Clinical Workspace</span>
              </button>

              <button
                id="tab-patient-records"
                onClick={() => { setActiveTab2('patient-records'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'patient-records' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Patient Records</span>
              </button>

              <button
                id="tab-prescription-builder"
                onClick={() => { setActiveTab2('rx-builder'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'rx-builder' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Prescriptions</span>
              </button>

              <button
                id="tab-ai-recommendations"
                onClick={() => { setActiveTab2('ai-recommendations'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ai-recommendations' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Brain className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Recommendations</span>
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2 mb-1.5 font-mono block">Admin Portal</span>

              <button
                id="tab-executive-analytics"
                onClick={() => { setActiveTab2('executive-analytics'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'executive-analytics' 
                    ? 'bg-indigo-55 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span>Executive Analytics Dashboard</span>
              </button>

              <button
                id="tab-revenue-analytics"
                onClick={() => { setActiveTab2('revenue-analytics'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'revenue-analytics' 
                    ? 'bg-indigo-55 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Revenue Analytics</span>
              </button>

              <button
                id="tab-patient-volume"
                onClick={() => { setActiveTab2('patient-volume'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'patient-volume' 
                    ? 'bg-indigo-55 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Patient Volume Analytics</span>
              </button>

              <button
                id="tab-doctor-performance"
                onClick={() => { setActiveTab2('doctor-performance'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'doctor-performance' 
                    ? 'bg-indigo-55 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Doctor Performance Analytics</span>
              </button>

              <button
                id="tab-hospital-management"
                onClick={() => { setActiveTab2('hospital-management'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'hospital-management' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Building className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Hospital Operations Dashboard</span>
              </button>

              <button
                id="tab-user-management"
                onClick={() => { setActiveTab2('user-management'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'user-management' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>User Management Dashboard</span>
              </button>

              <button
                id="tab-notifications-center"
                onClick={() => { setActiveTab2('notifications-center'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'notifications-center' 
                    ? 'bg-indigo-50 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Security Monitoring Dashboard</span>
              </button>

              <button
                id="tab-ai-accuracy"
                onClick={() => { setActiveTab2('ai-accuracy'); setActiveAppointment(null); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ai-accuracy' 
                    ? 'bg-indigo-55 dark:bg-indigo-955 text-indigo-750 dark:text-indigo-305 border border-indigo-200 dark:border-indigo-900/50 shadow-xs' 
                    : 'text-slate-705 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <Brain className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Accuracy Metrics Dashboard</span>
              </button>
            </>
          )}

          {/* Quick instructions panel inside sidebar */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-2">
            <button
              onClick={() => setShowLandingPage(true)}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/20"
              id="back-to-marketing-btn"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Back to Marketing</span>
            </button>
            <span className="text-[9px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block mb-1 px-2">Session Info</span>
            <div className="bg-slate-100 dark:bg-slate-950 p-2 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-850 space-y-1">
              <span className="text-[9px] font-mono block">DATE: 2026-06-04</span>
              <span className="text-[9px] font-mono block">UTC: 10:15:00 AM</span>
              <span className="text-[9px] block">Active: <span className="text-slate-900 dark:text-white font-semibold truncate block">{currentUser.name}</span></span>
            </div>
          </div>
        </div>

        {/* Primary View Workspace (Col-span-10) */}
        <div id="clinic-viewport" className="lg:col-span-10 space-y-6">
          
          {/* Active webcam session panel overlay */}
          {activeAppointment ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-2xl relative">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setActiveAppointment(null)}
                  className="bg-slate-805 hover:bg-slate-800 text-slate-300 font-medium text-xs px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  Exit Consultation Visual Room
                </button>
              </div>

              <ConsultationRoom 
                appointment={activeAppointment} 
                currentUserRole={currentUser.role === 'doctor' ? 'doctor' : 'patient'} 
              />
            </div>
          ) : (
            <>
               {/* Context Render tabs block */}
              {activeTab === 'insurance-claims' && (
                <InsuranceClaims />
              )}

              {activeTab === 'clinical-workspace' && (
                <DoctorDashboard 
                  doctor={activeDoctorFile}
                  appointments={appointments}
                  prescriptions={prescriptions}
                  onSelectAppointment={(apt) => setActiveAppointment(apt)}
                />
              )}

              {activeTab === 'executive-analytics' && (
                <ExecutiveAnalytics initialTab="overview" />
              )}

              {activeTab === 'revenue-analytics' && (
                <ExecutiveAnalytics initialTab="revenue" />
              )}

              {activeTab === 'patient-volume' && (
                <ExecutiveAnalytics initialTab="users" />
              )}

              {activeTab === 'doctor-performance' && (
                <PerformanceDashboard />
              )}

              {activeTab === 'ai-accuracy' && (
                <ExecutiveAnalytics initialTab="ai-intelligence" />
              )}

              {/* Patient Portal workspaces */}
              {activeTab === 'health-reports' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display uppercase tracking-wider">Clinical Scan Report OCR Insights</h3>
                    <p className="text-xs text-slate-500 max-w-2xl">
                      Utilize our standard Vision OCR analysis panel to automatically parse medical documentation files. View and verify structural anomalies of diagnostic files below.
                    </p>
                  </div>
                  <ReportAnalyzer />
                </div>
              )}

              {activeTab === 'telemedicine-calls' && (
                <TelemedicineCalls 
                  appointments={appointments}
                  currentUser={currentUser}
                  onSelectAppointment={(apt) => setActiveAppointment(apt)}
                />
              )}

              {activeTab === 'medical-timeline' && (
                <PatientHistoryTimeline 
                  patient={activePatientFile}
                  medicalRecords={medicalRecords}
                />
              )}

              {/* Doctor Portal workspaces */}
              {activeTab === 'patient-records' && (
                <PatientRecords 
                  patients={patients}
                  medicalRecords={medicalRecords}
                  appointments={appointments}
                  prescriptions={prescriptions}
                />
              )}

              {activeTab === 'rx-builder' && (
                <PrescriptionGenerator 
                  patients={patients}
                  doctors={doctors}
                  activePatientId="pat-1"
                  onPrescriptionCreated={handlePrescriptionIssuance}
                />
              )}

              {activeTab === 'ai-recommendations' && (
                <AiRiskDashboard />
              )}

              {activeTab === 'user-management' && (
                <UserManagement 
                  patients={patients}
                  doctors={doctors}
                  onRefresh={refreshCoreStores}
                  triggerNotification={triggerGlobalNotification}
                />
              )}

              {activeTab === 'hospital-management' && (
                <HospitalManagement 
                  patients={patients}
                  triggerNotification={triggerGlobalNotification}
                />
              )}

              {activeTab === 'notifications-center' && (
                <NotificationCenter onRefreshTrigger={refreshCoreStores} />
              )}
            </>
          )}

        </div>

      </main>

      {/* Simple, Polished, Architecture disclaimer footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-500 py-5 text-center text-xs space-y-1 select-none">
        <p className="font-bold text-slate-800 font-display text-sm tracking-tight">MediCore AI &ndash; Enterprise Healthcare Intelligence Platform</p>
        <p className="font-mono text-[9px] text-slate-400">Validated under enterprise Express + Vite full-stack guidelines.</p>
        <p className="text-[9px] text-slate-400 max-w-4xl mx-auto px-4 leading-relaxed">
          The software provides automated triage analytics. These metrics are decision-support guidelines only and do not constitute certified pharmaceutical mandates. Always cross-evaluate active recommendations with a qualified clinical physician.
        </p>
      </footer>
    </div>
  );
}
