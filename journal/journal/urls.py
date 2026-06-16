from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),


    # 🔐 JWT AUTH

    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 🌍 TRAVEL APP APIs
    path('api/', include('travel.urls')),

    # 👤 REGISTER (credentials app)
    path('credentials/', include('credentials.urls')),
]

