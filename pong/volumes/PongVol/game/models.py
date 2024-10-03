from django.db import models
from django.contrib.auth import get_user_model
from users.models import User

class GameResult(models.Model):
    winner_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner_user')
    loser_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loser_user')
    time = models.DateTimeField()
    winner_score = models.IntegerField()
    loser_score = models.IntegerField()

class Room(models.Model):

    room_id = models.CharField(max_length=255, unique=True)
    
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.room_id
