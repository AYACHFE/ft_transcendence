from django.urls import path
from .views import RegisterView , LoginView, UserView, LogoutView, csrf_token_view, enable_otp, confirm_otp, change_pass, send_mail
from .oauth import oauth42
urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()), 
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('csrf-token/', csrf_token_view, name='csrf-token'),
    path("42/callback/", oauth42.as_view()),
    path("otp/qrcode/", enable_otp),
    path("otp/confirm", confirm_otp),
    path("change-pass/", change_pass),
    path("send-mail/", send_mail),

]
