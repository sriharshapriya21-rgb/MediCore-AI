import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, Plus, Search, AlertCircle, 
  CheckCircle, Clock, XCircle, DollarSign, Upload, FileUp, Download
} from 'lucide-react';

interface Claim {
  id: string;
  serviceDate: string;
  provider: string;
  procedureCode: string;
  description: string;
  billedAmount: number;
  allowedAmount: number;
  coPay: number;
  status: 'Approved' | 'Processing' | 'Under Review' | 'Denied';
  notes?: string;
}

export default function InsuranceClaims() {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-99421-A",
      serviceDate: "2026-05-12",
      provider: "Dr. Elizabeth Vance, MD",
      procedureCode: "CPT-99214",
      description: "Comprehensive Outpatient Cardiology Consultation",
      billedAmount: 320.00,
      allowedAmount: 280.00,
      coPay: 30.00,
      status: "Approved",
      notes: "EHR verified. Covered under standard PPO Tier-1 Cardiac Care."
    },
    {
      id: "CLM-98210-R",
      serviceDate: "2026-05-24",
      provider: "SmartHealth Labs Corp",
      procedureCode: "CPT-80061",
      description: "Lipid Panel & Metabolic Biochemistry Checkups",
      billedAmount: 115.00,
      allowedAmount: 95.00,
      coPay: 15.00,
      status: "Approved",
      notes: "Electronic clearance completed via EDI-837 gateway."
    },
    {
      id: "CLM-95622-P",
      serviceDate: "2026-06-01",
      provider: "Dr. Robert Chen, MD",
      procedureCode: "CPT-99441",
      description: "Telehealth Remote Consultation & Respiratory Assessment",
      billedAmount: 150.00,
      allowedAmount: 150.00,
      coPay: 20.00,
      status: "Processing",
      notes: "Claim successfully transmitted to BlueCross/BlueShield clearinghouse."
    },
    {
      id: "CLM-90114-D",
      serviceDate: "2026-04-18",
      provider: "Metro Care Pharmacy",
      procedureCode: "NDC-00085-0214",
      description: "Metformin Hydrochloride 500mg (90-day extended supply)",
      billedAmount: 45.00,
      allowedAmount: 0.00,
      coPay: 45.00,
      status: "Denied",
      notes: "Out-of-formulary brand exclusion. Authorized generic replacement recommended."
    }
  ]);

  const [providerDetails] = useState({
    carrier: "BlueCross BlueShield of Minnesota",
    policyHolder: "Sarah Jenkins",
    policyNo: "BC-66384029-A",
    groupNo: "GR-99381",
    planType: "Preferred Provider Organization (PPO) Gold",
    effectiveDate: "2025-01-01",
    status: "Active Coverage",
    deductibleMet: 1250.00,
    deductibleTotal: 3000.00,
    outOfPocketMet: 2450.00,
    outOfPocketTotal: 6000.00
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states
  const [serviceDate, setServiceDate] = useState("");
  const [providerName, setProviderName] = useState("");
  const [procedureCode, setProcedureCode] = useState("");
  const [description, setDescription] = useState("");
  const [billedAmount, setBilledAmount] = useState("");
  const [claimType, setClaimType] = useState("Medical Specialist");

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !billedAmount || !serviceDate) {
      triggerNotification("Please fill in all required fields.");
      return;
    }

    const newClaim: Claim = {
      id: `CLM-${Math.floor(10000 + Math.random() * 90000)}-${claimType[0].toUpperCase()}`,
      serviceDate,
      provider: providerName,
      procedureCode: procedureCode || "CPT-99213",
      description: description || `${claimType} visit evaluation`,
      billedAmount: parseFloat(billedAmount),
      allowedAmount: parseFloat(billedAmount) * 0.8,
      coPay: 25.00,
      status: 'Processing',
      notes: "Claim queued for EDI validation."
    };

    setClaims([newClaim, ...claims]);
    setShowSubmitModal(false);
    // Clear form
    setServiceDate("");
    setProviderName("");
    setProcedureCode("");
    setDescription("");
    setBilledAmount("");
    triggerNotification(`Claim ${newClaim.id} submitted securely and routed to clearinghouse!`);
  };

  const filteredClaims = claims.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.procedureCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="insurance-claims-workspace">
      {/* Active notification banner */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Insurance Card Banner */}
      <div className="bg-linear-to-r from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-850 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none">
          <ShieldCheck className="h-44 w-44" />
        </div>

        <div className="space-y-4 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-305 rounded-lg border border-indigo-500/10">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-300 font-bold">Policy Carrier Information</p>
              <h3 className="text-base font-black font-display tracking-tight text-white">{providerDetails.carrier}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono text-indigo-300 uppercase block font-semibold">Policy Holder</span>
              <span className="font-bold text-white font-display">{providerDetails.policyHolder}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono text-indigo-300 uppercase block font-semibold">Policy ID Number</span>
              <span className="font-bold text-white font-mono">{providerDetails.policyNo}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono text-indigo-300 uppercase block font-semibold">Group Number</span>
              <span className="font-bold text-white font-mono">{providerDetails.groupNo}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono text-indigo-300 uppercase block font-semibold">Plan Tier Outline</span>
              <span className="font-bold text-white">{providerDetails.planType}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1.5">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[9px] rounded-md border border-emerald-500/20">
              {providerDetails.status.toUpperCase()}
            </span>
            <span className="text-[10px] text-indigo-200 font-mono">Effective: {providerDetails.effectiveDate}</span>
          </div>
        </div>

        {/* Deductibles summary tracker */}
        <div className="bg-slate-950/40 border border-indigo-850 p-4 rounded-xl min-w-[240px] text-xs space-y-3 shrink-0 z-10">
          <p className="font-bold text-white font-display text-xs border-b border-indigo-900/40 pb-1.5">2026 Plan Year Progress</p>
          
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-indigo-200">Individual Deductible</span>
              <span className="font-bold text-white">${providerDetails.deductibleMet}.00 / ${providerDetails.deductibleTotal}.00</span>
            </div>
            <div className="w-full h-1.5 bg-indigo-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-400 rounded-full" 
                style={{ width: `${(providerDetails.deductibleMet / providerDetails.deductibleTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-indigo-200">Out-Of-Pocket Limit</span>
              <span className="font-bold text-white">${providerDetails.outOfPocketMet}.00 / ${providerDetails.outOfPocketTotal}.00</span>
            </div>
            <div className="w-full h-1.5 bg-indigo-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-505 rounded-full" 
                style={{ width: `${(providerDetails.outOfPocketMet / providerDetails.outOfPocketTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Core Database and List */}
      <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs space-y-4">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider font-display text-slate-850 dark:text-white">Insurance Claims Directory</h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time EDI tracking and pre-authorization claim records.</p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit New Claim</span>
            </button>
          </div>
        </div>

        {/* Claims Table / List */}
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <p className="text-center py-8 text-slate-400 italic text-xs font-mono">No matching claim files located in clearinghouse cache.</p>
          ) : (
            filteredClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="border border-slate-250 dark:border-slate-800 hover:border-slate-310 dark:hover:border-slate-700 bg-white dark:bg-slate-905 rounded-xl p-3.5 transition flex flex-col md:flex-row justify-between gap-4 text-xs"
              >
                
                {/* Claim specifics (Service date, provider, ID) */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 font-bold px-1.5 py-0.5 rounded border border-indigo-120 dark:border-indigo-900/30">
                      ID: {claim.id}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{claim.serviceDate}</span>
                    <span className="text-slate-450 font-mono text-[9.5px]">| Code: {claim.procedureCode}</span>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white font-display text-xs leading-none">{claim.provider}</h5>
                    <p className="text-slate-500 text-[10.5px] mt-1">{claim.description}</p>
                    {claim.notes && (
                      <p className="text-[10px] text-slate-550 dark:text-slate-405 font-mono italic mt-1 bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded border border-slate-105 dark:border-slate-850/40">
                        * Clearinghouse Memo: {claim.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Financial overview and status */}
                <div className="flex flex-row md:flex-col justify-between md:text-right shrink-0 gap-3 md:border-l md:border-slate-100 md:dark:border-slate-800 md:pl-5 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-slate-400">Claims Billing Matrix</p>
                    <div className="space-y-0.2 font-mono">
                      <div className="flex md:justify-end gap-1 text-[10.5px]">
                        <span className="text-slate-450">Billed:</span>
                        <span className="font-bold text-slate-900 dark:text-white">${claim.billedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex md:justify-end gap-1 text-[10px]">
                        <span className="text-slate-450">Allowed:</span>
                        <span className="font-semibold text-slate-650 dark:text-slate-350">${claim.allowedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex md:justify-end gap-1 text-[10px]">
                        <span className="text-slate-450">Patient Co-Pay:</span>
                        <span className="font-semibold text-indigo-500">${claim.coPay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center md:justify-end">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md uppercase border ${
                      claim.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-110 dark:border-emerald-900/30' :
                      claim.status === 'Processing' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-550 dark:text-indigo-400 border-indigo-120 dark:border-indigo-900/30' :
                      claim.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' :
                      'bg-rose-50 dark:bg-rose-955 text-rose-600 dark:text-rose-405 border-rose-100 dark:border-rose-900/40'
                    }`}>
                      {claim.status}
                    </span>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* NEW CLAIM SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-905 border border-slate-205 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left text-xs">
            
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-500">
                <FileUp className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white font-display uppercase leading-none">Submit Claims Pre-Auth</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1">EHR Interoperability EDI Routing Portal</p>
              </div>
            </div>

            <form onSubmit={handleCreateClaimSubmit} className="space-y-3">
              <div>
                <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Service Classification</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Medical Specialist">Medical Specialist Outpatient</option>
                  <option value="Diagnostics Lab">Diagnostics &amp; Lab Assay</option>
                  <option value="Pharmacy Formulary">Pharmacy Prescription Formulary</option>
                  <option value="Emergency Intake">Emergency Ward Intake</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-35">
                <div>
                  <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Date of Treatment *</label>
                  <input
                    type="date"
                    required
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-501 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Billed Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="E.g., 250.00"
                    value={billedAmount}
                    onChange={(e) => setBilledAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Practitioner/Provider *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Dr. Elizabeth Vance, MD"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Procedure Code (CPT/NDC)</label>
                  <input
                    type="text"
                    placeholder="E.g., CPT-99214"
                    value={procedureCode}
                    onChange={(e) => setProcedureCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] uppercase font-mono font-black text-slate-450 block mb-0.5">Clinical Diagnoses Description</label>
                <textarea
                  rows={2}
                  placeholder="Summarize the primary purpose/diagnoses representing this claim filing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 p-2 rounded focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Mock Scan invoice attachment */}
              <div className="border border-dashed border-slate-200 dark:border-slate-800 p-3 rounded-lg text-center space-y-1 bg-slate-50/40 dark:bg-slate-950/20">
                <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Drop supporting invoice file, scan, or e-receipt</p>
                <p className="text-[8.5px] text-slate-400">PDF, PNG, JPG (Max 15MB) - Encrypted via HIPAA transfer socket</p>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-semibold rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Discard File
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-sm cursor-pointer transition active:scale-95 text-center"
                >
                  Transmit Claim Securely
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
