import React, { useState } from 'react';
import { 
  Users, UserCheck, Search, Plus, Trash2, Edit2, AlertCircle, 
  Mail, Phone, Calendar, Heart, Shield, Sparkles, X, Check, Eye
} from 'lucide-react';
import { Patient, Doctor } from '../types';

interface UserManagementProps {
  patients: Patient[];
  doctors: Doctor[];
  onRefresh: () => void;
  triggerNotification: (msg: string) => void;
}

export default function UserManagement({
  patients,
  doctors,
  onRefresh,
  triggerNotification
}: UserManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<'patients' | 'doctors'>('patients');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states - Patient
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientDob, setPatientDob] = useState('1990-01-01');
  const [patientGender, setPatientGender] = useState('Female');
  const [patientBlood, setPatientBlood] = useState('O+');
  const [patientAllergies, setPatientAllergies] = useState('');
  const [patientChronic, setPatientChronic] = useState('');

  // Form states - Doctor
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('General Medicine');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorAvailability, setDoctorAvailability] = useState<string[]>(['Monday', 'Wednesday']);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientName,
          email: patientEmail,
          phone: patientPhone,
          dob: patientDob,
          gender: patientGender,
          bloodType: patientBlood,
          allergies: patientAllergies ? patientAllergies.split(',').map(s => s.trim()) : [],
          chronicConditions: patientChronic ? patientChronic.split(',').map(s => s.trim()) : []
        })
      });

      if (response.ok) {
        triggerNotification(`Patient "${patientName}" registered successfully!`);
        setShowAddPatientModal(false);
        // Clear fields
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
        setPatientDob('1990-01-01');
        setPatientAllergies('');
        setPatientChronic('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to create patient.");
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName) return;

    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`,
          specialty: doctorSpecialty,
          email: doctorEmail,
          phone: doctorPhone,
          availability: doctorAvailability,
          rating: 5.0
        })
      });

      if (response.ok) {
        triggerNotification(`Doctor "${doctorName}" onboarded securely!`);
        setShowAddDoctorModal(false);
        setDoctorName('');
        setDoctorEmail('');
        setDoctorPhone('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to onboard doctor.");
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        triggerNotification("Patient directory file terminated successfully.");
        setDeletingId(null);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Critical error removing patient.");
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        triggerNotification("Practitioner roster record de-auth completed successfully.");
        setDeletingId(null);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Critical error decommissioning doctor.");
    }
  };

  // Pre-filtered lists
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="user-management-panel">
      {/* Search and Action Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-4.5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Toggle Hub tab list */}
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs cursor-pointer">
          <button
            onClick={() => { setActiveSubTab('patients'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'patients' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Patients ({patients.length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('doctors'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'doctors' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Practitioners ({doctors.length})</span>
          </button>
        </div>

        {/* Searching list */}
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeSubTab === 'patients' ? 'patients by name, ID or email' : 'doctors by name, specialty or clinic'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Register Actions button */}
        <div>
          {activeSubTab === 'patients' ? (
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold text-xs px-4 py-2 px-4 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95 text-center"
            >
              <Plus className="h-4 w-4" />
              <span>Register Patient Record</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold text-xs px-4 py-2 px-4 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95 text-center"
            >
              <Plus className="h-4 w-4" />
              <span>Onboard Practitioner</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Grid View */}
      {activeSubTab === 'patients' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredPatients.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-500 font-mono text-xs">
              No matching patient records found in active EMR indexing.
            </div>
          ) : (
            filteredPatients.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl relative shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
                
                {/* Decommission checking */}
                {deletingId === p.id ? (
                  <div className="absolute inset-0 bg-slate-950/90 z-20 rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-rose-500 animate-bounce" />
                    <div>
                      <p className="text-xs font-bold text-white font-display">Decommission EMR File?</p>
                      <p className="text-[10px] text-slate-400 mt-1">This operation is irreversible under HIPAA records backup protocols.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePatient(p.id)}
                        className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500"
                      >
                        Decommission
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3 text-xs">
                  {/* Top line with ID & de-auth trash */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 font-bold px-1.8 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                      ID: {p.id}
                    </span>
                    <button
                      onClick={() => setDeletingId(p.id)}
                      className="p-1 text-slate-400 hover:text-rose-550 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition"
                      title="Decommission Patient File"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Profile block */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-905 dark:text-white font-display">{p.name}</h3>
                    <div className="space-y-1 text-slate-500 font-mono text-[10.5px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{p.email || 'No email registered'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.phone || 'No phone registered'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>DOB: {p.dob} ({p.gender})</span>
                      </div>
                    </div>
                  </div>

                  {/* Disease Conditions & Blood */}
                  <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-slate-450 uppercase block font-mono">Blood Profile:</span>
                      <span className="font-extrabold text-indigo-500 font-mono bg-indigo-50/40 dark:bg-indigo-950/20 px-1 rounded">{p.bloodType}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase block font-mono">Chronic Cohorts:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.chronicConditions.length === 0 ? (
                          <span className="text-slate-400 text-[10px] italic">No active diseases mapped</span>
                        ) : (
                          p.chronicConditions.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-405 text-[9px] rounded font-semibold border border-rose-100 dark:border-rose-900/30">
                              {c}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-455 uppercase block font-mono">Allergies Mapped:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.allergies.length === 0 ? (
                          <span className="text-slate-400 text-[10px] italic">None logged</span>
                        ) : (
                          p.allergies.map((a, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[9px] rounded font-semibold border border-amber-100 dark:border-amber-900/30">
                              {a}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-500 font-mono text-xs">
              No matching practitioner rosters found inside clinic databases.
            </div>
          ) : (
            filteredDoctors.map((d) => (
              <div key={d.id} className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl relative shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
                
                {/* Decommission validation */}
                {deletingId === d.id ? (
                  <div className="absolute inset-0 bg-slate-950/90 z-20 rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-rose-500 animate-bounce" />
                    <div>
                      <p className="text-xs font-bold text-white font-display">Decommission Practitioner?</p>
                      <p className="text-[10px] text-slate-400 mt-1">This takes the specialist clinical node offline, canceling active queues.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteDoctor(d.id)}
                        className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500 shadow"
                      >
                        Decommission
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4 text-xs">
                  {/* Top banner and Delete icon */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 font-bold px-1.8 py-0.5 rounded border border-indigo-102 dark:border-indigo-900/40">
                      SAAS NODE: {d.id}
                    </span>
                    <button
                      onClick={() => setDeletingId(d.id)}
                      className="p-1 text-slate-400 hover:text-rose-550 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition"
                      title="Decommission Practitioner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Doctor Info Block */}
                  <div className="flex items-center gap-3">
                    <img
                      src={d.avatar}
                      alt={d.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-905 dark:text-white font-display leading-tight">{d.name}</h3>
                      <p className="text-[10.5px] font-bold text-indigo-500 font-mono mt-0.5">{d.specialty} Specialist</p>
                      <p className="text-[9.5px] text-amber-500 font-semibold flex items-center gap-0.5 mt-0.5 font-mono">
                        <span>{d.rating} ★ Rating</span>
                      </p>
                    </div>
                  </div>

                  {/* Contacts and shift allocation */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="space-y-1 text-slate-500 font-mono text-[10.5px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-405" />
                        <span className="truncate">{d.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-405" />
                        <span>{d.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase block">Active Availability Shifts:</span>
                      <div className="flex flex-wrap gap-1">
                        {d.availability.map((day, idx) => (
                          <span key={idx} className="bg-emerald-50 dark:bg-emerald-955 text-emerald-650 dark:text-emerald-305 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-100 dark:border-emerald-900/30">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* REGISTER PATIENT MDAL */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddPatientModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-500">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-sm uppercase">EMR Secure Patient Registration</h3>
                <p className="text-[10px] text-slate-500 font-mono">HIPAA Compliance Checksum Active</p>
              </div>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-p-name" className="text-[9px] text-slate-450 uppercase font-mono font-bold">Full Name *</label>
                  <input
                    id="reg-p-name"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="E.g., Jane Cooper"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="reg-p-email" className="text-[9px] text-slate-450 uppercase font-mono font-bold">Email Address</label>
                  <input
                    id="reg-p-email"
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="E.g., jane@cooper.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="reg-p-phone" className="text-[9px] text-slate-450 uppercase font-mono font-bold">Phone Number</label>
                  <input
                    id="reg-p-phone"
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 012-3214"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="reg-p-dob" className="text-[9px] text-slate-450 uppercase font-mono font-bold">DOB *</label>
                  <input
                    id="reg-p-dob"
                    type="date"
                    required
                    value={patientDob}
                    onChange={(e) => setPatientDob(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-505 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="reg-p-blood" className="text-[9px] text-slate-455 uppercase font-mono font-bold">Blood Type</label>
                  <select
                    id="reg-p-blood"
                    value={patientBlood}
                    onChange={(e) => setPatientBlood(e.target.value)}
                    className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="A-positive (A+)">A-positive (A+)</option>
                    <option value="O-negative (O-)">O-negative (O-)</option>
                    <option value="B-positive (B+)">B-positive (B+)</option>
                    <option value="AB-positive (AB+)">AB-positive (AB+)</option>
                    <option value="O-positive (O+)">O-positive (O+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-p-allergies" className="text-[9px] text-slate-450 uppercase font-mono font-bold">Allergies (comma separated values)</label>
                <input
                  id="reg-p-allergies"
                  type="text"
                  value={patientAllergies}
                  onChange={(e) => setPatientAllergies(e.target.value)}
                  placeholder="E.g., Sulfa, Aspirin"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="reg-p-conditions" className="text-[9px] text-slate-450 uppercase font-mono font-bold">Chronic Conditions (comma separated)</label>
                <input
                  id="reg-p-conditions"
                  type="text"
                  value={patientChronic}
                  onChange={(e) => setPatientChronic(e.target.value)}
                  placeholder="E.g., Mild Asthma, Hypertension"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-505"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 text-white font-bold rounded-xl shadow cursor-pointer transition active:scale-95"
                >
                  Synchronize Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ONBOARD PRACTITIONER MODAL */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddDoctorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-105 dark:border-slate-800 pb-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-550">
                <UserCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-sm uppercase">Secure Practitioner Onboarding</h3>
                <p className="text-[10px] text-slate-500 font-mono">Platform Node License Verification Active</p>
              </div>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-d-name" className="text-[9px] text-slate-455 uppercase font-mono font-bold">Specialist Full Name *</label>
                  <input
                    id="reg-d-name"
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Raymond Shaw, MD"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="reg-d-spec" className="text-[9px] text-slate-455 uppercase font-mono font-bold">Medical Specialty Discipline</label>
                  <select
                    id="reg-d-spec"
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-d-email" className="text-[9px] text-slate-455 uppercase font-mono font-bold">Enterprise Email</label>
                  <input
                    id="reg-d-email"
                    type="email"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="r.shaw@smarthealth.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-855 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="reg-d-phone" className="text-[9px] text-slate-455 uppercase font-mono font-bold">Secure Contact Number</label>
                  <input
                    id="reg-d-phone"
                    type="text"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="+1 (555) 888-0114"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-855 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <span className="text-[9px] text-slate-455 uppercase font-mono font-bold block mb-1">Clinic Day Shifts Allocated</span>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                    const isSelected = doctorAvailability.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setDoctorAvailability(doctorAvailability.filter(d => d !== day));
                          } else {
                            setDoctorAvailability([...doctorAvailability, day]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-3xs' 
                            : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-755 text-slate-500'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 text-white font-bold rounded-xl shadow cursor-pointer transition active:scale-95"
                >
                  Onboard Practitioner
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
