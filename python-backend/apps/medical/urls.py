from django.urls import path
from .views import PredictHealthOutcomeView, PatientVitalHistoryView, AdminPatientDetailView

urlpatterns = [
    path('api/medical/submit-vitals/', PredictHealthOutcomeView.as_view(), name='submit_vitals'),
    path('api/medical/history/', PatientVitalHistoryView.as_view(), name='vital_history'),
    
    path('api/admin/patients/<int:patient_id>/', AdminPatientDetailView.as_view(), name='admin_patient_detail'),
]