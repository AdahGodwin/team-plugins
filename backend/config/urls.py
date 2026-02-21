from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Your app URLs
    path('', include('apps.patients.urls')),
    path('', include('apps.medical.urls')),
    
    # OpenAPI Schema generator
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI docs endpoint
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]