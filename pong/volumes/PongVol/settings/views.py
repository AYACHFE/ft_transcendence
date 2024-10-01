from django.conf import settings
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
    
from django.core.files.images import ImageFile 

class SettingsViewSet(viewsets.ViewSet):
    def create(self, request):
        user = request.user
        profileImg = request.FILES.get('profile-img')
        if profileImg:
            user = request.user
            # return Response({"1":user.avatar.url, "2":settings.DEFUALT_PROFILE_IMG_ROOT})
            if user.avatar and user.avatar.url != settings.DEFUALT_PROFILE_IMG_ROOT:
                user.avatar.delete(save=False)
            # toDelImg = user.avatar
            user.avatar = ImageFile(profileImg)
            # user.save()
            

        data = json.loads(request.POST.get('data'))
        new_username = data.get('user_name', None)
        new_firstname = data.get('first_name', None)
        new_lastname = data.get('last_name', None)



        if new_username and user.username != new_username:
            user.username = new_username
        if new_firstname and user.first_name != new_firstname:
            user.first_name = new_firstname
        if new_lastname and user.last_name != new_lastname:
            user.last_name = new_lastname
        

        user.save()

        serializer = UserSerializer(user)

        return Response(serializer.data)

    
        