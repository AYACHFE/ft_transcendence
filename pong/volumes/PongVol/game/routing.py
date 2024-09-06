from .consumers import PingPongConsumer
from django.urls import re_path

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<room_name>\w+)/', PingPongConsumer.as_asgi()),
]