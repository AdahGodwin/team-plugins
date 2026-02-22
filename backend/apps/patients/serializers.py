from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Patient

class PatientRegistrationSerializer(serializers.ModelSerializer):
    caregiver_email = serializers.EmailField(write_only=True)
    caregiver_name = serializers.CharField(max_length=100, write_only=True, required=False)
    caregiver_phone = serializers.CharField(max_length=15, write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True)
    phone_number = serializers.CharField(max_length=15, write_only=True)
    address = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 
                  'caregiver_email', 'caregiver_name', 'caregiver_phone', 'date_of_birth', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract patient-specific data
        caregiver_email = validated_data.pop('caregiver_email', '')
        caregiver_name = validated_data.pop('caregiver_name', '')
        caregiver_phone = validated_data.pop('caregiver_phone', '')
        date_of_birth = validated_data.pop('date_of_birth', None)
        phone_number = validated_data.pop('phone_number', '')
        address = validated_data.pop('address', '')

        # Set last_login to satisfy database constraints
        validated_data['last_login'] = timezone.now()

        # Create the standard Django User securely
        user = User.objects.create_user(**validated_data)

        # Create the linked Patient profile
        Patient.objects.create(
            user=user,
            caregiver_email=caregiver_email,
            caregiver_name=caregiver_name,
            caregiver_phone=caregiver_phone,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            address=address
        )
        return user


class PatientProfileSerializer(serializers.ModelSerializer):
    # Flattening User fields to send back a clean JSON object
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Patient
        fields = ['first_name', 'last_name', 'email', 'caregiver_email', 'date_of_birth', 'phone_number', 'address', 'blood_group', 'allergies']