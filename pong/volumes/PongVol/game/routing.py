from .consumers import PingPongConsumer
from django.urls import path

websocket_urlpatterns = [
    path('ws/pingpong/<str:room_name>/', PingPongConsumer.as_asgi()),
]