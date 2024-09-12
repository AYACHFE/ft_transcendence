from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True, default='default_name')
    last_seen = models.DateTimeField(null=True, blank=True)
    

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
    @property
    def is_online(self):
        if self.last_seen:
            return timezone.now()
        else:
            return False