export interface VitalsPayload {
    systolic:  number
    diastolic: number
    heartRate: number
    mood:      string
    symptoms:  string
    loggedAt:  string
}

export interface PatientProfile {
    id:        string
    name:      string
    fullName:  string
    age:       number
    bpAvg:     string
    riskLevel: 'low' | 'moderate' | 'high'
    streakDays: number
}