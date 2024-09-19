from django.shortcuts import render, redirect
from django.http.response import JsonResponse
from django.template.loader import render_to_string
from users.models import User
from django.utils import timezone
from users.serializers import UserSerializer
# Create your views here.


def Mainview(request):
    # return JsonResponse({"ret":request.user.is_anonymous})
    if not request.user.is_anonymous:
        user = request.user.name
    else:
        return redirect('login')
    return render(request, 'index.html', {'name':user})

def HomeView(request):
    string = render_to_string('sections/home.html')
    css = 'static/css/home.css'
    js = ''
    return JsonResponse({'content':string, 'css':css, 'js':js})

def LoginView(request):
    if request.user.is_authenticated:
        return redirect('main')
    return render(request, 'login.html')

def GameView(request):
    string = render_to_string('sections/game.html')
    css = 'static/css/game.css'
    js = 'static/js/game.js'
    return JsonResponse({'content':string, 'css': css, 'js': js})

def DataView(request):
    user_name = None
    username = None
    first_name = None
    last_name = None
    uid = None
    email = None
    if request.user.is_authenticated:
        uid = request.user.id
        email = request.user.email
        user_name = request.user.name
        first_name = request.user.first_name
        last_name = request.user.last_name
        username = request.user.username
    data = JsonResponse({
        'message':'message from DataView',
        'user_name': user_name,
        'id': uid,
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
        'username': username,
    })
    return data
