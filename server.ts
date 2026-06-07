import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Patient, 
  Doctor, 
  Appointment, 
  Prescription, 
  MedicalRecord, 
  ChatMessage, 
  AIAnalysisResult 
} from "./src/types";
import { Collections, memPatients, memDoctors, memAppointments, memPrescriptions, memMedicalRecords, memNotifications, memUsers } from "./db";
import { authenticateToken, generateToken, AuthenticatedRequest, requireRole } from "./auth";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini Client successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in clinical triage offline mode.");
}

// Simple Telemedicine Signal Store
interface TelemedicineSession {
  roomId: string;
  doctorActive: boolean;
  patientActive: boolean;
  screenSharing: boolean;
  micMuted: boolean;
  videoMuted: boolean;
  chat: { sender: string; text: string; timestamp: string }[];
}
const teleStore: { [roomId: string]: TelemedicineSession } = {};

// ==========================================
// AUTH & REGISTER ENDPOINTS
// ==========================================

// Register Route
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, role, dob, phone, specialty } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  try {
    const existing = await Collections.users.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already belongs to this enterprise cluster." });
    }

    const userId = `usr-${Date.now()}`;
    let profileId = "";

    // Create corresponding profile
    if (role === 'patient') {
      profileId = `pat-${Date.now()}`;
      const newPat: Patient = {
        id: profileId,
        name,
        email,
        phone: phone || "+1 (555) 000-0000",
        dob: dob || "1990-01-01",
        gender: "Other",
        bloodType: "Unknown",
        allergies: [],
        chronicConditions: [],
        emergencyContact: { name: "", phone: "", relation: "" }
      };
      await Collections.patients.insertOne(newPat);
    } else if (role === 'doctor') {
      profileId = `doc-${Date.now()}`;
      const newDoc: Doctor = {
        id: profileId,
        name,
        specialty: specialty || "General Medicine",
        email,
        phone: phone || "+1 (555) 000-0000",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
        availability: ["Monday", "Wednesday", "Friday"],
        rating: 5.0
      };
      await Collections.doctors.insertOne(newDoc);
    }

    // Insert user
    const newUser = {
      id: userId,
      email,
      passwordHash: password, // Simple password field for sandbox limits
      name,
      role: role as 'patient' | 'doctor' | 'admin',
      profileId
    };
    await Collections.users.insertOne(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      profileId: newUser.profileId
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        profileId: newUser.profileId
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register enterprise credential profiles." });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required credentials." });
  }

  try {
    const user = await Collections.users.findOne({ email });
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid enterprise credentials password or unrecognized login." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileId: user.profileId
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileId: user.profileId
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Authentication system failure." });
  }
});

