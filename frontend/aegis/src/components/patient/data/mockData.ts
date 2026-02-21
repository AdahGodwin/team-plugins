import { ShieldCheck, AlertTriangle } from 'lucide-react'

export type RiskLevel = 'stable' | 'elevated' | 'high'

export const MOCK_PATIENT = {
    name: 'John',
    fullName: 'John Adebayo',
    age: 67,
    riskLevel: 'elevated' as RiskLevel,
    riskReason: 'Blood pressure trending above your personal baseline over the past 3 days.',
    bpAvg: '138/88',
    bpTrend: 'up',
    medicationAdherence: 82,
    recentSymptoms: ['Mild dizziness'],
    lastLog: 'Yesterday at 9:12 AM',
    nextAppointment: 'Feb 28, 2026 · Dr. Okafor',
    streakDays: 5,
}

export const MOCK_BP_HISTORY = [
    { day: 'Mon', sys: 132, dia: 84 },
    { day: 'Tue', sys: 135, dia: 86 },
    { day: 'Wed', sys: 130, dia: 82 },
    { day: 'Thu', sys: 140, dia: 90 },
    { day: 'Fri', sys: 138, dia: 88 },
    { day: 'Sat', sys: 142, dia: 91 },
    { day: 'Sun', sys: 138, dia: 88 },
]

export const MOCK_NOTIFICATIONS = [
    { id: 1, time: '2h ago',     msg: 'Caregiver Sarah notified about elevated risk.',  type: 'warning' },
    { id: 2, time: 'Yesterday',  msg: 'Your weekly health report has been generated.',  type: 'info'    },
    { id: 3, time: '2 days ago', msg: 'Medication reminder: Aspirin 75mg at 8:00 AM.',  type: 'info'    },
    { id: 4, time: '3 days ago', msg: 'Blood pressure log submitted successfully.',     type: 'success' },
    { id: 5, time: '4 days ago', msg: 'New message from Dr. Okafor via clinic portal.', type: 'info'    },
]

export const SYMPTOMS = [
    'Dizziness', 'Numbness', 'Weakness',
    'Speech difficulty', 'Blurred vision', 'Severe headache',
]

export const QUICK_PROMPTS = [
    'Why is my risk elevated?',
    'What should I eat today?',
    'Remind me about medication',
]

export const MOCK_CHAT_RESPONSES: Record<string, string> = {
    'why is my risk elevated?':
        'Your risk is currently elevated because your blood pressure has been above your personal baseline (138/88 mmHg average) for the past 3 days. I recommend staying hydrated, reducing salt intake, and resting well tonight.',
    'what should i eat today?':
        'For stroke prevention, try a DASH diet today:\n🌾 Breakfast: oatmeal with berries\n🥗 Lunch: leafy green salad with grilled fish\n🍚 Dinner: steamed vegetables with brown rice\n\nAvoid processed foods and limit sodium.',
    'remind me about medication':
        'You have two medications scheduled today:\n💊 Aspirin 75mg — take with breakfast\n💊 Amlodipine 5mg — take at 8:00 PM\n\nWould you like me to set a reminder?',
}

export const RISK_CONFIG: Record<RiskLevel, {
    label: string; bg: string; border: string; text: string
    dot: string; gradFrom: string; barColor: string
    icon: typeof ShieldCheck; description: string
}> = {
    stable: {
        label: 'Stable', bg: 'bg-teal-50', border: 'border-teal-200',
        text: 'text-teal-700', dot: 'bg-teal-500', gradFrom: 'from-teal-400',
        barColor: 'bg-teal-500', icon: ShieldCheck,
        description: 'Your health indicators are within normal range. Keep up the great work!',
    },
    elevated: {
        label: 'Elevated', bg: 'bg-amber-50', border: 'border-amber-200',
        text: 'text-amber-700', dot: 'bg-amber-500', gradFrom: 'from-amber-400',
        barColor: 'bg-amber-500', icon: AlertTriangle,
        description: 'Some indicators need attention. Follow your care plan and stay in touch with your team.',
    },
    high: {
        label: 'High Risk', bg: 'bg-rose-50', border: 'border-rose-200',
        text: 'text-rose-700', dot: 'bg-rose-500', gradFrom: 'from-rose-400',
        barColor: 'bg-rose-500', icon: AlertTriangle,
        description: 'Immediate attention needed. Please contact your care team or use the SOS button below.',
    },
}

export const NAV_ITEMS = [
    { label: 'Dashboard',     icon: 'LayoutDashboard', id: 'dashboard',     path: '/patient/dashboard'     },
    { label: 'Daily Log',     icon: 'ClipboardList',   id: 'log',           path: '/patient/log'           },
    { label: 'Chat',          icon: 'MessageCircle',   id: 'chat',          path: '/patient/chat'          },
    { label: 'Reports',       icon: 'FileText',        id: 'reports',       path: '/patient/reports'       },
    { label: 'Notifications', icon: 'Bell',            id: 'notifications', path: '/patient/notifications' },
    { label: 'Settings',      icon: 'Settings',        id: 'settings',      path: '/patient/settings'      },
]

export const NOTIFICATION_STYLES = {
    warning: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    info:    { color: 'text-blue-500',  bg: 'bg-blue-50',  border: 'border-blue-100'  },
    success: { color: 'text-teal-500',  bg: 'bg-teal-50',  border: 'border-teal-100'  },
}