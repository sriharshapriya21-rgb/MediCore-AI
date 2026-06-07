import { useState } from 'react';
import { 
  Building, Activity, Plus, Trash2, Sliders, AlertCircle, 
  Clock, Check, Eye, Users, Shield, Sparkles, LogIn, LogOut, CheckCircle, X
} from 'lucide-react';
import { Patient } from '../types';

interface HospitalManagementProps {
  patients: Patient[];
  triggerNotification: (msg: string) => void;
}

interface ICUBed {
  id: string;
  roomNumber: string;
  status: 'Occupied' | 'Available' | 'Cleaning';
  assignedPatientId?: string;
  assignedPatientName?: string;
  ventilatorActive: boolean;
  notes?: string;
}

export default function HospitalManagement({
  patients,
  triggerNotification
}: HospitalManagementProps) {
  // Mock ICU Beds Store
  const [beds, setBeds] = useState<ICUBed[]>([
    { id: '1', roomNumber: 'ICU-101', status: 'Occupied', assignedPatientId: 'pat-1', assignedPatientName: 'Sarah Jenkins', ventilatorActive: true, notes: 'Asthma exacerbation under monitoring.' },
    { id: '2', roomNumber: 'ICU-102', status: 'Occupied', assignedPatientId: 'pat-2', assignedPatientName: 'Alex Carter', ventilatorActive: false, notes: 'Post-diabetic hyperglycemia check.' },
    { id: '3', roomNumber: 'ICU-103', status: 'Cleaning', ventilatorActive: false },
    { id: '4', roomNumber: 'ICU-104', status: 'Available', ventilatorActive: false },
    { id: '5', roomNumber: 'ICU-105', status: 'Occupied', assignedPatientId: 'pat-3', assignedPatientName: 'Liam Mitchell', ventilatorActive: true, notes: 'Seasonal respiratory shock support.' },
    { id: '6', roomNumber: 'ICU-106', status: 'Available', ventilatorActive: false },
    { id: '7', roomNumber: 'ICU-107', status: 'Available', ventilatorActive: false },
    { id: '8', roomNumber: 'ICU-108', status: 'Cleaning', ventilatorActive: false },
  ]);

  // ER Waiting patients
  const [erWaitingQueue, setErWaitingQueue] = useState([
    { id: 'er-1', name: 'Nora Higgins', etaMinutes: 8, priority: 'URGENT', issue: 'Suspected respiratory infection' },
    { id: 'er-2', name: 'James Morrison', etaMinutes: 24, priority: 'ROUTINE', issue: 'Suture closure review' },
    { id: 'er-3', name: 'Oliver Twist', etaMinutes: 1, priority: 'CRITICAL', issue: 'Acute chest pain' },
  ]);

  // Department allocations indicators
  const [departments] = useState([
    { name: 'General Medicine ICU Unit', ratio: 88, color: '#6366f1' },
    { name: 'Cardiology Intensive Ward', ratio: 92, color: '#ef4444' },
    { name: 'Pediatrics Respiratory Wing', ratio: 64, color: '#10b981' },
    { name: 'Neurology Observation Suite', ratio: 75, color: '#f59e0b' },
  ]);

  // Active allocating bed index
  const [allocatingBedId, setAllocatingBedId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const handleToggleBedStatus = (bedId: string, currentStatus: ICUBed['status']) => {
    let nextStatus: ICUBed['status'] = 'Available';
    if (currentStatus === 'Available') nextStatus = 'Occupied';
    else if (currentStatus === 'Occupied') nextStatus = 'Cleaning';
    else nextStatus = 'Available';

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        const resetPatch = nextStatus !== 'Occupied' ? { assignedPatientId: undefined, assignedPatientName: undefined, ventilatorActive: false, notes: undefined } : {};
        return { ...b, status: nextStatus, ...resetPatch };
      }
      return b;
    }));

    triggerNotification(`Bed ${beds.find(b => b.id === bedId)?.roomNumber} status shifted to: ${nextStatus.toUpperCase()}`);
  };

  const handleToggleVentilator = (bedId: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId && b.status === 'Occupied') {
        const nextVentState = !b.ventilatorActive;
        triggerNotification(`Ventilation safety support updated for ${b.roomNumber}.`);
        return { ...b, ventilatorActive: nextVentState };
      }
      return b;
    }));
  };

  const handleAllocatePatient = (bedId: string) => {
    const targetPatient = patients.find(p => p.id === selectedPatientId);
    if (!targetPatient) return;

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'Occupied',
          assignedPatientId: targetPatient.id,
          assignedPatientName: targetPatient.name,
          ventilatorActive: false,
          notes: 'Admitted via SaaS Admin platform controller.'
        };
      }
      return b;
    }));

    triggerNotification(`Patient "${targetPatient.name}" securely matched to room ${beds.find(b => b.id === bedId)?.roomNumber}!`);
    setAllocatingBedId(null);
    setSelectedPatientId('');
  };

  const handleDischargePatient = (bedId: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed) return;

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'Cleaning',
          assignedPatientId: undefined,
          assignedPatientName: undefined,
          ventilatorActive: false,
          notes: undefined
        };
      }
      return b;
    }));

    triggerNotification(`Patient "${targetBed.assignedPatientName}" discharged. Terminal clean initiated.`);
  };

  const handleAdmitErPatient = (erId: string) => {
    const erPatient = erWaitingQueue.find(p => p.id === erId);
    if (!erPatient) return;

    // Put patient into first available ICU Bed
    const firstAvailable = beds.find(b => b.status === 'Available');
    if (!firstAvailable) {
      triggerNotification("No Available ICU Beds. Please trigger a terminal clean or discharge patients.");
      return;
    }

    setBeds(prev => prev.map(b => {
      if (b.id === firstAvailable.id) {
        return {
          ...b,
          status: 'Occupied',
          assignedPatientName: erPatient.name,
          ventilatorActive: erPatient.priority === 'CRITICAL',
          notes: `Emergency admission for: ${erPatient.issue}.`
        };
      }
      return b;
    }));

    setErWaitingQueue(prev => prev.filter(p => p.id !== erId));
    triggerNotification(`ER Intake: "${erPatient.name}" admitted to ${firstAvailable.roomNumber}.`);
  };

  const activeBedsCount = beds.filter(b => b.status === 'Occupied').length;
  const overallOccupancyRatio = Math.round((activeBedsCount / beds.length) * 100);

  return (
    <div className="space-y-6" id="hospital-management-root">
      
      {/* Top Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        
        {/* Occupancy Indicator */}
        <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-450 uppercase block">Total ICU Bed Occupancy</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-display mt-0.5 block">{activeBedsCount} / {beds.length} Beds</span>
            <span className="text-[9.5px] text-indigo-500 font-mono mt-0.5 block font-bold">{overallOccupancyRatio}% occupied capacity</span>
          </div>
          <Building className="h-8 w-8 text-indigo-500 shrink-0" />
        </div>

        {/* Emergency count */}
        <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-450 uppercase block">ER Triage Queue</span>
            <span className="text-xl font-black text-rose-500 font-display mt-0.5 block">{erWaitingQueue.length} Active Intakes</span>
            <span className="text-[9.5px] text-slate-450 font-mono mt-0.5 block">Avg Intake delay: 11 mins</span>
          </div>
          <Clock className="h-8 w-8 text-rose-500 shrink-0 animate-pulse" />
        </div>

        {/* Ventilation count */}
        <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-450 uppercase block">Active Ventilator Nodes</span>
            <span className="text-xl font-black text-emerald-500 font-display mt-0.5 block">
              {beds.filter(b => b.ventilatorActive).length} Online Respiratory Nodes
            </span>
            <span className="text-[9.5px] text-emerald-500 font-mono mt-0.5 block font-bold">Stable supply metrics</span>
          </div>
          <Activity className="h-8 w-8 text-emerald-500 shrink-0" />
        </div>

        {/* Facility Alerts */}
        <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-450 uppercase block">Facility Alerts Flags</span>
            <span className="text-xl font-black text-indigo-500 font-display mt-0.5 block">0 Active Issues</span>
            <span className="text-[9.5px] text-emerald-505 font-mono mt-0.5 block font-bold">Standard Operations Status</span>
          </div>
          <Shield className="h-8 w-8 text-indigo-500 shrink-0" />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Beds GRID Monitor (Col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider font-display text-slate-850 dark:text-white">ICU Bed Allocation Core</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time status loops for intensive care units.</p>
            </div>
            
            <div className="flex gap-2 text-[9.5px] font-mono select-none">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span>Cleaning</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-505"></span>Available</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-600"></span>Occupied</span>
            </div>
          </div>

          {/* ICU Bed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {beds.map((bed) => (
              <div 
                key={bed.id} 
                className={`p-3.5 border rounded-xl flex flex-col justify-between h-40 transition relative overflow-hidden ${
                  bed.status === 'Occupied' ? 'bg-indigo-50/20 dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/30' :
                  bed.status === 'Cleaning' ? 'bg-amber-50/20 dark:bg-slate-900/40 border-amber-200 dark:border-amber-900/20' :
                  'bg-white dark:bg-slate-905 border-slate-205 dark:border-slate-800 hover:border-slate-310'
                }`}
              >
                {/* Bed Identifier Tag */}
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-extrabold text-slate-900 dark:text-white font-mono">{bed.roomNumber}</span>
                  
                  {/* Status Indicator Badge */}
                  <button 
                    onClick={() => handleToggleBedStatus(bed.id, bed.status)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-lg cursor-pointer ${
                      bed.status === 'Occupied' ? 'bg-indigo-600 text-white shadow-3xs' :
                      bed.status === 'Cleaning' ? 'bg-amber-400 text-slate-900' :
                      'bg-emerald-500 text-white'
                    }`}
                    title="Change Bed Status manually"
                  >
                    {bed.status.toUpperCase()}
                  </button>
                </div>

                {/* Patient / Ventilator Metrics */}
                <div className="flex-1 flex flex-col justify-center py-2.5">
                  {bed.status === 'Occupied' ? (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono text-slate-450 font-bold block">Patient Checked-in:</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">{bed.assignedPatientName || 'Anonymous EMR File'}</span>
                      {bed.notes && <span className="text-[10px] text-slate-500 italic block truncate">"{bed.notes}"</span>}
                    </div>
                  ) : bed.status === 'Cleaning' ? (
                    <div className="text-center py-1 font-mono text-amber-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 animate-pulse">
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Chemical Cycle Running</span>
                    </div>
                  ) : (
                    <div className="text-[10.5px] text-slate-400 italic font-mono uppercase text-center py-2 border border-dashed border-slate-150 dark:border-slate-800 rounded-lg">
                      Decontaminated & Vacant
                    </div>
                  )}
                </div>

                {/* Bed Control Buttons */}
                <div className="border-t border-slate-100 dark:border-slate-820 pt-2 flex items-center justify-between text-[10px]">
                  
                  {/* Ventilator Toggle */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9.5px] font-mono text-slate-450 font-bold">Resp Vent Support:</span>
                    <button
                      onClick={() => handleToggleVentilator(bed.id)}
                      disabled={bed.status !== 'Occupied'}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold ${
                        bed.status !== 'Occupied' ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' :
                        bed.ventilatorActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {bed.ventilatorActive ? 'ACTIVE' : 'STBY'}
                    </button>
                  </div>

                  {/* Allocation Toggles */}
                  {bed.status === 'Occupied' ? (
                    <button
                      onClick={() => handleDischargePatient(bed.id)}
                      className="text-rose-500 font-bold hover:underline font-mono"
                    >
                      Discharge File
                    </button>
                  ) : bed.status === 'Available' ? (
                    <div className="relative">
                      {allocatingBedId === bed.id ? (
                        <div className="absolute right-0 bottom-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-802 p-2 rounded-lg shadow-xl z-20 flex gap-1.5 items-center w-52">
                          <select
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="bg-transparent text-[10px] border border-slate-200 rounded p-1 max-w-[120px] dark:text-white"
                          >
                            <option value="">Choose...</option>
                            {patients.map(p => (
                              <option key={p.id} value={p.id} className="text-slate-800">{p.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAllocatePatient(bed.id)}
                            className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setAllocatingBedId(null)}
                            className="p-1 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAllocatingBedId(bed.id); setSelectedPatientId(''); }}
                          className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline font-mono"
                        >
                          Allocate
                        </button>
                      )}
                    </div>
                  ) : null}

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ER Queue & Loading percentages (Col-span-4) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
          
          {/* ER Triage queue */}
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-2xs space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-850 dark:text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-rose-500 shrink-0" />
                <span>ER Telehealth Triage Queue</span>
              </h4>
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {erWaitingQueue.length === 0 ? (
                <p className="text-center italic text-slate-400 text-[10.5px] py-6 uppercase font-mono">Triage queue completely clear!</p>
              ) : (
                erWaitingQueue.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-802 rounded-xl flex justify-between items-center text-xs gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white">{item.name}</span>
                        <span className={`px-1 py-0.2 text-[8px] font-mono font-black uppercase rounded ${
                          item.priority === 'CRITICAL' ? 'bg-rose-500 text-white' :
                          item.priority === 'URGENT' ? 'bg-amber-400 text-slate-900' :
                          'bg-indigo-50 text-indigo-550 dark:bg-indigo-950'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-550 dark:text-slate-400 font-mono italic">"{item.issue}"</p>
                      <p className="text-[9.5px] text-slate-400 font-mono">Triage wait: {item.etaMinutes} mins eta</p>
                    </div>

                    <button
                      onClick={() => handleAdmitErPatient(item.id)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-755 hover:border-indigo-400 rounded text-[9.5px] font-bold text-indigo-550 dark:text-indigo-400 cursor-pointer transition whitespace-nowrap active:scale-95"
                    >
                      Admit Ward
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Loading Ratios */}
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-2xs space-y-3.5 flex-1">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-850 dark:text-white">Department Utilization</h4>
            </div>

            <div className="space-y-3 py-1">
              {departments.map((dept, id) => (
                <div key={id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-650 dark:text-slate-350">
                    <span>{dept.name}</span>
                    <span className="font-mono text-slate-900 dark:text-white">{dept.ratio}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-750 ease-out"
                      style={{
                        width: `${dept.ratio}%`,
                        backgroundColor: dept.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
