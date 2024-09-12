from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True, default='default_name')
    last_seen = models.DateTimeField(null=True, blank=True)
    twoFA = models.BooleanField(default=False)
    
    

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

class TokensCustom(models.Model):
    token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


    def is_valid(self):
        if timezone.now() < self.expires_at:
            return True
        self.delete()
        return False
    
    def save(self, *args, **kwargs):    
        if self.pk is None and TokensCustom.objects.filter(user_id = self.user_id).count() >= 3:
            TokensCustom.objects.filter(user_id = self.user_id).first().delete()
        super().save(*args,**kwargs)

    @staticmethod
    def delete_expired_tokens(user):
        TokensCustom.objects.filter(expires_at__lt = timezone.now() , user_id = user).delete()

import random
import string
class verification_code(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            verification_code.objects.filter(email = self.email).delete()
        super().save(*args, **kwargs)


    def is_valid(self):
        return self.created_at >= timezone.now() - timedelta(minutes=10)
    
