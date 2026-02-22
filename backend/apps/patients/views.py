from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import PatientRegistrationSerializer, PatientProfileSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
class RegisterPatientAPIView(APIView):

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

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
class LoginAPIView(APIView):

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

@api_view(['POST'])
@permission_classes([permissions.ISAuthenticated])
class PatientDashboardAPIView(APIView):

    def get(self, request):
        # Fetch the patient profile linked to the logged-in user
        patient_profile = request.user.patient_profile
        serializer = PatientProfileSerializer(patient_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterPatientAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser] # Ensure only admins register patients

    def post(self, request):
        serializer = PatientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # The 'user' has a 'patient_profile' attribute due to the related_name in your model
            patient_id = user.patient_profile.id 
            return Response({
                "message": "Patient registered successfully",
                "patient_id": patient_id, # Now you have the ID for Postman!
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PatientLookupView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        query = request.query_params.get('search', '')
        # Search by name, email, or phone
        patients = Patient.objects.filter(
            models.Q(user__first_name__icontains=query) | 
            models.Q(user__email__icontains=query) |
            models.Q(phone_number__icontains=query)
        )
        serializer = PatientProfileSerializer(patients, many=True)
        
        # Note: You'll need to add 'id' to the 'fields' list in PatientProfileSerializer
        return Response(serializer.data)
