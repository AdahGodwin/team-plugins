import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/response';
import { sendEmail } from '@/lib/email';
import Admin, { type IAdmin } from '@/models/Admin.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';

function buildReminderEmail(firstName: string, hospitalName: string): string {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Daily Health Reminder</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#059669,#10b981);padding:32px 40px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" align="center">
                    <tr>
                      <td style="background:rgba(255,255,255,0.2);border-radius:12px;padding:10px 14px;display:inline-block;">
                        <span style="font-size:22px;">🛡️</span>
                      </td>
                    </tr>
                  </table>
                  <h1 style="margin:16px 0 4px;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">Aegis Health</h1>
                  <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;">${hospitalName}</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">${date}</p>
                  <h2 style="margin:0 0 20px;color:#0f172a;font-size:20px;font-weight:800;">Hello, ${firstName} 👋</h2>
                  <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
                    This is your daily health check-in reminder from <strong>${hospitalName}</strong>.
                    Logging your vitals consistently helps your care team monitor your health and respond quickly when it matters most.
                  </p>

                  <!-- Checklist -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                    <tr><td style="padding-bottom:12px;">
                      <p style="margin:0 0 12px;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Today's Checklist</p>
                    </td></tr>
                    ${[
                      ['💓', 'Log your blood pressure & heart rate'],
                      ['🌡️', 'Record any symptoms you may be feeling'],
                      ['💊', 'Take your prescribed medications on time'],
                      ['💧', 'Stay hydrated — aim for 8 glasses of water'],
                      ['🚶', 'Do light physical activity if advised by your doctor'],
                    ].map(([icon, text]) => `
                    <tr>
                      <td style="padding:6px 0;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:28px;font-size:16px;vertical-align:top;">${icon}</td>
                            <td style="color:#334155;font-size:14px;line-height:1.5;">${text}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>`).join('')}
                  </table>

                  <!-- CTA -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://new-aegis-backend.vercel.app'}"
                           style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:0.2px;">
                          Log My Vitals Today →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
                  <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;">
                    You are receiving this because you are a registered patient at <strong>${hospitalName}</strong>.
                  </p>
                  <p style="margin:0;color:#94a3b8;font-size:12px;">
                    © ${new Date().getFullYear()} Aegis Health · Stroke Prevention Platform
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Access restricted to admin accounts');
    }

    const adminId = req.user.patientId;
    const admin = await Admin.findById(adminId).lean<IAdmin>();
    if (!admin) return notFoundResponse('Admin profile');

    if (!admin.hospitalId) {
      return errorResponse('Your admin account is not linked to a hospital.', 422);
    }

    const hospitalOid = new mongoose.Types.ObjectId(
      (admin.hospitalId as mongoose.Types.ObjectId).toString(),
    );

    // Fetch all patients belonging to this hospital
    const patients = await Patient.find({ hospitalId: hospitalOid })
      .select('_id userId')
      .lean<IPatient[]>();

    if (patients.length === 0) {
      return successDataResponse({ sent: 0, failed: 0, message: 'No patients found for this hospital.' });
    }

    // Resolve user emails & names in parallel
    const results = await Promise.allSettled(
      patients.map(async (patient) => {
        const user = await User.findById(patient.userId)
          .select('firstName email')
          .lean();
        if (!user?.email) throw new Error('No email for patient');

        const result = await sendEmail({
          to: user.email,
          subject: `Your Daily Health Reminder — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          html: buildReminderEmail(user.firstName, admin.hospitalName ?? 'Your Hospital'),
        });

        if (!result.success) throw new Error('Email send failed');
        return user.email;
      }),
    );

    const sent   = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return successDataResponse({
      sent,
      failed,
      total: patients.length,
      message: `Reminders sent to ${sent} patient${sent !== 1 ? 's' : ''}${failed > 0 ? `, ${failed} failed` : ''}.`,
    });
  } catch (err) {
    console.error('[POST /api/admin/notify-all]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
