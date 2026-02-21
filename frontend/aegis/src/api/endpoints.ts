export const ENDPOINTS = {
    AUTH: {
        LOGIN:          '/api/login',
        REGISTER:       '/api/register',
        FORGOT:         '/auth/forgot-password',
        RESET:          '/auth/reset-password',
        REFRESH:        '/auth/refresh',
        LOGOUT:         '/auth/logout',
    },

    PATIENT: {
        PROFILE:        '/patient/profile',
        VITALS:         '/patient/vitals',
        VITALS_LOG:     '/patient/vitals/log',
        RISK:           '/patient/risk',
    },

    NOTIFICATIONS: {
        LIST:           '/notifications',
        MARK_READ:      (id: number) => `/notifications/${id}/read`,
        MARK_ALL_READ:  '/notifications/read-all',
        DISMISS:        (id: number) => `/notifications/${id}`,
    },

    REPORTS: {
        LIST:           '/reports',
        DETAIL:         (id: number) => `/reports/${id}`,
        DOWNLOAD:       (id: number) => `/reports/${id}/download`,
    },

    CHAT: {
        MESSAGES:       '/chat/messages',
        SEND:           '/chat/send',
    },
}