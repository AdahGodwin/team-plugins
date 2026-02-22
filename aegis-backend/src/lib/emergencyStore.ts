
import { randomUUID } from 'crypto';

export type EmergencyStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface EmergencyNotification {
  id:          string;
  emergencyId: string;
  type:        'caregiver' | 'clinic';   // matches frontend
  recipient:   string;                   // name of caregiver / clinic
  contact:     string;                   // phone or email used
  message:     string;
  sentAt:      string; // ISO
  read:        boolean;
}

export interface EmergencyRecord {
  id:               string;
  patientId:        string;   // Patient._id (ObjectId as string)
  patientName:      string;
  patientPhone?:    string;
  triggeredAt:      string;   // ISO  (was: timestamp)
  reportedSymptoms: string[];
  message:          string;
  riskLevelAtTrigger: 'HIGH';  // always HIGH for SOS
  status:           EmergencyStatus;
  caregiverName?:   string;
  caregiverPhone?:  string;
  clinicName?:      string;
  acknowledgedBy?:  string;
  acknowledgedAt?:  string;
  notifications:    EmergencyNotification[];
}


declare global {
  // eslint-disable-next-line no-var
  var __emergencyStore: EmergencyRecord[] | undefined;
}

function getStore(): EmergencyRecord[] {
  if (!globalThis.__emergencyStore) {
    globalThis.__emergencyStore = [];
  }
  return globalThis.__emergencyStore;
}

export interface CreateEmergencyInput {
  patientId:        string;
  patientName:      string;
  patientPhone?:    string;
  reportedSymptoms: string[];
  message:          string;
  caregiverName?:   string;
  caregiverPhone?:  string;
  clinicName?:      string;
  clinicPhone?:     string;
}

export function createEmergency(input: CreateEmergencyInput): EmergencyRecord {
  const store       = getStore();
  const id          = randomUUID();
  const triggeredAt = new Date().toISOString();

  const timeFormatted = new Date().toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
  });
  const symptomText =
    input.reportedSymptoms.length > 0
      ? input.reportedSymptoms.join(', ')
      : 'none specified';

  const notifications: EmergencyNotification[] = [];

  if (input.caregiverName) {
    notifications.push({
      id:          randomUUID(),
      emergencyId: id,
      type:        'caregiver',
      recipient:   input.caregiverName,
      contact:     input.caregiverPhone ?? '',
      message:     `🚨 EMERGENCY ALERT — ${input.patientName} at ${timeFormatted}.\nReported symptoms: ${symptomText}.\nPlease respond immediately.`,
      sentAt:      triggeredAt,
      read:        false,
    });
  }

  if (input.clinicName) {
    notifications.push({
      id:          randomUUID(),
      emergencyId: id,
      type:        'clinic',
      recipient:   input.clinicName,
      contact:     input.clinicPhone ?? '',
      message:     `🚨 EMERGENCY ALERT — Patient ${input.patientName} triggered an SOS at ${timeFormatted}.\nReported symptoms: ${symptomText}.\nPlease contact the patient immediately.`,
      sentAt:      triggeredAt,
      read:        false,
    });
  }

  const record: EmergencyRecord = {
    id,
    patientId:          input.patientId,
    patientName:        input.patientName,
    patientPhone:       input.patientPhone,
    triggeredAt,
    reportedSymptoms:   input.reportedSymptoms,
    message:            input.message,
    riskLevelAtTrigger: 'HIGH',
    status:             'PENDING',
    caregiverName:      input.caregiverName,
    caregiverPhone:     input.caregiverPhone,
    clinicName:         input.clinicName,
    notifications,
  };

  store.push(record);
  return record;
}

export function getEmergencyById(id: string): EmergencyRecord | undefined {
  return getStore().find((e) => e.id === id);
}

export function acknowledgeEmergency(
  id: string,
  acknowledgedBy: string,
): EmergencyRecord | null {
  const record = getStore().find((e) => e.id === id);
  if (!record) return null;

  record.status         = 'ACKNOWLEDGED';
  record.acknowledgedBy = acknowledgedBy;
  record.acknowledgedAt = new Date().toISOString();

  record.notifications.forEach((n) => { n.read = true; });

  return record;
}

export function getAllEmergencies(): EmergencyRecord[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
  );
}
