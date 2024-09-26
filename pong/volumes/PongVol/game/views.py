from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import GameResult
from django.contrib.auth import get_user_model
from datetime import timedelta
from .models import Room


from django.core.exceptions import ObjectDoesNotExist


def save_game_result(request):
    winner_id = request.POST['winner_id']
    loser_id = request.POST['loser_id']
    duration = timedelta(seconds=int(request.POST['duration']))
    result = request.POST['result']

    try:
        winner = get_user_model().objects.get(id=winner_id)
        loser = get_user_model().objects.get(id=loser_id)
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'failure', 'message': 'User does not exist'})

    game_result = GameResult(winner=winner, loser=loser, duration=duration, result=result)
    game_result.save()

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
        return JsonResponse({'error': 'Room not found'}, status=404)
