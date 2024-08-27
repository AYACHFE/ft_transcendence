from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import GameResult
from django.contrib.auth import get_user_model
from datetime import timedelta


from django.core.exceptions import ObjectDoesNotExist

@require_POST
@csrf_exempt
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