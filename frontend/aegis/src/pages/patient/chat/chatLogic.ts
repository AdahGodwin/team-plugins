export interface DashboardContext {
    riskLevel:           'STABLE' | 'ELEVATED' | 'HIGH'
    riskScore:           number
    drivers:             string[]
    latestLog: {
        systolic:    number
        diastolic:   number
        heartRate:   number
        symptoms:    string[]
    }
    medAdherencePercent: number
    bpAverage7Days:      string
    streakDays:          number
    patientName:         string
    lastAppointment?:    string
    nextAppointment?:    string
    weight?:             number
    age?:                number
    smokingStatus?:      'never' | 'former' | 'current'
    diabetic?:           boolean
}

export const MOCK_CONTEXT: DashboardContext = {
    riskLevel:           'ELEVATED',
    riskScore:           62,
    drivers:             ['BP trending above baseline', 'Low hydration', 'Missed meds x2'],
    latestLog: {
        systolic:    148,
        diastolic:   92,
        heartRate:   88,
        symptoms:    ['mild headache'],
    },
    medAdherencePercent: 68,
    bpAverage7Days:      '145/90',
    streakDays:          5,
    patientName:         'Margaret',
    lastAppointment:     'Feb 10, 2026',
    nextAppointment:     'Mar 5, 2026',
    weight:              74,
    age:                 62,
    smokingStatus:       'former',
    diabetic:            false,
}

// ── Emergency keywords ────────────────────────────────────────────
export const EMERGENCY_KEYWORDS = [
    'weakness', 'numbness', 'slurred', 'slur', 'speech',
    'face droop', 'drooping', 'confusion', 'confused',
    'severe headache', 'worst headache', 'sudden headache',
    'faint', 'fainting', 'collapse', 'collapsed', 'falling',
    "can't breathe", 'cannot breathe', 'trouble breathing',
    'chest pain', 'chest tightness', 'chest pressure',
    'dizzy', 'dizziness', 'spinning',
    'vision loss', 'blurry vision', 'double vision', 'blind',
    'numb', 'unconscious', 'unresponsive', 'stroke',
    'heart attack', 'paralysis', 'arm weak', 'leg weak',
    'sudden', 'emergency', 'help me', 'sos',
]

export const isEmergency = (msg: string): boolean => {
    const lower = msg.toLowerCase()
    return EMERGENCY_KEYWORDS.some(k => lower.includes(k))
}

// ── Intent types ──────────────────────────────────────────────────
type Intent =
    | 'emergency'
    | 'risk'
    | 'diet'
    | 'medication'
    | 'bloodpressure'
    | 'heartrate'
    | 'report'
    | 'notifications'
    | 'streak'
    | 'appointment'
    | 'exercise'
    | 'sleep'
    | 'stress'
    | 'smoking'
    | 'weight'
    | 'symptoms'
    | 'hydration'
    | 'greeting'
    | 'thankyou'
    | 'howworks'
    | 'caregiver'
    | 'unknown'

// ── Intent detection ──────────────────────────────────────────────
export const detectIntent = (msg: string): Intent => {
    const m = msg.toLowerCase()

    if (isEmergency(msg))                                                                    return 'emergency'
    if (/\b(risk|score|elevated|high|danger|level|why am i|what is my risk)\b/.test(m))     return 'risk'
    if (/\b(food|eat|diet|salt|sodium|nutrition|meal|snack|fruit|vegetable)\b/.test(m))     return 'diet'
    if (/\b(drink|water|hydrat|fluid|thirsty)\b/.test(m))                                   return 'hydration'
    if (/\b(med|medication|pill|tablet|drug|dose|adherence|alarm|prescription)\b/.test(m))  return 'medication'
    if (/\b(bp|blood pressure|systolic|diastolic|pressure|reading|mmhg)\b/.test(m))         return 'bloodpressure'
    if (/\b(heart rate|pulse|bpm|heartbeat|heart beat)\b/.test(m))                          return 'heartrate'
    if (/\b(report|download|pdf|summary|export|history)\b/.test(m))                         return 'report'
    if (/\b(notification|alert|reminder|bell|update)\b/.test(m))                            return 'notifications'
    if (/\b(streak|log|days|logging|habit|consistent)\b/.test(m))                           return 'streak'
    if (/\b(appointment|doctor|clinic|visit|schedule|booking|next visit)\b/.test(m))        return 'appointment'
    if (/\b(exercise|walk|workout|physical|activity|gym|run|steps)\b/.test(m))              return 'exercise'
    if (/\b(sleep|rest|insomnia|tired|fatigue|nap|bedtime)\b/.test(m))                      return 'sleep'
    if (/\b(stress|anxiety|worry|nervous|calm|relax|mental|mood)\b/.test(m))                return 'stress'
    if (/\b(smok|cigarette|tobacco|nicotine|quit smoking)\b/.test(m))                       return 'smoking'
    if (/\b(weight|bmi|obese|overweight|kg|pound|scale)\b/.test(m))                         return 'weight'
    if (/\b(symptom|feel|feeling|headache|nausea|pain|side effect)\b/.test(m))              return 'symptoms'
    if (/\b(how does|how do|what is aegis|how does this work|what can you do)\b/.test(m))   return 'howworks'
    if (/\b(caregiver|family|kin|relative|share|notify|contact)\b/.test(m))                 return 'caregiver'
    if (/\b(hi|hello|hey|good|morning|afternoon|evening|how are you|greet)\b/.test(m))      return 'greeting'
    if (/\b(thank|thanks|thank you|appreciate|helpful|great)\b/.test(m))                    return 'thankyou'

    return 'unknown'
}

