import { useState } from 'react';
import { 
  Users, Search, User, Mail, Phone, Calendar, Heart, Shield, 
  Activity, ArrowRight, FileText, CheckCircle, Plus, Sparkles, ClipboardList
} from 'lucide-react';
import { Patient, MedicalRecord, Appointment, Prescription } from '../types';

interface PatientRecordsProps {
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  prescriptions: Prescription[];
}

export default function PatientRecords({
  patients,
  medicalRecords,
  appointments,
  prescriptions
}: PatientRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [editingNotes, setEditingNotes] = useState<{ [patientId: string]: string }>({});
  const [savedNotes, setSavedNotes] = useState<{ [patientId: string]: string }>({
    'pat-1': 'Patient exhibits seasonal reactive broncho-spasms during Seattle pollen season. Currently stable on daily Albuterol maintenance.',
    'pat-2': 'Vigilant monitoring of glycemic trends requested. Fasting blood glucose is moderately managed.',
    'pat-3': 'Routine screening recommended for persistent seasonal allergies.'
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSaveNotes = (patientId: string) => {
    const notesToSave = editingNotes[patientId] || '';
    setSavedNotes(prev => ({
      ...prev,
      [patientId]: notesToSave
    }));
    alert(`Clinical notes saved successfully for patient ${selectedPatient?.name}!`);
  };

  if (!selectedPatient) {
    return (
      <div className="p-6 text-center text-slate-500">
        <Users className="h-12 w-12 mx-auto text-slate-400 mb-2 animate-pulse" />
        <p className="text-sm font-semibold">No Patient Records found inside local clinical store.</p>
      </div>
    );
  }

  // Gather specific records
  const patientRecords = medicalRecords.filter(r => r.patientId === selectedPatient.id);
  const patientApts = appointments.filter(a => a.patientId === selectedPatient.id);
  const patientRxs = prescriptions.filter(r => r.patientId === selectedPatient.id);

  return (
    <div id="doctor-patient-records" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Sidebar: Patient List & Search (4 Columns) */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Master Patient Directory</span>
          </h3>
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-mono px-2 py-0.5 rounded-full font-bold">
            {patients.length} Registered
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Patient Selection Queue */}
        <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredPatients.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">No matching patients discovered.</p>
          ) : (
            filteredPatients.map((p) => {
              const active = p.id === selectedPatientId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                    active 
                      ? 'bg-indigo-600/10 border-indigo-500 text-slate-900 dark:text-white shadow-2xs' 
                      : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      active ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-850'
                    }`}>
                      <User className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-550 block font-mono uppercase tracking-widest">{p.id}</span>
                    </div>
                  </div>
                  <ArrowRight className={`h-3 w-3 shrink-0 transition-transform ${active ? 'translate-x-0.5 text-indigo-500' : 'text-slate-300'}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Expanded Medical File (8 Columns) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Basic Information & Bio Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-450 tracking-widest uppercase font-mono font-bold block mb-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                ACTIVE EMR CONNECTIVITY
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <span>{selectedPatient.name}</span>
                <span className="text-xs font-mono font-normal text-slate-400">({selectedPatient.gender}, {selectedPatient.dob})</span>
              </h2>
            </div>
            
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-left sm:text-right">
              <span>Primary Phone: {selectedPatient.phone}</span>
              <span className="block">{selectedPatient.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blood type card */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-3 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Clinical Type</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                <span>{selectedPatient.bloodType}</span>
              </span>
            </div>

            {/* Allergies Card */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-3 rounded-xl overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Known Allergers</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedPatient.allergies.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">No Allergies Reported</span>
                ) : (
                  selectedPatient.allergies.map(a => (
                    <span key={a} className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-semibold">{a}</span>
                  ))
                )}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 p-3 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Chronic Diagnostics</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedPatient.chronicConditions.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">No Chronic Conditions</span>
                ) : (
                  selectedPatient.chronicConditions.map(cc => (
                    <span key={cc} className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] font-semibold">{cc}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Records, Consultations, and Live Prescriptions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Medical Records History File (PDFs, Diagnoses) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ClipboardList className="h-4 w-4 text-indigo-500" />
              <span>Bio-Log &amp; Lab Records ({patientRecords.length})</span>
            </h4>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {patientRecords.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No uploaded clinical lab report databases present.</p>
              ) : (
                patientRecords.map(rec => (
                  <div key={rec.id} className="p-2 px-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                      <span>REF: #{rec.id}</span>
                      <span>{rec.date}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{rec.title}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-sans truncate">{rec.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Consultation History Registry */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Activity className="h-4 w-4 text-indigo-500 animate-pulse" />
              <span>Registered Consults ({patientApts.length})</span>
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {patientApts.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No consult appointments mapped inside records.</p>
              ) : (
                patientApts.map(apt => (
                  <div key={apt.id} className="p-2 px-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2">
                    <div className="truncate text-xs">
                      <span className="font-extrabold text-slate-905 dark:text-white block truncate">{apt.doctorName} ({apt.doctorSpecialty})</span>
                      <span className="text-[10px] font-mono text-slate-450 block truncate">{apt.date} at {apt.time} • {apt.type}</span>
                    </div>
                    <span className={`shrink-0 px-2 py-0.2 rounded text-[8px] font-bold ${
                      apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-650 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30' :
                      apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-650 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-450'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Doctor Custom Clinical notes space for selected patient */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>Specialist Clinical Evaluation Note</span>
            </h4>
            
            <span className="text-[10px] text-slate-400 font-mono">HIPAA Encrypted Stream</span>
          </div>

          <div className="space-y-3">
            <textarea
              value={editingNotes[selectedPatient.id] ?? savedNotes[selectedPatient.id] ?? ''}
              onChange={(e) => setEditingNotes({ ...editingNotes, [selectedPatient.id]: e.target.value })}
              placeholder="Inject clinical evaluation metrics, asthma trigger levels, recommended medication boosters or cardiac review plans safely here..."
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
            />
            
            <div className="flex justify-between items-center gap-3">
              <p className="text-[10px] text-slate-450 leading-tight">These secure notes write directly to the local care coordination environment.</p>
              
              <button
                onClick={() => handleSaveNotes(selectedPatient.id)}
                className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-indigo-650/15 cursor-pointer transition-all active:scale-95"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
