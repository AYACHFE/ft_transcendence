from typing import Any
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from .models import TokensCustom
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.conf import settings

User = get_user_model()
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_anonymous:
            # raise Exception("pffffff")
            token = request.COOKIES.get('jwt')
            if token:
                try:
                    tok = TokensCustom.objects.filter(token = token).first()
                    
                    if not tok or not tok.is_valid():
                        raise jwt.ExpiredSignatureError
                    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
                    user_id = payload.get('id')
                    user = User.objects.get(id=user_id)
                    request.user = user
                except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
                    request.user = AnonymousUser()
            else:
                request.user = AnonymousUser()

from django.utils import timezone

class UpdateLastSeenMiddleware:
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            request.user.last_seen = timezone.now()
            request.user.save()
        return response


# from channels.middleware import BaseMiddleware
# from channels.db import database_sync_to_async
# from .models import User
# import jwt
# from django.conf import settings
# from django.contrib.auth.models import AnonymousUser


# class CustomChannelsMiddleware(BaseMiddleware):

#     @database_sync_to_async
#     def populate_scope(self, scope):
#         # Get the session key from the scope
#         session_key = scope['cookies'].get('jwt')
#         # uid = jwt.decode( algorithms=['HS256'])
#         payload = jwt.decode(session_key, settings.JWT_SECRET, algorithms=['HS256'])
#         uid = payload.get('id')
#         # Use the session key to get the user from the database
        
#         user = User.objects.filter(id=uid)
#         if user.exists():
#             user = user.first()
#         else:
#             user = AnonymousUser

#         # Add the user to the scope
#         scope['user'] = user