// ── Markdown-style bold helper rendered by ChatWindow ─────────────
// ChatWindow should replace **text** with <strong>text</strong>
// If yours doesn't yet, add this parser to your bubble renderer:
//
// text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

// ── Response generator ────────────────────────────────────────────
export const generateResponse = (msg: string, ctx: DashboardContext): string => {
    const intent = detectIntent(msg)
    const name   = ctx.patientName

    switch (intent) {

        // ── Emergency ─────────────────────────────────────────────
        case 'emergency':
            return `🚨 This may be serious, ${name}. Please press the **SOS** button or call emergency services immediately.\n\nDo NOT wait or drive yourself. Ask someone nearby for help right now.\n\nI am not able to diagnose — please seek urgent medical attention now.`

        // ── Greeting ──────────────────────────────────────────────
        case 'greeting':
            return `Hello ${name}! 👋 I'm Aegis AI, your stroke-prevention assistant.\n\nHere's a quick summary of your health today:\n• Risk Level: **${ctx.riskLevel}** (${ctx.riskScore}/100)\n• Latest BP: **${ctx.latestLog.systolic}/${ctx.latestLog.diastolic} mmHg**\n• Streak: **${ctx.streakDays} days** 🔥\n\nWhat would you like to know more about?`

        // ── Thank you ─────────────────────────────────────────────
        case 'thankyou':
            return `You're very welcome, ${name}! 😊 That's what I'm here for.\n\nRemember — small consistent steps lead to big improvements in your health. Keep up the great work! 💙\n\nIs there anything else I can help you with?`

        // ── How does Aegis work ───────────────────────────────────
        case 'howworks':
            return `Great question, ${name}! Here's what Aegis AI can do:\n\n• 📊 Explain your **risk score & drivers**\n• 🩺 Analyse your **blood pressure trends**\n• 💊 Track your **medication adherence**\n• 🥗 Give **diet & hydration** guidance\n• 🏃 Suggest **exercise & lifestyle** tips\n• 📅 Remind you about **appointments**\n• 🚨 Detect **emergency symptoms** and alert you\n\nI use your real dashboard data to give personalised answers — not generic advice. Try asking me anything!`

        // ── Risk ──────────────────────────────────────────────────
        case 'risk': {
            const riskColor = ctx.riskLevel === 'HIGH' ? '🔴' : ctx.riskLevel === 'ELEVATED' ? '🟡' : '🟢'
            return `${riskColor} Your current risk level is **${ctx.riskLevel}** with a score of **${ctx.riskScore}/100**.\n\n${ctx.riskScore > 70 ? '⚠️ Your score is in the high range — please contact your care team.\n\n' : ''}The main drivers are:\n${ctx.drivers.map(d => `• ${d}`).join('\n')}\n\nTo improve your score:\n• Log your vitals every day\n• Stay hydrated (8+ glasses of water)\n• Take all medications on schedule\n• Attend your next appointment (${ctx.nextAppointment ?? 'check your calendar'})\n\nEven small improvements reduce your stroke risk significantly. 💙`
        }

        // ── Blood pressure ────────────────────────────────────────
        case 'bloodpressure': {
            const sys   = ctx.latestLog.systolic
            const dia   = ctx.latestLog.diastolic
            const stage = sys >= 160 ? 'Stage 2 High (Hypertension)' : sys >= 140 ? 'Stage 1 High' : sys >= 120 ? 'Elevated' : 'Normal'
            return `🩺 Your latest reading is **${sys}/${dia} mmHg**.\n\nClassification: **${stage}**\n7-day average: **${ctx.bpAverage7Days}**\n\nWhat your numbers mean:\n• Below 120/80 — Normal ✅\n• 120–139/80–89 — Elevated ⚠️\n• 140+/90+ — High 🔴\n\n${sys >= 140 ? `Your readings are consistently high. Please:\n• Avoid salty foods today\n• Rest and reduce stress\n• Contact your clinic if it stays above 160/100\n\n` : 'Your BP is being managed well — keep logging! '}Keep logging daily so your care team can track trends. 📊`
        }

        // ── Heart rate ────────────────────────────────────────────
        case 'heartrate': {
            const hr     = ctx.latestLog.heartRate
            const status = hr > 100 ? 'above normal (tachycardia)' : hr < 60 ? 'below normal (bradycardia)' : 'within normal range'
            return `❤️ Your latest heart rate is **${hr} bpm**, which is **${status}**.\n\nNormal resting heart rate is **60–100 bpm**.\n\n${hr > 100 ? '⚠️ A consistently high heart rate can strain your heart. Try:\n• Deep breathing exercises\n• Reducing caffeine intake\n• Resting and avoiding stress\n\n' : hr < 60 ? '⚠️ A low heart rate can cause dizziness. Let your doctor know if you feel faint.\n\n' : '✅ Your heart rate looks good!\n\n'}Log your vitals daily to track any changes over time.`
        }

        // ── Diet ──────────────────────────────────────────────────
        case 'diet':
            return `🥗 Based on your BP average of **${ctx.bpAverage7Days}**, here's a personalised DASH diet plan:\n\n**Eat more:**\n• 🥦 Leafy greens, broccoli, spinach\n• 🍌 Potassium-rich foods (bananas, sweet potato)\n• 🐟 Fatty fish (salmon, mackerel) 2x/week\n• 🫘 Legumes — beans, lentils, chickpeas\n• 🌾 Whole grains — oats, brown rice\n\n**Avoid:**\n• 🧂 More than 1 teaspoon of salt per day\n• 🥩 Red meat & processed meats\n• 🍟 Fried & fast food\n• 🥤 Sugary drinks & alcohol\n${ctx.diabetic ? '\n• 🍬 Sugary foods (especially important given your diabetes)\n' : ''}\nSmall consistent changes make a significant difference. 💪`

        // ── Hydration ─────────────────────────────────────────────
        case 'hydration':
            return `💧 Hydration is a key driver in your current risk score!\n\n**How much water per day:**\n• General: **8 glasses (2 litres)**\n• If BP is elevated: aim for **2.5 litres**\n• More on hot days or after exercise\n\n**Tips to stay hydrated:**\n• Keep a water bottle with you at all times\n• Set phone reminders every 2 hours\n• Have a glass of water before every meal\n• Herbal teas (no caffeine) also count\n\n**Signs you're not drinking enough:**\n• Dark yellow urine\n• Dry mouth or lips\n• Fatigue or headaches\n\nGood hydration helps lower BP naturally. 🌿`

        // ── Medication ────────────────────────────────────────────
        case 'medication':
            return `💊 Your medication adherence is **${ctx.medAdherencePercent}%**${ctx.medAdherencePercent < 80 ? ' — below the recommended 80% threshold.' : ' — great consistency!'}\n\n${ctx.medAdherencePercent < 80 ? `⚠️ Missing doses is directly contributing to your **${ctx.riskLevel}** risk level.\n\n` : '✅ Keep it up — consistent medication is your strongest tool against stroke.\n\n'}**Tips to never miss a dose:**\n• ⏰ Set 2 daily alarms (morning & evening)\n• 💊 Use a weekly pill organiser\n• 📋 Tick off each dose in the Aegis app\n• 🛏️ Keep meds next to something you use daily\n\n⚠️ Never skip, double-dose, or stop medication without consulting your doctor first.`

        // ── Exercise ──────────────────────────────────────────────
        case 'exercise':
            return `🏃 Regular physical activity is one of the most effective ways to reduce stroke risk!\n\n**What's recommended:**\n• 🚶 30 minutes of moderate activity, 5 days/week\n• 🧘 Yoga or stretching 2–3x/week for stress\n• 🏊 Swimming is great for high BP patients\n\n**Starting gently (for your age & risk level):**\n• Begin with 10-minute walks after meals\n• Use stairs instead of lifts\n• Chair exercises if mobility is limited\n\n**Avoid:**\n• High-intensity workouts if BP > 160\n• Exercising immediately after medication\n\nAlways check with your doctor before starting a new exercise routine. 💙`

        // ── Sleep ─────────────────────────────────────────────────
        case 'sleep':
            return `😴 Sleep quality directly affects blood pressure and stroke risk.\n\n**Why sleep matters:**\n• Poor sleep raises cortisol → raises BP\n• Less than 6 hours increases stroke risk by 4x\n• Sleep apnoea is a major hidden risk factor\n\n**Tips for better sleep:**\n• 🕙 Sleep & wake at the same time every day\n• 📵 No screens 1 hour before bed\n• 🌡️ Keep your room cool and dark\n• ☕ Avoid caffeine after 2pm\n• 🫁 Try slow breathing exercises before bed\n\n**Target:** 7–9 hours per night.\n\nIf you snore loudly or wake up gasping, mention it to your doctor — it may be sleep apnoea.`

        // ── Stress ────────────────────────────────────────────────
        case 'stress':
            return `🧘 Stress is a significant but often overlooked stroke risk factor.\n\n**How stress affects you:**\n• Raises blood pressure temporarily\n• Triggers unhealthy eating & skipped meds\n• Disrupts sleep quality\n\n**Proven stress-reduction techniques:**\n• 🫁 Box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s\n• 🚶 A 10-minute walk outdoors\n• 🎵 Listening to calming music\n• 📖 Journaling or prayer\n• 📞 Talking to a friend or family member\n\n**Aegis tip:** Your current risk drivers include ${ctx.drivers[0]} — managing stress may help bring your score down.\n\nIf you feel persistently overwhelmed, please speak to your doctor or a counsellor.`

        // ── Smoking ───────────────────────────────────────────────
        case 'smoking': {
            const smokeMsg = ctx.smokingStatus === 'current'
                ? `⚠️ You are currently recorded as a smoker. Smoking **doubles** your stroke risk. Quitting — even today — begins to reduce that risk within 24 hours.\n\nPlease speak to your doctor about nicotine replacement therapy or cessation support.`
                : ctx.smokingStatus === 'former'
                ? `✅ Well done for quitting smoking, ${name}! Your risk is already significantly lower than current smokers.\n\nYour body continues to recover — after 5 years smoke-free, stroke risk drops to near-normal levels.`
                : `✅ Great news — you have no recorded smoking history, ${name}. Keep it that way!\n\nSecond-hand smoke also carries risk, so try to avoid smoky environments.`
            return `🚭 Smoking & Stroke Risk\n\n${smokeMsg}\n\nIf you ever feel the urge to smoke, try:\n• Chewing sugar-free gum\n• Calling your next-of-kin for support\n• A short walk to distract yourself`
        }

        // ── Weight ────────────────────────────────────────────────
        case 'weight': {
            const bmiNote = ctx.weight && ctx.age
                ? `Your recorded weight is **${ctx.weight}kg**. `
                : ''
            return `⚖️ ${bmiNote}Maintaining a healthy weight significantly reduces stroke risk.\n\n**Why it matters:**\n• Every 5kg overweight raises systolic BP by ~2–3 mmHg\n• Obesity increases stroke risk by up to 64%\n\n**Healthy weight management tips:**\n• 🥗 Follow the DASH diet (ask me about diet)\n• 🚶 30 mins walking per day burns ~150 calories\n• ⏱️ Avoid eating after 8pm\n• 🍽️ Use smaller plates to reduce portion size\n• 💧 Drink water before meals to reduce appetite\n\nAlways aim for **gradual** weight loss (0.5–1kg per week) — rapid loss can be harmful. Consult your doctor before starting any weight-loss plan.`
        }

        // ── Symptoms ──────────────────────────────────────────────
        case 'symptoms': {
            const logged = ctx.latestLog.symptoms
            return `🩺 Your most recently logged symptoms: **${logged.length > 0 ? logged.join(', ') : 'None logged today'}**.\n\n${logged.includes('mild headache') ? `⚠️ A mild headache can sometimes be linked to elevated BP (yours is ${ctx.latestLog.systolic}/${ctx.latestLog.diastolic}). Rest, hydrate, and check your BP again in 30 minutes.\n\n` : ''}\n**When to seek urgent care:**\nIf you experience sudden severe headache, vision changes, face drooping, arm weakness, or speech difficulties — press **SOS immediately**.\n\nFor non-urgent symptoms, log them in the app and mention them at your next appointment (${ctx.nextAppointment ?? 'check your calendar'}).`
        }

        // ── Appointment ───────────────────────────────────────────
        case 'appointment':
            return `📅 Appointment Information\n\n• **Last visit:** ${ctx.lastAppointment ?? 'Not recorded'}\n• **Next visit:** ${ctx.nextAppointment ?? 'Not scheduled yet'}\n\n**Before your appointment, prepare:**\n• ✅ Print or save your Aegis health report (Reports tab)\n• 📋 List any new symptoms since your last visit\n• 💊 Bring your medication list\n• ❓ Write down questions you want to ask\n\n**Never skip appointments** — your doctor uses your visit data alongside your Aegis readings to adjust your care plan.\n\nNeed to reschedule? Contact your clinic directly.`

        // ── Caregiver / Next of kin ───────────────────────────────
        case 'caregiver':
            return `👨‍👩‍👧 Caregiver & Family Sharing\n\nAegis allows you to share your health updates with your next of kin or caregiver.\n\n**What they can see (with your permission):**\n• Your risk level & score\n• Medication adherence\n• BP trends\n• Emergency SOS alerts\n\n**How to set it up:**\n• Go to **Settings** → **Caregiver Access**\n• Enter their name, phone & email\n• They'll receive a link to view your dashboard\n\nSharing your data with a trusted person means someone always knows if your health needs attention — especially useful if you live alone.\n\nYour privacy is protected — you control what they see.`

        // ── Report ────────────────────────────────────────────────
        case 'report':
            return `📄 Your Health Report\n\nYour latest monthly report is available on the **Reports** page.\n\n**Your report includes:**\n• BP trend chart (30 days)\n• Medication adherence summary\n• Risk score history\n• Symptom log\n• Recommendations from your care plan\n\n**How to access it:**\n• Click **Reports** in the sidebar\n• Tap **Download PDF** to save or print\n• Use **Share** to send directly to your doctor\n\n💡 Tip: Bring your latest report to every clinic appointment — it saves time and gives your doctor instant context.`

        // ── Notifications ─────────────────────────────────────────
        case 'notifications':
            return `🔔 Notifications & Alerts\n\nAll your updates are in the **Notifications** tab.\n\n**Types of alerts you receive:**\n• 💊 Medication reminders\n• 🩺 High BP warnings\n• 📅 Appointment reminders\n• 📊 Weekly health summaries\n• 🏆 Streak & milestone celebrations\n\n**How to manage them:**\n• Tap the 🔔 icon at the top of any page\n• Mark as read or dismiss\n• Go to **Settings → Notifications** to customise frequency\n\n💡 Tip: Turn on phone notifications so you never miss a medication reminder.`

        // ── Streak ────────────────────────────────────────────────
        case 'streak':
            return `🔥 Logging Streak: **${ctx.streakDays} days!**\n\n${ctx.streakDays >= 14 ? '🏆 Amazing — 2 weeks straight! You are in the top tier of consistent Aegis users!' : ctx.streakDays >= 7 ? '⭐ One full week! You\'re building a life-saving habit.' : '💪 Great start! Keep going — consistency is what saves lives.'}\n\n**Why daily logging matters:**\n• Catches dangerous BP spikes early\n• Helps your doctor spot trends\n• Reduces your overall risk score\n• Earns you streak badges 🏅\n\n**Next milestone:** ${ctx.streakDays >= 14 ? '30 days 🚀' : ctx.streakDays >= 7 ? '14 days ⭐' : '7 days 🎯'}\n\nLogging takes less than 2 minutes — never skip a day, ${name}!`

        // ── Unknown ───────────────────────────────────────────────
        default:
            return `I'm not sure I understood that, ${name}. Here's everything I can help you with:\n\n**Health Data:**\n• 📊 Risk level & drivers\n• 🩺 Blood pressure & heart rate\n• 💊 Medication adherence\n• 📋 Current symptoms\n\n**Lifestyle Guidance:**\n• 🥗 Diet & nutrition\n• 💧 Hydration\n• 🏃 Exercise\n• 😴 Sleep\n• 🧘 Stress management\n• ⚖️ Weight\n\n**App Features:**\n• 📄 Health reports\n• 🔔 Notifications\n• 📅 Appointments\n• 👨‍👩‍👧 Caregiver sharing\n• 🔥 Logging streak\n\nTry asking something like: **"Why is my risk elevated?"** or **"What should I eat today?"**`
    }
}