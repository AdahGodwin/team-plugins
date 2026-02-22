from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import User

class UserIDAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # We will look for a custom header called 'X-User-ID'
        user_id = request.META.get('HTTP_X_USER_ID')
        
        if not user_id:
            return None # Move on to the next authentication method, if any

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No user found with this ID.')

        # Return the user and None (no auth token)
        return (user, None)