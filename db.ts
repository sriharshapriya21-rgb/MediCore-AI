import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import { Patient, Doctor, Appointment, Prescription, MedicalRecord } from './src/types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let dbInstance: Db | null = null;
let mongoClientInstance: MongoClient | null = null;

// Initialize MongoDB Connection lazily and safely
export async function getDb(): Promise<Db | null> {
  // Directly fall back to realistic memory-store to run in frontend/demo mode without MongoDB
  return null;
}

// User schema representation
export interface SystemUser {
  id: string;
  email: string;
  passwordHash: string; // Plaintext or hashed for sandbox
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  profileId?: string; // links to patient or doctor entry
}

// Memory database containers (synchronized with standard seed values)
export let memUsers: SystemUser[] = [
  { id: "usr-admin", email: "admin@medicore.ai", passwordHash: "admin123", name: "Platform Executive Administrator", role: "admin" },
  { id: "usr-doc-1", email: "doctor@medicore.ai", passwordHash: "doctor123", name: "Dr. Elizabeth Vance", role: "doctor", profileId: "doc-1" },
  { id: "usr-pat-1", email: "patient@medicore.ai", passwordHash: "patient123", name: "Sarah Jenkins", role: "patient", profileId: "pat-1" }
];

export let memPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Sarah Jenkins",
    email: "patient@medicore.ai", // Bind patient login email
    phone: "+1 (555) 019-2834",
    dob: "1988-11-14",
    gender: "Female",
    bloodType: "A-positive (A+)",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Mild Asthma", "Hypertension"],
    emergencyContact: {
      name: "David Jenkins",
      phone: "+1 (555) 019-2835",
      relation: "Spouse"
    }
  },
  {
    id: "pat-2",
    name: "Alex Carter",
    email: "alex.carter@outlook.com",
    phone: "+1 (555) 021-9876",
    dob: "1975-04-22",
    gender: "Male",
    bloodType: "O-negative (O-)",
    allergies: ["Sulfonamides"],
    chronicConditions: ["Type 2 Diabetes"],
    emergencyContact: {
      name: "Helen Carter",
      phone: "+1 (555) 021-9877",
      relation: "Mother"
    }
  },
  {
    id: "pat-3",
    name: "Liam Mitchell",
    email: "liam.mitchell@gmail.com",
    phone: "+1 (555) 432-8761",
    dob: "1995-08-09",
    gender: "Male",
    bloodType: "B-positive (B+)",
    allergies: [],
    chronicConditions: ["Seasonal Allergies"],
    emergencyContact: {
      name: "Sofia Mitchell",
      phone: "+1 (555) 432-8760",
      relation: "Sister"
    }
  }
];

export let memDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Elizabeth Vance",
    specialty: "Cardiology",
    email: "doctor@medicore.ai", // Bind doctor login email
    phone: "+1 (555) 888-0201",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    availability: ["Monday", "Wednesday", "Friday"],
    rating: 4.9
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Brody",
    specialty: "Neurology",
    email: "m.brody@smarthealth.org",
    phone: "+1 (555) 888-0202",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    availability: ["Tuesday", "Thursday"],
    rating: 4.8
  },
  {
    id: "doc-3",
    name: "Dr. Robert Chen",
    specialty: "General Medicine",
    email: "r.chen@smarthealth.org",
    phone: "+1 (555) 888-0203",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    rating: 4.7
  }
];

export let memAppointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "pat-1",
    patientName: "Sarah Jenkins",
    doctorId: "doc-3",
    doctorName: "Dr. Robert Chen",
    doctorSpecialty: "General Medicine",
    date: "2026-06-08",
    time: "10:30 AM",
    status: "Scheduled",
    type: "Video Call",
    reason: "Asthma management review and prescription refill check."
  },
  {
    id: "apt-2",
    patientId: "pat-1",
    patientName: "Sarah Jenkins",
    doctorId: "doc-1",
    doctorName: "Dr. Elizabeth Vance",
    doctorSpecialty: "Cardiology",
    date: "2026-06-15",
    time: "02:00 PM",
    status: "Scheduled",
    type: "In-Person",
    reason: "Routine cardiovascular status check following hypertension management."
  },
  {
    id: "apt-3",
    patientId: "pat-2",
    patientName: "Alex Carter",
    doctorId: "doc-1",
    doctorName: "Dr. Elizabeth Vance",
    doctorSpecialty: "Cardiology",
    date: "2026-06-02",
    time: "09:00 AM",
    status: "Completed",
    type: "Video Call",
    reason: "Cardiology consultation monitoring and telemetry assessment.",
    notes: "Patient exhibits excellent cardiovascular rhythm benchmarks. Refilled treatment."
  }
];

