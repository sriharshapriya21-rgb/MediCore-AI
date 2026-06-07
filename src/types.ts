export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  avatar: string;
  availability: string[];
  rating: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: 'In-Person' | 'Video Call';
  reason: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  diagnoses: string[];
  medicines: {
    name: string;
    dosage: string; // e.g., "500mg"
    frequency: string; // e.g., "Once daily"
    duration: string; // e.g., "7 days"
    instructions: string; // e.g., "Take after meals"
  }[];
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  title: string;
  type: 'Lab Report' | 'Diagnosis' | 'Immunization' | 'Prescription' | 'AI Insights';
  doctorName?: string;
  description: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
    parsedSummary?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'patient' | 'doctor';
  text: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  symptoms: string;
  primaryDiagnosis: string;
  confidence: number;
  differentialDiagnoses: {
    condition: string;
    probValue: number; // 0 to 100
    explanation: string;
  }[];
  triageLevel: 'CRITICAL' | 'URGENT' | 'STABLE' | 'ROUTINE';
  triageAction: string;
  healthRiskIndex: number; // 0 to 100
  keyRisks: string[];
  lifestyleRecommendations: string[];
  suggestedSpecialty: string;
  suggestedGenericMedicines: {
    classification: string;
    commonDrugs: string[];
    purpose: string;
    warnings: string;
  }[];
}
