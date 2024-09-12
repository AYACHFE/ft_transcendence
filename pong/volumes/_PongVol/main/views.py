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
    uid = None
    email = None
    if request.user.is_authenticated:
        uid = request.user.id
        email = request.user.email
        user_name = request.user.name
        online_users = User.objects.filter(last_seen__gte=timezone.now() - timezone.timedelta(minutes=5))
        online_users_serializer = UserSerializer(online_users, many=True)

    data = JsonResponse({
        'message':'message from DataView',
        'user_name': user_name,
        'id': uid,
        'email': email,
        'online_users':online_users_serializer.data
    })
    return data
