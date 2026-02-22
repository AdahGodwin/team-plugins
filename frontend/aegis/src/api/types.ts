export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    gender: string;
    phone_number: string;
    address: string;
    caregiver_email: string;
    caregiver_name: string;
    caregiver_phone: string;
}

export interface AuthResponse {
    token: string;
    user_type: string;
    username: string;
}

export interface VitalsPayload {
    systolic: number;
    diastolic: number;
    heartRate?: number;
    dailySteps?: number;
    sleepHours?: number;
    medications?: string;
    symptoms?: string[];
    notes?: string;
}

export interface AiRiskUpdate {
    level: 'STABLE' | 'ELEVATED' | 'HIGH';
    score: number;
    justification: string;
    strokePreventionSteps: string[];
    requiresDoctorVisit: boolean;
    isUrgent: boolean;
}

export interface VitalsSubmitResponse {
    vitalLogId: string;
    loggedAt: string;
    riskUpdate: AiRiskUpdate;
}

export interface VitalsHistoryEntry {
    _id: string;
    systolic: number;
    diastolic: number;
    heartRate?: number;
    dailySteps?: number;
    sleepHours?: number;
    medications?: string;
    symptoms: string[];
    notes?: string;
    aiReport?: {
        riskLevel: 'STABLE' | 'ELEVATED' | 'HIGH';
        score: number;
        justification: string;
        strokePreventionSteps: string[];
    };
    loggedAt: string;
}

export interface PatientProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    address?: string;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    smokingStatus?: string;
    diabetic?: boolean;
    risk_level?: 'STABLE' | 'ELEVATED' | 'HIGH';
    risk_reason?: string;
}
