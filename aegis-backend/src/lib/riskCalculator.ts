import { type IPatient } from '@/models/Patient.model';

export interface RiskResult {
  score: number;
  level: 'STABLE' | 'ELEVATED' | 'HIGH';
  drivers: string[];
}

export function calculateRiskScore(
  patient: IPatient,
  latestSystolic: number,
  medAdherencePercent: number,
): RiskResult {
  const drivers: string[] = [];
  let score = 0;

  if (latestSystolic >= 160) {
    score += 40;
    drivers.push('BP severely elevated (≥160 mmHg)');
  } else if (latestSystolic >= 140) {
    score += 30;
    drivers.push('BP elevated (140–159 mmHg)');
  } else if (latestSystolic >= 130) {
    score += 20;
    drivers.push('BP above normal (130–139 mmHg)');
  } else if (latestSystolic >= 120) {
    score += 10;
    drivers.push('BP mildly elevated (120–129 mmHg)');
  }

  if (medAdherencePercent < 50) {
    score += 30;
    drivers.push('Medication adherence critically low (<50%)');
  } else if (medAdherencePercent < 75) {
    score += 20;
    drivers.push('Medication adherence low (50–74%)');
  } else if (medAdherencePercent < 90) {
    score += 10;
    drivers.push('Medication adherence below target (75–89%)');
  }

  let riskFactorScore = 0;

  if (patient.diabetic) {
    riskFactorScore += 10;
    drivers.push('Diabetic');
  }

  if (patient.smokingStatus === 'current') {
    riskFactorScore += 15;
    drivers.push('Current smoker');
  } else if (patient.smokingStatus === 'former') {
    riskFactorScore += 5;
    drivers.push('Former smoker');
  }

  if (patient.dateOfBirth) {
    const today = new Date();
    const birthYear = new Date(patient.dateOfBirth).getFullYear();
    const age = today.getFullYear() - birthYear;
    if (age > 60) {
      riskFactorScore += 5;
      drivers.push('Age over 60');
    }
  }

  score += Math.min(riskFactorScore, 30);

  const finalScore = Math.min(score, 100);
  let level: 'STABLE' | 'ELEVATED' | 'HIGH';

  if (finalScore >= 70) {
    level = 'HIGH';
  } else if (finalScore >= 40) {
    level = 'ELEVATED';
  } else {
    level = 'STABLE';
  }

  return { score: finalScore, level, drivers };
}