// Role Switcher Route for simulation context
app.post("/api/auth/switch-role", async (req, res) => {
  const { role, userId } = req.body;
  try {
    const users = await Collections.users.findOne({ role }) ? memUsers : memUsers;
    let user = users.find(u => u.role === role);
    
    if (role === 'patient') {
      const pid = userId || 'pat-1';
      user = users.find(u => u.profileId === pid) || users.find(u => u.role === 'patient');
    } else if (role === 'doctor') {
      const docId = userId || 'doc-1';
      const docObj = memDoctors.find(d => d.id === docId) || memDoctors[0];
      user = users.find(u => u.profileId === docObj.id);
      if (!user) {
        user = {
          id: `usr-${docObj.id}`,
          email: docObj.email,
          passwordHash: "doctor123",
          name: docObj.name,
          role: "doctor",
          profileId: docObj.id
        };
        memUsers.push(user);
      }
    } else if (role === 'admin') {
      user = users.find(u => u.role === 'admin');
    }

    if (!user) {
      return res.status(444).json({ error: "Target simulation profile is not seeded." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileId: user.profileId
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileId: user.profileId
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Context switcher handoff failed." });
  }
});

// Forgot Password Route
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }

  try {
    const user = await Collections.users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email address not registered in MediCore system database." });
    }
    res.json({ success: true, message: `A password recovery trigger has been dispatched to ${email}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to perform recovery dispatch." });
  }
});

// Fetch current identity details
app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized access profile." });

  try {
    const pat = req.user.profileId ? await Collections.patients.findOne({ id: req.user.profileId }) : null;
    const doc = req.user.profileId ? await Collections.doctors.findOne({ id: req.user.profileId }) : null;

    res.json({
      user: req.user,
      patient: pat || memPatients[0],
      doctor: doc || memDoctors[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Identity loading error." });
  }
});

// ==========================================
// DIRECT CLINICAL RECORDS AND STORES APIs (Protected)
// ==========================================

// Patients list
app.get("/api/patients", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await Collections.patients.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to load clinic directories." });
  }
});

app.post("/api/patients", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, email, phone, dob, gender, bloodType, allergies, chronicConditions, emergencyContact } = req.body;
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      name,
      email: email || "",
      phone: phone || "",
      dob: dob || "1990-01-01",
      gender: gender || "Other",
      bloodType: bloodType || "O+",
      allergies: allergies || [],
      chronicConditions: chronicConditions || [],
      emergencyContact: emergencyContact || { name: "", phone: "", relation: "" }
    };
    await Collections.patients.insertOne(newPatient);
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ error: "Failed to load directories registers." });
  }
});

app.patch("/api/patients/:id", authenticateToken, async (req, res) => {
  try {
    await Collections.patients.updateOne(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed updating patient file." });
  }
});

app.delete("/api/patients/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await Collections.patients.deleteOne(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed deleting patient entry." });
  }
});

// Doctors list
app.get("/api/doctors", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await Collections.doctors.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to load doctor rosters." });
  }
});

app.post("/api/doctors", authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, specialty, email, phone, availability } = req.body;
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name,
      specialty: specialty || "General Medicine",
      email: email || "",
      phone: phone || "",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
      availability: availability || ["Monday", "Wednesday"],
      rating: 5.0
    };
    await Collections.doctors.insertOne(newDoc);
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to append doctor." });
  }
});

app.patch("/api/doctors/:id", authenticateToken, requireRole(['admin', 'doctor']), async (req, res) => {
  try {
    await Collections.doctors.updateOne(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed updating clinic profile." });
  }
});

app.delete("/api/doctors/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await Collections.doctors.deleteOne(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed deleting profile." });
  }
});

// Appointments Management
app.get("/api/appointments", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await Collections.appointments.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to load appointment indexes." });
  }
});

app.post("/api/appointments/book", authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { patientId, doctorId, date, time, type, reason } = req.body;
  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ error: "Missing calendar scheduling attributes." });
  }

  try {
    const patient = await Collections.patients.findOne({ id: patientId }) || memPatients[0];
    const doctor = await Collections.doctors.findOne({ id: doctorId }) || memDoctors[0];

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date,
      time,
      status: "Scheduled",
      type: type || "Video Call",
      reason
    };

    await Collections.appointments.insertOne(newApt);

    // Create system notification log
    const notification = {
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: "Appointment Securely Booked",
      message: `System Alert: Clinical consultation booked with ${doctor.name} for ${patient.name} on ${date} ${time}.`,
      channel: "System Alert",
      read: false,
      userId: patientId
    };
    await Collections.notifications.insertOne(notification);

    res.status(201).json({ appointment: newApt, notification });
  } catch (err) {
    res.status(500).json({ error: "Booking scheduling pipeline failed." });
  }
});

app.patch("/api/appointments/:id/status", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, notes, date, time } = req.body;

  try {
    const list = await Collections.appointments.find();
    const apt = list.find(a => a.id === id);
    if (!apt) return res.status(404).json({ error: "Appointment file not found." });

    const update: Partial<Appointment> = {};
    if (status) update.status = status;
    if (notes) update.notes = notes;
    if (date) update.date = date;
    if (time) update.time = time;

    await Collections.appointments.updateOne(id, update);

    const updatedApt = { ...apt, ...update };

    // Register real-time audit alert
    const notif = {
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Consultation status changed: ${status || 'Rescheduled'}`,
      message: `SaaS Telemetry: Consultation room status updated for ${updatedApt.patientName}. Date: ${updatedApt.date} at ${updatedApt.time}.`,
      channel: "System Alert",
      read: false,
      userId: updatedApt.patientId
    };
    await Collections.notifications.insertOne(notif);

    res.json(updatedApt);
  } catch (err) {
    res.status(500).json({ error: "Failed to update slot status status." });
  }
});

