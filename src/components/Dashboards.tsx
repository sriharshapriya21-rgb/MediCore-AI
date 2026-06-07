import { useState, useEffect, FormEvent } from 'react';
import { 
  User, Calendar, Heart, Shield, Activity, Plus, Clock, FileText, 
  CheckCircle2, Bell, RefreshCw, BarChart2, Users, Sliders, ShieldAlert, FileMinus, Video,
  X, Check, Trash2, ChevronRight, FileSpreadsheet, Lock, AlertTriangle, Eye
} from 'lucide-react';
import { Patient, Doctor, Appointment, Prescription, MedicalRecord } from '../types';

// ==========================================
// PATIENT DASHBOARD COMPONENT WITH TIMELINE
// ==========================================
interface PatientDashboardProps {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  onBookAppointment: (doctorId: string, date: string, time: string, reason: string) => void;
  doctors: Doctor[];
}

export function PatientDashboard({
  patient,
  appointments,
  prescriptions,
  medicalRecords,
  onBookAppointment,
  doctors
}: PatientDashboardProps) {
  const [showBookApt, setShowBookApt] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [aptDate, setAptDate] = useState('2026-06-12');
  const [aptTime, setAptTime] = useState('11:00 AM');
  const [aptReason, setAptReason] = useState('Routine checks regarding asthma breathing levels.');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Dashboard right columns tab selection
  const [activeRightTab, setActiveRightTab] = useState<'rx' | 'history'>('history');
  
  // Custom cancellation inline check
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellingLoading, setCancellingLoading] = useState(false);

  // Modal zoom on historical medical reports
  const [zoomedTimelineRecord, setZoomedTimelineRecord] = useState<any | null>(null);

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    onBookAppointment(selectedDoctorId, aptDate, aptTime, aptReason);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookApt(false);
    }, 1800);
  };

  const handleConfirmCancelApt = async (aptId: string) => {
    setCancellingLoading(true);
    try {
      const res = await fetch(`/api/appointments/${aptId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Cancelled',
          notes: 'Cancelled by patient via MediCore AI Portal.'
        })
      });
      if (res.ok) {
        // Simple page refresh to synchronize data store safely
        window.location.reload();
      }
    } catch (err) {
      console.error("Cancellation error:", err);
    } finally {
      setCancellingLoading(false);
      setCancellingId(null);
    }
  };

  const patientApts = appointments.filter(a => a.patientId === patient.id || a.patientName === patient.name);
  const patientRxs = prescriptions.filter(r => r.patientId === patient.id || r.patientName === patient.name);
  
  // Static clinical historical timeline for portfolio depth
  const timelineEvents = [
    {
      id: "ev-1",
      date: "April 22, 2026",
      specialist: "Dr. Robert Chen, MD",
      specialty: "Pulmonology & Asthma Diagnostics",
      disease: "Asthmatic Reactive Spikes screening",
      diagnosis: "FEV1/FVC metrics mapping exhibits standard bronchodilator reversibility (14% shift). Pre-existing asthma allergen sensitivity confirmed under elevated Seattle tree pollen metrics.",
      status: "Verified in EMR",
      scanAsset: "Spirometry_PneumoScan_EMR_v12.pdf",
      attachmentSize: "3.4 MB"
    },
    {
      id: "ev-2",
      date: "January 14, 2026",
      specialist: "Dr. Elizabeth Vance, FACC",
      specialty: "Cardiovascular Tele-Health Unit",
      disease: "High-Sensitivity Diagnostic Electrocardiogram",
      diagnosis: "Standard 12-lead ECG traces exhibit normal sinus rhythm at 72 BPM. Left ventricular strain coefficients within nominal range. Blood pressure threshold logged at 118/76 mmHg.",
      status: "Verified in EMR",
      scanAsset: "ElectroCardioGraph_Ref_89AA.pdf",
      attachmentSize: "5.1 MB"
    },
    {
      id: "ev-3",
      date: "December 01, 2025",
      specialist: "MediCore AI Automated Triage",
      specialty: "Clinical Chemistry Laboratory",
      disease: "Annual Blood metabolic & lipid profiling",
      diagnosis: "Fasting blood plasma glucose maps at stable 92 mg/dL. HbA1c coefficient at optimal 5.4%. Cholesterol LDL registers at 104 mg/dL - low cardiovascular risk indicators present.",
      status: "Archived Record",
      scanAsset: "MetabolicLipidsPanel_Labs.csv",
      attachmentSize: "440 KB"
    },
    {
      id: "ev-4",
      date: "September 15, 2025",
      specialist: "Dr. Robert Chen, MD",
      specialty: "Primary Clinical Practice",
      disease: "Immunization Safeguards Protocol",
      diagnosis: "Standard Tetravalent Influenza vaccine safely administered (Batch Ref: FLUD-40291X). Next scheduled booster suggested in 12 months.",
      status: "Administered",
      scanAsset: "FluImmunization_Receipt_2025.pdf",
      attachmentSize: "1.2 MB"
    }
  ];

  return (
    <div id="patient-dashboard-view" className="space-y-4">
      {/* Quick Profile Health Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Profile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Patient Record</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{patient.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 block font-mono">Blood Group: {patient.bloodType}</span>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-rose-500 dark:text-rose-400">
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Chronic Conditions</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.chronicConditions.map((c) => (
                <span key={c} className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-305 text-[9px] border border-rose-105 dark:border-rose-900/30 font-semibold shadow-xs">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-600 dark:text-amber-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Allergies Checklist</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.allergies.length === 0 ? (
                <span className="text-slate-400 text-[10px]">No active allergies</span>
              ) : (
                patient.allergies.map((a) => (
                  <span key={a} className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-305 text-[9px] border border-amber-100 dark:border-amber-900/30 font-semibold shadow-xs">
                    {a}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Physician */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-650 dark:text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Primary Physician</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight">Dr. Robert Chen, MD</span>
            <span className="text-[9px] text-slate-450 dark:text-slate-400 uppercase tracking-wider font-mono">Specialist Care Unit</span>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming slots vs Right panel (Tabbed Prescriptions & Historical Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (Appointments & Booking) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 space-y-4 shadow-xs transition-colors duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-405" />
              <span>Scheduled Consultations</span>
            </h3>
            <button
              onClick={() => setShowBookApt(!showBookApt)}
              className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition shadow-xs active:scale-95 text-center"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showBookApt ? "Collapse Form" : "Request Consult"}</span>
            </button>
          </div>

          {showBookApt && (
            <form onSubmit={handleBook} className="bg-slate-50 dark:bg-slate-850 p-4 border border-slate-200 dark:border-slate-750 rounded-xl space-y-3 animate-fade-in text-xs">
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                Register MediCore AI Consultation
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apt-doc-select" className="text-[9px] text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-1 font-bold">Select Practitioner Specialist</label>
                  <select
                    id="apt-doc-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded text-xs text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer hover:border-slate-300"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="apt-date-input" className="text-[9px] text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-1 font-bold font-mono">Preferred Date</label>
                  <input
                    id="apt-date-input"
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded text-xs text-slate-800 dark:text-slate-100 focus:outline-none hover:border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apt-reason-input" className="text-[9px] text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-1 font-mono font-bold">Presenting Clinical Reason</label>
                <input
                  id="apt-reason-input"
                  type="text"
                  value={aptReason}
                  onChange={(e) => setAptReason(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded text-xs text-slate-800 dark:text-slate-100 focus:outline-none hover:border-slate-300"
                />
              </div>

              {bookingSuccess && (
                <div className="text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-205 text-emerald-700 dark:text-emerald-300 p-2 rounded-lg flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-bounce" />
                  <span>Interactive Consultation reserved! Gateway synchronization active.</span>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowBookApt(false)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-lg hover:text-slate-800 dark:hover:text-white hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-650 dark:bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-550 transition cursor-pointer"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          )}

          {/* Appointments list */}
          <div className="space-y-3">
            {patientApts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No scheduled appointments mapped inside profile databases.</p>
            ) : (
              patientApts.map((apt) => (
                <div key={apt.id} className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative overflow-hidden">
                  
                  {apt.status === 'Cancelled' && (
                    <div className="absolute top-0 right-0 p-1 bg-rose-500 text-white text-[8px] font-mono font-black uppercase tracking-widest rounded-bl">CANCELLED</div>
                  )}

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{apt.doctorName}</span>
                      <span className="text-[9px] bg-slate-150 text-slate-655 dark:bg-slate-800 dark:text-slate-350 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-750 font-medium">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 font-mono">
                      {apt.date} at {apt.time} • {apt.doctorSpecialty}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 italic">"{apt.reason}"</p>
                  </div>

                  {/* Stateful Cancellation widget */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                    {apt.status === 'Scheduled' && (
                      <>
                        {cancellingId === apt.id ? (
                          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-105 p-1 rounded-lg flex items-center gap-1">
                            <span className="text-[9px] font-mono text-rose-600 block pl-1 font-bold">Confirm?</span>
                            <button
                              onClick={() => handleConfirmCancelApt(apt.id)}
                              disabled={cancellingLoading}
                              className="p-1 text-emerald-500 hover:bg-emerald-50 rounded dark:hover:bg-slate-800 cursor-pointer"
                              title="Yes, cancel consultation"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setCancellingId(null)}
                              className="p-1 text-slate-405 hover:bg-slate-100 rounded dark:hover:bg-slate-800 cursor-pointer"
                              title="No, keep scheduled slot"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancellingId(apt.id)}
                            className="px-2.5 py-1 text-[10px] font-bold text-rose-500 border border-rose-100 dark:border-rose-900/30 bg-rose-50/20 rounded hover:bg-rose-50 dark:hover:bg-rose-955/40 cursor-pointer transition-all active:scale-95"
                          >
                            Cancel Visit
                          </button>
                        )}
                      </>
                    )}

                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-650 border border-indigo-100 dark:bg-indigo-950/45 dark:text-indigo-400 dark:border-indigo-900/30' :
                      apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-650 border border-emerald-100 dark:bg-emerald-955/45 dark:text-emerald-400 dark:border-emerald-900/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (TABBED Prescription slips OR Medical History Timeline) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 space-y-4 shadow-xs transition-colors duration-300">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            {/* Tabs Trigger */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveRightTab('history')}
                className={`px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                  activeRightTab === 'history'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <Activity className="h-3 w-3" />
                <span>Diagnostics History</span>
              </button>
              <button
                onClick={() => setActiveRightTab('rx')}
                className={`px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                  activeRightTab === 'rx'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <FileText className="h-3 w-3" />
                <span>e-Prescriptions Slips</span>
              </button>
            </div>

            <span className="text-[10px] uppercase font-mono font-black text-indigo-600 dark:text-indigo-400">EMR Secured Connection</span>
          </div>

          {/* RENDER ACTIVE TAB */}
          {activeRightTab === 'rx' ? (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 ScrollBar">
              {patientRxs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No e-prescriptions registered on this account.</p>
              ) : (
                patientRxs.map((rx) => (
                  <div key={rx.id} className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-805 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-slate-105 p-1 rounded font-mono text-[9px] dark:bg-slate-802 text-slate-400">
                      <span>REC-FILE: #{rx.id}</span>
                      <span>Auth Date: {rx.date}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Robert Chen, MD (Clinical Pulmonologist)</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Diagnoses matched: {rx.diagnoses.join(", ")}</span>
                    </div>
                    <div className="space-y-1 py-1.5 px-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                      {rx.medicines.map((m, id) => (
                        <div key={id} className="flex justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                          <span className="text-slate-600 dark:text-slate-400">{m.dosage} ({m.duration})</span>
                        </div>
                      ))}
                    </div>
                    {rx.notes && (
                      <span className="text-[9.5px] text-slate-450 dark:text-slate-400 italic block leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-1">
                        Doctor Note: "{rx.notes}"
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* MEDICAL HISTORY VERTICAL TIMELINE BLOCK */
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 ScrollBar relative">
              
              {/* Linked vertical line */}
              <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none"></div>

              {timelineEvents.map((ev) => (
                <div key={ev.id} className="flex gap-4 relative text-xs">
                  {/* Circle dot node on line */}
                  <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-805 rounded-full flex items-center justify-center text-indigo-655 dark:text-indigo-400 shrink-0 relative z-10 shadow-xs">
                    <Activity className="h-3 w-3 animate-pulse" />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl space-y-1.5 flex-1 shadow-2xs hover:border-slate-200 dark:hover:border-slate-700 transition">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{ev.date}</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-100/40 text-[9px] font-mono text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">{ev.status}</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-[12.5px] text-slate-900 dark:text-white font-display leading-tight">{ev.disease}</h4>
                      <p className="text-[10.5px] text-slate-505 dark:text-slate-400 font-medium">{ev.specialist} • <span className="italic">{ev.specialty}</span></p>
                    </div>

                    <p className="text-[10.5px] text-slate-600 dark:text-slate-350 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-1.5">
                      {ev.diagnosis}
                    </p>

                    {/* PDF Scan Attachment mockup link */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-2 py-0.8 rounded text-[9.5px] font-mono">
                        <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                        <span className="text-slate-655 dark:text-slate-350 leading-none">{ev.scanAsset} ({ev.attachmentSize})</span>
                      </div>

                      <button
                        onClick={() => setZoomedTimelineRecord(ev)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Interactive Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* MED HIST TIMELINE EXPANSION MODAL */}
      {zoomedTimelineRecord && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative overflow-hidden text-xs">
            <button
              onClick={() => setZoomedTimelineRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-base">EMR Bio-Record Document Secure Viewer</h3>
                <p className="text-[10px] text-slate-500 font-mono">Clinical Encryption Checksum: SHA-256 Verified</p>
              </div>
            </div>

            <div className="border border-slate-150 dark:border-slate-805 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl space-y-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <p className="border-b border-slate-202 pb-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">RECORD METADATA</p>
              <div><span className="text-slate-404">Date of Log:</span> {zoomedTimelineRecord.date}</div>
              <div><span className="text-slate-404">Practitioner:</span> {zoomedTimelineRecord.specialist} ({zoomedTimelineRecord.specialty})</div>
              <div><span className="text-slate-404">Clinical Focus:</span> {zoomedTimelineRecord.disease}</div>
              <p className="border-b border-slate-202 pt-1.5 pb-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">DIAGNOSTIC SYNTHESIS ANALYSIS</p>
              <p className="italic leading-relaxed font-sans text-slate-650 dark:text-slate-300 text-xs">"{zoomedTimelineRecord.diagnosis}"</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                <Shield className="h-4 w-4" />
                <span>Authorized HIPAA Protocol Secure File</span>
              </div>
              <button
                onClick={() => {
                  alert(`Successfully initiated secure socket pipe download for ${zoomedTimelineRecord.scanAsset}.`);
                  setZoomedTimelineRecord(null);
                }}
                className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold px-3.5 py-1.8 rounded-xl cursor-pointer"
              >
                Download File Asset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// DOCTOR DASHBOARD COMPONENT WITH DARK MODE
// ==========================================
interface DoctorDashboardProps {
  doctor: Doctor;
  appointments: Appointment[];
  prescriptions: Prescription[];
  onSelectAppointment: (apt: Appointment) => void;
}

export function DoctorDashboard({
  doctor,
  appointments,
  prescriptions,
  onSelectAppointment
}: DoctorDashboardProps) {
  const doctorApts = appointments.filter(a => a.doctorId === doctor.id || a.doctorName === doctor.name);

  return (
    <div id="doctor-dashboard-view" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Doctor Identity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold font-display">My Medical Active Status</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{doctor.name} ({doctor.specialty})</span>
            <span className="text-[10px] font-mono text-slate-505 dark:text-slate-450 block">System Rating: {doctor.rating} ★ Rating</span>
          </div>
        </div>

        {/* Clinical Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-650 dark:text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold font-display">Consult Hours Mapped</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.availability.map((day) => (
                <span key={day} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-305 text-[9px] border border-emerald-100 dark:border-emerald-900/30 font-mono font-bold">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Queues limit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-xs transition-colors duration-300">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold font-display">Pending Consult Queues</span>
            <span className="text-xs font-bold text-slate-950 dark:text-slate-100 block leading-normal">
              {doctorApts.filter(a => a.status === 'Scheduled').length} Waitlist Patients
            </span>
          </div>
        </div>

      </div>

      {/* Main Clinic Queue Rows */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 space-y-4 shadow-xs transition-colors duration-300">
        <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span>MediCore AI Consultation Queue (Active Handshakes)</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          {doctorApts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No active appointment lists registered in clinic logs.</p>
          ) : (
            doctorApts.map((apt) => (
              <div 
                key={apt.id} 
                className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800 rounded-xl transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
              >
                {apt.status === 'Scheduled' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 dark:bg-indigo-505"></div>
                )}
                <div className="space-y-0.5 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{apt.patientName}</span>
                    <span className="text-[9px] bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      Slot: {apt.time} ({apt.date})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Presented Issue: <span className="text-slate-800 dark:text-slate-300 italic">"{apt.reason}"</span></p>
                </div>

                <div className="flex gap-2 shrink-0 self-end md:self-auto select-none items-center">
                  {apt.status === 'Scheduled' && (
                    <button
                      onClick={() => onSelectAppointment(apt)}
                      className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold px-3.5 py-1.8 rounded-lg text-xs transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Enter Consultation Screen</span>
                    </button>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-650 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900/30' :
                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-650 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900/30' :
                    apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-955/40 dark:text-rose-400' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD COMPONENT WITH DARK MODE
// ==========================================
export function AdminDashboard() {
  const [metrics] = useState({
    activeUsers: 842,
    activeSpecialists: 14,
    consultationsCount: 198,
    systemUptime: "99.98%",
    apiLatency: "42ms"
  });

  const [notificationLogs, setNotificationLogs] = useState<{timestamp: string; title: string; message: string; channel: string}[]>([]);

  const fetchLogs = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="admin-dashboard-view" className="space-y-4">
      
      {/* Telemetry Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs">
        {/* User Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-3.5 rounded-xl text-center shadow-xs transition-all duration-300">
          <Users className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Platform Users</span>
          <span className="text-base font-extrabold text-slate-905 dark:text-white font-display">{metrics.activeUsers}</span>
        </div>

        {/* Specialists */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-3.5 rounded-xl text-center shadow-xs transition-all duration-300">
          <Activity className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400 mx-auto mb-1" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Specialists Logs</span>
          <span className="text-base font-extrabold text-slate-905 dark:text-white font-display">{metrics.activeSpecialists}</span>
        </div>

        {/* Total Consultations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-3.5 rounded-xl text-center shadow-xs transition-all duration-300">
          <Calendar className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400 mx-auto mb-1" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Total Consultations</span>
          <span className="text-base font-extrabold text-slate-905 dark:text-white font-display">{metrics.consultationsCount}</span>
        </div>

        {/* API Latency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-3.5 rounded-xl text-center shadow-xs transition-all duration-300">
          <Clock className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400 mx-auto mb-1" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Core API Latency</span>
          <span className="text-base font-extrabold text-slate-905 dark:text-white font-display text-indigo-600 dark:text-indigo-400">{metrics.apiLatency}</span>
        </div>

        {/* Platform Uptime */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-3.5 rounded-xl text-center shadow-xs transition-all duration-300">
          <Sliders className="h-4.5 w-4.5 text-emerald-650 dark:text-emerald-400 mx-auto mb-1" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono font-bold">Platform Uptime</span>
          <span className="text-base font-extrabold text-slate-905 dark:text-white font-display text-emerald-600 dark:text-emerald-400">{metrics.systemUptime}</span>
        </div>
      </div>

      {/* Executive Charts & Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* API load metrics graph plotted elegantly using custom SVGs */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 space-y-4 shadow-xs transition-all duration-300">
          <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white pb-2 border-b border-slate-105 dark:border-slate-800 flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4 text-indigo-600" />
            <span>MediCore AI API Load Telemetry Indexes</span>
          </h3>

          <div className="h-56 bg-slate-50 dark:bg-slate-850/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 relative flex flex-col justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-450 dark:text-slate-400 absolute top-3 left-4 uppercase">CLINICAL ENGINE CALLS (API STAGE LOAD / MIN)</span>
            
            {/* SVG Plot */}
            <svg className="w-full h-32 mt-4 text-indigo-600/10 dark:text-indigo-400/5 animate-pulse" viewBox="0 0 500 100" preserveAspectRatio="none">
              <path
                d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 T500,10 L500,100 L0,100 Z"
                fill="currentColor"
              />
              <path
                d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 T500,10"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <circle cx="100" cy="60" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="200" cy="30" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="400" cy="20" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5 animate-bounce" />
            </svg>

            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>08:00 AM</span>
              <span>10:00 AM (Active Peak)</span>
              <span>12:00 PM (Current UTC)</span>
            </div>
          </div>
        </div>

        {/* Real-time SMTP gateway output / logs tracker */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-4.5 space-y-4 shadow-xs transition-all duration-300">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-indigo-600" />
              <span>Simulated Notification Gateway</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-755 text-slate-500 dark:text-slate-400 uppercase">
              SMTP Logger
            </span>
          </div>

          <div className="space-y-2.5 h-56 overflow-y-auto ScrollBar pr-1 text-xs">
            {notificationLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center p-4">
                <p className="text-slate-400 text-xs italic">No notifications registered in active buffers.</p>
              </div>
            ) : (
              notificationLogs.map((log, id) => (
                <div key={id} className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-lg space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[9px] font-mono">{log.channel}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-800 dark:text-white text-[11px] leading-snug">{log.title}</p>
                  <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed font-sans">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
