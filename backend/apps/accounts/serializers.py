from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role', 'phone_number', 'caregiver_email')

    def validate(self, attrs):
        # Logic: If user is registering as an ELDERLY, a caregiver email is recommended
        if attrs.get('role') == User.Role.ELDERLY and not attrs.get('caregiver_email'):
            raise serializers.ValidationError(
            "Caregiver email is required for elderly users."
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],

            password=validated_data['password'],

            role=validated_data.get('role', User.Role.ELDERLY),
            phone_number=validated_data.get('phone_number', ''),
            caregiver_email=validated_data.get('caregiver_email')
        )
        return user