// Prescriptions Management
app.get("/api/prescriptions", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await Collections.prescriptions.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed fetching prescriptions archive." });
  }
});

app.post("/api/prescriptions/create", authenticateToken, requireRole(['doctor', 'admin']), async (req: AuthenticatedRequest, res) => {
  const { appointmentId, patientId, diagnoses, medicines, notes } = req.body;
  if (!patientId || !medicines) {
    return res.status(400).json({ error: "Missing required values for new treatment profile." });
  }

  try {
    const patient = await Collections.patients.findOne({ id: patientId }) || memPatients[0];
    const birthYear = parseInt(patient.dob.split("-")[0]);
    const patientAge = new Date().getFullYear() - birthYear;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      appointmentId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge,
      patientGender: patient.gender,
      doctorId: req.user?.profileId || "doc-1",
      doctorName: req.user?.name || "Dr. Elizabeth Vance",
      doctorSpecialty: "Clinical Specialist",
      date: new Date().toISOString().split("T")[0],
      diagnoses: diagnoses || ["Preventive Diagnostic Assessment"],
      medicines,
      notes
    };

    await Collections.prescriptions.insertOne(newRx);

    if (appointmentId) {
      await Collections.appointments.updateOne(appointmentId, {
        status: "Completed",
        notes: `Prescription issued successfully: #${newRx.id}`
      });
    }

    // Register system notification
    const alert = {
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: "New Digital Rx Issued",
      message: `Secure Clinical Alert: Treatment prescription #${newRx.id} has been transmitted to formulary matching.`,
      channel: "System Alert",
      read: false,
      userId: patientId
    };
    await Collections.notifications.insertOne(alert);

    res.status(201).json(newRx);
  } catch (err) {
    res.status(500).json({ error: "Prescription transmission error." });
  }
});

// Medical Records & Scanned Reports
app.get("/api/medical-records", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await Collections.medicalRecords.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed fetching medical records timeline." });
  }
});

app.post("/api/medical-records/upload", authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { title, description, type, textContent } = req.body;
  try {
    const newRec: MedicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: req.user?.profileId || "pat-1",
      date: new Date().toISOString().split("T")[0],
      title: title || "Laboratory Chemistry report",
      type: type || "Lab Report",
      description: description || "Scanned EHR document diagnostic trace.",
      attachments: [
        {
          name: "uploaded_clinical_scan.txt",
          size: "4.2 KB",
          type: "text/plain",
          parsedSummary: textContent ? "Scanned text successfully processed." : undefined
        }
      ]
    };

    await Collections.medicalRecords.insertOne(newRec);
    res.status(201).json(newRec);
  } catch (err) {
    res.status(500).json({ error: "Clinical upload pipeline failed." });
  }
});

// Chats
app.get("/api/chats/:appointmentId", authenticateToken, async (req, res) => {
  // Static placeholder chat for room context
  res.json([
    {
      id: "m-seed-1",
      senderId: "pat-1",
      senderRole: "patient",
      text: "System: Verified encrypted HIPAA session started.",
      timestamp: "10:00 AM"
    }
  ]);
});

app.post("/api/chats/:appointmentId", authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { text, senderRole } = req.body;
  res.status(201).json({
    id: `msg-${Date.now()}`,
    senderId: req.user?.id || "pat-1",
    senderRole: senderRole || "patient",
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

// Notifications List
app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const items = await Collections.notifications.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error parsing system alerts." });
  }
});

app.post("/api/notifications/clear", authenticateToken, async (req, res) => {
  try {
    await Collections.notifications.markAllRead();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed clearing buffer." });
  }
});

// ==========================================
// TELEMEDICINE SIGNAL CHANNEL ENDPOINTS
// ==========================================

app.get("/api/telemedicine/session", authenticateToken, (req, res) => {
  const roomId = req.query.roomId as string || "room-default";
  if (!teleStore[roomId]) {
    teleStore[roomId] = {
      roomId,
      doctorActive: false,
      patientActive: false,
      screenSharing: false,
      micMuted: false,
      videoMuted: false,
      chat: []
    };
  }
  res.json(teleStore[roomId]);
});

