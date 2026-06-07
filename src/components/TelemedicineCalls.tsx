import { useState, useEffect } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, ScreenShare, PhoneOff, MessageSquare, 
  Settings, Users, Shield, Calendar, Activity, CheckCircle, Smartphone
} from 'lucide-react';
import { Appointment, ChatMessage } from '../types';

interface TelemedicineCallsProps {
  appointments: Appointment[];
  currentUser: { id: string; name: string; role: string };
  onSelectAppointment: (apt: Appointment) => void;
}

export default function TelemedicineCalls({
  appointments,
  currentUser,
  onSelectAppointment
}: TelemedicineCallsProps) {
  const patientApts = appointments.filter(
    a => (a.patientId === currentUser.id || a.patientName === currentUser.name) && a.type === 'Video Call'
  );

  const [activeTab, setActiveTab2] = useState<'lobby' | 'test'>('lobby');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [networkLatency, setNetworkLatency] = useState('14ms');
  const [resolution, setResolution] = useState('1080p Full HD');

  useEffect(() => {
    // Simulate real latent fluctuations
    const interval = setInterval(() => {
      const lat = Math.floor(Math.random() * 8) + 10;
      setNetworkLatency(`${lat}ms`);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="patient-telemedicine-lobby" className="space-y-6">
      
      {/* Visual Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Video className="h-4.5 w-4.5 animate-pulse" />
              </span>
              <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                MediCore AI UHD Safe-Stream
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Telehealth Virtual Consultation Clinic
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Secure HIPAA-compliant peer-to-peer visual healthcare portal. Coordinate with active specialist practitioners with end-to-end telemetry synchronization.
            </p>
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab2('lobby')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                activeTab === 'lobby' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Consult Lobby
            </button>
            <button
              onClick={() => setActiveTab2('test')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                activeTab === 'test' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Webcam Diagnostics
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry stats */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold">P2P Encryption</span>
            <span className="text-emerald-500 font-extrabold block">AES-256 GCM SECURE</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold">Signal Latency</span>
            <span className="text-slate-700 dark:text-slate-350 font-extrabold block">{networkLatency} (Nominal)</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold">Stream Speed</span>
            <span className="text-slate-700 dark:text-slate-350 font-extrabold block">6.4 Mbps uploading</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold">Virtual Camera</span>
            <span className="text-indigo-650 dark:text-indigo-400 font-extrabold block">{resolution}</span>
          </div>
        </div>
      </div>

      {activeTab === 'lobby' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Upcoming Video Slots (7 columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider font-display text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              My Scheduled Video Consultations ({patientApts.length})
            </h3>

            <div className="space-y-4 text-xs">
              {patientApts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic">
                  <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                  <p>No upcoming virtual telemedicine sessions logged in profile database.</p>
                </div>
              ) : (
                patientApts.map((apt) => {
                  const isScheduled = apt.status === 'Scheduled';
                  return (
                    <div 
                      key={apt.id} 
                      className="p-4 bg-slate-50 dark:bg-slate-850/60 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-950 dark:text-white">{apt.doctorName}</span>
                          <span className="px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-mono border border-indigo-100/30 rounded font-semibold whitespace-nowrap">
                            {apt.doctorSpecialty}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-450">
                          Scheduled: {apt.date} at {apt.time}
                        </p>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 italic">"Reason: {apt.reason}"</p>
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto shrink-0 select-none items-center">
                        {isScheduled ? (
                          <button
                            onClick={() => onSelectAppointment(apt)}
                            className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Video className="h-4 w-4" />
                            <span>Connect Stream</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                            {apt.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lobby Telehealth Checklist Guidelines (5 columns) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4.5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider font-display text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-indigo-500" />
              <span>Patient Tele-Consult Checklist</span>
            </h3>

            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
              <li className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Identify hardware devices</strong>: Verify that your camera, built-in microphones, and network router buffers are operating within regular levels prior to joining.
                </span>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Stable Lighting</strong>: Keep facial outlines clearly illuminated with warm backlighting. Ensure shadows or intense background sun rays are blocked.
                </span>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Prepare Vitals Summary</strong>: Keep symptoms listings, daily heart logs, or related respiratory counts ready for discussions.
                </span>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Verify EMR Status</strong>: Past laboratory reports parsed during this current session will sync automatically into your doctor's screen overlay.
                </span>
              </li>
            </ul>
          </div>

        </div>
      ) : (
        /* CAMERA AND MICROPHONE UNIT COMPONENT DIAGNOSTICS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Fake Webcam stream card */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 flex flex-col justify-between min-h-[380px] relative overflow-hidden border border-slate-800">
            {cameraOn ? (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <div className="text-center space-y-2.5">
                  <span className="p-3 bg-indigo-650/10 text-indigo-400 border border-indigo-505/20 rounded-full inline-block animate-pulse">
                    <Activity className="h-8 w-8 text-indigo-400" />
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">LOCAL FEED READY - PRESS CONNECT LOBBY SLOTS</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-1">
                  <VideoOff className="h-10 w-10 text-rose-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-mono font-bold">LOCAL WEBCAM STREAM COMPONENT OFFLINE</p>
                </div>
              </div>
            )}

            {/* Float badges */}
            <div className="flex justify-between items-center z-10 font-mono text-[9.5px]">
              <span className="bg-slate-900/80 border border-slate-800 text-slate-300 px-2 py-0.8 rounded flex items-center gap-1 leading-none font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>UHD 1920x1080p CAMERA UNIT</span>
              </span>
              <span className="bg-slate-900/80 border border-slate-800 text-slate-400 px-2 py-0.8 rounded leading-none">
                ENCRYPTED P2P HANDSHAKE
              </span>
            </div>

            {/* Video Controls Bar */}
            <div className="flex justify-between items-center z-10 pt-4 border-t border-slate-800/60 mt-auto bg-gradient-to-t from-slate-950 to-slate-950/0 p-2 rounded-xl">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    cameraOn 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-250' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-550/20'
                  }`}
                  title={cameraOn ? "Stop video feed" : "Start video feed"}
                >
                  {cameraOn ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
                </button>
                <button 
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    micOn 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-250' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-550/20'
                  }`}
                  title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micOn ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
                </button>
              </div>

              <div className="flex gap-1.5 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => alert("Screen sharing simulation active. Click scheduled slots inside Consult Lobby first to share inside actual session.")}
                  className="p-2.5 bg-slate-900 border border-slate-800 text-slate-350 cursor-pointer hover:bg-slate-820 rounded-xl flex items-center gap-1 transition"
                >
                  <ScreenShare className="h-4 w-4" />
                  <span>Share Desktop</span>
                </button>
              </div>
            </div>
          </div>

          {/* Device diagnostic sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider font-display font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-105 dark:border-slate-800">
                Peer Diagnostic Levels
              </h3>

              <div className="space-y-3.5 text-xs">
                {/* Level 1: Microphone Levels */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-450 uppercase font-bold">Microphone gain balance</span>
                    <span className="text-emerald-500 font-extrabold">Optimal (65 dB)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 w-3/4 h-full"></div>
                    <div className="bg-amber-500 w-1/8 h-full"></div>
                  </div>
                </div>

                {/* Level 2: Camera Noise metrics */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-450 uppercase font-bold">P2P Speed index</span>
                    <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">Fast (99.8/100)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 w-[95%] h-full"></div>
                  </div>
                </div>

                {/* Level 3: Packet Buffer values */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-450 uppercase font-bold">Packet loss buffers</span>
                    <span className="text-emerald-500 font-extrabold">0.05% lossless</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 w-[99%] h-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-805 mt-4">
              <button
                onClick={() => {
                  alert("Echo cancellation loop safely triggered and cleared!");
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-center text-xs cursor-pointer transition active:scale-98"
              >
                Trigger Safe Echo Test
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
