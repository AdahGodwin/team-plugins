from django.db import models
from apps.patients.models import Patient # Adjust import path if your app is just 'patients'

class MedicalRecord(models.Model):
    # 1-to-1 link to the Patient profile
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='medical_record')
    
    # Hospital-populated baseline data
    hypertension = models.IntegerField(default=0, help_text="0 for No, 1 for Yes")
    heart_disease = models.IntegerField(default=0, help_text="0 for No, 1 for Yes")
    avg_glucose_level = models.FloatField(null=True, blank=True)
    bmi = models.FloatField(null=True, blank=True)
    
    # Categorical data mapped to 1/0 for the ML model
    ever_married_Yes = models.IntegerField(default=0, help_text="0 for No, 1 for Yes")
    work_type_Private = models.IntegerField(default=0, help_text="0 for No, 1 for Yes")
    Residence_type_Urban = models.IntegerField(default=0, help_text="0 for Rural, 1 for Urban")
    smoking_status_smokes = models.IntegerField(default=0, help_text="0 for No, 1 for Yes")

    def __str__(self):
        return f"Medical Record - {self.patient.user.username}"


class VitalSignLog(models.Model):
    # Foreign key allows multiple logs per patient
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vital_logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Patient-submitted metrics
    systolic_bp = models.IntegerField()
    diastolic_bp = models.IntegerField()
    heart_rate = models.IntegerField()
    daily_steps = models.IntegerField()
    sleep_hours = models.FloatField()
    
    # Optional text fields
    medications = models.TextField(blank=True, null=True, help_text="Medications currently taken")
    signs_and_symptoms = models.TextField(blank=True, null=True, help_text="Any notable symptoms")

    class Meta:
        ordering = ['-timestamp'] # Newest logs appear first

    def __str__(self):
        return f"Vitals for {self.patient.user.username} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"