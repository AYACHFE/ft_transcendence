# from rest_framework import authentication
# from rest_framework.exceptions import AuthenticationFailed
# from django.contrib.auth import get_user_model
# import jwt

# class JWTAuthentication(authentication.BaseAuthentication):
#     def authenticate(self, request):
#         token = request.headers.get('Authorization')
#         if not token:
#             return None

#         try:
#             payload = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
#             user = get_user_model().objects.get(id=payload['user_id'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Token has expired')
#         except jwt.InvalidTokenError:
#             raise AuthenticationFailed('Invalid token')
#         except get_user_model().DoesNotExist:
#             raise AuthenticationFailed('User not found')

#         return (user, token)