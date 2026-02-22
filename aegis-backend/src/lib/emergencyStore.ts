
import { randomUUID } from 'crypto';

export type EmergencyStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface EmergencyNotification {
  id:          string;
  emergencyId: string;
  recipientType: 'caregiver' | 'clinic';
  recipientName: string;
  message:     string;
  sentAt:      string; // ISO
  read:        boolean;
}

export interface EmergencyRecord {
  id:               string;
  patientId:        string;   // Patient._id (ObjectId as string)
  patientName:      string;
  timestamp:        string;   // ISO
  reportedSymptoms: string[];
  message:          string;
  riskLevelAtTrigger: 'HIGH';  // always HIGH for SOS
  status:           EmergencyStatus;
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
  reportedSymptoms: string[];
  message:          string;
  caregiverName?:   string;
  clinicName?:      string;
}

export function createEmergency(input: CreateEmergencyInput): EmergencyRecord {
  const store    = getStore();
  const id       = randomUUID();
  const timestamp = new Date().toISOString();

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
      id:            randomUUID(),
      emergencyId:   id,
      recipientType: 'caregiver',
      recipientName: input.caregiverName,
      message:       `🚨 EMERGENCY ALERT — ${input.patientName} at ${timeFormatted}.\nReported symptoms: ${symptomText}.\nPlease respond immediately.`,
      sentAt:        timestamp,
      read:          false,
    });
  }

  if (input.clinicName) {
    notifications.push({
      id:            randomUUID(),
      emergencyId:   id,
      recipientType: 'clinic',
      recipientName: input.clinicName,
      message:       `🚨 EMERGENCY ALERT — Patient ${input.patientName} triggered an SOS at ${timeFormatted}.\nReported symptoms: ${symptomText}.\nPlease contact the patient immediately.`,
      sentAt:        timestamp,
      read:          false,
    });
  }

  const record: EmergencyRecord = {
    id,
    patientId:          input.patientId,
    patientName:        input.patientName,
    timestamp,
    reportedSymptoms:   input.reportedSymptoms,
    message:            input.message,
    riskLevelAtTrigger: 'HIGH',
    status:             'OPEN',
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
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}
