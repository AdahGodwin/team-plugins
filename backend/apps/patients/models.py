from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    # Link to Django's built-in auth User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    
    # Basic Patient Details
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    
    # Required Caregiver Field
    caregiver_email = models.EmailField(help_text="Email of the primary caregiver")
    
    # Optional: basic medical record tracking
    blood_group = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True, help_text="List any known allergies")

    def __str__(self):
        return f"{self.user.get_full_name()} - Patient Profile"