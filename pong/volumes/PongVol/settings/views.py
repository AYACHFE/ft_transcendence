from django.contrib.auth.decorators import login_required
from rest_framework.response import Response

from users.serializers import UserSerializer
from users.models import User


from django.http import JsonResponse

from rest_framework import viewsets
from rest_framework import status

import json
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from django.contrib.auth.hashers import check_password

class ChangepassViewSet(viewsets.ViewSet):
    def create(self, request):
        myid = request.data.get('myId', None)

        if myid:
            user = User.objects.filter(id=myid).first()
            if user:
                New_password = request.data.get('New_password', None)
                Current_password = request.data.get('Current_password', None)

                if not check_password(Current_password, user.password):
                    return JsonResponse({"error": "passwords don't match"}, status=status.HTTP_200_OK)
                if New_password and user.password != New_password:
                    user.set_password(New_password)
                    user.save()
                    

                serializer = UserSerializer(user)

                return JsonResponse({"Success": "change password success"}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse({"error": "Missing myid parameter"}, status=status.HTTP_400_BAD_REQUEST)
    
        

class SettingsViewSet(viewsets.ViewSet):
    def create(self, request):
        myid = request.data.get('myId', None)

        if myid:
            user = User.objects.filter(id=myid).first()

            if user:
                new_username = request.data.get('user_name', None)
                new_firstname = request.data.get('first_name', None)
                new_lastname = request.data.get('last_name', None)
                new_avatar = request.data.get('avatar', None)


                if new_avatar and new_avatar.startswith('data:'):
                    image_data = new_avatar.split(',')[1]
                    decoded_image = decode_base64(image_data)

                    with open(f'user_{user.id}_avatar.jpg', 'wb') as f:
                        f.write(decoded_image)
                else:
                    user.avatar = new_avatar


                if new_username and user.username != new_username:
                    user.username = new_username
                if new_firstname and user.first_name != new_firstname:
                    user.first_name = new_firstname
                if new_lastname and user.last_name != new_lastname:
                    user.last_name = new_lastname
                

                user.save()

                serializer = UserSerializer(user)

                return Response(serializer.data)
            else:
                return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse({"error": "Missing myid parameter"}, status=status.HTTP_400_BAD_REQUEST)
    
        