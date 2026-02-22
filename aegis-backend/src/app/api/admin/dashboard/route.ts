import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/response';
import Admin, { type IAdmin } from '@/models/Admin.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import VitalLog, { type IVitalLog } from '@/models/VitalLog.model';
import RiskScore, { type IRiskScore } from '@/models/RiskScore.model';
import { getAllEmergencies } from '@/lib/emergencyStore';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// ── GET /api/admin/dashboard ──────────────────────────────────────────────────
// Returns all data needed by the AdminOverview page:
//   - stat cards  (totalPatients, highRisk, logsToday, activeCaretakers)
//   - riskDistribution
//   - recentActivity  (last 5 vital logs with patient details)
//   - openEmergencies count

async function handler(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Access restricted to admin accounts');
    }

    // ── Resolve admin → hospitalId ──────────────────────────────────────────
    const adminId = req.user.patientId;
    const admin   = await Admin.findById(adminId).lean<IAdmin>();
    if (!admin) return notFoundResponse('Admin profile');

    if (!admin.hospitalId) {
      return errorResponse(
        'Your admin account is not linked to a hospital.',
        422,
      );
    }

    const hospitalOid = new mongoose.Types.ObjectId(
      (admin.hospitalId as mongoose.Types.ObjectId).toString(),
    );

    // ── Load all patients for this hospital ─────────────────────────────────
    const patients = await Patient.find({ hospitalId: hospitalOid })
      .select('_id userId caregiverName caregiverPhone smokingStatus diabetic')
      .lean<IPatient[]>();

    const patientIds = patients.map((p) => p._id as mongoose.Types.ObjectId);
    const totalPatients = patientIds.length;

    if (totalPatients === 0) {
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalPatients:    0,
            highRiskCases:    0,
            logsToday:        0,
            activeCaretakers: 0,
          },
          riskDistribution: { high: 0, elevated: 0, stable: 0, total: 0 },
          recentActivity:   [],
          openEmergencies:  0,
        },
      });
    }

    // ── Latest risk score per patient ───────────────────────────────────────
    // Aggregate to get only the most recent risk score for each patient.
    const latestRiskScores = await RiskScore.aggregate<{
      _id: mongoose.Types.ObjectId;
      level: 'HIGH' | 'ELEVATED' | 'STABLE';
      score: number;
      calculatedAt: Date;
    }>([
      { $match: { patientId: { $in: patientIds } } },
      { $sort:  { calculatedAt: -1 } },
      {
        $group: {
          _id:          '$patientId',
          level:        { $first: '$level' },
          score:        { $first: '$score' },
          calculatedAt: { $first: '$calculatedAt' },
        },
      },
    ]);

    const riskMap = new Map(latestRiskScores.map((r) => [r._id.toString(), r]));

    let highRiskCases = 0;
    let elevatedCases = 0;
    let stableCases   = 0;

    for (const pid of patientIds) {
      const risk = riskMap.get(pid.toString());
      if (!risk) { stableCases++; continue; } // no score yet → treat as stable
      if (risk.level === 'HIGH')     highRiskCases++;
      else if (risk.level === 'ELEVATED') elevatedCases++;
      else                            stableCases++;
    }

    // ── Logs today ──────────────────────────────────────────────────────────
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const logsToday = await VitalLog.countDocuments({
      patientId: { $in: patientIds },
      loggedAt:  { $gte: startOfDay },
    });

    // ── Active caretakers ───────────────────────────────────────────────────
    const activeCaretakers = patients.filter(
      (p) => p.caregiverName && p.caregiverName.trim().length > 0,
    ).length;

    // ── Recent activity: last 5 vital logs ──────────────────────────────────
    const recentLogs = await VitalLog.find({ patientId: { $in: patientIds } })
      .sort({ loggedAt: -1 })
      .limit(5)
      .lean<IVitalLog[]>();

    // Map patientId → { fullName, userId }
    const patientUserMap = new Map<
      string,
      { fullName: string; riskLevel: string; patientId: string }
    >();

    await Promise.all(
      patients.map(async (p) => {
        const user = await User.findById(p.userId)
          .select('firstName lastName')
          .lean();
        const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
        const risk     = riskMap.get((p._id as mongoose.Types.ObjectId).toString());
        patientUserMap.set((p._id as mongoose.Types.ObjectId).toString(), {
          fullName,
          riskLevel: risk?.level ?? 'STABLE',
          patientId: (p._id as mongoose.Types.ObjectId).toString(),
        });
      }),
    );

    const recentActivity = recentLogs.map((log) => {
      const info = patientUserMap.get(log.patientId.toString());
      return {
        logId:      (log._id as mongoose.Types.ObjectId).toString(),
        patientId:  log.patientId.toString(),
        fullName:   info?.fullName  ?? 'Unknown',
        riskLevel:  info?.riskLevel ?? 'STABLE',
        systolic:   log.systolic,
        diastolic:  log.diastolic,
        heartRate:  log.heartRate  ?? null,
        symptoms:   log.symptoms   ?? [],
        loggedAt:   log.loggedAt instanceof Date
          ? log.loggedAt.toISOString()
          : new Date(log.loggedAt).toISOString(),
      };
    });

    // ── Open emergencies count ───────────────────────────────────────────────
    const openEmergencies = getAllEmergencies().filter(
      (e) =>
        e.status === 'OPEN' &&
        patientIds.some((pid) => pid.toString() === e.patientId),
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalPatients,
          highRiskCases,
          logsToday,
          activeCaretakers,
        },
        riskDistribution: {
          high:     highRiskCases,
          elevated: elevatedCases,
          stable:   stableCases,
          total:    totalPatients,
        },
        recentActivity,
        openEmergencies,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/dashboard]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
