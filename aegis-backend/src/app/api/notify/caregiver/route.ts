import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, unauthorizedResponse } from '@/lib/response';
import { sendEmail } from '@/lib/email';
import Patient, { type IPatient } from '@/models/Patient.model';
import RiskScore, { type IRiskScore } from '@/models/RiskScore.model';
import User from '@/models/User.model';
import Admin, { type IAdmin } from '@/models/Admin.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

interface NotifyBody {
  patientId: string;
  adminNote?: string;
}

function buildEmailHtml({
  caregiverName,
  patientName,
  riskLevel,
  adminNote,
  senderName,
  hospitalName,
}: {
  caregiverName: string;
  patientName: string;
  riskLevel: string;
  adminNote?: string;
  senderName: string;
  hospitalName: string;
}): string {
  const riskColour =
    riskLevel === 'high'
      ? '#ef4444'
      : riskLevel === 'elevated'
      ? '#f97316'
      : '#22c55e';

  const riskLabel = riskLevel.toUpperCase();

  const adminNoteBlock = adminNote
    ? `
      <div style="margin-top:20px;padding:16px 20px;background:#fefce8;border-left:4px solid #eab308;border-radius:8px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">Note from ${senderName}</p>
        <p style="margin:0;font-size:15px;color:#78350f;line-height:1.6;">${adminNote}</p>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Aegis AI — Caregiver Alert</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#059669;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-.3px;">Aegis AI</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#a7f3d0;">Patient Health Monitoring System</p>
                  </td>
                  <td align="right">
                    <div style="background:rgba(255,255,255,.15);border-radius:10px;padding:10px 14px;display:inline-block;">
                      <p style="margin:0;font-size:11px;color:#d1fae5;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Caregiver Alert</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#0f172a;">Dear ${caregiverName},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                You are receiving this message because <strong>${patientName}</strong> is currently under your care at
                <strong>${hospitalName}</strong>. Our monitoring system has flagged an important update that requires your attention.
              </p>

              <!-- Risk badge -->
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.07em;">Patient</p>
                      <p style="margin:0;font-size:20px;font-weight:800;color:#0f172a;">${patientName}</p>
                    </td>
                    <td align="right">
                      <div style="display:inline-block;background:${riskColour};color:#ffffff;font-size:13px;font-weight:800;padding:6px 14px;border-radius:999px;letter-spacing:.05em;">
                        ${riskLabel} RISK
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Action request -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#166534;">Immediate Action Required</p>
                <p style="margin:0;font-size:15px;color:#15803d;line-height:1.7;">
                  Please <strong>visit or contact ${patientName} as soon as possible</strong> to check on their well-being.
                  Early intervention is critical to preventing complications.
                </p>
              </div>

              ${adminNoteBlock}

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />

              <!-- Sent by -->
              <p style="margin:0;font-size:13px;color:#94a3b8;">
                This alert was sent by <strong style="color:#475569;">${senderName}</strong> at <strong style="color:#475569;">${hospitalName}</strong> via Aegis AI.
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">
                If you believe you received this message in error, please contact the hospital directly.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} Aegis AI · Confidential Medical Communication · ${hospitalName}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function handler(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Only admins can send caregiver notifications');
    }

    const body = (await req.json()) as NotifyBody;
    const { patientId, adminNote } = body;

    if (!patientId) {
      return errorResponse('patientId is required', 400);
    }

    // Load admin info for the sender name / hospital
    const admin = await Admin.findById(req.user.patientId).lean<IAdmin>();
    const adminUser = await User.findById(req.user.userId).select('firstName lastName').lean();

    const senderName = adminUser
      ? `${adminUser.firstName} ${adminUser.lastName}`
      : 'Your care team';
    const hospitalName = admin?.hospitalName ?? 'Aegis Hospital';

    // Load patient + their user record for the full name
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return errorResponse('Invalid patientId', 400);
    }

    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return errorResponse('Patient not found', 404);
    }

    if (!patient.caregiverEmail) {
      return errorResponse('This patient has no caregiver email on record', 422);
    }

    const patientUser = await User.findById(patient.userId).select('firstName lastName').lean();
    const patientName = patientUser
      ? `${patientUser.firstName} ${patientUser.lastName}`
      : 'your patient';

    // Get latest risk score
    const latestRisk = await RiskScore.findOne({ patientId: patient._id })
      .sort({ calculatedAt: -1 })
      .lean<IRiskScore>();
    const riskLevel = (latestRisk?.level ?? 'unknown').toLowerCase();

    const html = buildEmailHtml({
      caregiverName: patient.caregiverName ?? 'Caregiver',
      patientName,
      riskLevel,
      adminNote: adminNote?.trim() || undefined,
      senderName,
      hospitalName,
    });

    const result = await sendEmail({
      to: patient.caregiverEmail,
      subject: `⚠️ Urgent: Please check on ${patientName} — Aegis AI Alert`,
      html,
    });

    if (!result.success) {
      return errorResponse('Failed to send email. Please try again.', 500);
    }

    return successDataResponse({
      sent: true,
      to: patient.caregiverEmail,
      caregiverName: patient.caregiverName,
      patientName,
    });
  } catch (err) {
    console.error('[POST /api/notify/caregiver]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
