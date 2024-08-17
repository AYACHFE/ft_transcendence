from django.urls import path
from .views import RegisterView , LoginView, UserView, LogoutView, csrf_token_view, data_to_only_logged_users
urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()), 
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('csrf-token/', csrf_token_view, name='csrf-token'),
    path('log/', data_to_only_logged_users),
]
