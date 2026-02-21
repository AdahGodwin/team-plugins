from rest_framework import serializers
from .models import VitalSignLog

class VitalSignLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSignLog
        fields = [
            'systolic_bp', 'diastolic_bp', 'heart_rate', 
            'daily_steps', 'sleep_hours', 'medications', 'signs_and_symptoms'
        ]