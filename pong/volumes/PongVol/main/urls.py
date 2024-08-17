
from django.urls import path
from .views import LoginView, HomeView, Mainview, GameView, DataView

urlpatterns = [
    path('login/', LoginView,name='login'),
    path('', Mainview,name='main'),
    path('home/', HomeView, name='home'),
    path('game/', GameView),
    path('main/data/', DataView)
]
