from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import PatientRegistrationSerializer, PatientProfileSerializer

class RegisterPatientAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PatientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate an auth token for immediate login upon registration
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Patient registered successfully",
                "token": token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful",
                "token": token.key
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class PatientDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated] # Requires the token in the request header

    def get(self, request):
        # Fetch the patient profile linked to the logged-in user
        patient_profile = request.user.patient_profile
        serializer = PatientProfileSerializer(patient_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)