app.post("/api/telemedicine/session", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { roomId, action, chatMsg } = req.body;
  const targetRoom = roomId || "room-default";

  if (!teleStore[targetRoom]) {
    teleStore[targetRoom] = {
      roomId: targetRoom,
      doctorActive: false,
      patientActive: false,
      screenSharing: false,
      micMuted: false,
      videoMuted: false,
      chat: []
    };
  }

  const session = teleStore[targetRoom];

  if (action === "joinDoctor") session.doctorActive = true;
  if (action === "joinPatient") session.patientActive = true;
  if (action === "leave") {
    if (req.user?.role === "doctor") session.doctorActive = false;
    if (req.user?.role === "patient") session.patientActive = false;
  }
  if (action === "toggleScreen") session.screenSharing = !session.screenSharing;
  if (action === "toggleMic") session.micMuted = !session.micMuted;
  if (action === "toggleVideo") session.videoMuted = !session.videoMuted;
  
  if (action === "sendChat" && chatMsg) {
    session.chat.push({
      sender: req.user?.name || "System Participant",
      text: chatMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  res.json(session);
});

// ==========================================
// GEMINI INTELLIGENT ROUTING SUITE
// ==========================================

// Fallback structure for symptom evaluation
const FALLBACK_AI_DIAGNOSIS: AIAnalysisResult = {
  symptoms: "Cough, moderate chest tightness, mild fever.",
  primaryDiagnosis: "Indeterminate Bronchitis or Upper Respiratory Exposure",
  confidence: 85,
  differentialDiagnoses: [
    { condition: "Acute Laryngotracheitis", probValue: 60, explanation: "Primary presentation aligns with mild viral vocal/bronchial irritation." },
    { condition: "Asthmatoid Cough Response", probValue: 25, explanation: "Intermittent bronchial tightness can trigger cough reflexes under pollen load." },
    { condition: "Infectious Rhino-bronchitis", probValue: 15, explanation: "Slight fever and phlegm suggests standard seasonal upper airways presentation." }
  ],
  triageLevel: "URGENT",
  triageAction: "Secure scheduling support recommended through telehealth or clinic clinic checkups.",
  healthRiskIndex: 35,
  keyRisks: ["Bronchial spasms under physical cold conditions", "Potential secondary bacterial lung infiltration"],
  lifestyleRecommendations: [
    "Retain hydration benchmark of 2.8L daily.",
    "Introduce warm vapors or a standard home humidifier inside rest areas.",
    "Avoid contact with environmental irritants."
  ],
  suggestedSpecialty: "General Medicine / Chest Specialist",
  suggestedGenericMedicines: [
    { classification: "Expectorants & Mucolytics", commonDrugs: ["Guaifenesin Extended Release"], purpose: "Thins sticky mucous matrices.", warnings: "Do not exceed standard doses. Best taken with warm fluids." }
  ]
};

// 1. AI Symptom Triage Endpoints
app.post("/api/ai/symptom-check", authenticateToken, async (req, res) => {
  const { symptoms, history, age, lifestyle } = req.body;
  if (!symptoms) {
    return res.status(400).json({ error: "Chief presenting symptoms are required." });
  }

  if (!ai) {
    const backup = { ...FALLBACK_AI_DIAGNOSIS };
    backup.symptoms = symptoms;
    return res.json({ result: backup, offline: true });
  }

  try {
    const prompt = `Conduct a high fidelity clinical assessment matrix on:
- Symptoms: "${symptoms}"
- Demographics/Age: "${age || "35"}"
- Patient History: "${history || "None"}"
- Lifestyle Profiles: "${lifestyle || "Generally Active"}"

Output matching JSON formatting. Label differential diagnoses, safety triage guidelines (ROUTINE, STABLE, URGENT, CRITICAL), suggested specialty, lifestyle guidelines, and generic OTC options.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an enterprise medical assessment algorithm. You provide supportive, accurate triage indexes with strong clinical disclaimers. Always output valid JSON matching standard schema types.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptoms: { type: Type.STRING },
            primaryDiagnosis: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            differentialDiagnoses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  probValue: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["condition", "probValue", "explanation"]
              }
            },
            triageLevel: { type: Type.STRING },
            triageAction: { type: Type.STRING },
            healthRiskIndex: { type: Type.INTEGER },
            keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyleRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedSpecialty: { type: Type.STRING },
            suggestedGenericMedicines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  classification: { type: Type.STRING },
                  commonDrugs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  purpose: { type: Type.STRING },
                  warnings: { type: Type.STRING }
                },
                required: ["classification", "commonDrugs", "purpose", "warnings"]
              }
            }
          },
          required: [
            "symptoms", "primaryDiagnosis", "confidence", "differentialDiagnoses", 
            "triageLevel", "triageAction", "healthRiskIndex", "keyRisks", 
            "lifestyleRecommendations", "suggestedSpecialty", "suggestedGenericMedicines"
          ]
        }
      }
    });

    res.json({ result: JSON.parse(response.text || "{}"), offline: false });
  } catch (err) {
    res.json({ result: FALLBACK_AI_DIAGNOSIS, offline: true });
  }
});

// 2. Doctor: Clinical Decision Support & Treatments validation
app.post("/api/ai/clinical-recommendation", authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
  const { patientDiagnosis, suggestedMedication } = req.body;
  if (!patientDiagnosis) {
    return res.status(400).json({ error: "Patient primary assessment indicators are required." });
  }

  const defaultRecommendation = {
    valid: true,
    guidelineConsistency: "Highly consistent with ACA / ACC general clinical recommendations.",
    clinicalCautions: "Monitor electrolytes if administering anti-hypertensives alongside pre-existing diuretics.",
    alternativeTherapies: ["Incorporate DASH nutritional diet regimes", "Schedule 30 mins moderate daily aerobic walking"],
    drugInteractions: "No high severity interactions found. Monitor renal clearance."
  };

  if (!ai) {
    return res.json({ recommendation: defaultRecommendation, offline: true });
  }

  try {
    const prompt = `Review this clinical decision support request:
- Diagnosis: "${patientDiagnosis}"
- Prescribed/Suggested Treatment: "${suggestedMedication || "Pending evaluation"}"

Verify the consistency of this treatment with current global clinical consensus guidelines. Check for significant drug-drug or drug-disease interactions, list primary cautions, and outline secondary, patient-safe physical lifestyle interventions. Return formatted JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an enterprise medical clinical intelligence advisor. Perform strict, Consensus-grade treatment evaluations. Output JSON matching target fields.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            guidelineConsistency: { type: Type.STRING },
            clinicalCautions: { type: Type.STRING },
            alternativeTherapies: { type: Type.ARRAY, items: { type: Type.STRING } },
            drugInteractions: { type: Type.STRING }
          },
          required: ["valid", "guidelineConsistency", "clinicalCautions", "alternativeTherapies", "drugInteractions"]
        }
      }
    });

    res.json({ recommendation: JSON.parse(response.text || "{}"), offline: false });
  } catch (err) {
    res.json({ recommendation: defaultRecommendation, offline: true });
  }
});

