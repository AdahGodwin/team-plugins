from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'caregiver_email', 'phone_number')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'caregiver_email')