from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'time']
    
    def create(self, validated_data):
        return Message.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     instance.sender = validated_data.get('sender', instance.sender)
    #     instance.receiver = validated_data.get('receiver', instance.receiver)
    #     instance.content = validated_data.get('content', instance.content)
    #     instance.time = validated_data.get('time', instance.time)
    #     instance.save()
    #     return instance
