
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong.settings')
application = get_asgi_application()
import chat.routing
import game.routing
from .middlewares import CustomTokenAuthMiddleware
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": CustomTokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns + 
			game.routing.websocket_urlpatterns
        )
    ),
})