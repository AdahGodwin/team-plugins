import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IPatient } from '@/models/Patient.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export interface GeminiRiskResult {
    riskLevel: 'STABLE' | 'ELEVATED' | 'HIGH';
    score: number;
    justification: string;
    strokePreventionSteps: string[];
}

interface VitalsInput {
    systolic: number;
    diastolic: number;
    heartRate?: number;
    dailySteps?: number;
    sleepHours?: number;
    medications?: string;
    symptoms?: string[];
    notes?: string;
}

export async function analyzeStrokeRiskWithGemini(
    patient: IPatient,
    vitals: VitalsInput,
    medAdherencePercent: number,
): Promise<GeminiRiskResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Calculate age
    let age = 'Unknown';
    if (patient.dateOfBirth) {
        const today = new Date();
        const dob = new Date(patient.dateOfBirth);
        const calculatedAge =
            today.getFullYear() -
            dob.getFullYear() -
            (today.getMonth() < dob.getMonth() ||
                (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
                ? 1
                : 0);
        age = String(calculatedAge);
    }

    const prompt = `
You are a clinical decision support system specializing in stroke risk assessment.
Analyze the patient data below and estimate the probability of a stroke event.

=== PATIENT PROFILE ===
Age: ${age}
Gender: ${patient.gender ?? 'Not specified'}
Diabetic: ${patient.diabetic ? 'Yes' : 'No'}
Smoking Status: ${patient.smokingStatus}
Weight: ${patient.weight ? patient.weight + ' kg' : 'Not recorded'}
Height: ${patient.height ? patient.height + ' cm' : 'Not recorded'}

=== CURRENT VITALS ===
Systolic BP: ${vitals.systolic} mmHg
Diastolic BP: ${vitals.diastolic} mmHg
Heart Rate: ${vitals.heartRate ?? 'Not provided'} bpm
Daily Steps: ${vitals.dailySteps ?? 'Not provided'}
Sleep Hours: ${vitals.sleepHours ?? 'Not provided'} hrs/night
Current Medications: ${vitals.medications ?? 'None listed'}
Reported Symptoms: ${vitals.symptoms?.length ? vitals.symptoms.join(', ') : 'None'}
Additional Notes: ${vitals.notes ?? 'None'}

=== MEDICATION ADHERENCE ===
30-Day Adherence Rate: ${medAdherencePercent}%

=== INSTRUCTIONS ===
Respond ONLY with a valid JSON object in exactly this structure. No markdown, no extra text:
{
  "riskLevel": "STABLE",
  "score": 25,
  "justification": "1-2 sentence clinical explanation of the risk assessment.",
  "strokePreventionSteps": [
    "Personalized, actionable prevention step 1",
    "Personalized, actionable prevention step 2",
    "Personalized, actionable prevention step 3"
  ]
}

Rules:
- "riskLevel" must be exactly one of: "STABLE", "ELEVATED", "HIGH"
- "score" must be an integer from 0 to 100
- "justification" must reference specific values from the data above
- "strokePreventionSteps" must have 3–5 entries, personalized to the patient's specific risk factors
`;

    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
        },
    });

    const raw = result.response.text();

    // Strip possible markdown code fences
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as GeminiRiskResult;

    // Clamp score
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));

    // Normalise riskLevel
    const level = String(parsed.riskLevel).toUpperCase();
    parsed.riskLevel =
        level === 'HIGH' ? 'HIGH' : level === 'ELEVATED' ? 'ELEVATED' : 'STABLE';

    return parsed;
}
