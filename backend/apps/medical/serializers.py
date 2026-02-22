from rest_framework import serializers
from .models import VitalSignLog

class VitalSignLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSignLog
        fields = [
            'systolic_bp', 'diastolic_bp', 'heart_rate', 
            'daily_steps', 'sleep_hours', 'medications', 'signs_and_symptoms'
        ]

class VitalHistorySerializer(serializers.ModelSerializer):
    """ Used to display a patient's historical logs """
    class Meta:
        model = VitalSignLog
        # For history, we usually want to see the timestamp and ID too
        fields = [
            'id', 'timestamp', 'systolic_bp', 'diastolic_bp', 'heart_rate', 
            'daily_steps', 'sleep_hours', 'medications', 'signs_and_symptoms'
        ]