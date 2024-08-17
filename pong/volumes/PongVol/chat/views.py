from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
from .serializers import MessageSerializer
from rest_framework.response import Response

from users.serializers import UserSerializer
from users.models import User

from .models import Message



from rest_framework import viewsets

import json


# do it in nother way
from django.db.models import Q
class MessageViewSet(viewsets.ViewSet):
    def list(self, request):
        senderId = request.GET.get('myId', None)
        receiverId = request.GET.get('clickedId', None)

        if senderId and receiverId:
            messages = Message.objects.filter(
                Q(sender_id=senderId, receiver_id=receiverId) | 
                Q(sender_id=receiverId, receiver_id=senderId)
            )
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Missing senderId or receiverId"}, status=400)
    def create(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