export let memPrescriptions: Prescription[] = [
  {
    id: "rx-1",
    appointmentId: "apt-3",
    patientId: "pat-2",
    patientName: "Alex Carter",
    patientAge: 51,
    patientGender: "Male",
    doctorId: "doc-1",
    doctorName: "Dr. Elizabeth Vance",
    doctorSpecialty: "Cardiology",
    date: "2026-06-02",
    diagnoses: ["Type 2 Diabetes Mellitus & Arterial Health"],
    medicines: [
      {
        name: "Metformin Hydrochloride",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "90 days",
        instructions: "Take immediately after breakfast and dinner."
      }
    ],
    notes: "Continue light daily physical exercise and limit refined carbohydrates."
  },
  {
    id: "rx-2",
    patientId: "pat-1",
    patientName: "Sarah Jenkins",
    patientAge: 37,
    patientGender: "Female",
    doctorId: "doc-3",
    doctorName: "Dr. Robert Chen",
    doctorSpecialty: "General Medicine",
    date: "2026-05-12",
    diagnoses: ["Acute Bronchitic Exacerbation"],
    medicines: [
      {
        name: "Albuterol Inhaler",
        dosage: "90 mcg/actuation",
        frequency: "As needed (PRN)",
        duration: "30 days",
        instructions: "1-2 inhalations every 4 hours for shortness of breath or wheezing."
      }
    ],
    notes: "Avoid cold liquids and sudden ambient temperature transitions."
  }
];

export let memMedicalRecords: MedicalRecord[] = [
  {
    id: "rec-1",
    patientId: "pat-1",
    date: "2026-05-12",
    title: "Pulmonary Function Test Summary",
    type: "Lab Report",
    doctorName: "Dr. Robert Chen",
    description: "Spirometry evaluation displays FEV1/FVC ratios within baseline expected tolerance. FEV1 increased post-bronchodilator implementation."
  },
  {
    id: "rec-2",
    patientId: "pat-1",
    date: "2026-05-10",
    title: "Comprehensive Metabolic Panel (CMP)",
    type: "Lab Report",
    doctorName: "Dr. Robert Chen",
    description: "Serum electrolytes, renal filtration criteria, and hepatic enzymes are all normal. Glucose: 92 mg/dL. HbA1c: 5.4%."
  }
];

export interface NotificationLog {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  channel: string; // "Email/SMS" | "System"
  read: boolean;
  userId?: string; // Bind specific users if required
}

export let memNotifications: NotificationLog[] = [
  {
    id: "not-1",
    timestamp: "2026-06-04T10:05:00Z",
    title: "Appointment Securely Booked",
    message: "Email reminder transmitted successfully for Sarah Jenkins: Video Consultation on 2026-06-08.",
    channel: "System Alert",
    read: false,
    userId: "pat-1"
  }
];

// Helper to seed mongo when database starts
async function seedMongoDatabase(db: Db) {
  try {
    const list = await db.listCollections().toArray();
    const names = list.map(c => c.name);
    
    if (!names.includes("users") || (await db.collection("users").countDocuments()) === 0) {
      await db.collection("users").insertMany(memUsers);
    }
    if (!names.includes("patients") || (await db.collection("patients").countDocuments()) === 0) {
      await db.collection("patients").insertMany(memPatients);
    }
    if (!names.includes("doctors") || (await db.collection("doctors").countDocuments()) === 0) {
      await db.collection("doctors").insertMany(memDoctors);
    }
    if (!names.includes("appointments") || (await db.collection("appointments").countDocuments()) === 0) {
      await db.collection("appointments").insertMany(memAppointments);
    }
    if (!names.includes("prescriptions") || (await db.collection("prescriptions").countDocuments()) === 0) {
      await db.collection("prescriptions").insertMany(memPrescriptions);
    }
    if (!names.includes("medicalRecords") || (await db.collection("medicalRecords").countDocuments()) === 0) {
      await db.collection("medicalRecords").insertMany(memMedicalRecords);
    }
    if (!names.includes("notifications") || (await db.collection("notifications").countDocuments()) === 0) {
      await db.collection("notifications").insertMany(memNotifications);
    }
    console.log("Database initialized & collection schemas verified.");
  } catch (err) {
    console.error("Seeding Mongo collections failed:", err);
  }
}

// ----------------------------------------------------
// DB COLLECTION ABSTRACT API WRAPPERS (MongoDB vs Memory)
// ----------------------------------------------------

