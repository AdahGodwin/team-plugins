import os
import fcntl
from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail # Added missing import
from .models import VitalSignLog
from apps.patients.models import Patient

def send_daily_reports_job():
    """Logic to find the latest AI report and email it to each patient daily at midnight."""
    yesterday = timezone.now() - timedelta(days=1)
    patients = Patient.objects.all()

    for patient in patients:
        # Get the latest log with an AI report from the last 24 hours
        latest_log = VitalSignLog.objects.filter(
            patient=patient,
            timestamp__gte=yesterday,
            ai_analysis_report__isnull=False
        ).order_by('-timestamp').first()

        if latest_log:
            report = latest_log.ai_analysis_report
            risk = report.get('risk_score', 'N/A')
            justification = report.get('justification', 'No details provided.')
            steps = report.get('stroke_prevention_steps', [])
            
            # Format the list with bullet points for professional look
            formatted_steps = "\n".join([f"• {s}" for s in steps])

            email_body = (
                f"Hello {patient.user.first_name},\n\n"
                f"Here is your daily stroke risk assessment summary:\n\n"
                f"RISK LEVEL: {risk}\n"
                f"REASONING: {justification}\n\n"
                f"RECOMMENDED STEPS:\n{formatted_steps}\n\n"
                f"Stay healthy,\n"
                f"The Medical Team"
            )

            send_mail(
                subject="Daily AI Health Report",
                message=email_body,
                from_email='noreply@yourhospital.com',
                recipient_list=[patient.user.email],
                fail_silently=True
            )

def start():
    """Starts the scheduler with a file lock to prevent duplicate tasks in multi-worker environments."""
    
    # Define a lock file path in the current working directory
    lock_file_path = os.path.join(os.getcwd(), "scheduler.lock")
    
    try:
        # Open the lock file
        f = open(lock_file_path, "wb")
        
        # Try to acquire an exclusive lock. LOCK_NB ensures we don't wait/block.
        fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        
        # This code only runs if the lock was successfully acquired
        scheduler = BackgroundScheduler()
        # Schedule the job to run every day at midnight
        scheduler.add_job(send_daily_reports_job, 'cron', hour=0, minute=0)
        scheduler.start()
        
        print("✅ Scheduler started successfully in this worker.")
        
    except (OSError, IOError):
        # This worker couldn't get the lock, meaning another worker is already handling the schedule

        print("⚠️ Scheduler already running in another worker. Skipping start.")