import { AlertTriangle, Pill, Activity, Calendar, Info } from 'lucide-react'
import type React from 'react'

export type NotifType = 'alert' | 'medication' | 'vitals' | 'appointment' | 'system'

export interface Notif {
    id:      number
    type:    NotifType
    title:   string
    body:    string
    time:    string
    read:    boolean
    pinned?: boolean
}

export type Filter = 'All' | 'Unread' | 'Alert' | 'Medication' | 'Vitals' | 'Appointment' | 'System'

export const FILTERS: Filter[] = ['All', 'Unread', 'Alert', 'Medication', 'Vitals', 'Appointment', 'System']

type IconComponent = React.ElementType<{ className?: string }>

export interface TypeConfig {
    icon:   IconComponent
    iconBg: string
    iconFg: string
    badge:  string
    label:  string
}

export const TYPE_CONFIG: Record<NotifType, TypeConfig> = {
    alert: {
        icon:   AlertTriangle,
        iconBg: 'bg-rose-100',
        iconFg: 'text-rose-500',
        badge:  'bg-rose-100 text-rose-600',
        label:  'Alert',
    },
    medication: {
        icon:   Pill,
        iconBg: 'bg-blue-100',
        iconFg: 'text-blue-500',
        badge:  'bg-blue-100 text-blue-600',
        label:  'Medication',
    },
    vitals: {
        icon:   Activity,
        iconBg: 'bg-teal-100',
        iconFg: 'text-teal-500',
        badge:  'bg-teal-100 text-teal-600',
        label:  'Vitals',
    },
    appointment: {
        icon:   Calendar,
        iconBg: 'bg-violet-100',
        iconFg: 'text-violet-500',
        badge:  'bg-violet-100 text-violet-600',
        label:  'Appointment',
    },
    system: {
        icon:   Info,
        iconBg: 'bg-slate-100',
        iconFg: 'text-slate-500',
        badge:  'bg-slate-100 text-slate-600',
        label:  'System',
    },
}

export const INITIAL_NOTIFICATIONS: Notif[] = [
    {
        id:     1,
        type:   'alert',
        title:  'High Blood Pressure Detected',
        body:   'Your reading of 148/92 mmHg is above your target range. Please rest and monitor again in 30 minutes.',
        time:   '10 mins ago',
        read:   false,
        pinned: true,
    },
    {
        id:    2,
        type:  'medication',
        title: 'Medication Reminder',
        body:  'Time to take your Amlodipine 5mg. Take with water after a meal.',
        time:  '1 hour ago',
        read:  false,
    },
    {
        id:    3,
        type:  'appointment',
        title: 'Upcoming Appointment',
        body:  'You have a follow-up with Dr Amara Osei on 5 March 2026 at 10:30 AM.',
        time:  '3 hours ago',
        read:  false,
    },
    {
        id:    4,
        type:  'vitals',
        title: 'Daily Log Reminder',
        body:  "You haven't logged your vitals today. Tap here to add today's blood pressure reading.",
        time:  'Yesterday',
        read:  true,
    },
    {
        id:    5,
        type:  'system',
        title: 'Monthly Report Ready',
        body:  'Your February 2026 health summary is now available. View and download it from the Reports page.',
        time:  'Yesterday',
        read:  true,
    },
    {
        id:    6,
        type:  'medication',
        title: 'Medication Streak',
        body:  "Great job! You've taken your Aspirin 75mg for 7 days in a row. Keep it up!",
        time:  '2 days ago',
        read:  true,
    },
    {
        id:    7,
        type:  'vitals',
        title: 'BP Back to Normal',
        body:  'Your latest reading of 128/82 mmHg is within your target range. Well done!',
        time:  '3 days ago',
        read:  true,
    },
    {
        id:    8,
        type:  'system',
        title: 'Care Team Update',
        body:  'Dr Amara Osei has reviewed your last 7-day report and left a note. Check your Reports page.',
        time:  '4 days ago',
        read:  true,
    },
]