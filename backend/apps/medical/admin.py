from django.contrib import admin
from .models import MedicalRecord, VitalSignLog

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'hypertension', 'heart_disease', 'bmi')
    search_fields = ('patient__user__username',)

@admin.register(VitalSignLog)
class VitalSignLogAdmin(admin.ModelAdmin):
    list_display = ('patient', 'timestamp', 'systolic_bp', 'diastolic_bp', 'heart_rate')
    search_fields = ('patient__user__username',)