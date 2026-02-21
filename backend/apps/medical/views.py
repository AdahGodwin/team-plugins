import requests
from datetime import date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MedicalRecord
from .serializers import VitalSignLogSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from apps.patients.models import Patient
from apps.patients.serializers import PatientProfileSerializer

class PredictHealthOutcomeView(APIView):
    # Ensure only logged-in patients with a valid token can access this
    permission_classes = [IsAuthenticated]

    def post(self, request):
        patient_profile = request.user.patient_profile
        
        # 1. Validate and save the incoming vitals submitted by the patient
        serializer = VitalSignLogSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # Save the log and link it to the patient
        vital_log = serializer.save(patient=patient_profile)

        # 2. Fetch the Hospital Baseline Data
        try:
            medical_record = patient_profile.medical_record
        except MedicalRecord.DoesNotExist:
            return Response(
                {"error": "Hospital baseline data is missing. Please contact administration."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Calculate Exact Age dynamically
        dob = patient_profile.date_of_birth
        today = date.today()
        # Subtract 1 year if today's month/day is before the birth month/day
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        # 4. Construct the exact JSON Payload for the Flask ML Model
        ml_payload = {
            "age": age,
            "hypertension": medical_record.hypertension,
            "heart_disease": medical_record.heart_disease,
            "avg_glucose_level": medical_record.avg_glucose_level,
            "bmi": medical_record.bmi,
            "ever_married_Yes": medical_record.ever_married_Yes,
            "work_type_Private": medical_record.work_type_Private,
            "Residence_type_Urban": medical_record.Residence_type_Urban,
            "smoking_status_smokes": medical_record.smoking_status_smokes,
            "systolic_bp": vital_log.systolic_bp,
            "diastolic_bp": vital_log.diastolic_bp,
            "heart_rate": vital_log.heart_rate,
            "daily_steps": vital_log.daily_steps,
            "sleep_hours": vital_log.sleep_hours
        }

        # 5. Send the payload to the Flask Machine Learning API
        flask_url = "http://127.0.0.1:5000/predict"
        try:
            # timeout=5 prevents your Django app from hanging if the Flask server is down
            ml_response = requests.post(flask_url, json=ml_payload, timeout=5)
            ml_response.raise_for_status() # Catches 4xx or 5xx HTTP errors from Flask
            prediction_data = ml_response.json()
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Machine Learning service is currently unavailable.", "details": str(e)}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # 6. Return the combined result to the React frontend
        return Response({
            "message": "Vitals successfully submitted and analyzed.",
            "prediction": prediction_data,
            "payload_sent_to_ml": ml_payload  # Useful for debugging your Flask endpoint
        }, status=status.HTTP_201_CREATED)

class PatientVitalHistoryView(APIView):
    """ Allows a logged-in patient to see their own history """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient_profile = request.user.patient_profile
        logs = VitalSignLog.objects.filter(patient=patient_profile)
        serializer = VitalHistorySerializer(logs, many=True)
        
        return Response({
            "patient_name": f"{request.user.first_name} {request.user.last_name}",
            "history": serializer.data
        }, status=status.HTTP_200_OK)


class AdminPatientDetailView(APIView):
    """ Allows hospital staff to see any patient's full file """
    permission_classes = [IsAdminUser]

    def get(self, request, patient_id):
        # 1. Find the specific patient
        patient = get_object_or_404(Patient, id=patient_id)
        
        # 2. Serialize their baseline profile
        profile_serializer = PatientProfileSerializer(patient)
        
        # 3. Fetch and serialize their vital sign history
        logs = VitalSignLog.objects.filter(patient=patient)
        history_serializer = VitalHistorySerializer(logs, many=True)
        
        # 4. Return everything in one comprehensive package
        return Response({
            "patient_profile": profile_serializer.data,
            "vital_history": history_serializer.data
        }, status=status.HTTP_200_OK)