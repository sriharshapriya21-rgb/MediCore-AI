import { useState, FormEvent } from 'react';
import { Plus, Trash, FileText, Download, Printer, Shield, CheckCircle2 } from 'lucide-react';
import { Prescription, Patient, Doctor } from '../types';

interface PrescriptionGeneratorProps {
  patients: Patient[];
  doctors: Doctor[];
  activePatientId: string;
  onPrescriptionCreated?: (rx: Prescription) => void;
}

export default function PrescriptionGenerator({ 
  patients, 
  doctors, 
  activePatientId, 
  onPrescriptionCreated 
}: PrescriptionGeneratorProps) {
  const [selectedPatientId, setSelectedPatientId] = useState(activePatientId || (patients[0]?.id || ""));
  const [diagnosesText, setDiagnosesText] = useState('Acute Bronchia Airways Tension');
  const [notes, setNotes] = useState('Ensure absolute bedrest and proper non-cold hydration. Repeat follow-up spirometry scan in 14 days.');
  
  const [medicines, setMedicines] = useState([
    { name: 'Albuterol HFA Inhaler', dosage: '90 mcg', frequency: 'Every 4-6 hours PRN', duration: '30 days', instructions: 'Inhale 2 puffs for reactive wheezing.' },
    { name: 'AziCure (Azithromycin)', dosage: '250mg', frequency: 'Once daily', duration: '5 days', instructions: 'Take with food. Complete the full prescription.' }
  ]);

  const [activePreview, setActivePreview] = useState<Prescription | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleCreatePrescription = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(false);

    const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

    try {
      const response = await fetch('/api/prescriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: activePatient.id,
          diagnoses: [diagnosesText],
          medicines,
          notes
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create the prescription.");
      }

      const newRx = await response.json();
      setActivePreview(newRx);
      setSuccessMsg(true);
      if (onPrescriptionCreated) {
        onPrescriptionCreated(newRx);
      }
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const dateStr = new Date().toISOString().split("T")[0];

  return (
    <div id="rx-builder-module" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-4">
        <div>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold tracking-wider uppercase font-mono">
            Clinician Core Module
          </span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">Enterprise Rx Prescription Generator</h2>
          <p className="text-xs text-slate-500">
            Formulate official diagnostic prescriptions linked electronically with patient profiles, featuring printable PDF layouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Prescription Constructor Form */}
        <form onSubmit={handleCreatePrescription} className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs space-y-4">
          <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>Prescription Slip Formulator</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient-selector" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Recipient Patient
              </label>
              <select
                id="patient-selector"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-white border border-slate-205 focus:border-indigo-500/65 rounded-lg p-2 text-xs text-slate-800 focus:outline-none cursor-pointer font-medium"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.dob})</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rx-diagnoses" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Primary Diagnosis Code
              </label>
              <input
                id="rx-diagnoses"
                type="text"
                value={diagnosesText}
                onChange={(e) => setDiagnosesText(e.target.value)}
                placeholder="e.g. Chronic Asthma exacerbation"
                className="w-full bg-white border border-slate-205 focus:border-indigo-500/65 rounded-lg p-2 text-xs text-slate-800 focus:outline-none select-all font-medium"
                required
              />
            </div>
          </div>

          {/* Medicines Checklist Array */}
          <div className="space-y-2.5 pt-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Medicinal Compounds Checklist
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="h-3 w-3" />
                <span>Add Drug</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {medicines.map((med, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg relative space-y-2">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                    <span className="text-[9px] text-indigo-700 font-bold font-mono uppercase">Drug #{idx+1} Formulation</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove medical formulation #${idx+1}`}
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-xs text-rose-600 hover:text-rose-800 p-0.5 rounded transition cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Name e.g. Metformin"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500/40 rounded p-1.5 text-xs text-slate-800 focus:outline-none font-medium"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dosage e.g. 500mg"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500/40 rounded p-1.5 text-xs text-slate-800 focus:outline-none font-medium"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Frequency e.g. Once daily"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500/40 rounded p-1.5 text-xs text-slate-800 focus:outline-none font-medium"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Duration e.g. 10 days"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500/40 rounded p-1.5 text-xs text-slate-800 focus:outline-none font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Special instructions (e.g. Take after meals)"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500/40 rounded p-1.5 text-[10px] text-slate-650 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="rx-notes" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Refill Notes & Specialized Wellness Directives
            </label>
            <textarea
              id="rx-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Physical therapy, dietary adjustments..."
              className="w-full bg-white border border-slate-205 focus:border-indigo-505 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 min-h-[60px]"
            />
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Prescription compiled! PDF draft available on interactive preview.</span>
            </div>
          )}

          <button
            id="register-rx-slip-btn"
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-650/45 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition duration-150 cursor-pointer uppercase tracking-wider shadow-sm"
          >
            {submitting ? 'Electronically signing...' : 'Create & Sign Electronic Prescription'}
          </button>
        </form>

        {/* Printable Prescription Preview Document / Built-in PDF Simulator */}
        <div className="lg:col-span-6 bg-white text-slate-900 rounded-xl shadow-xs p-5.5 border border-slate-200 min-h-[520px] flex flex-col justify-between relative print:m-0 print:p-0 print:shadow-none print:border-none">
          
          {/* Header watermark/seal badge */}
          <div className="absolute top-6 right-6 opacity-5 select-none text-right">
            <Shield className="h-28 w-28 text-slate-900" />
          </div>

          <div className="space-y-3.5">
            {/* Clinical Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase font-display tracking-tight text-indigo-905">MEDICORE AI CLINICAL SYSTEM</h3>
                <p className="text-[10px] text-slate-450 font-mono">ID CODE: S-RX-2026-9901</p>
                <p className="text-[9px] text-slate-400">MediCore AI Enterprise Digital Access</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-800">DR. ROBERT CHEN, MD</p>
                <p className="text-[8px] text-slate-500">Board Certified General Practitioner</p>
                <p className="text-[8px] text-slate-500">License ID Number: #RX-21890-US</p>
              </div>
            </div>

            {/* Patient File Descriptor */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 grid grid-cols-2 gap-y-1.5 text-[10.5px] text-slate-700">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] block">Patient Name</span>
                <span className="font-bold text-slate-900 text-xs">{currentPatient?.name || "Sarah Jenkins"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] block">Date of Formulary</span>
                <span className="font-mono text-slate-850 font-semibold">{activePreview?.date || dateStr}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] block font-sans">D.O.B / Gender</span>
                <span className="font-semibold">{currentPatient?.dob || "11/14/1988"} ({currentPatient?.gender || "Female"})</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] block font-mono">Prescription Record ID</span>
                <span className="font-mono font-bold text-indigo-700">#{activePreview?.id || "Rx-DRAFT"}</span>
              </div>
            </div>

            {/* Diagnostic Code */}
            <div className="space-y-1">
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500">Clinical Focus Diagnosis</span>
              <div className="text-xs font-bold text-slate-800 border-l-2 border-indigo-600 pl-2">
                {activePreview ? activePreview.diagnoses.join(", ") : diagnosesText || "Unspecified general consultation symptom"}
              </div>
            </div>

            {/* Core Rx Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 pb-1 border-b border-slate-200">
                <span className="text-sm font-bold text-indigo-650">℞</span>
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500">Medicinal Formulation Orders</span>
              </div>
              
              <div className="space-y-2 min-h-[120px]">
                {(activePreview ? activePreview.medicines : medicines).map((med, idx) => (
                  <div key={idx} className="text-[11px] border-b border-dashed border-slate-200 pb-1.5 flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{med.name || "Specimen Compound Name"}</p>
                      <p className="text-[10px] text-slate-500 italic">Directive: {med.instructions || "Assess dosage constraints post-meals."}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-slate-800">{med.dosage || "500-mg"} | {med.duration || "10 days"}</p>
                      <p className="text-[9px] text-slate-450 font-mono uppercase font-bold">{med.frequency || "Once daily"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice notes */}
            <div className="space-y-1 bg-indigo-50/40 p-2 rounded border border-indigo-100">
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-700 block">General Consultation Wellness Notes</span>
              <p className="text-[10px] text-slate-700 leading-normal italic">
                "{activePreview?.notes || notes || "Patient shows normal clinical metrics. Keep secondary assessments updated."}"
              </p>
            </div>
          </div>

          {/* Footer Seals, Signatures, and Actions */}
          <div className="mt-4 pt-3.5 border-t border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="w-24 h-5.5 bg-slate-50 flex items-center justify-center border border-slate-200 rounded">
                <span className="font-serif text-[10.5px] tracking-widest text-[#2f435e] italic font-bold">R.Chen</span>
              </div>
              <p className="text-[8px] text-slate-400 text-center font-mono uppercase tracking-wider font-semibold">Electronic Signature Seal</p>
              <p className="text-[8px] text-slate-400">MEDICORE AI HEALTH PLATFORM</p>
            </div>

            {/* Print trigger actions */}
            <div className="flex gap-2 print:hidden select-none">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
