import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.utils import timezone
from users.models import User


from django.db.models import Q

class GetLastMessage(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["url_route"]["kwargs"]["sender"]
        self.receiver = self.scope["url_route"]["kwargs"]["receiver"]
        self.room_group_name = f"chat_{self.sender}_{self.receiver}"
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.chat_message({})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

  
    async def chat_message(self, event):
        message = await self.get_message()
        if message:
            await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def get_message(self):
        message = Message.objects.filter(
            Q(sender=self.sender, receiver=self.receiver) | 
            Q(sender=self.receiver, receiver=self.sender)
        ).order_by('time').last()

        if message:
            return {
                "content": message.content, 
            }

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["url_route"]["kwargs"]["sender"]
        self.receiver = self.scope["url_route"]["kwargs"]["receiver"]
        self.room_group_name = f"chat_{self.sender}_{self.receiver}"
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        content = text_data_json["content"]
        sender_id = text_data_json["sender"]
        receiver_id = text_data_json["receiver"]

        await self.save_message(sender_id, receiver_id, content)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'content': content,
                'sender': sender_id,
                'receiver': receiver_id,
                'time': str(timezone.now()),
            }
        )

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        Message.objects.create(sender=sender, receiver=receiver, content=content, time=timezone.now())
    
    async def chat_message(self, event):
        message = await self.get_message()
        if message:
            await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def get_message(self):
        message = Message.objects.filter(
            Q(sender=self.sender, receiver=self.receiver) | 
            Q(sender=self.receiver, receiver=self.sender)
        ).order_by('time').last()

        if message:
            return {
                "content": message.content, 
                "sender": message.sender.id, 
                "receiver": message.receiver.id, 
                "time": str(message.time), 
            }