export const Collections = {
  users: {
    async findOne(filter: Partial<SystemUser>) {
      const db = await getDb();
      if (db) return await db.collection("users").findOne(filter) as any;
      return memUsers.find(u => {
        if (filter.email && u.email !== filter.email) return false;
        if (filter.id && u.id !== filter.id) return false;
        return true;
      }) || null;
    },
    async insertOne(doc: SystemUser) {
      const db = await getDb();
      if (db) {
        await db.collection("users").insertOne(doc);
        return doc;
      }
      memUsers.push(doc);
      return doc;
    }
  },
  patients: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("patients").find(filter).toArray() as any[];
      return memPatients.filter(p => {
        if (filter.id && p.id !== filter.id) return false;
        if (filter.email && p.email !== filter.email) return false;
        return true;
      });
    },
    async findOne(filter: any) {
      const db = await getDb();
      if (db) return await db.collection("patients").findOne(filter) as any;
      return memPatients.find(p => p.id === filter.id || p.email === filter.email) || null;
    },
    async insertOne(doc: Patient) {
      const db = await getDb();
      if (db) {
        await db.collection("patients").insertOne(doc);
        return doc;
      }
      memPatients.push(doc);
      return doc;
    },
    async updateOne(id: string, update: Partial<Patient>) {
      const db = await getDb();
      if (db) {
        await db.collection("patients").updateOne({ id }, { $set: update });
        return { success: true };
      }
      const idx = memPatients.findIndex(p => p.id === id);
      if (idx !== -1) {
        memPatients[idx] = { ...memPatients[idx], ...update };
      }
      return { success: true };
    },
    async deleteOne(id: string) {
      const db = await getDb();
      if (db) {
        await db.collection("patients").deleteOne({ id });
        return { success: true };
      }
      const idx = memPatients.findIndex(p => p.id === id);
      if (idx !== -1) memPatients.splice(idx, 1);
      return { success: true };
    }
  },
  doctors: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("doctors").find(filter).toArray() as any[];
      return memDoctors;
    },
    async findOne(filter: any) {
      const db = await getDb();
      if (db) return await db.collection("doctors").findOne(filter) as any;
      return memDoctors.find(d => d.id === filter.id || d.email === filter.email) || null;
    },
    async insertOne(doc: Doctor) {
      const db = await getDb();
      if (db) {
        await db.collection("doctors").insertOne(doc);
        return doc;
      }
      memDoctors.push(doc);
      return doc;
    },
    async updateOne(id: string, update: Partial<Doctor>) {
      const db = await getDb();
      if (db) {
        await db.collection("doctors").updateOne({ id }, { $set: update });
        return { success: true };
      }
      const idx = memDoctors.findIndex(d => d.id === id);
      if (idx !== -1) memDoctors[idx] = { ...memDoctors[idx], ...update };
      return { success: true };
    },
    async deleteOne(id: string) {
      const db = await getDb();
      if (db) {
        await db.collection("doctors").deleteOne({ id });
        return { success: true };
      }
      const idx = memDoctors.findIndex(d => d.id === id);
      if (idx !== -1) memDoctors.splice(idx, 1);
      return { success: true };
    }
  },
  appointments: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("appointments").find(filter).toArray() as any[];
      return memAppointments.filter(a => {
        if (filter.patientId && a.patientId !== filter.patientId) return false;
        if (filter.doctorId && a.doctorId !== filter.doctorId) return false;
        return true;
      });
    },
    async insertOne(doc: Appointment) {
      const db = await getDb();
      if (db) {
        await db.collection("appointments").insertOne(doc);
        return doc;
      }
      memAppointments.push(doc);
      return doc;
    },
    async updateOne(id: string, update: Partial<Appointment>) {
      const db = await getDb();
      if (db) {
        await db.collection("appointments").updateOne({ id }, { $set: update });
        return { success: true };
      }
      const idx = memAppointments.findIndex(a => a.id === id);
      if (idx !== -1) memAppointments[idx] = { ...memAppointments[idx], ...update };
      return { success: true };
    }
  },
  prescriptions: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("prescriptions").find(filter).toArray() as any[];
      return memPrescriptions.filter(p => {
        if (filter.patientId && p.patientId !== filter.patientId) return false;
        if (filter.doctorId && p.doctorId !== filter.doctorId) return false;
        return true;
      });
    },
    async insertOne(doc: Prescription) {
      const db = await getDb();
      if (db) {
        await db.collection("prescriptions").insertOne(doc);
        return doc;
      }
      memPrescriptions.push(doc);
      return doc;
    }
  },
  medicalRecords: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("medicalRecords").find(filter).toArray() as any[];
      return memMedicalRecords.filter(r => {
        if (filter.patientId && r.patientId !== filter.patientId) return false;
        return true;
      });
    },
    async insertOne(doc: MedicalRecord) {
      const db = await getDb();
      if (db) {
        await db.collection("medicalRecords").insertOne(doc);
        return doc;
      }
      memMedicalRecords.push(doc);
      return doc;
    }
  },
  notifications: {
    async find(filter: any = {}) {
      const db = await getDb();
      if (db) return await db.collection("notifications").find(filter).toArray() as any[];
      return memNotifications;
    },
    async insertOne(doc: NotificationLog) {
      const db = await getDb();
      if (db) {
        await db.collection("notifications").insertOne(doc);
        return doc;
      }
      memNotifications.unshift(doc);
      return doc;
    },
    async markAllRead() {
      const db = await getDb();
      if (db) {
        await db.collection("notifications").updateMany({}, { $set: { read: true } });
        return;
      }
      memNotifications.forEach(n => n.read = true);
    }
  }
};
