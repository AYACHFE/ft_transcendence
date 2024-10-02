from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from users.models import User
from channels.db import database_sync_to_async
from http.cookies import SimpleCookie
import jwt
from django.conf import settings


class CustomTokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            headers = dict(scope['headers'])
            cookies = SimpleCookie()
            if b'cookie' in headers:
                cookies.load(headers[b'cookie'].decode())

            # Check for JWT cookie
            token = cookies.get('jwt')
            # print(f'token:', token.value)
            if(token.value):
                # print(f'entred1:')
                payload = jwt.decode(token.value, settings.JWT_SECRET, algorithms=['HS256'])
                # print(f'entred2:')
                uid = payload.get('id')
                # print(f'entred3:')
                # print(f'uid:', uid)
                # print(f'entred4:')
                user = await self.get_user(uid)
                scope['user'] = user
            else:
                scope['user'] = AnonymousUser()

        except Exception:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
        
    @database_sync_to_async
    def get_user(self, uid):
        return User.objects.get(id=uid)
