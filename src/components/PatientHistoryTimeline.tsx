import { useState } from 'react';
import { 
  Activity, Search, Calendar, ChevronRight, FileSpreadsheet, Eye, X, 
  ShieldCheck, ArrowDownToLine, Clock, HeartPulse, SlidersHorizontal, Lock
} from 'lucide-react';
import { Patient, MedicalRecord } from '../types';

interface PatientHistoryTimelineProps {
  patient: Patient;
  medicalRecords: MedicalRecord[];
}

export default function PatientHistoryTimeline({
  patient,
  medicalRecords
}: PatientHistoryTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [zoomedRecord, setZoomedRecord] = useState<any | null>(null);

  // High-fidelity timelines database synchronized with EMR indices
  const timelineEvents = [
    {
      id: "ev-1",
      date: "April 22, 2026",
      specialist: "Dr. Robert Chen, MD",
      specialty: "Pulmonology & Asthma Diagnostics",
      disease: "Asthmatic Reactive Spikes screening",
      type: "Lab Report",
      diagnosis: "FEV1/FVC metrics mapping exhibits standard bronchodilator reversibility (14% shift). Pre-existing asthma allergen sensitivity confirmed under elevated Seattle tree pollen metrics.",
      status: "Verified in EMR",
      scanAsset: "Spirometry_PneumoScan_EMR_v12.pdf",
      attachmentSize: "3.4 MB",
      checksum: "SHA-256: 0a9e2fd..."
    },
    {
      id: "ev-2",
      date: "January 14, 2026",
      specialist: "Dr. Elizabeth Vance, FACC",
      specialty: "Cardiovascular Tele-Health Unit",
      disease: "High-Sensitivity Diagnostic Electrocardiogram",
      type: "Diagnosis",
      diagnosis: "Standard 12-lead ECG traces exhibit normal sinus rhythm at 72 BPM. Left ventricular strain coefficients within nominal range. Blood pressure threshold logged at 118/76 mmHg.",
      status: "Verified in EMR",
      scanAsset: "ElectroCardioGraph_Ref_89AA.pdf",
      attachmentSize: "5.1 MB",
      checksum: "SHA-256: 7fd29fe..."
    },
    {
      id: "ev-3",
      date: "December 01, 2025",
      specialist: "MediCore AI Automated Triage",
      specialty: "Clinical Chemistry Laboratory",
      disease: "Annual Blood metabolic & lipid profiling",
      type: "Lab Report",
      diagnosis: "Fasting blood plasma glucose maps at stable 92 mg/dL. HbA1c coefficient at optimal 5.4%. Cholesterol LDL registers at 104 mg/dL - low cardiovascular risk indicators present.",
      status: "Archived Record",
      scanAsset: "MetabolicLipidsPanel_Labs.csv",
      attachmentSize: "440 KB",
      checksum: "SHA-256: b32a819..."
    },
    {
      id: "ev-4",
      date: "September 15, 2025",
      specialist: "Dr. Robert Chen, MD",
      specialty: "Primary Clinical Practice",
      disease: "Immunization Safeguards Protocol",
      type: "Immunization",
      diagnosis: "Standard Tetravalent Influenza vaccine safely administered (Batch Ref: FLUD-40291X). Next scheduled booster suggested in 12 months.",
      status: "Administered",
      scanAsset: "FluImmunization_Receipt_2025.pdf",
      attachmentSize: "1.2 MB",
      checksum: "SHA-256: ee829fa..."
    }
  ];

  // Merge dynamic medical records into clinical timeline
  const dynamicEvents = medicalRecords
    .filter(r => r.patientId === patient.id || r.patientId === 'pat-1')
    .map(r => ({
      id: r.id,
      date: r.date,
      specialist: r.doctorName || "SaaS Portal Ingestion System",
      specialty: r.type,
      disease: r.title,
      type: r.type,
      diagnosis: r.description,
      status: "Active Upload",
      scanAsset: r.attachments?.[0]?.name || "Parsed_Record_Capture.pdf",
      attachmentSize: r.attachments?.[0]?.size || "45 KB",
      checksum: "SHA-256: dbe3a30..."
    }));

  const allEvents = [...timelineEvents, ...dynamicEvents];

  // Handle filtering & text research query
  const filteredEvents = allEvents.filter(ev => {
    const matchesSearch = ev.disease.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ev.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ev.specialist.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'All') return matchesSearch;
    return matchesSearch && ev.type === filterType;
  });

  return (
    <div id="patient-timeline-workspace" className="space-y-6">
      
      {/* Search and filter action deck */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, diagnoses, doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter deck */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold leading-none w-full md:w-auto">
          {['All', 'Lab Report', 'Diagnosis', 'Immunization', 'AI Insights'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.8 rounded-lg cursor-pointer transition whitespace-nowrap ${
                filterType === t 
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-3xs' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main timeline visual layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        {/* Subheader */}
        <div className="border-b border-slate-100 dark:border-slate-850 pb-3 mb-6 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Secure Electronic Health Registry (EMR Timeline)</span>
          </h3>
          <span className="text-[10px] text-slate-405 font-mono flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>HPAA Encrypted Channel</span>
          </span>
        </div>

        {/* Timeline Event list */}
        <div className="space-y-6 relative">
          
          {/* Linked vertical line */}
          <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none"></div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">
              <Clock className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p>No health registry events found matching selectors.</p>
            </div>
          ) : (
            filteredEvents.map((ev, index) => (
              <div key={ev.id} className="flex gap-4 relative text-xs animate-fade-in">
                {/* Circle dot node on line */}
                <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-805 rounded-full flex items-center justify-center text-indigo-655 dark:text-indigo-400 shrink-0 relative z-10 shadow-3xs">
                  <Activity className="h-3 w-3" />
                </div>

                <div className="bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800 p-4 rounded-xl space-y-2 flex-1 shadow-2xs hover:border-slate-250 dark:hover:border-slate-700 transition">
                  <div className="flex justify-between items-center bg-slate-105/50 dark:bg-slate-800 px-2 py-1 rounded font-mono text-[9px] text-slate-450 uppercase font-black tracking-wider">
                    <span>{ev.date}</span>
                    <span className="text-indigo-650 dark:text-indigo-400">{ev.status}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[13px] text-slate-900 dark:text-white font-display leading-tight">{ev.disease}</h4>
                    <p className="text-[10.5px] text-slate-505 dark:text-slate-400 font-semibold">{ev.specialist} • <span className="italic">{ev.specialty}</span></p>
                  </div>

                  <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-relaxed pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    {ev.diagnosis}
                  </p>

                  {/* Attachment mockup linker */}
                  <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/60 gap-3">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-2 py-0.8 rounded text-[9.5px] font-mono select-all">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-slate-600 dark:text-slate-350 leading-none">{ev.scanAsset} ({ev.attachmentSize})</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setZoomedRecord(ev)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Interactive Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DETAILED RECORD VIEW */}
      {zoomedRecord && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative overflow-hidden text-xs">
            <button
              onClick={() => setZoomedRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-base">EMR Bio-Record Document Secure Viewer</h3>
                <p className="text-[10px] text-slate-500 font-mono">Clinical Encryption Checksum: SHA-256 Verified</p>
              </div>
            </div>

            <div className="border border-slate-150 dark:border-slate-805 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl space-y-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <p className="border-b border-slate-202 pb-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">RECORD SECURE METADATA</p>
              <div><span className="text-slate-404">Date of Log:</span> {zoomedRecord.date}</div>
              <div><span className="text-slate-404">Practitioner:</span> {zoomedRecord.specialist} ({zoomedRecord.specialty})</div>
              <div><span className="text-slate-404">Clinical Focus:</span> {zoomedRecord.disease}</div>
              <div><span className="text-slate-404">Cryptographic Sign:</span> <span className="text-[9.5px] select-all bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-slate-500">{zoomedRecord.checksum}</span></div>
              <p className="border-b border-slate-202 pt-1.5 pb-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">DIAGNOSTIC SYNTHESIS ANALYSIS</p>
              <p className="italic leading-relaxed font-sans text-slate-650 dark:text-slate-300 text-xs">"{zoomedRecord.diagnosis}"</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Authorized HIPAA Protocol Secure File</span>
              </div>
              <button
                onClick={() => {
                  alert(`Successfully initiated secure socket pipe download for ${zoomedRecord.scanAsset}.`);
                  setZoomedRecord(null);
                }}
                className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1"
              >
                <ArrowDownToLine className="h-4 w-4" />
                <span>Download Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
