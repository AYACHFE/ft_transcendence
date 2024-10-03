from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
# from .models import GameResult
from django.contrib.auth import get_user_model
from datetime import timedelta
from .models import Room
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from .models import GameResult

def save_game_result(request):
    winner_username = request.POST['winner_username']
    loser_username = request.POST['loser_username']
    time = datetime.strptime(request.POST['time'], "%Y-%m-%dT%H:%M:%S.%fZ")  # assuming time is sent in ISO 8601 format
    winner_score = int(request.POST['winner_score'])
    loser_score = int(request.POST['loser_score'])

    try:
        winner_user = get_user_model().objects.get(username=winner_username)
        loser_user  = get_user_model().objects.get(username=loser_username)
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'failure', 'message': 'User does not exist'})

    game_result = GameResult(winner_user=winner_user, loser_user=loser_user, time=time, winner_score=winner_score, loser_score=loser_score)
    game_result.save()
    if(winner_user == request.user):
        request.user.user_wins += 1
        request.user.save()
    else:
        winner_user.user_wins += 1
        winner_user.save()

    return JsonResponse({'status': 'success'})


def check_room_exists(request, room_id):
    # Check if a room with the provided room_id exists in the database
    room_exists = Room.objects.filter(room_id=room_id).exists()
    
    # Return the result as a JSON response
    return JsonResponse({'exists': room_exists})
import json
def create_room(request):
    room_id = json.loads(request.body)['room_id']

    # Check if room already exists
    if Room.objects.filter(room_id=room_id).exists():
        return JsonResponse({'error': 'Room already exists'}, status=400)

    # Create new room
    new_room = Room.objects.create(room_id=room_id)
    return JsonResponse({'success': True, 'room_id': new_room.room_id})


def delete_room(request, room_id):
    try:
        room = Room.objects.get(room_id=room_id)
        room.delete()
        return JsonResponse({'success': True})
    except Room.DoesNotExist:
        return JsonResponse({'error': 'Room not found'})
