import { useState, useEffect, useRef, FormEvent } from 'react';
import { Video, Mic, MicOff, VideoOff, ScreenShare, PhoneOff, Send, MessageSquare, Shield, Activity, User, FileText, Sparkles, Bell, Wifi } from 'lucide-react';
import { ChatMessage, Appointment } from '../types';

interface ConsultationRoomProps {
  appointment: Appointment;
  currentUserRole: string; // 'patient' | 'doctor'
}

export default function ConsultationRoom({ appointment, currentUserRole }: ConsultationRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [consultStatus, setConsultStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [clinicalNotes, setClinicalNotes] = useState('Patient presenting typical respiratory asthma flare-ups. Sputum is clear. Pulse-ox is 97%. Refilling Albuterol.');
  const [signalStrength, setSignalStrength] = useState<'Excellent' | 'Good' | 'Weak'>('Excellent');
  const [heartRate, setHeartRate] = useState(72);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll chat messages
  useEffect(() => {
    let active = true;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${appointment.id}`);
        if (res.ok && active) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setMessages(data);
          }
        }
      } catch (err) {
        console.error("Chat polling error", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    // Simulate connecting sequence
    const statusTimeout = setTimeout(() => {
      if (active) setConsultStatus('active');
    }, 2000);

    return () => {
      active = false;
      clearInterval(interval);
      clearTimeout(statusTimeout);
    };
  }, [appointment.id]);

  // Simulate heartbeat pulse
  useEffect(() => {
    if (consultStatus !== 'active') return;
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const next = prev + offset;
        return next > 85 ? 80 : next < 60 ? 65 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [consultStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const res = await fetch(`/api/chats/${appointment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          senderRole: currentUserRole
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        setInputText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus: 'Completed' | 'Cancelled') => {
    try {
      await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes: clinicalNotes
        })
      });
      setConsultStatus('ended');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="telehealth-session" className="space-y-4">
      {/* Session Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 rounded-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping absolute"></div>
            <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display">Live Consult Channel: {appointment.doctorName}</h2>
            <p className="text-[11px] text-slate-500">Specialty Mode: {appointment.doctorSpecialty} • Reason: {appointment.reason}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-650 font-mono text-[10px] font-semibold">
            <Wifi className="h-3.5 w-3.5 text-indigo-600" />
            <span>Connection: {signalStrength}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-650 font-mono text-[10px] font-semibold">
            <Activity className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
            <span>Telemetry: {heartRate} BPM</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cameras Frame */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="aspect-video w-full bg-slate-900 rounded-2xl border border-slate-200/80 overflow-hidden relative shadow-sm flex items-center justify-center">
            
            {consultStatus === 'connecting' ? (
              <div className="text-center space-y-3">
                <div className="inline-block p-4 bg-white/10 rounded-full animate-pulse">
                  <Video className="h-8 w-8 text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Establishing Telehealth Handshake</p>
                  <p className="text-[9px] text-slate-400 font-mono">ESTABLISHING CRYPTOGRAPHICALLY SECURED HANDSHAKE</p>
                </div>
              </div>
            ) : consultStatus === 'ended' ? (
              <div className="text-center space-y-3 p-6 bg-slate-950 w-full h-full flex flex-col items-center justify-center">
                <div className="inline-block p-3 bg-red-950/20 border border-red-900/35 rounded-full text-red-500">
                  <PhoneOff className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Consultation Session Closed</p>
                  <p className="text-[11px] text-slate-400 max-w-[340px] leading-relaxed mx-auto">
                    The medical consultation has concluded. The doctor's clinical notes and prescription forms are archived on the medical profile.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Simulated Doctor Video stream */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {cameraActive ? (
                    <div className="relative w-full h-full">
                      {currentUserRole === 'patient' ? (
                        <>
                          <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600"
                            alt="Dr Robert Chen"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded px-2.5 py-1 text-[11px] flex items-center gap-1.5 font-semibold text-slate-800 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>{appointment.doctorName} (MD)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                            alt="Sarah Jenkins Patient"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded px-2.5 py-1 text-[11px] flex items-center gap-1.5 font-semibold text-slate-800 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>{appointment.patientName} (Patient)</span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                      <div className="text-center space-y-1">
                        <VideoOff className="h-8 w-8 mx-auto opacity-40 mb-1" />
                        <p className="text-[11px]">Camera Stream Suspended</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Picture-in-Picture Local webcam */}
                <div className="absolute top-3 right-3 w-1/4 aspect-video bg-slate-950 border border-white/20 rounded-lg shadow-lg overflow-hidden hidden sm:block">
                  {cameraActive ? (
                    <div className="relative w-full h-full">
                      {currentUserRole === 'patient' ? (
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                          alt="Patient local"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                          alt="Doctor local"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-[8px] px-1 py-0.5 rounded text-white font-mono uppercase">
                        Self
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                      <VideoOff className="h-4 w-4 text-slate-550" />
                    </div>
                  )}
                </div>

                {/* Interactive HUD / Privacy Badge */}
                <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 shadow-sm rounded py-1 px-2 flex items-center gap-1 text-[9px] text-indigo-700 font-bold font-mono uppercase tracking-wider">
                  <Shield className="h-3.5 w-3.5 text-indigo-600" />
                  <span>SECURED CONSULTATION UNIT</span>
                </div>
              </>
            )}
          </div>

          {/* Consultation Control Deck */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl flex justify-center items-center gap-3">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-2.5 rounded-lg border transition ${
                micActive 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              } cursor-pointer`}
              title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micActive ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
            </button>

            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`p-2.5 rounded-lg border transition ${
                cameraActive 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              } cursor-pointer`}
              title={cameraActive ? 'Disable Camera' : 'Enable Camera'}
            >
              {cameraActive ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
            </button>

            <button
              onClick={() => setScreenShare(!screenShare)}
              className={`p-2.5 rounded-lg border transition ${
                screenShare 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              } cursor-pointer`}
              title="Share Clinical Desktop Screen"
            >
              <ScreenShare className="h-4.5 w-4.5" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1.5"></div>

            {consultStatus === 'active' && (
              <button
                onClick={() => handleUpdateStatus('Completed')}
                className="bg-rose-600 hover:bg-rose-750 text-white font-bold flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                <PhoneOff className="h-3.5 w-3.5" />
                <span>Disconnect Call</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Side panels: Notes/Chat tabs */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Section 1: Chat Stream */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[340px] overflow-hidden shadow-xs">
            <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <span>Active Channels Stream</span>
              </span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-bold border border-indigo-150 uppercase font-mono">
                Synchronized
              </span>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 ScrollBar max-h-[220px]">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-slate-400 text-[11px]">No active chat log records exist.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${
                      msg.senderRole === currentUserRole 
                        ? 'ml-auto items-end' 
                        : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-[11px] leading-relaxed ${
                      msg.senderRole === currentUserRole
                        ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5 font-mono tracking-wider font-semibold">
                      {msg.senderRole === 'doctor' ? 'Doc' : 'Pat'} • {msg.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input Input Form */}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-205 flex gap-2 bg-slate-50">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type clinician messaging updates..."
                className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 transition select-text"
              />
              <button
                type="submit"
                aria-label="Send clinical message"
                className="bg-indigo-650 hover:bg-indigo-700 text-white p-2 rounded-lg transition shrink-0 cursor-pointer shadow-sm"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Section 2: Clinical Assessment logs for Doctors / Guidelines for Patients */}
          {currentUserRole === 'doctor' ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col space-y-2.5 shadow-xs">
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>Doctor Workspace Audit Logs</span>
              </span>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Compile real-time consultations note audits..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[90px] leading-relaxed transition"
              />
              <button
                onClick={() => handleUpdateStatus('Completed')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-lg font-bold transition cursor-pointer"
              >
                Log Clinical Directives & Notes
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Patient Self-Care Guidelines</span>
              </span>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-[10.5px] text-slate-600 leading-relaxed">
                <p>
                  During this live digital session, your parameters are evaluated via streaming audio-video signals.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Keep room lighting adequate.</li>
                  <li>Position camera directly facing your chest/airways.</li>
                  <li>Report immediate telemetry deviations.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
