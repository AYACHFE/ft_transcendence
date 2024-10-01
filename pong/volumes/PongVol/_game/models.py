from django.db import models
from django.contrib.auth import get_user_model

class GameResult(models.Model):
    winner_id = models.ForeignKey(get_user_model(), related_name='wins', on_delete=models.CASCADE)
    loser_id = models.ForeignKey(get_user_model(), related_name='losses', on_delete=models.CASCADE)
    duration = models.DurationField()
    winner_score = models.CharField(max_length=255)
    loser_score = models.CharField(max_length=255)

class Room(models.Model):

    room_id = models.CharField(max_length=255, unique=True)
    
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.room_id
