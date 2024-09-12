from django.db import models
from django.contrib.auth import get_user_model

class GameResult(models.Model):
    winner_id = models.ForeignKey(get_user_model(), related_name='wins', on_delete=models.CASCADE)
    loser_id = models.ForeignKey(get_user_model(), related_name='losses', on_delete=models.CASCADE)
    duration = models.DurationField()
    result = models.CharField(max_length=255)
