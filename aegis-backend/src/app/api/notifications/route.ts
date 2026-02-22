import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successResponse,
  successDataResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/response';
import Notification, { type INotification } from '@/models/Notification.model';
import mongoose from 'mongoose';
import { z } from 'zod';

const markReadSchema = z.object({
  id:     z.string().min(1, 'Notification ID is required'),
  isRead: z.boolean(),
});

async function getHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const notifications = await Notification.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    })
      .sort({ createdAt: -1 })
      .lean<INotification[]>();

    const unreadCount = notifications.filter((n: INotification) => !n.isRead).length;

    return successResponse({ data: notifications, unreadCount });
  } catch (err) {
    console.error('[GET /api/notifications]', err);
    return errorResponse('Internal server error', 500);
  }
}

async function patchHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const body: unknown = await req.json();
    const parsed = markReadSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { id, isRead } = parsed.data;

    const notification = await Notification.findOneAndUpdate(
      {
        _id:       new mongoose.Types.ObjectId(id),
        patientId: new mongoose.Types.ObjectId(patientId),
      },
      { $set: { isRead } },
      { new: true },
    ).lean();

    if (!notification) {
      return notFoundResponse('Notification');
    }

    return successDataResponse({ success: true });
  } catch (err) {
    console.error('[PATCH /api/notifications]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
