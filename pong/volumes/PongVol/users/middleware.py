from typing import Any
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser

User = get_user_model()
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_anonymous:
            token = request.COOKIES.get('jwt')
            if token:
                try:
                    payload = jwt.decode(token, 'secret', algorithms=['HS256'])
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