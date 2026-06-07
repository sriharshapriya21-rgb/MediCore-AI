import { useState, useEffect } from 'react';
import { 
  Bell, Mail, AlertOctagon, Calendar, Trash2, CheckCircle, 
  Filter, Volume2, ShieldAlert, BadgeInfo 
} from 'lucide-react';

interface NotificationLog {
  timestamp: string;
  title: string;
  message: string;
  channel: string;
  level?: 'info' | 'critical' | 'alert';
}

interface NotificationCenterProps {
  onRefreshTrigger?: () => void;
}

export default function NotificationCenter({ onRefreshTrigger }: NotificationCenterProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'critical' | 'scheduled' | 'smtp'>('all');
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [advisoryBannerText, setAdvisoryBannerText] = useState<string | null>(null);

  const fetchNotificationLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setNotificationLogs(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationLogs();
    const interval = setInterval(fetchNotificationLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter logs locally according to selected tab categories
  const filteredLogs = notificationLogs.filter(log => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'critical') {
      return log.title.toLowerCase().includes('critical') || log.title.toLowerCase().includes('warning') || log.level === 'critical';
    }
    if (activeCategory === 'scheduled') {
      return log.title.toLowerCase().includes('schedule') || log.title.toLowerCase().includes('appointment') || log.message.toLowerCase().includes('reserve');
    }
    if (activeCategory === 'smtp') {
      return log.channel.toLowerCase().includes('smtp') || log.channel.toLowerCase().includes('email');
    }
    return true;
  });

  const handleClearLogs = async () => {
    try {
      // Clear logs endpoint simulation
      const res = await fetch('/api/notifications/clear', { method: 'POST' });
      if (res.ok) {
        setNotificationLogs([]);
        if (onRefreshTrigger) onRefreshTrigger();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateAlertTrigger = () => {
    // Generate a high priority dummy medical breach or warning client-side for sandbox validation
    setAdvisoryBannerText("Advisory parameter registered: Added a Critical Health Warning to the telemetry stream logs.");
    
    // Quick API trigger via dummy endpoint if preferred, or local array push
    const mockupCriticalAlert: NotificationLog = {
      timestamp: new Date().toISOString(),
      title: "🔥 CRITICAL ALERT: Metabolic Index Anomaly",
      message: "Patient Sarah Jenkins registered a spirometry allergen reactive coefficient matching 18% respiratory drop warning indexes. Triage advised.",
      channel: "Emergency Core AI",
      level: "critical"
    };
    
    setNotificationLogs(prev => [mockupCriticalAlert, ...prev]);
    setTimeout(() => {
      setAdvisoryBannerText(null);
    }, 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 font-sans" id="notification-center-module">
      
      {/* Super Alert message */}
      {advisoryBannerText && (
        <div className="bg-rose-955/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl flex items-start gap-2.5 text-xs animate-fade-in font-semibold">
          <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shadow-xs mt-0.5" />
          <p>{advisoryBannerText}</p>
        </div>
      )}

      {/* Header section with counts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 dark:bg-rose-955/40 rounded-xl text-rose-500">
            <Bell className="h-5 w-5 animate-swing" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider font-display text-slate-905 dark:text-white leading-none">Security &amp; Audit Operations Center</h3>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">HIPAA Event Logs &bull; Real-time AI Triage &bull; Dispatch Archives</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleSimulateAlertTrigger}
            className="px-3 py-1.8 bg-amber-500 hover:bg-amber-450 text-slate-950 text-[10.5px] font-extrabold rounded-lg transition text-center cursor-pointer shadow-xs"
          >
            🔥 Simulate Critical Warning
          </button>
          
          <button
            onClick={handleClearLogs}
            disabled={notificationLogs.length === 0}
            className="p-1.8 text-slate-405 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:border-slate-300 transition disabled:opacity-40 cursor-pointer"
            title="Purge logs logs"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition text-center ${
            activeCategory === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Bundles ({notificationLogs.length})
        </button>
        <button
          onClick={() => setActiveCategory('critical')}
          className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition text-center ${
            activeCategory === 'critical' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-slate-500 hover:text-indigo-400'
          }`}
        >
          Critical Risks
        </button>
        <button
          onClick={() => setActiveCategory('scheduled')}
          className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition text-center ${
            activeCategory === 'scheduled' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Scheduled Slots
        </button>
        <button
          onClick={() => setActiveCategory('smtp')}
          className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition text-center ${
            activeCategory === 'smtp' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-805'
          }`}
        >
          SMTP Channels
        </button>
      </div>

      {/* Notification Rows List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto ScrollBar pr-1 text-xs">
        {isLoading && filteredLogs.length === 0 ? (
          <div className="py-12 flex items-center justify-center gap-2">
            <span className="w-4.5 h-4.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-slate-400">Syncing live buffers...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-slate-350 dark:text-slate-600 mx-auto" />
            <p className="text-slate-400 italic">No notifications registered in active filters.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const isCritical = log.title.toLowerCase().includes('critical') || log.title.toLowerCase().includes('warning') || log.level === 'critical';
            const isApt = log.title.toLowerCase().includes('schedule') || log.title.toLowerCase().includes('appointment');

            return (
              <div 
                key={index} 
                className={`p-3.5 border rounded-xl relative overflow-hidden transition-all duration-300 flex items-start gap-3.5 text-left ${
                  isCritical 
                    ? 'bg-rose-50/45 dark:bg-rose-955/20 border-rose-150 dark:border-rose-900/30' 
                    : isApt 
                      ? 'bg-indigo-50/45 dark:bg-indigo-955/15 border-indigo-150 dark:border-indigo-900/30' 
                      : 'bg-slate-50/60 dark:bg-slate-905 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left strip marker */}
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  isCritical ? 'bg-rose-500' : isApt ? 'bg-indigo-600' : 'bg-slate-400'
                }`}></div>

                {/* Level icon */}
                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                  isCritical ? 'bg-rose-100 text-rose-600 dark:bg-rose-955 dark:text-rose-300' :
                  isApt ? 'bg-indigo-100 text-indigo-650 dark:bg-indigo-955 dark:text-indigo-400' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {isCritical ? <AlertOctagon className="h-4.5 w-4.5" /> :
                   isApt ? <Calendar className="h-4.5 w-4.5" /> :
                   <Mail className="h-4.5 w-4.5" />}
                </div>

                {/* Details */}
                <div className="space-y-0.8 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-650 dark:text-indigo-400 block truncate">
                      {log.channel}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-[11.5px] leading-tight block">
                    {log.title}
                  </h4>
                  
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                    {log.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
