from http.client import ImproperConnectionState
import random
from re import U
import string
from turtle import goto
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.conf import settings
from users.functions import gen_token


from django.http import JsonResponse
from rest_framework.decorators import api_view

from users.models import User
from django.http import HttpResponseRedirect
# Create your views here.


def home (request):
    return render(request, 'home.html')
def logout_view(request):
    logout(request)
    return redirect('/')
# from your_jwt_library import generate_jwt  # Replace with your actual JWT generation method
import jwt, requests


@api_view(['GET'])
def google_auth(request):
    code = request.GET.get('code')
    google_token_url = 'https://oauth2.googleapis.com/token'
    redirect_uri = 'http://localhost:8080/accounts/google/login/callback/'

    # return JsonResponse({"test":code})

    # Exchange code for tokens
    response = requests.post(google_token_url, data={
        'code': code,
        'client_id':settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    })

    # return JsonResponse(response.json())

    if response.status_code == 200:
        tokens = response.json()
        access_token = tokens.get('access_token')

        # Use the access token to get user info
        user_info_response = requests.get('https://www.googleapis.com/oauth2/v1/userinfo', params={
            'access_token': access_token
        })
        user_info = user_info_response.json()

        # Here, you would authenticate the user, and create a JWT token for them
        jwt_token = 'jwt.encode(user_info)'

        return JsonResponse(user_info)
        # return JsonResponse({'token': jwt_token})
    else:
        return JsonResponse({'error': 'Failed to authenticate with Google'}, status=400)




@api_view(['GET'])
def google_dauth(request):
    code = request.GET.get('code')
    google_token_url = 'https://oauth2.googleapis.com/token'
    redirect_uri = 'http://localhost:8080/accounts/google/login/callback/'

    # Exchange code for tokens
    response = requests.post(google_token_url, data={
        'code': code,
        'client_id':settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    })

    if response.status_code == 200:
        tokens = response.json()
        access_token = tokens.get('access_token')

        # Use the access token to get user info
        user_info_response = requests.get('https://www.googleapis.com/oauth2/v1/userinfo', params={
            'access_token': access_token
        })
        user_info = user_info_response.json()

        # Find or create the user in the database
        email = user_info.get('email')
        if not email:
            return JsonResponse({'error': 'Failed to retrieve email from Google'}, status=400)
        
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email,
        })
        
        if created:
            user.set_password(User.objects.make_random_password())
            mail_cut = user_info.get('email', email).split('@')[0]
            user_name = mail_cut + "_" + ''.join(random.choices(string.digits, k=4))
            for i in range(3):
                if User.objects.filter(username = user_name).count() == 0:
                    break
                user_name = mail_cut + "_" + ''.join(random.choices(string.digits, k=4))

            user.username = user_name
            user.save()

        # Generate a JWT token for the user
        jwt_token = gen_token(user)

        # Return the JWT token in the response
        response =  HttpResponseRedirect('/dashboard')
        response.set_cookie(key='jwt', value=jwt_token, httponly=True)
        return response
    else:
        return HttpResponseRedirect('/login')