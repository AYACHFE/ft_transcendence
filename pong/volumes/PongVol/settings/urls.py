from django.urls import path
from .views import SettingsViewSet, ChangepassViewSet

urlpatterns = [
    path('', SettingsViewSet.as_view({'post': 'create'}), name='settings-app'),
    path('changepass', ChangepassViewSet.as_view({'post': 'create'}), name='settings-app'),
]