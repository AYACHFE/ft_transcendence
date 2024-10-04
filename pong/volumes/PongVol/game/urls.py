from django.urls import path
from .views import save_game_result
from .views import check_room_exists
from .views import create_room
from .views import delete_room
from .views import get_last_score


urlpatterns = [
    path('save_game_result/', save_game_result, name='save_game_result'),
    path('check-room/<str:room_id>/', check_room_exists, name='check_room_exists'),
	path('create-room/', create_room, name='create_room'),
    path('delete-room/<str:room_id>/', delete_room, name='delete_room'),
    path('get-last-score/', get_last_score, name='get_last_score'),
]
