import os
import json
import google.generativeai as genai
from datetime import date
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import MedicalRecord
from .serializers import VitalSignLogSerializer, VitalHistorySerializer, VitalSignLog
from apps.patients.models import Patient
from apps.patients.serializers import PatientProfileSerializer

# Configure your API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY"))

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

        # 4. Initialize Gemini Model
        model = genai.GenerativeModel('gemini-1.5-flash')

        # 5. Construct a prompt explicitly asking for stroke prevention steps
        prompt = f"""
        Act as a medical data analyst. Assess the potential risk for a stroke based on the patient data below.
        
        Patient Baseline Data:
        - Age: {age}
        - Gender: {patient_profile.gender}
        - Hypertension: {medical_record.hypertension}
        - Heart Disease: {medical_record.heart_disease}
        - Smoking Status (Smokes): {medical_record.smoking_status_smokes}        - Average Glucose Level: {medical_record.avg_glucose_level} mg/dL
        - BMI: {medical_record.bmi}

        Newly Submitted Vitals:
        - Systolic BP: {vital_log.systolic_bp}
        - Diastolic BP: {vital_log.diastolic_bp}
        - Heart Rate: {vital_log.heart_rate}
        - Daily Steps: {vital_log.daily_steps}
        - Sleep Hours: {vital_log.sleep_hours}

        You MUST respond ONLY with a valid JSON object using the following exact structure. 
        Focus the recommendations heavily on personalized stroke prevention based on the patient's specific risk factors:
        {{
            "risk_score": "Low", // strictly one of: "Low", "Moderate", "High"
            "justification": "A 1-2 sentence explanation of the score based on the vitals.",
            "stroke_prevention_steps": [
                "Specific, actionable lifestyle or medical step 1 to prevent stroke", 
                "Specific, actionable step 2"
            ]
        }}
        """

        # 6. Generate structured JSON response from Gemini
        try:
            gemini_response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(response_mime_type="application/json")
            )
            
            # Parse the AI's JSON string into a Python dictionary
            ai_analysis = json.loads(gemini_response.text)
            
        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to parse AI analysis. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": "AI analysis service is currently unavailable.", "details": str(e)}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # 7. Build a smart status report based on the risk score
        risk_score = ai_analysis.get("risk_score", "Unknown")
        
        status_report = {
            "message": "Vitals successfully submitted and analyzed.",
            "risk_level": risk_score,
            "requires_doctor_visit": risk_score in ["Moderate", "High"],
            "is_urgent": risk_score == "High",
            "analysis_details": {
                "justification": ai_analysis.get("justification"),
                "stroke_prevention_steps": ai_analysis.get("stroke_prevention_steps", [])
            }
        }
        vital_log.ai_analysis_report = ai_analysis  # Save the dictionary to the vital log
        vital_log.save() # Save the vital_log instance after updating ai_analysis_report
        return Response(status_report, status=status.HTTP_201_CREATED)


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
    permission_classes = [IsAdminUser] # Strictly enforces is_staff=True

    def get(self, request, patient_id):
        # Log the access (Optional: for hospital auditing)
        print(f"Hospital Admin {request.user.username} is accessing Patient {patient_id}")

        # 1. Find the specific patient
        patient = get_object_or_404(Patient, id=patient_id)
        
        # 2. Serialize their baseline profile
        profile_serializer = PatientProfileSerializer(patient)
        
        # 3. Fetch and serialize their vital sign history
        logs = VitalSignLog.objects.filter(patient=patient)
        history_serializer = VitalHistorySerializer(logs, many=True)
        
        # 4. Return the comprehensive package
        return Response({
            "accessed_by": request.user.get_full_name(),
            "patient_profile": profile_serializer.data,
            "vital_history": history_serializer.data
        }, status=status.HTTP_200_OK)