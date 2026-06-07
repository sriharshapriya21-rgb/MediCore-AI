import { useState, FormEvent } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, 
  Trash2, Edit, Check, AlertTriangle, MonitorPlay, X, CalendarCheck 
} from 'lucide-react';
import { Appointment, Doctor } from '../types';

interface InteractiveCalendarProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patientId: string;
  onBookAppointment: (doctorId: string, date: string, time: string, reason: string) => void;
  onRefreshData: () => void;
}

export default function InteractiveCalendar({
  appointments,
  doctors,
  patientId,
  onBookAppointment,
  onRefreshData
}: InteractiveCalendarProps) {
  // Calendar Navigation
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed (5 = June)

  // Focused calendar day
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(4); // June 4 default start

  // Rescheduling modal
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [isSavingReschedule, setIsSavingReschedule] = useState(false);

  // Inline Quick Booking Modal
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookDocId, setQuickBookDocId] = useState(doctors[0]?.id || '');
  const [quickBookTime, setQuickBookTime] = useState('10:00 AM');
  const [quickBookReason, setQuickBookReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Inline cancellation confirmations
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // June 2026 Starts on a Monday
  const monthName = "June";
  const daysInMonth = 30;
  const startDayOffset = 1; // Monday offset (0 = Sunday, 1 = Monday...)

  // Form calendar days grid arrays
  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    daysGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push(i);
  }

  // Find all appointments loaded in selected month (June 2026)
  const getDayAppointments = (day: number) => {
    const formattedDate = `2026-06-${day.toString().padStart(2, '0')}`;
    return appointments.filter(a => a.date === formattedDate);
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setEditingApt(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setRescheduleReason(apt.reason);
  };

  const handleSaveReschedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    setIsSavingReschedule(true);

    try {
      // Direct high-fidelity update patch
      const res = await fetch(`/api/appointments/${editingApt.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Scheduled',
          notes: `Rescheduled to ${rescheduleDate} at ${rescheduleTime}.`,
          date: rescheduleDate,
          time: rescheduleTime,
          reason: rescheduleReason
        })
      });

      if (res.ok) {
        setEditingApt(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingReschedule(false);
    }
  };

  const handleConfirmCancel = async (aptId: string) => {
    try {
      const res = await fetch(`/api/appointments/${aptId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Cancelled',
          notes: 'Cancelled via integrated SaaS day planner.'
        })
      });
      if (res.ok) {
        setConfirmCancelId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickBookSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDayNum) return;
    setIsBooking(true);

    const formattedDate = `2026-06-${selectedDayNum.toString().padStart(2, '0')}`;
    
    try {
      await onBookAppointment(quickBookDocId, formattedDate, quickBookTime, quickBookReason);
      setShowQuickBook(false);
      setQuickBookReason('');
      onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  // Day specific focused appointments
  const focusedDateStr = selectedDayNum ? `2026-06-${selectedDayNum.toString().padStart(2, '0')}` : '';
  const focusedDayApts = selectedDayNum ? getDayAppointments(selectedDayNum) : [];

  return (
    <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4" id="appointments-calendar-root">
      
      {/* Calendar Header with Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-650 dark:text-indigo-400">
            <CalendarIcon className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider font-display text-slate-900 dark:text-white leading-none">Unified Appointment Scheduler</h3>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">June 2026 Timeline &bull; Interactive Telehealth Channels</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (selectedDayNum) setShowQuickBook(true);
          }}
          disabled={!selectedDayNum}
          className="bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-550 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Book Slot for June {selectedDayNum || ''}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Month grid planner card (Col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1 text-slate-800 dark:text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase font-mono text-indigo-650 dark:text-indigo-400">June 2026</span>
            </div>
            <div className="flex gap-1">
              <button className="p-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-not-allowed opacity-50 block" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-not-allowed opacity-50 block" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] uppercase tracking-wider font-extrabold text-slate-450 dark:text-slate-505">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Days Grid Rendering */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {daysGrid.map((dayNum, index) => {
              if (dayNum === null) {
                return <div key={`empty-${index}`} className="aspect-square bg-slate-50/50 dark:bg-slate-900/30 rounded-lg"></div>;
              }

              const dayApts = getDayAppointments(dayNum);
              const hasApts = dayApts.length > 0;
              const hasActive = dayApts.some(a => a.status === 'Scheduled');
              const isSelected = selectedDayNum === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDayNum(dayNum)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 transition font-mono border relative cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-650 shadow-md font-bold' 
                      : hasActive
                        ? 'bg-indigo-50/65 dark:bg-indigo-950/25 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 shadow-3xs'
                        : hasApts
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-450 border-slate-200 dark:border-slate-750'
                          : 'bg-white dark:bg-slate-900 border-slate-202 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[11.5px] tracking-tight">{dayNum}</span>
                  
                  {/* Appointment quantity markers */}
                  {hasApts && (
                    <div className="flex gap-0.5 justify-center">
                      {dayApts.slice(0, 3).map((a, i) => (
                        <span 
                          key={i} 
                          className={`w-1.2 h-1.2 rounded-full ${
                            a.status === 'Scheduled' 
                              ? (isSelected ? 'bg-white' : 'bg-indigo-600 dark:bg-indigo-405') 
                              : a.status === 'Completed' 
                                ? 'bg-emerald-500' 
                                : 'bg-rose-500'
                          }`}
                        ></span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day-specific lists (Col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/60 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-850 dark:text-white font-display">
                June {selectedDayNum}, 2026
              </span>
              <span className="text-[10px] font-mono text-indigo-550 dark:text-indigo-400 font-bold">
                {focusedDayApts.length} booked sessions
              </span>
            </div>

            {/* List rendered */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto ScrollBar pr-1 text-xs">
              {focusedDayApts.length === 0 ? (
                <p className="text-[11.5px] text-slate-450 italic text-center py-6">
                  No consults registered on this calendar day.
                </p>
              ) : (
                focusedDayApts.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 hover:shadow-3xs transition relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">{apt.doctorName}</span>
                        <span className="text-[9.5px] text-slate-405 font-mono">{apt.doctorSpecialty} &bull; {apt.time}</span>
                      </div>
                      
                      <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold leading-none capitalize ${
                        apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-650 border border-indigo-100 dark:bg-indigo-955' :
                        apt.status === 'Completed' ? 'bg-emerald-55/10 text-emerald-600 dark:bg-emerald-950/20' :
                        'bg-slate-100 dark:bg-slate-850 text-slate-400'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-slate-500 italic">"{apt.reason}"</p>

                    {/* Quick utilities: reschedule and cancel links */}
                    {apt.status === 'Scheduled' && (
                      <div className="flex justify-end gap-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-2 shrink-0">
                        {confirmCancelId === apt.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-955/20 px-1.5 rounded border border-rose-100 dark:border-rose-900/35">
                            <span className="text-[9px] text-rose-600 font-mono font-bold">Rescind?</span>
                            <button onClick={() => handleConfirmCancel(apt.id)} className="p-0.5 hover:bg-rose-100 dark:hover:bg-slate-800 rounded text-rose-600"><Check className="h-3 w-3" /></button>
                            <button onClick={() => setConfirmCancelId(null)} className="p-0.5 hover:bg-rose-100 dark:hover:bg-slate-800 rounded text-slate-400"><X className="h-3 w-3" /></button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenReschedule(apt)}
                              className="text-[10.5px] font-bold text-indigo-550 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                              title="Reschedule session parameters"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Reschedule</span>
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(apt.id)}
                              className="text-[10.5px] font-bold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                              title="Cancel appointment"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick stats reference */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-350">
            <strong>Advisory Checklist:</strong> Rescheduling requests will trigger live SMTP client newsletters to coordinate virtual healthcare handshakes cleanly.
          </div>
        </div>

      </div>

      {/* QUICK WORKSPACE BOOKING MODAL */}
      {showQuickBook && selectedDayNum && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleQuickBookSubmit} className="bg-white dark:bg-slate-905 border border-slate-205 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-display text-sm">
                <CalendarCheck className="h-4.5 w-4.5 text-indigo-500" />
                <span>Book June {selectedDayNum}, 2026 Slot</span>
              </h4>
              <button type="button" onClick={() => setShowQuickBook(false)} className="text-slate-405 hover:text-slate-705"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="quick-book-doc" className="block text-[10px] uppercase font-mono font-bold text-slate-450 dark:text-slate-400 mb-1">Select Physician Specialist</label>
                <select
                  id="quick-book-doc"
                  value={quickBookDocId}
                  onChange={(e) => setQuickBookDocId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs select-none"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quick-book-time" className="block text-[10px] uppercase font-mono font-bold text-slate-455 dark:text-slate-400 mb-1 font-mono">Select Session Time</label>
                <select
                  id="quick-book-time"
                  value={quickBookTime}
                  onChange={(e) => setQuickBookTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:45 AM">11:45 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>

              <div>
                <label htmlFor="quick-book-reason" className="block text-[10px] uppercase font-mono font-bold text-slate-455 dark:text-slate-400 mb-1">Clinical Presenting Reason</label>
                <input
                  id="quick-book-reason"
                  type="text"
                  required
                  value={quickBookReason}
                  onChange={(e) => setQuickBookReason(e.target.value)}
                  placeholder="e.g. Asthma diagnostic review or general check"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-800 p-2 rounded text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setShowQuickBook(false)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isBooking}
                className="px-4 py-1.5 bg-indigo-650 dark:bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-600 cursor-pointer"
              >
                {isBooking ? 'Processing...' : 'Reserve Session'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RE-SCHEDULING PARAMETERS MODAL */}
      {editingApt && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleSaveReschedule} className="bg-white dark:bg-slate-905 border border-slate-205 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 font-display text-sm">
                <Edit className="h-4.5 w-4.5 text-indigo-500" />
                <span>Reschedule Consultation Visit</span>
              </h4>
              <button type="button" onClick={() => setEditingApt(null)} className="text-slate-405"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="resched-date" className="block text-[10px] uppercase font-mono font-bold text-slate-450 dark:text-slate-400 mb-1">New Proposed Date</label>
                <input
                  id="resched-date"
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs select-all text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label htmlFor="resched-time" className="block text-[10px] uppercase font-mono font-bold text-slate-450 dark:text-slate-400 mb-1 font-mono">Proposed Hourly Time</label>
                <input
                  id="resched-time"
                  type="text"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label htmlFor="resched-reason" className="block text-[10px] uppercase font-mono font-bold text-slate-450 dark:text-slate-400 mb-1">Medical Reason Context</label>
                <input
                  id="resched-reason"
                  type="text"
                  required
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="px-3 py-1.5 border border-slate-202 dark:border-slate-750 bg-white dark:bg-slate-850 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSavingReschedule}
                className="px-4 py-1.5 bg-indigo-650 dark:bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-600 cursor-pointer"
              >
                {isSavingReschedule ? 'Saving Changes...' : 'Save Revisions'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
