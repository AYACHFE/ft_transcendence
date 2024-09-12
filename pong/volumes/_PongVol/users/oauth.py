

from rest_framework.response import Response
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.views import APIView
import requests
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .functions import gen_token




class oauth42(APIView):
    def get (self, request):
        code = request.GET.get("code")
        api42_token_url = "https://api.intra.42.fr/oauth/token"
        redirect_url = 'http://localhost:8080/api/42/callback/'

        response_token = requests.post(
            api42_token_url, data={
                'code': code,
                'client_id': 'u-s4t2ud-6f00f915a8502d3af9d46351766176e32619718d006f2088cc14307c7efbbb8e',
                'client_secret': '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',
                'redirect_uri': redirect_url,
                'grant_type': 'authorization_code'
            }
        )
        if response_token.status_code == 200:
            token = response_token.json()
            access_token = token.get('access_token')
            headers = {
                'Authorization': 'Bearer {}'.format(access_token)
            }
            
            user_info_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
            # return Response(headers)
            user_info = user_info_response.json()
            email = user_info.get('email')
            if not email:
                raise AuthenticationFailed("Failed to retrieve email from 42API")
            user_name = user_info.get('email', email).split('@')[0]
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': user_info.get('email', email),
                'name': user_name,
                'password': User.objects.make_random_password(),
            })

            if created:
                pass

            jwt_token = gen_token(user)

            response = HttpResponseRedirect('/dashboard')
            response.data = {
                "detail": "OAuth login successful"
            }
            response.set_cookie(key='jwt', value=jwt_token, httponly=True)

            return response
        else:
            return Response({'else': 'true','response': response.json()})
