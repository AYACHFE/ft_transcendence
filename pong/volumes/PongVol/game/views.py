from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import GameResult
from django.contrib.auth import get_user_model
from datetime import timedelta

@csrf_exempt
def save_game_result(request):
    if request.method == 'POST':
        winner_id = request.POST['winner_id']
        loser_id = request.POST['loser_id']
        duration = timedelta(seconds=int(request.POST['duration']))
        result = request.POST['result']

        winner = get_user_model().objects.get(id=winner_id)
        loser = get_user_model().objects.get(id=loser_id)

        game_result = GameResult(winner=winner, loser=loser, duration=duration, result=result)
        game_result.save()

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'failed', 'error': 'Invalid request method'})
