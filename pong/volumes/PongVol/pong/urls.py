
from django.contrib import admin
from django.urls import path, include
from googleauth.views import google_auth, google_dauth
from users.views import send_mail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('chat/', include('chat.urls')),
    path('settings/', include('settings.urls')),
    path('', include('main.urls')),
    path('accounts/google/login/callback/', google_dauth),
    path('accounts/', include('allauth.urls')),
    path('google/', include('googleauth.urls')),
    # path('settings/', send_mail),
]
