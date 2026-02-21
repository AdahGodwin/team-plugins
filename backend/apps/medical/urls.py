from django.urls import path
from .views import PredictHealthOutcomeView

urlpatterns = [
    path('api/medical/submit-vitals/', PredictHealthOutcomeView.as_view(), name='submit_vitals'),
]