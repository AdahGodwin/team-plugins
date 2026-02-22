from django.urls import path
from .views import RegisterPatientAPIView, LoginAPIView, PatientDashboardAPIView

urlpatterns = [
    path('api/register/', RegisterPatientAPIView.as_view(), name='api_register'),
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/dashboard/', PatientDashboardAPIView.as_view(), name='api_dashboard'),
]