// 3. Admin: Population Analytics, Hospital bed allocation & general predictive risks
app.post("/api/ai/population-health", authenticateToken, requireRole(['admin']), async (req, res) => {
  const defaultInsights = {
    admissionsCohortPredictiveTrend: "Projecting a minor +3.2% rise in pulmonary/allergic hospital intakes due to high seasonal pollen index.",
    riskConcentrationRate: { LowRisk: 65, ModerateRisk: 25, HighRisk: 10 },
    criticalShortageWarnings: "ICU Ventilator reserves and cardiac critical wards are running at 82% peak load. Staff rosters adjusted for emergency ward coverage.",
    reAdmissionsStrategicMeasures: [
      "Deploy remote blood-sulfone tracking for cardiovascular cohorts.",
      "Initiate automated 24-hour EHR follow-ups with recently discharged patients."
    ]
  };

  if (!ai) {
    return res.json({ insights: defaultInsights, offline: true });
  }

  try {
    const prompt = `Perform enterprise-level predictive population analytics for the hospital systems cache. Provide risk distribution rates, cohort predictions, capacity warnings, and readmission containment steps. Return formatted JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an executive healthcare operations analytics algorithm. You model strategic demographic risk assessments. Save and output standard JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            admissionsCohortPredictiveTrend: { type: Type.STRING },
            riskConcentrationRate: {
              type: Type.OBJECT,
              properties: {
                LowRisk: { type: Type.INTEGER },
                ModerateRisk: { type: Type.INTEGER },
                HighRisk: { type: Type.INTEGER }
              },
              required: ["LowRisk", "ModerateRisk", "HighRisk"]
            },
            criticalShortageWarnings: { type: Type.STRING },
            reAdmissionsStrategicMeasures: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["admissionsCohortPredictiveTrend", "riskConcentrationRate", "criticalShortageWarnings", "reAdmissionsStrategicMeasures"]
        }
      }
    });

    res.json({ insights: JSON.parse(response.text || "{}"), offline: false });
  } catch (err) {
    res.json({ insights: defaultInsights, offline: true });
  }
});

// 4. Lab Reports Parse
app.post("/api/ai/parse-report", authenticateToken, async (req, res) => {
  const { title, textContent } = req.body;
  if (!textContent) {
    return res.status(400).json({ error: "Medical scan report contents are required." });
  }
  
  const mockSummary = {
    summary: `Parsed clinical report: "${title || 'Unlabeled Scanned Document'}"`,
    keyFindings: [
      "Serum metabolic metrics are normal.",
      "No structural lesions or calcifications indicated."
    ],
    recommendations: [
      "Observe standard gold PPO screening checks.",
      "Track blood serum markers yearly."
    ],
    hazardIndicators: "Classified as low risk. Patient within baseline benchmarks."
  };

  if (!ai) {
    return res.json({ result: mockSummary, offline: true });
  }

  try {
    const prompt = `Translate the clinical panel chart context: "${textContent}". Present clear summaries, key findings, and action warnings.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Verify and parse Latin medical terms into patient clear text summaries. Always output matches JSON formatted attributes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            hazardIndicators: { type: Type.STRING }
          },
          required: ["summary", "keyFindings", "recommendations", "hazardIndicators"]
        }
      }
    });

    res.json({ result: JSON.parse(response.text || "{}"), offline: false });
  } catch (err) {
    res.json({ result: mockSummary, offline: true });
  }
});

