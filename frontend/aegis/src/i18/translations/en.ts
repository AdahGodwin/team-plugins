const en = {
    // Navigation
    dashboard:           'Dashboard',
    notifications:       'Notifications',
    reports:             'Reports',
    chat:                'Chat',
    settings:            'Settings',
    logout:              'Log out',
    language:            'Language',

    // Greetings
    greeting:            'Good morning',
    greetingAfternoon:   'Good afternoon',
    greetingEvening:     'Good evening',

    // Dashboard
    logDaily:            'Log your vitals today',
    streakMessage:       (days: number) => `You have logged your vitals ${days} days in a row. Keep it up!`,
    riskLow:             'Your health looks good. Keep up your healthy habits.',
    riskModerate:        'Your risk is moderate. Follow your care plan carefully.',
    riskHigh:            'Your risk is high. Please contact your care team immediately.',

    // Notifications
    bpHigh:              'Your blood pressure is high. Please rest and check again in 30 minutes.',
    bpNormal:            'Your blood pressure is back to normal. Well done!',
    takemedication:      'Time to take your medication.',
    missedMedication:    'You missed your medication today. Take it as soon as possible.',
    drinkWater:          'Drink at least 8 glasses of water today.',
    lowSodium:           'Avoid salty foods today. Try fruits, vegetables, or unseasoned meals.',
    exercise:            'A short 20-minute walk today will help your heart.',
    appointmentReminder: 'You have an appointment coming up. Please do not miss it.',
    reportReady:         'Your monthly health report is ready. View it on the Reports page.',

    // Forms
    email:               'Email Address',
    password:            'Password',
    forgotPassword:      'Forgot password?',
    login:               'Log In',
    register:            'Create Account',
    sending:             'Sending…',
    sendResetLink:       'Send Reset Link',
}

export default en