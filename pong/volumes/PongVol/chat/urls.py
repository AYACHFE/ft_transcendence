from django.urls import path
from .views import MessageViewSet, UserView

urlpatterns = [
    path('chat/', MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='caht-app'),
    path('users/', UserView.as_view({'get': 'list'}), name='user-app'),
]