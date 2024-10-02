from django.db import models
from django.contrib.auth import get_user_model

class GameResult(models.Model):
    winner_username = models.CharField(max_length=255)
    loser_username = models.CharField(max_length=255)
    time = models.DateTimeField()
    winner_score = models.IntegerField()
    loser_score = models.IntegerField()

class Room(models.Model):

    room_id = models.CharField(max_length=255, unique=True)
    
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.room_id