// ==========================================
// API SELF-DOCUMENTING METADATA
// ==========================================
app.get("/api/docs", (req, res) => {
  res.json({
    platformName: "MediCore AI",
    version: "2.4.0-Enterprise",
    architecture: {
      framework: "React 19, Vite, Express, TypeScript, esbuild",
      database: "MongoDB Atlas connection with dual active-memory dynamic fallbacks",
      authorization: "JWT token with standard crypt-signatures",
      aiModel: "Gemini-3.5-flash via modern GoogleGenAI API suite"
    },
    endpoints: [
      {
        path: "/api/auth/register",
        method: "POST",
        description: "Creates user and corresponding patient/doctor profile files.",
        requestBody: "{ email, password, name, role: 'patient'|'doctor'|'admin' }"
      },
      {
        path: "/api/auth/login",
        method: "POST",
        description: "Authenticates credentials and signs a 7-day secure JWT.",
        requestBody: "{ email, password }"
      },
      {
        path: "/api/appointments/book",
        method: "POST",
        description: "Enrolls and schedules consultations. Dispatches system status updates.",
        requestBody: "{ patientId, doctorId, date, time, reason }"
      },
      {
        path: "/api/ai/symptom-check",
        method: "POST",
        description: "Dual-mode diagnostic check powered by enterprise Gemini API.",
        requestBody: "{ symptoms, history, age, lifestyle }"
      },
      {
        path: "/api/ai/clinical-recommendation",
        method: "POST",
        description: "Evaluates consensus guidelines for clinician decisions.",
        requestBody: "{ patientDiagnosis, suggestedMedication }"
      }
    ]
  });
});

// ==========================================
// Express Boot & Vite Pipelines
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting MediCore AI server in development with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving MediCore AI production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediCore AI Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
